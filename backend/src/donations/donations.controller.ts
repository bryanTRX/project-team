import { Body, Controller, Post } from '@nestjs/common';
import { DonationsService } from './donations.service';

class RecordDonationDto {
  username?: string;
  email?: string;
  amount: number;
  lang?: string; // optional language code (e.g. 'en', 'fr')
}

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  async record(@Body() dto: RecordDonationDto) {
    const identifier = dto.username
      ? { username: dto.username }
      : { email: dto.email };
    const result = await this.donationsService.recordDonation(
      identifier,
      dto.amount,
      dto.lang,
    );
    // return updated user and any email preview info (demo)
    return {
      user: result.user,
      // top-level convenience field so frontend can easily show the preview link
      emailPreviewUrl: result.emailResult?.previewUrl ?? null,
      // include the raw emailResult for additional debugging if needed
      emailResult: result.emailResult ?? null,
    };
  }
}
