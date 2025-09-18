import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OwnersComponent } from './owners.component';
import { OwnersNewComponent } from './owners-new.component';
import { OwnersDetailComponent } from './owners-detail.component';
import { OwnersPaymentsComponent } from './owners-payments.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Routes = [
  { path: '', component: OwnersComponent },
  { path: 'new', component: OwnersNewComponent },
  { path: 'payments', component: OwnersPaymentsComponent },
  { path: ':id', component: OwnersDetailComponent }
];

@NgModule({
  declarations: [
    OwnersComponent,
    OwnersNewComponent,
    OwnersDetailComponent,
    OwnersPaymentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    CurrencyPipe
  ],
  exports: [
    OwnersComponent,
    OwnersNewComponent,
    OwnersDetailComponent,
    OwnersPaymentsComponent
  ]
})
export class OwnersModule {}
