import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(50)
  readonly title: string;

  @IsNotEmpty()
  @MaxLength(2 ** 10)
  readonly desc: string;

  @IsNotEmpty()
  @MaxLength(2 ** 16)
  readonly content: string;

  readonly keywords?: string[]
}
