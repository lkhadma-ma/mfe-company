import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mfe-company-home-shell',
  host: { class: 'mfe-company-w-full mfe-company-space-y-4' },
  template: `
  <div class="mfe-company-border mfe-company-rounded-xl mfe-company-bg-white">
    <div class="mfe-company-relative mfe-company-aspect-[16/4] mfe-company-p-3">
      <span class="mfe-company-text-gray-500 mfe-company-text-lg">🏠 Home Component</span>   
    </div>
  </div>

  <div class="mfe-company-border mfe-company-rounded-xl mfe-company-bg-white">
    <div class="mfe-company-relative mfe-company-aspect-[16/4] mfe-company-p-3">
      <div class="mfe-company-text-center mfe-company-text-gray-500 mfe-company-text-lg">
        <span>Welcome to your company home page! Here you can manage your company's activities and updates.</span>
      </div>   
    </div>
  </div>
  `
})
export class HomeShellComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
