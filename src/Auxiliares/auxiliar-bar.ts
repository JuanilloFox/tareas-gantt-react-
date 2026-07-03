import { Tarea } from "../types/public-types";
import { BarraTareas, TareaTipoInterna } from "../types/barra-tareas";
import { BarMoveAction } from "../types/tareas-gantt-actions";

export const convertirABarraTareas = (
  tareas: Tarea[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  altoTarea: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
) => {
  let barraTareas = tareas.map((t, i) => {
    return convertirABarraTareas(
      t,
      i,
      dates,
      columnWidth,
      rowHeight,
      altoTarea,
      barCornerRadius,
      handleWidth,
      rtl,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      projectProgressColor,
      projectProgressSelectedColor,
      projectBackgroundColor,
      projectBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor
    );
  });

  // set dependencies
  barraTareas = barraTareas.map(tarea => {
    const dependencias = tarea.dependencias || [];
    for (let j = 0; j < dependencias.length; j++) {
      const dependencia = barraTareas.findIndex(
        valor => valor.id === dependencias[j]
      );
      if (dependencia !== -1) barraTareas[dependencia].barChildren.push(tarea);
    }
    return tarea;
  });

  return barraTareas;
};

const convertirABarraTareas = (
  tarea: Tarea,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  altoTarea: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
): BarraTareas => {
  let barraTareas: BarraTareas;
  switch (tarea.tipo) {
    case "milestone":
      barraTareas = convertToMilestone(
        tarea,
        index,
        dates,
        columnWidth,
        rowHeight,
        altoTarea,
        barCornerRadius,
        handleWidth,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor
      );
      break;
    case "proyecto":
      barraTareas = convertToBar(
        tarea,
        index,
        dates,
        columnWidth,
        rowHeight,
        altoTarea,
        barCornerRadius,
        handleWidth,
        rtl,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor
      );
      break;
    default:
      barraTareas = convertToBar(
        tarea,
        index,
        dates,
        columnWidth,
        rowHeight,
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
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
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
    x2 = taskXCoordinateRTL(tarea.inicio, dates, columnWidth);
    x1 = taskXCoordinateRTL(tarea.fin, dates, columnWidth);
  } else {
    x1 = taskXCoordinate(tarea.inicio, dates, columnWidth);
    x2 = taskXCoordinate(tarea.fin, dates, columnWidth);
  }
  let typeInternal: TareaTipoInterna = tarea.tipo;
  if (typeInternal === "tarea" && x2 - x1 < handleWidth * 2) {
    typeInternal = "smalltask";
    x2 = x1 + handleWidth * 2;
  }

  const [progressWidth, progressX] = progressWithByParams(
    x1,
    x2,
    tarea.progreso,
    rtl
  );
  const y = taskYCoordinate(index, rowHeight, altoTarea);
  const hideChildren = tarea.tipo === "proyecto" ? tarea.hideChildren : undefined;

  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor,
    ...tarea.styles,
  };
  return {
    ...tarea,
    typeInternal,
    x1,
    x2,
    y,
    index,
    progressX,
    progressWidth,
    barCornerRadius,
    handleWidth,
    hideChildren,
    height: altoTarea,
    barChildren: [],
    styles,
  };
};

const convertToMilestone = (
  tarea: Tarea,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  altoTarea: number,
  barCornerRadius: number,
  handleWidth: number,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
): BarraTareas => {
  const x = taskXCoordinate(tarea.inicio, dates, columnWidth);
  const y = taskYCoordinate(index, rowHeight, altoTarea);

  const x1 = x - altoTarea * 0.5;
  const x2 = x + altoTarea * 0.5;

  const rotatedHeight = altoTarea / 1.414;
  const styles = {
    backgroundColor: milestoneBackgroundColor,
    backgroundSelectedColor: milestoneBackgroundSelectedColor,
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
    progressX: 0,
    progressWidth: 0,
    barCornerRadius,
    handleWidth,
    typeInternal: tarea.tipo,
    progreso: 0,
    height: rotatedHeight,
    hideChildren: undefined,
    barChildren: [],
    styles,
  };
};

const taskXCoordinate = (xDate: Date, dates: Date[], columnWidth: number) => {
  const index = dates.findIndex(d => d.getTime() >= xDate.getTime()) - 1;

  const remainderMillis = xDate.getTime() - dates[index].getTime();
  const percentOfInterval =
    remainderMillis / (dates[index + 1].getTime() - dates[index].getTime());
  const x = index * columnWidth + percentOfInterval * columnWidth;
  return x;
};
const taskXCoordinateRTL = (
  xDate: Date,
  dates: Date[],
  columnWidth: number
) => {
  let x = taskXCoordinate(xDate, dates, columnWidth);
  x += columnWidth;
  return x;
};
const taskYCoordinate = (
  index: number,
  rowHeight: number,
  altoTarea: number
) => {
  const y = index * rowHeight + (rowHeight - altoTarea) / 2;
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
  progressWidth: number,
  barraTareas: BarraTareas
) => {
  const barWidth = barraTareas.x2 - barraTareas.x1;
  const progressPercent = Math.round((progressWidth * 100) / barWidth);
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
  taskDate: Date,
  xStep: number,
  timeStep: number
) => {
  let newDate = new Date(((x - tareaX) / xStep) * timeStep + taskDate.getTime());
  newDate = new Date(
    newDate.getTime() +
      (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000
  );
  return newDate;
};

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTaskBySVGMouseEvent = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarraTareas,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; tareaCambiada: BarraTareas } => {
  let result: { isChanged: boolean; tareaCambiada: BarraTareas };
  switch (selectedTask.tipo) {
    case "milestone":
      result = handleTaskBySVGMouseEventForMilestone(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );
      break;
    default:
      result = handleTaskBySVGMouseEventForBar(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );
      break;
  }
  return result;
};

const handleTaskBySVGMouseEventForBar = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarraTareas,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean
): { isChanged: boolean; tareaCambiada: BarraTareas } => {
  const tareaCambiada: BarraTareas = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "progreso":
      if (rtl) {
        tareaCambiada.progreso = progressByXRTL(svgX, selectedTask);
      } else {
        tareaCambiada.progreso = progressByX(svgX, selectedTask);
      }
      isChanged = tareaCambiada.progreso !== selectedTask.progreso;
      if (isChanged) {
        const [progressWidth, progressX] = progressWithByParams(
          tareaCambiada.x1,
          tareaCambiada.x2,
          tareaCambiada.progreso,
          rtl
        );
        tareaCambiada.progressWidth = progressWidth;
        tareaCambiada.progressX = progressX;
      }
      break;
    case "inicio": {
      const newX1 = startByX(svgX, xStep, selectedTask);
      tareaCambiada.x1 = newX1;
      isChanged = tareaCambiada.x1 !== selectedTask.x1;
      if (isChanged) {
        if (rtl) {
          tareaCambiada.fin = dateByX(
            newX1,
            selectedTask.x1,
            selectedTask.fin,
            xStep,
            timeStep
          );
        } else {
          tareaCambiada.inicio = dateByX(
            newX1,
            selectedTask.x1,
            selectedTask.inicio,
            xStep,
            timeStep
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          tareaCambiada.x1,
          tareaCambiada.x2,
          tareaCambiada.progreso,
          rtl
        );
        tareaCambiada.progressWidth = progressWidth;
        tareaCambiada.progressX = progressX;
      }
      break;
    }
    case "fin": {
      const newX2 = endByX(svgX, xStep, selectedTask);
      tareaCambiada.x2 = newX2;
      isChanged = tareaCambiada.x2 !== selectedTask.x2;
      if (isChanged) {
        if (rtl) {
          tareaCambiada.inicio = dateByX(
            newX2,
            selectedTask.x2,
            selectedTask.inicio,
            xStep,
            timeStep
          );
        } else {
          tareaCambiada.fin = dateByX(
            newX2,
            selectedTask.x2,
            selectedTask.fin,
            xStep,
            timeStep
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          tareaCambiada.x1,
          tareaCambiada.x2,
          tareaCambiada.progreso,
          rtl
        );
        tareaCambiada.progressWidth = progressWidth;
        tareaCambiada.progressX = progressX;
      }
      break;
    }
    case "mover": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        tareaCambiada.inicio = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.inicio,
          xStep,
          timeStep
        );
        tareaCambiada.fin = dateByX(
          newMoveX2,
          selectedTask.x2,
          selectedTask.fin,
          xStep,
          timeStep
        );
        tareaCambiada.x1 = newMoveX1;
        tareaCambiada.x2 = newMoveX2;
        const [progressWidth, progressX] = progressWithByParams(
          tareaCambiada.x1,
          tareaCambiada.x2,
          tareaCambiada.progreso,
          rtl
        );
        tareaCambiada.progressWidth = progressWidth;
        tareaCambiada.progressX = progressX;
      }
      break;
    }
  }
  return { isChanged, tareaCambiada };
};

const handleTaskBySVGMouseEventForMilestone = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarraTareas,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number
): { isChanged: boolean; tareaCambiada: BarraTareas } => {
  const tareaCambiada: BarraTareas = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "mover": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        tareaCambiada.inicio = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.inicio,
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
