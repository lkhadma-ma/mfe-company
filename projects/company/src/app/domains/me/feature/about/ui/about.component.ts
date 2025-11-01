import { Component, input } from '@angular/core';

@Component({
    selector: 'mfe-company-about',
    template:`
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
        <p>{{about()?.overview}}</p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
        Website
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
        <p>
            <a class="mfe-company-text-blue-600 mfe-company-underline mfe-company-cursor-pointer" href="{{about()?.website}}" target="_blank" rel="noopener noreferrer">
            {{about()?.website}}
            </a>
        </p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
        Industry
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
        <p>{{about()?.industry}}</p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
        Company Size
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
        <p>{{about()?.companySize}} Employees</p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
        Founded
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
        <p>{{about()?.founded}}</p>
    </div>
    <h3 class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-md mfe-company-mt-4 mfe-company-flex mfe-company-justify-between">
        Specialties
    </h3>
    <div class="mfe-company-w-full mfe-company-text-gray-500 mfe-company-text-md mfe-company-leading-7">
        <p>{{about()?.specialties}}</p>
    </div>
    `
})

export class AboutComponent {

    about = input<{
        overview: string;
        website: string;
        industry: string;
        companySize: string;
        founded: string;
        specialties: string;
    }>();
    
}