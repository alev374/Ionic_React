import { useState, useRef } from "react";
// import _ from "lodash";
import { createContainer } from "unstated-next";
// import { Plugins } from "@capacitor/core";

// const { App } = Plugins;

// App.addListener("backButton", data => {
//   alert("Back button!", data);
// });

function useCustomKeyboard() {
  const [keyboardIsShown, setKeyboardIsShown] = useState(false);
  const onInputFunc = useRef(() => {});

  const triggerInput = value => {
    onInputFunc.current(value);
  };

  const displayKeyboard = options => {
    const { type = "number", onInput = () => {}, skipAnimation = false } =
      options || {};
    onInputFunc.current = onInput;
    setKeyboardIsShown({
      type,
      show: true,
      skipAnimation
    });
  };

  const hideKeyboard = options => {
    const { skipAnimation = false } = options || {};
    onInputFunc.current = () => {};
    setKeyboardIsShown(prev => ({
      type: prev.type,
      show: false,
      skipAnimation
    }));
  };

  return {
    keyboardIsShown,
    displayKeyboard,
    hideKeyboard,
    triggerInput
  };
}

export default createContainer(useCustomKeyboard);
