import React, { useState } from "react";
import { createContainer } from "unstated-next";
import _ from "lodash";
export const RootContext = React.createContext();

const useToast = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toastProps, setToastProps] = useState({});

  const setToast = ({
    message,
    duration = 2000,
    showCloseButton = false,
    position = "top",
    color = "dark"
  }) => {
    if (message === _.get(toastProps, "message")) {
      return;
    }
    setToastProps({
      message,
      duration,
      showCloseButton,
      position,
      color
    });

    setIsOpen(true);
  };

  const hideToast = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    setToast,

    toastProps,
    hideToast
  };
};

export default createContainer(useToast);
