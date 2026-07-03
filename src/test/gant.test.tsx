import React from "react";
import { createRoot } from "react-dom/client";
import { Gantt } from "../index";

describe("gantt", () => {
  it("renderiza sin fallar", () => {
    const div = document.createElement("div");
    const root = createRoot(div);
    root.render(
      <Gantt
        tasks={[
          {
            start: new Date(2020, 0, 1),
            end: new Date(2020, 2, 2),
            name: "Rediseño del sitio web",
            id: "Tarea 0",
            progress: 45,
            type: "tarea",
          },
        ]}
      />
    );
  });
});
