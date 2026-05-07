import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesOverview } from './games-overview';

describe('GamesOverview', () => {
  let component: GamesOverview;
  let fixture: ComponentFixture<GamesOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(GamesOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
