import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import {BudgetRequest, BudgetResponseExt, BudgetResponse } from '../_models'

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: HttpClient) { }

  budget(budget: BudgetRequest) {
    return this.http.post<BudgetResponseExt>(`${environment.apiUrl}/budget`, budget);
  }

  get(id: number) {
    return this.http.get<BudgetResponseExt>(`${environment.apiUrl}/budget/${id}`);
  }

  getAll() {
    return this.http.get<BudgetResponse[]>(`${environment.apiUrl}/budget`);
  }

  beneficiary(id: number) {
    return this.http.get<BudgetResponseExt>(`${environment.apiUrl}/budget/${id}/beneficiary`);
  }
}
