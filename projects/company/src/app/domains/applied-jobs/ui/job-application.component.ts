import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobApplication, JobApplicationStatus, NewPipelineStage, PipelineStage } from '../data-access/job-application';
import { LoadingUserComponent } from "./loading-user.component";
import { MarkdownPipe } from '@shared/pipe/markdown.pipe';
import { User } from '../data-access/user';
import { FormStatusComponent } from "./form-status.component";

@Component({
  selector: 'mfe-company-job-application',
  standalone: true,
  imports: [CommonModule, LoadingUserComponent, MarkdownPipe, FormStatusComponent],
  template: `

    @let app = application();
    @if (app) {

      <div class="mfe-company-bg-white mfe-company-border mfe-company-border-gray-200 mfe-company-rounded-xl mfe-company-shadow-sm mfe-company-overflow-hidden">

        <!-- Header -->
        <div
             class="mfe-company-p-6 max-sm:mfe-company-p-2 mfe-company-border-b mfe-company-border-gray-200">

          <div class="mfe-company-flex mfe-company-items-center mfe-company-gap-4">

            <!-- Company Avatar -->
            <img [src]="app.user.avatar"
                 [alt]="app.user.name"
                 (click)="toggleAccordion()"
                 class="max-sm:mfe-company-w-8 max-sm:mfe-company-h-8 mfe-company-w-12 mfe-company-h-12 mfe-company-rounded-full mfe-company-object-cover mfe-company-border mfe-company-border-gray-200">

            <!-- Job Info -->
            <div class="mfe-company-flex-1 mfe-company-select-none ">
              <h3 (click)="toggleAccordion()"
                  class="mfe-company-cursor-pointer mfe-company-text-sm sm:mfe-company-text-lg mfe-company-font-semibold sm:mfe-company-w-max mfe-company-text-gray-900">
                {{ app.user.name }}
              </h3>
              <p class="mfe-company-text-gray-600 mfe-company-mt-1 mfe-company-text-xs sm:mfe-company-text-md sm:mfe-company-w-max">
                {{ app.user.headline }}
              </p>
            </div>

            <!-- Status Badge -->
            <span [class]="statusBadgeClasses()"
                  class="mfe-company-select-none max-424:mfe-company-hidden mfe-company-px-3 mfe-company-py-1 mfe-company-rounded-full mfe-company-text-sm mfe-company-font-medium">
              {{ getStatusText() }}
            </span>

          </div>
        </div>

        @if (openAccordion()) {

          @if (user()===undefined) {
            <mfe-company-loading-user />
          } @else if(user()===null) {
            <div class="mfe-company-p-6 mfe-company-text-gray-500 mfe-company-text-center">
              <div class="mfe-company-text-sm">
                Reopen to load it again.
              </div>
              <div>
                Unable to load candidate profile.
              </div>
            </div>

          } @else {
            <!-- profile -->
            <div class="mfe-company-p-3 sm:mfe-company-p-6">
            <h1 class="mfe-user-font-semibold mfe-user-tracking-wide sm:mfe-user-text-xl mfe-user-mb-4 mfe-user-flex mfe-user-justify-between mfe-company-items-center">
                <span>Candidate's Contact Information </span>
              </h1>
              <div class="mfe-company-flex mfe-company-items-center mfe-company-gap-4 mfe-company-mb-4 mfe-company-text-gray-600 mfe-company-text-sm">
                <i class="fa-solid fa-phone mfe-company-mr-2 mfe-company-text-gray-500"></i>
                <span>+{{user()?.phone}}</span>
              </div>
              <h1 class="mfe-user-font-semibold mfe-user-tracking-wide sm:mfe-user-text-xl mfe-user-mb-4 mfe-user-flex mfe-user-justify-between mfe-company-items-center">
                <span>About the Candidate</span>

                <span class="max-sm:mfe-company-hidden mfe-company-text-gray-600 mfe-company-text-sm mfe-company-font-bold mfe-company-flex mfe-company-items-center mfe-company-gap-1 mfe-company-border-1 mfe-company-rounded-md mfe-company-px-3 mfe-company-py-2 mfe-company-border-gray-300 mfe-company-bg-gray-50 hover:mfe-company-bg-gray-100 mfe-company-max-w-max">
                  See Full Profile <i class="fa-solid fa-square-arrow-up-right"></i>
                </span>
              </h1>
              <div class="pose" [innerHTML]="user()?.about ?? '' | markdown"></div>
              <a [href]="'/lk/' + application()?.user?.username" target="_blank" class="sm:mfe-company-hidden mfe-company-mt-4 mfe-company-text-gray-600 mfe-company-text-sm mfe-company-font-bold mfe-company-flex mfe-company-items-center mfe-company-gap-1 mfe-company-border-1 mfe-company-rounded-md mfe-company-px-3 mfe-company-py-2 mfe-company-border-gray-300 mfe-company-bg-gray-50 hover:mfe-company-bg-gray-100 mfe-company-max-w-max">
                  See Full Profile <i class="fa-solid fa-square-arrow-up-right"></i>
              </a>
            </div>
          }
        }
      </div>
      <mfe-company-form-status [latestStatus]="getLatestStatus()" (onSubmit)="onSubmitStatusChange.emit({
        jobApplicationId: app.id,
        pipelineStage: $event
      })" />
    }
  `,
})
export class JobApplicationComponent {

