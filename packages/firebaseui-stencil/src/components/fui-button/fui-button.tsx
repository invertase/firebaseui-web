import { Component, Event, EventEmitter, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'fui-button',
  styleUrl: 'fui-button.css',
})
export class FuiButton {
  @Event() private fuiClick: EventEmitter<MouseEvent>;

  @Prop() public type: string;
  @Prop() public fullWidth?: boolean = true;

  private onClick(e: MouseEvent) {
    this.fuiClick.emit(e);
  }

  public render() {
    const classes = `rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 transition-colors ${this.fullWidth ? 'w-full' : ''}`;

    return (
      <Host>
        <button class={classes} onClick={e => this.onClick(e)} type={this.type ?? 'button'}>
          <slot></slot>
        </button>
      </Host>
    );
  }
}
