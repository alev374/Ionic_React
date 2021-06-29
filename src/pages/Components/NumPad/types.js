import React from "react";
import { backspace } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

export const numberLayout = [
  [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" }
  ],
  [
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" }
  ],
  [
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" }
  ],
  [
    null,
    { value: 0, label: "0" },
    { value: "del", label: <IonIcon icon={backspace} /> }
  ]
];

export const decimalLayout = [
  [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" }
  ],
  [
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" }
  ],
  [
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" }
  ],
  [
    { value: ".", label: "." },
    { value: 0, label: "0" },
    { value: "del", label: <IonIcon icon={backspace} /> }
  ]
];
