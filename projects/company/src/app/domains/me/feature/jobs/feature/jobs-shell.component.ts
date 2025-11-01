import { Component, OnInit, inject, input } from '@angular/core';
import { SectionComponent } from "./../ui/section.component";
import { CardComponent } from "../ui/card.component";
import { JobsStore } from '../data-access/jobs.store';
import { Job, JobView } from '../data-access/job';

@Component({
  selector: 'mfe-company-jobs-shell',
  host: { class: 'mfe-company-w-full mfe-company-space-y-4' },
  template: `
  <mfe-company-section>
    <div class="mfe-company-mx-auto mfe-company-relative mfe-company-aspect-[16/4] mfe-company-gap-4 mfe-company-flex mfe-company-flex-wrap">
    @for (job of jobs(); track $index) {
      <mfe-company-card [jobView]="buildJobView(job)" [isCurrentCompany]="isCurrentCompany()"></mfe-company-card>
    }
    </div>
  </mfe-company-section>
  `,
  imports: [SectionComponent, CardComponent]
})
export class JobsShellComponent implements OnInit {

  isCurrentCompany = input<boolean>(false);
  private jobsStore = inject(JobsStore);

  jobs = this.jobsStore.jobs;
  company = this.jobsStore.company;

  constructor() { }

  ngOnInit() {
  }

  buildJobView(job: Job): JobView {
    const company = this.company()!;
    return {
      ...job,
      company
    };
  }
}
