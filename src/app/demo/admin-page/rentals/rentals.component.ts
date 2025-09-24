import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RentalsService, Rental } from './rentals.service';

@Component({
  selector: 'app-rentals',
  templateUrl: './rentals.component.html',
  styleUrls: ['./rentals.component.scss'],
  standalone: false
})
export class RentalsComponent implements OnInit {
  rentals: Rental[] = [];

  constructor(private rentalsService: RentalsService, private router: Router) {}

  ngOnInit(): void {
    this.rentals = this.rentalsService.getRentals();
  }

  goToDetail(rental: Rental) {
    this.router.navigate(['demo/admin-page/rentals', rental.id]);
  }

  goToNew() {
    this.router.navigate(['demo/admin-page/rentals/new']);
  }
}
