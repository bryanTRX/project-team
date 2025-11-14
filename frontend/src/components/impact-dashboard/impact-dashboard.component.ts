import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ImpactCard {
  icon: string;
  title: string;
  description: string;
  impact: string;
  color: string;
}

@Component({
  selector: 'app-impact-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './impact-dashboard.component.html',
  styleUrl: './impact-dashboard.component.scss'
})
export class ImpactDashboardComponent {
  impactCards: ImpactCard[] = [
    {
      icon: 'home',
      title: 'Safe Shelter',
      description: 'Your donation provides safe housing for families in crisis',
      impact: '$50 = 1 night of shelter',
      color: '#F28C88'
    },
    {
      icon: 'heart',
      title: 'Counseling',
      description: 'Support mental health services for survivors',
      impact: '$75 = 1 counseling session',
      color: '#F28C88'
    },
    {
      icon: 'comments',
      title: 'Multilingual Support',
      description: 'Help us provide services in 10+ languages',
      impact: '$100 = 5 hours of translation',
      color: '#F28C88'
    }
  ];
}

