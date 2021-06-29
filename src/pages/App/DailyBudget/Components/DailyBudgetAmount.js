import React, { useEffect, useState, useRef, forwardRef } from "react";
// import _ from "lodash";
import classNames from "classnames";
import NumberFormat from "react-number-format";
import AutosizeInput from "react-input-autosize";
import numeral from "numeral";
import styles from "./Styles.module.css";
import { Typography } from "@material-ui/core";
import { IonButton } from "@ionic/react";
import { analytics } from "../../../../services";
import UsersettingsContext from "../../../../contexts/UsersettingsContext";

const BudgetAmountInput = forwardRef((props, ref) => {
  const amountInputRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      // console.log("GO");
      amountInputRef.current.copyInputStyles();
    }, 100);
  }, [props]);
  return (
    <div
      className={classNames({
        [styles["dailybudget-amount-input"]]: true
      })}
    >
      <span className={styles.symbol}>₱</span>
      <AutosizeInput
        ref={amountInputRef}
        {...props}
        value={props.value}
        inputMode="decimal"
      />
    </div>
  );
});

const DailyBudgetAmount = ({ setIsEditingBudget, isEditingBudget }) => {
  const {
    getUsersettings,
    setUsersetting
  } = UsersettingsContext.useContainer();
  const { manualDailyBudget } = getUsersettings(["manualDailyBudget"]);
  const [dailyBudgetValue, setDailyBudgetValue] = useState("");
  const [inputFontSize, setInputFontSize] = useState("1em");
  const inputRef = useRef(null);

  // console.log("manualDailyBudget", manualDailyBudget);

  useEffect(() => {
    if (isEditingBudget) {
      inputRef.current.focus();
    }
  }, [isEditingBudget]);

  useEffect(() => {
    setDailyBudgetValue(manualDailyBudget);
  }, [manualDailyBudget]);

  const endEdit = () => {
    setIsEditingBudget(false);
    const newValue = numeral(dailyBudgetValue).value();
    if (newValue !== manualDailyBudget) {
      setUsersetting("manualDailyBudget", newValue);
      analytics.logEvent("set_budget_manual", {
        oldValue: manualDailyBudget,
        newValue: newValue
      });
    }
    // console.log("dailyBudgetValue", dailyBudgetValue);
  };

  const onValueChange = ({ value }) => {
    // Change font-size as the number of digits increases
    const newInputFontSize = 1 - value.length * (0.2 / 7);
    setInputFontSize(`${newInputFontSize}`);

    setDailyBudgetValue(value);
  };

  const isAllowed = ({ value }) => {
    const maxDigits = 7;
    const maxValue = numeral(9999.99).value();
    if (numeral(value).value() <= maxValue && value.length <= maxDigits) {
      return true;
    }

    return false;
  };

  return (
    <>
      <div
        style={{
          transform: `scale(${inputFontSize})`,
          transition: "transform 100ms ease-out"
        }}
      >
        <NumberFormat
          inputRef={el => {
            inputRef.current = el;
          }}
          thousandSeparator={true}
          decimalScale={2}
          allowNegative={false}
          isNumericString={true}
          allowLeadingZeros={false}
          defaultValue={0}
          onValueChange={onValueChange}
          isAllowed={isAllowed}
          placeholder="0"
          value={dailyBudgetValue}
          readOnly={!isEditingBudget}
          onBlur={() => {
            if (isEditingBudget) {
              inputRef.current.focus();
            }
          }}
          customInput={BudgetAmountInput}
        />
      </div>

      {isEditingBudget ? (
        <>
          <Typography variant="body1" display="block" align="center">
            What's the <strong>maximum</strong> you can spend on food,
            transportation, and other things everyday?
          </Typography>
          <IonButton
            expand="block"
            fill="solid"
            color="primary"
            className="mt-4"
            onClick={endEdit}
          >
            Set my daily allowance
          </IonButton>
        </>
      ) : null}
    </>
  );
};

export default DailyBudgetAmount;
