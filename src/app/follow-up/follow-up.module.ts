import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FollowUpRoutingModule } from './follow-up-routing.module';
import { FormComponent } from './form/form.component';
import { PageListComponent } from './page-list/page-list.component';


@NgModule({
  declarations: [
    FormComponent,
    PageListComponent
  ],
  imports: [
    CommonModule,
    FollowUpRoutingModule
  ]
})
export class FollowUpModule { }
