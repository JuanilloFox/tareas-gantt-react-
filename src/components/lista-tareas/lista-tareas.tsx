import React, { useEffect, useRef } from "react";
import { BarraTareas } from "../../types/barra-tareas";
import { Tarea } from "../../types/public-types";

export type ListaTareasProps = {
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  rowHeight: number;
  ganttHeight: number;
  scrollY: number;
  locale: string;
  tareas: Tarea[];
  listaTareasRef: React.RefObject<HTMLDivElement>;
  horizontalContainerClass?: string;
  selectedTask: BarraTareas | undefined;
  setTareaSeleccionada: (tarea: string) => void;
  onExpanderClick: (tarea: Tarea) => void;
  ListaTareasHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }>;
  ListaTareasTable: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tareas: Tarea[];
    tareaSeleccionadaId: string;
    setTareaSeleccionada: (tareaId: string) => void;
    onExpanderClick: (tarea: Tarea) => void;
  }>;
};

export const ListaTareas: React.FC<ListaTareasProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
  tareas,
  selectedTask,
  setTareaSeleccionada,
  onExpanderClick,
  locale,
  ganttHeight,
  listaTareasRef,
  horizontalContainerClass,
  ListaTareasHeader,
  ListaTareasTable,
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
  };
  const tareaSeleccionadaId = selectedTask ? selectedTask.id : "";
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tareas,
    locale,
    tareaSeleccionadaId: tareaSeleccionadaId,
    setTareaSeleccionada,
    onExpanderClick,
  };

  return (
    <div ref={listaTareasRef}>
      <ListaTareasHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={ganttHeight ? { height: ganttHeight } : {}}
      >
        <ListaTareasTable {...tableProps} />
      </div>
    </div>
  );
};
