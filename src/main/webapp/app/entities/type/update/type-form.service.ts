import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IType, NewType } from '../type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IType for edit and NewTypeFormGroupInput for create.
 */
type TypeFormGroupInput = IType | PartialWithRequiredKeyOf<NewType>;

type TypeFormDefaults = Pick<NewType, 'id'>;

type TypeFormGroupContent = {
  id: FormControl<IType['id'] | NewType['id']>;
  type: FormControl<IType['type']>;
  amount: FormControl<IType['amount']>;
};

export type TypeFormGroup = FormGroup<TypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TypeFormService {
  createTypeFormGroup(type: TypeFormGroupInput = { id: null }): TypeFormGroup {
    const typeRawValue = {
      ...this.getFormDefaults(),
      ...type,
    };
    return new FormGroup<TypeFormGroupContent>({
      id: new FormControl(
        { value: typeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      type: new FormControl(typeRawValue.type, {
        validators: [Validators.required],
      }),
      amount: new FormControl(typeRawValue.amount, {
        validators: [Validators.required],
      }),
    });
  }

  getType(form: TypeFormGroup): IType | NewType {
    return form.getRawValue() as IType | NewType;
  }

  resetForm(form: TypeFormGroup, type: TypeFormGroupInput): void {
    const typeRawValue = { ...this.getFormDefaults(), ...type };
    form.reset(
      {
        ...typeRawValue,
        id: { value: typeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TypeFormDefaults {
    return {
      id: null,
    };
  }
}
