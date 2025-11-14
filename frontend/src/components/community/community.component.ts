import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CommunityFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class CommunityComponent {
  features: CommunityFeature[] = [
    {
      icon: 'trophy',
      title: 'Milestones',
      description: 'Celebrate collective achievements'
    },
    {
      icon: 'share-alt',
      title: 'Share Impact',
      description: 'Spread hope with your network'
    },
    {
      icon: 'users',
      title: 'Challenges',
      description: 'Friendly giving competitions'
    }
  ];
}

