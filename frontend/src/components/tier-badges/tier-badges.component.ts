import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

export interface TierBadge {
  tier: string;
  name: string;
  subtitle: string;
  minAmount: number;
  maxAmount?: number;
  imagePath: string; // Path to SVG or PNG file
  benefits: string[];
  isUnlocked: boolean;
  progress?: number;
}

@Component({
  selector: 'app-tier-badges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tier-badges.component.html',
  styleUrls: ['./tier-badges.component.scss'],
})
export class TierBadgesComponent implements OnInit, OnChanges {
  @Input() totalDonated: number = 0;
  @Input() showProgress: boolean = true;
  @Input() displayMode: 'full' | 'compact' | 'mini' = 'full';

  constructor(public languageService: LanguageService) {}

  tiers: TierBadge[] = [
    {
      tier: 'persephone',
      name: 'Persephone',
      subtitle: 'Renewal Tier',
      minAmount: 0,
      maxAmount: 99,
      imagePath: 'assets/images/tiers/persephone.svg',
      benefits: ['Thank you email', 'Monthly newsletter', 'Community updates'],
      isUnlocked: false,
      progress: 0,
    },
    {
      tier: 'demeter',
      name: 'Demeter',
      subtitle: 'Nurture Tier',
      minAmount: 100,
      maxAmount: 499,
      imagePath: 'assets/images/tiers/demeter.svg',
      benefits: [
        'All Persephone benefits',
        'Exclusive donor badge',
        'Quarterly impact reports',
        'Priority email support',
      ],
      isUnlocked: false,
      progress: 0,
    },
    {
      tier: 'hestia',
      name: 'Hestia',
      subtitle: 'Hearth Tier',
      minAmount: 500,
      maxAmount: 999,
      imagePath: 'assets/images/tiers/hestia.svg',
      benefits: [
        'All Demeter benefits',
        'Recognition on donor wall',
        'Invitation to annual gala',
        'Personal impact dashboard',
        'Tax receipt priority processing',
      ],
      isUnlocked: false,
      progress: 0,
    },
    {
      tier: 'artemis',
      name: 'Artemis',
      subtitle: 'Protector Tier',
      minAmount: 1000,
      maxAmount: 4999,
      imagePath: 'assets/images/tiers/artemis.svg',
      benefits: [
        'All Hestia benefits',
        'VIP event access',
        'One-on-one impact briefing',
        'Featured in annual report',
        'Personalized thank you video',
      ],
      isUnlocked: false,
      progress: 0,
    },
    {
      tier: 'athena',
      name: 'Athena',
      subtitle: 'Guardian Tier',
      minAmount: 5000,
      imagePath: 'assets/images/tiers/athena.svg',
      benefits: [
        'All Artemis benefits',
        'Board meeting attendance',
        'Program naming opportunities',
        'Exclusive site visit',
        'Legacy recognition',
        'Dedicated account manager',
      ],
      isUnlocked: false,
      progress: 0,
    },
  ];

  currentTier: TierBadge | null = null;
  nextTier: TierBadge | null = null;
  progressToNextTier: number = 0;

  ngOnInit(): void {
    this.calculateTierProgress();
  }

  ngOnChanges(): void {
    this.calculateTierProgress();
  }

  calculateTierProgress(): void {
    // Determine current tier
    for (let i = this.tiers.length - 1; i >= 0; i--) {
      const tier = this.tiers[i];
      if (this.totalDonated >= tier.minAmount) {
        this.currentTier = tier;
        tier.isUnlocked = true;

        // Find next tier
        if (i < this.tiers.length - 1) {
          this.nextTier = this.tiers[i + 1];
          const tierRange = this.nextTier.minAmount - tier.minAmount;
          this.progressToNextTier = ((this.totalDonated - tier.minAmount) / tierRange) * 100;
        } else {
          this.nextTier = null;
          this.progressToNextTier = 100;
        }
        break;
      }
    }

    // Calculate progress for each tier
    this.tiers.forEach((tier) => {
      if (this.totalDonated >= tier.minAmount) {
        tier.isUnlocked = true;
        if (tier.maxAmount) {
          tier.progress = Math.min(
            ((this.totalDonated - tier.minAmount) / (tier.maxAmount - tier.minAmount)) * 100,
            100,
          );
        } else {
          tier.progress = 100;
        }
      } else {
        tier.isUnlocked = false;
        tier.progress = 0;
      }
    });
  }

  getAmountToNextTier(): number {
    if (!this.nextTier) return 0;
    return this.nextTier.minAmount - this.totalDonated;
  }

  getTierIndex(tier: TierBadge): number {
    return this.tiers.indexOf(tier);
  }

  isCurrentTier(tier: TierBadge): boolean {
    return this.currentTier?.tier === tier.tier;
  }

  isNextTier(tier: TierBadge): boolean {
    return this.nextTier?.tier === tier.tier;
  }

  getTierName(tierKey: string): string {
    const tierNameMap: { [key: string]: string } = {
      persephone: 'tier_persephone',
      demeter: 'tier_demeter',
      hestia: 'tier_hestia',
      artemis: 'tier_artemis',
      athena: 'tier_athena',
    };
    const translationKey = tierNameMap[tierKey];
    return translationKey ? this.languageService.getTranslation(translationKey) : tierKey;
  }

  getTierSubtitle(subtitle: string): string {
    const subtitleMap: { [key: string]: string } = {
      'Renewal Tier': 'tier_renewal',
      'Nurture Tier': 'tier_nurture',
      'Hearth Tier': 'tier_hearth',
      'Protector Tier': 'tier_protector',
      'Guardian Tier': 'tier_guardian',
    };
    const translationKey = subtitleMap[subtitle];
    return translationKey ? this.languageService.getTranslation(translationKey) : subtitle;
  }
}
