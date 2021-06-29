import { useState, useEffect, useCallback } from "react";
import { useApolloClient } from "@apollo/react-hooks";
// import gql from "graphql-tag";
import { createContainer } from "unstated-next";
import _ from "lodash";
import { USER_QUERY } from "../queries/userQuery";
import { analytics } from "../services";

function useUser() {
  const client = useApolloClient();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null, true or false
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (_.isNull(userId)) {
      setUser(null);
    } else if (userId && isLoggedIn) {
      client
        .watchQuery({
          query: USER_QUERY,
          variables: {
            id: userId
          },
          fetchPolicy: "cache-and-network"
        })
        .subscribe({
          next: ({ data }) => {
            if (_.get(data, "user")) {
              // console.log("UserContext user", _.get(data, "user"));
              setUser(_.get(data, "user"));
              analytics.setUserId(_.get(data, "user.id"));
            }
          }
        });
    }
  }, [userId, isLoggedIn, client]);

  const getRole = useCallback(() => {
    return _.get(user, "role.type");
  }, [user]);

  return {
    userId,
    setUserId,
    user,
    setUser,
    getRole,

    isLoggedIn,
    setIsLoggedIn
  };
}

export default createContainer(useUser);
