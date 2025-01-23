import { Event, Component, EventEmitter, Host, h } from '@stencil/core';

@Component({
  tag: 'fui-google-sign-in',
  styleUrl: 'fui-google-sign-in.css',
})
export class FuiGoogleSignIn {
  @Event() signedIn: EventEmitter<void>;

  render() {
    return (
      <Host>
        <div class="w-full flex justify-center">
          <button
            class="flex items-center justify-center gap-2 w-full max-w-[240px] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285f4] transition-colors"
            onClick={() => this.signedIn.emit()}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google sign-in" class="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </Host>
    );
  }
}
