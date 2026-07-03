import { BarraTareas } from "./barra-tareas";

export type BarMoveAction = "progreso" | "fin" | "inicio" | "mover";
export type GanttContentMoveAction =
  | "mouseenter"
  | "mouseleave"
  | "delete"
  | "dblclick"
  | "click"
  | "select"
  | ""
  | BarMoveAction;

export type GanttEvent = {
  tareaCambiada?: BarraTareas;
  originalSelectedTask?: BarraTareas;
  action: GanttContentMoveAction;
};
