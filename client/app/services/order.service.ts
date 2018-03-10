import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Order } from '../shared/models/order.model';

@Injectable()
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrders(param = {}): Observable<Order[]> {
    const query = [];
    Object.keys(param).forEach((key) => {
      if (param[key] !== '' && param[key] !== null) {
        query.push(`${key}=${encodeURIComponent(param[key])}`);
      }
    });
    return this.http.get<Order[]>(`/api/orders?${query.join('&')}`);
  }

  countOrders(): Observable<number> {
    return this.http.get<number>('/api/orders/count');
  }

  getOrder(order: Order): Observable<Order> {
    return this.http.get<Order>(`/api/order/${order._id}`);
  }

  deleteOrder(order: Order): Observable<string> {
    return this.http.delete(`/api/order/${order._id}`, { responseType: 'text' });
  }

}
