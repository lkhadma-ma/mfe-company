import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'mfe-company-section',
    host: { class: 'mfe-company-w-full' },
    template: `
    <div class="mfe-company-border mfe-company-rounded-xl mfe-company-bg-white">
      <div class="mfe-company-relative mfe-company-aspect-[16/3] mfe-company-p-4 mfe-company-space-y-4">
        <ng-content></ng-content>
      </div>
    </div>
    `
})

export class SectionComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}