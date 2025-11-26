import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobApplication, JobApplicationMessage, JobApplicationStatus } from '../data-access/job-application';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mfe-company-job-application',
  standalone: true,
  imports: [CommonModule],
  template: `

    @let app = application();
    @if (app) {

      @let timeline = getOrderedTimeline(app);
      @let latestIndexValue = latestIndex(timeline);

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
            <span [class]="statusBadgeClasses(getLatestStatus(app))"
                  class="max-424:mfe-company-hidden mfe-company-px-3 mfe-company-py-1 mfe-company-rounded-full mfe-company-text-sm mfe-company-font-medium">
              {{ getStatusText(getLatestStatus(app)) }}
            </span>

          </div>
        </div>

        @if (openAccordion()) {

          <!-- Timeline -->
          <div class="mfe-company-p-6">
            <div class="mfe-company-relative">

              <!-- Vertical line -->
              <div class="mfe-company-absolute mfe-company-left-[.95rem] mfe-company-top-0 mfe-company-bottom-0 mfe-company-w-0.5 mfe-company-bg-gray-200"></div>

              <div class="mfe-company-space-y-6">

                @for(stage of timeline; track stage.createdAt) {

                  @let index = stageIndex(stage, timeline);

                  <div class="mfe-company-relative mfe-company-flex mfe-company-gap-4">

                    <!-- Circle / Icon -->
                    <div [class]="getStepClasses(index, latestIndexValue)"
                         class="mfe-company-w-8 mfe-company-h-8 mfe-company-rounded-full mfe-company-flex mfe-company-items-center mfe-company-justify-center mfe-company-z-10 mfe-company-border-2">
                      <i class="{{ getIcon(stage.status) }} mfe-company-text-xs"></i>
                    </div>

                    <!-- Content -->
                    <div class="mfe-company-flex-1 mfe-company-pb-6">
                      <p class="mfe-company-font-medium mfe-company-text-gray-900">{{ getTitle(stage.status) }}</p>
                      @if(stage.status === 'SUBMITTED' || stage.status === 'VIEWED') {
                        <p class="mfe-company-text-sm mfe-company-text-gray-500 mfe-company-mt-1">
                            Your application has been sent
                        </p>
                      } @else {
                           
                        @if(stage?.note) {
                            <div class="mfe-company-bg-blue-50  mfe-company-border mfe-company-border-blue-200 mfe-company-rounded-lg mfe-company-p-4 mfe-company-mt-4">
                            <p class="mfe-company-text-sm mfe-company-text-blue-800">{{ stage?.note }}</p>
                            </div>
                        }
                      }
                    </div>

                  </div>
                }
              </div>

            </div>
          </div>
        }
      </div>
    }
  `,
})
export class JobApplicationComponent {
  openAccordion = signal<boolean>(false);
  application = input<JobApplication>();

  /** Get latest status from pipeline */
  getLatestStatus(app: JobApplication): JobApplicationStatus {
    return app.pipelineStage?.length
      ? app.pipelineStage[app.pipelineStage.length - 1].status
      : 'SUBMITTED';
  }

  /** Sort pipeline stages by createdAt ascending */
  getOrderedTimeline(app: JobApplication) {
    return [...(app.pipelineStage ?? [])].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  /** Get index of stage in timeline */
  stageIndex(stage: any, timeline: any[]): number {
    return timeline.indexOf(stage);
  }

  /** Get index of latest stage */
  latestIndex(timeline: any[]): number {
    return timeline.length - 1;
  }

  /** Step highlight classes */
  getStepClasses(stepIndex: number, latestIndex: number): string {
    if (stepIndex < latestIndex) {
      return 'mfe-company-bg-green-500 mfe-company-border-green-500 mfe-company-text-white';
    }
    if (stepIndex === latestIndex) {
      return 'mfe-company-bg-white mfe-company-border-green-500 mfe-company-text-green-500';
    }
    return 'mfe-company-bg-gray-100 mfe-company-border-gray-300 mfe-company-text-gray-400';
  }

  /** Map status to icons */
  getIcon(status: JobApplicationStatus): string {
    return {
      SUBMITTED: 'fa-solid fa-paper-plane',
      VIEWED: 'fa-solid fa-eye',
      INTERVIEW: 'fa-solid fa-calendar',
      ACCEPTED: 'fa-solid fa-check',
      REJECTED: 'fa-solid fa-times',
      PASSED: 'fa-solid fa-check-double'
    }[status];
  }

  /** Map status to titles */
  getTitle(status: JobApplicationStatus): string {
    return {
      SUBMITTED: 'Submitted',
      VIEWED: 'Viewed',
      INTERVIEW: 'Interview',
      ACCEPTED: 'Accepted',
      REJECTED: 'Rejected',
      PASSED: 'Passed'
    }[status];
  }

  /** Badge text */
  getStatusText(status: JobApplicationStatus): string {
    return {
      SUBMITTED: 'Submitted',
      VIEWED: 'Viewed',
      INTERVIEW: 'Interview',
      ACCEPTED: 'Accepted',
      REJECTED: 'Rejected',
      PASSED: 'Passed'
    }[status];
  }

  /** Badge classes */
  statusBadgeClasses(status: JobApplicationStatus): string {
    const base = 'mfe-company-px-3 mfe-company-py-1 mfe-company-rounded-full mfe-company-text-sm mfe-company-font-medium';
    const map = {
      SUBMITTED: 'mfe-company-bg-blue-100 mfe-company-text-blue-800',
      VIEWED: 'mfe-company-bg-purple-100 mfe-company-text-purple-800',
      INTERVIEW: 'mfe-company-bg-yellow-100 mfe-company-text-yellow-800',
      ACCEPTED: 'mfe-company-bg-green-100 mfe-company-text-green-800',
      REJECTED: 'mfe-company-bg-red-100 mfe-company-text-red-800',
      PASSED: 'mfe-company-bg-teal-100 mfe-company-text-teal-800',
    };
    return `${base} ${map[status]}`;
  }

  getMessageForStatus(status: JobApplicationMessage): string {

    const messageMap: Record<JobApplicationMessage, string> = {
      SUBMITTED: 'Your application has been submitted successfully.',
      VIEWED: 'The employer has viewed your application.',
    };
    
    return messageMap[status];
  }
}
