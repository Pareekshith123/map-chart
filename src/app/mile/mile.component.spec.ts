import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MileComponent } from './mile.component';

describe('MileComponent', () => {
  let component: MileComponent;
  let fixture: ComponentFixture<MileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
