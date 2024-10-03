import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { environment } from 'src/environments/environment.development';

export interface IClient {
  _id: number;
  name: string;
  lastname: string;
  email: string;
  id: string;
  maritalStatus: string;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})

export class PageListComponent {
  data: IClient[] = [
    { _id: 1, name: 'Juan', lastname: 'Perez', email: 'juan@gmail.com', id: '1234567890', maritalStatus: 'Soltero' },
    { _id: 2, name: 'Maria', lastname: 'Gomez', email: 'maria@gmail.com', id: '0987654321', maritalStatus: 'Casada' },
    { _id: 3, name: 'Alex', lastname: 'Cortez', email: 'alex@gmail.com', id: '1122334455', maritalStatus: 'Divorciado' },
    { _id: 4, name: 'Pedro', lastname: 'Perez', email: 'pedro@gmail.com', id: '2233445566', maritalStatus: 'Viudo' },
    { _id: 5, name: 'Jose', lastname: 'Gomez', email: 'jose@gmail.com', id: '3344556677', maritalStatus: 'Soltero' },
    { _id: 6, name: 'Juan', lastname: 'Perez', email: 'juan2@gmail.com', id: '4455667788', maritalStatus: 'Casado' },
    { _id: 7, name: 'Maria', lastname: 'Gomez', email: 'maria2@gmail.com', id: '5566778899', maritalStatus: 'Divorciada' },
    { _id: 8, name: 'Alex', lastname: 'Cortez', email: 'alex2@gmail.com', id: '6677889900', maritalStatus: 'Viudo' },
  ]

  metaDataColumns: MetaDataColumn[] = [
    { field: "_id", title: "ID" },
    { field: "name", title: "NOMBRE" },
    { field: "lastname", title: "APELLIDO" },
    { field: "email", title: "EMAIL" },
    { field: "id", title: "CÉDULA" },
    { field: "maritalStatus", title: "ESTADO CIVIL" }
  ]

  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ]

  records: IClient[] = [];
  totalRecords = this.data.length

  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadClients();
  }

  loadClients() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  delete(id: number) {
    const position = this.data.findIndex(ind => ind._id === id);
    if (position !== -1) {
      this.data.splice(position, 1);
      this.totalRecords = this.data.length;
      console.log(this.data);
      this.loadClients();
    }
  }

  openForm(row: IClient | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      if (!response) { return; }
      if (response._id) {
        const index = this.data.findIndex(client => client._id === response._id);
        if (index !== -1) {
          this.data[index] = response;
        }
        this.totalRecords = this.data.length;
        this.loadClients();
        this.showMessage('Registro actualizado');
      } else {
        const newclient = { ...response, _id: this.data.length + 1 };
        this.data.push(newclient);
        this.totalRecords = this.data.length;
        this.loadClients();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Clientes", "clientes", this.data);
        break;
      case 'NEW':
        this.openForm();
        break;
    }
  }

  showBottomSheet(title: string, fileName: string, data: any) {
    this.bottomSheet.open(DownloadComponent);
  }

  showMessage(message: string, duration: number = 5000) {
    this.snackBar.open(message, '', { duration });
  }

  changePage(page: number) {
    const pageSize = environment.PAGE_SIZE;
    const skip = pageSize * page;
    this.records = this.data.slice(skip, skip + pageSize);
    this.currentPage = page;
  }

  editRecord(record: any) {
    const dialogRef = this.dialog.open(FormComponent, {
      data: record
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.data.findIndex(r => r._id === result._id);

        if (index !== -1) {
          this.data[index] = result;
          console.log(this.data);
          this.loadClients();
        }

      }
    });
  }
}