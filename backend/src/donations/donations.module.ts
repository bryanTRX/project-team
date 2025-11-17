import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { MailService } from '../mail/mail.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [DonationsController],
  providers: [DonationsService, MailService],
  exports: [DonationsService],
})
export class DonationsModule {}
