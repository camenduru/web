import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDetail, NewDetail } from '../detail.model';

export type PartialUpdateDetail = Partial<IDetail> & Pick<IDetail, 'id'>;

export type EntityResponseType = HttpResponse<IDetail>;
export type EntityArrayResponseType = HttpResponse<IDetail[]>;

@Injectable({ providedIn: 'root' })
export class DetailService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/details');

  create(detail: NewDetail): Observable<EntityResponseType> {
    return this.http.post<IDetail>(this.resourceUrl, detail, { observe: 'response' });
  }

  update(detail: IDetail): Observable<EntityResponseType> {
    return this.http.put<IDetail>(`${this.resourceUrl}/${this.getDetailIdentifier(detail)}`, detail, { observe: 'response' });
  }

  partialUpdate(detail: PartialUpdateDetail): Observable<EntityResponseType> {
    return this.http.patch<IDetail>(`${this.resourceUrl}/${this.getDetailIdentifier(detail)}`, detail, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IDetail>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDetail[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDetailIdentifier(detail: Pick<IDetail, 'id'>): string {
    return detail.id;
  }

  compareDetail(o1: Pick<IDetail, 'id'> | null, o2: Pick<IDetail, 'id'> | null): boolean {
    return o1 && o2 ? this.getDetailIdentifier(o1) === this.getDetailIdentifier(o2) : o1 === o2;
  }

  addDetailToCollectionIfMissing<Type extends Pick<IDetail, 'id'>>(
    detailCollection: Type[],
    ...detailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const details: Type[] = detailsToCheck.filter(isPresent);
    if (details.length > 0) {
      const detailCollectionIdentifiers = detailCollection.map(detailItem => this.getDetailIdentifier(detailItem));
      const detailsToAdd = details.filter(detailItem => {
        const detailIdentifier = this.getDetailIdentifier(detailItem);
        if (detailCollectionIdentifiers.includes(detailIdentifier)) {
          return false;
        }
        detailCollectionIdentifiers.push(detailIdentifier);
        return true;
      });
      return [...detailsToAdd, ...detailCollection];
    }
    return detailCollection;
  }
}
