import { ApolloLink } from "apollo-link";
import uuidv4 from "uuid/v4";
import { storage } from "./";
import _ from "lodash";
// import { trackedQueriesAdd, trackedQueriesRemove } from '../store/ducks/trackedQueries';

const trackedQueriesAdd = async trackedQuery => {
  // console.log("trackedQueriesAdd", trackedQuery.id);
  const existingTrackedQueries = storage.getItem("trackedQueries") || [];
  storage.setItem("trackedQueries", [...existingTrackedQueries, trackedQuery]);
};

export const trackedQueriesRemove = async id => {
  const existingTrackedQueries = storage.getItem("trackedQueries");
  // console.log(
  //   "trackedQueriesRemove",
  //   _.find(existingTrackedQueries, {
  //     id
  //   })
  // );
  storage.setItem(
    "trackedQueries",
    _.filter(existingTrackedQueries, trackedQuery => {
      return trackedQuery.id !== id;
    })
  );
};

export default new ApolloLink((operation, forward) => {
  // console.log("trackerLink");
  if (forward === undefined) {
    return null;
  }

  const context = operation.getContext();
  const id = uuidv4();

  // console.log("trackerLink context", context);

  if (context.tracked !== undefined) {
    trackedQueriesAdd({
      context,
      id,
      name: operation.operationName,
      query: operation.query,
      variables: operation.variables
    });
  }

  return forward(operation).map(data => {
    if (context.tracked !== undefined) {
      trackedQueriesRemove(id);
    }
    return data;
  });
});
