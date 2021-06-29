import React from "react";
import _ from "lodash";
import { Redirect, Route } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonSpinner
} from "@ionic/react";
import { /* cafe, cash, */ time, wallet, person } from "ionicons/icons";

// import AuthContext from "../../contexts/AuthContext.js";
import UserContext from "../../contexts/UserContext.js";

// import DailyBudget from "./DailyBudget/DailyBudget";
// import Bills from "./Bills/Bills";
import Savings from "./Savings/Savings";
import Activity from "./Activity/Activity";
import Profile from "./Profile/Profile";
import ProfileChecklist from "./ProfileChecklist/ProfileChecklist";

const App = props => {
  // const auth = AuthContext.useContainer();
  const { isLoggedIn } = UserContext.useContainer();

  if (_.isNull(isLoggedIn)) {
    return <IonSpinner />;
  } else if (!isLoggedIn) {
    props.history.push("/auth/login");
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* <Route path="/app/dailybudget" component={DailyBudget} exact={true} />
        <Route path="/app/bills" component={Bills} exact={true} /> */}
        <Route path="/app/savings" component={Savings} exact={true} />
        <Route path="/app/activity" component={Activity} exact={true} />
        <Route path="/app/profile" component={Profile} exact={true} />
        <Route
          path="/app/profile/checklist"
          component={ProfileChecklist}
          exact={true}
        />
        <Route
          exact
          path="/app/"
          render={() => <Redirect to="/app/savings" />}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        {/* <IonTabButton tab="dailybudget" href="/app/dailybudget">
          <IonIcon icon={cafe} />
          <IonLabel>Daily</IonLabel>
        </IonTabButton>
        <IonTabButton tab="bills" href="/app/bills">
          <IonIcon icon={cash} />
          <IonLabel>Bills</IonLabel>
        </IonTabButton> */}
        <IonTabButton tab="savings" href="/app/savings">
          <IonIcon icon={wallet} />
          <IonLabel>Savings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="activity" href="/app/activity">
          <IonIcon icon={time} />
          <IonLabel>Activity</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/app/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default App;
