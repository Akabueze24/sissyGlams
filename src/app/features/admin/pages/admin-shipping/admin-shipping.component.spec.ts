import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShippingComponent } from './admin-shipping.component';

describe('AdminShippingComponent', () => {
  let component: AdminShippingComponent;
  let fixture: ComponentFixture<AdminShippingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminShippingComponent]
    });
    fixture = TestBed.createComponent(AdminShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
