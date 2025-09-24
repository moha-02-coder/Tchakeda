import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuildingsComponent } from './buildings.component';
import { BuildingsNewComponent } from './buildings-new.component';
import { BuildingsDetailComponent } from './buildings-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Routes = [
  { path: '', component: BuildingsComponent },
  { path: 'new', component: BuildingsNewComponent },
  { path: ':id', component: BuildingsDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild(routes),
    BuildingsComponent,
    BuildingsNewComponent,
    BuildingsDetailComponent
  ]
})
export class BuildingsModule {}
