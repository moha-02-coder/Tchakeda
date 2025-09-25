import { Component, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-apartment-form',
  templateUrl: './apartment-form.component.html',
  styleUrls: ['./apartment-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ApartmentFormComponent {
  @Input() initialData: any;
  @Output() saved = new EventEmitter<any>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef?: MatDialogRef<ApartmentFormComponent>
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      type: [data?.type || '', Validators.required],
      customType: [data?.customType || ''],
      rooms: [data?.rooms || 1, [Validators.required, Validators.min(1)]],
      buildingId: [data?.buildingId || null, Validators.required],
      tenantId: [data?.tenantId || null],
      mention: [data?.mention || 0],
      images: [data?.images || []],
      city: [data?.city || ''],
      region: [data?.region || '']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const newApartment = { id: Date.now(), ...this.form.value };
      this.saved.emit(newApartment);
      if (this.dialogRef) this.dialogRef.close(newApartment);
    }
  }

  onCancel() {
    if (this.dialogRef) this.dialogRef.close();
  }
}
