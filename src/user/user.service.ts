const crypto = require('crypto');
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { AuthToken } from './interfaces/Token';
import { ServiceError } from '../common/interfaces/ServiceError';
import { UserErrorCodes } from '../common/Errors';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<AuthToken | Error> {
    const user = await this.userModel
      .findOne({
        username,
        password: crypto.createHash('sha256').update(password).digest('hex'),
      })
      .exec();
    console.log('user.service>login>user:', user);

    if (!user) {
      return new ServiceError(UserErrorCodes.NotFound);
    }

    const access_token = String(user._id);
    const refresh_token = crypto
      .createHash('sha256')
      .update(access_token + String(Math.random() * Date.now()))
      .digest('hex');

    return {
      access_token,
      refresh_token
    };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(new User(createUserDto));
    const ret = await createdUser.save();
    console.log('user.service>created>ret:', ret);
    return ret;
  }

  async findAll({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<[User[], number]> {
    console.log('user.service>findAll>query:', arguments);
    const ret = await this.userModel
      .find()
      .sort({ createdAt: 1 })
      .skip((page - 1) * size)
      .limit(size)
    const count = await this.userModel.count();
    console.log('user.service>findAll>count:', count);
    return [ret, count];
  }

  async findOne(id: string): Promise<User> {
    console.log('user.service>findOne>id:\n', id);
    const ret = this.userModel.findOne({ _id: id }).exec();
    console.log('user.service>findOne>ret:', ret);
    return ret;
  }
}
