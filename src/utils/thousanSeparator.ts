export const thousandSeparator = (
  number: number,
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero'
) =>
  number
    ? new Intl.NumberFormat('en-En', {
        signDisplay,
      }).format(number)
    : '0'
