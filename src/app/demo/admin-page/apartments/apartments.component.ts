import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApartmentsService, Apartment } from './apartments.service';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.scss'],
  standalone: false
})
export class ApartmentsComponent implements OnInit {
  getRoomImages(apartment: Apartment): string[] {
    return apartment.images || [];
  }
  sortOrder: 'recent' | 'oldest' = 'recent';
  filterType: string = '';
  filterRooms: number | null = null;
  filterStatus: 'all' | 'occupied' | 'free' = 'all';
  filterMention: 'all' | 'high' | 'low' = 'all';
  activeFilter: 'name' | 'city' | 'region' | null = null;
  apartments: Apartment[] = [];
  filteredApartments: Apartment[] = [];
  viewMode: 'list' | 'grid' = 'grid';
  filterName: string = '';
  filterCity: string = '';
  filterRegion: string = '';

  constructor(
    private apartmentsService: ApartmentsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apartments = this.apartmentsService.getApartments();
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.apartments.filter(a => {
      // Filtre type d'appartement
      const typeMatch = !this.filterType || (a.type && a.type.toLowerCase() === this.filterType.toLowerCase());
      // Filtre nombre de pièces
      const roomsMatch = !this.filterRooms || (a.rooms && a.rooms === this.filterRooms);
      // Filtre statut
      const statusMatch = this.filterStatus === 'all' || (this.filterStatus === 'occupied' && a.tenant) || (this.filterStatus === 'free' && !a.tenant);
      // Filtre mention
      let mentionValue = 0;
      if (a.mention) {
        mentionValue = typeof a.mention === 'string' ? parseInt(a.mention, 10) : a.mention;
      }
      const mentionMatch = this.filterMention === 'all' || (this.filterMention === 'high' && mentionValue > 20000) || (this.filterMention === 'low' && mentionValue <= 20000);
      return typeMatch && roomsMatch && statusMatch && mentionMatch;
    });
    // Tri
    result = result.sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return this.sortOrder === 'recent' ? bDate - aDate : aDate - bDate;
    });
    this.filteredApartments = result;
  }

  setSortOrder(order: 'recent' | 'oldest'): void {
    this.sortOrder = order;
    this.applyFilters();
  }

  goToDetail(apartment: Apartment) {
    this.router.navigate(['demo/admin-page/apartments', apartment.id]);
  }

  goToNew() {
    this.router.navigate(['demo/admin-page/apartments/new']);
  }

  toggleView() {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'grid';
  }
}
