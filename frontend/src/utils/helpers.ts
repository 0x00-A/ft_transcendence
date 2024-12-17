export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

const tamazightMonths = [
  "ⵉⵏⵏⴰⵢⵔ", "ⴱⵕⴰⵢⵕ", "ⵎⴰⵕⵚ", "ⵉⴱⵔⵉⵔ", "ⵎⴰⵢⵢⵓ", "ⵢⵓⵏⵢⵓ", "ⵢⵓⵍⵢⵓⵣ", "ⵖⵓⵛⵜ", "ⵛⵓⵜⴰⵏⴱⵉⵔ", "ⴽⵟⵓⴱⵕ", "ⵏⵓⵡⴰⵏⴱⵉⵔ", "ⴷⵓⵊⴰⵏⴱⵉⵔ"
];

export const formatDateTamazight = (dateString: Date) => {
  const date = new Date(dateString);
  const month = tamazightMonths[date.getMonth()];
  const day = date.getDate();
  const hour = date.getHours() % 12 || 12;
  const minute = date.getMinutes();
  const period = date.getHours() >= 12 ? "ⴰⵜⵉⴼⵓⵙ" : "ⵜⵉⴽⵔⵉ";

  return `${month} ${day}, ${hour}:${minute} ${period}`;
};

export const formatDate = (dateString: Date, locale: string) => {
  const date = new Date(dateString);
  if (locale === "tmazight") return formatDateTamazight(dateString);
  return date.toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};