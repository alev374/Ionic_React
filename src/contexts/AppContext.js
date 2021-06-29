import { useState, useEffect } from "react";
import { createContainer } from "unstated-next";
import useReactRouter from "use-react-router";
import UsersettingsContext from "./UsersettingsContext.js";
import QueryContext from "./QueryContext.js";
import UserContext from "./UserContext.js";
import { analytics, storage } from "../services";
import { Plugins } from "@capacitor/core";
import _ from "lodash";
import { getUnixTime } from "date-fns";
import * as qs from "query-string";
import SimpleCrypto from "simple-crypto-js";

const AppContext = () => {
  const {
    history,
    location: { pathname, search }
  } = useReactRouter();
  const { mutations } = QueryContext.useContainer();
  const { user } = UserContext.useContainer();
  const { getUsersettings } = UsersettingsContext.useContainer();
  const { manualDailyBudget, notification_dailybudget } = getUsersettings([
    "manualDailyBudget",
    "notification_dailybudget"
  ]);

  /*
    Analytics track pages
  */
  useEffect(() => {
    // console.log("analytics.setScreenName(pathname)", pathname);
    analytics.setScreenName(pathname, pathname);
  }, [pathname]);

  /* 
    Enable/Disable notifications
  */
  useEffect(() => {
    if (manualDailyBudget && notification_dailybudget === null) {
    }
  }, [manualDailyBudget, notification_dailybudget]);

  /* 
    Prevent back button if url includes ?preventback=true
  */
  const [lockedPath, setLockedPath] = useState(null);

  useEffect(() => {
    const { preventback, ...queryParams } = qs.parse(search);
    if (preventback) {
      if (preventback === "true") {
        setLockedPath(pathname);
      }
    } else {
      setLockedPath(null);
    }

    if (lockedPath && pathname === lockedPath) {
      const queryString = !_.isEmpty(queryParams)
        ? Object.keys(queryParams)
            .map(key => key + "=" + queryParams[key])
            .join("&")
        : null;

      if (queryString) {
        history.push(`${lockedPath}?preventback=active&${queryString}`);
      } else {
        history.push(`${lockedPath}?preventback=active`);
      }
    }
  }, [pathname, history, search, lockedPath]);

  /* 
    Lock Screen
  */
  const setPinCode = async pin => {
    storage.setItem("locksettings", {
      pin
    });

    // Update securePin in our database
    const { uuid } = await Plugins.Device.getInfo();
    console.log("uuid", uuid);
    const simpleCrypto = new SimpleCrypto(uuid);
    const pinSecret = simpleCrypto.encrypt(pin);
    mutations.updateUser(
      {
        variables: {
          input: {
            where: {
              id: user.id
            },
            data: {
              pinSecret
            }
          }
        }
      },
      {
        newValues: {
          ...user,
          pinSecret
        }
      }
    );
  };

  // Set PIN code from secret
  const setPinCodeFromSecret = async pinSecret => {
    if (_.isEmpty(_.get(storage.getItem("locksettings"), "pin"))) {
      const { uuid } = await Plugins.Device.getInfo();
      const simpleCrypto = new SimpleCrypto(uuid);
      const pin = simpleCrypto.decrypt(pinSecret);

      storage.setItem("locksettings", {
        pin
      });
    }
  };

  const checkPinCode = enteredPin => {
    const locksettings = storage.getItem("locksettings");
    if (locksettings.pin && enteredPin === locksettings.pin) {
      storage.setItem("locksettings", {
        ...locksettings,
        failedAttempts: 0
      });
      return true;
    } else {
      storage.setItem("locksettings", {
        ...locksettings,
        failedAttempts: _.get(locksettings, "failedAttempts") + 1 || 1,
        lastFailedAttempt: getUnixTime(new Date())
      });
      return false;
    }
  };

  return {
    setPinCode,
    setPinCodeFromSecret,
    checkPinCode
  };
};

export default createContainer(AppContext);
