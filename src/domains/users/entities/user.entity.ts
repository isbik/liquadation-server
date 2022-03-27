import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  organizationName: string;

  @Prop()
  INN: number;

  @Prop()
  ORGN: string;

  @Prop()
  city: string;

  @Prop()
  factAddress: string;

  @Prop()
  legalAddress: string;

  @Prop()
  postalCode: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  fio: string;

  @Prop()
  position: string;

  @Prop()
  directorPhone: string;

  @Prop()
  directorEmail: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
