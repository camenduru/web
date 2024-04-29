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

describe('Detail e2e test', () => {
  const detailPageUrl = '/detail';
  const detailPageUrlPattern = new RegExp('/detail(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const detailSample = {
    discord: 'commonly',
    sourceId: 'strictly',
    sourceChannel: 'maracas cloudy',
    total: 'likewise',
    login: 'cower sinuosity',
  };

  let detail;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/details+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/details').as('postEntityRequest');
    cy.intercept('DELETE', '/api/details/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (detail) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/details/${detail.id}`,
      }).then(() => {
        detail = undefined;
      });
    }
  });

  it('Details menu should load Details page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('detail');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Detail').should('exist');
    cy.url().should('match', detailPageUrlPattern);
  });

  describe('Detail page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(detailPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Detail page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/detail/new$'));
        cy.getEntityCreateUpdateHeading('Detail');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detailPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/details',
          body: detailSample,
        }).then(({ body }) => {
          detail = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/details+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/details?page=0&size=20>; rel="last",<http://localhost/api/details?page=0&size=20>; rel="first"',
              },
              body: [detail],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(detailPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Detail page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('detail');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detailPageUrlPattern);
      });

      it('edit button click should load edit Detail page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Detail');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detailPageUrlPattern);
      });

      it('edit button click should load edit Detail page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Detail');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detailPageUrlPattern);
      });

      it('last delete button click should delete instance of Detail', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('detail').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detailPageUrlPattern);

        detail = undefined;
      });
    });
  });

  describe('new Detail page', () => {
    beforeEach(() => {
      cy.visit(`${detailPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Detail');
    });

    it('should create an instance of Detail', () => {
      cy.get(`[data-cy="discord"]`).type('toilet');
      cy.get(`[data-cy="discord"]`).should('have.value', 'toilet');

      cy.get(`[data-cy="sourceId"]`).type('till');
      cy.get(`[data-cy="sourceId"]`).should('have.value', 'till');

      cy.get(`[data-cy="sourceChannel"]`).type('endow casserole');
      cy.get(`[data-cy="sourceChannel"]`).should('have.value', 'endow casserole');

      cy.get(`[data-cy="total"]`).type('horrible surpass readies');
      cy.get(`[data-cy="total"]`).should('have.value', 'horrible surpass readies');

      cy.get(`[data-cy="login"]`).type('oh sans');
      cy.get(`[data-cy="login"]`).should('have.value', 'oh sans');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        detail = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', detailPageUrlPattern);
    });
  });
});
