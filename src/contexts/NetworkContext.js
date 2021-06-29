import { useEffect, useState } from "react";
import { storage, network } from "../services";
import _ from "lodash";
import { trackedQueriesRemove } from "../services/trackerLink";
import { useApolloClient } from "@apollo/react-hooks";
import { createContainer } from "unstated-next";
import QueryContext from "./QueryContext";
// import { Plugins } from "@capacitor/core";
// const { Network } = Plugins;

const useClientContext = () => {
  const client = useApolloClient();
  const { updateHandlerByName } = QueryContext.useContainer();
  const [online, setOnline] = useState(null);
  const [trackedQueriesLoaded, setTrackedQueriesLoaded] = useState(false);

  useEffect(() => {
    setOnline(network.online);
    network.addListener(setOnline);
  }, []);

  // Get tracked queries queued for execution if there is any
  useEffect(() => {
    const executeTrackedQueries = async () => {
      const queryMutations = [];
      const trackedQueries = storage.getItem("trackedQueries") || [];
      for (let t = 0; t < trackedQueries.length; t++) {
        const trackedQuery = trackedQueries[t];
        const { context, query, variables } = trackedQuery;
        queryMutations.push({
          context,
          mutation: query,
          optimisticResponse: context.optimisticResponse,
          update: updateHandlerByName[trackedQuery.name],
          variables
        });
        await trackedQueriesRemove(trackedQuery.id);
      }

      try {
        if (!_.isEmpty(trackedQueries)) {
          console.log(
            `Attempting to execute ${trackedQueries.length} trackedQueries.`,
            trackedQueries
          );
        }
        const results = [];
        for (let i = 0; i < queryMutations.length; i++) {
          const queryMutation = queryMutations[i];

          const result = client.mutate(queryMutation);
          results.push(result);
        }
      } catch (e) {
        // ALLOW TRACKED QUERIES TO FAIL
      }
    };

    /* 
      Only do this after...
      1. online is finally determined
      2. do this only once
    */
    if (!trackedQueriesLoaded && !_.isNull(online)) {
      setTrackedQueriesLoaded(true);
      executeTrackedQueries();
    }
  }, [online, trackedQueriesLoaded, updateHandlerByName, client]);

  return {
    online
  };
};

export default createContainer(useClientContext);
