import React from "react";
import { Tarea, ViewMode, Gantt } from "tareas-gantt-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getFechaInicioFinParaProyecto, initTareas } from "./Auxiliar";
import "tareas-gantt-react/dist/index.css";

// Init
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tareas, setTareas] = React.useState<Tarea[]>(initTareas());
  const [isChecked, setIsChecked] = React.useState(true);
  let anchoColumna = 65;
  if (view === ViewMode.Year) {
    anchoColumna = 350;
  } else if (view === ViewMode.Month) {
    anchoColumna = 300;
  } else if (view === ViewMode.Week) {
    anchoColumna = 250;
  }

  const handleCambioTarea = (tarea: Tarea) => {
    console.log("En cambio de fecha Id:" + tarea.id);
    let nuevasTareas = tareas.map(t => (t.id === tarea.id ? tarea : t));
    if (tarea.proyecto) {
      const [inicio, fin] = getFechaInicioFinParaProyecto(nuevasTareas, tarea.proyecto);
      const proyecto = nuevasTareas[nuevasTareas.findIndex(t => t.id === tarea.proyecto)];
      if (
        proyecto.inicio.getTime() !== inicio.getTime() ||
        proyecto.fin.getTime() !== fin.getTime()
      ) {
        const proyectoCambiado = { ...proyecto, inicio, fin };
        nuevasTareas = nuevasTareas.map(t =>
          t.id === tarea.proyecto ? proyectoCambiado : t
        );
      }
    }
    setTareas(nuevasTareas);
  };

  const handleBorradoTarea = (tarea: Tarea) => {
    const conf = window.confirm("Estas seguro de " + tarea.nombre + " ?");
    if (conf) {
      setTareas(tareas.filter(t => t.id !== tarea.id));
    }
    return conf;
  };

  const handleProgressChange = async (tarea: Tarea) => {
    setTareas(tareas.map(t => (t.id === tarea.id ? tarea : t)));
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
    setTareas(tareas.map(t => (t.id === tarea.id ? tarea : t)));
    console.log("Id al hacer clic en elexpansor:" + tarea.id);
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <h3>Gantt con altura ilimitada</h3>
      <Gantt
        tareas={tareas}
        viewMode={view}
        onDateChange={handleCambioTarea}
        onDelete={handleBorradoTarea}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        anchoColumna={anchoColumna}
      />
      <h3>Gantt con altura limitada</h3>
      <Gantt
        tareas={tareas}
        viewMode={view}
        onDateChange={handleCambioTarea}
        onDelete={handleBorradoTarea}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={300}
        anchoColumna={anchoColumna}
      />
    </div>
  );
};

export default App;
