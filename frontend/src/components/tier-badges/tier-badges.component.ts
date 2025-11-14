import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  tiers: TierBadge[] = [
    {
      tier: 'aegis',
      name: 'Aegis',
      subtitle: 'Guardian Tier',
      minAmount: 0,
      maxAmount: 99,
      imagePath: 'assets/images/tiers/aegis.svg',
      benefits: ['Thank you email', 'Monthly newsletter', 'Community updates'],
      isUnlocked: false,
      progress: 0,
    },
    {
      tier: 'poseidon',
      name: 'Poseidon',
      subtitle: 'Depth Tier',
      minAmount: 100,
      maxAmount: 499,
      imagePath: 'assets/images/tiers/poseidon.svg',
      benefits: [
        'All Aegis benefits',
        'Exclusive donor badge',
        'Quarterly impact reports',
        'Priority email support',
      ],
      isUnlocked: false,
      progress: 0,
    },
    {
      tier: 'ares',
      name: 'Ares',
      subtitle: 'Valor Tier',
      minAmount: 500,
      maxAmount: 999,
      imagePath: 'assets/images/tiers/ares.svg',
      benefits: [
        'All Poseidon benefits',
        'Recognition on donor wall',
        'Invitation to annual gala',
        'Personal impact dashboard',
        'Tax receipt priority processing',
      ],
      isUnlocked: false,
      progress: 0,
    },
    {
      tier: 'zeus',
      name: 'Zeus',
      subtitle: 'Supreme Tier',
      minAmount: 1000,
      maxAmount: 4999,
      imagePath: 'assets/images/tiers/zeus.svg',
      benefits: [
        'All Ares benefits',
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
      subtitle: 'Legendary Shield',
      minAmount: 5000,
      imagePath: 'assets/images/tiers/athena.svg',
      benefits: [
        'All Zeus benefits',
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
}
