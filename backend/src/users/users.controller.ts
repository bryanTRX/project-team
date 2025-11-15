import { Body, Controller, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

interface DonationPayload {
  amount: number;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':id/donations')
  async recordDonation(@Param('id') id: string, @Body() body: DonationPayload) {
    const amount = Number(body?.amount);
    if (!id) {
      throw new HttpException('User id is required', HttpStatus.BAD_REQUEST);
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new HttpException('Donation amount must be greater than zero', HttpStatus.BAD_REQUEST);
    }

    const updated = await this.usersService.incrementTotalDonated(id, amount);
    if (!updated) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { password, ...profile } = updated as any;
    return profile;
  }
}
