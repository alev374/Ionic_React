describe("The Login Page", function() {
  const firstName = "John";
  const lastName = "Wicked";
  const password = "password";
  const personalEmail = "jwick2212@hotmail.com";

  const phoneNumber1 = "+639171111111";
  const phoneNumber2 = "+639172222222";

  before(function() {
    cy.clearSeed();
  });

  beforeEach(function() {
    cy.viewport("iphone-6");
  });

  afterEach(function() {
    cy.clearSeed();
  });

  it("successfully logs in", function() {
    cy.seed({
      user: {
        firstName,
        lastName,
        email: personalEmail,
        phoneNumber: phoneNumber1,
        password
      }
    });

    cy.visit("/auth/login");

    cy.window().then(win => {
      win.storage.clear();
    });

    cy.get("[data-cy='submit-btn']").should("have.class", "button-disabled");

    cy.get("input[name=phoneNumber").type("9171111111");

    cy.get("input[name=password").type(password);

    cy.get("[data-cy='submit-btn']").should(
      "not.have.class",
      "button-disabled"
    );

    cy.get("[data-cy='submit-btn']").click();

    cy.url().should("include", "/onboard/fullname");
  });

  it("successfully logs in and confirms phone number", function() {
    // cy.window().then(win => {
    //   win.storage.clear();
    // });

    cy.seed({
      user: {
        firstName,
        lastName,
        email: personalEmail,
        phoneNumber: phoneNumber2,
        password,
        confirmed: false
      }
    });

    cy.visit("/auth/login");

    cy.window().then(win => {
      win.storage.clear();
    });

    cy.get("[data-cy='submit-btn']").should("have.class", "button-disabled");

    cy.get("input[name=phoneNumber").type("9172222222");

    cy.get("input[name=password").type(password);

    cy.get("[data-cy='submit-btn']").should(
      "not.have.class",
      "button-disabled"
    );

    cy.get("[data-cy='submit-btn']").click();

    /* 
      Verify SMS
    */
    cy.url().should("include", "/auth/verify", {
      timeout: 10000
    });

    const tokenLength = Array.from({ length: 6 }, () => 1);
    cy.get("[data-cy='verification-numpad']").should("be.visible");
    cy.wrap(tokenLength).each(index => {
      cy.get("[data-cy='verification-numpad'] [data-cy='numpad-6']").click();
    });

    /* 
      Create PIN
    */
    cy.url().should("include", "/auth/pin/setup", {
      timeout: 10000
    });
    const pinLength = Array.from({ length: 4 }, (v, k) => k + 1);

    cy.get("[data-cy='pincode-setup-numpad']").should("be.visible");
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

    cy.url().should("include", "/auth/pin/setup-complete", {
      timeout: 10000
    });

    cy.get("[data-cy='setup-pin-complete-btn").click();

    cy.url().should("include", "/onboard/fullname");
  });
});
