# tareas-gantt-react

## Diagrama de Gantt interactivo para React con TypeScript.

![ejemplo](https://user-images.githubusercontent.com/26743903/88215863-f35d5f00-cc64-11ea-81db-e829e6e9b5c8.png)

## [Demostración en vivo](https://github.com/JuanilloFox/tareas-gantt-react)

## Instalar

```
npm install tareas-gantt-react
```

## How to use it

```javascript
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'tareas-gantt-react';
import "tareas-gantt-react/dist/index.css";

let tareas: Task[] = [
    {
      inicio: new Date(2020, 1, 1),
      fin: new Date(2020, 1, 2),
      nombre: 'Idea',
      id: 'Tarea 0',
      tipo:'tarea',
      progreso: 45,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
    ...
];
<Gantt tareas={tareas} />
```

Puedes manejar acciones

```javascript
<Gantt
  tareas={tareas}
  viewMode={view}
  onDateChange={onTaskChange}
  onTaskDelete={onTaskDelete}
  onProgressChange={onProgressChange}
  onDoubleClick={onDblClick}
  onClick={onClick}
/>
```

## Cómo ejecutar un ejemplo

```
cd ./ejemplo
npm install
npm start
```

## Configuración de Gantt

### GanttProps

| Nombre del parámetro            | Tipo          | Descripción                                        |
| :------------------------------ | :------------ | :------------------------------------------------- |
| tareas\*                        | [Task](#Task) | Matriz de tareas.                                  |
| [EventOption](#EventOption)     | interface     | Especifica los eventos de Gantt.                   |
| [DisplayOption](#DisplayOption) | interface     | Especifica el tipo de vista y el idioma de la      |
|                                 |               | línea de tiempo que se muestra.                    |
| [StylingOption](#StylingOption) | interface     | Especifica los estilos de gráficos y tareas        |
|                                 |               | globales.                                          |

### EventOption

| Nombre del parámetro | Tipo                           | Descripción                                                |
| :------------------- | :----------------------------- | :--------------------------------------------------------- |
| onSelect             | (tarea: Task, isSelected:      | Especifica la función que se ejecutará al seleccionar o    |
|                      | boolean) => void               | deseleccionar un elemento de la barra de tareas.           |
| onDoubleClick        | (tarea: Task) => void          | Especifica la función que se ejecutará en el evento        |
|                      |                                | onDoubleClick de la barra de tareas.                       |
| onClick              | (tarea: Task) => void          | Especifica la función que se ejecutará en el evento        |
|                      |                                | onClick de la barra de tareas.                             |
| onDelete\*           | (tarea: Task) => void/boolean/ | Especifica la función que se ejecutará en la barra de      |
|                      | Promise<void>/Promise<boolean> | tareas al pulsar el botón Eliminar.                        |
| onDateChange\*       | (tarea: Task, children: Task[])| Especifica la función que se ejecutará cuando finalice el  |
|                      | => void/boolean/Promise<void>/ | evento de arrastrar la barra de tareas en la línea de      |
|                      | Promise<boolean>               | tiempo.                                                    |
| onProgressChange\*   | (tarea: Task, children: Task[])| Especifica la función que se ejecutará cuando finalice el  |
|                      | => void/boolean/Promise<void>/ | evento de progreso de arrastre de la barra de tareas.      |
|                      | Promise<boolean>               |                                                            |
| onExpanderClick\*    | onExpanderClick: (tarea: Task) | Especifica la función que se ejecutará al hacer clic       |
|                      | => void;                       | en el expansor de tabla.                                   |
| timeStep             | number                         | Valor del intervalo de tiempo para onDateChange.           |
|                      |                                | Especifique en milisegundos.                               |

\* El gráfico deshace la operación si el método devuelve falso o error. El parámetro children devuelve registros de un nivel de profundidad.

### DisplayOption

| Nombre del     |         |
| parámetro      | Tipo    | Descripción                                                                            |
| :------------- | :------ | :------------------------------------------------------------------------------------- |
| viewMode       | enum    | Especifica la escala de tiempo. Hora, Cuarto de día, Medio día, Día, Semana            |
|                |         |  (ISO-8601, el primer día es lunes), Mes, Trimestre, Año.                              |
| viewDate       | date    | Especifica la fecha y la hora de visualización.                                        |
| preStepsCount  | number  | Especifica un espacio vacío antes de la primera tarea.                                 |
| locale         | string  | Especifica el idioma del nombre del mes. Formatos compatibles: ISO 639-2, Java Locale. |
| rtl            | boolean | Configura el modo RTL.                                                                 |

### StylingOption

| Nombre del parámetro       | Tipo   | Descripción                                                                 |
| :------------------------- | :----- | :-------------------------------------------------------------------------- |
| headerHeight               | number | Especifica la altura del encabezado.                                        |
| ganttHeight                | number | Especifica la altura del diagrama de Gantt sin encabezado. El valor         |
|                            |        | predeterminado es 0. Esto significa que no hay limitación de altura.        |
| columnWidth                | number | Especifica la duración del período de tiempo.                               |
| listCellWidth              | string | Especifica el ancho de la celda de la lista de tareas. Una cadena vacía     |
|                            |        | significa "no mostrar".                                                     |
| rowHeight                  | number | Especifica la altura de la fila de tareas.                                  |
| barCornerRadius            | number | Especifica el redondeo de las esquinas de la barra de tareas.               |
| barFill                    | number | Especifica la ocupación de la barra de tareas. Se establece en porcentaje   |
|                            |        | de 0 a 100.                                                                 |
| handleWidth                | number | Especifica el ancho del control de eventos de arrastre de la barra de       |
|                            |        | tareas para las fechas de inicio y fin.                                     |
| fontFamily                 | string | Especifica la fuente de la aplicación.                                      |
| fontSize                   | string | Especifica el tamaño de fuente de la aplicación.                            |
| barProgressColor           | string | Especifica globalmente el color de relleno de la barra de progreso de la    |
|                            |        | barra de tareas.                                                            |
| barProgressSelectedColor   | string | Especifica globalmente el color de relleno de la barra de progreso al       |
|                            |        | seleccionarla.                                                              |
| barBackgroundColor         | string | Especifica el color de relleno de fondo de la barra de tareas de forma      |
|                            |        | global.                                                                     |
| barBackgroundSelectedColor | string | Especifica el color de relleno de fondo de la barra de tareas de forma      |
|                            |        | global al seleccionarla.                                                    |
| arrowColor                 | string | Especifica el color de relleno de la flecha de relación.                    |
| arrowIndent                | number | Especifica la sangría derecha de la flecha de relación. Se establece en     |
|                            |        | píxeles.                                                                    |
| todayColor                 | string | Especifica el color de relleno de la columna del período actual.            |
| TooltipContent             |        | Especifica la vista de información sobre herramientas para la barra de      |
|                            |        | tareas seleccionada.                                                        |
| TaskListHeader             |        | Especifica la vista de encabezado de la lista de tareas                     |
| TaskListTable              |        | Especifica la vista de tabla de la lista de tareas                          |

- TooltipContent: [`React.FC<{ task: Task; fontSize: string; fontFamily: string; }>;`](https://github.com/JuanilloFox/tareas-gantt-react/blob/main/src/components/other/tooltip.tsx#L56)
- TaskListHeader: `React.FC<{ headerHeight: number; rowWidth: string; fontFamily: string; fontSize: string;}>;`
- TaskListTable: `React.FC<{ rowHeight: number; rowWidth: string; fontFamily: string; fontSize: string; locale: string; tasks: Task[]; tareaSeleccionadaId: string; setTareaSeleccionada: (treaId: string) => void; }>;`

### Task

| Nombre del                                                                                                         |
| parámetro      | Tipo     | Descripción                                                                            |
| :------------- | :------- | :------------------------------------------------------------------------------------- |
| id\*           | string   | ID de tarea.                                                                           |
| nombre\*       | string   | Nombre visual de la tarea.                                                             |
| tipo\*         | string   | Tipo de visualización de tareas: **tarea**, **milestone**, **proyecto**                |
| inicio\*       | Date     | Fecha de inicio de la tarea.                                                           |
| fin\*          | Date     | Fin de la tarea date.                                                                  |
| progreso\*     | number   | Progreso de la tarea. Se muestra en porcentaje de 0 a 100.                             |
| dependencias   | string[] | Especifica los identificadores de las dependencias principales.                        |
| styles         | object   | Especifica localmente la configuración de estilo de la barra de tareas. El objeto      |
|                |          | se pasa con los siguientes atributos:                                                  |
|                |          | - **backgroundColor**: Cadena. Especifica localmente el color de relleno del fondo de  |
|                |          |   la barra de tareas.                                                                  |
|                |          | - **backgroundSelectedColor**: Cadena. Especifica localmente el color de relleno del   |
|                |          |   fondo de la barra de tareas al seleccionarla.                                        |
|                |          | - **progressColor**: Cadena. Especifica localmente el color de relleno de la barra de  |
|                |          |   progreso.                                                                            |
|                |          | - **progressSelectedColor**: Cadena. Especifica el color de relleno de la barra de     |
|                |          |   progreso de forma global al seleccionarla.                                           |
| isDisabled     | bool     | Deshabilita todas las acciones para la tarea actual.                                   |
| fontSize       | string   | Especifica el tamaño de fuente de la barra de tareas localmente.                       |
| proyecto       | string   |Nombre del proyecto de tarea                                                            |
| hideChildren   | bool     | Ocultar elementos secundarios. El parámetro funciona solo con el tipo de proyecto.     |

\*Requerido

## Licencia

[MIT](https://oss.ninja/mit/jaredpalmer/)
