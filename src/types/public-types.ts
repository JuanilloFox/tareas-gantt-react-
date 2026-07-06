export enum ViewMode {
  Hora = "Hora",
  QuarterDay = "Cuarto de Día",
  HalfDay = "Medio Día",
  Day = "Día",
  /** ISO-8601 week */
  Week = "Semana",
  Month = "Mes",
  QuarterYear = "Cuarto de Año",
  Year = "Año",
}
export type TipoTarea = "tarea" | "hito" | "proyecto";
export interface Tarea {
  id: string;
  tipo: TipoTarea;
  nombre: string;
  inicio: Date;
  fin: Date;
  /**
   * Desde 0 a 100
   */
  progreso: number;
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  desactivada?: boolean;
  proyecto?: string;
  dependencias?: string[];
  ocultarHijos?: boolean;
  ordenVisual?: number;
}

export interface EventOption {
  /**
   * Valor del intervalo de tiempo para los cambios de fecha.
   */
  timeStep?: number;
  /**
   * Se activa al seleccionar o deseleccionar la barra.
   */
  onSelect?: (tarea: Tarea, isSelected: boolean) => void;
  /**
   * Se activa al hacer doble clic en la barra.
   */
  onDoubleClick?: (tarea: Tarea) => void;
  /**
   * Invokes on bar click.
   */
  onClick?: (tarea: Tarea) => void;
  /**
   * Invoca el cambio de hora de inicio y fin.
   * El gráfico deshace la operación si el método devuelve falso o error.
   */
  onDateChange?: (
    tarea: Tarea,
    hijos: Tarea[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Se activa al cambiar el progreso.
   * El gráfico deshace la operación si el método devuelve falso o un error.
   */
  onProgressChange?: (
    tarea: Tarea,
    hijos: Tarea[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Se activa al eliminar la tarea seleccionada.
   * El gráfico deshace la operación si el método devuelve falso o un error.
   */
  onDelete?: (tarea: Tarea) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Se invoca en el expansor en la lista de tareas
   */
  onExpanderClick?: (tarea: Tarea) => void;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  vistaFecha?: Date;
  preStepsCount?: number;
  /**
   * Especifica el idioma del nombre del mes. Formatos compatibles: ISO 639-2, Java Locale
   */
  locale?: string;
  rtl?: boolean;
}

export interface StylingOption {
  altoCabecera?: number;
  anchoColumna?: number;
  listCellWidth?: string;
  altoFila?: number;
  alturaGantt?: number;
  barCornerRadius?: number;
  handleWidth?: number;
  fontFamily?: string;
  fontSize?: string;
  /**
   * ¿Cuántas filas de ancho puede ocupar una tarea?
   * Desde 0 a 100
   */
  barFill?: number;
  barProgressColor?: string;
  barProgressSelectedColor?: string;
  barBackgroundColor?: string;
  barBackgroundSelectedColor?: string;
  proyectoProgressColor?: string;
  proyectoProgressSelectedColor?: string;
  proyectoBackgroundColor?: string;
  proyectoBackgroundSelectedColor?: string;
  hitoBackgroundColor?: string;
  hitoBackgroundSelectedColor?: string;
  arrowColor?: string;
  arrowIndent?: number;
  todayColor?: string;
  TooltipContent?: React.FC<{
    tarea: Tarea;
    fontSize: string;
    fontFamily: string;
  }>;
  CabeceraListaTareas?: React.FC<{
    altoCabecera: number;
    anchoFila: string;
    fontFamily: string;
    fontSize: string;
  }>;
  TablaListaTareas?: React.FC<{
    altoFila: number;
    anchoFila: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tareas: Tarea[];
    tareaSeleccionadaId: string;
    /**
     * Establece la tarea seleccionada por ID
     */
    setTareaSeleccionada: (tareaId: string) => void;
    onExpanderClick: (tarea: Tarea) => void;
  }>;
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  tareas: Tarea[];
}
