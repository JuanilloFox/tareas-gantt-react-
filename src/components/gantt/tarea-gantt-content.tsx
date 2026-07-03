import React, { useEffect, useState } from "react";
import { EventOption } from "../../types/public-types";
import { BarraTareas } from "../../types/barra-tareas";
import { Arrow } from "../other/arrow";
import { handleTaskBySVGMouseEvent } from "../../Auxiliares/auxiliar-bar";
import { isKeyboardEvent } from "../../Auxiliares/otros-auxiliares";
import { TareaItem } from "../tarea-item/tarea-item";
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from "../../types/tareas-gantt-actions";

export type TareaGanttContentProps = {
  tareas: BarraTareas[];
  dates: Date[];
  ganttEvent: GanttEvent;
  selectedTask: BarraTareas | undefined;
  rowHeight: number;
  columnWidth: number;
  timeStep: number;
  svg?: React.RefObject<SVGSVGElement>;
  svgWidth: number;
  altoTarea: number;
  arrowColor: string;
  arrowIndent: number;
  fontSize: string;
  fontFamily: string;
  rtl: boolean;
  setGanttEvent: (value: GanttEvent) => void;
  setTareaFallida: (value: BarraTareas | null) => void;
  setTareaSeleccionada: (tareaId: string) => void;
} & EventOption;

export const TareaGanttContent: React.FC<TareaGanttContentProps> = ({
  tareas,
  dates,
  ganttEvent,
  selectedTask,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  altoTarea,
  arrowColor,
  arrowIndent,
  fontFamily,
  fontSize,
  rtl,
  setGanttEvent,
  setTareaFallida,
  setTareaSeleccionada,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
}) => {
  const point = svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // create xStep
  useEffect(() => {
    const dateDelta =
      dates[1].getTime() -
      dates[0].getTime() -
      dates[1].getTimezoneOffset() * 60 * 1000 +
      dates[0].getTimezoneOffset() * 60 * 1000;
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!ganttEvent.tareaCambiada || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );

      const { isChanged, tareaCambiada } = handleTaskBySVGMouseEvent(
        cursor.x,
        ganttEvent.action as BarMoveAction,
        ganttEvent.tareaCambiada,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );
      if (isChanged) {
        setGanttEvent({ action: ganttEvent.action, tareaCambiada });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { action, originalSelectedTask, tareaCambiada } = ganttEvent;
      if (!tareaCambiada || !point || !svg?.current || !originalSelectedTask)
        return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );
      const { tareaCambiada: nuevatareaCambiada } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        tareaCambiada,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );

      const isNotLikeOriginal =
        originalSelectedTask.inicio !== nuevatareaCambiada.inicio ||
        originalSelectedTask.fin !== nuevatareaCambiada.fin ||
        originalSelectedTask.progreso !== nuevatareaCambiada.progreso;

      // remove listeners
      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setGanttEvent({ action: "" });
      setIsMoving(false);

      // custom operation start
      let operationSuccess = true;
      if (
        (action === "mover" || action === "fin" || action === "inicio") &&
        onDateChange &&
        isNotLikeOriginal
      ) {
        try {
          const result = await onDateChange(
            nuevatareaCambiada,
            nuevatareaCambiada.barChildren
          );
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      } else if (onProgressChange && isNotLikeOriginal) {
        try {
          const result = await onProgressChange(
            nuevatareaCambiada,
            nuevatareaCambiada.barChildren
          );
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      }

      // If operation is failed - return old state
      if (!operationSuccess) {
        setTareaFallida(originalSelectedTask);
      }
    };

    if (
      !isMoving &&
      (ganttEvent.action === "mover" ||
        ganttEvent.action === "fin" ||
        ganttEvent.action === "inicio" ||
        ganttEvent.action === "progreso") &&
      svg?.current
    ) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [
    ganttEvent,
    xStep,
    initEventX1Delta,
    onProgressChange,
    timeStep,
    onDateChange,
    svg,
    isMoving,
    point,
    rtl,
    setTareaFallida,
    setGanttEvent,
  ]);

  /**
   * El método es el punto de inicio del cambio de tarea.
   */
  const handleBarEventStart = async (
    action: GanttContentMoveAction,
    tarea: BarraTareas,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (!event) {
      if (action === "select") {
        setTareaSeleccionada(tarea.id);
      }
    }
    // Keyboard events
    else if (isKeyboardEvent(event)) {
      if (action === "delete") {
        if (onDelete) {
          try {
            const result = await onDelete(tarea);
            if (result !== undefined && result) {
              setGanttEvent({ action, tareaCambiada: tarea });
            }
          } catch (error) {
            console.error("Error on Delete. " + error);
          }
        }
      }
    }
    // Mouse Events
    else if (action === "mouseenter") {
      if (!ganttEvent.action) {
        setGanttEvent({
          action,
          tareaCambiada: tarea,
          originalSelectedTask: tarea,
        });
      }
    } else if (action === "mouseleave") {
      if (ganttEvent.action === "mouseenter") {
        setGanttEvent({ action: "" });
      }
    } else if (action === "dblclick") {
      !!onDoubleClick && onDoubleClick(tarea);
    } else if (action === "click") {
      !!onClick && onClick(tarea);
    }
    // Cambio de tarea en evento inicio
    else if (action === "mover") {
      if (!svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
      );
      setInitEventX1Delta(cursor.x - tarea.x1);
      setGanttEvent({
        action,
        tareaCambiada: tarea,
        originalSelectedTask: tarea,
      });
    } else {
      setGanttEvent({
        action,
        tareaCambiada: tarea,
        originalSelectedTask: tarea,
      });
    }
  };

  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor}>
        {tareas.map(tarea => {
          return tarea.barChildren.map(child => {
            return (
              <Arrow
                key={`Arrow from ${tarea.id} to ${tareas[child.index].id}`}
                taskFrom={tarea}
                taskTo={tareas[child.index]}
                rowHeight={rowHeight}
                altoTarea={altoTarea}
                arrowIndent={arrowIndent}
                rtl={rtl}
              />
            );
          });
        })}
      </g>
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {tareas.map(tarea => {
          return (
            <TareaItem
              tarea={tarea}
              arrowIndent={arrowIndent}
              altoTarea={altoTarea}
              isProgressChangeable={!!onProgressChange && !tarea.isDisabled}
              isDateChangeable={!!onDateChange && !tarea.isDisabled}
              isDelete={!tarea.isDisabled}
              onEventStart={handleBarEventStart}
              key={tarea.id}
              isSelected={!!selectedTask && tarea.id === selectedTask.id}
              rtl={rtl}
            />
          );
        })}
      </g>
    </g>
  );
};
