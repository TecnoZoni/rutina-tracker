export type DateId = `${number}-${string}-${string}`;

const pad2 = (value: number) => String(value).padStart(2, '0');

export function dateIdFromDate(date: Date): DateId {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

export function dateFromDateId(dateId: string): Date {
  const [yearRaw, monthRaw, dayRaw] = dateId.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  return new Date(year, month - 1, day);
}

export function todayId(): DateId {
  return dateIdFromDate(new Date());
}

export function addDays(dateId: DateId, deltaDays: number): DateId {
  const date = dateFromDateId(dateId);
  date.setDate(date.getDate() + deltaDays);
  return dateIdFromDate(date);
}

export function formatLongDate(dateId: DateId, locale = 'es-AR'): string {
  const date = dateFromDateId(dateId);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function isDateId(value: string): value is DateId {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
