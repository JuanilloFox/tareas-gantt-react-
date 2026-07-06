import React, { useEffect, useRef, useState } from "react";
import { BarraTareas } from "../../types/barra-tareas";
import { GanttContentMoveAction } from "../../types/tareas-gantt-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Hito } from "./hito/hito";
import { Proyecto } from "./proyecto/proyecto";
import style from "./lista-tareas.module.css";

export type TareaItemProps = {
  tarea: BarraTareas;
  arrowIndent: number;
  altoTarea: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    tareaSeleccionada: BarraTareas,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
};

export const TareaItem: React.FC<TareaItemProps> = props => {
  const {
    tarea,
    arrowIndent,
    isDelete,
    altoTarea,
    isSelected,
    rtl,
    onEventStart,
  } = {
    ...props,
  };
  const textRef = useRef<SVGTextElement>(null);
  const [tareaItem, setItemTarea] = useState<JSX.Element>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);

  useEffect(() => {
    switch (tarea.tipoInterno) {
      case "hito":
        setItemTarea(<Hito {...props} />);
        break;
      case "proyecto":
        setItemTarea(<Proyecto {...props} />);
        break;
      case "smalltask":
        setItemTarea(<BarSmall {...props} />);
        break;
      default:
        setItemTarea(<Bar {...props} />);
        break;
    }
  }, [tarea, isSelected]);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(textRef.current.getBBox().width < tarea.x2 - tarea.x1);
    }
  }, [textRef, tarea]);

  const getX = () => {
    const width = tarea.x2 - tarea.x1;
    const hasChild = tarea.barraHijos.length > 0;
    if (isTextInside) {
      return tarea.x1 + width * 0.5;
    }
    if (rtl && textRef.current) {
      return (
        tarea.x1 -
        textRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      );
    } else {
      return tarea.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
    }
  };

  return (
    <g
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) onEventStart("delete", tarea, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => {
        onEventStart("mouseenter", tarea, e);
      }}
      onMouseLeave={e => {
        onEventStart("mouseleave", tarea, e);
      }}
      onDoubleClick={e => {
        onEventStart("dblclick", tarea, e);
      }}
      onClick={e => {
        onEventStart("click", tarea, e);
      }}
      onFocus={() => {
        onEventStart("select", tarea);
      }}
    >
      {tareaItem}
      <text
        x={getX()}
        y={tarea.y + altoTarea * 0.5}
        className={
          isTextInside
            ? style.barLabel
            : style.barLabel && style.barLabelOutside
        }
        ref={textRef}
      >
        {tarea.nombre}
      </text>
    </g>
  );
};
