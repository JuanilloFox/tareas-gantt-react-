import React from "react";
import { BarraTareas } from "../../types/barra-tareas";

type ArrowProps = {
  tareaDesde: BarraTareas;
  tareaHasta: BarraTareas;
  altoFila: number;
  altoTarea: number;
  arrowIndent: number;
  rtl: boolean;
};
export const Arrow: React.FC<ArrowProps> = ({
  tareaDesde,
  tareaHasta,
  altoFila,
  altoTarea,
  arrowIndent,
  rtl,
}) => {
  let path: string;
  let trianglePoints: string;
  if (rtl) {
    [path, trianglePoints] = drownPathAndTriangleRTL(
      tareaDesde,
      tareaHasta,
      altoFila,
      altoTarea,
      arrowIndent
    );
  } else {
    [path, trianglePoints] = drownPathAndTriangle(
      tareaDesde,
      tareaHasta,
      altoFila,
      altoTarea,
      arrowIndent
    );
  }

  return (
    <g className="arrow">
      <path strokeWidth="1.5" d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  );
};

const drownPathAndTriangle = (
  tareaDesde: BarraTareas,
  tareaHasta: BarraTareas,
  altoFila: number,
  altoTarea: number,
  arrowIndent: number
) => {
  const indexCompare = tareaDesde.index > tareaHasta.index ? -1 : 1;
  const tareaAPosicionFinal = tareaHasta.y + altoTarea / 2;
  const tareaDesdePosicionFinal = tareaDesde.x2 + arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    tareaDesdePosicionFinal < tareaHasta.x1 ? "" : `H ${tareaHasta.x1 - arrowIndent}`;
  const taskToHorizontalOffsetValue =
    tareaDesdePosicionFinal > tareaHasta.x1
      ? arrowIndent
      : tareaHasta.x1 - tareaDesde.x2 - arrowIndent;

  const path = `M ${tareaDesde.x2} ${tareaDesde.y + altoTarea / 2}
  h ${arrowIndent}
  v ${(indexCompare * altoFila) / 2}
  ${taskFromHorizontalOffsetValue}
  V ${tareaAPosicionFinal}
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${tareaHasta.x1},${tareaAPosicionFinal}
  ${tareaHasta.x1 - 5},${tareaAPosicionFinal - 5}
  ${tareaHasta.x1 - 5},${tareaAPosicionFinal + 5}`;
  return [path, trianglePoints];
};

const drownPathAndTriangleRTL = (
  tareaDesde: BarraTareas,
  tareaHasta: BarraTareas,
  altoFila: number,
  altoTarea: number,
  arrowIndent: number
) => {
  const indexCompare = tareaDesde.index > tareaHasta.index ? -1 : 1;
  const tareaAPosicionFinal = tareaHasta.y + altoTarea / 2;
  const tareaDesdePosicionFinal = tareaDesde.x1 - arrowIndent * 2;
  const taskFromHorizontalOffsetValue =
    tareaDesdePosicionFinal > tareaHasta.x2 ? "" : `H ${tareaHasta.x2 + arrowIndent}`;
  const taskToHorizontalOffsetValue =
    tareaDesdePosicionFinal < tareaHasta.x2
      ? -arrowIndent
      : tareaHasta.x2 - tareaDesde.x1 + arrowIndent;

  const path = `M ${tareaDesde.x1} ${tareaDesde.y + altoTarea / 2}
  h ${-arrowIndent}
  v ${(indexCompare * altoFila) / 2}
  ${taskFromHorizontalOffsetValue}
  V ${tareaAPosicionFinal}
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${tareaHasta.x2},${tareaAPosicionFinal}
  ${tareaHasta.x2 + 5},${tareaAPosicionFinal + 5}
  ${tareaHasta.x2 + 5},${tareaAPosicionFinal - 5}`;
  return [path, trianglePoints];
};
