import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ImpactCard {
  icon: string;
  number: string;
  title: string;
  description: string;
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
      icon: 'users',
      number: '2,450',
      title: 'Women & Children Supported',
      description: 'Lives changed through our comprehensive support programs',
      color: '#F28C88'
    },
    {
      icon: 'language',
      number: '10',
      title: 'Languages Spoken',
      description: 'Multilingual support ensuring everyone can access help',
      color: '#6B4FA3'
    },
    {
      icon: 'clock',
      number: '24/7',
      title: 'Crisis Support Available',
      description: 'Round-the-clock assistance for those in need',
      color: '#C9B5E8'
    },
    {
      icon: 'heart',
      number: '95%',
      title: 'Successfully Rebuilt Lives',
      description: 'Survivors who have found hope and independence',
      color: '#F28C88'
    }
  ];
}
