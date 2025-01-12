import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';
import '../../styles/global.css';

@Component({
  tag: 'fui-input',
  styleUrl: 'fui-input.css',
})
export class FuiInput {
  @Prop() public inputProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'onInput' | 'onBlur' | 'onFocus' | 'value'>;
  @Prop() public value: string;
  @Prop() public error?: boolean = false;
  @Prop() public size: 'sm' | 'md' | 'lg' = 'md';

  @Event() public fuiInput: EventEmitter<InputEvent>;
  @Event() public fuiBlur: EventEmitter<FocusEvent>;
  @Event() public fuiFocus: EventEmitter<FocusEvent>;

  private inputHandler(e: InputEvent) {
    e.preventDefault();
    this.fuiInput.emit(e);
  }

  private blurHandler(e: FocusEvent) {
    e.preventDefault();
    this.fuiBlur.emit(e);
  }

  private focusHandler(e: FocusEvent) {
    e.preventDefault();
    this.fuiFocus.emit(e);
  }

  private getSizeClasses() {
    switch (this.size) {
      case 'sm':
        return 'px-2 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-3 text-base';
      default:
        return 'px-3 py-2 text-sm';
    }
  }

  render() {
    const baseClasses =
      'block w-full rounded-md border border-gray-300 bg-white shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200';
    const stateClasses = this.error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : 'text-gray-900';
    const sizeClasses = this.getSizeClasses();

    const props = { ...this.inputProps };

    return (
      <Host>
        <input
          {...props}
          class={`${baseClasses} ${stateClasses} ${sizeClasses}`}
          onInput={e => this.inputHandler(e)}
          onBlur={e => this.blurHandler(e)}
          onFocus={e => this.focusHandler(e)}
          value={this.value}
        />
      </Host>
    );
  }
}
