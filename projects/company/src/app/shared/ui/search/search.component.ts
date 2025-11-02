import { Component } from '@angular/core';

@Component({
  selector: 'mfe-company-search',
  host: { class: 'mfe-user-cursor-pointer hover:mfe-user-scale-105' },
  template: `
  <i class="fa-solid fa-magnifying-glass"></i>`
})
export class SearchComponent {
}
