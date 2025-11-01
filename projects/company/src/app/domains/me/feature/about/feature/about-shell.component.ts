import { Component, OnInit, ViewChild, inject, input } from '@angular/core';
import { SectionComponent } from "../ui/section.component";
import { AboutStore } from '../data-access/about.store';
import { AboutComponent } from "../ui/about.component";
import { FormAboutComponent } from "../ui/form-about.component";
import { About } from '../data-access/about';

@Component({
  selector: 'mfe-company-about-shell',
  host: { class: 'mfe-company-w-full mfe-company-space-y-4' },
  template: `
    <mfe-company-section>
      <h1 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-xl mfe-company-mt-2 mfe-company-mb-4 mfe-company-flex mfe-company-justify-between">Overview
        @if(isCurrentCompany()) {
          <i class="fa-solid fa-pencil mfe-company-cursor-pointer hover:mfe-company-scale-105" (click)="form.openAboutModal()"></i>
        }
      </h1>

      @let aboutIn = about();
      @if(aboutIn){
        <mfe-company-about [about]="aboutIn"></mfe-company-about>
      }
  </mfe-company-section>

    
  @if(isCurrentCompany()) {
    <mfe-company-form-about
      [initialData]="about()"
      (onSubmit)="updateAbout($event)"
    ></mfe-company-form-about>
  }

  `,
  imports: [SectionComponent, AboutComponent, FormAboutComponent]
})
export class AboutShellComponent implements OnInit {

  isCurrentCompany = input<boolean>();
  private aboutStore = inject(AboutStore);
  about = this.aboutStore.about;

  @ViewChild(FormAboutComponent) form!: FormAboutComponent;

  ngOnInit() {
  }

  updateAbout(data: About) {
    this.aboutStore.updateAbout(data);
  }
}
