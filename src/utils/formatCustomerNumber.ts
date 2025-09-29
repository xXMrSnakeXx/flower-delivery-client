export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/[^\d+]/g, '');

  const hasPlus = numbers.startsWith('+');
  const digits = hasPlus ? numbers.slice(1) : numbers;

  if (digits.length === 0) return hasPlus ? '+' : '';

  let formatted = hasPlus ? '+' : '';

  if (digits.length <= 3) {
    formatted += digits;
  } else if (digits.length <= 6) {
    formatted += `${digits.slice(0, 3)} ${digits.slice(3)}`;
  } else if (digits.length <= 8) {
    formatted += `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  } else {
    formatted += `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }

  return formatted.trim();
};
