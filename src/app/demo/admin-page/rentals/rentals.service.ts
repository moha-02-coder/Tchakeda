import { Injectable } from '@angular/core';

export interface Rental {
  id: number;
  apartmentId: number;
  apartmentName: string;
  tenantId: number;
  tenantName: string;
  startDate: string;
  endDate: string;
  price: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class RentalsService {
  private storageKey = 'rentals';

  /**
   * Retourne toutes les locations, ou un tableau vide si le localStorage est corrompu.
   */
  getRentals(): Rental[] {
    const data = localStorage.getItem(this.storageKey);
    try {
      return data ? JSON.parse(data) : [];
    } catch {
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  /**
   * Retourne une location par son ID.
   */
  getRentalById(id: number): Rental | undefined {
    return this.getRentals().find(r => r.id === id);
  }

  /**
   * Crée une nouvelle location et la sauvegarde.
   */
  createRental(rental: Omit<Rental, 'id' | 'createdAt'>): Rental {
    const rentals = this.getRentals();
    const newRental: Rental = {
      ...rental,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    rentals.push(newRental);
    localStorage.setItem(this.storageKey, JSON.stringify(rentals));
    return newRental;
  }

  /**
   * Met à jour une location existante.
   */
  updateRental(updated: Rental): void {
    const rentals = this.getRentals().map(r => r.id === updated.id ? updated : r);
    localStorage.setItem(this.storageKey, JSON.stringify(rentals));
  }

  /**
   * Supprime une location par son ID.
   */
  deleteRental(id: number): void {
    const rentals = this.getRentals().filter(r => r.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(rentals));
  }

  /**
   * Supprime toutes les locations (administration).
   */
  clearRentals(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Filtre les locations par locataire.
   */
  getRentalsByTenant(tenantId: number): Rental[] {
    return this.getRentals().filter(r => r.tenantId === tenantId);
  }

  /**
   * Filtre les locations par appartement.
   */
  getRentalsByApartment(apartmentId: number): Rental[] {
    return this.getRentals().filter(r => r.apartmentId === apartmentId);
  }
}
