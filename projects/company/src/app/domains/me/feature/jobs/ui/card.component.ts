import { Component, input } from '@angular/core';
import { JobView } from '../data-access/job';
import { PencilComponent } from "@shared/ui/pencil/pencil.component";

@Component({
  selector: 'mfe-company-card',
  host: { class: 'mfe-company-w-full sm:mfe-company-w-[16rem] mfe-company-cursor-pointer mfe-company-relative' },
  template: `
  @if(isCurrentCompany()) {
    <mfe-company-pencil></mfe-company-pencil>
  }

  @let jobIn = jobView();
  @if (jobIn) {
    <div class="mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-2 mfe-company-border mfe-company-rounded-xl mfe-company-bg-white mfe-company-p-4">
      <img loading="lazy"
          class=" mfe-company-w-full mfe-company-bg-cover mfe-company-bg-center mfe-company-max-h-[100px] mfe-company-max-w-[100px] mfe-company-rounded-t-md"
          [src]="jobIn.company.avatar"
          alt="bg"
        />  
      <h2 class="mfe-company-text-md mfe-company-font-bold mfe-company-mb-2">{{jobIn.position}}</h2>
      <p class="mfe-company-text-sm mfe-company-text-gray-700 mfe-company-mb-4">{{jobIn.description.substring(0,38)}}...</p>
      <p class="mfe-company-text-sm mfe-company-text-gray-700 mfe-company-mb-4 mfe-company-mt-4 mfe-company-font-medium"><small>{{jobIn.locationType}}</small></p>
    </div>
  }
  `,
  imports: [PencilComponent]
})
export class CardComponent {
  jobView = input<JobView>();
  isCurrentCompany = input<boolean>(false);
}
