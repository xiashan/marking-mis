import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Topic } from '../shared/models/topic.model';

@Injectable()
export class TopicService {

  constructor(private http: HttpClient) { }

  getTopics(param = {}): Observable<Topic[]> {
    const query = [];
    Object.keys(param).forEach((key) => {
      if (param[key] !== '' && param[key] !== null) {
        query.push(`${key}=${encodeURIComponent(param[key])}`);
      }
    });
    return this.http.get<Topic[]>(`/api/topics?${query.join('&')}`);
  }

  countTopics(): Observable<number> {
    return this.http.get<number>('/api/topics/count');
  }

  addTopic(topic: Topic): Observable<Topic> {
    return this.http.post<Topic>('/api/topic', topic);
  }

  getTopic(topic: Topic): Observable<Topic> {
    return this.http.get<Topic>(`/api/topic/${topic._id}`);
  }

  editTopic(topic: Topic): Observable<string> {
    return this.http.put(`/api/topic/${topic._id}`, topic, { responseType: 'text' });
  }

  deleteTopic(topic: Topic): Observable<string> {
    return this.http.delete(`/api/topic/${topic._id}`, { responseType: 'text' });
  }

  importMembers(topic: Topic): Observable<any> {
    return this.http.put(`/api/topic/import/${topic._id}`, topic);
  }

  genOrder(topics: Topic[]): Observable<string> {
    const topicId = topics.filter(item => item.selected).map(item => item._id);
    return this.http.post('/api/order', { topicId: topicId }, { responseType: 'text' });
  }

}
