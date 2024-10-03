import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { environment } from 'src/environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface IComplaint {
  id: number;
  id_cliente: number;
  tipo: string;
  descripcion: string;
  fecha: string;
}

@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent {
  data: IComplaint[] = [
    { id: 1, id_cliente: 101, tipo: 'Queja', descripcion: 'Producto defectuoso', fecha: '2024-01-01' },
    { id: 2, id_cliente: 102, tipo: 'Reclamo', descripcion: 'Entrega tardía', fecha: '2024-01-02' },
    { id: 3, id_cliente: 103, tipo: 'Queja', descripcion: 'Atención al cliente deficiente', fecha: '2024-01-03' },
    { id: 4, id_cliente: 104, tipo: 'Reclamo', descripcion: 'Producto incorrecto', fecha: '2024-01-04' },
    { id: 5, id_cliente: 105, tipo: 'Queja', descripcion: 'Cobro indebido', fecha: '2024-01-05' },
    { id: 6, id_cliente: 106, tipo: 'Reclamo', descripcion: 'Producto dañado', fecha: '2024-01-06' },
    { id: 7, id_cliente: 107, tipo: 'Queja', descripcion: 'Falta de stock', fecha: '2024-01-07' },
    { id: 8, id_cliente: 108, tipo: 'Reclamo', descripcion: 'Servicio técnico deficiente', fecha: '2024-01-08' },
    { id: 9, id_cliente: 109, tipo: 'Queja', descripcion: 'Demora en la atención', fecha: '2024-01-09' },
    { id: 10, id_cliente: 110, tipo: 'Reclamo', descripcion: 'Producto incompleto', fecha: '2024-01-10' },
  ];

  metaDataColumns: MetaDataColumn[] = [
    { field: "id", title: "ID" },
    { field: "id_cliente", title: "ID CLIENTE" },
    { field: "tipo", title: "TIPO" },
    { field: "descripcion", title: "DESCRIPCIÓN" },
    { field: "fecha", title: "FECHA" }
  ];

  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ];

  records: IComplaint[] = [];
  totalRecords = this.data.length;
  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);

  constructor() {
    this.loadComplaints();
  }

  loadComplaints() {
    this.records = [...this.data];
    this.changePage(this.currentPage);
  }

  editRecord(row: IComplaint) {
    this.openForm(row);
  }

  delete(id: number) {
    const position = this.data.findIndex(ind => ind.id === id);
    if (position !== -1) {
      this.data.splice(position, 1);
      this.totalRecords = this.data.length;
      this.loadComplaints();
    }
  }

  openForm(row: IComplaint | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      if (!response) { return; }
      if (response.id) {
        const index = this.data.findIndex(complaint => complaint.id === response.id);
        if (index !== -1) {
          this.data[index] = response;
        }
        this.totalRecords = this.data.length;
        this.loadComplaints();
        this.showMessage('Registro actualizado');
      } else {
        const newComplaint = { ...response, id: this.data.length + 1 };
        this.data.push(newComplaint);
        this.totalRecords = this.data.length;
        this.loadComplaints();
        this.showMessage('Registro exitoso');
      }
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de Quejas", "quejas", this.data);
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