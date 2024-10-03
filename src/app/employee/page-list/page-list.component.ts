import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { environment } from 'src/environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IEmployee {
  id: number;
  name: string;
  position: string;
  maritalStatus: string;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent {
  data: IEmployee[] = [
    { id: 1, name: 'Carlos Ruiz', position: 'Manager', maritalStatus: 'Single' },
    { id: 2, name: 'Lucia Fernandez', position: 'Assistant', maritalStatus: 'Married' },
    { id: 3, name: 'Pedro Martinez', position: 'Developer', maritalStatus: 'Divorced' },
    { id: 4, name: 'Laura Sanchez', position: 'Designer', maritalStatus: 'Widowed' },
    { id: 5, name: 'Jorge Ramirez', position: 'Analyst', maritalStatus: 'Single' },
    { id: 6, name: 'Marta Diaz', position: 'Tester', maritalStatus: 'Married' },
    { id: 7, name: 'Fernando Torres', position: 'Director', maritalStatus: 'Divorced' },
    { id: 8, name: 'Isabel Romero', position: 'HR', maritalStatus: 'Widowed' },
    { id: 9, name: 'Alberto Castro', position: 'Marketing', maritalStatus: 'Single' },
    { id: 10, name: 'Patricia Rivas', position: 'Finance', maritalStatus: 'Married' },
  ];
  
  metaDataColumns: MetaDataColumn[] = [
    { field: "id", title: "ID" },
    { field: "name", title: "NOMBRE" },
    { field: "position", title: "CARGO" },
    { field: "maritalStatus", title: "ESTADO CIVIL" }
  ];
  
  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ];
  
  records: IEmployee[] = [];
  totalRecords = this.data.length;
  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  editRecord(row: IEmployee) {
    this.openForm(row);
  }

  delete(id: number) {
    const position = this.data.findIndex(ind => ind.id === id);
    if (position !== -1) {
      this.data.splice(position, 1);
      this.totalRecords = this.data.length;
      this.loadEmployees();
    }
  }

  openForm(row: IEmployee | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      if (!response) { return; }
      if (response.id) {
        const index = this.data.findIndex(employee => employee.id === response.id);
        if (index !== -1) {
          this.data[index] = response;
        }
        this.totalRecords = this.data.length;
        this.loadEmployees();
        this.showMessage('Registro actualizado');
      } else {
        const newEmployee = { ...response, id: this.data.length + 1 };
        this.data.push(newEmployee);
        this.totalRecords = this.data.length;
        this.loadEmployees();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Empleados", "empleados", this.data);
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
}