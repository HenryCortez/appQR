import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IAgency } from '../interfaces/agency.interface';
import { HttpClient } from '@angular/common/http';
import { IService } from 'src/app/shared/interfaces/service.interface';

@Injectable({
  providedIn: 'root'
})
export class AgencyService implements IService{
  apiUrl = `${environment.API_URL}/agencies`;
  http = inject(HttpClient);
  constructor() { }
  getInterfaces(): Observable<IAgency[]> {
    return this.http.get<IAgency[]>(this.apiUrl);
  }
  getInterface(id: string): Observable<IAgency> {
    return this.http.get<IAgency>(`${this.apiUrl}/${id}`);
  }
  createInterface(agency: IAgency): Observable<IAgency> {
    return this.http.post<IAgency>(this.apiUrl, agency);
  }
  updateInterface(agency: IAgency): Observable<IAgency> {
    return this.http.put<IAgency>(`${this.apiUrl}/${agency._id}`, agency);
  }
  deleteInterface(id: string): Observable<IAgency> {
    return this.http.delete<IAgency>(`${this.apiUrl}/${id}`);
  }
 

}
