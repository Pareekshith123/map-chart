import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarnatakaMapAppComponent } from './karnataka-map-app.component';

describe('KarnatakaMapAppComponent', () => {
  let component: KarnatakaMapAppComponent;
  let fixture: ComponentFixture<KarnatakaMapAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KarnatakaMapAppComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarnatakaMapAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
