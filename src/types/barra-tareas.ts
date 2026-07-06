import { Tarea, TipoTarea } from "./public-types";

export interface BarraTareas extends Tarea {
  index: number;
  tipoInterno: TareaTipoInterna;
  x1: number;
  x2: number;
  y: number;
  Alto: number;
  progresoX: number;
  anchoProgreso: number;
  barCornerRadius: number;
  handleWidth: number;
  barraHijos: BarraTareas[];
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
}

export type TareaTipoInterna = TipoTarea | "smalltask";
