import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantsService, Tenant } from './tenants.service';
import { RentalsService, Rental } from '../rentals/rentals.service';
import { ApartmentsService, Apartment } from '../apartments/apartments.service';
import { OwnersService, Owner } from '../owners/owners.service';

@Component({
  selector: 'app-tenants-detail',
  templateUrl: './tenants-detail.component.html',
  styleUrls: ['./tenants-detail.component.scss'],
  standalone: false
})
export class TenantsDetailComponent implements OnInit {
  showDeleteConfirm = false;
  tenant: Tenant | undefined;
  rentalDetails: Array<{
    rental?: Rental;
    apartment?: Apartment;
    owner?: Owner;
  }> = [];
  editMode = false;
  form: any = {
    affiliatedPerson: {} // Initialiser l'objet affiliatedPerson
  };
  errors: any = {};
  apartments: Apartment[] = [];
  tenants: Tenant[] = [];
  rental: Rental | undefined;
  paymentHistory: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantsService: TenantsService,
    private rentalsService: RentalsService,
    private apartmentsService: ApartmentsService,
    private ownersService: OwnersService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTenantData(id);
    this.loadApartments();
    this.loadTenants();
  }

  // Charger les données du locataire
  private loadTenantData(id: number): void {
    this.tenant = this.tenantsService.getTenantById(id);
    if (this.tenant) {
      // Initialiser le formulaire avec les données du locataire
      this.form = { 
        ...this.tenant,
        // S'assurer que affiliatedPerson existe
        affiliatedPerson: this.tenant.affiliatedPerson || {}
      };
      
      this.loadRentalDetails();
    }
  }

  // Charger les appartements
  private loadApartments(): void {
    this.apartments = this.apartmentsService.getApartments();
  }

  // Charger les locataires
  private loadTenants(): void {
    this.tenants = this.tenantsService.getTenants();
  }

  // Charger les détails de location
  private loadRentalDetails(): void {
    if (this.tenant && Array.isArray(this.tenant.rental)) {
      this.rentalDetails = this.tenant.rental.map((rentalId: number) => {
        const rental = this.rentalsService.getRentalById(rentalId);
        let apartment: Apartment | undefined;
        let owner: Owner | undefined;
        
        if (rental) {
          apartment = this.apartmentsService.getApartmentById(rental.apartmentId);
          if (apartment) {
            owner = this.ownersService.getOwnerById(apartment.buildingId);
          }
        }
        return { rental, apartment, owner };
      });

      // Utiliser la première location pour l'affichage
      if (this.rentalDetails.length > 0) {
        this.rental = this.rentalDetails[0].rental;
        this.paymentHistory = []; // À remplacer par le chargement réel de l'historique des paiements
      }
    }
  }

  // Vérifier si le formulaire a été modifié
  isFormChanged(): boolean {
    if (!this.tenant) return false;
    
    // Comparer les objets en les convertissant en JSON
    const original = {
      ...this.tenant,
      affiliatedPerson: this.tenant.affiliatedPerson || {}
    };
    
    return JSON.stringify(this.form) !== JSON.stringify(original);
  }

  // Sauvegarder ou annuler selon les modifications
  saveOrCancel(): void {
    if (this.isFormChanged()) {
      this.save();
    } else {
      this.cancelEdit();
    }
    
    // Navigation après sauvegarde ou annulation
    if (this.tenant) {
      this.router.navigate(['demo/admin-page/tenants', this.tenant.id]);
    } else {
      this.router.navigate(['demo/admin-page/tenants']);
    }
  }

  // Confirmation de suppression
  confirmDeleteTenant(): void {
    this.showDeleteConfirm = true;
  }

  // Suppression du locataire
  deleteTenant(): void {
    if (this.tenant) {
      this.tenantsService.deleteTenant(this.tenant.id);
      this.router.navigate(['demo/admin-page/tenants']);
    }
  }

  // Gestion de la sélection d'image d'identité
  onIdentityImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
    
    // Validation du type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.errors.identityImage = 'Format d\'image non autorisé. Utilisez JPEG, PNG ou WebP.';
      return;
    }
    
    // Validation de la taille
    if (file.size > 2 * 1024 * 1024) {
      this.errors.identityImage = 'La taille de l\'image doit être inférieure à 2Mo.';
      return;
    }
    
    // Lecture du fichier
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.form.identityImage = e.target.result;
      delete this.errors.identityImage; // Effacer l'erreur si elle existait
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Réinitialiser l'input file
  }

  // Gestion de la sélection d'image de profil
  onProfileImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.errors.profileImage = 'Format d\'image non autorisé. Utilisez JPEG, PNG ou WebP.';
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      this.errors.profileImage = 'La taille de l\'image doit être inférieure à 2Mo.';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.form.profileImage = e.target.result;
      delete this.errors.profileImage;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  // Suppression d'une location
  deleteRental(): void {
    if (this.rental) {
      this.rentalsService.deleteRental(this.rental.id);
      this.router.navigate(['demo/admin-page/rentals']);
    }
  }

  // Obtenir le nom d'un appartement
  getApartmentName(apartmentId: number | undefined): string {
    if (!apartmentId) return '-';
    const apartment = this.apartments.find(a => a.id === apartmentId);
    return apartment ? apartment.name : '-';
  }

  // Obtenir le nom d'un bâtiment
  getBuildingName(apartmentId: number | undefined): string {
    if (!apartmentId) return '-';
    const apartment = this.apartments.find(a => a.id === apartmentId);
    return apartment && apartment.buildingId ? `Bâtiment ${apartment.buildingId}` : '-';
  }

  // Obtenir le nom d'un locataire
  getTenantName(tenantId: number | undefined): string {
    if (!tenantId) return '-';
    const tenant = this.tenants.find(t => t.id === tenantId);
    return tenant ? tenant.fullName : '-';
  }

  // Activation du mode édition
  enableEdit(): void {
    this.editMode = true;
  }

  // Annulation de l'édition
  cancelEdit(): void {
    this.editMode = false;
    if (this.tenant) {
      // Réinitialiser le formulaire avec les données originales
      this.form = { 
        ...this.tenant,
        affiliatedPerson: this.tenant.affiliatedPerson || {}
      };
    }
    this.errors = {};
  }

  // Validation du formulaire
  validate(): boolean {
    this.errors = {};
    
    if (!this.form.fullName?.trim()) {
      this.errors.fullName = 'Le nom complet est requis';
    }
    
    if (!this.form.country?.trim()) {
      this.errors.country = 'Le pays est requis';
    }
    
    if (!this.form.address?.trim()) {
      this.errors.address = 'L\'adresse est requise';
    }
    
    if (!this.form.phone?.trim()) {
      this.errors.phone = 'Le téléphone est requis';
    } else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(this.form.phone)) {
      this.errors.phone = 'Le format du téléphone est invalide';
    }
    
    if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.errors.email = 'Le format de l\'email est invalide';
    }
    
    return Object.keys(this.errors).length === 0;
  }

  // Sauvegarde des modifications
  save(): void {
    if (!this.validate()) return;
    
    try {
      this.tenantsService.updateTenant(this.form);
      this.tenant = { ...this.form };
      this.editMode = false;
      
      // Recharger les données pour s'assurer qu'elles sont à jour
      if (this.tenant && this.tenant.id) {
        this.loadTenantData(this.tenant.id);
      }
        // Recharger la liste globale des locataires pour le composant principal
        this.tenants = this.tenantsService.getTenants();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      this.errors.general = 'Une erreur est survenue lors de la sauvegarde';
    }
  }

  // Retour à la liste des locataires
  back(): void {
    this.router.navigate(['demo/admin-page/tenants']);
  }
}