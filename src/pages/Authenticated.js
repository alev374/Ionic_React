import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Route, Switch, Redirect } from "react-router-dom";
// import { IonSpinner } from "@ionic/react";
import { Splash } from "./Components";
import useReactRouter from "use-react-router";

import UserContext from "../contexts/UserContext.js";
import UsersettingsContext from "../contexts/UsersettingsContext.js";
import Onboard from "./Onboard/Onboard";
import App from "./App/App";
import { storage } from "../services";

const Authenticated = props => {
  const {
    history,
    location: { pathname }
  } = useReactRouter();
  const { isLoggedIn } = UserContext.useContainer();
  const { getUsersettings } = UsersettingsContext.useContainer();
  const { onboardState } = getUsersettings(["onboardState"]);

  const [renderAuthenticated, setRenderAuthenticated] = useState(null);

  useEffect(() => {
    if (_.isNull(isLoggedIn)) {
      // return <Splash />;
    } else if (!isLoggedIn) {
      history.push("/auth/login");
      // return null;
    } else if (_.isUndefined(onboardState)) {
      // return <Splash />;
    } else if (storage.getItem("isLocked") && pathname !== "/auth/pin/enter") {
      history.replace(`/auth/pin/enter?preventback=true&returnto=${pathname}`);
    } else {
      setRenderAuthenticated(true);
    }
  }, [pathname, isLoggedIn, onboardState, history]);

  if (_.isNull(renderAuthenticated) || !renderAuthenticated) {
    return <Splash />;
  }

  return (
    <Switch>
      <Route path="/onboard" component={Onboard} />
      <Route path="/app" component={App} />
      <Route path="/">
        {onboardState !== "complete" ? (
          <Redirect to="/onboard" />
        ) : (
          <Redirect to="/app" />
        )}
      </Route>
    </Switch>
  );
};

export default Authenticated;
