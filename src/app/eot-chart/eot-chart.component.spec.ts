import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EotChartComponent } from './eot-chart.component';

describe('EotChartComponent', () => {
  let component: EotChartComponent;
  let fixture: ComponentFixture<EotChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EotChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EotChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
