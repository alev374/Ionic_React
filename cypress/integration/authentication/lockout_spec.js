describe("The Lockout Screen", function() {
  const firstName = "John";
  const lastName = "Wicked";
  const password = "password";
  const personalEmail = "jwick2212@hotmail.com";

  const phoneNumber = "+639171111111";
  const workEmail1 = "john.wicked@thecontinental.hotel";
  const companyName1 = "Cypress Inc.";

  // Number of seconds for the countdown until lockout
  const lockoutTimeCountdown = 2;

  const pinCode = "1234";

  // Number of seconds for lockout anti-spam timer
  const retryTimerLength = 2;

  before(function() {
    cy.clearSeed().then(() => {
      return cy.seed([
        {
          job: [
            {
              firstName,
              lastName,
              email: workEmail1,
              phoneNumber: phoneNumber,
              position: "Independent Contractor"
            }
          ],
          company: {
            name: companyName1
          },
          user: {
            firstName,
            lastName,
            email: personalEmail,
            phoneNumber: phoneNumber,
            password,
            usersettings: {
              onboardState: {
                data: "complete"
              }
            }
          },
          _options: {
            linkJob: true
          }
        }
      ]);
    });
  });

  beforeEach(function() {
    cy.viewport("iphone-6");
  });

  after(function() {
    cy.clearSeed();
  });

  afterEach(function() {
    cy.logout();
  });

  it("successfully locks you out after being idle", function() {
    cy.login({
      username: phoneNumber,
      password,
      identifierType: "phoneNumber"
    });

    localStorage.setItem(
      "cy-storage",
      JSON.stringify({
        locksettings: {
          pin: pinCode
        }
      })
    );
    // cy.visit("/");
    cy.visit(
      `/app/savings?lockoutTime=1000&lockoutTimeCountdown=${lockoutTimeCountdown}`
    );

    // Hack to trigger timer
    cy.get(".tabs-inner")
      .should("be.visible")
      .trigger("mousedown");

    // Ensure countdown modal appears
    cy.get("[data-cy='lockout-countdown-modal']", {
      timeout: 10000
    }).should("be.visible");

    // Click on "stay signed in"
    cy.get("[data-cy='lockout-countdown-stay-btn']")
      .wait(1000)
      .click();

    // Ensure modal disappears
    cy.get("[data-cy='lockout-countdown-modal']").should("not.exist");

    // Wait for modal to appear again
    cy.get("[data-cy='lockout-countdown-modal']", {
      timeout: 10000
    }).should("be.visible");

    // Wait for lockout to happen
    cy.wait((lockoutTimeCountdown - 1) * 1000);

    // Should redirect you to lockout screen
    cy.url().should("include", "/auth/pin/enter", {
      timeout: 10000
    });

    // Ensure that isLocked is true in app storage
    cy.window().then(win => {
      expect(win.storage.getItem("isLocked")).to.eq(true);
    });
  });

  it("prevents you from accessing page if locked out", function() {
    cy.login({
      username: phoneNumber,
      password,
      identifierType: "phoneNumber"
    });

    localStorage.setItem(
      "cy-storage",
      JSON.stringify({
        locksettings: {
          pin: pinCode
        },
        isLocked: true
      })
    );

    cy.viewport("iphone-6");

    cy.visit("/app/savings");

    // Should redirect you to lockout screen
    cy.url().should("include", "/auth/pin/enter", {
      timeout: 10000
    });

    // Enter correct PIN code
    const pinLength = Array.from({ length: 4 }, (v, k) => k + 1);
    cy.get("[data-cy='pincode-enter-numpad']").should("be.visible");
    cy.wrap(pinLength).each(index => {
      cy.get(
        `[data-cy='pincode-enter-numpad'] [data-cy='numpad-${index}']`
      ).click();
    });

    // Should redirect you back
    cy.url().should("include", "/app/savings", {
      timeout: 10000
    });

    // Ensure that isLocked is false in app storage
    cy.window().then(win => {
      expect(win.storage.getItem("isLocked")).to.eq(false);
    });
  });

  it("prevent you from spamming invalid pin codes", function() {
    cy.login({
      username: phoneNumber,
      password,
      identifierType: "phoneNumber"
    });

    localStorage.setItem(
      "cy-storage",
      JSON.stringify({
        locksettings: {
          pin: pinCode
        },
        isLocked: true
      })
    );

    localStorage.setItem("cy-lockout-retrytimer", retryTimerLength);

    cy.visit("/auth/pin/enter");

    // Enter INCORRECT PIN code three times to reach retry timer
    const incorrectPin = [7, 8, 9, 0];
    cy.get("[data-cy='pincode-enter-numpad']").should("be.visible");

    // First attempt
    cy.wrap(incorrectPin).each(index => {
      cy.get(
        `[data-cy='pincode-enter-numpad'] [data-cy='numpad-${index}']`
      ).click();
    });

    cy.get("[data-cy='pincode-enter-status']").should(
      "have.class",
      "text-error"
    );

    // Second attempt
    cy.wrap(incorrectPin).each(index => {
      cy.get(
        `[data-cy='pincode-enter-numpad'] [data-cy='numpad-${index}']`
      ).click();
    });

    // Third attempt
    cy.wrap(incorrectPin).each(index => {
      cy.get(
        `[data-cy='pincode-enter-numpad'] [data-cy='numpad-${index}']`
      ).click();
    });

    // Ensure retry-timer exists
    cy.get(`[data-cy='pincode-enter-retrytimer']`).should("be.visible");

    // Ensure numpad is disabled
    cy.get(`[data-cy='pincode-enter-numpad']`).within(() => {
      cy.get(`[data-cy='numpad-5']`).should("be.disabled");
    });

    // Ensure that user can attempt again after a few seconds
    cy.wait(retryTimerLength * 1000);

    // Ensure retry-timer no longer exists
    cy.get(`[data-cy='pincode-enter-retrytimer']`).should("not.be.visible");

    // Ensure numpad is disabled
    cy.get(`[data-cy='pincode-enter-numpad']`).within(() => {
      cy.get(`[data-cy='numpad-5']`).should("not.be.disabled");
    });
  });
});
