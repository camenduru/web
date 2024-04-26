import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICredit, NewCredit } from '../credit.model';

export type PartialUpdateCredit = Partial<ICredit> & Pick<ICredit, 'id'>;

type RestOf<T extends ICredit | NewCredit> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestCredit = RestOf<ICredit>;

export type NewRestCredit = RestOf<NewCredit>;

export type PartialUpdateRestCredit = RestOf<PartialUpdateCredit>;

export type EntityResponseType = HttpResponse<ICredit>;
export type EntityArrayResponseType = HttpResponse<ICredit[]>;

@Injectable({ providedIn: 'root' })
export class CreditService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credits');

  create(credit: NewCredit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(credit);
    return this.http
      .post<RestCredit>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(credit: ICredit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(credit);
    return this.http
      .put<RestCredit>(`${this.resourceUrl}/${this.getCreditIdentifier(credit)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(credit: PartialUpdateCredit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(credit);
    return this.http
      .patch<RestCredit>(`${this.resourceUrl}/${this.getCreditIdentifier(credit)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestCredit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCredit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCreditIdentifier(credit: Pick<ICredit, 'id'>): string {
    return credit.id;
  }

  compareCredit(o1: Pick<ICredit, 'id'> | null, o2: Pick<ICredit, 'id'> | null): boolean {
    return o1 && o2 ? this.getCreditIdentifier(o1) === this.getCreditIdentifier(o2) : o1 === o2;
  }

  addCreditToCollectionIfMissing<Type extends Pick<ICredit, 'id'>>(
    creditCollection: Type[],
    ...creditsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const credits: Type[] = creditsToCheck.filter(isPresent);
    if (credits.length > 0) {
      const creditCollectionIdentifiers = creditCollection.map(creditItem => this.getCreditIdentifier(creditItem));
      const creditsToAdd = credits.filter(creditItem => {
        const creditIdentifier = this.getCreditIdentifier(creditItem);
        if (creditCollectionIdentifiers.includes(creditIdentifier)) {
          return false;
        }
        creditCollectionIdentifiers.push(creditIdentifier);
        return true;
      });
      return [...creditsToAdd, ...creditCollection];
    }
    return creditCollection;
  }

  protected convertDateFromClient<T extends ICredit | NewCredit | PartialUpdateCredit>(credit: T): RestOf<T> {
    return {
      ...credit,
      date: credit.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCredit: RestCredit): ICredit {
    return {
      ...restCredit,
      date: restCredit.date ? dayjs(restCredit.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCredit>): HttpResponse<ICredit> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCredit[]>): HttpResponse<ICredit[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
