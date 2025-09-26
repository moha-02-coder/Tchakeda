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
  editMode = false;
  showDeleteConfirm = false;
  form: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectorsService: CollectorsService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.collector = this.collectorsService.getCollectors().find(c => c.id === this.id);
    if (!this.collector) {
      this.router.navigate(['/demo/admin-page/collectors']);
    } else {
      this.form = { ...this.collector };
    }
  }

  save() {
    if (this.collector) {
      Object.assign(this.collector, this.form);
      this.collectorsService.updateCollector(this.collector);
      this.editMode = false;
      alert('Modifications enregistrées');
    }
  }

  delete() {
    if (this.id) {
      this.collectorsService.deleteCollector(this.id);
      this.router.navigate(['/demo/admin-page/collectors']);
    }
  }

  back() {
    this.router.navigate(['/demo/admin-page/collectors']);
  }
}
