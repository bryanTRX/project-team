import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).lean().exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean().exec();
  }
}
