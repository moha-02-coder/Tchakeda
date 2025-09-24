import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApartmentsComponent } from './apartments.component';
import { ApartmentsNewComponent } from './apartments-new.component';
import { ApartmentsDetailComponent } from './apartments-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Routes = [
  { path: '', component: ApartmentsComponent },
  { path: 'new', component: ApartmentsNewComponent },
  { path: ':id', component: ApartmentsDetailComponent }
];

@NgModule({
  declarations: [
    ApartmentsComponent,
    ApartmentsNewComponent,
    ApartmentsDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    ApartmentsComponent,
    ApartmentsNewComponent,
    ApartmentsDetailComponent
  ]
})
export class ApartmentsModule {}
