import { Tarea, ViewMode } from "../types/public-types";

type DateHelperScales =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

// Solución al noImplicitAny: Tipado explícito de la caché
const intlDTCache: Record<string, Intl.DateTimeFormat> = {};

export const getCachedDateTimeFormat = (
  locString: string | string[],
  opts: Intl.DateTimeFormatOptions = {}
): Intl.DateTimeFormat => {
  // Generación de una clave de string plana y rápida en lugar de usar JSON.stringify
  const key = `${Array.isArray(locString) ? locString.join(",") : locString}-${opts.weekday || ""}-${opts.month || ""}`;

  let dtf = intlDTCache[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }
  return dtf;
};

export const addToDate = (
  date: Date,
  quantity: number,
  scale: DateHelperScales
): Date => {
  // Retorna una nueva instancia limpia sin mutar el objeto 'date' original
  return new Date(
    date.getFullYear() + (scale === "year" ? quantity : 0),
    date.getMonth() + (scale === "month" ? quantity : 0),
    date.getDate() + (scale === "day" ? quantity : 0),
    date.getHours() + (scale === "hour" ? quantity : 0),
    date.getMinutes() + (scale === "minute" ? quantity : 0),
    date.getSeconds() + (scale === "second" ? quantity : 0),
    date.getMilliseconds() + (scale === "millisecond" ? quantity : 0)
  );
};

export const startOfDate = (date: Date, scale: DateHelperScales): Date => {
  const scores: DateHelperScales[] = [
    "millisecond",
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year",
  ];

  const maxScore = scores.indexOf(scale);
  const shouldReset = (_scale: DateHelperScales) => scores.indexOf(_scale) <= maxScore;

  return new Date(
    date.getFullYear(),
    shouldReset("year") ? 0 : date.getMonth(),
    shouldReset("month") ? 1 : date.getDate(),
    shouldReset("day") ? 0 : date.getHours(),
    shouldReset("hour") ? 0 : date.getMinutes(),
    shouldReset("minute") ? 0 : date.getSeconds(),
    shouldReset("second") ? 0 : date.getMilliseconds()
  );
};

export const ganttDateRange = (
  tareas: Tarea[],
  viewMode: ViewMode,
  preStepsCount: number
): [Date, Date] => {
  if (!tareas.length) return [new Date(), new Date()];

  let newStartDate: Date = new Date(tareas[0].inicio.getTime());
  let newEndDate: Date = new Date(tareas[0].fin.getTime());

  for (const tarea of tareas) {
    if (tarea.inicio < newStartDate) {
      newStartDate = new Date(tarea.inicio.getTime());
    }
    if (tarea.fin > newEndDate) {
      newEndDate = new Date(tarea.fin.getTime());
    }
  }

  switch (viewMode) {
    case ViewMode.Year:
      newStartDate = startOfDate(addToDate(newStartDate, -1, "year"), "year");
      newEndDate = startOfDate(addToDate(newEndDate, 1, "year"), "year");
      break;
    case ViewMode.QuarterYear:
      newStartDate = startOfDate(addToDate(newStartDate, -3, "month"), "month");
      newEndDate = startOfDate(addToDate(newEndDate, 3, "year"), "year");
      break;
    case ViewMode.Month:
      newStartDate = startOfDate(addToDate(newStartDate, -1 * preStepsCount, "month"), "month");
      newEndDate = startOfDate(addToDate(newEndDate, 1, "year"), "year");
      break;
    case ViewMode.Week:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(getMonday(newStartDate), -7 * preStepsCount, "day");
      newEndDate = addToDate(startOfDate(newEndDate, "day"), 1.5, "month");
      break;
    case ViewMode.Day:
      newStartDate = addToDate(startOfDate(newStartDate, "day"), -1 * preStepsCount, "day");
      newEndDate = addToDate(startOfDate(newEndDate, "day"), 19, "day");
      break;
    case ViewMode.QuarterDay:
      newStartDate = addToDate(startOfDate(newStartDate, "day"), -1 * preStepsCount, "day");
      newEndDate = addToDate(startOfDate(newEndDate, "day"), 66, "hour");
      break;
    case ViewMode.HalfDay:
      newStartDate = addToDate(startOfDate(newStartDate, "day"), -1 * preStepsCount, "day");
      newEndDate = addToDate(startOfDate(newEndDate, "day"), 108, "hour");
      break;
    case ViewMode.Hour:
      newStartDate = addToDate(startOfDate(newStartDate, "hour"), -1 * preStepsCount, "hour");
      newEndDate = addToDate(startOfDate(newEndDate, "day"), 1, "day");
      break;
  }
  return [newStartDate, newEndDate];
};

export const seedDates = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
): Date[] => {
  let currentDate: Date = new Date(startDate.getTime());
  const dates: Date[] = [new Date(currentDate.getTime())];

  while (currentDate < endDate) {
    switch (viewMode) {
      case ViewMode.Year:
        currentDate = addToDate(currentDate, 1, "year");
        break;
      case ViewMode.QuarterYear:
        currentDate = addToDate(currentDate, 3, "month");
        break;
      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, "month");
        break;
      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, "day");
        break;
      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, "day");
        break;
      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, "hour");
        break;
      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, "hour");
        break;
      case ViewMode.Hour:
        currentDate = addToDate(currentDate, 1, "hour");
        break;
    }
    // Clonamos explícitamente para no llenar el array con referencias al mismo objeto mutable
    dates.push(new Date(currentDate.getTime()));
  }
  return dates;
};

// Función auxiliar privada para capitalizar de forma segura y robusta strings de cualquier idioma
const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getLocaleMonth = (date: Date, locale: string): string => {
  const formatted = getCachedDateTimeFormat(locale, { month: "long" }).format(date);
  return capitalize(formatted);
};

export const getLocalDayOfWeek = (
  date: Date,
  locale: string,
  format?: "long" | "short" | "narrow"
): string => {
  const formatted = getCachedDateTimeFormat(locale, { weekday: format }).format(date);
  return capitalize(formatted);
};

/**
 * Returns monday of current week (Sin mutación colateral)
 */
const getMonday = (date: Date): Date => {
  const resultDate = new Date(date.getTime());
  const day = resultDate.getDay();
  const diff = resultDate.getDate() - day + (day === 0 ? -6 : 1);
  resultDate.setDate(diff);
  return resultDate;
};

export const getWeekNumberISO8601 = (date: Date): string => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  return weekNumber.padStart(2, "0"); // Código moderno en lugar de if/else manual
};

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};
