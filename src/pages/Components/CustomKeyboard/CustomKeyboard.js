import React from "react";
import CustomKeyboardContext from "../../../contexts/CustomKeyboardContext";
import classNames from "classnames";
import { NumPad } from "../";

import styles from "./CustomKeyboard.module.css";

const CustomKeyboard = () => {
  const {
    keyboardIsShown,
    triggerInput
  } = CustomKeyboardContext.useContainer();
  const { type, skipAnimation, show } = keyboardIsShown;

  const onInput = value => {
    triggerInput(value);
  };

  return (
    <div
      className={classNames(styles["keyboard-container"], {
        [styles.show]: show,
        [styles["no-animation"]]: skipAnimation
      })}
    >
      <NumPad onInput={onInput} type={type} />
    </div>
  );
};

export default CustomKeyboard;
