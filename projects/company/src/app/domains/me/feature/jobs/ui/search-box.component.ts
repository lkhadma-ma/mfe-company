import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mfe-company-search-box',
  host: { class: 'mfe-company-relative mfe-company-mb-2' },
  imports: [FormsModule],
  template: `
    <form class="mfe-company-pt-2 mfe-company-relative mfe-company-mx-auto mfe-company-text-gray-600">
      <input
        ngModel
        name="search"
        type="search"
        placeholder="Search"
        (ngModelChange)="onChange($event)"
        class="mfe-company-border-2 mfe-company-border-gray-300 mfe-company-bg-white mfe-company-h-10 mfe-company-px-5 mfe-company-rounded-lg mfe-company-text-sm focus:mfe-company-outline-none mfe-company-w-1/2"
      />
    </form>
  `
})
export class SearchBoxComponent {
  onchange = output<string>();

  onChange(value: string) {
    this.onchange.emit(value);
  }
}
