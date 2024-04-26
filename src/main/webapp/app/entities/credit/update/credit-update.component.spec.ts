import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { CreditService } from '../service/credit.service';
import { ICredit } from '../credit.model';
import { CreditFormService } from './credit-form.service';

import { CreditUpdateComponent } from './credit-update.component';

describe('Credit Management Update Component', () => {
  let comp: CreditUpdateComponent;
  let fixture: ComponentFixture<CreditUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let creditFormService: CreditFormService;
  let creditService: CreditService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CreditUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CreditUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    creditFormService = TestBed.inject(CreditFormService);
    creditService = TestBed.inject(CreditService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const credit: ICredit = { id: 'CBA' };
      const user: IUser = { id: '4e721970-f867-4627-bd3d-7265264b9bbf' };
      credit.user = user;

      const userCollection: IUser[] = [{ id: '4bb72124-bad9-4848-be96-0bacdcc776d6' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const credit: ICredit = { id: 'CBA' };
      const user: IUser = { id: '75aa936a-ae7a-4886-8d3f-d0c7eab04fc0' };
      credit.user = user;

      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.credit).toEqual(credit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICredit>>();
      const credit = { id: 'ABC' };
      jest.spyOn(creditFormService, 'getCredit').mockReturnValue(credit);
      jest.spyOn(creditService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: credit }));
      saveSubject.complete();

      // THEN
      expect(creditFormService.getCredit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(creditService.update).toHaveBeenCalledWith(expect.objectContaining(credit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICredit>>();
      const credit = { id: 'ABC' };
      jest.spyOn(creditFormService, 'getCredit').mockReturnValue({ id: null });
      jest.spyOn(creditService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ credit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: credit }));
      saveSubject.complete();

      // THEN
      expect(creditFormService.getCredit).toHaveBeenCalled();
      expect(creditService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICredit>>();
      const credit = { id: 'ABC' };
      jest.spyOn(creditService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ credit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(creditService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
