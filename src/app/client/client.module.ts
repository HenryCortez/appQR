import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { FormComponent } from './form/form.component';
import { PageListComponent } from './page-list/page-list.component';


@NgModule({
  declarations: [
    FormComponent,
    PageListComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
