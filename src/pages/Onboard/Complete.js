import React, { useEffect } from "react";
import _ from "lodash";
import { Typography } from "@material-ui/core";
import { MailOutline } from "@material-ui/icons";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import OnboardContext from "./OnboardContext";
import styles from "./Onboard.module.css";
import useReactRouter from "use-react-router";

const Complete = props => {
  const { userDetails, completeOnboarding } = OnboardContext.useContainer();
  const {
    history,
    location: { pathname }
  } = useReactRouter();

  useEffect(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  // Trick to prevent back button
  useEffect(() => {
    if (pathname === "/onboard/complete") {
      history.push("/onboard/complete/preventback");
    }
  }, [history, pathname]);

  return (
    <IonPage>
      <IonContent>
        <section className={styles["section-blue"]}>
          <div className={styles["middle-position"]}>
            <Typography variant="h3" display="block" align="center">
              <MailOutline className={styles["email"]} />
            </Typography>
            <Typography
              variant="h4"
              display="block"
              align="center"
              className={styles["text-color"]}
            >
              This is important
            </Typography>
            <br />
            <br />
            <Typography
              variant="body1"
              display="block"
              align="center"
              className={styles["text-color"]}
            >
              {_.get(userDetails, "workEmailIsPersonalEmail") ? (
                <span data-cy="onboard-complete-check-personalemail">
                  Check your email,
                  <br />
                  <strong>{_.get(userDetails, "email")}</strong>
                </span>
              ) : (
                <span data-cy="onboard-complete-check-workemail">
                  Check your <strong>work email,</strong>
                  <br />
                  <strong>{_.get(userDetails, "workEmail")}</strong>
                </span>
              )}
            </Typography>
            <br />
            <Typography
              variant="body1"
              display="block"
              align="center"
              className={styles["text-color"]}
            >
              Click on the link to verify your account.
            </Typography>
            <br />
            <Typography
              variant="body1"
              display="block"
              align="center"
              className={styles["text-color"]}
            >
              <strong>
                You must do this to make the most of the NextPay app.
              </strong>
            </Typography>
            <br />
            <IonButton
              expand="block"
              size="default"
              color="light"
              fill="outline"
              href="/app"
              className="ion-margin-vertical height-increase"
              data-cy="onboard-complete-continue-btn"
            >
              Got it
            </IonButton>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Complete;
