"use client";

import { useEffect } from "react";

export function DisableContextMenu() {
  useEffect(() => {
    function preventContextMenu(event: MouseEvent) {
      event.preventDefault();
    }

    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  return null;
}
