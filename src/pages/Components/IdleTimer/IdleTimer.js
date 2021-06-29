import React, { useState, useEffect, useRef, useCallback } from "react";
import _ from "lodash";
import {
  IonModal,
  IonContent,
  IonFooter,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from "@ionic/react";
import IdleTimer from "react-idle-timer";
import { Typography } from "@material-ui/core";
import styles from "./IdleTimer.module.css";
import classNames from "classnames";
import { storage } from "../../../services";
import UserContext from "../../../contexts/UserContext";
import useReactRouter from "use-react-router";
import * as qs from "query-string";

const IdleTimerComponent = () => {
  const [timeToLock, setTimeToLock] = useState(1000 * 60 * 5); // Default 5 minutes
  const [lockoutCountdownAmount, setLockoutCountdown] = useState(30); // Default 5 minutes
  const { user } = UserContext.useContainer();
  const { history, location } = useReactRouter();
  const { lockoutTime, lockoutTimeCountdown } = qs.parse(location.search);
  const [showModal, setShowModal] = useState(false);
  const idleTimer = useRef(null);
  const countdownTimer = useRef(null);
  const [countdownLeft, setCountdownLeft] = useState(null);

  const lockout = useCallback(() => {
    setShowModal(false);
    storage.setItem("isLocked", true);
    history.push("/auth/pin/enter?preventback=true");
  }, [history]);

  useEffect(() => {
    if (lockoutTime && parseInt(lockoutTime) > 0) {
      setTimeToLock(parseInt(lockoutTime));
    } else {
      setTimeToLock(1000 * 60 * 5);
    }

    if (lockoutTimeCountdown && parseInt(lockoutTimeCountdown)) {
      setLockoutCountdown(lockoutTimeCountdown);
    } else {
      setLockoutCountdown(30);
    }
  }, [lockoutTime, lockoutTimeCountdown]);

  useEffect(() => {
    if (countdownLeft === null) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
      return;
    } else if (countdownLeft > 0) {
      countdownTimer.current = setTimeout(() => {
        setCountdownLeft(prev => (prev -= 1));
      }, 1000);
    } else {
      lockout();
    }
  }, [countdownLeft, lockout]);

  // console.log("timeToLock", timeToLock);

  const onAction = e => {
    // console.log("user did something", e);
  };

  const onActive = e => {
    // console.log("user is active", e);
    // console.log("time remaining", idleTimer.current.getRemainingTime());
  };

  const onIdle = e => {
    // console.log("user is idle", e);
    // console.log("last active", idleTimer.current.getLastActiveTime());
    if (
      countdownLeft === null &&
      user &&
      _.get(storage.getItem("locksettings"), "pin") &&
      !storage.getItem("isLocked")
    ) {
      setCountdownLeft(lockoutCountdownAmount);
      setShowModal(true);
    }
  };

  return (
    <>
      <IdleTimer
        ref={ref => {
          idleTimer.current = ref;
        }}
        element={document}
        onActive={onActive}
        onIdle={onIdle}
        onAction={onAction}
        debounce={250}
        timeout={timeToLock}
      />
      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setCountdownLeft(null)}
        cssClass="modal-medium"
        data-cy="lockout-countdown-modal"
      >
        <IonContent>
          <div className="m-3 text-center">
            <Typography variant="overline" display="block" align="center">
              Are you still there?
            </Typography>

            <div className={classNames(styles["countdown-timer"], "my-3")}>
              {countdownTimer === null ? lockoutCountdownAmount : countdownLeft}
            </div>

            <p>
              Looks like you're away.
              <br />
              For your security, we'll sign you out
            </p>
          </div>
        </IonContent>
        <IonFooter>
          <IonToolbar>
            <IonGrid>
              <IonRow className="px-3 pb-2">
                <IonCol>
                  {/* Next */}
                  <IonButton
                    expand="block"
                    size="default"
                    color="primary"
                    fill="outline"
                    className="mr-1 height-increase"
                    onClick={lockout}
                    data-cy="lockout-countdown-logout-btn"
                  >
                    Sign out
                  </IonButton>
                </IonCol>
                <IonCol>
                  {/* Next */}
                  <IonButton
                    expand="block"
                    size="default"
                    color="primary"
                    onClick={() => setShowModal(false)}
                    className="ml-1 height-increase"
                    data-cy="lockout-countdown-stay-btn"
                  >
                    Stay signed in
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonFooter>
      </IonModal>
    </>
  );
};

export default IdleTimerComponent;
