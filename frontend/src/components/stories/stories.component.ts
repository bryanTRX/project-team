import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Story {
  name: string;
  timeline: string;
  quote: string;
  image: string;
  color: string;
  emotion: string;
}

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss'
})
export class StoriesComponent {
  constructor(private router: Router) {}

  stories: Story[] = [
    {
      name: "Sarah's Journey",
      timeline: 'Supported since 2022',
      quote: "When I walked through those doors with my three children, I was broken. Today, we're healing together. The shelter didn't just give us a roof—it gave us back our lives. My children can sleep peacefully now, and I can finally see hope in their eyes again.",
      image: 'https://i.pravatar.cc/150?img=47',
      color: '#C9B5E8',
      emotion: 'Hope Restored'
    },
    {
      name: "Maria's Transformation",
      timeline: 'Thriving since 2021',
      quote: "The multilingual support was everything. They understood my struggles, my fears, my dreams—in my own language. I'm not just surviving anymore; I'm thriving. I started my own small business, my children are in school, and we're building a future I never thought possible.",
      image: 'https://i.pravatar.cc/150?img=12',
      color: '#6B4FA3',
      emotion: 'Dreams Realized'
    },
    {
      name: "Emma's New Beginning",
      timeline: 'Supported since 2023',
      quote: "From hiding in fear to standing in strength—that's my story. The counseling services gave me the courage to start over. My children and I are safe now, and for the first time in years, I'm excited about tomorrow. Thank you for believing in us when we couldn't believe in ourselves.",
      image: 'https://i.pravatar.cc/150?img=33',
      color: '#F28C88',
      emotion: 'Strength Found'
    }
  ];

  sendMessage(story: Story): void {
    alert(`Sending a message of support to ${story.name}. Your kindness makes all the difference!`);
  }

  scrollToDonation(): void {
    this.router.navigate(['/donate']);
  }
}
