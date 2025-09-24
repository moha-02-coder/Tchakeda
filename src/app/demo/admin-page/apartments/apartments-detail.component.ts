import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApartmentsService, Apartment } from './apartments.service';
import { BuildingsService } from '../buildings/buildings.service';
import { TenantsService } from '../tenants/tenants.service';
import { RoomImagesService } from './room-images.service';

@Component({
  selector: 'app-apartments-detail',
  templateUrl: './apartments-detail.component.html',
  styleUrls: ['./apartments-detail.component.scss'],
  standalone: false
})
export class ApartmentsDetailComponent implements OnInit {
  apartmentTypes: string[] = ['résidentiel', 'commercial', 'mixte'];
  labelValidated: boolean = false;
  showRoomLabelError: boolean = false;
  // Ajout pour la description des pièces
  // (on suppose que form.roomDescriptions est un tableau de string)
  addRoomImage(event: any, roomLabel: string) {
    const files: FileList = event.target.files;
    
    // Vérifier si un fichier est sélectionné
    if (!files || files.length === 0) {
      this.showRoomLabelError = false;
      return;
    }
    
    // Vérifier si le nom de la pièce est renseigné
    if (!roomLabel || roomLabel.trim() === '') {
      this.showRoomLabelError = true;
      event.target.value = ''; // Réinitialiser l'input file
      return;
    }
    
    // Masquer l'erreur si tout est correct
    this.showRoomLabelError = false;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!this.form.images) this.form.images = [];
    if (!this.form.roomLabels) this.form.roomLabels = [];

    // Compte le nombre d'images déjà associées à ce label
    const currentCount = this.form.roomLabels.filter((l: string) => l === roomLabel).length;
    const maxToAdd = Math.max(0, 4 - currentCount);
    let added = 0;

