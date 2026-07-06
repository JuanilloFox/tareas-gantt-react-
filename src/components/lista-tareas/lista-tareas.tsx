import React, { useEffect, useRef } from "react";
import { BarraTareas } from "../../types/barra-tareas";
import { Tarea } from "../../types/public-types";

export type ListaTareasProps = {
  altoCabecera: number;
  anchoFila: string;
  fontFamily: string;
  fontSize: string;
  altoFila: number;
  alturaGantt: number;
  scrollY: number;
  locale: string;
  tareas: Tarea[];
  listaTareasRef: React.RefObject<HTMLDivElement>;
  horizontalContainerClass?: string;
  tareaSeleccionada: BarraTareas | undefined;
  setTareaSeleccionada: (tarea: string) => void;
  onExpanderClick: (tarea: Tarea) => void;
  CabeceraListaTareas: React.FC<{
    altoCabecera: number;
    anchoFila: string;
    fontFamily: string;
    fontSize: string;
  }>;
  TablaListaTareas: React.FC<{
    altoFila: number;
    anchoFila: string;
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
  altoCabecera,
  fontFamily,
  fontSize,
  anchoFila,
  altoFila,
  scrollY,
  tareas,
  tareaSeleccionada,
  setTareaSeleccionada,
  onExpanderClick,
  locale,
  alturaGantt,
  listaTareasRef,
  horizontalContainerClass,
  CabeceraListaTareas,
  TablaListaTareas,
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    altoCabecera,
    fontFamily,
    fontSize,
    anchoFila,
  };
  const tareaSeleccionadaId = tareaSeleccionada ? tareaSeleccionada.id : "";
  const tablaProps = {
    altoFila,
    anchoFila,
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
      <CabeceraListaTareas {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={alturaGantt ? { height: alturaGantt } : {}}
      >
        <TablaListaTareas {...tablaProps} />
      </div>
    </div>
  );
};
