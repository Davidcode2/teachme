import { Module } from '@nestjs/common';
import { CommonCartService } from './common-cart.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [CommonCartService],
  exports: [CommonCartService],
})
export class CommonCartModule {}
