import React from "react";
// import _ from "lodash";
import { Route, Redirect } from "react-router-dom";
import { Typography } from "@material-ui/core";
import _ from "lodash";

import {
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonProgressBar
} from "@ionic/react";
import useReactRouter from "use-react-router";

import OnboardContext, { steps } from "./OnboardContext";
import Complete from "./Complete";

const OnboardHeader = () => {
  const {
    // userDetails,
    // currentStepName,
    stepProgress
  } = OnboardContext.useContainer();
  const {
    location: { pathname }
  } = useReactRouter();
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {pathname === "/onboard/fullname" ? (
              <Typography variant="h6" display="block" align="center">
                Hello!
              </Typography>
            ) : pathname === "/onboard/review" ? (
              <Typography variant="h6" display="block" align="center">
                Review
              </Typography>
            ) : (
              <Typography variant="h6" display="block" align="center">
                All about you
              </Typography>
            )}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonProgressBar value={stepProgress}></IonProgressBar>
    </>
  );
};

const Onboard = props => {
  const {
    location: { pathname }
  } = useReactRouter();
  return (
    <>
      <OnboardContext.Provider>
        {!_.includes(pathname, "/onboard/complete") ? <OnboardHeader /> : null}

        <IonContent>
          <IonRouterOutlet>
            {steps.map(({ name, component: Component, path }, i) => (
              <Route
                key={name}
                path={path}
                render={props => <Component {...props} />}
                // exact={true}
              />
            ))}
            <Route
              path="/onboard/complete"
              render={props => <Complete {...props} />}
              // exact={true}
            />
            <Redirect exact from="/onboard" to={`${steps[0].path}`} />
          </IonRouterOutlet>
        </IonContent>
      </OnboardContext.Provider>
    </>
  );
};

export default Onboard;

// export default OnboardContainer;
