import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Suit } from '../shared/models/suit.model';

@Injectable()
export class SuitService {

  constructor(private http: HttpClient) { }

  getSuits(): Observable<Suit[]> {
    return this.http.get<Suit[]>('/api/suits');
  }

  countSuits(): Observable<number> {
    return this.http.get<number>('/api/suits/count');
  }

  addSuit(suit: Suit): Observable<Suit> {
    return this.http.post<Suit>('/api/suit', suit);
  }

  getSuit(suit: Suit): Observable<Suit> {
    return this.http.get<Suit>(`/api/suit/${suit._id}`);
  }

  editSuit(suit: Suit): Observable<string> {
    return this.http.put(`/api/suit/${suit._id}`, suit, { responseType: 'text' });
  }

  deleteSuit(suit: Suit): Observable<string> {
    return this.http.delete(`/api/suit/${suit._id}`, { responseType: 'text' });
  }

}
