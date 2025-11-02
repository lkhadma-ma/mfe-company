import { Component, input, output } from '@angular/core';
import { SectionComponent } from "./section.component";
import { Job } from '../data-access/job';

@Component({
    selector: 'mfe-company-recent-job-openings',
    template: `
    <mfe-company-section>
        <h1 class="mfe-user-font-semibold mfe-user-tracking-wide sm:mfe-user-text-xl mfe-user-mb-5 mfe-user-flex mfe-user-justify-between">
            Recent Job Openings
        </h1>
        <p class="mfe-company-text-gray-700 mfe-company-text-base">
            @let jobIn = job();
            @if (jobIn) {
                <div class="mfe-company-w-full mfe-company-flex">
                    <img [src]="jobIn.company.avatar" alt="avatar" class="mfe-company-w-14 mfe-company-h-14 mfe-company-rounded-md mfe-company-object-cover mfe-company-mr-4"/>
                    <div class="mfe-company-flex mfe-company-flex-col">
                        <h2 class="mfe-company-text-md mfe-company-font-bold mfe-company-mt-1">{{jobIn.position}}</h2>
                        <p class="mfe-company-text-sm mfe-company-text-gray-700 mfe-company-mb-4">{{jobIn.location}}</p>
                    </div>
                </div>
            }@else {
                No recent job openings available.
            }
        </p>
        <div (click)="onChangeTab.emit()" class="mfe-company-mt-4 mfe-company-w-full mfe-company-justify-center mfe-company-flex mfe-company-items-center mfe-company-border-t mfe-company-pt-4 mfe-company-cursor-pointer">
            <div class="mfe-company-space-x-1 mfe-company-flex mfe-company-items-center mfe-company-justify-center mfe-company-gap-2 mfe-company-font-medium mfe-company-hover:underline">
            <span>Show more Jobs</span><i class="fa-solid fa-right-long mfe-company-text-[10px] mfe-company-relative -mfe-company-bottom-[2px]"></i>
            </div>
        </div>
    </mfe-company-section>
    `,
    imports: [SectionComponent]
})

export class RecentJobOpeningsComponent {
    job = input<Job>();
    onChangeTab = output<void>();
}