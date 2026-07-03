import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { ViewMode, GanttProps, Tarea } from "../../types/public-types";
import { GridProps } from "../grid/grid";
import { ganttDateRange, seedDates } from "../../Auxiliares/auxiliar-fecha";
import { CalendarProps } from "../calendar/calendar";
import { TareaGanttContentProps } from "./tarea-gantt-content";
import { ListaTareasHeaderDefault } from "../lista-tareas/lista-tareas-header";
import { ListaTareasTableDefault } from "../lista-tareas/lista-tareas-table";
import { StandardTooltipContent, Tooltip } from "../other/tooltip";
import { VerticalScroll } from "../other/vertical-scroll";
import { ListaTareasProps, ListaTareas } from "../lista-tareas/lista-tareas";
import { TareaGantt } from "./tarea-gantt";
import { BarraTareas } from "../../types/barra-tareas";
import { convertirABarraTareas } from "../../Auxiliares/auxiliar-bar";
import { GanttEvent } from "../../types/tareas-gantt-actions";
import { DateSetup } from "../../types/date-setup";
import { HorizontalScroll } from "../other/horizontal-scroll";
import { retirarTareasOcultas, ordenarTareas } from "../../Auxiliares/otros-auxiliares";
import styles from "./gantt.module.css";

export const Gantt: React.FunctionComponent<GanttProps> = ({
  tareas,
  headerHeight = 50,
  columnWidth = 60,
  listCellWidth = "155px",
  rowHeight = 50,
  ganttHeight = 0,
  viewMode = ViewMode.Day,
  preStepsCount = 1,
  locale = "en-GB",
  barFill = 60,
  barCornerRadius = 3,
  barProgressColor = "#a3a3ff",
  barProgressSelectedColor = "#8282f5",
  barBackgroundColor = "#b8c2cc",
  barBackgroundSelectedColor = "#aeb8c2",
  projectProgressColor = "#7db59a",
  projectProgressSelectedColor = "#59a985",
  projectBackgroundColor = "#fac465",
  projectBackgroundSelectedColor = "#f7bb53",
  milestoneBackgroundColor = "#f1c453",
  milestoneBackgroundSelectedColor = "#f29e4c",
  rtl = false,
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = "grey",
  fontFamily = "Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue",
  fontSize = "14px",
  arrowIndent = 20,
  todayColor = "rgba(252, 248, 227, 0.5)",
  viewDate,
  TooltipContent = StandardTooltipContent,
  ListaTareasHeader = ListaTareasHeaderDefault,
  ListaTareasTable = ListaTareasTableDefault,
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
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(tareas, viewMode, preStepsCount);
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
  });
  const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(
    undefined
  );

  const [listaTareasWidth, setListaTareasWidth] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
  const [barraTareas, setBarraTareas] = useState<BarraTareas[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: "",
  });
  const altoTarea = useMemo(
    () => (rowHeight * barFill) / 100,
    [rowHeight, barFill]
  );

  const [selectedTask, setTareaSeleccionada] = useState<BarraTareas>();
  const [failedTask, setTareaFallida] = useState<BarraTareas | null>(null);

  const svgWidth = dateSetup.dates.length * columnWidth;
  const ganttFullHeight = barraTareas.length * rowHeight;

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
    const [startDate, endDate] = ganttDateRange(
      tareasFiltradas,
      viewMode,
      preStepsCount
    );
    let newDates = seedDates(startDate, endDate, viewMode);
    if (rtl) {
      newDates = newDates.reverse();
      if (scrollX === -1) {
        setScrollX(newDates.length * columnWidth);
      }
    }
    setDateSetup({ dates: newDates, viewMode });
    setBarraTareas(
      convertirABarraTareas(
        tareasFiltradas,
        newDates,
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
      )
    );
  }, [
    tareas,
    viewMode,
    preStepsCount,
    rowHeight,
    barCornerRadius,
    columnWidth,
    altoTarea,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
    rtl,
    scrollX,
    onExpanderClick,
  ]);

  useEffect(() => {
    if (
      viewMode === dateSetup.viewMode &&
      ((viewDate && !currentViewDate) ||
        (viewDate && currentViewDate?.valueOf() !== viewDate.valueOf()))
    ) {
      const dates = dateSetup.dates;
      const index = dates.findIndex(
        (d, i) =>
          viewDate.valueOf() >= d.valueOf() &&
          i + 1 !== dates.length &&
          viewDate.valueOf() < dates[i + 1].valueOf()
      );
      if (index === -1) {
        return;
      }
      setCurrentViewDate(viewDate);
      setScrollX(columnWidth * index);
    }
  }, [
    viewDate,
    columnWidth,
    dateSetup.dates,
    dateSetup.viewMode,
    viewMode,
    currentViewDate,
    setCurrentViewDate,
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
        const prevStateTask = barraTareas.find(t => t.id === tareaCambiada.id);
        if (
          prevStateTask &&
          (prevStateTask.inicio.getTime() !== tareaCambiada.inicio.getTime() ||
            prevStateTask.fin.getTime() !== tareaCambiada.fin.getTime() ||
            prevStateTask.progreso !== tareaCambiada.progreso)
        ) {
          // actions for change
          const newTaskList = barraTareas.map(t =>
            t.id === tareaCambiada.id ? tareaCambiada : t
          );
          setBarraTareas(newTaskList);
        }
      }
    }
  }, [ganttEvent, barraTareas]);

  useEffect(() => {
    if (failedTask) {
      setBarraTareas(barraTareas.map(t => (t.id !== failedTask.id ? t : failedTask)));
      setTareaFallida(null);
    }
  }, [failedTask, barraTareas]);

  useEffect(() => {
    if (!listCellWidth) {
      setListaTareasWidth(0);
    }
    if (listaTareasRef.current) {
      setListaTareasWidth(listaTareasRef.current.offsetWidth);
    }
  }, [listaTareasRef, listCellWidth]);

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - listaTareasWidth);
    }
  }, [wrapperRef, listaTareasWidth]);

  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
    } else {
      setSvgContainerHeight(tareas.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, tareas, headerHeight, rowHeight]);

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
      } else if (ganttHeight) {
        let newScrollY = scrollY + event.deltaY;
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
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
    ganttHeight,
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
        newScrollY += rowHeight;
        isX = false;
        break;
      case "Up": // Valor específico IE/Edge
      case "ArrowUp":
        newScrollY -= rowHeight;
        isX = false;
        break;
      case "Left":
      case "ArrowLeft":
        newScrollX -= columnWidth;
        break;
      case "Right": // Valor específico IE/Edge
      case "ArrowRight":
        newScrollX += columnWidth;
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
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight;
      }
      setScrollY(newScrollY);
    }
    setIgnoreScrollEvent(true);
  };

  /**
   * Evento selección de tarea
   */
  const handleSelectedTask = (tareaId: string) => {
    const newSelectedTask = barraTareas.find(t => t.id === tareaId);
    const oldSelectedTask = barraTareas.find(
      t => !!selectedTask && t.id === selectedTask.id
    );
    if (onSelect) {
      if (oldSelectedTask) {
        onSelect(oldSelectedTask, false);
      }
      if (newSelectedTask) {
        onSelect(newSelectedTask, true);
      }
    }
    setTareaSeleccionada(newSelectedTask);
  };
  const handleExpanderClick = (tarea: Tarea) => {
    if (onExpanderClick && tarea.hideChildren !== undefined) {
      onExpanderClick({ ...tarea, hideChildren: !tarea.hideChildren });
    }
  };
  const gridProps: GridProps = {
    columnWidth,
    svgWidth,
    tareas: tareas,
    rowHeight,
    dates: dateSetup.dates,
    todayColor,
    rtl,
  };
  const calendarProps: CalendarProps = {
    dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
    rtl,
  };
  const barProps: TareaGanttContentProps = {
    tareas: barraTareas,
    dates: dateSetup.dates,
    ganttEvent,
    selectedTask,
    rowHeight,
    altoTarea,
    columnWidth,
    arrowColor,
    timeStep,
    fontFamily,
    fontSize,
    arrowIndent,
    svgWidth,
    rtl,
    setGanttEvent,
    setTareaFallida,
    setTareaSeleccionada: handleSelectedTask,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onClick,
    onDelete,
  };

  const tableProps: ListaTareasProps = {
    rowHeight,
    rowWidth: listCellWidth,
    fontFamily,
    fontSize,
    tareas: barraTareas,
    locale,
    headerHeight,
    scrollY,
    ganttHeight,
    horizontalContainerClass: styles.horizontalContainer,
    selectedTask,
    listaTareasRef,
    setTareaSeleccionada: handleSelectedTask,
    onExpanderClick: handleExpanderClick,
    ListaTareasHeader,
    ListaTareasTable,
  };
  return (
    <div>
      <div
        className={styles.wrapper}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        {listCellWidth && <ListaTareas {...tableProps} />}
        <TareaGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          scrollY={scrollY}
          scrollX={scrollX}
        />
        {ganttEvent.tareaCambiada && (
          <Tooltip
            arrowIndent={arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={svgContainerHeight}
            svgContainerWidth={svgContainerWidth}
            fontFamily={fontFamily}
            fontSize={fontSize}
            scrollX={scrollX}
            scrollY={scrollY}
            tarea={ganttEvent.tareaCambiada}
            headerHeight={headerHeight}
            listaTareasWidth={listaTareasWidth}
            TooltipContent={TooltipContent}
            rtl={rtl}
            svgWidth={svgWidth}
          />
        )}
        <VerticalScroll
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={scrollY}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
        svgWidth={svgWidth}
        listaTareasWidth={listaTareasWidth}
        scroll={scrollX}
        rtl={rtl}
        onScroll={handleScrollX}
      />
    </div>
  );
};
