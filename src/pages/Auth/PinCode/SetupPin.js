import React, { useState, useEffect } from "react";
// import _ from "lodash";
import styles from "./PinCode.module.css";
import classNames from "classnames";
import useReactRouter from "use-react-router";
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

import AppContext from "../../../contexts/AppContext";

const SetupPin = props => {
  const { setPinCode } = AppContext.useContainer();
  const { history } = useReactRouter();

  const [disableKeypad /* setDisableKeypad */] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [inputtedPin, setInputtedPin] = useState("");
  const [initialPin, setInitialPin] = useState("");
  const [confirmedPin, setConfirmedPin] = useState("");
  const [setupState, setSetupState] = useState("initial");

  useEffect(() => {
    const watchPinCodeSetup = async () => {
      if (setupState === "initial") {
        if (initialPin.length === 4) {
          setInputtedPin("");
          setSetupState("confirm");
        }
      } else if (setupState === "confirm") {
        if (confirmedPin.length >= 4) {
          if (initialPin === confirmedPin) {
            await setPinCode(initialPin);
            history.push("/auth/pin/setup-complete");
            setSetupState("complete");
          } else {
            setStatusMessage({
              message: "Your PIN doesn't match",
              type: "error"
            });
            setInputtedPin("");
            setInitialPin("");
            setConfirmedPin("");
            setSetupState("initial");
          }
        }
      }
    };
    watchPinCodeSetup();
  }, [setupState, initialPin, confirmedPin, history, setPinCode]);

  const onInput = value => {
    setStatusMessage(null);
    if (inputtedPin.length < 4) {
      if (value === "del" && inputtedPin.length > 0) {
        setInputtedPin(prev => prev.slice(0, -1));

        if (setupState === "initial") {
          setInitialPin(prev => prev.slice(0, -1));
        } else if (setupState === "confirm") {
          setConfirmedPin(prev => prev.slice(0, -1));
        }
      } else if (value !== "del") {
        setInputtedPin(prev => `${prev}${value}`);

        if (setupState === "initial") {
          setInitialPin(prev => `${prev}${value}`);
        } else if (setupState === "confirm") {
          setConfirmedPin(prev => `${prev}${value}`);
        }
      }
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonRow className="align-items-center" style={{ height: "100%" }}>
          <IonCol>
            <section>
              <div id={styles["heading"]} data-cy="pincode-setup-heading">
                <Typography
                  variant="h5"
                  display="block"
                  align="center"
                  className="mb-4"
                >
                  {setupState === "initial"
                    ? `Set your PIN`
                    : `Re-enter your PIN`}
                </Typography>
                {setupState === "initial" ? (
                  <p>
                    Enter a 4-digit pin to securely sign into your account
                    without an internet connection.
                  </p>
                ) : (
                  <p>Re-enter your 4-digit PIN.</p>
                )}
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
                    data-cy="pincode-setup-status"
                    className={classNames(
                      styles[statusMessage.type],
                      `text-${statusMessage.type}`
                    )}
                  >
                    {statusMessage.message}
                  </div>
                ) : null}
              </div>
            </section>
          </IonCol>
        </IonRow>
      </IonContent>
      <IonFooter>
        <div className={styles["numpad"]} data-cy="pincode-setup-numpad">
          <NumPad onInput={onInput} isDisabled={disableKeypad} />
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default SetupPin;
