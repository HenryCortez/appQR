import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IAgency } from '../interfaces/agency.interface';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  apiUrl = `${environment.API_URL}/agencies`;
  http = inject(HttpClient);
  constructor() { }
  getAngencies() : Observable<IAgency[]> {
    return this.http.get<IAgency[]>(this.apiUrl);
  }

  //obtener una agencia
  getAgency(id: string): Observable<IAgency> {
    return this.http.get<IAgency>(`${this.apiUrl}/${id}`);
  }

  //crear una agencia
  createAgency(agency: IAgency): Observable<IAgency> {
    return this.http.post<IAgency>(this.apiUrl, agency);
  }
  
}
