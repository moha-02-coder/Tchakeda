import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OwnersService, Owner } from './owners.service';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss'],
  standalone: false
})
export class OwnersComponent implements OnInit {
  owners: Owner[] = [];

  constructor(private ownersService: OwnersService, private router: Router) {}

  ngOnInit(): void {
    this.owners = this.ownersService.getOwners();
  }

  goToDetail(owner: Owner) {
    this.router.navigate(['demo/admin-page/owners', owner.id]);
  }

  goToNew() {
    this.router.navigate(['demo/admin-page/owners/new']);
  }
}
