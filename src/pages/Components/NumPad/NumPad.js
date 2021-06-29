import React from "react";
import { Plugins, HapticsImpactStyle } from "@capacitor/core";
// import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import classNames from "classnames";
import styles from "./NumPad.module.css";

import { decimalLayout, numberLayout } from "./types";

const { Haptics } = Plugins;

const layoutTypes = {
  token: numberLayout,
  number: numberLayout,
  decimal: decimalLayout
};

const KeyInput = ({
  label = "",
  value,
  onInput = () => {},
  isDisabled,
  buttonClassName
}) => {
  if (!label) {
    return null;
  }
  return (
    <Button
      className={classNames(styles["numpad-button"], buttonClassName)}
      data-cy={`numpad-${value}`}
      onMouseDown={() => {
        onInput(value);
        Haptics.impact({
          style: HapticsImpactStyle.Light
        });
      }}
      disabled={isDisabled}
    >
      {label}
    </Button>
  );
};

const NumPad = ({
  onInput,
  isDisabled,
  type = "token",
  buttonClassName,
  ...props
}) => {
  const numpadValues = layoutTypes[type];

  return (
    <div data-cy="numpad">
      <IonGrid>
        {numpadValues.map((row, r) => (
          <IonRow key={r}>
            {row.map((col, c) => (
              <IonCol key={c}>
                <KeyInput
                  {...col}
                  onInput={onInput}
                  isDisabled={isDisabled}
                  buttonClassName={buttonClassName}
                />
              </IonCol>
            ))}
          </IonRow>
        ))}
      </IonGrid>
    </div>
  );
};

export default NumPad;