    Array.from(files).forEach(file => {
      if (added >= maxToAdd) return;
      if (!validTypes.includes(file.type)) return;
      if (file.size > 2 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Vérifie à nouveau le nombre d'images pour ce label
        const countNow = this.form.roomLabels.filter((l: string) => l === roomLabel).length;
        if (countNow < 4) {
          this.form.images.push(e.target.result);
          this.form.roomLabels.push(roomLabel);
          if (this.apartment && this.apartment.id) {
            this.apartmentsService.addRoomImage(this.apartment.id, e.target.result, roomLabel);
          }
          added++;
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
    this.newRoomLabel = '';
  }
  newRoomLabel: string = '';
  roomLabels: string[] = [];

  onRoomLabelInput() {
    // Masquer l'erreur dès que l'utilisateur commence à taper
    if (this.showRoomLabelError && this.newRoomLabel.trim() !== '') {
      this.showRoomLabelError = false;
    }
  }


  showDeleteConfirm = false;
  currentRental: any = null;
  rentalHistory: any[] = [];

  goToNewBuilding() {
    this.router.navigate(['/demo/admin-page/buildings/new']);
  }

  goToNewTenant() {
    this.router.navigate(['/demo/admin-page/tenants/new']);
  }
  onBuildingImageSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!this.form.images) this.form.images = [];
    Array.from(files).forEach(file => {
      if (!validTypes.includes(file.type)) return;
      if (file.size > 2 * 1024 * 1024) return;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.form.images.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = '';
  }
  getTenantName(tenantId: number | undefined): string {
    if (!tenantId) return '';
    const tenant = this.tenants.find(t => t.id === tenantId);
    return tenant ? tenant.fullName : '';
  }
  apartment: Apartment | undefined;
      deleteApartment(): void {
        if (!this.apartment || !this.apartment.id) return;
        this.apartmentsService.deleteApartment(this.apartment.id);
        if (this.router) {
          this.router.navigate(['demo/admin-page/apartments']);
        }
      }
  editMode = false;
  form: any = {};
  errors: any = {};
  buildings: any[] = [];
  tenants: any[] = [];
  isCustomType = false;
  mentionOptions = [0, 10000, 20000, 30000, 40000, 50000];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apartmentsService: ApartmentsService,
  private buildingsService: BuildingsService,
  private tenantsService: TenantsService,
  private roomImagesService: RoomImagesService
  ) {
    this.buildings = this.buildingsService.getBuildings();
    this.tenants = this.tenantsService.getTenants ? this.tenantsService.getTenants() : [];
  }

  onTypeChange(event: any) {
  this.isCustomType = event.target.value === 'autre';
  if (!this.isCustomType) this.form.customType = '';
  }

  incrementMention() {
    if (!this.form.mention) this.form.mention = 0;
    this.form.mention += 1000;
  }
  decrementMention() {
    if (!this.form) return;
    if (!this.form.mention) this.form.mention = 0;
    if (this.form.mention > 0) this.form.mention -= 1000;
  }
  buildingName(buildingId: number): string {
    const b = this.buildings.find(b => b.id === buildingId);
    return b ? b.name : '';
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apartment = this.apartmentsService.getApartmentById(id);
    if (this.apartment) {
      this.form = { ...this.apartment };
      if (!this.form.images) this.form.images = [];
      if (!this.form.roomLabels) this.form.roomLabels = [];
      if (!this.form.roomDescriptions) this.form.roomDescriptions = [];
      // Synchronise la taille de roomDescriptions avec images
      while (this.form.roomDescriptions.length < this.form.images.length) {
        this.form.roomDescriptions.push('');
      }
      while (this.form.roomDescriptions.length > this.form.images.length) {
        this.form.roomDescriptions.pop();
      }
      // Si tenantId n'existe pas mais tenant existe, tente de retrouver l'id
      if (!this.form.tenantId && this.form.tenant) {
        const found = this.tenants.find(t => t.fullName === this.form.tenant);
        if (found) this.form.tenantId = found.id;
      }
    }
  }

  enableEdit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.form = { ...this.apartment };
    this.errors = {};
    // Redirige vers la page de détail de l'appartement
    if (this.apartment && this.apartment.id) {
      this.router.navigate([`/demo/admin-page/apartments/${this.apartment.id}`]);
    }
  }

  validate() {
    this.errors = {};
    if (!this.form.name) this.errors.name = 'Nom requis';
    if (!this.form.address) this.errors.address = 'Adresse requise';
    if (!this.form.city) this.errors.city = 'Ville requise';
    if (!this.form.region) this.errors.region = 'Région requise';
    if (!this.form.buildingId) this.errors.buildingId = 'Bâtiment requis';
    return Object.keys(this.errors).length === 0;
  }


  save() {
    if (!this.validate()) return;
    // Gestion du type personnalisé
    if (this.isCustomType && this.form.customType && this.form.customType.trim() !== '') {
      // Ajoute le type personnalisé à la liste s'il n'existe pas déjà
      const custom = this.form.customType.trim();
      if (!this.apartmentTypes.includes(custom)) {
        this.apartmentTypes.push(custom);
      }
      this.form.type = custom;
    }
    // Stocke le nom du locataire en plus de l'id
    if (this.form.tenantId) {
      const tenant = this.tenants.find(t => t.id === this.form.tenantId);
      this.form.tenant = tenant ? tenant.fullName : '';
    } else {
      this.form.tenant = '';
    }
    this.apartmentsService.updateApartment(this.form);
    this.apartment = { ...this.form };
    this.editMode = false;
  }

  addCustomType() {
    if (this.form.customType && this.form.customType.trim() !== '') {
      const custom = this.form.customType.trim();
      if (!this.apartmentTypes.includes(custom)) {
        this.apartmentTypes.push(custom);
      }
    }
  }

  back() {
    this.router.navigate(['demo/admin-page/apartments']);
  }

  /**
   * Retourne l'image appropriée pour un type de pièce donné
   */
  getRoomImage(roomLabel: string): string {
    if (!roomLabel) return this.roomImagesService.getDefaultRoomImage();
    return this.roomImagesService.getRoomImage(roomLabel);
  }

  /**
   * Retourne l'image par défaut pour l'appartement
   */
  getDefaultApartmentImage(): string {
    return this.roomImagesService.getDefaultApartmentImage();
  }

  /**
   * Vérifie si une image est une image par défaut
   */
  isDefaultImage(imagePath: string): boolean {
    return this.roomImagesService.isDefaultImage(imagePath);
  }

  /**
   * Retourne l'image à afficher pour une pièce (image uploadée ou image par défaut)
   */
  getDisplayImage(imagePath: string, roomLabel: string): string {
    // Si l'image existe et n'est pas corrompue, l'utiliser
    if (imagePath && !this.isDefaultImage(imagePath)) {
      return imagePath;
    }
    // Sinon, utiliser l'image par défaut pour ce type de pièce
    return this.getRoomImage(roomLabel);
  }
}
