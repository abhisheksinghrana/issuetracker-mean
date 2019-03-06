import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Issue } from './issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  apiUrl: string = '/api/issues';

  constructor(private _http: HttpClient) {}

  get() {
    return this._http.get(`${this.apiUrl}`);
  }

  getById(id: string) {
    return this._http.get(`${this.apiUrl}/${id}`);
  }

  post(issue: Issue) {
    return this._http.post(`${this.apiUrl}/add`, issue);
  }

  put(issue: Issue) {
    return this._http.put(`${this.apiUrl}/update/${issue.id}`, issue);
  }

  delete(id: string) {
    return this._http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
