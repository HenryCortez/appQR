import { IModule } from "src/app/shared/interfaces/module.interface";

export interface IChannel extends IModule{
    _id: number; 
    name: string;
    descripcion: string; 
  }