import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoomImagesService {
  
  // Mapping des types de pièces vers leurs images par défaut
  private roomImageMap: { [key: string]: string } = {
    'chambre': 'assets/images/rooms/bedroom.jpg',
    'chambres': 'assets/images/rooms/bedroom.jpg',
    'salon': 'assets/images/rooms/living-room.jpg',
    'cuisine': 'assets/images/rooms/kitchen.jpg',
    'salle de bain': 'assets/images/rooms/bathroom.jpg',
    'salle de bains': 'assets/images/rooms/bathroom.jpg',
    'balcon': 'assets/images/rooms/balcony.jpg',
    'balcons': 'assets/images/rooms/balcony.jpg',
    'bureau': 'assets/images/rooms/default-room.jpg',
    'garage': 'assets/images/rooms/default-room.jpg',
    'cave': 'assets/images/rooms/default-room.jpg',
    'terrasse': 'assets/images/rooms/balcony.jpg',
    'studio': 'assets/images/rooms/default-room.jpg'
  };

  // Image par défaut pour l'appartement
  private defaultApartmentImage = 'assets/images/rooms/default-apartment.jpg';
  
  // Image par défaut pour les pièces non identifiées
  private defaultRoomImage = 'assets/images/rooms/default-room.jpg';

  /**
   * Retourne l'image appropriée pour un type de pièce donné
   * @param roomLabel Le nom de la pièce
   * @returns Le chemin vers l'image appropriée
   */
  getRoomImage(roomLabel: string): string {
    if (!roomLabel) return this.defaultRoomImage;
    
    const normalizedLabel = roomLabel.toLowerCase().trim();
    
    // Recherche exacte d'abord
    if (this.roomImageMap[normalizedLabel]) {
      return this.roomImageMap[normalizedLabel];
    }
    
    // Recherche partielle pour gérer les variations
    for (const [key, image] of Object.entries(this.roomImageMap)) {
      if (normalizedLabel.includes(key) || key.includes(normalizedLabel)) {
        return image;
      }
    }
    
    return this.defaultRoomImage;
  }

  /**
   * Retourne l'image par défaut pour un appartement
   */
  getDefaultApartmentImage(): string {
    return this.defaultApartmentImage;
  }

  /**
   * Retourne l'image par défaut pour une pièce
   */
  getDefaultRoomImage(): string {
    return this.defaultRoomImage;
  }

  /**
   * Vérifie si une image est une image par défaut
   */
  isDefaultImage(imagePath: string): boolean {
    return imagePath.includes('assets/images/rooms/');
  }

  /**
   * Retourne tous les types de pièces disponibles avec leurs images
   */
  getAvailableRoomTypes(): Array<{label: string, image: string}> {
    return Object.entries(this.roomImageMap).map(([label, image]) => ({
      label: this.capitalizeFirstLetter(label),
      image
    }));
  }

  /**
   * Capitalise la première lettre d'une chaîne
   */
  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
