export const numberAbbv = (number: number, fraction?: number) =>
  Intl.NumberFormat('id-ID', {
    notation: 'compact',
    maximumFractionDigits: fraction || 1,
  }).format(number)
