import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { FirebaseUi } from '../../provider';
import { TermsAndPrivacyComponent } from './terms-and-privacy.component';

class MockFirebaseUi {
  private _config = new BehaviorSubject<any>({
    tosUrl: 'https://example.com/terms',
    privacyPolicyUrl: 'https://example.com/privacy',
  });

  private _termsText = new BehaviorSubject<string>('Terms of Service');
  private _privacyText = new BehaviorSubject<string>('Privacy Policy');
  private _templateText = new BehaviorSubject<string>(
    'By continuing, you agree to our {tos} and {privacy}'
  );

  config() {
    return this._config.asObservable();
  }

  translation(section: string, key: string) {
    if (section === 'labels' && key === 'termsOfService') {
      return this._termsText.asObservable();
    }
    if (section === 'labels' && key === 'privacyPolicy') {
      return this._privacyText.asObservable();
    }
    if (section === 'messages' && key === 'termsAndPrivacy') {
      return this._templateText.asObservable();
    }
    return new BehaviorSubject<string>(`${section}.${key}`).asObservable();
  }

  setConfig(config: any) {
    this._config.next(config);
  }

  setTranslation(section: string, key: string, value: string) {
    if (section === 'labels' && key === 'termsOfService') {
      this._termsText.next(value);
    } else if (section === 'labels' && key === 'privacyPolicy') {
      this._privacyText.next(value);
    } else if (section === 'messages' && key === 'termsAndPrivacy') {
      this._templateText.next(value);
    }
  }
}

describe('TermsAndPrivacyComponent', () => {
  let component: TermsAndPrivacyComponent;
  let fixture: ComponentFixture<TermsAndPrivacyComponent>;
  let mockFirebaseUi: MockFirebaseUi;

  beforeEach(async () => {
    mockFirebaseUi = new MockFirebaseUi();

    await TestBed.configureTestingModule({
      imports: [TermsAndPrivacyComponent],
      providers: [{ provide: FirebaseUi, useValue: mockFirebaseUi }],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders component with terms and privacy links', fakeAsync(() => {
    tick(); // Let async operations complete
    fixture.detectChanges();

    // Check that the container is rendered
    const container = fixture.debugElement.query(By.css('.text-text-muted'));
    expect(container).toBeTruthy();

    // Check that the text contains "By continuing, you agree to our"
    const textContent = container.nativeElement.textContent;
    expect(textContent).toContain('By continuing, you agree to our');

    // Check for the TOS link
    const tosLink = fixture.debugElement.query(
      By.css('a[href="https://example.com/terms"]')
    );
    expect(tosLink).toBeTruthy();
    expect(tosLink.nativeElement.textContent.trim()).toBe('Terms of Service');
    expect(tosLink.nativeElement.getAttribute('target')).toBe('_blank');
    expect(tosLink.nativeElement.getAttribute('rel')).toBe(
      'noopener noreferrer'
    );

    // Check for the Privacy Policy link
    const privacyLink = fixture.debugElement.query(
      By.css('a[href="https://example.com/privacy"]')
    );
    expect(privacyLink).toBeTruthy();
    expect(privacyLink.nativeElement.textContent.trim()).toBe('Privacy Policy');
    expect(privacyLink.nativeElement.getAttribute('target')).toBe('_blank');
    expect(privacyLink.nativeElement.getAttribute('rel')).toBe(
      'noopener noreferrer'
    );
  }));

  it('does not render when both tosUrl and privacyPolicyUrl are not provided', fakeAsync(() => {
    // Set config with no URLs
    mockFirebaseUi.setConfig({
      tosUrl: undefined,
      privacyPolicyUrl: undefined,
    });

    tick(); // Let async operations complete
    fixture.detectChanges();

    // Check that the container is not rendered
    const container = fixture.debugElement.query(By.css('.text-text-muted'));
    expect(container).toBeFalsy();
  }));

  it('renders with tosUrl when privacyPolicyUrl is not provided', fakeAsync(() => {
    // Set config with only tosUrl
    mockFirebaseUi.setConfig({
      tosUrl: 'https://example.com/terms',
      privacyPolicyUrl: undefined,
    });

    tick(); // Let async operations complete
    fixture.detectChanges();

    // Check that the container is rendered
    const container = fixture.debugElement.query(By.css('.text-text-muted'));
    expect(container).toBeTruthy();

    // Check for the TOS link
    const tosLink = fixture.debugElement.query(
      By.css('a[href="https://example.com/terms"]')
    );
    expect(tosLink).toBeTruthy();
    expect(tosLink.nativeElement.textContent.trim()).toBe('Terms of Service');

    // Check that privacy link doesn't exist
    const privacyLink = fixture.debugElement.query(
      By.css('a[href="https://example.com/privacy"]')
    );
    expect(privacyLink).toBeFalsy();
  }));

  it('renders with privacyPolicyUrl when tosUrl is not provided', fakeAsync(() => {
    // Set config with only privacyPolicyUrl
    mockFirebaseUi.setConfig({
      tosUrl: undefined,
      privacyPolicyUrl: 'https://example.com/privacy',
    });

    tick(); // Let async operations complete
    fixture.detectChanges();

    // Check that the container is rendered
    const container = fixture.debugElement.query(By.css('.text-text-muted'));
    expect(container).toBeTruthy();

    // Check that TOS link doesn't exist
    const tosLink = fixture.debugElement.query(
      By.css('a[href="https://example.com/terms"]')
    );
    expect(tosLink).toBeFalsy();

    // Check for the privacy link
    const privacyLink = fixture.debugElement.query(
      By.css('a[href="https://example.com/privacy"]')
    );
    expect(privacyLink).toBeTruthy();
    expect(privacyLink.nativeElement.textContent.trim()).toBe('Privacy Policy');
  }));

  it('uses custom template text when provided', fakeAsync(() => {
    // Set custom template
    mockFirebaseUi.setTranslation(
      'messages',
      'termsAndPrivacy',
      'Custom template with {tos} and {privacy}'
    );

    tick(); // Let async operations complete
    fixture.detectChanges();

    // Check that the container is rendered with custom text
    const container = fixture.debugElement.query(By.css('.text-text-muted'));
    expect(container).toBeTruthy();

    const textContent = container.nativeElement.textContent;
    expect(textContent).toContain('Custom template with');
    expect(textContent).toContain('Terms of Service');
    expect(textContent).toContain('Privacy Policy');
  }));
});
