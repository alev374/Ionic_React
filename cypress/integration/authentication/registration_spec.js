describe("The Registration Page", function() {
  before(function() {
    cy.deleteData("users", {
      phoneNumber: "+639171111112"
    });
  });

  beforeEach(function() {
    cy.viewport("iphone-6");
  });
  after(function() {
    cy.deleteData("users", {
      phoneNumber: "+639171111112"
    });
  });

  it("successfully creates account via form submission", function() {
    cy.visit("/auth/register");

    cy.get("[data-cy='submit-btn']").should("have.class", "button-disabled");

    cy.get("input[name=phoneNumber").type("9171111112");

    cy.get("input[name=password").type("password");
    cy.get("input[name=confirmPassword").type("password");

    cy.get("[data-cy='submit-btn']").should(
      "not.have.class",
      "button-disabled"
    );

    cy.get("[data-cy='submit-btn']").click();

    cy.url().should("include", "/auth/verify");

    cy.get("[data-cy='verification-numpad']", {
      timeout: 2000
    });

    /* 
      Test incorrect Token
    */
    const tokenLength = Array.from({ length: 6 }, () => 1);
    cy.wrap(tokenLength).each(index => {
      cy.get("[data-cy='verification-numpad'] [data-cy='numpad-5']").click();
    });

    cy.get("[data-cy='verify-status-message']").should(
      "have.class",
      "text-error"
    );
    /* 
      Test correct Token
    */

    cy.wrap(tokenLength).each(index => {
      cy.get("[data-cy='verification-numpad'] [data-cy='numpad-6']").click();
    });

    /* 
      Test PIN setup
    */
    cy.url().should("include", "/auth/pin/setup");
    const pinLength = Array.from({ length: 4 }, (v, k) => k + 1);

    // Test Non-matching PIN
    cy.get("[data-cy='pincode-setup-heading']").contains("Set your PIN");
    cy.wrap(pinLength).each(index => {
      cy.get(`[data-cy='pincode-setup-numpad'] [data-cy='numpad-1']`).click();
    });
    cy.get("[data-cy='pincode-setup-heading']").contains("Re-enter your PIN");
    cy.wrap(pinLength).each(index => {
      cy.get(`[data-cy='pincode-setup-numpad'] [data-cy='numpad-2']`).click();
    });
    cy.get("[data-cy='pincode-setup-status']").should(
      "have.class",
      "text-error"
    );

    // Test Matching PIN
    cy.get("[data-cy='pincode-setup-heading']").contains("Set your PIN");
    cy.wrap(pinLength).each(index => {
      cy.get(
        `[data-cy='pincode-setup-numpad'] [data-cy='numpad-${index}']`
      ).click();
    });
    cy.get("[data-cy='pincode-setup-heading']").contains("Re-enter your PIN");
    cy.wrap(pinLength).each(index => {
      cy.get(
        `[data-cy='pincode-setup-numpad'] [data-cy='numpad-${index}']`
      ).click();
    });

    cy.url().should("include", "/auth/pin/setup-complete");

    cy.get("[data-cy='setup-pin-complete-btn").click();

    cy.url().should("include", "/onboard/fullname");
  });

  /* it("unsucessfully logs in with the wrong password", function() {
    let username;
    let password = "wrongpassword";
    cy.fixture("testeraccounts")
      .then(testeraccounts => {
        username = testeraccounts.superadmin.username;
      })
      .then(() => {
        cy.visit("/#/login");

        cy.get("input[name=email]").type(username);

        // {enter} causes the form to submit
        cy.get("input[name=password]").type(`${password}{enter}`);
        //
        // we should be redirected to /dashboard
        cy.get(".alert-danger").should(
          "have",
          "The username or password is invalid."
        );
      });
  }); */
});

/* describe("Logging Out", function() {
  beforeEach(function() {
    let username;
    let password;

    cy.fixture("testeraccounts")
      .then(testeraccounts => {
        username = testeraccounts.superadmin.username;
        password = testeraccounts.superadmin.password;
      })
      .then(() => {
        // programmatically log us in without needing the UI
        cy.request("POST", "http://localhost:1337/auth/local", {
          identifier: username,
          password
        }).then(resp => {
          console.log("response", resp);
          window.localStorage.setItem("jwt", resp.body.jwt);
        });
      });
  });

  it("successfully logs out via logout button", function() {
    cy.visit("/#/admin");

    cy.get(".user-toggle").click();
    cy.get(".user-menu-logout").click();

    cy.url().should("include", "/#/logout");
  });
});

describe("Unauthorized Access", function() {
  it("can't access pages when not logged in", function() {
    cy.visit("/#/admin");
    cy.url().should("include", "/#/login");
  });
}); */
