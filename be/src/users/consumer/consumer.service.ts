import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Consumer } from '../consumer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConsumerService {
  constructor(
    @InjectRepository(Consumer)
    private consumersRepository: Repository<Consumer>) {}

    findAll(): Promise<Consumer[]> {
      return this.consumersRepository.find();
    }
}
