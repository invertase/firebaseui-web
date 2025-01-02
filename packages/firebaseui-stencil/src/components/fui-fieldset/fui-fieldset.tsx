import { Component, Host, Prop, h } from '@stencil/core';
import '../../styles/global.css';

@Component({
  tag: 'fui-fieldset',
  styleUrl: 'fui-fieldset.css',
})
export class FuiFieldset {
  @Prop() public props: { [key: string]: any };
  @Prop() public inputId?: string;
  @Prop() public label?: string;
  @Prop() public error?: boolean = false;
  @Prop() public required?: boolean = false;
  @Prop() public helpText?: string;
  @Prop() public class?: string;

  render() {
    return (
      <Host>
        <div {...this.props} class={this.class}>
          {this.label && (
            <label class="block text-sm font-medium leading-6 mb-1.5 text-gray-900" htmlFor={this.inputId}>
              {this.label}
              {this.required && <span class="text-red-500 ml-1">*</span>}
            </label>
          )}
          <div class={this.error ? 'relative' : ''}>
            <slot></slot>
          </div>
          {this.helpText && <p class={`mt-2 text-sm ${this.error ? 'text-red-600' : 'text-gray-500'}`}>{this.helpText}</p>}
        </div>
      </Host>
    );
  }
}
