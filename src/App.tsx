import React, { useEffect, useState, Suspense } from "react";
import _ from "lodash";
import { Route, Switch } from "react-router-dom";
import { IonApp, IonToast } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ApolloProvider } from "@apollo/react-hooks";
import AppContext from "./contexts/AppContext";
import NetworkContext from "./contexts/NetworkContext.js";
import DevContext from "./contexts/DevContext.js";
import QueryContext from "./contexts/QueryContext.js";
import AuthContext from "./contexts/AuthContext.js";
import UserContext from "./contexts/UserContext.js";
import UsersettingsContext from "./contexts/UsersettingsContext.js";
import ToastContext from "./contexts/ToastContext.js";
import CustomKeyboardContext from "./contexts/CustomKeyboardContext.js";
import generateClient from "./client";
import { storage, network, analytics, notifications } from "./services";
import { Splash, IdleTimer } from "./pages/Components";

import Auth from "./pages/Auth/Auth.js";
import Authenticated from "./pages/Authenticated";
import SelectLanguage from "./pages/Misc/SelectLanguage.js";

import "./theme/main.scss";

// import { CustomKeyboard } from "./pages/Components";

const DevToolbar = React.lazy(() =>
  import("./pages/Components/DevToolbar/DevToolbar")
);

const AppContainer = () => {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  useEffect(() => {
    const begin = async () => {
      await storage.init();
      await analytics.init();
      await notifications.init();
      const generatedClient: any = await generateClient();
      setClient(generatedClient);
      await network.init(generatedClient);
      setLoading(false);
    };
    begin();
  }, []);

  if (loading) {
    return (
      <IonApp>
        <Splash />
      </IonApp>
    );
  }

  return (
    <DevContext.Provider>
      {/* 
        // @ts-ignore */}
      <ApolloProvider client={client}>
        <IonReactRouter>
          <ToastContext.Provider>
            <QueryContext.Provider>
              <NetworkContext.Provider>
                <UserContext.Provider>
                  <AuthContext.Provider>
                    <UsersettingsContext.Provider>
                      <CustomKeyboardContext.Provider>
                        <AppContext.Provider>
                          <IonApp>
                            <App />
                          </IonApp>
                        </AppContext.Provider>
                      </CustomKeyboardContext.Provider>
                    </UsersettingsContext.Provider>
                  </AuthContext.Provider>
                </UserContext.Provider>
              </NetworkContext.Provider>
            </QueryContext.Provider>
          </ToastContext.Provider>
        </IonReactRouter>
      </ApolloProvider>
    </DevContext.Provider>
  );
};
const App: React.FC = () => {
  const { isOpen, toastProps, hideToast } = ToastContext.useContainer();
  const { online } = NetworkContext.useContainer();
  AppContext.useContainer();
  return (
    <>
      {/* Dev Toolbar */}
      {true ? (
        <Suspense fallback={<div></div>}>
          <DevToolbar />
        </Suspense>
      ) : null}

      {/* Idle Timer */}
      <IdleTimer />

      {/* Global Toast Notifications */}
      <IonToast isOpen={isOpen} onDidDismiss={hideToast} {...toastProps} />

      {/* Wait for network to determine whether the device is online or not */}
      {_.isNull(online) ? (
        <Splash />
      ) : (
        <Switch>
          <Route path="/selectlanguage" component={SelectLanguage} />
          <Route path="/auth" component={Auth} />
          <Route path="/" component={Authenticated} />
        </Switch>
      )}
      {/* <CustomKeyboard /> */}
    </>
  );
};

export default AppContainer;
