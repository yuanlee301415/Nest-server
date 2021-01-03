import {
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as POST } from './schemas/post.schema';
import { TransformIntQuery } from '../common/transform/query.transform';
import { Resp } from '../common/interfaces/Resp';
import { ServiceError } from '../common/interfaces/ServiceError';
import { PostErrorCodes, PostErrorMessages } from '../common/Errors';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Res() res,
  ): Promise<Resp<POST>> {
    console.log('post.controller>create>post>createPostDto:\n', createPostDto);
    const data = await this.postService.create(new POST(createPostDto));
    console.log('post.controller>create>post>data:\n', data);
    return res.json({
      code: 0,
      data
    });
  }

  @Put(':id')
  async update(
    @Param('id') id,
    @Body() updatePostDto: UpdatePostDto,
    @Res() res,
  ): Promise<Resp<POST | ServiceError>> {
    // console.log('post.controller>update>post>updatePostDto:\n', updatePostDto);
    const data = await this.postService.update(id, updatePostDto)
    console.log('post.controller>update>post>data:\n', data);
    if (data instanceof ServiceError) {
      return res.json({
        code: data.code,
        message: PostErrorMessages[PostErrorCodes[data.code]]
      })
    }

    return res.json({
      code: 0,
      data
    })
  }

  @Get()
  async findAll(
    @Query(new TransformIntQuery()) query,
    @Res() res,
  ): Promise<[POST[], number]> {
    console.log('post.controller>findAll>query:\n', query);
    const ret = await this.postService.findAll(query);
    return res.json({
      code: 0,
      data: await ret[0],
      total: await ret[1],
      page: query.page,
      size: query.size,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res): Promise<POST> {
    console.log('post.controller>findOne>id:\n', id);
    const data = await this.postService.findOne(id);
    console.log('post.controller>findOne>data:\n', data);
    return res.json({
      code: 0,
      data,
    });
  }
}
