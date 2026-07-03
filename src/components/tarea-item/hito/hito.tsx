import React from "react";
import { TareaItemProps } from "../tarea-item";
import styles from "./hito.module.css";

export const Milestone: React.FC<TareaItemProps> = ({
  tarea,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const transform = `rotate(45 ${tarea.x1 + tarea.height * 0.356}
    ${tarea.y + tarea.height * 0.85})`;
  const getBarColor = () => {
    return isSelected
      ? tarea.styles.backgroundSelectedColor
      : tarea.styles.backgroundColor;
  };

  return (
    <g tabIndex={0} className={styles.hitoWrapper}>
      <rect
        fill={getBarColor()}
        x={tarea.x1}
        width={tarea.height}
        y={tarea.y}
        height={tarea.height}
        rx={tarea.barCornerRadius}
        ry={tarea.barCornerRadius}
        transform={transform}
        className={styles.milestoneBackground}
        onMouseDown={e => {
          isDateChangeable && onEventStart("mover", tarea, e);
        }}
      />
    </g>
  );
};
