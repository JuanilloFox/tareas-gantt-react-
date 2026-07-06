import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { ViewMode, GanttProps, Tarea } from "../../types/public-types";
import { GridProps } from "../grid/grid";
import { ganttDateRange, semillaFechas } from "../../Auxiliares/auxiliar-fecha";
import { CalendarProps } from "../calendar/calendar";
import { TareaGanttContentProps } from "./tarea-gantt-content";
import { CabeceraListaTareasPredeterminada } from "../lista-tareas/lista-tareas-header";
import { TablaListaTareasPredeterminada } from "../lista-tareas/lista-tareas-table";
import { StandardTooltipContent, Tooltip } from "../other/tooltip";
import { VerticalScroll } from "../other/vertical-scroll";
import { ListaTareasProps, ListaTareas } from "../lista-tareas/lista-tareas";
import { TareaGantt } from "./tarea-gantt";
import { BarraTareas } from "../../types/barra-tareas";
import { convertirABarrasTareas } from "../../Auxiliares/auxiliar-bar";
import { GanttEvent } from "../../types/tareas-gantt-actions";
import { ConfigFecha } from "../../types/date-setup";
import { HorizontalScroll } from "../other/horizontal-scroll";
import { retirarTareasOcultas, ordenarTareas } from "../../Auxiliares/otros-auxiliares";
import styles from "./gantt.module.css";

