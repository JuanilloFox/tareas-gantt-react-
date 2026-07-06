import { Tarea } from "tareas-gantt-react/dist/types/public-types";

export function initTareas() {
  const fechaActual = new Date();
  const tareas: Tarea[] = [
    {
      inicio: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1),
      fin: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 15),
      nombre: "Algún proyecto",
      id: "ProyectoEjemplo",
      progreso: 25,
      tipo: "proyecto",
      ocultarHijos: false,
      ordenVisual: 1,
    },
    {
      inicio: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1),
      fin: new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        2,
        12,
        28
      ),
      nombre: "Idea",
      id: "Tarea 0",
      progreso: 45,
      tipo: "tarea",
      proyecto: "ProyectoEjemplo",
      ordenVisual: 2,
    },
    {
      inicio: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 2),
      fin: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 4, 0, 0),
      nombre: "Investigación",
      id: "Tarea 1",
      progreso: 25,
      dependencias: ["Tarea 0"],
      tipo: "tarea",
      proyecto: "ProyectoEjemplo",
      ordenVisual: 3,
    },
    {
      inicio: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 4),
      fin: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 8, 0, 0),
      nombre: "Discusión con el equipo",
      id: "Tarea 2",
      progreso: 10,
      dependencias: ["Tarea 1"],
      tipo: "tarea",
      proyecto: "ProyectoEjemplo",
      ordenVisual: 4,
    },
    {
      inicio: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 8),
      fin: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 9, 0, 0),
      nombre: "Desarrollo",
      id: "Tarea 3",
      progreso: 2,
      dependencias: ["Tarea 2"],
      tipo: "tarea",
      proyecto: "ProyectoEjemplo",
      ordenVisual: 5,
    },
    {
      inicio: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 8),
      fin: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 10),
      nombre: "Revisión",
      id: "Tarea 4",
      tipo: "tarea",
      progreso: 70,
      dependencias: ["Tarea 2"],
      proyecto: "ProyectoEjemplo",
      ordenVisual: 6,
    },
    {
      inicio: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 15),
      fin: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 15),
      nombre: "Liberar",
      id: "Tarea 6",
      progreso: fechaActual.getMonth(),
      tipo: "hito",
      dependencias: ["Tarea 4"],
      proyecto: "ProyectoEjemplo",
      ordenVisual: 7,
    },
    {
      inicio: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 18),
      fin: new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 19),
      nombre: "Horario festivo",
      id: "Tarea 9",
      progreso: 0,
      desactivada: true,
      tipo: "tarea",
    },
  ];
  return tareas;
}

export function getFechaInicioFinParaProyecto(tareas: Tarea[], proyectoId: string) {
  const tareasProyecto = tareas.filter(t => t.proyecto === proyectoId);
  let inicio = tareasProyecto[0].inicio;
  let fin = tareasProyecto[0].fin;

  for (let i = 0; i < tareasProyecto.length; i++) {
    const tarea = tareasProyecto[i];
    if (inicio.getTime() > tarea.inicio.getTime()) {
      inicio = tarea.inicio;
    }
    if (fin.getTime() < tarea.fin.getTime()) {
      fin = tarea.fin;
    }
  }
  return [inicio, fin];
}
