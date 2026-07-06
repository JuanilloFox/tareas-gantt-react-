import { Tarea } from "../types/public-types";
import { BarraTareas, TareaTipoInterna } from "../types/barra-tareas";
import { BarMoveAction } from "../types/tareas-gantt-actions";

export const convertirABarrasTareas = (
  tareas: Tarea[],
  fechas: Date[],
  anchoColumna: number,
  altoFila: number,
  altoTarea: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  proyectoProgressColor: string,
  proyectoProgressSelectedColor: string,
  proyectoBackgroundColor: string,
  proyectoBackgroundSelectedColor: string,
  hitoBackgroundColor: string,
  hitoBackgroundSelectedColor: string
) => {
  let barraTareas = tareas.map((t, i) => {
    return convertirABarraTareas(
      t,
      i,
      fechas,
      anchoColumna,
      altoFila,
      altoTarea,
      barCornerRadius,
      handleWidth,
      rtl,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      proyectoProgressColor,
      proyectoProgressSelectedColor,
      proyectoBackgroundColor,
      proyectoBackgroundSelectedColor,
      hitoBackgroundColor,
      hitoBackgroundSelectedColor
    );
  });

  // establecer depencias
  barraTareas = barraTareas.map(tarea => {
    const dependencias = tarea.dependencias || [];
    for (let j = 0; j < dependencias.length; j++) {
      const dependencia = barraTareas.findIndex(
        valor => valor.id === dependencias[j]
      );
      if (dependencia !== -1) barraTareas[dependencia].barraHijos.push(tarea);
    }
    return tarea;
  });

  return barraTareas;
};

const convertirABarraTareas = (
  tarea: Tarea,
  index: number,
  fechas: Date[],
  anchoColumna: number,
  altoFila: number,
  altoTarea: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  proyectoProgressColor: string,
  proyectoProgressSelectedColor: string,
  proyectoBackgroundColor: string,
  proyectoBackgroundSelectedColor: string,
  hitoBackgroundColor: string,
  hitoBackgroundSelectedColor: string
): BarraTareas => {
  let barraTareas: BarraTareas;
  switch (tarea.tipo) {
    case "hito":
      barraTareas = convertirAHito(
        tarea,
        index,
        fechas,
        anchoColumna,
        altoFila,
        altoTarea,
        barCornerRadius,
        handleWidth,
        hitoBackgroundColor,
        hitoBackgroundSelectedColor
      );
      break;
    case "proyecto":
      barraTareas = convertToBar(
        tarea,
        index,
        fechas,
        anchoColumna,
        altoFila,
        altoTarea,
        barCornerRadius,
        handleWidth,
        rtl,
        proyectoProgressColor,
        proyectoProgressSelectedColor,
        proyectoBackgroundColor,
        proyectoBackgroundSelectedColor
      );
      break;
    default:
      barraTareas = convertToBar(
        tarea,
        index,
        fechas,
        anchoColumna,
        altoFila,
        altoTarea,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor
      );
      break;
  }
  return barraTareas;
};

const convertToBar = (
  tarea: Tarea,
  index: number,
  fechas: Date[],
  anchoColumna: number,
  altoFila: number,
  altoTarea: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string
): BarraTareas => {
  let x1: number;
  let x2: number;
  if (rtl) {
    x2 = CoordenadaXTareaRTL(tarea.inicio, fechas, anchoColumna);
    x1 = CoordenadaXTareaRTL(tarea.fin, fechas, anchoColumna);
  } else {
    x1 = CoordenadaXTarea(tarea.inicio, fechas, anchoColumna);
    x2 = CoordenadaXTarea(tarea.fin, fechas, anchoColumna);
  }
  let tipoInterno: TareaTipoInterna = tarea.tipo;
  if (tipoInterno === "tarea" && x2 - x1 < handleWidth * 2) {
    tipoInterno = "smalltask";
    x2 = x1 + handleWidth * 2;
  }

  const [anchoProgreso, progresoX] = progressWithByParams(
    x1,
    x2,
    tarea.progreso,
    rtl
  );
  const y = CoordenadaYTarea(index, altoFila, altoTarea);
  const ocultarHijos = tarea.tipo === "proyecto" ? tarea.ocultarHijos : undefined;

  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor,
    ...tarea.styles,
  };
  return {
    ...tarea,
    tipoInterno,
    x1,
    x2,
    y,
    index,
    progresoX,
    anchoProgreso,
    barCornerRadius,
    handleWidth,
    ocultarHijos,
    Alto: altoTarea,
    barraHijos: [],
    styles,
  };
};

