import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameStatistics } from './game-statistics';

describe('GameStatistics', () => {
  let component: GameStatistics;
  let fixture: ComponentFixture<GameStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameStatistics],
    }).compileComponents();

    fixture = TestBed.createComponent(GameStatistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
