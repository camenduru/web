import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRedeem, NewRedeem } from '../redeem.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRedeem for edit and NewRedeemFormGroupInput for create.
 */
type RedeemFormGroupInput = IRedeem | PartialWithRequiredKeyOf<NewRedeem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IRedeem | NewRedeem> = Omit<T, 'date'> & {
  date?: string | null;
};

type RedeemFormRawValue = FormValueOf<IRedeem>;

type NewRedeemFormRawValue = FormValueOf<NewRedeem>;

type RedeemFormDefaults = Pick<NewRedeem, 'id' | 'date'>;

type RedeemFormGroupContent = {
  id: FormControl<RedeemFormRawValue['id'] | NewRedeem['id']>;
  date: FormControl<RedeemFormRawValue['date']>;
  status: FormControl<RedeemFormRawValue['status']>;
  type: FormControl<RedeemFormRawValue['type']>;
  author: FormControl<RedeemFormRawValue['author']>;
  login: FormControl<RedeemFormRawValue['login']>;
  amount: FormControl<RedeemFormRawValue['amount']>;
  code: FormControl<RedeemFormRawValue['code']>;
  user: FormControl<RedeemFormRawValue['user']>;
};

export type RedeemFormGroup = FormGroup<RedeemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RedeemFormService {
  createRedeemFormGroup(redeem: RedeemFormGroupInput = { id: null }): RedeemFormGroup {
    const redeemRawValue = this.convertRedeemToRedeemRawValue({
      ...this.getFormDefaults(),
      ...redeem,
    });
    return new FormGroup<RedeemFormGroupContent>({
      id: new FormControl(
        { value: redeemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(redeemRawValue.date, {
        validators: [Validators.required],
      }),
      status: new FormControl(redeemRawValue.status, {
        validators: [Validators.required],
      }),
      type: new FormControl(redeemRawValue.type, {
        validators: [Validators.required],
      }),
      author: new FormControl(redeemRawValue.author, {
        validators: [Validators.required],
      }),
      login: new FormControl(redeemRawValue.login, {
        validators: [Validators.required],
      }),
      amount: new FormControl(redeemRawValue.amount, {
        validators: [Validators.required],
      }),
      code: new FormControl(redeemRawValue.code, {
        validators: [Validators.required],
      }),
      user: new FormControl(redeemRawValue.user),
    });
  }

  getRedeem(form: RedeemFormGroup): IRedeem | NewRedeem {
    return this.convertRedeemRawValueToRedeem(form.getRawValue() as RedeemFormRawValue | NewRedeemFormRawValue);
  }

  resetForm(form: RedeemFormGroup, redeem: RedeemFormGroupInput): void {
    const redeemRawValue = this.convertRedeemToRedeemRawValue({ ...this.getFormDefaults(), ...redeem });
    form.reset(
      {
        ...redeemRawValue,
        id: { value: redeemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RedeemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertRedeemRawValueToRedeem(rawRedeem: RedeemFormRawValue | NewRedeemFormRawValue): IRedeem | NewRedeem {
    return {
      ...rawRedeem,
      date: dayjs(rawRedeem.date, DATE_TIME_FORMAT),
    };
  }

  private convertRedeemToRedeemRawValue(
    redeem: IRedeem | (Partial<NewRedeem> & RedeemFormDefaults),
  ): RedeemFormRawValue | PartialWithRequiredKeyOf<NewRedeemFormRawValue> {
    return {
      ...redeem,
      date: redeem.date ? redeem.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
