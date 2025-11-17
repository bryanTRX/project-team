import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class DonationsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  private readonly logger = new Logger(DonationsService.name);

  async recordDonation(
    identifier: { username?: string; email?: string },
    amount: number,
    lang?: string,
  ) {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new BadRequestException(
        'Donation amount must be greater than zero',
      );
    }

    const query = identifier.username
      ? { username: identifier.username }
      : { email: identifier.email };
    if (!query.username && !query.email) {
      throw new BadRequestException('Missing donation identifier');
    }

    const user = await this.userModel.findOne(query).lean().exec();
    if (!user) throw new NotFoundException('User not found');

    const currentLives = Math.floor(Number(user.lives_touched) || 0);
    const moduloValue = Math.floor(numericAmount) % 100;
    const randomIncrement = Math.floor(Math.random() * 10) + 1;
    const livesIncrement = moduloValue + randomIncrement;
    const newLives = currentLives + livesIncrement;

    this.logger.log(
      `Recording donation via /donations for ${user._id}: amount=${numericAmount}, livesIncrement=${livesIncrement}`,
    );

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        user._id,
        {
          $inc: { totalDonated: numericAmount },
          $set: { lives_touched: newLives },
        },
        { new: true },
      )
      .lean()
      .exec();

    const sanitizedUser = this.sanitizeUser(updatedUser ?? user);

    // send email and capture preview URL (demo)
    let emailResult: any = null;
    try {
      emailResult = await this.mailService.sendDonationReceipt(
        sanitizedUser.email,
        sanitizedUser.name || sanitizedUser.username,
        numericAmount,
        sanitizedUser.totalDonated,
        sanitizedUser.lives_touched,
        lang,
      );
      if (emailResult && emailResult.previewUrl) {
        this.logger.log(`Donation email preview: ${emailResult.previewUrl}`);
      } else {
        this.logger.log(
          'Donation email sent but no preview URL available (non-ethereal SMTP or preview not returned)',
        );
      }
    } catch (err) {
      // don't fail the request if email sending fails in demo
      this.logger.error('Failed to send donation email', err as any);
    }

    return { user: sanitizedUser, emailResult };
  }

  private sanitizeUser(doc: any) {
    if (!doc) {
      return null;
    }
    const obj =
      typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
    if (obj?.password) {
      delete obj.password;
    }
    return obj;
  }
}
