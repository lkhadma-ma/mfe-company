import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent } from "@shared/ui/section/section.component";
import { JobApplication, JobApplicationStatus } from '../data-access/job-application';
import { AppliedJobsStore } from '../data-access/applied-jobs.store';
import { LoadingComponent } from "../ui/loading.component";
import { JobApplicationComponent } from "../ui/job-application.component";


@Component({
  selector: 'mfe-company-applied-jobs',
  imports: [
    CommonModule,
    SectionComponent,
    LoadingComponent,
    JobApplicationComponent
],
  template: `
    <mfe-company-section ngxClass="md:mfe-company-pt-[5rem]" >
      <div class="mfe-company-w-full mfe-company-mb-40 md:mfe-company-space-x-6 md:mfe-company-flex ">
        <div class="mfe-company-w-full">
          <div class="mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-4">
          <!-- start -->
          <div class="max-sm:mfe-company-h-[90vh] max-sm:mfe-company-border sm:mfe-company-rounded-lg mfe-company-bg-white">
            <div class="mfe-company-px-4 mfe-company-py-4 mfe-company-space-y-4">
              <div class="mfe-user-space-y-2">
                  <h2 class="mfe-user-text-2xl mfe-user-font-semibold mfe-user-text-gray-900">
                    job Applications
                  </h2>
                  <p class="mfe-user-text-gray-600 mfe-user-text-sm">
                    Manage and review the applications submitted by candidates for your job postings.
                  </p>
              </div>


              <!-- Filter Tabs -->
              <div class="mfe-user-flex mfe-user-gap-2 mfe-user-overflow-x-auto mfe-user-pb-2">
                <button
                  *ngFor="let filter of statusFilters"
                  (click)="setStatusFilter(filter.value)"
                  [class]="getFilterButtonClasses(filter.value)"
                  class="mfe-user-px-4 mfe-user-py-2 mfe-user-rounded-lg mfe-user-text-sm mfe-user-font-medium mfe-user-transition mfe-user-duration-200 mfe-user-whitespace-nowrap"
                >
                  {{ filter.label }}
                  <span class="mfe-user-ml-1 mfe-user-text-xs mfe-user-opacity-70">
                    ({{ getApplicationCount(filter.value) }})
                  </span>
                </button>
              </div>

              <!-- Applications List -->
              <div class="mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-4">
              @if(applications() === null) {
                  <mfe-user-loading />
                } @else if (applications()!.length > 0) {
                  @for(app of filteredApplications(); track app.job.id) {
                    <mfe-user-job-application [application]="app" />
                  } @empty {
                    <div class="mfe-user-text-center mfe-user-py-12 mfe-user-text-gray-500">
                      <i class="fa-solid fa-briefcase mfe-user-text-4xl mfe-user-mb-4 mfe-user-text-gray-300"></i>
                      <p class="mfe-user-text-lg">
                        {{ getEmptyStateMessage() }}
                      </p>
                      <p class="mfe-user-text-sm mfe-user-mt-1">
                        Applications with this status will appear here
                      </p>
                  </div>
                  }
                } @else {
                  <div class="mfe-user-text-center mfe-user-py-12 mfe-user-text-gray-500">
                      <i class="fa-solid fa-briefcase mfe-user-text-4xl mfe-user-mb-4 mfe-user-text-gray-300"></i>
                      <p class="mfe-user-text-lg">
                        {{ getEmptyStateMessage() }}
                      </p>
                      <p class="mfe-user-text-sm mfe-user-mt-1">
                        Applications with this status will appear here
                      </p>
                  </div>
                }
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
  private appliedJobsStore = inject(AppliedJobsStore);

  statusFilter = signal<JobApplicationStatus>('SUBMITTED');
  applications = this.appliedJobsStore.jobApplications;

  statusFilters = [
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'VIEWED', label: 'Viewed' },
    { value: 'INTERVIEW', label: 'Interview' },
    { value: 'PASSED', label: 'Passed' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  filteredApplications = computed(() => {
    const filter = this.statusFilter();
    const allApplications = this.applications() ?? [];
    return allApplications.filter(app => this.getLatestStatus(app) === filter);
  });
  
  setStatusFilter(filter: any): void {
    this.statusFilter.set(filter as JobApplicationStatus);
  }

  getFilterButtonClasses(filter: any): string {
    const isActive = this.statusFilter() === filter;
    const baseClasses =
      'mfe-user-px-4 mfe-user-py-2 mfe-user-rounded-lg mfe-user-text-sm mfe-user-font-medium mfe-user-transition mfe-user-duration-200 mfe-user-whitespace-nowrap';

    if (isActive) {
      return `${baseClasses} mfe-user-bg-blue-100 mfe-user-text-blue-700 mfe-user-border mfe-user-border-blue-200`;
    }

    return `${baseClasses} mfe-user-bg-gray-100 mfe-user-text-gray-700 mfe-user-border mfe-user-border-transparent hover:mfe-user-bg-gray-200`;
  }

  getApplicationCount(filter: any): number {
    const apps = this.applications() ?? [];
    return apps.filter(app => this.getLatestStatus(app) === filter).length;
  }

  private getLatestStatus(app: JobApplication): JobApplicationStatus {
    if (!app.pipelineStage || app.pipelineStage.length === 0) {
      return 'SUBMITTED';
    }

    return app.pipelineStage[app.pipelineStage.length - 1].status;
  }

  getEmptyStateMessage(): string {
    const filter = this.statusFilter();

    const filterMap: Record<JobApplicationStatus, string> = {
      SUBMITTED: 'No submitted applications',
      VIEWED: 'No applications viewed yet',
      INTERVIEW: 'No interview invitations',
      ACCEPTED: 'No accepted applications',
      REJECTED: 'No rejected applications',
      PASSED: 'No passed applications',
    };

    return filterMap[filter];
  }


}
