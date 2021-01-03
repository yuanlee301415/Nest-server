const pkg = require('../package.json');
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello [${pkg.name}]! - ${new Date()}`;
  }
}
