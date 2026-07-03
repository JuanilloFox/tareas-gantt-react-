import { BarraTareas } from "../types/barra-tareas";
import { Tarea } from "../types/public-types";

export function isKeyboardEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.KeyboardEvent {
  return (event as React.KeyboardEvent).key !== undefined;
}

export function isMouseEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.MouseEvent {
  return (event as React.MouseEvent).clientX !== undefined;
}

export function isBarTask(tarea: Tarea | BarraTareas): tarea is BarraTareas {
  return (tarea as BarraTareas).x1 !== undefined;
}

export function retirarTareasOcultas(tareas: Tarea[]) {
  const groupedTasks = tareas.filter(
    t => t.hideChildren && t.tipo === "proyecto"
  );
  if (groupedTasks.length > 0) {
    for (let i = 0; groupedTasks.length > i; i++) {
      const groupedTask = groupedTasks[i];
      const children = getChildren(tareas, groupedTask);
      tareas = tareas.filter(t => children.indexOf(t) === -1);
    }
  }
  return tareas;
}

function getChildren(listaTareas: Tarea[], tarea: Tarea) {
  let tareas: Tarea[] = [];
  if (tarea.tipo !== "proyecto") {
    tareas = listaTareas.filter(
      t => t.dependencias && t.dependencias.indexOf(tarea.id) !== -1
    );
  } else {
    tareas = listaTareas.filter(t => t.proyecto && t.proyecto === tarea.id);
  }
  var tareaHija: Tarea[] = [];
  tareas.forEach(t => {
    tareaHija.push(...getChildren(listaTareas, t));
  })
  tareas = tareas.concat(tareas, tareaHija);
  return tareas;
}

export const ordenarTareas = (tareaA: Tarea, tareaB: Tarea) => {
  const orderA = tareaA.displayOrder || Number.MAX_VALUE;
  const orderB = tareaB.displayOrder || Number.MAX_VALUE;
  if (orderA > orderB) {
    return 1;
  } else if (orderA < orderB) {
    return -1;
  } else {
    return 0;
  }
};
