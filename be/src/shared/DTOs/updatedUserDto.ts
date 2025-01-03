import { PartialType } from '@nestjs/mapped-types';
import { User } from 'src/users/user.entity';

export class UpdateUserDto extends PartialType(User) {}
