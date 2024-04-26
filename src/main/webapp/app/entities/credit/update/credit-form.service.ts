import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICredit, NewCredit } from '../credit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICredit for edit and NewCreditFormGroupInput for create.
 */
type CreditFormGroupInput = ICredit | PartialWithRequiredKeyOf<NewCredit>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICredit | NewCredit> = Omit<T, 'date'> & {
  date?: string | null;
};

type CreditFormRawValue = FormValueOf<ICredit>;

type NewCreditFormRawValue = FormValueOf<NewCredit>;

type CreditFormDefaults = Pick<NewCredit, 'id' | 'date'>;

type CreditFormGroupContent = {
  id: FormControl<CreditFormRawValue['id'] | NewCredit['id']>;
  date: FormControl<CreditFormRawValue['date']>;
  status: FormControl<CreditFormRawValue['status']>;
  amount: FormControl<CreditFormRawValue['amount']>;
  source: FormControl<CreditFormRawValue['source']>;
  total: FormControl<CreditFormRawValue['total']>;
  user: FormControl<CreditFormRawValue['user']>;
};

export type CreditFormGroup = FormGroup<CreditFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CreditFormService {
  createCreditFormGroup(credit: CreditFormGroupInput = { id: null }): CreditFormGroup {
    const creditRawValue = this.convertCreditToCreditRawValue({
      ...this.getFormDefaults(),
      ...credit,
    });
    return new FormGroup<CreditFormGroupContent>({
      id: new FormControl(
        { value: creditRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(creditRawValue.date, {
        validators: [Validators.required],
      }),
      status: new FormControl(creditRawValue.status, {
        validators: [Validators.required],
      }),
      amount: new FormControl(creditRawValue.amount, {
        validators: [Validators.required],
      }),
      source: new FormControl(creditRawValue.source, {
        validators: [Validators.required],
      }),
      total: new FormControl(creditRawValue.total, {
        validators: [Validators.required],
      }),
      user: new FormControl(creditRawValue.user),
    });
  }

  getCredit(form: CreditFormGroup): ICredit | NewCredit {
    return this.convertCreditRawValueToCredit(form.getRawValue() as CreditFormRawValue | NewCreditFormRawValue);
  }

  resetForm(form: CreditFormGroup, credit: CreditFormGroupInput): void {
    const creditRawValue = this.convertCreditToCreditRawValue({ ...this.getFormDefaults(), ...credit });
    form.reset(
      {
        ...creditRawValue,
        id: { value: creditRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CreditFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertCreditRawValueToCredit(rawCredit: CreditFormRawValue | NewCreditFormRawValue): ICredit | NewCredit {
    return {
      ...rawCredit,
      date: dayjs(rawCredit.date, DATE_TIME_FORMAT),
    };
  }

  private convertCreditToCreditRawValue(
    credit: ICredit | (Partial<NewCredit> & CreditFormDefaults),
  ): CreditFormRawValue | PartialWithRequiredKeyOf<NewCreditFormRawValue> {
    return {
      ...credit,
      date: credit.date ? credit.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
