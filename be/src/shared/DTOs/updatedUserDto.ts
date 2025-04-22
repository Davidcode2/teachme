import { PartialType } from '@nestjs/mapped-types';
import { User } from '../../users/user.entity';

export class UpdateUserDto extends PartialType(User) {}
