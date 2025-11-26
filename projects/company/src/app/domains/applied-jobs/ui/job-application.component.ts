import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobApplication, JobApplicationStatus } from '../data-access/job-application';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mfe-company-job-application',
  standalone: true,
  imports: [CommonModule],
  template: `

    @let app = application();
    @if (app) {

      <div class="mfe-company-bg-white mfe-company-border mfe-company-border-gray-200 mfe-company-rounded-xl mfe-company-shadow-sm mfe-company-overflow-hidden">

        <!-- Header -->
        <div (click)="openAccordion.set(!openAccordion())"
             class="mfe-company-p-6 max-sm:mfe-company-p-2 mfe-company-border-b mfe-company-border-gray-200">

          <div class="mfe-company-flex mfe-company-items-center mfe-company-gap-4">

            <!-- Company Avatar -->
            <img [src]="app.user.avatar"
                 [alt]="app.user.name"
                 class="max-sm:mfe-company-w-8 max-sm:mfe-company-h-8 mfe-company-w-12 mfe-company-h-12 mfe-company-rounded-full mfe-company-object-cover mfe-company-border mfe-company-border-gray-200">

            <!-- Job Info -->
            <div class="mfe-company-flex-1">
              <h3 
                  class="mfe-company-cursor-pointer mfe-company-text-sm sm:mfe-company-text-lg mfe-company-font-semibold sm:mfe-company-w-max mfe-company-text-gray-900">
                {{ app.user.name }}
              </h3>
              <p class="mfe-company-text-gray-600 mfe-company-mt-1 mfe-company-text-xs sm:mfe-company-text-md">
                {{ app.user.headline }}
              </p>
            </div>

            <!-- Status Badge -->
            <span [class]="statusBadgeClasses()"
                  class="max-424:mfe-company-hidden mfe-company-px-3 mfe-company-py-1 mfe-company-rounded-full mfe-company-text-sm mfe-company-font-medium">
              {{ getStatusText() }}
            </span>

          </div>
        </div>

        @if (openAccordion()) {

          <!-- profile -->
          <div class="mfe-company-p-6">
            
          </div>
        }
      </div>
    }
  `,
})
export class JobApplicationComponent {
  openAccordion = signal<boolean>(false);
  application = input<JobApplication>();

  private getLatestStatus = computed(() => {
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

}
