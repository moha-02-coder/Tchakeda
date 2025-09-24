import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RentalsService } from './rentals.service';
import { ApartmentsService } from '../apartments/apartments.service';
import { TenantsService } from '../tenants/tenants.service';
import { OwnersService } from '../owners/owners.service';
import { BuildingsService } from '../buildings/buildings.service';

@Component({
  selector: 'app-rentals-new',
  templateUrl: './rentals-new.component.html',
  styleUrls: ['./rentals-new.component.scss'],
  standalone: false
})
export class RentalsNewComponent implements OnInit {

  // --- Formulaire ---
  form = {
    ownerId: 0,
    buildingId: 0,
    apartmentId: 0,
    tenantId: 0,
    startDate: '',
    owenerName: '',
    tenantName: '',
    apartmentName: '',
    endDate: '',
    price: 1000,
    deposit: 0
  };

  // --- Erreurs validation ---
  errors: Record<string, string> = {};

  // --- Collections principales ---
  owners: any[] = [];
  buildings: any[] = [];
  apartments: any[] = [];
  tenants: any[] = [];

  // --- Collections filtrées (en fonction des choix précédents) ---
  filteredBuildings: any[] = [];
  filteredApartments: any[] = [];

  constructor(
    private rentalsService: RentalsService,
    private router: Router,
    private apartmentsService: ApartmentsService,
    private tenantsService: TenantsService,
    private ownersService: OwnersService,
    private buildingsService: BuildingsService
  ) {}

  ngOnInit(): void {
    this.owners = this.ownersService.getOwners();
    this.buildings = this.buildingsService.getBuildings();
    this.apartments = this.apartmentsService.getApartments();
    this.tenants = this.tenantsService.getTenants();
  }

  // --- Navigation création ---
  goToNewOwner() {
    this.router.navigate(['demo/admin-page/owners/new']);
  }

  goToNewBuilding() {
    this.router.navigate(['demo/admin-page/buildings/new']);
  }

  goToNewApartment() {
    this.router.navigate(['demo/admin-page/apartments/new']);
  }

  goToNewTenant() {
    this.router.navigate(['demo/admin-page/tenants/new']);
  }

  // --- Hiérarchie ---
  onOwnerChange() {
    this.filteredBuildings = this.buildings.filter(b => b.ownerId === this.form.ownerId);
    this.form.buildingId = 0;
    this.filteredApartments = [];
    this.form.apartmentId = 0;
  }

  onBuildingChange() {
    this.filteredApartments = this.apartments.filter(a => a.buildingId === this.form.buildingId);
    this.form.apartmentId = 0;
  }

  // --- Gestion prix ---
  incrementPrice() {
    this.form.price += 1000;
  }

  decrementPrice() {
    if (this.form.price > 1000) {
      this.form.price -= 1000;
    }
  }

  // --- Validation ---
  validate(): boolean {
  this.errors = {};

  if (!this.form.ownerId) this.errors['ownerId'] = 'Propriétaire requis';
  if (!this.form.buildingId) this.errors['buildingId'] = 'Bâtiment requis';
  if (!this.form.apartmentId) this.errors['apartmentId'] = 'Appartement requis';
  if (!this.form.tenantId) this.errors['tenantId'] = 'Locataire requis';
  if (!this.form.startDate) this.errors['startDate'] = 'Date début requise';
  if (!this.form.price) this.errors['price'] = 'Mensualité requise';
  if (!this.form.price || this.form.price < 1000) this.errors['price'] = 'Prix requis (≥ 1000)';
  if (this.form.deposit < 0) this.errors['deposit'] = 'Caution invalide';

  return Object.keys(this.errors).length === 0;
  }

  // --- Création ---
  create() {
    if (!this.validate()) return;
    this.rentalsService.createRental({ ...this.form });
    this.router.navigate(['demo/admin-page/rentals']);
  }

  // --- Annuler ---
  cancel() {
    this.router.navigate(['demo/admin-page/rentals']);
  }
}
