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

describe('Credit e2e test', () => {
  const creditPageUrl = '/credit';
  const creditPageUrlPattern = new RegExp('/credit(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const creditSample = { date: '2024-04-25T15:46:10.814Z', status: 'OUT', amount: 'of vainly instead', source: 'WEB', total: 'blossom' };

  let credit;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/credits+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/credits').as('postEntityRequest');
    cy.intercept('DELETE', '/api/credits/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (credit) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/credits/${credit.id}`,
      }).then(() => {
        credit = undefined;
      });
    }
  });

  it('Credits menu should load Credits page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('credit');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Credit').should('exist');
    cy.url().should('match', creditPageUrlPattern);
  });

  describe('Credit page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(creditPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Credit page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/credit/new$'));
        cy.getEntityCreateUpdateHeading('Credit');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', creditPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/credits',
          body: creditSample,
        }).then(({ body }) => {
          credit = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/credits+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/credits?page=0&size=20>; rel="last",<http://localhost/api/credits?page=0&size=20>; rel="first"',
              },
              body: [credit],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(creditPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Credit page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('credit');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', creditPageUrlPattern);
      });

      it('edit button click should load edit Credit page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Credit');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', creditPageUrlPattern);
      });

      it('edit button click should load edit Credit page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Credit');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', creditPageUrlPattern);
      });

      it('last delete button click should delete instance of Credit', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('credit').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', creditPageUrlPattern);

        credit = undefined;
      });
    });
  });

  describe('new Credit page', () => {
    beforeEach(() => {
      cy.visit(`${creditPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Credit');
    });

    it('should create an instance of Credit', () => {
      cy.get(`[data-cy="date"]`).type('2024-04-25T01:34');
      cy.get(`[data-cy="date"]`).blur();
      cy.get(`[data-cy="date"]`).should('have.value', '2024-04-25T01:34');

      cy.get(`[data-cy="status"]`).select('IN');

      cy.get(`[data-cy="amount"]`).type('uh-huh woot hilarious');
      cy.get(`[data-cy="amount"]`).should('have.value', 'uh-huh woot hilarious');

      cy.get(`[data-cy="source"]`).select('PATREON');

      cy.get(`[data-cy="total"]`).type('amidst when crank');
      cy.get(`[data-cy="total"]`).should('have.value', 'amidst when crank');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        credit = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', creditPageUrlPattern);
    });
  });
});
