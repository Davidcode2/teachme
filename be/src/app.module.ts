import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaterialsController } from './materials/materials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { UsersService } from './users/usersService/users.service';

@Module({
  imports: [
      TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
      UsersModule,
  ],
  controllers: [AppController, MaterialsController],
  providers: [AppService, UsersService],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
