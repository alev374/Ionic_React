import React, { useState, useEffect, useRef } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import _ from "lodash";
import styles from "./Verify.module.css";
import classNames from "classnames";
import useReactRouter from "use-react-router";
import * as qs from "query-string";
import { analytics } from "../../../services";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonBackButton,
  IonButton,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";
import { Typography } from "@material-ui/core";
import { NumPad } from "../../Components";

// import UserContext from "../../../contexts/UserContext";
import AuthContext from "../../../contexts/AuthContext";
import config from "../../../config";
let serverURI = config.server.serverURI;

const RESEND_VERIFICATIONSMS_MUTATION = gql`
  mutation ResendVerificationSms($phoneNumber: String!) {
    resendVerificationSms(phoneNumber: $phoneNumber)
  }
`;

const Verify = props => {
  const { validateToken, jwt } = AuthContext.useContainer();
  const { history, location } = useReactRouter();
  const { phoneNumber } = qs.parse(location.search);
  const [inputtedToken, setInputtedToken] = useState("");
  const [disableKeypad, setDisableKeypad] = useState(false);
  const [, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [resendTimer, setResendTimer] = useState(59);
  const timer = useRef(null);
  const [resendVerificationSms] = useMutation(RESEND_VERIFICATIONSMS_MUTATION);
  const isVerified = useRef(false);

  useEffect(() => {
    timer.current = setInterval(() => {
      if (resendTimer >= 0) {
        setResendTimer(prev => (prev -= 1));
      } else {
        clearInterval(timer.current);
        timer.current = null;
      }
    }, 1000);

    // Delete timer when leaving this page.
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    const verify = async values => {
      setSubmitting(true);

      const rawResponse = await fetch(`${serverURI}/auth/verify-phonenumber`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
          token: _.toString(values.token)
        })
      });
      const content = await rawResponse.json();
      console.log("response", content);
      if (content.error) {
        setDisableKeypad(false);
        // console.log("error", content);
        setInputtedToken("");

        if (location.pathname === "/auth/verify") {
          analytics.logEvent("verification_failed");
        }
        switch (content.statusCode) {
          case 400:
            setStatusMessage({
              message: "The verification code is incorrect",
              type: "error"
            });
            break;
          default:
            setStatusMessage({
              message: "The verification code is incorrect",
              type: "error"
            });
            break;
        }
      } else {
        // console.log("content.user", content.user);
        await validateToken();
        if (location.pathname === "/auth/verify") {
          analytics.logEvent("verification_success");
        }
        isVerified.current = true;
        // history.push("/");
        history.push("/auth/pin/setup?preventback=true");
      }
      setSubmitting(false);
    };

    if (inputtedToken.length === 6 && isVerified.current === false) {
      setDisableKeypad(true);
      verify({
        token: inputtedToken
      });
    }
  }, [inputtedToken, history, jwt, validateToken, location.pathname]);

  const resendToken = () => {
    console.log("phoneNumber", phoneNumber);
    analytics.logEvent("verification_resent");
    resendVerificationSms({
      variables: { phoneNumber }
    });
    setStatusMessage({ message: "Verification code resent!", type: "notice" });
    setResendTimer(59);
    timer.current = setInterval(() => {
      if (resendTimer >= 0) {
        setResendTimer(prev => (prev -= 1));
      } else {
        clearInterval(timer.current);
        timer.current = null;
      }
    }, 1000);
  };

  const onInput = value => {
    if (inputtedToken.length <= 6) {
      if (value === "del" && inputtedToken.length > 0) {
        setInputtedToken(prev => prev.slice(0, -1));
      } else if (value !== "del") {
        setInputtedToken(prev => `${prev}${value}`);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Phone Verification</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow
          className="align-items-center bg-white"
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
                  Check your phone
                </Typography>
                <p>
                  Enter the 6-digit verification code we sent to {phoneNumber}
                </p>
              </div>
              <IonGrid className={styles["token-input-container"]}>
                <IonRow>
                  <IonCol className={styles["token-input"]}>
                    {inputtedToken[0] || "_"}
                  </IonCol>
                  <IonCol className={styles["token-input"]}>
                    {inputtedToken[1] || "_"}
                  </IonCol>
                  <IonCol className={styles["token-input"]}>
                    {inputtedToken[2] || "_"}
                  </IonCol>
                  <IonCol className={styles["token-input"]}>
                    {inputtedToken[3] || "_"}
                  </IonCol>
                  <IonCol className={styles["token-input"]}>
                    {inputtedToken[4] || "_"}
                  </IonCol>
                  <IonCol className={styles["token-input"]}>
                    {inputtedToken[5] || "_"}
                  </IonCol>
                </IonRow>
              </IonGrid>
              <div className={styles["pin-info"]}>
                {statusMessage ? (
                  <div
                    className={classNames(
                      styles[statusMessage.type],
                      `text-${statusMessage.type}`
                    )}
                    data-cy="verify-status-message"
                  >
                    {statusMessage.message}
                  </div>
                ) : null}

                <div className={styles["resend"]}>
                  {resendTimer > 0 ? (
                    <span data-cy="verify-resend-timer">
                      Resend code in {resendTimer} seconds
                    </span>
                  ) : (
                    <IonButton
                      fill="clear"
                      size="small"
                      color="dark"
                      onClick={resendToken}
                      data-cy="verify-resend-btn"
                    >
                      Resend code
                    </IonButton>
                  )}
                </div>
              </div>
            </section>
          </IonCol>
        </IonRow>
      </IonContent>
      <IonFooter className="bg-white">
        <div className={styles["numpad"]} data-cy="verification-numpad">
          <NumPad onInput={onInput} isDisabled={disableKeypad} />
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Verify;
