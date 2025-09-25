import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentsService } from './apartments.service';
import { BuildingsService } from '../buildings/buildings.service';
import { RoomImagesService } from './room-images.service';
import { MatDialog } from '@angular/material/dialog';
import { BuildingFormComponent } from '../buildings/components/building-form.component';

@Component({
  selector: 'app-apartments-new',
  templateUrl: './apartments-new.component.html',
  styleUrls: ['./apartments-new.component.scss'],
  standalone: false
})
export class ApartmentsNewComponent {
  // Pour compatibilité template (ajout d'image pièce)
  isAddingRoom = false;
  tempRoomLabel: string = '';
  newRoomLabel: string = '';
  newRoomImage: string = '';
  newRoomDescription: string = '';
  isSubmitting = false;

  changeRoomImage(i: number) {}
  removeRoomImage(i: number) {
    if (this.images && this.images.length > i) {
      this.images.splice(i, 1);
      if (this.roomLabels) this.roomLabels.splice(i, 1);
      if (this.roomDescriptions) this.roomDescriptions.splice(i, 1);
    }
  }
  startAddingRoom() { this.isAddingRoom = true; }
  cancelAddingRoom() { this.isAddingRoom = false; this.tempRoomLabel = ''; this.newRoomLabel = ''; this.newRoomImage = ''; this.newRoomDescription = ''; }
  validateNewRoomLabel() {}
  confirmAddRoom() {}
  onNewImageSelected(event: any) {}
  backToNameStep() {}
  apartmentTypes: string[] = ['Studio', 'T2', 'T3', 'T4', 'Duplex', 'Villa', 'Hôtel'];
  isCustomType = false;
  customType = '';
  form = {
  name: '',
  type: '',
  customType: '',
  rooms: 1,
  rent: 0,
  status: 'Libre',
  buildingId: 0,
  roomImages: [] as string[],
  description: ''
  };
  errors: any = {};
  buildings: any[] = [];
  images: string[] = [];
  roomLabels: string[] = [];
  roomDescriptions: string[] = [];
  availableRoomTypes: Array<{label: string, image: string}> = [];

  constructor(
    private apartmentsService: ApartmentsService,
    private router: Router,
    private buildingsService: BuildingsService,
    private roomImagesService: RoomImagesService,
    private dialog: MatDialog
  ) {
    this.buildings = this.buildingsService.getBuildings();
    this.availableRoomTypes = this.roomImagesService.getAvailableRoomTypes();
    // Sélection automatique du bâtiment créé si présent
    const urlParams = new URLSearchParams(window.location.search);
    const newBuildingId = urlParams.get('newBuildingId');
    if (newBuildingId) {
      this.form.buildingId = Number(newBuildingId);
      ['name','address','city','region','roomImages'].forEach(k => {
        const v = urlParams.get(k);
        if (v) (this.form as any)[k] = v;
      });
    }
  }

  openBuildingDialog() {
    const dialogRef = this.dialog.open(BuildingFormComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Ajoute le bâtiment à la liste et sélectionne automatiquement
        this.buildings.push(result);
        this.form.buildingId = result.id;
      }
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
          // Synchronise roomLabels et roomDescriptions avec le nombre d'images
          while (this.roomLabels.length < this.images.length) this.roomLabels.push('');
          while (this.roomDescriptions.length < this.images.length) this.roomDescriptions.push('');
          this.form.roomImages = this.images;
        }
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    this.roomLabels.splice(index, 1);
    this.roomDescriptions.splice(index, 1);
    this.form.roomImages = this.images;
  }

  validate() {
    this.errors = {};
    if (!this.form.name) this.errors.name = 'Nom requis';
  if (!this.form.type || (this.form.type === 'autre' && !this.customType)) this.errors.type = 'Type requis';
    if (!this.form.rooms || this.form.rooms < 1) this.errors.rooms = 'Nombre de pièces requis';
    if (!this.form.rent || this.form.rent < 1) this.errors.rent = 'Loyer requis';
    if (!this.form.buildingId) this.errors.buildingId = 'Bâtiment requis';
    return Object.keys(this.errors).length === 0;
  }

  create() {
    if (!this.validate()) return;
    // Gestion du type personnalisé
    let typeToSave = this.form.type;
    if (this.form.type === 'autre' && this.customType && this.customType.trim() !== '') {
      typeToSave = this.customType.trim();
      if (!this.apartmentTypes.includes(typeToSave)) {
        this.apartmentTypes.push(typeToSave);
      }
    }
    // Pré-remplir les champs address, city, region selon le bâtiment sélectionné
    const selectedBuilding = this.buildings.find(b => b.id === this.form.buildingId);
    const apartmentData = {
      ...this.form,
      type: typeToSave,
      mention: String(this.form.rent),
      address: selectedBuilding ? selectedBuilding.address : '',
      city: selectedBuilding ? selectedBuilding.city : '',
      region: selectedBuilding ? selectedBuilding.region : '',
      images: this.images.length > 0 ? this.images : [this.roomImagesService.getDefaultApartmentImage()],
      roomLabels: this.roomLabels.length > 0 ? this.roomLabels : []
    };
    this.apartmentsService.createApartment(apartmentData);
    this.router.navigate(['demo/admin-page/apartments']);
  }

  cancel() {
    this.router.navigate(['demo/admin-page/apartments']);
  }

  /**
   * Retourne l'image appropriée pour un type de pièce donné
   */
  getRoomImage(roomLabel: string): string {
    return this.roomImagesService.getRoomImage(roomLabel);
  }

  /**
   * Retourne l'image par défaut pour l'appartement
   */
  getDefaultApartmentImage(): string {
    return this.roomImagesService.getDefaultApartmentImage();
  }

  /**
   * Retourne l'image à afficher pour une pièce
   */
  getDisplayImage(imagePath: string, roomLabel: string): string {
    if (imagePath && !this.roomImagesService.isDefaultImage(imagePath)) {
      return imagePath;
    }
    return this.getRoomImage(roomLabel);
  }
}
