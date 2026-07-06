import React, { ReactChild } from "react";
import { Tarea } from "../../types/public-types";
import { agregarAFecha } from "../../Auxiliares/auxiliar-fecha";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tareas: Tarea[];
  fechas: Date[];
  svgWidth: number;
  altoFila: number;
  anchoColumna: number;
  todayColor: string;
  rtl: boolean;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tareas,
  fechas,
  altoFila,
  svgWidth,
  anchoColumna,
  todayColor,
  rtl,
}) => {
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const tarea of tareas) {
    gridRows.push(
      <rect
        key={"Row" + tarea.id}
        x="0"
        y={y}
        width={svgWidth}
        height={altoFila}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + tarea.id}
        x="0"
        y1={y + altoFila}
        x2={svgWidth}
        y2={y + altoFila}
        className={styles.gridRowLine}
      />
    );
    y += altoFila;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  let today: ReactChild = <rect />;
  for (let i = 0; i < fechas.length; i++) {
    const date = fechas[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );
    if (
      (i + 1 !== fechas.length &&
        date.getTime() < now.getTime() &&
        fechas[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === fechas.length &&
        date.getTime() < now.getTime() &&
        agregarAFecha(
          date,
          date.getTime() - fechas[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect
          x={tickX}
          y={0}
          width={anchoColumna}
          height={y}
          fill={todayColor}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== fechas.length &&
      date.getTime() >= now.getTime() &&
      fechas[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + anchoColumna}
          y={0}
          width={anchoColumna}
          height={y}
          fill={todayColor}
        />
      );
    }
    tickX += anchoColumna;
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
    </g>
  );
};
