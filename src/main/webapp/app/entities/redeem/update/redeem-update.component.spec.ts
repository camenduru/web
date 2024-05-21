import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { RedeemService } from '../service/redeem.service';
import { IRedeem } from '../redeem.model';
import { RedeemFormService } from './redeem-form.service';

import { RedeemUpdateComponent } from './redeem-update.component';

describe('Redeem Management Update Component', () => {
  let comp: RedeemUpdateComponent;
  let fixture: ComponentFixture<RedeemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let redeemFormService: RedeemFormService;
  let redeemService: RedeemService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RedeemUpdateComponent],
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
      .overrideTemplate(RedeemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RedeemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    redeemFormService = TestBed.inject(RedeemFormService);
    redeemService = TestBed.inject(RedeemService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const redeem: IRedeem = { id: 'CBA' };
      const user: IUser = { id: '4e721970-f867-4627-bd3d-7265264b9bbf' };
      redeem.user = user;

      const userCollection: IUser[] = [{ id: '4bb72124-bad9-4848-be96-0bacdcc776d6' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ redeem });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const redeem: IRedeem = { id: 'CBA' };
      const user: IUser = { id: '75aa936a-ae7a-4886-8d3f-d0c7eab04fc0' };
      redeem.user = user;

      activatedRoute.data = of({ redeem });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.redeem).toEqual(redeem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRedeem>>();
      const redeem = { id: 'ABC' };
      jest.spyOn(redeemFormService, 'getRedeem').mockReturnValue(redeem);
      jest.spyOn(redeemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ redeem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: redeem }));
      saveSubject.complete();

      // THEN
      expect(redeemFormService.getRedeem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(redeemService.update).toHaveBeenCalledWith(expect.objectContaining(redeem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRedeem>>();
      const redeem = { id: 'ABC' };
      jest.spyOn(redeemFormService, 'getRedeem').mockReturnValue({ id: null });
      jest.spyOn(redeemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ redeem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: redeem }));
      saveSubject.complete();

      // THEN
      expect(redeemFormService.getRedeem).toHaveBeenCalled();
      expect(redeemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRedeem>>();
      const redeem = { id: 'ABC' };
      jest.spyOn(redeemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ redeem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(redeemService.update).toHaveBeenCalled();
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
