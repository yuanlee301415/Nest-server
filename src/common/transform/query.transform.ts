import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

type Query = {
  page: string | number;
  size: string | number;
  [key: string]: any;
};

@Injectable()
export class TransformIntQuery implements PipeTransform {
  CONFIG = {
    page: [1, Infinity],
    size: [1, 100],
  };
  constructor(public fields: string[] = ['page', 'size']) {
    // console.log('TransformIntQuery>fields:\n', this.fields);
  }

  transform(query: Query, metadata: ArgumentMetadata): Query {
    // console.log('TransformIntQuery>query:\n', query);
    const res = {
      page: 1,
      size: 20,
    };
    this.fields.forEach((field) => {
      if (this.CONFIG[field] && query[field]) {
        const num = Number(query[field]);
        if (isNaN(num)) {
          throw new BadRequestException(
            `[Validation failed]:: ${field}:${query[field]}`,
          );
        }
        const range = this.CONFIG[field];
        if (num < range[0] || num > range[1]) {
          throw new BadRequestException(
            `[Validation failed]:: ${field}:${query[field]}`,
          );
        }
        res[field] = num;
      }
    });
    // console.log('TransformIntQuery>res:\n', res)
    return res;
  }
}
