import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { TransformIntQuery } from '../common/transform/query.transform';
import { Resp } from '../common/interfaces/Resp';
import { AuthToken } from './interfaces/Token';
import { ServiceError } from '../common/interfaces/ServiceError';
import { UserErrorCodes, UserErrorMessages } from '../common/Errors';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body() { username, password }: { username: string; password: string },
    @Res() res,
  ): Promise<Resp<AuthToken | ServiceError>> {
    console.log('user.controller>login>args:\n', { username, password });
    const data = await this.userService.login({ username, password });
    console.log('user.controller>login>data:\n', data);

    if (data instanceof ServiceError) {
      return res.json({
        code: data.code,
        message: UserErrorMessages[UserErrorCodes[data.code]]
      })
    }

    return res.json({
      code: 0,
      data
    });
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res,
  ): Promise<Resp<User>> {
    console.log('user.controller>create>user>createUserDto:\n', createUserDto);
    const data = await this.userService.create(createUserDto);
    console.log('user.controller>create>data:\n', data);
    return res.json({
      code: 0,
      data,
    });
  }

  @Get()
  async findAll(
    @Query(new TransformIntQuery()) query,
    @Res() res,
  ): Promise<Resp<User[]>> {
    console.log('user.controller>findAll>query:\n', query);
    const ret = await this.userService.findAll(query);
    console.log('user.controller>findAll>ret:\n', ret);

    return res.json({
      code: 0,
      data: ret[0],
      total: ret[1],
      page: query.page,
      size: query.size,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res): Promise<User> {
    console.log('user.controller>findOne>id:\n', id);
    const data = await this.userService.findOne(id);
    console.log('user.controller>findOne>data:\n', data);
    return res.json({
      code: 0,
      data,
    });
  }
}
