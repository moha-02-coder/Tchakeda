import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentsService } from './apartments.service';
import { BuildingsService } from '../buildings/buildings.service';

@Component({
  selector: 'app-apartments-new',
  templateUrl: './apartments-new.component.html',
  styleUrls: ['./apartments-new.component.scss'],
  standalone: false
})
export class ApartmentsNewComponent {
  form = {
    name: '',
    type: '',
    rooms: 1,
    rent: 0,
    status: 'Libre',
    buildingId: 0,
    roomImages: [] as string[]
  };
  errors: any = {};
  buildings: any[] = [];
  images: string[] = [];

  constructor(private apartmentsService: ApartmentsService, private router: Router, private buildingsService: BuildingsService) {
    this.buildings = this.buildingsService.getBuildings();
    // Sélection automatique du bâtiment créé si présent
    const urlParams = new URLSearchParams(window.location.search);
    const newBuildingId = urlParams.get('newBuildingId');
    if (newBuildingId) {
      this.form.buildingId = Number(newBuildingId);
      // Pré-remplissage des autres champs si transmis
      ['name','address','city','region','roomImages'].forEach(k => {
        const v = urlParams.get(k);
        if (v) (this.form as any)[k] = v;
      });
    }
  }

  goToNewBuilding() {
    this.router.navigate(['demo/admin-page/buildings/new'], {
      queryParams: { returnTo: 'apartments-new' }
    });
  }

  onImagesSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.errors.roomImages = 'Format d\'image non autorisé.';
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.errors.roomImages = 'La taille de l\'image doit être inférieure à 2Mo.';
        continue;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.images.length < 6) {
          this.images.push(e.target.result);
          this.form.roomImages = this.images;
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    this.form.roomImages = this.images;
  }

  validate() {
    this.errors = {};
    if (!this.form.name) this.errors.name = 'Nom requis';
    if (!this.form.type) this.errors.type = 'Type requis';
    if (!this.form.rooms || this.form.rooms < 1) this.errors.rooms = 'Nombre de pièces requis';
    if (!this.form.rent || this.form.rent < 1) this.errors.rent = 'Loyer requis';
    if (!this.form.buildingId) this.errors.buildingId = 'Bâtiment requis';
    return Object.keys(this.errors).length === 0;
  }

  create() {
    if (!this.validate()) return;
    // Pré-remplir les champs address, city, region selon le bâtiment sélectionné
    const selectedBuilding = this.buildings.find(b => b.id === this.form.buildingId);
    const apartmentData = {
      ...this.form,
      mention: String(this.form.rent),
      address: selectedBuilding ? selectedBuilding.address : '',
      city: selectedBuilding ? selectedBuilding.city : '',
      region: selectedBuilding ? selectedBuilding.region : ''
    };
    this.apartmentsService.createApartment(apartmentData);
    this.router.navigate(['demo/admin-page/apartments']);
  }

  cancel() {
    this.router.navigate(['demo/admin-page/apartments']);
  }
}
