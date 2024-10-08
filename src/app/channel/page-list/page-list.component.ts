import { Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeypadButton } from 'src/app/shared/interfaces/keypad.interface';
import { MetaDataColumn } from 'src/app/shared/interfaces/metacolumn.interface';
import { FormComponent } from '../form/form.component';
import { DownloadComponent } from 'src/app/shared/download/download.component';
import { environment } from 'src/environments/environment.development';
import { IChannel } from '../interfaces/channel.interface';
import { ChannelService } from '../services/channel.service';
import { pageList } from 'src/app/shared/interfaces/page-list.interface';


@Component({
  selector: 'qr-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent extends pageList{

  metaDataColumns: MetaDataColumn[] = [
    { field: "id", title: "ID" },
    { field: "name", title: "NOMBRE" },
    { field: "descripcion", title: "DESCRIPCIÓN" }
  ];
  keypadButtons: KeypadButton[] = [
    { icon: "cloud_download", tooltip: "EXPORTAR", color: "accent", action: "DOWNLOAD" },
    { icon: "add", tooltip: "AGREGAR", color: "primary", action: "NEW" }
  ];

  currentPage = 0;

  bottomSheet = inject(MatBottomSheet);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  channelsrv = inject(ChannelService)
  constructor() {
    super();
    this.servicio = inject(ChannelService);
    this.loadChannels();
    
  }
  
  loadChannels() {
    this.loadData();
    this.changePage(this.currentPage);
  }

  delete(id: number) {
    this.deleteData(id);
  }

  openForm(row: IChannel | null = null) {
    const options = {
      panelClass: 'panel-container',
      disableClose: true,
      data: row
    };
    const reference: MatDialogRef<FormComponent> = this.dialog.open(FormComponent, options);

    reference.afterClosed().subscribe((response) => {
      this.createData(response);
    });
  }

  doAction(action: string) {
    switch (action) {
      case 'DOWNLOAD':
        this.showBottomSheet("Lista de canales", "canales", this.data);
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
      this.updateData(result);
    });
  }
}
