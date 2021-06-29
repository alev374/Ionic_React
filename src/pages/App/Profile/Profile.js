import React from "react";
import _ from "lodash";
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonProgressBar
} from "@ionic/react";
import { Typography } from "@material-ui/core";
import styles from "./Profile.module.css";
import UserContext from "../../../contexts/UserContext";
import AuthContext from "../../../contexts/AuthContext";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { getHours } from "date-fns";

import { useProfileCompletion } from "../ProfileChecklist/ProfileChecklist";

const Profile = () => {
  const { user } = UserContext.useContainer();
  const { logout } = AuthContext.useContainer();
  const { progress } = useProfileCompletion();

  const phoneNumber = parsePhoneNumberFromString(
    _.get(user, "phoneNumber")
  ).formatInternational();

  let greetingMessage = "Good Morning!";
  const currentHour = getHours(new Date());
  if (currentHour >= 12 && currentHour < 18) {
    greetingMessage = "Good Afternoon!";
  } else if (currentHour >= 18 && currentHour < 24) {
    greetingMessage = "Good Evening!";
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <div className="d-flex justify-content-between align-items-center">
              <span>{greetingMessage}</span>
              <div className="d-flex flex-column justify-content-end">
                <Typography
                  variant="caption"
                  align="right"
                  display="block"
                  className="text-uppercase"
                >
                  next payday:
                </Typography>
                <Typography
                  variant="caption"
                  align="right"
                  display="block"
                  className="text-uppercase"
                >
                  2 days
                </Typography>
              </div>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section className="my-4">
          <Typography
            variant="h5"
            display="block"
            className="mb-3 font-weight-bold"
          >
            About You
          </Typography>
          <IonCard className="mx-0">
            <IonCardHeader>
              <div id={styles["profile-photo"]}></div>
              <IonCardTitle className="text-center">
                {`${_.get(user, "firstName")} ${_.get(user, "lastName")}`}
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent className="text-center">
              <Typography variant="body1" display="block">
                {phoneNumber}
              </Typography>
              <Typography variant="body1" display="block">
                {_.get(user, "email")}
              </Typography>
              <Typography
                variant="button"
                display="block"
                className="mt-4 text-primary"
              >
                change photo
              </Typography>
            </IonCardContent>
          </IonCard>
          <IonCard className="mx-0 bg-primary" href="/app/profile/checklist">
            <IonCardContent>
              <div className="d-flex justify-content-between">
                <Typography
                  variant="body1"
                  display="block"
                  className="text-white"
                >
                  Personal Information
                </Typography>
                <Typography
                  variant="body1"
                  display="block"
                  className="text-white"
                >
                  {Math.round(progress * 100)}% complete
                </Typography>
              </div>
              <IonProgressBar
                value={progress}
                className="my-2"
              ></IonProgressBar>
            </IonCardContent>
          </IonCard>
          <IonCard className="mx-0" href="#">
            <IonCardContent>
              <Typography variant="body1" display="block">
                Personal Information
              </Typography>
            </IonCardContent>
          </IonCard>
          <IonCard className="mx-0" href="#" disabled>
            <IonCardContent>
              <Typography variant="body1" display="block">
                Employment Information
              </Typography>
            </IonCardContent>
          </IonCard>
          <IonCard className="mx-0" href="#" disabled>
            <IonCardContent>
              <Typography variant="body1" display="block">
                Financial Information
              </Typography>
            </IonCardContent>
          </IonCard>
        </section>

        <section className="my-5">
          <Typography
            variant="h5"
            display="block"
            className="mb-3 font-weight-bold"
          >
            App Settings
          </Typography>
          <IonCard className="mx-0" href="#" disabled>
            <IonCardContent>
              <Typography variant="body1" display="block">
                Password
              </Typography>
            </IonCardContent>
          </IonCard>
          <IonCard className="mx-0" href="#" disabled>
            <IonCardContent>
              <Typography variant="body1" display="block">
                Notifications
              </Typography>
            </IonCardContent>
          </IonCard>
          <IonCard className="mx-0" href="#" disabled>
            <IonCardContent>
              <Typography variant="body1" display="block">
                Help & FAQ
              </Typography>
            </IonCardContent>
          </IonCard>
        </section>

        <section className="my-5">
          <Typography
            variant="h5"
            display="block"
            className="mb-3 font-weight-bold"
          >
            Other
          </Typography>
          <IonCard className="mx-0" href="#" disabled>
            <IonCardContent>
              <Typography variant="body1" display="block">
                Privacy Policy
              </Typography>
            </IonCardContent>
          </IonCard>
          <IonCard className="mx-0" href="#" disabled>
            <IonCardContent>
              <Typography variant="body1" display="block">
                Terms & Conditions
              </Typography>
            </IonCardContent>
          </IonCard>
          <IonCard className="mx-0" onClick={logout}>
            <IonCardContent>
              <Typography variant="body1" display="block">
                Log Out
              </Typography>
            </IonCardContent>
          </IonCard>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
