import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { TypeDetailComponent } from './type-detail.component';

describe('Type Management Detail Component', () => {
  let comp: TypeDetailComponent;
  let fixture: ComponentFixture<TypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: TypeDetailComponent,
              resolve: { type: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TypeDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load type on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TypeDetailComponent);

      // THEN
      expect(instance.type()).toEqual(expect.objectContaining({ id: 'ABC' }));
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
