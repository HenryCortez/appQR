import { IModule } from "src/app/shared/interfaces/module.interface";

export interface IAgency extends IModule{
    _id: number;
    name: string;
    address: string;
  }