const convertirAHito = (
  tarea: Tarea,
  index: number,
  fechas: Date[],
  anchoColumna: number,
  altoFila: number,
  altoTarea: number,
  barCornerRadius: number,
  handleWidth: number,
  hitoBackgroundColor: string,
  hitoBackgroundSelectedColor: string
): BarraTareas => {
  const x = CoordenadaXTarea(tarea.inicio, fechas, anchoColumna);
  const y = CoordenadaYTarea(index, altoFila, altoTarea);

  const x1 = x - altoTarea * 0.5;
  const x2 = x + altoTarea * 0.5;

  const rotatedHeight = altoTarea / 1.414;
  const styles = {
    backgroundColor: hitoBackgroundColor,
    backgroundSelectedColor: hitoBackgroundSelectedColor,
    progressColor: "",
    progressSelectedColor: "",
    ...tarea.styles,
  };
  return {
    ...tarea,
    fin: tarea.inicio,
    x1,
    x2,
    y,
    index,
    progresoX: 0,
    anchoProgreso: 0,
    barCornerRadius,
    handleWidth,
    tipoInterno: tarea.tipo,
    progreso: 0,
    Alto: rotatedHeight,
    ocultarHijos: undefined,
    barraHijos: [],
    styles,
  };
};

const CoordenadaXTarea = (xDate: Date, fechas: Date[], anchoColumna: number) => {
  const index = fechas.findIndex(d => d.getTime() >= xDate.getTime()) - 1;

  const remainderMillis = xDate.getTime() - fechas[index].getTime();
  const percentOfInterval =
    remainderMillis / (fechas[index + 1].getTime() - fechas[index].getTime());
  const x = index * anchoColumna + percentOfInterval * anchoColumna;
  return x;
};
const CoordenadaXTareaRTL = (
  xDate: Date,
  fechas: Date[],
  anchoColumna: number
) => {
  let x = CoordenadaXTarea(xDate, fechas, anchoColumna);
  x += anchoColumna;
  return x;
};
const CoordenadaYTarea = (
  index: number,
  altoFila: number,
  altoTarea: number
) => {
  const y = index * altoFila + (altoFila - altoTarea) / 2;
  return y;
};

export const progressWithByParams = (
  tareaX1: number,
  tareaX2: number,
  progreso: number,
  rtl: boolean
) => {
  const progresoWidth = (tareaX2 - tareaX1) * progreso * 0.01;
  let progresoX: number;
  if (rtl) {
    progresoX = tareaX2 - progresoWidth;
  } else {
    progresoX = tareaX1;
  }
  return [progresoWidth, progresoX];
};

export const progressByProgressWidth = (
  anchoProgreso: number,
  barraTareas: BarraTareas
) => {
  const barWidth = barraTareas.x2 - barraTareas.x1;
  const progressPercent = Math.round((anchoProgreso * 100) / barWidth);
  if (progressPercent >= 100) return 100;
  else if (progressPercent <= 0) return 0;
  else return progressPercent;
};

