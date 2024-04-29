import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IType, NewType } from '../type.model';

export type PartialUpdateType = Partial<IType> & Pick<IType, 'id'>;

export type EntityResponseType = HttpResponse<IType>;
export type EntityArrayResponseType = HttpResponse<IType[]>;

@Injectable({ providedIn: 'root' })
export class TypeService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/types');

  create(type: NewType): Observable<EntityResponseType> {
    return this.http.post<IType>(this.resourceUrl, type, { observe: 'response' });
  }

  update(type: IType): Observable<EntityResponseType> {
    return this.http.put<IType>(`${this.resourceUrl}/${this.getTypeIdentifier(type)}`, type, { observe: 'response' });
  }

  partialUpdate(type: PartialUpdateType): Observable<EntityResponseType> {
    return this.http.patch<IType>(`${this.resourceUrl}/${this.getTypeIdentifier(type)}`, type, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTypeIdentifier(type: Pick<IType, 'id'>): string {
    return type.id;
  }

  compareType(o1: Pick<IType, 'id'> | null, o2: Pick<IType, 'id'> | null): boolean {
    return o1 && o2 ? this.getTypeIdentifier(o1) === this.getTypeIdentifier(o2) : o1 === o2;
  }

  addTypeToCollectionIfMissing<Type extends Pick<IType, 'id'>>(
    typeCollection: Type[],
    ...typesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const types: Type[] = typesToCheck.filter(isPresent);
    if (types.length > 0) {
      const typeCollectionIdentifiers = typeCollection.map(typeItem => this.getTypeIdentifier(typeItem));
      const typesToAdd = types.filter(typeItem => {
        const typeIdentifier = this.getTypeIdentifier(typeItem);
        if (typeCollectionIdentifiers.includes(typeIdentifier)) {
          return false;
        }
        typeCollectionIdentifiers.push(typeIdentifier);
        return true;
      });
      return [...typesToAdd, ...typeCollection];
    }
    return typeCollection;
  }
}
