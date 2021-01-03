import { MinLength, MaxLength, IsMongoId } from 'class-validator';

export class CreateUserDto {
  @MinLength(5)
  @MaxLength(10)
  readonly username: string;

  @MinLength(6)
  @MaxLength(20)
  readonly password: string;
}
