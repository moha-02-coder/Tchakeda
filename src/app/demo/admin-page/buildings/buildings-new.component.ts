import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuildingsService } from './buildings.service';
import { OwnersService } from '../owners/owners.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buildings-new',
  templateUrl: './buildings-new.component.html',
  styleUrls: ['./buildings-new.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BuildingsNewComponent {
  form: {
    name: string;
    type: string;
    customType: string;
    floors: number;
    apartments: number;
    address: string;
    city: string;
    region: string;
    constructionDate: string;
    ownerId: number | null;
    [key: string]: any;
  } = {
    name: '',
    type: '',
    customType: '',
    floors: 1,
    apartments: 1,
    address: '',
    city: '',
    region: '',
    constructionDate: '',
    ownerId: null
  };

  errors: any = {};
  owners: any[] = [];
  isCustomType = false;

  constructor(
    private buildingsService: BuildingsService,
    private ownersService: OwnersService,
    private router: Router
  ) {
    this.owners = this.ownersService.getOwners();
    // Sélection automatique du propriétaire créé si présent
    const urlParams = new URLSearchParams(window.location.search);
    const newOwnerId = urlParams.get('newOwnerId');
    if (newOwnerId) {
      this.form.ownerId = Number(newOwnerId);
      // Pré-remplissage des autres champs si transmis
      ['fullName','email','phone','country','adress','profession','buildingId'].forEach(k => {
        const v = urlParams.get(k);
        if (v) (this.form as any)[k] = v;
      });
    }
  }

  onTypeChange(event: any) {
    this.isCustomType = event.target.value === 'autre';
    if (!this.isCustomType) this.form.customType = '';
  }

  validate() {
    this.errors = {};
  if (!this.form.name) this.errors.name = 'Nom du bâtiment requis';
  if (!this.form.type) this.errors.type = 'Type de bâtiment requis';
  if (this.isCustomType && !this.form.customType) this.errors.customType = 'Veuillez saisir un type';
  if (!this.form.floors || this.form.floors < 1) this.errors.floors = 'Nombre d\'étages requis';
  if (!this.form.apartments || this.form.apartments < 1) this.errors.apartments = 'Nombre d\'appartements requis';
  if (!this.form.address) this.errors.address = 'Adresse requise';
  if (!this.form.city) this.errors.city = 'Ville requise';
  if (!this.form.region) this.errors.region = 'Région requise';
  if (!this.form.constructionDate) this.errors.constructionDate = 'Date de construction requise';
  if (!this.form.ownerId) this.errors.ownerId = 'Propriétaire requis';
    return Object.keys(this.errors).length === 0;
  }

  create() {
    if (!this.validate()) return;

    if (this.isCustomType) {
      this.form.type = this.form.customType; // utiliser le type personnalisé
    }

    const newBuilding = this.buildingsService.createBuilding(this.form); // créer le bâtiment

    // Vérifie si retour demandé vers apartments-new
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo');
    if (returnTo === 'apartments-new') {
      this.router.navigate(['demo/admin-page/apartments/new'], {
        queryParams: { newBuildingId: newBuilding.id }
      });
    } else {
      this.router.navigate(['demo/admin-page/buildings']);
    }
  }

  cancel() {
    this.router.navigate(['demo/admin-page/buildings']);
  }

  goToNewOwner() {
    this.router.navigate(['demo/admin-page/owners/new'], {
      queryParams: { returnTo: 'buildings-new', ...this.form }
    });
  }
}
