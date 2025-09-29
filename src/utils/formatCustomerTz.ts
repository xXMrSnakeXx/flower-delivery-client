export const formatCustomerTz = (
  dateStr?: string,
  tz?: string
): string | null => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz || 'UTC',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return fmt.format(d);
  } catch {
    return null;
  }
};
