import React, { useRef, useEffect, useState } from "react";
import { Tarea } from "../../types/public-types";
import { BarraTareas } from "../../types/barra-tareas";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  tarea: BarraTareas;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  altoCabecera: number;
  anchoListaTareas: number;
  scrollX: number;
  scrollY: number;
  altoFila: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    tarea: Tarea;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  tarea,
  altoFila,
  rtl,
  svgContainerHeight,
  svgContainerWidth,
  scrollX,
  scrollY,
  arrowIndent,
  fontSize,
  fontFamily,
  altoCabecera,
  anchoListaTareas,
  TooltipContent,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let newRelatedY = tarea.index * altoFila - scrollY + altoCabecera;
      let newRelatedX: number;
      if (rtl) {
        newRelatedX = tarea.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
        if (newRelatedX < 0) {
          newRelatedX = tarea.x2 + arrowIndent * 1.5 - scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > svgContainerWidth) {
          newRelatedX = svgContainerWidth - tooltipWidth;
          newRelatedY += altoFila;
        }
      } else {
        newRelatedX = tarea.x2 + arrowIndent * 1.5 + anchoListaTareas - scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = anchoListaTareas + svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX =
            tarea.x1 +
            anchoListaTareas -
            arrowIndent * 1.5 -
            scrollX -
            tooltipWidth;
        }
        if (newRelatedX < anchoListaTareas) {
          newRelatedX = svgContainerWidth + anchoListaTareas - tooltipWidth;
          newRelatedY += altoFila;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedY = svgContainerHeight - tooltipHeight;
      }
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [
    tooltipRef,
    tarea,
    arrowIndent,
    scrollX,
    scrollY,
    altoCabecera,
    anchoListaTareas,
    altoFila,
    svgContainerHeight,
    svgContainerWidth,
    rtl,
  ]);

  return (
    <div
      ref={tooltipRef}
      className={
        relatedX
          ? styles.tooltipDetailsContainer
          : styles.tooltipDetailsContainerHidden
      }
      style={{ left: relatedX, top: relatedY }}
    >
      <TooltipContent tarea={tarea} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  tarea: Tarea;
  fontSize: string;
  fontFamily: string;
}> = ({ tarea, fontSize, fontFamily }) => {
  const style = {
    fontSize,
    fontFamily,
  };
  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      <b style={{ fontSize: fontSize + 6 }}>{`${
        tarea.nombre
      }: ${tarea.inicio.getDate()}-${
        tarea.inicio.getMonth() + 1
      }-${tarea.inicio.getFullYear()} - ${tarea.fin.getDate()}-${
        tarea.fin.getMonth() + 1
      }-${tarea.fin.getFullYear()}`}</b>
      {tarea.fin.getTime() - tarea.inicio.getTime() !== 0 && (
        <p className={styles.tooltipDefaultContainerParagraph}>{`Duración: ${~~(
          (tarea.fin.getTime() - tarea.inicio.getTime()) /
          (1000 * 60 * 60 * 24)
        )} día(s)`}</p>
      )}

      <p className={styles.tooltipDefaultContainerParagraph}>
        {!!tarea.progreso && `Progreso: ${tarea.progreso} %`}
      </p>
    </div>
  );
};
