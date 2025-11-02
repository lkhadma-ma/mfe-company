import { Component, OnInit, input, output } from '@angular/core';
import { SectionComponent } from "./section.component";

@Component({
    selector: 'mfe-company-overview',
    host: { class: 'mfe-company-w-full' },
    template: `
    <mfe-company-section>
        <h1 class="mfe-user-font-semibold mfe-user-tracking-wide sm:mfe-user-text-xl mfe-user-mb-5 mfe-user-flex mfe-user-justify-between">
        Overview
        </h1>
        <p class="mfe-company-text-gray-700 mfe-company-text-base">
            {{ overview() }}
        </p>
        <div (click)="onChangeTab.emit()" class="mfe-company-mt-4 mfe-company-w-full mfe-company-justify-center mfe-company-flex mfe-company-items-center mfe-company-border-t mfe-company-pt-4 mfe-company-cursor-pointer">
            <div class="mfe-company-space-x-1 mfe-company-flex mfe-company-items-center mfe-company-justify-center mfe-company-gap-2 mfe-company-font-medium mfe-company-hover:underline">
            <span>Show more details</span><i class="fa-solid fa-right-long mfe-company-text-[10px] mfe-company-relative -mfe-company-bottom-[2px]"></i>
            </div>
        </div>
    </mfe-company-section>
    `,
    imports: [SectionComponent]
})

export class OverviewComponent {
    overview = input<string>('');
    onChangeTab = output<void>();
}