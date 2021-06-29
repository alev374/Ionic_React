import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import classNames from "classnames";
import numeral from "numeral";
import styles from "./Styles.module.css";
import { Typography } from "@material-ui/core";
import { IonButton } from "@ionic/react";
import CustomKeyboardContext from "../../../../contexts/CustomKeyboardContext";
import UsersettingsContext from "../../../../contexts/UsersettingsContext";

const DailyBudgetAmount = () => {
  const {
    getUsersettings,
    setUsersetting
  } = UsersettingsContext.useContainer();
  const { manualDailyBudget } = getUsersettings(["manualDailyBudget"]);
  const {
    displayKeyboard,
    hideKeyboard
  } = CustomKeyboardContext.useContainer();
  const [initialFocus, setInitialFocus] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dailyBudgetValue, setDailyBudgetValue] = useState("");

  const onInput = useCallback(
    value => {
      console.log("dailyBudgetValue", dailyBudgetValue);
      if (value === "del" && _.toString(dailyBudgetValue).length > 0) {
        setDailyBudgetValue(prev => _.toString(prev).slice(0, -1));
      } else if (value !== "del") {
        setDailyBudgetValue(prev => `${_.toString(prev)}${value}`);
      }
    },
    [dailyBudgetValue]
  );

  const toggleKeyboard = useCallback(
    ({ show = true, skipAnimation = false }) => {
      if (show) {
        displayKeyboard({ type: "number", onInput, skipAnimation });
      } else {
        hideKeyboard({ skipAnimation });
      }
    },
    [displayKeyboard, hideKeyboard, onInput]
  );

  // console.log("manualDailyBudget", manualDailyBudget);

  useEffect(() => {
    if (!initialFocus) {
      setInitialFocus(true);
    }

    if (!initialFocus && manualDailyBudget === null) {
      setDailyBudgetValue("");
      setIsEditing(true);
      toggleKeyboard({ show: true, skipAnimation: true });
    } else if (
      !initialFocus &&
      (manualDailyBudget || manualDailyBudget === 0)
    ) {
      setDailyBudgetValue(manualDailyBudget * 100);
      setIsEditing(false);
      toggleKeyboard({ show: false, skipAnimation: true });
    }
  }, [manualDailyBudget, initialFocus, toggleKeyboard]);

  const beginEdit = () => {
    setIsEditing(true);
    toggleKeyboard({ show: true });
  };

  const endEdit = () => {
    setIsEditing(false);
    toggleKeyboard({ show: false });
    const newValue = parseInt(dailyBudgetValue) / 100;
    if (newValue !== manualDailyBudget) {
      setUsersetting("manualDailyBudget", newValue);
    }
    // console.log("dailyBudgetValue", dailyBudgetValue);
  };

  return (
    <>
      {/* <div
        className={classNames({
          [styles["dailybudget-amount"]]: true
        })}
      >
        <span className={styles["symbol"]}>₱</span>
        {numeral(parseInt(dailyBudgetValue) / 100).format("0,0.00")}
      </div> */}
      <div>
        <input
          className={classNames({
            [styles["dailybudget-amount-input"]]: true
          })}
          value={numeral(parseInt(dailyBudgetValue) / 100).format("0,0.00")}
        />
      </div>
      <Typography variant="body1" display="block" align="center">
        What's the <strong>maximum</strong> you can spend on food,
        transportation, and other things everyday?
      </Typography>
      {isEditing ? (
        <IonButton
          expand="block"
          fill="solid"
          color="primary"
          className="mt-4"
          onClick={endEdit}
        >
          Set my daily allowance
        </IonButton>
      ) : (
        <IonButton
          expand="block"
          fill="clear"
          color="primary"
          className="mt-4 text-uppercase"
          onClick={beginEdit}
        >
          Change amount
        </IonButton>
      )}
    </>
  );
};

export default DailyBudgetAmount;
