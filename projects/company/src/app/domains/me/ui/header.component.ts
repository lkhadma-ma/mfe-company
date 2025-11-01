import { Component, Input, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormHeaderComponent } from "./form-header.component";
import { CompanyHeadlineComponent } from "./company-headline.component";
import { CompanyHeader } from '../data-access/company';

@Component({
  selector: 'mfe-company-header',
  standalone: true,
  imports: [CommonModule, FormsModule, FormHeaderComponent, CompanyHeadlineComponent],
  host: {
    class: 'mfe-company-w-full',
  },
  template: `
    <div class="mfe-company-border mfe-company-rounded-xl mfe-company-bg-white">
      <!-- Header background -->
      <div class="mfe-company-relative mfe-company-aspect-[16/4]">
        <img loading="lazy"
          class="mfe-company-w-full mfe-company-bg-cover mfe-company-bg-center mfe-company-max-h-[201px] mfe-company-border-t-4 mfe-company-rounded-t-md mfe-company-border-[#F8C77D]"
          [src]="company.bg"
          alt="bg"
        />
        <p
          class="mfe-company-absolute mfe-company-text-xs mfe-company-font-medium mfe-company-tracking-widest mfe-company-text-gray-300 mfe-company-uppercase mfe-company-left-1 mfe-company-top-2"
        >
          premium
        </p>

        <!-- Edit background -->
        <span
          *ngIf="isCurrentCompany"
          (click)="loadImageFromDrive('bg')"
          class="mfe-company-cursor-pointer mfe-company-absolute mfe-company-top-0 mfe-company-right-[0.5rem] hover:mfe-company-scale-105 mfe-company-w-10 mfe-company-h-10 mfe-company-rounded-full mfe-company-bg-white mfe-company-flex mfe-company-items-center mfe-company-justify-center mfe-company-shadow-md mfe-company-mt-3 mfe-company-ml-3"
        >
          <i class="fa-solid fa-pencil"></i>
        </span>

      
      </div>

      <!-- Avatar -->
      <div
        class="mfe-company-relative mfe-company-flex mfe-company-items-center mfe-company-justify-center max-sm:-mfe-company-mt-[2.5rem] -mfe-company-mt-[6rem] mfe-company-ml-[2rem] max-sm:mfe-company-w-[5rem] max-sm:mfe-company-h-[5rem] mfe-company-h-[150px] mfe-company-w-[150px] mfe-company-rounded-full mfe-company-bg-white"
      >
        <!-- Edit avatar -->
        <span
            *ngIf="isCurrentCompany"
            (click)="loadImageFromDrive('avatar')"
            class="mfe-company-z-[12] mfe-company-cursor-pointer mfe-company-absolute mfe-company-top-0 mfe-company-right-[-0.5rem] hover:mfe-company-scale-105 mfe-company-w-10 mfe-company-h-10 mfe-company-rounded-full mfe-company-bg-white mfe-company-flex mfe-company-items-center mfe-company-justify-center mfe-company-shadow-md mfe-company-mt-3 mfe-company-mr-3"
          >
            <i class="fa-solid fa-pencil"></i>
        </span>
        <img
          class="mfe-company-z-10 mfe-company-w-full mfe-company-h-full mfe-company-border-white mfe-company-border-4 mfe-company-rounded-full"
          [src]="company.avatar"
          alt="Me"
          loading="lazy"
        />
      </div>

      <!-- Name + Headline + Skills -->
      <div class="mfe-company-flex mfe-company-flex-col mfe-company-px-4 mfe-company-py-3 mfe-company-relative">
        <span
            *ngIf="isCurrentCompany"
            (click)="from()?.openHeaderModal()"
            class="mfe-company-z-10 mfe-company-cursor-pointer mfe-company-absolute mfe-company-top-[-4rem] mfe-company-right-[-.25rem] hover:mfe-company-scale-105 mfe-company-w-10 mfe-company-h-10 mfe-company-rounded-full mfe-company-bg-white mfe-company-flex mfe-company-items-center mfe-company-justify-center mfe-company-shadow-md mfe-company-mt-3 mfe-company-mr-3"
          >
            <i class="fa-solid fa-pencil"></i>
        </span>
          <h1
            class="mfe-company-font-semibold mfe-company-tracking-wide sm:mfe-company-text-2xl"
          >
            {{ company.name }}
          </h1>

        <!-- Headline -->
          <mfe-company-headline>
            {{ company.headline }}
          </mfe-company-headline>
      </div>
    </div>
    @if (isCurrentCompany) {
      <mfe-company-form-header
        (onSubmit)="updateHeader($event)" 
        [initialData]="{
          name: company.name,
          headline: company.headline
        }"
      >
      </mfe-company-form-header>
    }
  `,
})
export class HeaderComponent {
  from = viewChild(FormHeaderComponent);
  update = output<{
    name?: string;
    headline?: string;
    avatar?:File;
    bg?:File;
    action:string;
  }>();
  @Input() isCurrentCompany: boolean = false;
  @Input() company!: CompanyHeader;

  updateHeader(data: { name: string; headline: string }) {
    const dataWithAction = { ...data, action: 'name&headline' };
    this.update.emit(dataWithAction);
  }

  updateBg(imageBase64: { bg: File }) {
    const dataWithAction = { ...imageBase64, action: 'bg' };
    this.update.emit(dataWithAction);
  }

  updateAvatar(data: { avatar: File }) {
    const dataWithAction = { ...data, action: 'avatar' };
    this.update.emit(dataWithAction);
  }

  loadImageFromDrive(type: 'avatar' | 'bg') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        if (type === 'avatar') {
          this.updateAvatar({ avatar: file });
        } else {
          this.updateBg({ bg: file });
        }
      }
    };
  }
}
