import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type ContactApplicationDocument = ContactApplication & Document;

@Schema()
export class ContactApplication {
  @Prop()
  email: string;

  @Prop()
  phone: number;

  @Prop()
  fio: string;

  @Prop()
  comment: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const ContactApplicationSchema =
  SchemaFactory.createForClass(ContactApplication);
