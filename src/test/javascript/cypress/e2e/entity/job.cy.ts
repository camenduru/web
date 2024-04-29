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

describe('Job e2e test', () => {
  const jobPageUrl = '/job';
  const jobPageUrlPattern = new RegExp('/job(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const jobSample = {
    date: '2024-04-25T03:52:12.638Z',
    status: 'POSITIVE',
    source: 'PATREON',
    sourceId: 'given silently',
    sourceChannel: 'squiggly besides amidst',
    command: 'keenly annual excluding',
    type: 'oversight tenet',
    amount: 'gruesome',
    result: 'quarrelsomely',
    login: 'innocently',
  };

  let job;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/jobs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/jobs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/jobs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (job) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/jobs/${job.id}`,
      }).then(() => {
        job = undefined;
      });
    }
  });

  it('Jobs menu should load Jobs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('job');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Job').should('exist');
    cy.url().should('match', jobPageUrlPattern);
  });

  describe('Job page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(jobPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Job page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/job/new$'));
        cy.getEntityCreateUpdateHeading('Job');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jobPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/jobs',
          body: jobSample,
        }).then(({ body }) => {
          job = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/jobs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/jobs?page=0&size=20>; rel="last",<http://localhost/api/jobs?page=0&size=20>; rel="first"',
              },
              body: [job],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(jobPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Job page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('job');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jobPageUrlPattern);
      });

      it('edit button click should load edit Job page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Job');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jobPageUrlPattern);
      });

      it('edit button click should load edit Job page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Job');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jobPageUrlPattern);
      });

      it('last delete button click should delete instance of Job', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('job').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', jobPageUrlPattern);

        job = undefined;
      });
    });
  });

  describe('new Job page', () => {
    beforeEach(() => {
      cy.visit(`${jobPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Job');
    });

    it('should create an instance of Job', () => {
      cy.get(`[data-cy="date"]`).type('2024-04-25T02:08');
      cy.get(`[data-cy="date"]`).blur();
      cy.get(`[data-cy="date"]`).should('have.value', '2024-04-25T02:08');

      cy.get(`[data-cy="status"]`).select('POSITIVE');

      cy.get(`[data-cy="source"]`).select('WEB');

      cy.get(`[data-cy="sourceId"]`).type('bah however speedy');
      cy.get(`[data-cy="sourceId"]`).should('have.value', 'bah however speedy');

      cy.get(`[data-cy="sourceChannel"]`).type('nicely what');
      cy.get(`[data-cy="sourceChannel"]`).should('have.value', 'nicely what');

      cy.get(`[data-cy="command"]`).type('tidy near');
      cy.get(`[data-cy="command"]`).should('have.value', 'tidy near');

      cy.get(`[data-cy="type"]`).type('cruelly wearily');
      cy.get(`[data-cy="type"]`).should('have.value', 'cruelly wearily');

      cy.get(`[data-cy="amount"]`).type('respect supposing');
      cy.get(`[data-cy="amount"]`).should('have.value', 'respect supposing');

      cy.get(`[data-cy="result"]`).type('where');
      cy.get(`[data-cy="result"]`).should('have.value', 'where');

      cy.get(`[data-cy="login"]`).type('frantically');
      cy.get(`[data-cy="login"]`).should('have.value', 'frantically');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        job = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', jobPageUrlPattern);
    });
  });
});
