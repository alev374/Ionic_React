import React, { useState } from "react";
import gql from "graphql-tag";
import _ from "lodash";
import { createContainer } from "unstated-next";
import { storage } from "../services";
import UserContext from "./UserContext.js";
import { useApolloClient } from "@apollo/react-hooks";
import useReactRouter from "use-react-router";
export const RootContext = React.createContext();

const ME_QUERY = gql`
  query Me {
    me {
      id
      confirmed
    }
  }
`;

function useAuth() {
  const { history } = useReactRouter();
  const client = useApolloClient();
  const { setUserId, user, setIsLoggedIn } = UserContext.useContainer();
  const [jwt, setJwt] = useState(null);

  let logout = () => {
    storage.clear();
    setJwt(false);
    setUserId(null);
    setIsLoggedIn(false);
    history.push("/auth/login");
    // console.log("Logged out.", jwt, user);
  };

  let login = async ({ jwt, user }) => {
    if (jwt) {
      setJwt(jwt);
      storage.setItem("jwt", jwt);
    }

    if (user) {
      setUserId(user.id);

      if (_.get(user, "confirmed")) {
        setIsLoggedIn(true);
      }
    }
  };

  let validateToken = async providedJwt => {
    const { data, error } = await client.query({
      query: ME_QUERY,
      errorPolicy: "all"
    });
    // console.log("validateToken data", data);
    if (error) {
      console.log("error", error);
      setIsLoggedIn(false);
    } else if (_.get(data, "me")) {
      setIsLoggedIn(true);
      setUserId(_.get(data, "me.id"));
      return true;
    } else {
      storage.clear();
      setIsLoggedIn(false);
      setJwt(false);
      history.push("/auth/login");
      return false;
    }
  };

  if (_.isNull(jwt)) {
    const prevJwt =
      storage.getItem("jwt") || window.localStorage.getItem("cy-jwt");
    if (prevJwt) {
      setJwt(prevJwt);
      validateToken(prevJwt);
    } else {
      setJwt(false);
      setIsLoggedIn(false);
    }
  }

  return { jwt, user, logout, login, validateToken };
}

export default createContainer(useAuth);
