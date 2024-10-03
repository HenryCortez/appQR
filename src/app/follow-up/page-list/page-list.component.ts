import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { environment } from 'src/environments/environment.development';

export interface ITracking {
  id_followup: number;
  id_qr: number;
  status: string;
  id_employee: number;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent {
  data: ITracking[] = [
    { id_followup: 1, id_qr: 101, status: 'activo', id_employee: 201 },
    { id_followup: 2, id_qr: 102, status: 'inactivo', id_employee: 202 },
    { id_followup: 3, id_qr: 103, status: 'activo', id_employee: 203 },
    { id_followup: 4, id_qr: 104, status: 'inactivo', id_employee: 204 },
    { id_followup: 5, id_qr: 105, status: 'activo', id_employee: 205 },
    { id_followup: 6, id_qr: 106, status: 'activo', id_employee: 206 },
    { id_followup: 7, id_qr: 107, status: 'inactivo', id_employee: 207 },
    { id_followup: 8, id_qr: 108, status: 'activo', id_employee: 208 },
    { id_followup: 9, id_qr: 109, status: 'inactivo', id_employee: 209 },
    { id_followup: 10, id_qr: 110, status: 'activo', id_employee: 210 },
  ];

  metaDataColumns: MetaDataColumn[] = [
    { field: "id_followup", title: "ID" },
    { field: "id_qr", title: "ID QR" },
    { field: "status", title: "ESTADO" },
    { field: "id_employee", title: "ID EMPLEADO" }
  ];

  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ];

  records: ITracking[] = [];
  totalRecords = this.data.length;
  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadRecords();
  }

  loadRecords() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  editRecord(row: ITracking) {
    this.openForm(row);
  }

  delete(id_followup: number) {
    const position = this.data.findIndex(ind => ind.id_followup === id_followup);
    if (position !== -1) {
      this.data.splice(position, 1);
      this.totalRecords = this.data.length;
      this.loadRecords();
      this.showMessage('Registro eliminado');
    }
  }

  openForm(row: ITracking | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      if (!response) { return; }

      if (!row) {
        // Crear un nuevo registro con un ID único basado en el valor más alto de la lista
        const newId = this.data.length > 0 ? Math.max(...this.data.map(item => item.id_followup)) + 1 : 1;
        const newTracking = { id_followup: newId, ...response };
        this.data.push(newTracking);
        this.totalRecords = this.data.length;
        this.loadRecords();
        this.showMessage('Registro exitoso');
      } else {
        // Editar el registro existente
        const index = this.data.findIndex(track => track.id_followup === row.id_followup);
        if (index !== -1) {
          this.data[index] = { ...row, ...response };
          this.totalRecords = this.data.length;
          this.loadRecords();
          this.showMessage('Registro actualizado');
        }
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Seguimientos", "seguimientos", this.data);
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