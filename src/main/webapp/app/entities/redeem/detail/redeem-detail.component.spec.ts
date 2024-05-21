import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { RedeemDetailComponent } from './redeem-detail.component';

describe('Redeem Management Detail Component', () => {
  let comp: RedeemDetailComponent;
  let fixture: ComponentFixture<RedeemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedeemDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: RedeemDetailComponent,
              resolve: { redeem: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(RedeemDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load redeem on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RedeemDetailComponent);

      // THEN
      expect(instance.redeem()).toEqual(expect.objectContaining({ id: 'ABC' }));
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
