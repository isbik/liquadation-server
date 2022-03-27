import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';
import {
  CloudFile,
  CloudFileSchema,
} from 'src/domains/cloud-storage/entities/cloud-file.entity';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop()
  name: string;

  @Prop({ type: CloudFileSchema })
  @Type(() => CloudFile)
  image: CloudFile;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: () => Category })
  parentCategory: ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
