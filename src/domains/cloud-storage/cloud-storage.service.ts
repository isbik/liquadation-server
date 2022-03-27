import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as S3 from 'aws-sdk/clients/s3';
import { CloudFile, CloudFileDocument } from './entities/cloud-file.entity';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

@Injectable()
export class CloudStorageService {
  constructor(
    @InjectModel(CloudFile.name)
    private cloudFileModel: Model<CloudFileDocument>,
  ) {}

  private readonly s3 = new S3({
    accessKeyId: process.env.CLOUD_ACCESS_KEY,
    secretAccessKey: process.env.CLOUD_SECRET_KEY,
    endpoint: 'https://s3.storage.selcloud.ru',
    s3ForcePathStyle: true,
    region: 'ru-1',
    apiVersion: 'latest',
  });

  async createFile(file, data) {
    return this.cloudFileModel.create({
      mimetype: file.mimetype,
      url:
        'https://api.selcdn.ru/v1/SEL_207085/' + data.Bucket + '/' + data.Key,
      filename: file.originalname,
      key: data.Key,
    });
  }

  uploadImage(file: Express.Multer.File): Promise<CloudFile> {
    return new Promise((resolve, reject) => {
      if (!IMAGE_TYPES.includes(file.mimetype)) {
        reject('Неверное расширение изображение');
      }

      const params = {
        Bucket: 'liquadation',
        Key: uuidv4() + '_' + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      this.s3.upload(params, async (err, data) => {
        if (err) reject(err);
        else {
          try {
            const cloudStorageFile = await this.createFile(file, data);
            resolve(cloudStorageFile);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }

  uploadFile(file: Express.Multer.File) {
    console.log('file: ', file.mimetype);
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: 'liquadation',
        Key: uuidv4() + '_' + file.originalname,
        Body: file.buffer,
      };

      this.s3.upload(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  deleteFile(key: string) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: 'liquadation',
        Key: key
      };

      this.s3.deleteObject(params, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }
}
