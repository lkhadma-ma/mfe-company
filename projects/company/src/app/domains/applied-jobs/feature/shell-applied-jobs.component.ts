import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent } from "@shared/ui/section/section.component";


@Component({
  selector: 'mfe-company-applied-jobs',
  imports: [
    CommonModule,
    SectionComponent
],
  template: `
    <mfe-company-section ngxClass="md:mfe-company-pt-[5rem]" >
      <div class="mfe-company-w-full mfe-company-mb-40 md:mfe-company-space-x-6 md:mfe-company-flex ">
        <div class="mfe-company-w-full">
          <div class="mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-4">
          <!-- start -->
          <div class="max-sm:mfe-company-h-[90vh] max-sm:mfe-company-border sm:mfe-company-rounded-lg mfe-company-bg-white">
            <div class="mfe-company-px-4 mfe-company-py-4 mfe-company-space-y-4">
              <!-- Header -->
              <!-- Applications List -->
              <div class="mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-4">

              </div>
            </div>
          </div>
          <!-- fin -->
          </div>
        </div>
        <div class="mfe-company-hidden mfe-company-w-[400px] lg:mfe-company-flex mfe-company-flex-col mfe-company-space-y-4">
          <!-- Sidebar content can go here -->
        </div>
      </div>
    </mfe-company-section>
  `,
})
export class ShellAppliedJobsComponent {
  
}
