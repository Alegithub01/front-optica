"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { countries } from "@/lib/countries"

interface CountrySelectorProps {
  value: string
  onCountryChange: (code: string) => void
}

export function CountrySelector({ value, onCountryChange }: CountrySelectorProps) {
  const selectedCountry = countries.find((c) => c.code === value)

  return (
    <div className="space-y-2">
      <Label htmlFor="country">País</Label>
      <Select value={value} onValueChange={onCountryChange}>
        <SelectTrigger id="country">
          <SelectValue placeholder="Selecciona un país" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name} ({country.dialCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedCountry && (
        <p className="text-sm text-muted-foreground">
          Código: <span className="font-semibold">{selectedCountry.dialCode}</span>
        </p>
      )}
    </div>
  )
}