  application = input<JobApplication>();
  user = input<User | undefined | null>();

  loadUserInfoEvent = output<string>();
  onSubmitStatusChange = output<{
    jobApplicationId: number;
    pipelineStage: NewPipelineStage;
  }>();
  
  openAccordion = signal<boolean>(false);

  getLatestStatus = computed(() => {
    const app = this.application();
    if (!app) return;
  
    const sorted = this.getOrderedTimeline(app);
    if (!sorted.length) return 'SUBMITTED';
  
    return sorted[sorted.length - 1].status;
  });
  
  /** Sort pipeline stages by createdAt ascending */
  private getOrderedTimeline(app: JobApplication) {
    return [...(app.pipelineStage ?? [])].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  /** Badge text */
  getStatusText = computed(() => {
    const status = this.getLatestStatus();
    return {
      SUBMITTED: 'Submitted',
      VIEWED: 'Viewed',
      INTERVIEW: 'Interview',
      ACCEPTED: 'Accepted',
      REJECTED: 'Rejected',
      PASSED: 'Passed'
    }[status || 'SUBMITTED'];
  });

  /** Badge classes */
  statusBadgeClasses = computed(() => {
    const status = this.getLatestStatus();

    const base = 'mfe-company-px-3 mfe-company-py-1 mfe-company-rounded-full mfe-company-text-sm mfe-company-font-medium';
    if (!status) return base;

    const map = {
      SUBMITTED: 'mfe-company-bg-blue-100 mfe-company-text-blue-800',
      VIEWED: 'mfe-company-bg-purple-100 mfe-company-text-purple-800',
      INTERVIEW: 'mfe-company-bg-yellow-100 mfe-company-text-yellow-800',
      ACCEPTED: 'mfe-company-bg-green-100 mfe-company-text-green-800',
      REJECTED: 'mfe-company-bg-red-100 mfe-company-text-red-800',
      PASSED: 'mfe-company-bg-teal-100 mfe-company-text-teal-800',
    };
    return `${base} ${map[status]}`;
  }); 

  toggleAccordion() {

    const app = this.application();
    if(!this.openAccordion()){
      if (!app) return;
      this.loadUserInfoEvent.emit(app.user.username);
    }
    this.openAccordion.set(!this.openAccordion());
  }

  openUserProfile() {
    const app = this.application();
    if (!app) return;

    this.onSubmitStatusChange.emit({
      jobApplicationId: app.id,
      pipelineStage: {
        status: 'VIEWED',
      }
    });
    
    window.open(`/lk/${app.user.username}`, '_blank');
  }
}
