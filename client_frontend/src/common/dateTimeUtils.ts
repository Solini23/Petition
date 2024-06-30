export function formatDateToLocaleDateTime(
  dateStr: string | null | undefined,
  locale: string = "uk-UA",
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!dateStr) return "";

  const normalizedDateStr = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`;
  const date = new Date(normalizedDateStr);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  };

  const finalOptions = { ...defaultOptions, ...options };

  return date.toLocaleString(locale, finalOptions);
}

export function formatDateToLocaleDate(
  dateStr: string | null | undefined,
  locale: string = "uk-UA",
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!dateStr) return "";

  const normalizedDateStr = dateStr.endsWith("Z") ? dateStr : `${dateStr}Z`;
  const date = new Date(normalizedDateStr);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hourCycle: "h23",
  };

  const finalOptions = { ...defaultOptions, ...options };

  return date.toLocaleString(locale, finalOptions);
}
