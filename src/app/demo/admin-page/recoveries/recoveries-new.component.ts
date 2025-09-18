import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecoveriesService } from './recoveries.service';

@Component({
  selector: 'app-recoveries-new',
  templateUrl: './recoveries-new.component.html',
  styleUrls: ['./recoveries-new.component.scss'],
  standalone: false
})
export class RecoveriesNewComponent {
  form = {
    rentalId: 0,
    amount: 0,
    date: '',
    status: '',
    name: ''
  };
  errors: any = {};

  constructor(private recoveriesService: RecoveriesService, private router: Router) {}

  validate() {
    this.errors = {};
    if (!this.form.rentalId) this.errors.rentalId = 'Location requise';
    if (!this.form.amount || this.form.amount < 1) this.errors.amount = 'Montant requis';
    if (!this.form.date) this.errors.date = 'Date requise';
    if (!this.form.status) this.errors.status = 'Statut requis';
    if (!this.form.name) this.errors.name = 'Nom du recouvreur requis';
    return Object.keys(this.errors).length === 0;
  }

  create() {
    if (!this.validate()) return;
    this.recoveriesService.createRecovery(this.form);
    this.router.navigate(['demo/admin-page/recoveries']);
  }

  cancel() {
    this.router.navigate(['demo/admin-page/recoveries']);
  }
}
