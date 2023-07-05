import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Avatar extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  hash: string;

  @Prop({ required: true })
  data: string;
}

export interface Avatar extends Document {
  userId: User;
  hash: string;
  data: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
