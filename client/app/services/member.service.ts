import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Member } from '../shared/models/member.model';

@Injectable()
export class MemberService {

  constructor(private http: HttpClient) { }

  getMembers(param = {}): Observable<Member[]> {
    const query = [];
    Object.keys(param).forEach((key) => {
      if (param[key] !== '' && param[key] !== null) {
        query.push(`${key}=${encodeURIComponent(param[key])}`);
      }
    });
    return this.http.get<Member[]>(`/api/members?${query.join('&')}`);
  }

  countMembers(): Observable<number> {
    return this.http.get<number>('/api/members/count');
  }

  addMember(member: Member): Observable<Member> {
    return this.http.post<Member>('/api/member', member);
  }

  getMember(member: Member): Observable<Member> {
    return this.http.get<Member>(`/api/member/${member._id}`);
  }

  editMember(member: Member): Observable<string> {
    return this.http.put(`/api/member/${member._id}`, member, { responseType: 'text' });
  }

  deleteMember(member: Member): Observable<string> {
    return this.http.delete(`/api/member/${member._id}`, { responseType: 'text' });
  }

}
