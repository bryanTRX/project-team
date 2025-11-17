import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name?: string;

  @Prop()

  @Prop({ default: 0 })
  totalDonated?: number;

  @Prop({ default: 0 })
  familiesHelped?: number;

  

  @Prop({ default: 0 })
  goal?: number;

}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
