"use client";

import { CountryData, countryData } from "@firebase-ui/core";
import { cn } from "~/utils/cn";

interface CountrySelectorProps {
  value: CountryData;
  onChange: (country: CountryData) => void;
  className?: string;
}

export function CountrySelector({
  value,
  onChange,
  className,
}: CountrySelectorProps) {
  return (
    <div className={cn("fui-country-selector", className)}>
      <div className="fui-country-selector__wrapper">
        <span className="fui-country-selector__flag">{value.emoji}</span>
        <div className="fui-country-selector__select-wrapper">
          <span className="fui-country-selector__dial-code">{value.dialCode}</span>
          <select
            className="fui-country-selector__select"
            value={value.code}
            onChange={(e) => {
              const country = countryData.find((c) => c.code === e.target.value);
              if (country) {
                onChange(country);
              }
            }}
          >
            {countryData.map((country) => (
              <option
                key={`${country.code}-${country.dialCode}`}
                value={country.code}
              >
                {country.dialCode} ({country.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
