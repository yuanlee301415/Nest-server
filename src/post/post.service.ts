import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { ServiceError } from '../common/interfaces/ServiceError';
import { PostErrorCodes } from '../common/Errors';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel({...new Post(createPostDto), createdAt: new Date()});
    console.log('post.service>createdPost:', createdPost);
    const ret = await createdPost.save();
    console.log('post.service>created>ret:', ret);
    return ret;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | ServiceError> {
    const ret = await this.postModel.findOneAndUpdate({_id: id}, {...new Post(updatePostDto), updatedAt: new Date()}, { new: true });
    console.log('post.service>update>ret:', ret);
    if (!ret) {
      return new ServiceError(PostErrorCodes.NotFound);
    }
    return ret
  }

  async findAll({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<[Post[], number]> {
    console.log('post.service>findAll>query:', arguments);
    const ret = await this.postModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .exec();
    const count = await this.postModel.count().estimatedDocumentCount().exec();
    console.log('post.service>findAll>count:', count);
    return [ret, count];
  }

  async findOne(id: string): Promise<Post> {
    console.log('post.service>findOne>id:\n', id);
    const ret = await this.postModel.findOne({ _id: id }).exec();
    console.log('post.service>findOne>ret:', ret);
    return ret;
  }
}
