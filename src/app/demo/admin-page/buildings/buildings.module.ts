import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BuildingsComponent } from './buildings.component';
import { BuildingsNewComponent } from './buildings-new.component';
import { BuildingsDetailComponent } from './buildings-detail.component';
import { BuildingFormComponent } from './components/building-form.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';

const routes: Routes = [
  { path: '', component: BuildingsComponent },
  { path: 'new', component: BuildingsNewComponent },
  { path: ':id', component: BuildingsDetailComponent }
];

@NgModule({
  declarations: [
    BuildingsNewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild(routes),
    BuildingsComponent,
    BuildingsDetailComponent,
    BuildingFormComponent
  ]
})
export class BuildingsModule {}
