import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectorsService, Collector } from './collectors.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-collectors-detail',
  templateUrl: './collectors-detail.component.html',
  styleUrls: ['./collectors-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CollectorsDetailComponent implements OnInit {
  collector: Collector | undefined;
  id: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectorsService: CollectorsService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.collector = this.collectorsService.getCollectors().find(c => c.id === this.id);
    if (!this.collector) {
      this.router.navigate(['../collectors']);
    }
  }

  save() {
    if (this.collector) {
      this.collectorsService.updateCollector(this.collector);
      alert('Modifications enregistrées');
    }
  }

  delete() {
    if (this.id) {
      if (confirm('Supprimer ce recouvreur ?')) {
        this.collectorsService.deleteCollector(this.id);
        this.router.navigate(['../collectors']);
      }
    }
  }

  back() {
    this.router.navigate(['../collectors']);
  }
}
