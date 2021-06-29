import React from "react";
import _ from "lodash";
import { Typography } from "@material-ui/core";
import { CheckCircle, CheckCircleOutline } from "@material-ui/icons";
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonList
} from "@ionic/react";
import UserContext from "../../../contexts/UserContext";
import styles from "./ProfileChecklist.module.css";

export const useProfileCompletion = () => {
  const { user } = UserContext.useContainer();
  let info = [
    {
      name: "fullName",
      label: "Full Name",
      isComplete: !!(_.get(user, "firstName") && _.get(user, "lastName"))
    },

    {
      name: "address",
      label: "Address",
      isComplete: !!(
        _.get(user, "address.addressline1") &&
        _.get(user, "address.city") &&
        _.get(user, "address.stateOrProvince") &&
        _.get(user, "address.postalcode") &&
        _.get(user, "address.country")
      )
    },

    {
      name: "birthdate",
      label: "Birthdate",
      isComplete: !!_.get(user, "birthdate")
    },

    {
      name: "email",
      label: "Email Address",
      isComplete: !!_.get(user, "email")
    },

    {
      name: "maritalStatus",
      label: "Marital status",
      isComplete: !!_.get(user, "maritalStatus")
    },

    {
      name: "dependents",
      label: "Dependents",
      isComplete: !!_.get(user, "dependentsCount")
    },

    {
      name: "gender",
      label: "Gender",
      isComplete: !!_.get(user, "gender")
    }
  ];

  const completed = _.filter(info, {
    isComplete: true
  });

  const progress = completed.length / info.length;

  return {
    info,
    progress
  };
};

const ReviewItem = ({ ...props }) => {
  return (
    <IonItem className={styles["list-no-padding"]}>
      <IonLabel className="text-wrap">
        <Typography
          variant="overline"
          display="block"
          className={props.status ? "text-muted" : "text-dark"}
        >
          {props.label}
        </Typography>
      </IonLabel>
      <Typography variant="caption" display="block">
        {props.status ? (
          <CheckCircle className="text-success" />
        ) : (
          <CheckCircleOutline className="text-muted" />
        )}
      </Typography>
    </IonItem>
  );
};

const ProfileChecklist = () => {
  const { info } = useProfileCompletion();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonBackButton color="dark" defaultHref="/app/profile" />
          </IonButtons>
          <IonTitle color="dark">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <section>
          <Typography
            variant="h5"
            display="block"
            align="center"
            className="my-4"
          >
            Finish setting up your profile
          </Typography>
          <IonList>
            {info.map((x, key) => (
              <ReviewItem label={x.label} status={x.isComplete} key={key} />
            ))}
          </IonList>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default ProfileChecklist;
