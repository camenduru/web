import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { CreditDetailComponent } from './credit-detail.component';

describe('Credit Management Detail Component', () => {
  let comp: CreditDetailComponent;
  let fixture: ComponentFixture<CreditDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: CreditDetailComponent,
              resolve: { credit: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(CreditDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load credit on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CreditDetailComponent);

      // THEN
      expect(instance.credit()).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
