import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApartmentsService, Apartment } from './apartments.service';
import { BuildingsService } from '../buildings/buildings.service';
import { TenantsService } from '../tenants/tenants.service';

@Component({
  selector: 'app-apartments-detail',
  templateUrl: './apartments-detail.component.html',
  styleUrls: ['./apartments-detail.component.scss'],
  standalone: false
})
export class ApartmentsDetailComponent implements OnInit {
  labelValidated: boolean = false;
  addRoomImage(event: any, roomLabel: string) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0 || !roomLabel) return;
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
  private tenantsService: TenantsService
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

  back() {
    this.router.navigate(['demo/admin-page/apartments']);
  }
}
