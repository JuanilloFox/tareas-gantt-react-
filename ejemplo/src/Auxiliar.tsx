import { Tarea } from "tareas-gantt-react/dist/types/public-types";

export function initTasks() {
  const currentDate = new Date();
  const tareas: Tarea[] = [
    {
      inicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      fin: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      nombre: "Algún proyecto",
      id: "ProyectoEjemplo",
      progreso: 25,
      tipo: "proyecto",
      hideChildren: false,
      displayOrder: 1,
    },
    {
      inicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      fin: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      nombre: "Idea",
      id: "Tarea 0",
      progreso: 45,
      tipo: "tarea",
      proyecto: "ProyectoEjemplo",
      displayOrder: 2,
    },
    {
      inicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      fin: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      nombre: "Investigación",
      id: "Tarea 1",
      progreso: 25,
      dependencias: ["Tarea 0"],
      tipo: "tarea",
      proyecto: "ProyectoEjemplo",
      displayOrder: 3,
    },
    {
      inicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      fin: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      nombre: "Discusión con el equipo",
      id: "Tarea 2",
      progreso: 10,
      dependencias: ["Tarea 1"],
      tipo: "tarea",
      proyecto: "ProyectoEjemplo",
      displayOrder: 4,
    },
    {
      inicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      fin: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      nombre: "Developing",
      id: "Tarea 3",
      progreso: 2,
      dependencias: ["Tarea 2"],
      tipo: "tarea",
      proyecto: "ProyectoEjemplo",
      displayOrder: 5,
    },
    {
      inicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      fin: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      nombre: "Revisión",
      id: "Tarea 4",
      tipo: "tarea",
      progreso: 70,
      dependencias: ["Tarea 2"],
      proyecto: "ProyectoEjemplo",
      displayOrder: 6,
    },
    {
      inicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      fin: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      nombre: "Liberar",
      id: "Tarea 6",
      progreso: currentDate.getMonth(),
      tipo: "milestone",
      dependencias: ["Tarea 4"],
      proyecto: "ProyectoEjemplo",
      displayOrder: 7,
    },
    {
      inicio: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      fin: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      nombre: "Horario festivo",
      id: "Tarea 9",
      progreso: 0,
      isDisabled: true,
      tipo: "tarea",
    },
  ];
  return tareas;
}

export function getStartEndDateForProject(tareas: Tarea[], proyectoId: string) {
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
