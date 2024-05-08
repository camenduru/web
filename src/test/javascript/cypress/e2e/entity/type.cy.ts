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

describe('Type e2e test', () => {
  const typePageUrl = '/type';
  const typePageUrlPattern = new RegExp('/type(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const typeSample = {
    type: 'truthfully because',
    amount: 'successfully hm which',
    schema: 'meaningfully',
    model: 'but yuck',
    title: 'whoa armament',
    isDefault: false,
    isActive: false,
  };

  let type;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/types+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/types').as('postEntityRequest');
    cy.intercept('DELETE', '/api/types/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (type) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/types/${type.id}`,
      }).then(() => {
        type = undefined;
      });
    }
  });

  it('Types menu should load Types page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('type');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Type').should('exist');
    cy.url().should('match', typePageUrlPattern);
  });

  describe('Type page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(typePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Type page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/type/new$'));
        cy.getEntityCreateUpdateHeading('Type');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', typePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/types',
          body: typeSample,
        }).then(({ body }) => {
          type = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/types+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/types?page=0&size=20>; rel="last",<http://localhost/api/types?page=0&size=20>; rel="first"',
              },
              body: [type],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(typePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Type page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('type');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', typePageUrlPattern);
      });

      it('edit button click should load edit Type page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Type');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', typePageUrlPattern);
      });

      it('edit button click should load edit Type page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Type');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', typePageUrlPattern);
      });

      it('last delete button click should delete instance of Type', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('type').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', typePageUrlPattern);

        type = undefined;
      });
    });
  });

  describe('new Type page', () => {
    beforeEach(() => {
      cy.visit(`${typePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Type');
    });

    it('should create an instance of Type', () => {
      cy.get(`[data-cy="type"]`).type('but beside');
      cy.get(`[data-cy="type"]`).should('have.value', 'but beside');

      cy.get(`[data-cy="amount"]`).type('adhere');
      cy.get(`[data-cy="amount"]`).should('have.value', 'adhere');

      cy.get(`[data-cy="schema"]`).type('passionate where');
      cy.get(`[data-cy="schema"]`).should('have.value', 'passionate where');

      cy.get(`[data-cy="model"]`).type('gadzooks mmm maximize');
      cy.get(`[data-cy="model"]`).should('have.value', 'gadzooks mmm maximize');

      cy.get(`[data-cy="title"]`).type('drake gosh');
      cy.get(`[data-cy="title"]`).should('have.value', 'drake gosh');

      cy.get(`[data-cy="isDefault"]`).should('not.be.checked');
      cy.get(`[data-cy="isDefault"]`).click();
      cy.get(`[data-cy="isDefault"]`).should('be.checked');

      cy.get(`[data-cy="isActive"]`).should('not.be.checked');
      cy.get(`[data-cy="isActive"]`).click();
      cy.get(`[data-cy="isActive"]`).should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        type = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', typePageUrlPattern);
    });
  });
});
