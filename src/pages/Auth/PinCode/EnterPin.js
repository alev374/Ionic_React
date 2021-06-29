import React, { useState, useEffect, useRef } from "react";
import { Plugins, HapticsImpactStyle } from "@capacitor/core";
// import _ from "lodash";
import styles from "./PinCode.module.css";
import classNames from "classnames";
import useReactRouter from "use-react-router";
import { storage } from "../../../services";
import { fromUnixTime, addSeconds, differenceInSeconds } from "date-fns";
import {
  IonPage,
  IonContent,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";
import { Typography } from "@material-ui/core";
import { NumPad } from "../../Components";
import * as qs from "query-string";

import AppContext from "../../../contexts/AppContext";

const EnterPin = props => {
  const retryTimerLength =
    window.localStorage.getItem("cy-lockout-retrytimer") || 30;
  const { checkPinCode } = AppContext.useContainer();
  const { history, location } = useReactRouter();
  const { returnto } = qs.parse(location.search);

  const [disableKeypad, setDisableKeypad] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [inputtedPin, setInputtedPin] = useState("");
  const [retryTimer, setRetryTimer] = useState(null);
  const timer = useRef(null);

  /* On page load */
  useEffect(() => {
    // Check if user has an existing PIN-code retry timeout
    // (Prevents people from circumventing the 30-second retry rule by
    // restarting the app.)
    const { failedAttempts = 0, lastFailedAttempt } =
      storage.getItem("locksettings") || {};

    if (failedAttempts >= 3) {
      const lockUntil = addSeconds(
        fromUnixTime(lastFailedAttempt),
        retryTimerLength
      );
      const secondsLeft = differenceInSeconds(lockUntil, new Date());
      setDisableKeypad(true);
      setRetryTimer(secondsLeft);
      setStatusMessage({
        message: "Invalid PIN Code",
        type: "error"
      });
    }

    // Remove all timers et al when leaving the page.
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, []); // eslint-disable-line

  /* Watch and execute retry timer */
  useEffect(() => {
    if (retryTimer === null) {
      return;
    } else if (retryTimer > 0) {
      timer.current = setTimeout(() => {
        setRetryTimer(prev => (prev -= 1));
      }, 1000);
    } else {
      setDisableKeypad(false);
      setInputtedPin("");
      setRetryTimer(null);
      setStatusMessage(null);
      clearInterval(timer.current);
      timer.current = null;
    }
  }, [retryTimer]);

  /* Logic for validating PIN */
  useEffect(() => {
    if (inputtedPin.length >= 4 && retryTimer === null) {
      const validPin = checkPinCode(inputtedPin);

      if (validPin) {
        setStatusMessage({
          message: "Awesome!",
          type: "success"
        });
        storage.setItem("isLocked", false);
        if (returnto) {
          history.push(returnto);
        } else {
          history.push("/");
        }
      } else {
        Plugins.Haptics.impact({
          style: HapticsImpactStyle.HEAVY
        });

        setStatusMessage({
          message: "Invalid PIN Code",
          type: "error"
        });

        const { failedAttempts } = storage.getItem("locksettings") || {};

        if (failedAttempts >= 3) {
          setDisableKeypad(true);
          setRetryTimer(retryTimerLength);
        } else {
          setInputtedPin("");
        }
      }
    }
  }, [
    inputtedPin,
    checkPinCode,
    retryTimer,
    history,
    returnto,
    retryTimerLength
  ]);

  const onInput = value => {
    setStatusMessage(null);
    if (inputtedPin.length < 4) {
      if (value === "del" && inputtedPin.length > 0) {
        setInputtedPin(prev => prev.slice(0, -1));
      } else if (value !== "del") {
        setInputtedPin(prev => `${prev}${value}`);
      }
    }
  };

  return (
    <IonPage className="bg-primary">
      <IonContent>
        <IonRow
          className="align-items-center bg-primary text-light"
          style={{ height: "100%" }}
        >
          <IonCol>
            <section>
              <div id={styles["heading"]}>
                <Typography
                  variant="h5"
                  display="block"
                  align="center"
                  className="mb-4"
                >
                  Enter your PIN
                </Typography>
                <p>Enter your 4-digit NextPay PIN.</p>
              </div>
              <IonGrid className={styles["token-input-container"]}>
                <IonRow>
                  <IonCol className={styles["token-input"]}>
                    {inputtedPin[0] ? <span>&#9679;</span> : false || "_"}
                  </IonCol>
                  <IonCol className={styles["token-input"]}>
                    {inputtedPin[1] ? <span>&#9679;</span> : false || "_"}
                  </IonCol>
                  <IonCol className={styles["token-input"]}>
                    {inputtedPin[2] ? <span>&#9679;</span> : false || "_"}
                  </IonCol>
                  <IonCol className={styles["token-input"]}>
                    {inputtedPin[3] ? <span>&#9679;</span> : false || "_"}
                  </IonCol>
                </IonRow>
              </IonGrid>
              <div className={styles["pin-info"]}>
                {statusMessage ? (
                  <div
                    data-cy="pincode-enter-status"
                    className={classNames(
                      styles[statusMessage.type],
                      `text-${statusMessage.type}`
                    )}
                  >
                    {statusMessage.message}
                  </div>
                ) : null}

                <div
                  className={styles["retry"]}
                  data-cy="pincode-enter-retrytimer"
                >
                  {retryTimer && retryTimer > 0 ? (
                    <span>You may try again in {retryTimer} seconds</span>
                  ) : null}
                </div>
              </div>
            </section>
          </IonCol>
        </IonRow>
      </IonContent>
      <IonFooter>
        <div className={styles["numpad"]} data-cy="pincode-enter-numpad">
          <NumPad
            onInput={onInput}
            isDisabled={disableKeypad}
            buttonClassName="text-light"
          />
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default EnterPin;
