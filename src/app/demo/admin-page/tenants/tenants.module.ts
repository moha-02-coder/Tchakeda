import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TenantsComponent } from './tenants.component';
import { TenantsNewComponent } from './tenants-new.component';
import { TenantsDetailComponent } from './tenants-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Routes = [
  { path: '', component: TenantsComponent },
  { path: 'new', component: TenantsNewComponent },
  { path: ':id', component: TenantsDetailComponent }
];

@NgModule({
  declarations: [
    TenantsComponent,
    TenantsNewComponent,
    TenantsDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    TenantsComponent,
    TenantsNewComponent,
    TenantsDetailComponent
  ]
})
export class TenantsModule {}
