import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { DetailDetailComponent } from './detail-detail.component';

describe('Detail Management Detail Component', () => {
  let comp: DetailDetailComponent;
  let fixture: ComponentFixture<DetailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: DetailDetailComponent,
              resolve: { detail: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(DetailDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load detail on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', DetailDetailComponent);

      // THEN
      expect(instance.detail()).toEqual(expect.objectContaining({ id: 'ABC' }));
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
