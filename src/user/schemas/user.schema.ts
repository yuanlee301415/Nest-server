const crypto = require('crypto');
import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';

@Schema()
export class User {
  @Prop({
    type: String,
    required: true
  })
  username: string;

  @Prop({
    type: String,
    required: true
  })
  password: string;

  @Prop({
    type: Date
  })
  createdAt: Date;

  @Prop({
    type: Date
  })
  updatedAt: Date;

  _id?: string

  constructor(user: CreateUserDto) {
    const RE = /^\D[a-zA-Z0-9]{4,10}$/;
    if (!RE.test(user.username)) {
      throw new BadRequestException(
        `[User.username failed]:: 用户名只支持: 非数字开头，5-10字母、数字`,
      );
    }

    this.username = user.username;
    this.password = crypto
      .createHash('sha256')
      .update(user.password)
      .digest('hex');
    this.createdAt = new Date();
    this.updatedAt = null;
  }
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
