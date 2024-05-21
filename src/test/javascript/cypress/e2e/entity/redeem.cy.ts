import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Redeem e2e test', () => {
  const redeemPageUrl = '/redeem';
  const redeemPageUrlPattern = new RegExp('/redeem(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const redeemSample = {
    date: '2024-05-20T15:55:02.775Z',
    status: 'FAILED',
    type: 'biodegradable required nutritious',
    author: 'physiology uselessly because',
    login: 'exalted yahoo',
    amount: 'throughout',
    code: 'gander bah',
  };

  let redeem;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/redeems+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/redeems').as('postEntityRequest');
    cy.intercept('DELETE', '/api/redeems/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (redeem) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/redeems/${redeem.id}`,
      }).then(() => {
        redeem = undefined;
      });
    }
  });

  it('Redeems menu should load Redeems page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('redeem');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Redeem').should('exist');
    cy.url().should('match', redeemPageUrlPattern);
  });

  describe('Redeem page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(redeemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Redeem page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/redeem/new$'));
        cy.getEntityCreateUpdateHeading('Redeem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', redeemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/redeems',
          body: redeemSample,
        }).then(({ body }) => {
          redeem = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/redeems+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [redeem],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(redeemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Redeem page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('redeem');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', redeemPageUrlPattern);
      });

      it('edit button click should load edit Redeem page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Redeem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', redeemPageUrlPattern);
      });

      it('edit button click should load edit Redeem page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Redeem');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', redeemPageUrlPattern);
      });

      it('last delete button click should delete instance of Redeem', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('redeem').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', redeemPageUrlPattern);

        redeem = undefined;
      });
    });
  });

  describe('new Redeem page', () => {
    beforeEach(() => {
      cy.visit(`${redeemPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Redeem');
    });

    it('should create an instance of Redeem', () => {
      cy.get(`[data-cy="date"]`).type('2024-05-20T06:38');
      cy.get(`[data-cy="date"]`).blur();
      cy.get(`[data-cy="date"]`).should('have.value', '2024-05-20T06:38');

      cy.get(`[data-cy="status"]`).select('WAITING');

      cy.get(`[data-cy="type"]`).type('till');
      cy.get(`[data-cy="type"]`).should('have.value', 'till');

      cy.get(`[data-cy="author"]`).type('within atop');
      cy.get(`[data-cy="author"]`).should('have.value', 'within atop');

      cy.get(`[data-cy="login"]`).type('as');
      cy.get(`[data-cy="login"]`).should('have.value', 'as');

      cy.get(`[data-cy="amount"]`).type('the socialise');
      cy.get(`[data-cy="amount"]`).should('have.value', 'the socialise');

      cy.get(`[data-cy="code"]`).type('farrow despite plagiarize');
      cy.get(`[data-cy="code"]`).should('have.value', 'farrow despite plagiarize');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        redeem = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', redeemPageUrlPattern);
    });
  });
});
