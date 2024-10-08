import { IModule } from "./module.interface";
import { IService } from "./service.interface";

export abstract class pageList{
    data: IModule[] = [];
    records: IModule[] = [];
    totalRecords = this.data.length;
    servicio!: IService;
    loadData(){
        this.servicio.getInterfaces().subscribe({
            next: (res: IModule[]) => {
              this.data = res;
              this.records = [...this.data];
              this.totalRecords = res.length;
              
            },
            error: (err) => {
              console.error(err);
            }
          });
    };

    deleteData(id: number) {
        this.servicio.deleteInterface(id.toString()).subscribe({
          next: (res) => {
            if(res)
            this.loadData();
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
   
      createData(response: any){
        if (!response)
            return; 
         this.servicio.createInterface(response).subscribe({
           next: (res) => {
             if(res)
             this.loadData();
           },
           error: (err) => {
             console.error(err);
           }
         });
      }

      updateData(result: any){
        this.servicio.updateInterface(result).subscribe({
            next: (res) => {
              if(res)
              this.loadData();
            },
            error: (err) => {
              console.error(err);
            }
          });
      }
    
}