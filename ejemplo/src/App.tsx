import React from "react";
import { Tarea, ViewMode, Gantt } from "tareas-gantt-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./Auxiliar";
//import "tareas-gantt-react/dist/index.css";
import "tareas-gantt-react/dist/index.css";

// Init
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tareas, setTasks] = React.useState<Tarea[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (tarea: Tarea) => {
    console.log("En cambio de fecha Id:" + tarea.id);
    let nuevasTareas = tareas.map(t => (t.id === tarea.id ? tarea : t));
    if (tarea.proyecto) {
      const [inicio, fin] = getStartEndDateForProject(nuevasTareas, tarea.proyecto);
      const proyecto = nuevasTareas[nuevasTareas.findIndex(t => t.id === tarea.proyecto)];
      if (
        proyecto.inicio.getTime() !== inicio.getTime() ||
        proyecto.fin.getTime() !== fin.getTime()
      ) {
        const changedProject = { ...proyecto, inicio, fin };
        nuevasTareas = nuevasTareas.map(t =>
          t.id === tarea.proyecto ? changedProject : t
        );
      }
    }
    setTasks(nuevasTareas);
  };

  const handleTaskDelete = (tarea: Tarea) => {
    const conf = window.confirm("Estas seguro de " + tarea.nombre + " ?");
    if (conf) {
      setTasks(tareas.filter(t => t.id !== tarea.id));
    }
    return conf;
  };

  const handleProgressChange = async (tarea: Tarea) => {
    setTasks(tareas.map(t => (t.id === tarea.id ? tarea : t)));
    console.log("En progreso, cambio de ID:" + tarea.id);
  };

  const handleDblClick = (tarea: Tarea) => {
    alert("Id del evento de doble clic:" + tarea.id);
  };

  const handleClick = (tarea: Tarea) => {
    console.log("ID del evento On Click:" + tarea.id);
  };

  const handleSelect = (tarea: Tarea, isSelected: boolean) => {
    console.log(tarea.nombre + " tiene " + (isSelected ? "seleccionado" : "deseleccionado"));
  };

  const handleExpanderClick = (tarea: Tarea) => {
    setTasks(tareas.map(t => (t.id === tarea.id ? tarea : t)));
    console.log("Id al hacer clic en elexpansor:" + tarea.id);
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <h3>Gantt With Unlimited Height</h3>
      <Gantt
        tareas={tareas}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
      />
      <h3>Gantt With Limited Height</h3>
      <Gantt
        tareas={tareas}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={300}
        columnWidth={columnWidth}
      />
    </div>
  );
};

export default App;
