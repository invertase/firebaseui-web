import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpAuthScreenComponent } from './sign-up-auth-screen.component';

describe('SignUpAuthScreenComponent', () => {
  let component: SignUpAuthScreenComponent;
  let fixture: ComponentFixture<SignUpAuthScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpAuthScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpAuthScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
