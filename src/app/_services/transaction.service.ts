import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { TransactionRequest } from '../_models'

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  transaction(transaction: TransactionRequest) {
    return this.http.post(`${environment.apiUrl}/transaction`, transaction);
  }

  get(id: number) {
    return this.http.get(`${environment.apiUrl}/transaction/${id}`);
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/transaction`);
  }
}
