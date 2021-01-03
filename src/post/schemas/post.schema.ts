import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { BadRequestException } from '@nestjs/common';

@Schema()
export class Post {
  _id?: string

  @Prop({
    type: String,
    required: true
  })
  title: string;

  @Prop({
    type: String,
    required: true
  })
  content: string;

  @Prop({
    type: String,
    required: true
  })
  desc: string;

  @Prop({
    type: Number,
    required: true
  })
  vote: number;

  @Prop({
    type: [String],
    required: true
  })
  keywords: string[];

  @Prop({
    type: Date
  })
  createdAt?: Date;

  @Prop({
    type: Date
  })
  updatedAt?: Date;

  constructor(post: CreatePostDto | UpdatePostDto) {
    if (post.title.trim().length === 0) {
      throw new BadRequestException(`[Post.title failed]:: 非空`);
    }

    if (post.desc.trim().length === 0) {
      throw new BadRequestException(`[Post.desc failed]:: 非空`);
    }

    if (post.content.trim().length === 0) {
      throw new BadRequestException(`[Post.content failed]:: 非空`);
    }

    this.title = post.title.trim();
    this.desc = post.desc;
    this.content = post.content;
    this.vote = 0;
    this.keywords = post.keywords;
  }
}

export type PostDocument = Post & Document;

export const PostSchema = SchemaFactory.createForClass(Post);
// console.log(PostSchema)
