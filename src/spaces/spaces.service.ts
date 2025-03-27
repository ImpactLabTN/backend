import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Space, SpaceDocument } from './space.schema';

@Injectable()
export class SpacesService {
  constructor(
    @InjectModel(Space.name) private spaceModel: Model<SpaceDocument>,
  ) {}

  async findAll(): Promise<Space[]> {
    return this.spaceModel.find().exec();
  }

  async create(
    name: string,
    description: string,
    price: number,
  ): Promise<Space> {
    const newSpace = new this.spaceModel({ name, description, price });
    return newSpace.save();
  }
}
