import { Injectable, NotFoundException, Logger } from '@nestjs/common';
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

  async recordDonation(identifier: { username?: string; email?: string }, amount: number, lang?: string) {
    const query = identifier.username ? { username: identifier.username } : { email: identifier.email };
    const user = await this.userModel.findOne(query).exec();
    if (!user) throw new NotFoundException('User not found');

  user.totalDonated = (user.totalDonated || 0) + amount;
  user.familiesHelped = (user.familiesHelped || 0) + Math.floor(amount / 100);
  await user.save();

    // send email and capture preview URL (demo)
    let emailResult: any = null;
    try {
      emailResult = await this.mailService.sendDonationReceipt(
        user.email,
        user.name || user.username,
        amount,
        user.totalDonated,
        user.familiesHelped,
        lang,
      );
      if (emailResult && emailResult.previewUrl) {
        this.logger.log(`Donation email preview: ${emailResult.previewUrl}`);
      } else {
        this.logger.log('Donation email sent but no preview URL available (non-ethereal SMTP or preview not returned)');
      }
    } catch (err) {
      // don't fail the request if email sending fails in demo
      this.logger.error('Failed to send donation email', err as any);
    }

    return { user, emailResult };
  }
}
