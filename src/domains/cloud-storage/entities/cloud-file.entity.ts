import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { ObjectId, Document } from 'mongoose';

export type CloudFileDocument = CloudFile & Document;

@Schema()
export class CloudFile {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  filename: string;

  @Prop()
  url: string;

  @Prop()
  mimetype: string;

  @Prop()
  key: string;
}

export const CloudFileSchema = SchemaFactory.createForClass(CloudFile);
