import { Tarea, ViewMode } from "../types/public-types";

type DateHelperScales =
  | "year"
  | "month"
  | "day"
  | "hora"
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
  const clave = `${Array.isArray(locString)
    ? locString.join(",")
    : locString}-${opts.weekday || ""}-${opts.month || ""}`;

  let dtf = intlDTCache[clave];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[clave] = dtf;
  }
  return dtf;
};

export const agregarAFecha = (
  fecha: Date,
  quantity: number,
  scale: DateHelperScales
): Date => {
  // Retorna una nueva instancia limpia sin mutar el objeto 'date' original
  return new Date(
    fecha.getFullYear() + (scale === "year" ? quantity : 0),
    fecha.getMonth() + (scale === "month" ? quantity : 0),
    fecha.getDate() + (scale === "day" ? quantity : 0),
    fecha.getHours() + (scale === "hora" ? quantity : 0),
    fecha.getMinutes() + (scale === "minute" ? quantity : 0),
    fecha.getSeconds() + (scale === "second" ? quantity : 0),
    fecha.getMilliseconds() + (scale === "millisecond" ? quantity : 0)
  );
};

export const startOfDate = (fecha: Date, scale: DateHelperScales): Date => {
  const scores: DateHelperScales[] = [
    "millisecond",
    "second",
    "minute",
    "hora",
    "day",
    "month",
    "year",
  ];

  const maxScore = scores.indexOf(scale);
  const shouldReset = (_scale: DateHelperScales) => scores.indexOf(_scale) <= maxScore;

  return new Date(
    fecha.getFullYear(),
    shouldReset("year") ? 0 : fecha.getMonth(),
    shouldReset("month") ? 1 : fecha.getDate(),
    shouldReset("day") ? 0 : fecha.getHours(),
    shouldReset("hora") ? 0 : fecha.getMinutes(),
    shouldReset("minute") ? 0 : fecha.getSeconds(),
    shouldReset("second") ? 0 : fecha.getMilliseconds()
  );
};

export const ganttDateRange = (
  tareas: Tarea[],
  viewMode: ViewMode,
  preStepsCount: number
): [Date, Date] => {
  if (!tareas.length) return [new Date(), new Date()];

  let nuevaFechaInicio: Date = new Date(tareas[0].inicio.getTime());
  let nuevaFechaFin: Date = new Date(tareas[0].fin.getTime());

  for (const tarea of tareas) {
    if (tarea.inicio < nuevaFechaInicio) {
      nuevaFechaInicio = new Date(tarea.inicio.getTime());
    }
    if (tarea.fin > nuevaFechaFin) {
      nuevaFechaFin = new Date(tarea.fin.getTime());
    }
  }

  switch (viewMode) {
    case ViewMode.Year:
      nuevaFechaInicio = startOfDate(agregarAFecha(nuevaFechaInicio, -1, "year"), "year");
      nuevaFechaFin = startOfDate(agregarAFecha(nuevaFechaFin, 1, "year"), "year");
      break;
    case ViewMode.QuarterYear:
      nuevaFechaInicio = startOfDate(agregarAFecha(nuevaFechaInicio, -3, "month"), "month");
      nuevaFechaFin = startOfDate(agregarAFecha(nuevaFechaFin, 3, "year"), "year");
      break;
    case ViewMode.Month:
      nuevaFechaInicio = startOfDate(agregarAFecha(nuevaFechaInicio, -1 * preStepsCount, "month"), "month");
      nuevaFechaFin = startOfDate(agregarAFecha(nuevaFechaFin, 1, "year"), "year");
      break;
    case ViewMode.Week:
      nuevaFechaInicio = startOfDate(nuevaFechaInicio, "day");
      nuevaFechaInicio = agregarAFecha(getMonday(nuevaFechaInicio), -7 * preStepsCount, "day");
      nuevaFechaFin = agregarAFecha(startOfDate(nuevaFechaFin, "day"), 1.5, "month");
      break;
    case ViewMode.Day:
      nuevaFechaInicio = agregarAFecha(startOfDate(nuevaFechaInicio, "day"), -1 * preStepsCount, "day");
      nuevaFechaFin = agregarAFecha(startOfDate(nuevaFechaFin, "day"), 19, "day");
      break;
    case ViewMode.QuarterDay:
      nuevaFechaInicio = agregarAFecha(startOfDate(nuevaFechaInicio, "day"), -1 * preStepsCount, "day");
      nuevaFechaFin = agregarAFecha(startOfDate(nuevaFechaFin, "day"), 66, "hora");
      break;
    case ViewMode.HalfDay:
      nuevaFechaInicio = agregarAFecha(startOfDate(nuevaFechaInicio, "day"), -1 * preStepsCount, "day");
      nuevaFechaFin = agregarAFecha(startOfDate(nuevaFechaFin, "day"), 108, "hora");
      break;
    case ViewMode.Hora:
      nuevaFechaInicio = agregarAFecha(startOfDate(nuevaFechaInicio, "hora"), -1 * preStepsCount, "hora");
      nuevaFechaFin = agregarAFecha(startOfDate(nuevaFechaFin, "day"), 1, "day");
      break;
  }
  return [nuevaFechaInicio, nuevaFechaFin];
};

export const semillaFechas = (
  fechaInicio: Date,
  fechaFin: Date,
  viewMode: ViewMode
): Date[] => {
  let fechaActual: Date = new Date(fechaInicio.getTime());
  const fechas: Date[] = [new Date(fechaActual.getTime())];

  while (fechaActual < fechaFin) {
    switch (viewMode) {
      case ViewMode.Year:
        fechaActual = agregarAFecha(fechaActual, 1, "year");
        break;
      case ViewMode.QuarterYear:
        fechaActual = agregarAFecha(fechaActual, 3, "month");
        break;
      case ViewMode.Month:
        fechaActual = agregarAFecha(fechaActual, 1, "month");
        break;
      case ViewMode.Week:
        fechaActual = agregarAFecha(fechaActual, 7, "day");
        break;
      case ViewMode.Day:
        fechaActual = agregarAFecha(fechaActual, 1, "day");
        break;
      case ViewMode.HalfDay:
        fechaActual = agregarAFecha(fechaActual, 12, "hora");
        break;
      case ViewMode.QuarterDay:
        fechaActual = agregarAFecha(fechaActual, 6, "hora");
        break;
      case ViewMode.Hora:
        fechaActual = agregarAFecha(fechaActual, 1, "hora");
        break;
    }
    // Clonamos explícitamente para no llenar el array con referencias al mismo objeto mutable
    fechas.push(new Date(fechaActual.getTime()));
  }
  return fechas;
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
