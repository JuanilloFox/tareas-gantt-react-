import { Tarea, TipoTarea } from "./public-types";

export interface BarraTareas extends Tarea {
  index: number;
  typeInternal: TareaTipoInterna;
  x1: number;
  x2: number;
  y: number;
  height: number;
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  handleWidth: number;
  barChildren: BarraTareas[];
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
}

export type TareaTipoInterna = TipoTarea | "smalltask";