export const Gantt: React.FunctionComponent<GanttProps> = ({
  tareas,
  altoCabecera = 50,
  anchoColumna = 60,
  listCellWidth = "155px",
  altoFila = 50,
  alturaGantt = 0,
  viewMode = ViewMode.Day,
  preStepsCount = 1,
  locale = "es-ES",
  barFill = 60,
  barCornerRadius = 3,
  barProgressColor = "#a3a3ff",
  barProgressSelectedColor = "#8282f5",
  barBackgroundColor = "#b8c2cc",
  barBackgroundSelectedColor = "#aeb8c2",
  proyectoProgressColor = "#7db59a",
  proyectoProgressSelectedColor = "#59a985",
  proyectoBackgroundColor = "#fac465",
  proyectoBackgroundSelectedColor = "#f7bb53",
  hitoBackgroundColor = "#f1c453",
  hitoBackgroundSelectedColor = "#f29e4c",
  rtl = false,
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = "grey",
  fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
  fontSize = "14px",
  arrowIndent = 20,
  todayColor = "rgba(252, 248, 227, 0.5)",
  vistaFecha,
  TooltipContent = StandardTooltipContent,
  CabeceraListaTareas = CabeceraListaTareasPredeterminada,
  TablaListaTareas = TablaListaTareasPredeterminada,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
  onSelect,
  onExpanderClick,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listaTareasRef = useRef<HTMLDivElement>(null);
  const [configFecha, setConfigFecha] = useState<ConfigFecha>(() => {
    const [fechaInicio, fechaFin] = ganttDateRange(tareas, viewMode, preStepsCount);
    return { viewMode, fechas: semillaFechas(fechaInicio, fechaFin, viewMode) };
  });
  const [vistaFechaActual, setVistaFechaActual] = useState<Date | undefined>(
    undefined
  );

  const [anchoListaTareas, setAnchoListaTareas] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(alturaGantt);
  const [barraTareas, setBarraTareas] = useState<BarraTareas[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: "",
  });
  const altoTarea = useMemo(
    () => (altoFila * barFill) / 100,
    [altoFila, barFill]
  );

  const [tareaSeleccionada, setTareaSeleccionada] = useState<BarraTareas>();
  const [tareaFallida, setTareaFallida] = useState<BarraTareas | null>(null);

  const svgWidth = configFecha.fechas.length * anchoColumna;
  const ganttFullHeight = barraTareas.length * altoFila;

  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(-1);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);

  // eventos cambio de tarea
  useEffect(() => {
    let tareasFiltradas: Tarea[];
    if (onExpanderClick) {
      tareasFiltradas = retirarTareasOcultas(tareas);
    } else {
      tareasFiltradas = tareas;
    }
    tareasFiltradas = tareasFiltradas.sort(ordenarTareas);
    const [fechaInicio, fechaFin] = ganttDateRange(
      tareasFiltradas,
      viewMode,
      preStepsCount
    );
    let nuevasFechas = semillaFechas(fechaInicio, fechaFin, viewMode);
    if (rtl) {
      nuevasFechas = nuevasFechas.reverse();
      if (scrollX === -1) {
        setScrollX(nuevasFechas.length * anchoColumna);
      }
    }
    setConfigFecha({ fechas: nuevasFechas, viewMode });
    setBarraTareas(
      convertirABarrasTareas(
        tareasFiltradas,
        nuevasFechas,
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
      )
    );
  }, [
    tareas,
    viewMode,
    preStepsCount,
    altoFila,
    barCornerRadius,
    anchoColumna,
    altoTarea,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    proyectoProgressColor,
    proyectoProgressSelectedColor,
    proyectoBackgroundColor,
    proyectoBackgroundSelectedColor,
    hitoBackgroundColor,
    hitoBackgroundSelectedColor,
    rtl,
    scrollX,
    onExpanderClick,
  ]);

  useEffect(() => {
    if (
      viewMode === configFecha.viewMode &&
      ((vistaFecha && !vistaFechaActual) ||
        (vistaFecha && vistaFechaActual?.valueOf() !== vistaFecha.valueOf()))
    ) {
      const fechas = configFecha.fechas;
      const index = fechas.findIndex(
        (d, i) =>
          vistaFecha.valueOf() >= d.valueOf() &&
          i + 1 !== fechas.length &&
          vistaFecha.valueOf() < fechas[i + 1].valueOf()
      );
      if (index === -1) {
        return;
      }
      setVistaFechaActual(vistaFecha);
      setScrollX(anchoColumna * index);
    }
  }, [
    vistaFecha,
    anchoColumna,
    configFecha.fechas,
    configFecha.viewMode,
    viewMode,
    vistaFechaActual,
    setVistaFechaActual,
  ]);

  useEffect(() => {
    const { tareaCambiada, action } = ganttEvent;
    if (tareaCambiada) {
      if (action === "delete") {
        setGanttEvent({ action: "" });
        setBarraTareas(barraTareas.filter(t => t.id !== tareaCambiada.id));
      } else if (
        action === "mover" ||
        action === "fin" ||
        action === "inicio" ||
        action === "progreso"
      ) {
        const prevEstadoTarea = barraTareas.find(t => t.id === tareaCambiada.id);
        if (
          prevEstadoTarea &&
          (prevEstadoTarea.inicio.getTime() !== tareaCambiada.inicio.getTime() ||
            prevEstadoTarea.fin.getTime() !== tareaCambiada.fin.getTime() ||
            prevEstadoTarea.progreso !== tareaCambiada.progreso)
        ) {
          // actions for change
          const nuevaListaTareas = barraTareas.map(t =>
            t.id === tareaCambiada.id ? tareaCambiada : t
          );
          setBarraTareas(nuevaListaTareas);
        }
      }
    }
  }, [ganttEvent, barraTareas]);

  useEffect(() => {
    if (tareaFallida) {
      setBarraTareas(barraTareas.map(t => (t.id !== tareaFallida.id ? t : tareaFallida)));
      setTareaFallida(null);
    }
  }, [tareaFallida, barraTareas]);

  useEffect(() => {
    if (!listCellWidth) {
      setAnchoListaTareas(0);
    }
    if (listaTareasRef.current) {
      setAnchoListaTareas(listaTareasRef.current.offsetWidth);
    }
  }, [listaTareasRef, listCellWidth]);

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - anchoListaTareas);
    }
  }, [wrapperRef, anchoListaTareas]);

  useEffect(() => {
    if (alturaGantt) {
      setSvgContainerHeight(alturaGantt + altoCabecera);
    } else {
      setSvgContainerHeight(tareas.length * altoFila + altoCabecera);
    }
  }, [alturaGantt, tareas, altoCabecera, altoFila]);

  // scroll events
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollX = scrollX + scrollMove;
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        setScrollX(newScrollX);
        event.preventDefault();
      } else if (alturaGantt) {
        let newScrollY = scrollY + event.deltaY;
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - alturaGantt) {
          newScrollY = ganttFullHeight - alturaGantt;
        }
        if (newScrollY !== scrollY) {
          setScrollY(newScrollY);
          event.preventDefault();
        }
      }

      setIgnoreScrollEvent(true);
    };

    // subscribe if scroll is necessary
    wrapperRef.current?.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    return () => {
      wrapperRef.current?.removeEventListener("wheel", handleWheel);
    };
  }, [
    wrapperRef,
    scrollY,
    scrollX,
    alturaGantt,
    svgWidth,
    rtl,
    ganttFullHeight,
  ]);

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollY !== event.currentTarget.scrollTop && !ignoreScrollEvent) {
      setScrollY(event.currentTarget.scrollTop);
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  const handleScrollX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollX !== event.currentTarget.scrollLeft && !ignoreScrollEvent) {
      setScrollX(event.currentTarget.scrollLeft);
      setIgnoreScrollEvent(true);
    } else {
      setIgnoreScrollEvent(false);
    }
  };

  /**
   * Canaliza los eventos de las teclas de flecha y los transforma en un nuevo desplazamiento.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case "Down": // Valor específico IE/Edge
      case "ArrowDown":
        newScrollY += altoFila;
        isX = false;
        break;
      case "Up": // Valor específico IE/Edge
      case "ArrowUp":
        newScrollY -= altoFila;
        isX = false;
        break;
      case "Left":
      case "ArrowLeft":
        newScrollX -= anchoColumna;
        break;
      case "Right": // Valor específico IE/Edge
      case "ArrowRight":
        newScrollX += anchoColumna;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0;
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth;
      }
      setScrollX(newScrollX);
    } else {
      if (newScrollY < 0) {
        newScrollY = 0;
      } else if (newScrollY > ganttFullHeight - alturaGantt) {
        newScrollY = ganttFullHeight - alturaGantt;
      }
      setScrollY(newScrollY);
    }
    setIgnoreScrollEvent(true);
  };

  /**
   * Evento selección de tarea
   */
  const handleTareaSeleccionada = (tareaId: string) => {
    const nuevaTareaSeleccionada = barraTareas.find(t => t.id === tareaId);
    const anteriorTareaSeleccionada = barraTareas.find(
      t => !!tareaSeleccionada && t.id === tareaSeleccionada.id
    );
    if (onSelect) {
      if (anteriorTareaSeleccionada) {
        onSelect(anteriorTareaSeleccionada, false);
      }
      if (nuevaTareaSeleccionada) {
        onSelect(nuevaTareaSeleccionada, true);
      }
    }
    setTareaSeleccionada(nuevaTareaSeleccionada);
  };
  const handleExpanderClick = (tarea: Tarea) => {
    if (onExpanderClick && tarea.ocultarHijos !== undefined) {
      onExpanderClick({ ...tarea, ocultarHijos: !tarea.ocultarHijos });
    }
  };
  const gridProps: GridProps = {
    anchoColumna,
    svgWidth,
    tareas: tareas,
    altoFila,
    fechas: configFecha.fechas,
    todayColor,
    rtl,
  };
  const calendarProps: CalendarProps = {
    configFecha,
    locale,
    viewMode,
    altoCabecera,
    anchoColumna,
    fontFamily,
    fontSize,
    rtl,
  };
  const barProps: TareaGanttContentProps = {
    tareas: barraTareas,
    fechas: configFecha.fechas,
    ganttEvent,
    tareaSeleccionada: tareaSeleccionada,
    altoFila,
    altoTarea,
    anchoColumna,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgWidth,
    rtl,
    setGanttEvent,
    setTareaFallida,
    setTareaSeleccionada: handleTareaSeleccionada,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onClick,
    onDelete,
  };

  const tablaProps: ListaTareasProps = {
    altoFila,
    anchoFila: listCellWidth,
    fontFamily,
    fontSize,
    tareas: barraTareas,
    locale,
    altoCabecera,
    scrollY,
    alturaGantt,
    horizontalContainerClass: styles.horizontalContainer,
    tareaSeleccionada,
    listaTareasRef,
    setTareaSeleccionada: handleTareaSeleccionada,
    onExpanderClick: handleExpanderClick,
    CabeceraListaTareas,
    TablaListaTareas,
  };
  return (
    <div>
      <div
        className={styles.wrapper}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        {listCellWidth && <ListaTareas {...tablaProps} />}
        <TareaGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          alturaGantt={alturaGantt}
          scrollY={scrollY}
          scrollX={scrollX}
        />
        {ganttEvent.tareaCambiada && (
          <Tooltip
            arrowIndent={arrowIndent}
            altoFila={altoFila}
            svgContainerHeight={svgContainerHeight}
            svgContainerWidth={svgContainerWidth}
            fontFamily={fontFamily}
            fontSize={fontSize}
            scrollX={scrollX}
            scrollY={scrollY}
            tarea={ganttEvent.tareaCambiada}
            altoCabecera={altoCabecera}
            anchoListaTareas={anchoListaTareas}
            TooltipContent={TooltipContent}
            rtl={rtl}
            svgWidth={svgWidth}
          />
        )}
        <VerticalScroll
          ganttFullHeight={ganttFullHeight}
          alturaGantt={alturaGantt}
          altoCabecera={altoCabecera}
          scroll={scrollY}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
        svgWidth={svgWidth}
        listaTareasWidth={anchoListaTareas}
        scroll={scrollX}
        rtl={rtl}
        onScroll={handleScrollX}
      />
    </div>
  );
};