const progressByX = (x: number, tarea: BarraTareas) => {
  if (x >= tarea.x2) return 100;
  else if (x <= tarea.x1) return 0;
  else {
    const barWidth = tarea.x2 - tarea.x1;
    const progressPercent = Math.round(((x - tarea.x1) * 100) / barWidth);
    return progressPercent;
  }
};
const progressByXRTL = (x: number, tarea: BarraTareas) => {
  if (x >= tarea.x2) return 0;
  else if (x <= tarea.x1) return 100;
  else {
    const barWidth = tarea.x2 - tarea.x1;
    const progressPercent = Math.round(((tarea.x2 - x) * 100) / barWidth);
    return progressPercent;
  }
};

export const getProgressPoint = (
  progresoX: number,
  tareaY: number,
  altoTarea: number
) => {
  const point = [
    progresoX - 5,
    tareaY + altoTarea,
    progresoX + 5,
    tareaY + altoTarea,
    progresoX,
    tareaY + altoTarea - 8.66,
  ];
  return point.join(",");
};

const startByX = (x: number, xStep: number, tarea: BarraTareas) => {
  if (x >= tarea.x2 - tarea.handleWidth * 2) {
    x = tarea.x2 - tarea.handleWidth * 2;
  }
  const steps = Math.round((x - tarea.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX = tarea.x1 + additionalXValue;
  return newX;
};

const endByX = (x: number, xStep: number, tarea: BarraTareas) => {
  if (x <= tarea.x1 + tarea.handleWidth * 2) {
    x = tarea.x1 + tarea.handleWidth * 2;
  }
  const steps = Math.round((x - tarea.x2) / xStep);
  const additionalXValue = steps * xStep;
  const newX = tarea.x2 + additionalXValue;
  return newX;
};

const moveByX = (x: number, xStep: number, tarea: BarraTareas) => {
  const steps = Math.round((x - tarea.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1 = tarea.x1 + additionalXValue;
  const newX2 = newX1 + tarea.x2 - tarea.x1;
  return [newX1, newX2];
};

const dateByX = (
  x: number,
  tareaX: number,
  fechaTarea: Date,
  xStep: number,
  timeStep: number
) => {
  let newDate = new Date(((x - tareaX) / xStep) * timeStep + fechaTarea.getTime());
  newDate = new Date(
    newDate.getTime() +
      (newDate.getTimezoneOffset() - fechaTarea.getTimezoneOffset()) * 60000
  );
  return newDate;
};

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTareaPorEventoRatonSVG = (
  svgX: number,
  action: BarMoveAction,
  tareaSeleccionada: BarraTareas,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; tareaCambiada: BarraTareas } => {
  let result: { isChanged: boolean; tareaCambiada: BarraTareas };
  switch (tareaSeleccionada.tipo) {
    case "hito":
      result = handleTareaPorEventoRatonSVGPorHito(
        svgX,
        action,
        tareaSeleccionada,
        xStep,
        timeStep,
        initEventX1Delta
      );
      break;
    default:
      result = handleTareaPorEventoRatonSVGPorBarra(
        svgX,
        action,
        tareaSeleccionada,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );
      break;
  }
  return result;
};

const handleTareaPorEventoRatonSVGPorBarra = (
  svgX: number,
  action: BarMoveAction,
  tareaSeleccionada: BarraTareas,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; tareaCambiada: BarraTareas } => {
  const tareaCambiada: BarraTareas = { ...tareaSeleccionada };
  let isChanged = false;
  switch (action) {
    case "progreso":
      if (rtl) {
        tareaCambiada.progreso = progressByXRTL(svgX, tareaSeleccionada);
      } else {
        tareaCambiada.progreso = progressByX(svgX, tareaSeleccionada);
      }
      isChanged = tareaCambiada.progreso !== tareaSeleccionada.progreso;
      if (isChanged) {
        const [anchoProgreso, progresoX] = progressWithByParams(
          tareaCambiada.x1,
          tareaCambiada.x2,
          tareaCambiada.progreso,
          rtl
        );
        tareaCambiada.anchoProgreso  = anchoProgreso;
        tareaCambiada.progresoX = progresoX;
      }
      break;
    case "inicio": {
      const newX1 = startByX(svgX, xStep, tareaSeleccionada);
      tareaCambiada.x1 = newX1;
      isChanged = tareaCambiada.x1 !== tareaSeleccionada.x1;
      if (isChanged) {
        if (rtl) {
          tareaCambiada.fin = dateByX(
            newX1,
            tareaSeleccionada.x1,
            tareaSeleccionada.fin,
            xStep,
            timeStep
          );
        } else {
          tareaCambiada.inicio = dateByX(
            newX1,
            tareaSeleccionada.x1,
            tareaSeleccionada.inicio,
            xStep,
            timeStep
          );
        }
        const [anchoProgreso, progresoX] = progressWithByParams(
          tareaCambiada.x1,
          tareaCambiada.x2,
          tareaCambiada.progreso,
          rtl
        );
        tareaCambiada.anchoProgreso  = anchoProgreso;
        tareaCambiada.progresoX = progresoX;
      }
      break;
    }
    case "fin": {
      const newX2 = endByX(svgX, xStep, tareaSeleccionada);
      tareaCambiada.x2 = newX2;
      isChanged = tareaCambiada.x2 !== tareaSeleccionada.x2;
      if (isChanged) {
        if (rtl) {
          tareaCambiada.inicio = dateByX(
            newX2,
            tareaSeleccionada.x2,
            tareaSeleccionada.inicio,
            xStep,
            timeStep
          );
        } else {
          tareaCambiada.fin = dateByX(
            newX2,
            tareaSeleccionada.x2,
            tareaSeleccionada.fin,
            xStep,
            timeStep
          );
        }
        const [anchoProgreso, progresoX] = progressWithByParams(
          tareaCambiada.x1,
          tareaCambiada.x2,
          tareaCambiada.progreso,
          rtl
        );
        tareaCambiada.anchoProgreso  = anchoProgreso;
        tareaCambiada.progresoX = progresoX;
      }
      break;
    }
    case "mover": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        tareaSeleccionada
      );
      isChanged = newMoveX1 !== tareaSeleccionada.x1;
      if (isChanged) {
        tareaCambiada.inicio = dateByX(
          newMoveX1,
          tareaSeleccionada.x1,
          tareaSeleccionada.inicio,
          xStep,
          timeStep
        );
        tareaCambiada.fin = dateByX(
          newMoveX2,
          tareaSeleccionada.x2,
          tareaSeleccionada.fin,
          xStep,
          timeStep
        );
        tareaCambiada.x1 = newMoveX1;
        tareaCambiada.x2 = newMoveX2;
        const [anchoProgreso, progresoX] = progressWithByParams(
          tareaCambiada.x1,
          tareaCambiada.x2,
          tareaCambiada.progreso,
          rtl
        );
        tareaCambiada.anchoProgreso  = anchoProgreso;
        tareaCambiada.progresoX = progresoX;
      }
      break;
    }
  }
  return { isChanged, tareaCambiada };
};

const handleTareaPorEventoRatonSVGPorHito = (
  svgX: number,
  action: BarMoveAction,
  tareaSeleccionada: BarraTareas,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number
): { isChanged: boolean; tareaCambiada: BarraTareas } => {
  const tareaCambiada: BarraTareas = { ...tareaSeleccionada };
  let isChanged = false;
  switch (action) {
    case "mover": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        tareaSeleccionada
      );
      isChanged = newMoveX1 !== tareaSeleccionada.x1;
      if (isChanged) {
        tareaCambiada.inicio = dateByX(
          newMoveX1,
          tareaSeleccionada.x1,
          tareaSeleccionada.inicio,
          xStep,
          timeStep
        );
        tareaCambiada.fin = tareaCambiada.inicio;
        tareaCambiada.x1 = newMoveX1;
        tareaCambiada.x2 = newMoveX2;
      }
      break;
    }
  }
  return { isChanged, tareaCambiada };
};
