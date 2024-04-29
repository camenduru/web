import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDetail, NewDetail } from '../detail.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDetail for edit and NewDetailFormGroupInput for create.
 */
type DetailFormGroupInput = IDetail | PartialWithRequiredKeyOf<NewDetail>;

type DetailFormDefaults = Pick<NewDetail, 'id'>;

type DetailFormGroupContent = {
  id: FormControl<IDetail['id'] | NewDetail['id']>;
  discord: FormControl<IDetail['discord']>;
  sourceId: FormControl<IDetail['sourceId']>;
  sourceChannel: FormControl<IDetail['sourceChannel']>;
  total: FormControl<IDetail['total']>;
  login: FormControl<IDetail['login']>;
  user: FormControl<IDetail['user']>;
};

export type DetailFormGroup = FormGroup<DetailFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DetailFormService {
  createDetailFormGroup(detail: DetailFormGroupInput = { id: null }): DetailFormGroup {
    const detailRawValue = {
      ...this.getFormDefaults(),
      ...detail,
    };
    return new FormGroup<DetailFormGroupContent>({
      id: new FormControl(
        { value: detailRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      discord: new FormControl(detailRawValue.discord, {
        validators: [Validators.required],
      }),
      sourceId: new FormControl(detailRawValue.sourceId, {
        validators: [Validators.required],
      }),
      sourceChannel: new FormControl(detailRawValue.sourceChannel, {
        validators: [Validators.required],
      }),
      total: new FormControl(detailRawValue.total, {
        validators: [Validators.required],
      }),
      login: new FormControl(detailRawValue.login, {
        validators: [Validators.required],
      }),
      user: new FormControl(detailRawValue.user),
    });
  }

  getDetail(form: DetailFormGroup): IDetail | NewDetail {
    return form.getRawValue() as IDetail | NewDetail;
  }

  resetForm(form: DetailFormGroup, detail: DetailFormGroupInput): void {
    const detailRawValue = { ...this.getFormDefaults(), ...detail };
    form.reset(
      {
        ...detailRawValue,
        id: { value: detailRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DetailFormDefaults {
    return {
      id: null,
    };
  }
}
