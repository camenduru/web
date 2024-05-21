import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRedeem, NewRedeem } from '../redeem.model';

export type PartialUpdateRedeem = Partial<IRedeem> & Pick<IRedeem, 'id'>;

type RestOf<T extends IRedeem | NewRedeem> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestRedeem = RestOf<IRedeem>;

export type NewRestRedeem = RestOf<NewRedeem>;

export type PartialUpdateRestRedeem = RestOf<PartialUpdateRedeem>;

export type EntityResponseType = HttpResponse<IRedeem>;
export type EntityArrayResponseType = HttpResponse<IRedeem[]>;

@Injectable({ providedIn: 'root' })
export class RedeemService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/redeems');

  create(redeem: NewRedeem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(redeem);
    return this.http
      .post<RestRedeem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(redeem: IRedeem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(redeem);
    return this.http
      .put<RestRedeem>(`${this.resourceUrl}/${this.getRedeemIdentifier(redeem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(redeem: PartialUpdateRedeem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(redeem);
    return this.http
      .patch<RestRedeem>(`${this.resourceUrl}/${this.getRedeemIdentifier(redeem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestRedeem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRedeem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRedeemIdentifier(redeem: Pick<IRedeem, 'id'>): string {
    return redeem.id;
  }

  compareRedeem(o1: Pick<IRedeem, 'id'> | null, o2: Pick<IRedeem, 'id'> | null): boolean {
    return o1 && o2 ? this.getRedeemIdentifier(o1) === this.getRedeemIdentifier(o2) : o1 === o2;
  }

  addRedeemToCollectionIfMissing<Type extends Pick<IRedeem, 'id'>>(
    redeemCollection: Type[],
    ...redeemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const redeems: Type[] = redeemsToCheck.filter(isPresent);
    if (redeems.length > 0) {
      const redeemCollectionIdentifiers = redeemCollection.map(redeemItem => this.getRedeemIdentifier(redeemItem));
      const redeemsToAdd = redeems.filter(redeemItem => {
        const redeemIdentifier = this.getRedeemIdentifier(redeemItem);
        if (redeemCollectionIdentifiers.includes(redeemIdentifier)) {
          return false;
        }
        redeemCollectionIdentifiers.push(redeemIdentifier);
        return true;
      });
      return [...redeemsToAdd, ...redeemCollection];
    }
    return redeemCollection;
  }

  protected convertDateFromClient<T extends IRedeem | NewRedeem | PartialUpdateRedeem>(redeem: T): RestOf<T> {
    return {
      ...redeem,
      date: redeem.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restRedeem: RestRedeem): IRedeem {
    return {
      ...restRedeem,
      date: restRedeem.date ? dayjs(restRedeem.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRedeem>): HttpResponse<IRedeem> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRedeem[]>): HttpResponse<IRedeem[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
