import { useEffect, useRef, useState, useCallback } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { createContainer } from "unstated-next";
import _ from "lodash";
import ToastContext from "./ToastContext";
import UserContext from "./UserContext.js";
import QueryContext from "./QueryContext";
import NetworkContext from "./NetworkContext";
import { analytics } from "../services";

import {
  USER_SETTINGS_QUERY,
  INITIAL_USERSETTINGS_QUERY
} from "../queries/usersettingsQueries";

const normalizeValue = usersetting => {
  return {
    ...usersetting,
    value: _.get(usersetting, "value.data")
  };
};

const denormalizeValue = localValue => {
  return {
    data: localValue
  };
};

const useUsersettings = () => {
  const client = useApolloClient();
  const { user } = UserContext.useContainer();
  const { mutations } = QueryContext.useContainer();
  const { setToast } = ToastContext.useContainer();
  const { online } = NetworkContext.useContainer();
  const [initialFetch, setInitialFetch] = useState(false);
  const [usersettings, setUsersettings] = useState({});
  const [simpleUsersettings, setSimpleUsersettings] = useState({});
  const defaultUsersettings = useRef({});
  const observableQuery = useRef();

  const updateUsersettings = useCallback(usersettings => {
    // console.log("updateUsersettings", usersettings);
    // Set existing Usersettings
    const newUsersettings = {};
    _.each(usersettings, usersetting => {
      newUsersettings[usersetting.name] = normalizeValue(usersetting);
    });

    // Merge with default usersettings
    _.each(defaultUsersettings.current, (usersettings, usersettingName) => {
      if (!_.has(newUsersettings, usersettingName)) {
        newUsersettings[usersettingName] = {
          ...usersettings,
          value: usersettings.defaultValue
        };
      }
    });

    setUsersettings(newUsersettings);
    setSimpleUsersettings(() => {
      const newSimpleUsersettings = {};
      _.each(newUsersettings, (usersetting, usersettingName) => {
        newSimpleUsersettings[usersettingName] = usersetting.value;
      });
      return newSimpleUsersettings;
    });
  }, []);

  useEffect(() => {
    const fetchInitialUsersettings = async () => {
      observableQuery.current = client.watchQuery({
        query: INITIAL_USERSETTINGS_QUERY,
        variables: {
          where: {
            user: _.get(user, "id")
          }
        },
        // pollInterval: 400,
        fetchPolicy: "cache-and-network"
      });

      observableQuery.current.subscribe({
        next: ({ data }) => {
          if (
            _.get(data, "getDefaultUsersettings") &&
            _.get(data, "usersettings")
          ) {
            // console.log("fetchInitialUsersettings data", data);

            const { getDefaultUsersettings, usersettings } = data;

            // Set default Usersettings
            _.each(getDefaultUsersettings, defaultUsersetting => {
              defaultUsersettings.current[
                defaultUsersetting.name
              ] = defaultUsersetting;
            });

            updateUsersettings(usersettings);
          }
        },
        complete: () => {
          console.log("Finished");
        }
      });
    };

    if (!initialFetch && _.get(user, "id")) {
      // console.log("initialFetch");
      setInitialFetch(true);
      fetchInitialUsersettings();
    }
  }, [initialFetch, user, client, updateUsersettings]);

  const getUsersettings = useCallback(
    names => {
      // console.log("getUsersettings", names);
      // console.log("getUsersettinngs default", defaultUsersettings.current);
      const usersettingNames = _.isArray(names) ? names : [names];
      const needsFetching = [];

      _.each(usersettingNames, usersettingName => {
        if (
          defaultUsersettings.current &&
          _.get(defaultUsersettings.current, usersettingName) &&
          !_.get(
            defaultUsersettings.current,
            `${usersettingName}.offlineAccess`
          )
        ) {
          needsFetching.push(usersettingName);
        }
      });
      if (needsFetching.length) {
        if (online === false) {
          setToast({
            color: "danger",
            message: "You are currently offline."
          });
        } else if (user) {
          // console.log("needsFetching", needsFetching);
          client
            .query({
              query: USER_SETTINGS_QUERY,
              variables: {
                where: {
                  user: _.get(user, "id"),
                  name_in: usersettingNames
                }
              }
            })
            .then(({ data }) => {
              updateUsersettings(_.get(data, "usersettings"));
            });
        }
      }

      return simpleUsersettings;
    },
    [simpleUsersettings, client, online, setToast, user, updateUsersettings]
  );

  const upsertUsersetting = (usersettingName, value) => {
    // console.log("usersettings", usersettings);
    const usersetting = _.get(usersettings, usersettingName);
    mutations.upsertUsersetting(
      {
        variables: {
          input: {
            where: {
              name: usersettingName,
              user: _.get(user, "id")
            },
            data: {
              value: denormalizeValue(value)
            }
          }
        }
      },
      {
        newValues: {
          id: usersetting.id,
          user: user,
          value: denormalizeValue(value)
        }
      }
    );

    analytics.setUserProperty(usersettingName, value);
  };

  return { getUsersettings, setUsersetting: upsertUsersetting };
};

export default createContainer(useUsersettings);
