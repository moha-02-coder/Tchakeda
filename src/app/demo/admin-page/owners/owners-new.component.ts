import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwnersService } from './owners.service';
import { BuildingsService } from '../buildings/buildings.service';
import { MatDialog } from '@angular/material/dialog';
import { BuildingFormComponent } from '../buildings/components/building-form.component';

@Component({
  selector: 'app-owners-new',
  templateUrl: './owners-new.component.html',
  styleUrls: ['./owners-new.component.scss'],
  standalone: false
})
export class OwnersNewComponent {

  // Formulaire mis à jour avec les nouveaux champs
  form = {
    fullName: '',
    email: '',
    phone: '',
    country: '',
    adress: '',
    profession: '',
    buildingId: 0
  };

  errors: any = {};
  buildings: any[] = [];

  constructor(
    private ownersService: OwnersService,
    private router: Router,
    private buildingsService: BuildingsService,
    private dialog: MatDialog
  ) {
    // Récupération des bâtiments disponibles
    this.buildings = this.buildingsService.getBuildings();
  }

  // Validation des champs
  validate() {
    this.errors = {};

    if (!this.form.fullName) this.errors.fullName = 'Nom complet requis';
    if (!this.form.email) this.errors.email = 'Email requis';
    if (!this.form.phone) this.errors.phone = 'Téléphone requis';
    if (!this.form.country) this.errors.country = 'Pays requis';
    if (!this.form.adress) this.errors.address = 'Adresse requise';

    return Object.keys(this.errors).length === 0;
  }

  // Création du propriétaire
  create() {
    if (!this.validate()) return;

    // Ajout des champs requis pour Owner
    const ownerData = {
      ...this.form,
      name: this.form.fullName,
      city: this.form.country
    };
    const newOwner = this.ownersService.createOwner(ownerData);

    // Vérifie si retour demandé vers buildings-new
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('returnTo');
    if (returnTo === 'buildings-new') {
      // On repasse les données pré-saisies via queryParams
  const prefill: Record<string, any> = {};
  Object.keys(this.form).forEach((k: string) => { prefill[k] = (this.form as any)[k]; });
      this.router.navigate(['demo/admin-page/buildings/new'], {
        queryParams: { newOwnerId: newOwner.id, ...prefill }
      });
    } else {
      this.router.navigate(['demo/admin-page/owners']);
    }
  }

  // Annuler et revenir à la liste
  cancel() {
    this.router.navigate(['demo/admin-page/owners']);
  }

  // Fonction pour créer un nouveau bâtiment (ouvre une modale)
  goToNewBuilding() {
    const dialogRef = this.dialog.open(BuildingFormComponent, {
      width: '600px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Ajoute le nouveau bâtiment à la liste et le sélectionne
        this.buildings = this.buildingsService.getBuildings();
        this.form.buildingId = result.id;
      }
    });
  }
}
