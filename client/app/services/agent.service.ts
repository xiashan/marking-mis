import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Agent } from '../shared/models/agent.model';

@Injectable()
export class AgentService {

  constructor(private http: HttpClient) { }

  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>('/api/agents');
  }

  countAgents(): Observable<number> {
    return this.http.get<number>('/api/agents/count');
  }

  addAgent(agent: Agent): Observable<Agent> {
    return this.http.post<Agent>('/api/agent', agent);
  }

  getAgent(agent: Agent): Observable<Agent> {
    return this.http.get<Agent>(`/api/agent/${agent._id}`);
  }

  editAgent(agent: Agent): Observable<string> {
    return this.http.put(`/api/agent/${agent._id}`, agent, { responseType: 'text' });
  }

  deleteAgent(agent: Agent): Observable<string> {
    return this.http.delete(`/api/agent/${agent._id}`, { responseType: 'text' });
  }

}
