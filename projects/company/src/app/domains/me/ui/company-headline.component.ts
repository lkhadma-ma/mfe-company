import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mfe-company-headline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="mfe-company-text-xs sm:mfe-company-text-base">
    <ng-content></ng-content>
    
    </p>
  ` 
})
export class CompanyHeadlineComponent {}
