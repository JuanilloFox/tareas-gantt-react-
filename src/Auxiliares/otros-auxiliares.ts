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

export function isBarraTareas(tarea: Tarea | BarraTareas): tarea is BarraTareas {
  return (tarea as BarraTareas).x1 !== undefined;
}

export function retirarTareasOcultas(tareas: Tarea[]) {
  const tareasAgrupadas = tareas.filter(
    t => t.ocultarHijos && t.tipo === "proyecto"
  );
  if (tareasAgrupadas.length > 0) {
    for (let i = 0; tareasAgrupadas.length > i; i++) {
      const tareaAgrupada = tareasAgrupadas[i];
      const hijos = getHijos(tareas, tareaAgrupada);
      tareas = tareas.filter(t => hijos.indexOf(t) === -1);
    }
  }
  return tareas;
}

function getHijos(listaTareas: Tarea[], tarea: Tarea) {
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
    tareaHija.push(...getHijos(listaTareas, t));
  })
  tareas = tareas.concat(tareas, tareaHija);
  return tareas;
}

export const ordenarTareas = (tareaA: Tarea, tareaB: Tarea) => {
  const ordenA = tareaA.ordenVisual || Number.MAX_VALUE;
  const ordenB = tareaB.ordenVisual || Number.MAX_VALUE;
  if (ordenA > ordenB) {
    return 1;
  } else if (ordenA < ordenB) {
    return -1;
  } else {
    return 0;
  }
};
