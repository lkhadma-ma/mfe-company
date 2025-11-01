import { Component, OnInit, inject, input } from '@angular/core';
import { SectionComponent } from "../ui/section.component";
import { AboutStore } from '../data-access/about.store';

@Component({
  selector: 'mfe-company-about-shell',
  host: { class: 'mfe-company-w-full mfe-company-space-y-4' },
  template: `
    @let aboutIn = about();
    @if(aboutIn){
      <mfe-company-section>
    <h1 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-xl mfe-company-mt-2 mfe-company-mb-4 mfe-company-flex mfe-company-justify-between">Overview
      @if(isCurrentCompany()) {
        <i class="fa-solid fa-pencil mfe-company-cursor-pointer hover:mfe-company-scale-105"></i>
      }
    </h1>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
      <p>{{aboutIn.overview}}</p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
      Website
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
      <p>
        <a class="mfe-company-text-blue-600 mfe-company-underline mfe-company-cursor-pointer" href="{{aboutIn.website}}" target="_blank" rel="noopener noreferrer">
          {{aboutIn.website}}
        </a>
      </p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
      Industry
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
      <p>{{aboutIn.industry}}</p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
      Company Size
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
      <p>{{aboutIn.companySize}}</p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
      Founded
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
      <p>{{aboutIn.founded}}</p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
      Specialties
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
      <p>{{aboutIn.Specialties}}</p>
    </div>
  </mfe-company-section>

    }
  `,
  imports: [SectionComponent]
})
export class AboutShellComponent implements OnInit {

  isCurrentCompany = input<boolean>();
  aboutStore = inject(AboutStore);
  about = this.aboutStore.about;

  ngOnInit() {
  }

}
