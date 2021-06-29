import React from "react";
import queryString from "query-string";
import { createContainer } from "unstated-next";
import _ from "lodash";
import moment from "moment";
export const RootContext = React.createContext();

function useDev() {
  const checkServerURI = () => {
    /* 
      Get search params. If it shows that there is REACT_APP_SERVER_URI param then... 
      - localStorage.setItem("REACT_APP_SERVER_URI", REACT_APP_SERVER_URI);
      - localStorage.setItem("REACT_APP_SERVER_URI_DATE", new Date());
      - Reload the page without the param

      If no params, then...
      - Check localStorage.getItem("REACT_APP_SERVER_URI_DATE") and make sure that it's less than a day ago
      - If more than a day ago...
        - localStorage.removeItem("REACT_APP_SERVER_URI");
        - localStorage.removeItem("REACT_APP_SERVER_URI_DATE");
        - Reload the page
    */
    const searchParams = queryString.parse(window.location.search);
    if (_.get(searchParams, "REACT_APP_SERVER_URI")) {
      const REACT_APP_SERVER_URI = _.get(searchParams, "REACT_APP_SERVER_URI");
      localStorage.setItem("REACT_APP_SERVER_URI", REACT_APP_SERVER_URI);
      localStorage.setItem("REACT_APP_SERVER_URI_DATE", new Date());
      // Reload page without params
      window.location.href = `${window.location.origin}/${window.location.hash}`;
    } else {
      const date = localStorage.getItem("REACT_APP_SERVER_URI_DATE");
      if (date && moment().isAfter(moment(date).add(1, "day"))) {
        localStorage.removeItem("REACT_APP_SERVER_URI");
        localStorage.removeItem("REACT_APP_SERVER_URI_DATE");
        window.location.reload();
      }
    }
  };

  return {
    checkServerURI
  };
}

export default createContainer(useDev);
