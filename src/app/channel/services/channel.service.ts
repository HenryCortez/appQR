import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { IChannel } from '../interfaces/channel.interface';
import { IService } from 'src/app/shared/interfaces/service.interface';
import { IModule } from 'src/app/shared/interfaces/module.interface';

@Injectable({
  providedIn: 'root'
})
export class ChannelService implements IService{
  apiUrl = `${environment.API_URL}/channel`;
  http = inject(HttpClient);
  constructor() { }
  getInterface(id: string): Observable<IModule> {
    return this.http.get<IChannel>(`${this.apiUrl}/${id}`)
  }

  getInterfaces() : Observable<IChannel[]>{
    return this.http.get<IChannel[]>(this.apiUrl)
  }

    //crear una agencia
    createInterface(channel: IChannel): Observable<IChannel> {
      return this.http.post<IChannel>(this.apiUrl, channel);
    }
  
    //actualizar una agencia
    updateInterface(channel: IChannel): Observable<IChannel> {
      return this.http.put<IChannel>(`${this.apiUrl}/${channel._id}`, channel);
    }
  
    //eliminar una agencia
    deleteInterface(id: string): Observable<IChannel> {
      return this.http.delete<IChannel>(`${this.apiUrl}/${id}`);
    }
}
