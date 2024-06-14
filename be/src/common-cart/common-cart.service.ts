import { Injectable } from '@nestjs/common';
import { Material } from '../materials/materials.entity';
import { UsersService } from '../users/usersService/users.service';

@Injectable()
export class CommonCartService {
  constructor(private userService: UsersService) {}
  async removeItem(id: string, materialId: string): Promise<Material[]> {
    const user = await this.userService.findOneById(id);
    const materials = user.consumer.cart.materials.filter(
      (material) => material.id !== materialId,
    );
    user.consumer.cart.materials = materials;
    this.userService.update(user);
    return materials;
  }
}
