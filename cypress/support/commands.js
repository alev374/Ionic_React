import _ from "lodash";

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
let jwt = null;

// -- This is a parent command --
Cypress.Commands.add("login", options => {
  let username;
  let password;
  let identifierType;
  if (options === "superadmin") {
    username = "tester_superadmin@nextpay.ph";
    password = "tester";
    identifierType = "email";
  } else {
    username = options.username;
    password = options.password;
    identifierType = options.identifierType;
  }
  console.log("Logging in with", {
    username,
    password
  });

  // programmatically log us in without needing the UI
  return cy
    .request("POST", "http://localhost:1337/auth/local", {
      identifier: username,
      password,
      identifierType
    })
    .then(resp => {
      console.log("response", resp);
      jwt = resp.body.jwt;

      localStorage.setItem("cy-jwt", jwt);
      localStorage.setItem("cy", true);

      return cy.wrap({
        user: resp.body.user,
        jwt: resp.body.jwt
      });
    });

  // This will make all form submissions (i.e. creating employees) pass isTest
  // to the server. Necessary for resetting data later on.
  window.localStorage.setItem("isTest", "cy");
});

Cypress.Commands.add("logout", () => {
  localStorage.removeItem("cy-jwt", jwt);
});

Cypress.Commands.add("deleteData", (contentType, params) => {
  return cy
    .login("superadmin")
    .then(() => {
      return cy.request({
        url: `http://localhost:1337/${contentType}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        qs: params
      });
    })
    .then(async ({ body: existingContent }) => {
      for (let i = 0; i < existingContent.length; i++) {
        const entity = existingContent[i];

        return await cy.request({
          url: `http://localhost:1337/${contentType}/${entity.id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
      }
    });
});

Cypress.Commands.add("resetData", contentType => {
  // let jwt = window.localStorage.getItem("jwt");
  return cy
    .login("superadmin")
    .then(() => {
      return cy.request({
        url: `http://localhost:1337/${contentType}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        qs: {
          isTest: "cy"
        }
      });
    })
    .then(async ({ body: existingContent }) => {
      for (let i = 0; i < existingContent.length; i++) {
        const entity = existingContent[i];

        return await cy.request({
          url: `http://localhost:1337/${contentType}/${entity.id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
      }
    });
});

Cypress.Commands.add("createData", (contentType, body, options) => {
  // let jwt = window.localStorage.getItem("jwt");

  const endpoint = _.get(options, "endpoint") || contentType;

  return cy.login("superadmin").then(() => {
    return cy.request({
      url: `http://localhost:1337/${endpoint}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      body: {
        ...body,
        isTest: "cy"
      }
    });
  });
});

Cypress.Commands.add("seed", (data, options) => {
  // let jwt = window.localStorage.getItem("jwt");

  return cy
    .login("superadmin")
    .then(({ jwt }) => {
      return cy.request({
        url: `http://localhost:1337/seeds`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        body: {
          isTest: "cy",
          type: "create",
          data,
          options
        }
      });
    })
    .then(() => {
      return cy.logout();
    });
});

Cypress.Commands.add("clearSeed", (data, options) => {
  // let jwt = window.localStorage.getItem("jwt");
  return cy
    .login("superadmin")
    .then(() => {
      return cy.request({
        url: `http://localhost:1337/seeds`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`
        },
        body: {
          isTest: "cy",
          type: "delete"
        }
      });
    })
    .then(() => {
      return cy.logout();
    });
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
