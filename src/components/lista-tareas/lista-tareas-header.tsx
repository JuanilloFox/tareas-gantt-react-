import React from "react";
import styles from "./lista-tareas-header.module.css";

export const CabeceraListaTareasPredeterminada: React.FC<{
  altoCabecera: number;
  anchoFila: string;
  fontFamily: string;
  fontSize: string;
}> = ({ altoCabecera, fontFamily, fontSize, anchoFila }) => {
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: altoCabecera - 2,
        }}
      >
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: anchoFila,
          }}
        >
          &nbsp;Nombre
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: altoCabecera * 0.5,
            marginTop: altoCabecera * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: anchoFila,
          }}
        >
          &nbsp;Desde
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: altoCabecera * 0.5,
            marginTop: altoCabecera * 0.25,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: anchoFila,
          }}
        >
          &nbsp;Hasta
        </div>
      </div>
    </div>
  );
};
