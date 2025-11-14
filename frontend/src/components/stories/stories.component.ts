import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Story {
  name: string;
  timeline: string;
  quote: string;
  icon: string;
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
      quote: "The shelter provided not just safety, but hope. My children can now sleep peacefully at night.",
      icon: 'user'
    },
    {
      name: "Maria's Journey",
      timeline: 'Thriving since 2021',
      quote: "The multilingual support helped me navigate the system and rebuild my life with confidence.",
      icon: 'user'
    }
  ];

  sendMessage(story: Story): void {
    alert(`Sending a message of support to ${story.name}`);
  }
}

