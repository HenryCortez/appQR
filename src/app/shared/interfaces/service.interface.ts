import { Observable } from "rxjs";
import { IModule } from "./module.interface";

export interface IService {
    getInterfaces(): Observable<IModule[]>;
    getInterface(id: string): Observable<IModule>;
    createInterface(module: IModule) : Observable<IModule>; 
    updateInterface(module: IModule) : Observable<IModule>; 
    deleteInterface(id: string): Observable<IModule>;
  }