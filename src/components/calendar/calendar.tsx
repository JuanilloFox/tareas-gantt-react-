import React, { ReactChild } from "react";
import { ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getLocaleMonth,
  getWeekNumberISO8601,
} from "../../Auxiliares/auxiliar-fecha";
import { ConfigFecha } from "../../types/date-setup";
import styles from "./calendar.module.css";

export type CalendarProps = {
  configFecha: ConfigFecha;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  altoCabecera: number;
  anchoColumna: number;
  fontFamily: string;
  fontSize: string;
};

export const Calendar: React.FC<CalendarProps> = ({
  configFecha,
  locale,
  viewMode,
  rtl,
  altoCabecera,
  anchoColumna,
  fontFamily,
  fontSize,
}) => {
  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = altoCabecera * 0.5;
    for (let i = 0; i < configFecha.fechas.length; i++) {
      const date = configFecha.fechas[i];
      const bottomValue = date.getFullYear();
      bottomValues.push(
        <text
          key={date.getTime()}
          y={altoCabecera * 0.8}
          x={anchoColumna * i + anchoColumna * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== configFecha.fechas[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getFullYear() + 1) * anchoColumna;
        } else {
          xText = (6 + i - date.getFullYear()) * anchoColumna;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={anchoColumna * i}
            y1Line={0}
            y2Line={altoCabecera}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForQuarterYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = altoCabecera * 0.5;
    for (let i = 0; i < configFecha.fechas.length; i++) {
      const date = configFecha.fechas[i];
      // const bottomValue = getLocaleMonth(date, locale);
      const quarter = "Q" + Math.floor((date.getMonth() + 3) / 3);
      bottomValues.push(
        <text
          key={date.getTime()}
          y={altoCabecera * 0.8}
          x={anchoColumna * i + anchoColumna * 0.5}
          className={styles.calendarBottomText}
        >
          {quarter}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== configFecha.fechas[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * anchoColumna;
        } else {
          xText = (6 + i - date.getMonth()) * anchoColumna;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={anchoColumna * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={Math.abs(xText)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = altoCabecera * 0.5;
    for (let i = 0; i < configFecha.fechas.length; i++) {
      const date = configFecha.fechas[i];
      const bottomValue = getLocaleMonth(date, locale);
      bottomValues.push(
        <text
          key={bottomValue + date.getFullYear()}
          y={altoCabecera * 0.8}
          x={anchoColumna * i + anchoColumna * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== configFecha.fechas[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * anchoColumna;
        } else {
          xText = (6 + i - date.getMonth()) * anchoColumna;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={anchoColumna * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount: number = 1;
    const topDefaultHeight = altoCabecera * 0.5;
    const fechas = configFecha.fechas;
    for (let i = fechas.length - 1; i >= 0; i--) {
      const date = fechas[i];
      let topValue = "";
      if (i === 0 || date.getMonth() !== fechas[i - 1].getMonth()) {
        // top
        topValue = `${getLocaleMonth(date, locale)}, ${date.getFullYear()}`;
      }
      // bottom
      const bottomValue = `W${getWeekNumberISO8601(date)}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={altoCabecera * 0.8}
          x={anchoColumna * (i + +rtl)}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );

      if (topValue) {
        // if last day is new month
        if (i !== fechas.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={anchoColumna * i + weeksCount * anchoColumna}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={anchoColumna * i + anchoColumna * weeksCount * 0.5}
              yText={topDefaultHeight * 0.9}
            />
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = altoCabecera * 0.5;
    const fechas = configFecha.fechas;
    for (let i = 0; i < fechas.length; i++) {
      const fecha = fechas[i];
      const bottomValue = `${getLocalDayOfWeek(fecha, locale, "short")}, ${fecha
        .getDate()
        .toString()}`;

      bottomValues.push(
        <text
          key={fecha.getTime()}
          y={altoCabecera * 0.8}
          x={anchoColumna * i + anchoColumna * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i + 1 !== fechas.length &&
        fecha.getMonth() !== fechas[i + 1].getMonth()
      ) {
        const topValue = getLocaleMonth(fecha, locale);

        topValues.push(
          <TopPartOfCalendar
            key={topValue + fecha.getFullYear()}
            value={topValue}
            x1Line={anchoColumna * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              anchoColumna * (i + 1) -
              getDaysInMonth(fecha.getMonth(), fecha.getFullYear()) *
                anchoColumna *
                0.5
            }
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = altoCabecera * 0.5;
    const fechas = configFecha.fechas;
    for (let i = 0; i < fechas.length; i++) {
      const fecha = fechas[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(fecha);

      bottomValues.push(
        <text
          key={fecha.getTime()}
          y={altoCabecera * 0.8}
          x={anchoColumna * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i === 0 || fecha.getDate() !== fechas[i - 1].getDate()) {
        const topValue = `${getLocalDayOfWeek(
          fecha,
          locale,
          "short"
        )}, ${fecha.getDate()} ${getLocaleMonth(fecha, locale)}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + fecha.getFullYear()}
            value={topValue}
            x1Line={anchoColumna * i + ticks * anchoColumna}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={anchoColumna * i + ticks * anchoColumna * 0.5}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = altoCabecera * 0.5;
    const fechas = configFecha.fechas;
    for (let i = 0; i < fechas.length; i++) {
      const fecha = fechas[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(fecha);

      bottomValues.push(
        <text
          key={fecha.getTime()}
          y={altoCabecera * 0.8}
          x={anchoColumna * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i !== 0 && fecha.getDate() !== fechas[i - 1].getDate()) {
        const displayDate = fechas[i - 1];
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          locale,
          "long"
        )}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, locale)}`;
        const topPosition = (fecha.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + displayDate.getFullYear()}
            value={topValue}
            x1Line={anchoColumna * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={anchoColumna * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  switch (configFecha.viewMode) {
    case ViewMode.Year:
      [topValues, bottomValues] = getCalendarValuesForYear();
      break;
    case ViewMode.QuarterYear:
      [topValues, bottomValues] = getCalendarValuesForQuarterYear();
      break;
    case ViewMode.Month:
      [topValues, bottomValues] = getCalendarValuesForMonth();
      break;
    case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues] = getCalendarValuesForDay();
      break;
    case ViewMode.QuarterDay:
    case ViewMode.HalfDay:
      [topValues, bottomValues] = getCalendarValuesForPartOfDay();
      break;
    case ViewMode.Hora:
      [topValues, bottomValues] = getCalendarValuesForHour();
  }
  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={anchoColumna * configFecha.fechas.length}
        height={altoCabecera}
        className={styles.calendarHeader}
      />
      {bottomValues} {topValues}
    </g>
  );
};
