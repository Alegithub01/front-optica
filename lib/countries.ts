export const countries = [
  { code: "AR", name: "Argentina", dialCode: "+54" },
  { code: "BO", name: "Bolivia", dialCode: "+591" },
  { code: "BR", name: "Brasil", dialCode: "+55" },
  { code: "CL", name: "Chile", dialCode: "+56" },
  { code: "CO", name: "Colombia", dialCode: "+57" },
  { code: "CR", name: "Costa Rica", dialCode: "+506" },
  { code: "CU", name: "Cuba", dialCode: "+53" },
  { code: "DO", name: "República Dominicana", dialCode: "+1-809" },
  { code: "EC", name: "Ecuador", dialCode: "+593" },
  { code: "SV", name: "El Salvador", dialCode: "+503" },
  { code: "GT", name: "Guatemala", dialCode: "+502" },
  { code: "HN", name: "Honduras", dialCode: "+504" },
  { code: "MX", name: "México", dialCode: "+52" },
  { code: "NI", name: "Nicaragua", dialCode: "+505" },
  { code: "PA", name: "Panamá", dialCode: "+507" },
  { code: "PY", name: "Paraguay", dialCode: "+595" },
  { code: "PE", name: "Perú", dialCode: "+51" },
  { code: "UY", name: "Uruguay", dialCode: "+598" },
  { code: "VE", name: "Venezuela", dialCode: "+58" },
  { code: "ES", name: "España", dialCode: "+34" },
  { code: "US", name: "Estados Unidos", dialCode: "+1" },
  { code: "MX", name: "México", dialCode: "+52" },
]

export const getCountryByCode = (code: string) => {
  return countries.find((country) => country.code === code)
}
