import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CollectorsService } from './collectors.service';
import { BuildingsService, Building } from '../buildings/buildings.service';
import { ApartmentsService, Apartment } from '../apartments/apartments.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collectors-new',
  templateUrl: './collectors-new.component.html',
  styleUrls: ['./collectors-new.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CollectorsNewComponent {

  form = {
    fullName: '',
    country: '',
    address: '',
    buildingId: null,
    apartmentIds: [] as number[],
    phone: '',
    email: ''
  };
  isSubmitting = false;
  errors: any = {};
  buildings: Building[] = [];
  apartments: Apartment[] = [];
  filteredApartments: Apartment[] = [];

  constructor(
    private collectorsService: CollectorsService,
    private router: Router,
    private buildingsService: BuildingsService,
    private apartmentsService: ApartmentsService
  ) {
    this.buildings = this.buildingsService.getBuildings();
    this.apartments = this.apartmentsService.getApartments();
  }

  onBuildingChange() {
    this.filteredApartments = this.apartments.filter(a => a.buildingId === Number(this.form.buildingId));
    this.form.apartmentIds = [];
  }

  validate() {
    this.errors = {};
    if (!this.form.fullName) this.errors.fullName = 'Nom requis';
    if (!this.form.country) this.errors.country = 'Pays requis';
    if (!this.form.address) this.errors.address = 'Adresse requise';
    if (!this.form.buildingId) this.errors.buildingId = 'Bâtiment requis';
  if (!this.form.apartmentIds || this.form.apartmentIds.length === 0) this.errors.apartmentId = 'Sélectionnez au moins une propriété';
    if (!this.form.phone) this.errors.phone = 'Téléphone requis';
    if (!this.form.email) this.errors.email = 'Email requis';
    return Object.keys(this.errors).length === 0;
  }

  create() {
    if (!this.validate()) return;
    this.isSubmitting = true;
    this.collectorsService.createCollector({
      ...this.form,
      houseCount: this.form.apartmentIds.length
    });
  alert('Recouvreur créé avec succès !');
  this.router.navigate(['/demo/admin-page/collectors']);
  }

  cancel() {
  this.router.navigate(['/demo/admin-page/collectors']);
  }
}
