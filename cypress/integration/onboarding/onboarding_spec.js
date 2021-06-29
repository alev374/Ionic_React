describe("The Onboarding Process", function() {
  const firstName = "John";
  const lastName = "Wicked";
  const password = "password";
  const personalEmail = "jwick2212@hotmail.com";

  const phoneNumber1 = "+639171111111";
  const workEmail1 = "john.wicked@thecontinental.hotel";
  const companyName1 = "Cypress Inc.";

  const phoneNumber2 = "+639172222222";
  const companyName2 = "Two Branches Inc.";
  const branchName = "Mountain Location";

  before(function() {
    cy.clearSeed().then(() => {
      return cy.seed([
        {
          job: [
            {
              firstName,
              lastName,
              email: workEmail1,
              phoneNumber: phoneNumber1,
              position: "Independent Contractor"
            }
          ],
          company: {
            name: companyName1
          },
          user: {
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: phoneNumber1,
            password
          }
        },
        {
          job: [
            {
              firstName,
              lastName,
              email: personalEmail,
              phoneNumber: phoneNumber2,
              position: "Independent Contractor"
            }
          ],
          company: {
            name: companyName2
          },
          branch: {
            branchName: branchName
          },
          user: {
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: phoneNumber2,
            password
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

  it("successfully goes through onboarding process", function() {
    cy.login({
      username: phoneNumber1,
      password,
      identifierType: "phoneNumber"
    });

    cy.visit("/onboard/fullname");

    /* Full Name */

    cy.get("[data-cy='onboard-fullname-next-btn']", {
      timeout: 10000
    }).should("have.class", "button-disabled");
    cy.get("[data-cy='onboard-fullname-prev-btn']").should("not.exist");
    cy.get("input[name=firstName").type(firstName);
    cy.get("input[name=lastName").type(lastName);

    cy.get("[data-cy='onboard-fullname-next-btn']").click();

    /* Email */
    cy.url().should("include", "/onboard/email", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-email-next-btn']").should(
      "have.class",
      "button-disabled"
    );
    cy.get("input[name=email").type(personalEmail);

    cy.get("[data-cy='onboard-email-next-btn']").click();

    /* Company with one branch */
    cy.url().should("include", "/onboard/employer", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-employer-next-btn']").should(
      "have.class",
      "button-disabled"
    );
    cy.get("input[name=company").click();

    cy.url().should("include", "/onboard/employer/searchcompany", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-employer-searchcompany']")
      .should("be.visible")
      .within(() => {
        // Search input
        cy.get("[data-cy='onboard-employer-searchcompany-searchinput']").within(
          () => {
            cy.get("input[type='search']").type(companyName1);
          }
        );
        cy.wait(1000);
        cy.get("[data-cy='onboard-employer-searchcompany-results']")
          .should("be.visible")
          .contains(companyName1)
          .should("be.visible")
          .click();
      });

    cy.get("input[name=company]").should("have.value", companyName1);

    cy.get("[data-cy='onboard-employer-next-btn']").click();

    /* Work Email */
    cy.url().should("include", "/onboard/workemail", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-workemail-next-btn']").should(
      "have.class",
      "button-disabled"
    );
    cy.get("input[name='workEmail']").type(workEmail1);

    cy.get("[data-cy='onboard-workemail-next-btn']").click();

    /* Review */
    cy.url().should("include", "/onboard/review", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-review-list']")
      .should("be.visible")
      .within(() => {
        cy.get("[data-cy='onboard-review-item-fullName']").contains(
          `${firstName} ${lastName}`
        );
        cy.get("[data-cy='onboard-review-item-email']").contains(personalEmail);
        cy.get("[data-cy='onboard-review-item-employerName']").contains(
          companyName1
        );
        cy.get("[data-cy='onboard-review-item-workEmail']").contains(
          workEmail1
        );
      });

    /* 
      Test back-button and
      ensure previous values persist
    */
    cy.get("[data-cy='onboard-review-item-workEmail']")
      .contains("Change")
      .click();

    // Work Email
    cy.url().should("include", "/onboard/workemail", {
      timeout: 10000
    });

    cy.get("input[name='workEmail'").should("have.value", workEmail1);

    cy.get("[data-cy='onboard-workemail-prev-btn']").click();

    // Employer
    cy.url().should("include", "/onboard/employer", {
      timeout: 10000
    });

    cy.get("input[name='company']").should("have.value", companyName1);

    cy.get("[data-cy='onboard-employer-prev-btn']").click();

    // Email
    cy.url().should("include", "/onboard/email", {
      timeout: 10000
    });

    cy.get("input[name='email']").should("have.value", personalEmail);

    cy.get("[data-cy='onboard-email-prev-btn']").click();

    // Full Name
    cy.url().should("include", "/onboard/fullname", {
      timeout: 10000
    });

    cy.get("input[name=firstName").should("have.value", firstName);
    cy.get("input[name=lastName").should("have.value", lastName);

    cy.get("[data-cy='onboard-fullname-prev-btn']").click();

    /* 
      Review page again
    */
    cy.url().should("include", "/onboard/review", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-review-confirm-btn']")
      .should("be.visible")
      .click();

    /* 
      Confirmation page
    */
    cy.url().should("include", "/onboard/complete", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-complete-check-workemail']")
      .should("be.visible")
      .contains(workEmail1);

    cy.get("[data-cy='onboard-complete-continue-btn']");
  });

  it("successfully onboards with multi-branch company", function() {
    cy.login({
      username: phoneNumber2,
      password,
      identifierType: "phoneNumber"
    });

    cy.visit("/onboard/fullname");

    /* Full Name */

    cy.get("[data-cy='onboard-fullname-next-btn']", {
      timeout: 10000
    }).should("have.class", "button-disabled");
    cy.get("[data-cy='onboard-fullname-prev-btn']").should("not.exist");
    cy.get("input[name=firstName").type(firstName);
    cy.get("input[name=lastName").type(lastName);

    cy.get("[data-cy='onboard-fullname-next-btn']").click();

    /* Email */
    cy.url().should("include", "/onboard/email", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-email-next-btn']").should(
      "have.class",
      "button-disabled"
    );
    cy.get("input[name=email").type(personalEmail);

    cy.get("[data-cy='onboard-email-next-btn']").click();

    /* Company with two branches */

    cy.get("input[name=company]").click();

    cy.url().should("include", "/onboard/employer/searchcompany", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-employer-searchcompany']")
      .should("be.visible")
      .within(() => {
        // Search input
        cy.get("[data-cy='onboard-employer-searchcompany-searchinput']").within(
          () => {
            cy.get("input[type='search']")
              .clear()
              .type(companyName2);
          }
        );
        cy.wait(1000);
        cy.get("[data-cy='onboard-employer-searchcompany-results']")
          .should("be.visible")
          .contains(companyName2)
          .should("be.visible")
          .click();
      });

    cy.url().should("include", "/onboard/employer/searchbranch", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-employer-searchbranch']")
      .should("be.visible")
      .within(() => {
        cy.wait(1000);
        cy.get("[data-cy='onboard-employer-searchbranch-results']")
          .should("be.visible")
          .contains(branchName)
          .should("be.visible")
          .click();
      });

    cy.get("input[name=company]").should("have.value", companyName2);
    cy.get("input[name=branch]").should("have.value", branchName);

    cy.get("[data-cy='onboard-employer-next-btn']").click();

    /* Review */
    cy.url().should("include", "/onboard/review", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-review-list']")
      .should("be.visible")
      .within(() => {
        cy.get("[data-cy='onboard-review-item-fullName']").contains(
          `${firstName} ${lastName}`
        );
        cy.get("[data-cy='onboard-review-item-email']").contains(personalEmail);
        cy.get("[data-cy='onboard-review-item-employerName']").contains(
          `${companyName2} - ${branchName}`
        );
      });

    cy.get("[data-cy='onboard-review-confirm-btn']")
      .should("be.visible")
      .click();

    /* 
      Confirmation page
    */
    cy.url().should("include", "/onboard/complete", {
      timeout: 10000
    });

    cy.get("[data-cy='onboard-complete-check-personalemail']")
      .should("be.visible")
      .contains(personalEmail);

    cy.get("[data-cy='onboard-complete-continue-btn']").should("be.visible");
  });
});
