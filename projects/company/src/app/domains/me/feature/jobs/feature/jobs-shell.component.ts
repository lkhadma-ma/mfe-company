import { Component, OnInit, ViewChild, inject, input, signal } from '@angular/core';
import { SectionComponent } from "./../ui/section.component";
import { JobComponent } from "../ui/job.component";
import { JobsStore } from '../data-access/jobs.store';
import { Job, JobView } from '../data-access/job';
import { PlusComponent } from "@shared/ui/plus/plus.component";
import { FormJobComponent } from "../ui/form-job.component";
import { TrashComponent } from "@shared/ui/trash/trash.component";

@Component({
  selector: 'mfe-company-jobs-shell',
  host: { class: 'mfe-company-w-full mfe-company-space-y-4' },
  template: `
  <mfe-company-section>
      <h1 class="mfe-user-font-semibold mfe-user-tracking-wide sm:mfe-user-text-xl mfe-user-mb-7 mfe-user-flex mfe-user-justify-between">
        Jobs
        @if(isCurrentCompany()) {
          <mfe-company-plus
            (click)="currentJob.set(null);form.openJobModal()"
          ></mfe-company-plus>
        }
      </h1>
    <div class="mfe-company-mx-auto mfe-company-relative mfe-company-aspect-[16/4] mfe-company-gap-4 mfe-company-flex mfe-company-flex-wrap">
      @for (job of jobs(); track $index) {
        <mfe-company-job 
        [jobView]="buildJobView(job)" 
        (onEdit)="currentJob.set(job);form.openJobModal()"
        (onDelete)="deleteJob(job.id)"
        [isCurrentCompany]="isCurrentCompany()">
        </mfe-company-job>
      }@empty {
        <div class="mfe-company-text-center mfe-company-py-8 mfe-company-text-gray-500">
          <p>No Jobs details available.</p>
        </div>
      }
    </div>
  </mfe-company-section>

  @if(isCurrentCompany()) {
    <mfe-company-form-job
      [initialData]="currentJob()"
      (onSubmit)="updateJob($event)"
    ></mfe-company-form-job>
  }
  `,
  imports: [SectionComponent, JobComponent, PlusComponent, FormJobComponent]
})
export class JobsShellComponent implements OnInit {

  private jobsStore = inject(JobsStore);

  isCurrentCompany = input<boolean>(false);

  @ViewChild(FormJobComponent) form!: FormJobComponent;
  currentJob = signal<Job | null>(null);

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

  updateJob(job: Job) {
    this.jobsStore.update(job);
    this.form.onModalClosed();
  }

  deleteJob(jobId: string) {
    this.jobsStore.delete(jobId);
  }
}
