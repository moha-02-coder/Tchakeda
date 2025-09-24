import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RentalsService, Rental } from './rentals.service';
import { ApartmentsService, Apartment } from '../apartments/apartments.service';
import { TenantsService, Tenant } from '../tenants/tenants.service';

@Component({
  selector: 'app-rentals-detail',
  templateUrl: './rentals-detail.component.html',
  styleUrls: ['./rentals-detail.component.scss'],
  standalone: false
})
export class RentalsDetailComponent implements OnInit {
  // ...existing code...
  showAddApartmentModal = false;
  showAddTenantModal = false;
  newApartmentName = '';
  newTenantName = '';

  addApartment() {
    if (!this.newApartmentName.trim()) return;
    // Minimal mock: add to apartments list
    const newId = Date.now();
    this.apartments.push({
      id: newId,
      name: this.newApartmentName,
      address: '',
      city: '',
      region: '',
      buildingId: 0,
      createdAt: new Date().toISOString()
    });
    this.form.apartmentId = newId;
    this.newApartmentName = '';
    this.showAddApartmentModal = false;
  }

  addTenant() {
    if (!this.newTenantName.trim()) return;
    // Minimal mock: add to tenants list
    const newId = Date.now();
    this.tenants.push({
      id: newId,
      fullName: this.newTenantName,
      email: '',
      phone: '',
      city: '',
      registeredAt: new Date().toISOString()
    });
    this.form.tenantId = newId;
    this.newTenantName = '';
    this.showAddTenantModal = false;
  }
  showContractModal: boolean = false;
  // Trigger file input for contract upload
  triggerContractUpload() {
    const input = document.querySelector<HTMLInputElement>('input[type=file][accept="image/*,.pdf"]');
    if (input) input.click();
  }
  rental: Rental | undefined;
  editMode = false;
  form: any = {};
  errors: any = {};
  apartments: Apartment[] = [];
  tenants: Tenant[] = [];
  showDeleteConfirm = false;
  filterApartmentId: number | null = null;
  filterTenantId: number | null = null;
  filteredRentals: Rental[] = [];
  showLinkedApartments = false;
    paymentHistory: any[] = [];
   // Mock contract image for demo
   contractImage: string | null = null;
   selectedPeriod: string = '';
   paymentPeriods: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rentalsService: RentalsService,
    private apartmentsService: ApartmentsService,
    private tenantsService: TenantsService
  ) {
    this.apartments = this.apartmentsService.getApartments();
    this.tenants = this.tenantsService.getTenants();
  }

  goToNewApartment() {
   this.router.navigate(['demo/admin-page/apartments/new']);
  }

  goToNewTenant() {
   this.router.navigate(['demo/admin-page/tenants/new']);
  }
  // Handle contract upload
  onContractSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Format de contrat non autorisé.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier doit être inférieur à 5Mo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.contractImage = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rental = this.rentalsService.getRentalById(id);
    if (this.rental) {
      this.form = { ...this.rental };
    }
    this.applyFilters();
      // Example: load payment history for this rental
      this.paymentHistory = [];
     // Mock: set contract image if available
     this.contractImage = this.rental && (this.rental as any).contractImage ? (this.rental as any).contractImage : null;
     // Extract payment periods from paymentHistory
     this.paymentPeriods = Array.from(new Set(this.paymentHistory.map(p => p.period)));
  }

  enableEdit() {
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.form = { ...this.rental };
    this.errors = {};
  }

  validate() {
    this.errors = {};
    if (!this.form.apartmentId) this.errors.apartmentId = 'Appartement requis';
    if (!this.form.tenantId) this.errors.tenantId = 'Locataire requis';
    if (!this.form.startDate) this.errors.startDate = 'Date début requise';
    if (!this.form.price || this.form.price < 1) this.errors.price = 'Prix requis';
    return Object.keys(this.errors).length === 0;
  }

  save() {
    if (!this.validate()) return;
    this.rentalsService.updateRental(this.form);
    this.rental = { ...this.form };
    this.editMode = false;
  }

  back() {
    this.router.navigate(['demo/admin-page/rentals']);
  }

  deleteRental() {
    if (!this.rental) return;
    this.rentalsService.deleteRental(this.rental.id);
    this.showDeleteConfirm = false;
    this.router.navigate(['demo/admin-page/rentals']);
  }

  applyFilters() {
    const allRentals = this.rentalsService.getRentals();
    this.filteredRentals = allRentals.filter(r => {
      const matchApt = !this.filterApartmentId || r.apartmentId === this.filterApartmentId;
      const matchTenant = !this.filterTenantId || r.tenantId === this.filterTenantId;
      return matchApt && matchTenant;
    });
  }

  getApartmentName(id: number | undefined): string {
    if (!id) return '';
    const apt = this.apartments.find(a => a.id === id);
    return apt ? apt.name : '';
  }

  getTenantName(id: number | undefined): string {
    if (!id) return '';
    const t = this.tenants.find(t => t.id === id);
    return t ? t.fullName : '';
  }

  getLinkedApartments(): Apartment[] {
    if (!this.rental) return [];
    return this.apartments.filter(a => a.id === this.rental?.apartmentId);
  }
    getBuildingName(apartmentId: number | undefined): string {
      if (!apartmentId) return '';
      const apt = this.apartments.find(a => a.id === apartmentId);
      if (apt && apt.buildingId) {
        return 'Bâtiment ' + apt.buildingId;
      }
      return '';
    }
   // Download contract image
   downloadContract() {
     if (this.contractImage) {
       const link = document.createElement('a');
       link.href = this.contractImage;
       link.download = 'contrat-location.jpg';
       link.click();
     }
   }

   // View contract image in large modal
   viewContract() {
     if (this.contractImage) {
       window.open(this.contractImage, '_blank');
     }
   }

   // Filter payments by selected period
   filteredPayments(): any[] {
     if (!this.selectedPeriod) return this.paymentHistory;
     return this.paymentHistory.filter(p => p.period === this.selectedPeriod);
   }
}
