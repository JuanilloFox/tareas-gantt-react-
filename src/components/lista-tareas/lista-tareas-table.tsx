import React, { useMemo } from "react";
import styles from "./lista-tareas-table.module.css";
import { Tarea } from "../../types/public-types";

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

interface TablaListaTareasProps {
  altoFila: number;
  anchoFila: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tareas: Tarea[];
  tareaSeleccionadaId: string;
  setTareaSeleccionada: (tareaId: string) => void;
  onExpanderClick: (tarea: Tarea) => void;
}

export const TablaListaTareasPredeterminada: React.FC<TablaListaTareasProps> = ({
  altoFila,
  anchoFila,
  tareas,
  fontFamily,
  fontSize,
  locale,
  tareaSeleccionadaId,
  setTareaSeleccionada,
  onExpanderClick,
}) => {
  // Intl.DateTimeFormat es la forma estándar y nativa más rápida de formatear fechas
  const formatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale, dateTimeOptions);
  }, [locale]);

  return (
    <div
      className={styles.listaTareasWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        // Inyectamos las variables dinámicas una sola vez en el padre
        ["--row-height" as any]: `${altoFila}px`,
        ["--row-width" as any]: anchoFila,
      }}
    >
      {tareas.map((t) => {
        // Determinamos el símbolo del expansor de forma limpia
        const expanderSymbol =
          t.ocultarHijos === false ? "▼" : t.ocultarHijos === true ? "▶" : "";

        // Comprobamos si la fila actual es la seleccionada
        const isSelected = t.id === tareaSeleccionadaId;

        return (
          <div
            className={`${styles.listaTareasTableRow} ${isSelected ? styles.selectedRow : ""}`}
            key={t.id} // Evita usar sufijos como 'row' si el id ya es único
            onClick={() => setTareaSeleccionada(t.id)}
          >
            <div className={styles.listaTareasCell} title={t.nombre}>
              <div className={styles.listaTareasNameWrapper}>
                <div
                  className={
                    expanderSymbol
                      ? styles.listaTareasExpander
                      : styles.listaTareasEmptyExpander
                  }
                  onClick={(e) => {
                    e.stopPropagation(); // Evita activar la selección de fila al expandir
                    onExpanderClick(t);
                  }}
                >
                  {expanderSymbol}
                </div>
                <div>{t.nombre}</div>
              </div>
            </div>

            <div className={styles.listaTareasCell}>
              &nbsp;{formatter.format(t.inicio)}
            </div>

            <div className={styles.listaTareasCell}>
              &nbsp;{formatter.format(t.fin)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
