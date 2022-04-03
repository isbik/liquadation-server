import { EntityRepository, Loaded } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { CloudFile } from './entities/cloud-file.entity';

@Injectable()
export class CloudStorageService {
  constructor(
    @InjectRepository(CloudFile)
    private readonly cloudFileRepository: EntityRepository<CloudFile>,
  ) {}

  private readonly s3 = new S3({
    accessKeyId: process.env.CLOUD_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_SECRET_KEY,
    endpoint: 'https://s3.storage.selcloud.ru',
    s3ForcePathStyle: true,
    region: 'ru-1',
    apiVersion: 'latest',
  });

  private getFileParams(file: Express.Multer.File) {
    return {
      Bucket: 'liquadation',
      Key: uuidv4() + '_' + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  }

  async createFile(file, data, user: User) {
    const cloudFile = this.cloudFileRepository.create({
      mimetype: file.mimetype,
      url:
        'https://api.selcdn.ru/v1/SEL_207085/' + data.Bucket + '/' + data.Key,
      filename: file.originalname,
      key: data.Key,
      owner: user,
    });

    await this.cloudFileRepository.persistAndFlush(cloudFile);

    return cloudFile;
  }

  uploadImage(file: Express.Multer.File, user: User): Promise<CloudFile> {
    return new Promise((resolve, reject) => {
      this.s3.upload(this.getFileParams(file), async (err, data) => {
        if (err) reject(err);
        else {
          try {
            const cloudStorageFile = this.createFile(file, data, user);
            resolve(cloudStorageFile);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }

  uploadFile(file: Express.Multer.File, user: User): Promise<CloudFile> {
    return new Promise((resolve, reject) => {
      this.s3.upload(this.getFileParams(file), async (err, data) => {
        if (err) reject(err);
        else {
          try {
            const cloudStorageFile = this.createFile(file, data, user);
            resolve(cloudStorageFile);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }

  deleteFile(key: string) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: 'liquadation',
        Key: key,
      };

      this.s3.deleteObject(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  async findById(id: number) {
    try {
      const file = await this.cloudFileRepository.findOneOrFail({ id });
      return file;
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  async findByIds(ids: number[]): Promise<Loaded<CloudFile, never>[]> {
    try {
      const files = await this.cloudFileRepository.find({
        id: ids,
      });
      return files;
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteById(id: number) {
    try {
      const file = await this.cloudFileRepository.findOne({ id });
      await this.cloudFileRepository.nativeDelete(file.id);
      await this.deleteFile(file.key);
      return file;
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }
}
