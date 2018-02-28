import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Marker } from '../shared/models/marker.model';

@Injectable()
export class MarkerService {

  constructor(private http: HttpClient) { }

  getMarkers(param): Observable<Marker[]> {
    const query = [];
    Object.keys(param).forEach((key) => {
      if (param[key] !== '' && param[key] !== null) {
        query.push(`${key}=${encodeURIComponent(param[key])}`);
      }
    });
    return this.http.get<Marker[]>(`/api/markers?${query.join('&')}`);
  }

  countMarkers(): Observable<number> {
    return this.http.get<number>('/api/markers/count');
  }

  addMarker(marker: Marker): Observable<Marker> {
    return this.http.post<Marker>('/api/marker', marker);
  }

  getMarker(marker: Marker): Observable<Marker> {
    return this.http.get<Marker>(`/api/marker/${marker._id}`);
  }

  editMarker(marker: Marker): Observable<string> {
    return this.http.put(`/api/marker/${marker._id}`, marker, { responseType: 'text' });
  }

  deleteMarker(marker: Marker): Observable<string> {
    return this.http.delete(`/api/marker/${marker._id}`, { responseType: 'text' });
  }

}
