import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonModal,
  IonButton
} from "@ionic/react";
import { Typography, Snackbar, SnackbarContent } from "@material-ui/core";
import { Close, ListAlt } from "@material-ui/icons";
import UsersettingsContext from "../../../contexts/UsersettingsContext";
import classNames from "classnames";
import styles from "./DailyBudget.module.css";
import Intro from "./Components/Intro";
import DailyBudgetAmount from "./Components/DailyBudgetAmount";

const DailyBudget = () => {
  const {
    getUsersettings
    // setUsersetting
  } = UsersettingsContext.useContainer();
  const { manualDailyBudget } = getUsersettings(["manualDailyBudget"]);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  useEffect(() => {
    if (manualDailyBudget === null) {
      const modalTimeout = setTimeout(() => {
        setShowIntroModal(true);
        clearInterval(modalTimeout);
      }, 200);
    }
  }, [manualDailyBudget]);

  const props = useSpring({ opacity: !isEditingBudget ? 1 : 0 });
  const [isOpen, setIsOpen] = useState(true);
  const [isResent, setIsResent] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpen(false);
  };

  const handleResend = () => {
    setIsResent(true); // logic might change
  };

  const VerifyBanner = props => {
    return (
      <SnackbarContent
        className="bg-warning"
        message={
          <div className="d-flex align-items-start">
            <Typography variant="h5" display="block" align="center">
              <ListAlt className="mr-2" fontSize="large" />
            </Typography>

            {isResent ? (
              <span>
                <Typography
                  variant="body2"
                  display="block"
                  className="text-white"
                >
                  Verification email resent! Check your inbox.
                </Typography>
              </span>
            ) : (
              <span>
                <Typography
                  variant="body1"
                  display="block"
                  className="text-white text-uppercase font-weight-bold"
                >
                  important
                </Typography>
                <Typography
                  variant="body2"
                  display="block"
                  className="text-white"
                >
                  Please go to your email and verify{" "}
                  <b>workperson@workemail.com</b>.
                </Typography>
                <br />
                <Typography
                  variant="button"
                  display="block"
                  className="text-white text-uppercase"
                  onClick={handleResend}
                >
                  resend email
                </Typography>
              </span>
            )}

            <Close onClick={handleClose} />
          </div>
        }
      />
    );
  };

  return (
    <IonPage>
      <IonModal isOpen={showIntroModal} animated={true}>
        <Intro
          dismissModal={() => {
            setShowIntroModal(false);
            setIsEditingBudget(true);
          }}
        />
      </IonModal>

      {isOpen ? (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={isOpen}
          onClose={handleClose}
          className="rounded-0"
        >
          <VerifyBanner />
        </Snackbar>
      ) : null}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Set Your Daily Allowance</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={styles["dailybudget-container"]}>
          <div className={styles["blue-container"]}></div>
          <IonCard
            className={classNames(styles["dailybudget-main"], "bg-light")}
          >
            <IonCardHeader>
              <IonCardSubtitle className="text-center">
                What's your daily allowance?
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <DailyBudgetAmount
                isEditingBudget={isEditingBudget}
                setIsEditingBudget={setIsEditingBudget}
              />
              {!isEditingBudget ? (
                <>
                  <Typography variant="body1" display="block" align="center">
                    This is the <strong>maximum</strong> you can spend on food,
                    transportation, and other things today.
                  </Typography>
                  <IonButton
                    expand="block"
                    fill="clear"
                    color="primary"
                    className="mt-4 text-uppercase height-increase"
                    onClick={() => setIsEditingBudget(true)}
                  >
                    Change amount
                  </IonButton>
                </>
              ) : null}
            </IonCardContent>
          </IonCard>
        </div>
        <animated.div style={props}>
          Did you spend within your means today?
        </animated.div>
      </IonContent>
    </IonPage>
  );
};

export default DailyBudget;
