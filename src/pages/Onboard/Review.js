import React, { useState, useRef } from "react";
import _ from "lodash";

import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRouterLink,
  IonSkeletonText,
  IonButton,
  IonFooter,
  IonToolbar,
  IonModal
} from "@ionic/react";
import useReactRouter from "use-react-router";

import { Typography } from "@material-ui/core";

// import UserContext from "../../contexts/UserContext";
// import AuthContext from "../../contexts/AuthContext";
import OnboardContext from "./OnboardContext";
import { Loading } from "../Components";
import styles from "./Onboard.module.css";

const Review = ({ ...props }) => {
  const { userDetails } = OnboardContext.useContainer();
  const { history } = useReactRouter();
  const [showCoverModal, setShowCoverModal] = useState(false);

  const coverTimer = useRef(null);

  const clickConfirm = () => {
    setShowCoverModal(true);
    coverTimer.current = setTimeout(() => {
      history.push("/onboard/complete");
    }, 200);

    coverTimer.current = setTimeout(() => {
      setShowCoverModal(false);
      clearInterval(coverTimer.current);
    }, 700);
  };

  if (_.isEmpty(userDetails)) {
    return (
      <IonList>
        {[...Array(4).keys()].map(n => (
          <IonItem key={n}>
            <IonSkeletonText animated />
          </IonItem>
        ))}
      </IonList>
    );
  }

  let fullName = `${_.get(userDetails, "firstName")} `;
  if (_.get(userDetails, "middleName")) {
    fullName += `${_.get(userDetails, "middleName")} `;
  }
  fullName += `${_.get(userDetails, "lastName")} `;

  let employerName = _.get(userDetails, "selectedCompany.name");
  if (
    _.get(userDetails, "selectedCompany.branches") &&
    _.get(userDetails, "selectedCompany.branches").length > 1
  ) {
    employerName += ` - ${_.get(userDetails, "selectedBranch.branchName")}`;
  }

  const workEmailIsPersonalEmail = _.get(
    userDetails,
    "workEmailIsPersonalEmail"
  );

  let info = {
    fullName: {
      fieldName: "fullName",
      label: "Full Name",
      value: fullName,
      route: "/onboard/fullname"
    },
    email: {
      fieldName: "email",
      label: "Email Address",
      value: _.get(userDetails, "email"),
      route: "/onboard/email"
    },
    employerName: {
      fieldName: "employerName",
      label: "Employer Name",
      value: employerName,
      route: "/onboard/employer"
    },
    ...(!workEmailIsPersonalEmail && {
      workEmail: {
        fieldName: "workEmail",
        label: "Work Email Address",
        value: _.get(userDetails, "workEmail"),
        route: "/onboard/workemail"
      }
    })
  };

  let items = Object.values(info).map((x, key) => {
    return (
      <ReviewItem
        label={x.label}
        value={x.value}
        route={x.route}
        fieldName={x.fieldName}
        key={key}
      />
    );
  });

  return (
    <IonPage>
      <IonContent>
        <section>
          <form>
            <Typography
              variant="h5"
              display="block"
              align="center"
              className="mb-4"
            >
              How does this look?
            </Typography>
            <IonList data-cy={`onboard-review-list`}>{items}</IonList>
          </form>
        </section>
      </IonContent>
      <IonFooter className="px-3 pb-2">
        <IonToolbar>
          <IonButton
            expand="block"
            size="default"
            color="primary"
            type="submit"
            onClick={clickConfirm}
            className="height-increase"
            data-cy="onboard-review-confirm-btn"
          >
            <Typography variant="button" display="block" align="center">
              Looks good
            </Typography>
            <IonModal isOpen={showCoverModal}>
              <Loading />
            </IonModal>
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

const ReviewItem = ({ ...props }) => {
  return (
    <IonItem
      className={styles["list-no-padding"]}
      data-cy={`onboard-review-item-${props.fieldName}`}
    >
      <IonLabel className="text-wrap">
        <Typography variant="overline" display="block">
          {props.label}
        </Typography>
        <Typography variant="body1" display="block">
          {props.value}
        </Typography>
      </IonLabel>
      <IonRouterLink
        slot="end"
        href={props.route}
        data-cy="onboard-review-change-btn"
      >
        <Typography
          variant="caption"
          display="block"
          className="text-uppercase"
        >
          Change
        </Typography>
      </IonRouterLink>
    </IonItem>
  );
};

export default Review;
