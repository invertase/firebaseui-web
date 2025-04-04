import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryData, countryData } from '@firebase-ui/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'fui-country-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fui-country-selector" [class]="className">
      <div class="fui-country-selector__wrapper">
        <span class="fui-country-selector__flag">{{ value.emoji }}</span>
        <div class="fui-country-selector__select-wrapper">
          <span class="fui-country-selector__dial-code">{{ value.dialCode }}</span>
          <select
            class="fui-country-selector__select"
            [ngModel]="value.code"
            (ngModelChange)="handleCountryChange($event)"
          >
            @for (country of countries; track country.code) {
              <option [value]="country.code">
                {{ country.dialCode }} ({{ country.name }})
              </option>
            }
          </select>
        </div>
      </div>
    </div>
  `
})
export class CountrySelectorComponent {
  @Input() value: CountryData = countryData[0];
  @Input() className: string = '';
  @Output() onChange = new EventEmitter<CountryData>();

  countries = countryData;

  handleCountryChange(code: string) {
    const country = this.countries.find(c => c.code === code);
    if (country) {
      this.onChange.emit(country);
    }
  }
}
