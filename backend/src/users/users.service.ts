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
    familiesHelped?: number;
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
      familiesHelped: userData.familiesHelped || 0,
      goal: userData.goal || 0,
    });

    const saved = await newUser.save();
    const { password: _p, ...userWithoutPassword } = saved.toObject();
    return userWithoutPassword;
  }

  async incrementTotalDonated(id: string, amount: number) {
    // First, get the current user to calculate the new familiesHelped value
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) {
      return null;
    }

    const currentFamiliesHelped = user.familiesHelped || 0;

    // Calculate lives touched increment: use modulo of amount + random value
    // Modulo gives us a value between 0 and (amount-1), then we add some randomness
    const moduloValue = Math.floor(amount) % 100; // Modulo by 100 to get 0-99 range
    const randomIncrement = Math.floor(Math.random() * 10) + 1; // Random between 1-10
    const livesIncrement = moduloValue + randomIncrement;

    const newFamiliesHelped =
      Math.floor(currentFamiliesHelped) + livesIncrement;

    console.log(
      `Donation: $${amount}, Modulo: ${moduloValue}, Random: ${randomIncrement}, Lives increment: ${livesIncrement}, New total: ${newFamiliesHelped}`,
    );

    const updated = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $inc: { totalDonated: amount },
          $set: { familiesHelped: newFamiliesHelped },
        },
        { new: true },
      )
      .lean()
      .exec();

    return updated;
  }
}
