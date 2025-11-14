import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTrackerComponent} from './live-tracker';

describe('LiveTrackerComponent', () => {
  let component: LiveTrackerComponent;
  let fixture: ComponentFixture<LiveTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
