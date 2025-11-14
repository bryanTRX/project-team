import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Story {
  name: string;
  timeline: string;
  quote: string;
  image: string;
  color: string;
}

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss'
})
export class StoriesComponent {
  stories: Story[] = [
    {
      name: "Sarah's Story",
      timeline: 'Supported since 2022',
      quote: "The shelter provided not just safety, but hope. My children can now sleep peacefully at night. We're rebuilding our lives together, one day at a time.",
      image: 'https://i.pravatar.cc/150?img=47',
      color: '#C9B5E8'
    },
    {
      name: "Maria's Journey",
      timeline: 'Thriving since 2021',
      quote: "The multilingual support helped me navigate the system and rebuild my life with confidence. Today, I'm independent and helping others.",
      image: 'https://i.pravatar.cc/150?img=12',
      color: '#6B4FA3'
    },
    {
      name: "Emma's Transformation",
      timeline: 'Supported since 2023',
      quote: "From fear to freedom - that's my story. The counseling services gave me the strength to start over. My children and I are safe now.",
      image: 'https://i.pravatar.cc/150?img=33',
      color: '#F28C88'
    }
  ];

  sendMessage(story: Story): void {
    alert(`Sending a message of support to ${story.name}. Thank you for your kindness!`);
  }
}
