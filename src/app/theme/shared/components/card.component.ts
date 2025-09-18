import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div [ngClass]="cardClass" [class.blockClass]="blockClass">
      <ng-content></ng-content>
      <div *ngIf="isCardFooter" class="app-card-footer"></div>
    </div>
  `,
  styles: [`
    .app-card-footer { padding: 8px; border-top: 1px solid #eee; }
  `],
  standalone: false
})
export class CardComponent {
  @Input() hidHeader?: boolean;
  @Input() cardClass?: string;
  @Input() blockClass?: string;
  @Input() footerClass?: string;
  @Input() cardTitle?: string;
  @Input() options?: boolean;
  @Input() isCardFooter?: boolean;
}
