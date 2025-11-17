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

  async findById(id: string) {
    return this.userModel.findById(id).lean().exec();
  }

  async create(userData: {
    username: string;
    email: string;
    password: string;
    name?: string;
    totalDonated?: number;
    goal?: number;
  }) {
    const existingUser = await this.userModel.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });
    
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const newUser = new this.userModel({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      name: userData.name || userData.username,
      totalDonated: userData.totalDonated || 0,
      goal: userData.goal || 0,
    });

    const saved = await newUser.save();
    const { password: _p, ...userWithoutPassword } = saved.toObject();
    return userWithoutPassword;
  }

  async incrementTotalDonated(id: string, amount: number) {
    // Increment only totalDonated now that familiesHelped was removed.
    const updated = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $inc: { totalDonated: amount },
        },
        { new: true },
      )
      .lean()
      .exec();

    return updated;
  }
}
