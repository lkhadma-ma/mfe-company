import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent } from "@shared/ui/section/section.component";
import { JobApplication, JobApplicationStatus } from '../data-access/job-application';
import { AppliedJobsStore } from '../data-access/applied-jobs.store';
import { LoadingUsersComponent } from "../ui/loading-users.component";
import { JobApplicationComponent } from "../ui/job-application.component";
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'mfe-company-applied-jobs',
  imports: [
    CommonModule,
    SectionComponent,
    LoadingUsersComponent,
    JobApplicationComponent
],
  template: `
    <mfe-company-section ngxClass="md:mfe-company-pt-[5rem]" >
      <div class="mfe-company-w-full mfe-company-mb-[5rem] md:mfe-company-space-x-6 md:mfe-company-flex ">
        <div class="mfe-company-w-full">
          <div class="mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-4">
          <!-- start -->
          <div class="max-sm:mfe-company-border sm:mfe-company-rounded-lg mfe-company-bg-white">
            <div class="mfe-company-px-4 mfe-company-py-4 mfe-company-space-y-4">
              <div class="mfe-company-space-y-2">
                  <h2 class="mfe-company-text-2xl mfe-company-font-semibold mfe-company-text-gray-900">
                    job Applications
                  </h2>
                  <p class="mfe-company-text-gray-600 mfe-company-text-sm">
                    Manage and review the applications submitted by candidates for your job postings.
                  </p>
              </div>


              <!-- Filter Tabs -->
              <div class="mfe-company-flex mfe-company-gap-2 mfe-company-overflow-x-auto mfe-company-pb-2">
                <button
                  *ngFor="let filter of statusFilters"
                  (click)="setStatusFilter(filter.value)"
                  [class]="getFilterButtonClasses(filter.value)"
                  class="mfe-company-px-4 mfe-company-py-2 mfe-company-rounded-lg mfe-company-text-sm mfe-company-font-medium mfe-company-transition mfe-company-duration-200 mfe-company-whitespace-nowrap"
                >
                  {{ filter.label }}
                  <span class="mfe-company-ml-1 mfe-company-text-xs mfe-company-opacity-70">
                    ({{ getApplicationCount(filter.value) }})
                  </span>
                </button>
              </div>

              <!-- Applications List -->
              <div class="mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-4">
                @if(applications() === undefined) {
                  <mfe-company-loading-users />
                } @else if (applications()!==null && applications()!.length > 0) {
                  @for(app of filteredApplications(); track app.user) {
                    <mfe-company-job-application [application]="app" (loadUserInfoEvent)="loadUserInfoEvent($event)" [user]="user()" />
                  } @empty {
                    <div class="mfe-company-text-center mfe-company-py-12 mfe-company-text-gray-500">
                      <i class="fa-solid fa-briefcase mfe-company-text-4xl mfe-company-mb-4 mfe-company-text-gray-300"></i>
                      <p class="mfe-company-text-lg">
                        {{ getEmptyStateMessage() }}
                      </p>
                      <p class="mfe-company-text-sm mfe-company-mt-1">
                        Applications with this status will appear here
                      </p>
                  </div>
                  }
                } @else {
                  <div class="mfe-company-text-center mfe-company-py-12 mfe-company-text-gray-500">
                      <i class="fa-solid fa-briefcase mfe-company-text-4xl mfe-company-mb-4 mfe-company-text-gray-300"></i>
                      <p class="mfe-company-text-lg">
                        {{ getEmptyStateMessage() }}
                      </p>
                      <p class="mfe-company-text-sm mfe-company-mt-1">
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
export class ShellAppliedJobsComponent implements OnInit{
  
  private appliedJobsStore = inject(AppliedJobsStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  statusFilter = signal<JobApplicationStatus>('SUBMITTED');
  applications = this.appliedJobsStore.jobApplications;
  user = this.appliedJobsStore.user;

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

  ngOnInit(): void {

    this.route.paramMap
    .subscribe(params => {
      const jobId = Number(params.get('id'));
      if (!jobId) {
        this.router.navigate(['/lk/feed']);
      }
      this.appliedJobsStore.loadJobApplications(jobId);
    });

  }
  
  setStatusFilter(filter: any): void {
    this.statusFilter.set(filter as JobApplicationStatus);
  }

  getFilterButtonClasses(filter: any): string {
    const isActive = this.statusFilter() === filter;
    const baseClasses =
      'mfe-company-px-4 mfe-company-py-2 mfe-company-rounded-lg mfe-company-text-sm mfe-company-font-medium mfe-company-transition mfe-company-duration-200 mfe-company-whitespace-nowrap';

    if (isActive) {
      return `${baseClasses} mfe-company-bg-blue-100 mfe-company-text-blue-700 mfe-company-border mfe-company-border-blue-200`;
    }

    return `${baseClasses} mfe-company-bg-gray-100 mfe-company-text-gray-700 mfe-company-border mfe-company-border-transparent hover:mfe-company-bg-gray-200`;
  }

  getApplicationCount(filter: any): number {
    const apps = this.applications() ?? [];
    return apps.filter(app => this.getLatestStatus(app) === filter).length;
  }

  private getLatestStatus(app: JobApplication): JobApplicationStatus {
    if (!app.pipelineStage || app.pipelineStage.length === 0) {
      return 'SUBMITTED';
    }

    return this.getOrderedTimeline(app)[app.pipelineStage.length - 1].status;
  }

  private getOrderedTimeline(app: JobApplication) {
    return [...(app.pipelineStage ?? [])].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
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

  loadUserInfoEvent(username: string) {
    this.appliedJobsStore.loadUserInfo(username);
  }

}
