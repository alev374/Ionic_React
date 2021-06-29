import { ApolloClient } from "apollo-client";
import { ApolloLink, Observable } from "apollo-link";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { RetryLink } from "apollo-link-retry";
import loggerLink from "apollo-link-logger";
import QueueLink from "apollo-link-queue";
import SerializingLink from "apollo-link-serialize";
import trackerLink from "./services/trackerLink";
import { storage } from "./services";

import config from "./config";
let serverURI = config.server.serverURI;
const graphqlURI = `${serverURI}/graphql`;

// ################################################
// APOLLO GRAPHQL
// ################################################
const cache = new InMemoryCache({
  dataIdFromObject: object => {
    // console.log("object", object);
    return defaultDataIdFromObject(object);
  }
});

const errorLink = onError(err => {
  if (err.graphQLErrors) {
    console.log("graphQLErrors", err.graphQLErrors);
    // sendToLoggingService(graphQLErrors);
  }
  if (err.networkError) {
    console.log("networkError", err.networkError);
    // logoutUser();
  }

  if (!err.graphQLErrors && err.networkError) {
    console.log("GraphQL Error", err);
  }
});

const request = async operation => {
  const jwt = storage.getItem("jwt") || window.localStorage.getItem("cy-jwt");
  operation.setContext({
    headers: {
      authorization: jwt ? `Bearer ${jwt}` : ""
    }
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const queueLink = new QueueLink();
const serializingLink = new SerializingLink();
const retryLink = new RetryLink();

const httpLink = new HttpLink({
  uri: graphqlURI
});

const generateClient = async () => {
  // await before instantiating ApolloClient, else queries might run before the cache is persisted
  await persistCache({
    cache,
    storage: storage.raw,
    debug: true
  });
  const client = new ApolloClient({
    link: ApolloLink.from([
      loggerLink,
      errorLink,
      requestLink,
      trackerLink,
      retryLink,
      queueLink,
      serializingLink,
      httpLink
    ]),
    cache
  });

  client.queueLink = queueLink;

  return client;
};
export default generateClient;
