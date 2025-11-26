import { Component, OnInit, ViewChild, inject, input, signal } from '@angular/core';
import { SectionComponent } from "./../ui/section.component";
import { JobComponent } from "../ui/job.component";
import { JobsStore } from '../data-access/jobs.store';
import { Job } from '../data-access/job';
import { PlusComponent } from "@shared/ui/plus/plus.component";
import { FormJobComponent } from "../ui/form-job.component";
import { SearchBoxComponent } from "../ui/search-box.component";
import { SearchComponent } from "@shared/ui/search/search.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mfe-company-jobs-shell',
  host: { class: 'mfe-company-w-full mfe-company-space-y-4' },
  template: `
  <mfe-company-section>
    <h1 class="mfe-user-font-semibold mfe-user-tracking-wide sm:mfe-user-text-xl mfe-user-mb-5 mfe-user-flex mfe-user-justify-between">
      Jobs
      @if(isCurrentCompany()) {
        <div class="mfe-company-flex mfe-company-items-center mfe-company-gap-4">
          <mfe-company-search
            (click)="toggleIsSearchingActive()"
          ></mfe-company-search>
          <mfe-company-plus
            (click)="currentJob.set(null);form.openJobModal()"
          ></mfe-company-plus>
        </div>
      }
    </h1>
    @if(isSearchingActive()){
      <mfe-company-search-box (onchange)="onSearch($event)"></mfe-company-search-box>
    }
    <div class="mfe-company-mx-auto mfe-company-relative mfe-company-aspect-[16/4] mfe-company-gap-4 mfe-company-flex mfe-company-flex-wrap">
      @for (job of jobs(); track $index) {
        <mfe-company-job 
        [jobView]="job" 
        (onEdit)="currentJob.set(job);form.openJobModal()"
        (onDelete)="deleteJob(job.id)"
        (onView)="navigateToJobDetail(job.id)"
        [isCurrentCompany]="isCurrentCompany()">
        </mfe-company-job>
      }@empty {
        <div class="mfe-company-w-full mfe-company-flex mfe-company-justify-center mfe-company-text-center mfe-company-py-8 mfe-company-text-gray-500">
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
  imports: [SectionComponent, JobComponent, PlusComponent, FormJobComponent, SearchBoxComponent, SearchComponent]
})
export class JobsShellComponent implements OnInit {

  private jobsStore = inject(JobsStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isCurrentCompany = input<boolean>(false);

  @ViewChild(FormJobComponent) form!: FormJobComponent;
  currentJob = signal<Job | null>(null);
  isSearchingActive = signal<boolean>(false);

  jobs = this.jobsStore.jobs;

  constructor() { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username')!;
      this.jobsStore.loadJobs(username);
    });
  }

  toggleIsSearchingActive() {
    this.isSearchingActive.set(!this.isSearchingActive());
  }

  updateJob(job: Job) {
    this.jobsStore.update(job);
    this.form.onModalClosed();
  }

  deleteJob(jobId: string) {
    this.jobsStore.delete(jobId);
  }

  onSearch(query: string) {
    this.jobsStore.search(query);
  }

  navigateToJobDetail(jobId: string) {
    this.router.navigate(['/lk/jobs'], { queryParams: { currentId: jobId } });
  }
}
