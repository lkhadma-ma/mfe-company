import { Component, OnInit, inject, signal } from '@angular/core';
import { SectionComponent } from '@shared/ui/section/section.component';
import { CompanyStore } from '../data-access/company-store';
import { HeaderComponent } from "../ui/header.component";
import { ActivatedRoute, Router } from '@angular/router';
import { TabsComponent, TapComponent, ContentComponent } from "../ui/taps.component";
import { HomeShellComponent } from "./home/feature/home-shell.component";
import { AboutShellComponent } from "./about/feature/about-shell.component";
import { JobsShellComponent } from "./jobs/feature/jobs-shell.component";


@Component({
  selector: 'mfe-company-me-shell',
  imports: [SectionComponent, HeaderComponent, TabsComponent, TapComponent, ContentComponent, HomeShellComponent, AboutShellComponent, JobsShellComponent],
  template: `
    <app-section ngxClass="md:mfe-company-pt-[5rem] mfe-company-min-h-screen" >
      <div class="mfe-company-w-full mfe-company-mb-40 md:mfe-company-space-x-6 md:mfe-company-flex">
        <div class="mfe-company-w-full">
          <div class="mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-4">
          @let company = companyInStore();
          @let isCurrentCompany = isCurrentCompanyInStore();
          @if(company){
            <mfe-company-header [isCurrentCompany]="isCurrentCompany" [company]="company" (update)="updateHeader($event)"></mfe-company-header>
            <mfe-company-tabs [activeTab]="activeTab()" (onChange)="onChangeTab($event)">
              <mfe-company-tap label="Home"></mfe-company-tap>
              <mfe-company-tap label="About"></mfe-company-tap>
              <mfe-company-tap label="Jobs"></mfe-company-tap>

              <mfe-company-content label="Home" [template]="home">
                <ng-template #home>
                <mfe-company-home-shell></mfe-company-home-shell>
                </ng-template>
              </mfe-company-content>

              <mfe-company-content label="About" [template]="about">
                <ng-template #about>
                <mfe-company-about-shell [isCurrentCompany]="isCurrentCompany"></mfe-company-about-shell>
                </ng-template>
              </mfe-company-content>
              
              <mfe-company-content label="Jobs" [template]="jobs">
                <ng-template #jobs>
                <mfe-company-jobs-shell [isCurrentCompany]="isCurrentCompany"></mfe-company-jobs-shell>
                </ng-template>
              </mfe-company-content>
            </mfe-company-tabs>

          }
          </div>
        </div>
        <div class="mfe-company-hidden mfe-company-w-[400px] lg:mfe-company-block">

        </div>
      </div>
    </app-section>
  `,
})
export class MeShellComponent implements OnInit {
  private companyStore = inject(CompanyStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  activeTab = signal('Home');
  companyInStore = this.companyStore.company;
  isCurrentCompanyInStore  = this.companyStore.isCurrentcompany;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const companyname = params.get('username')!;
      this.companyStore.loadCompany(companyname);
    });
    this.route.queryParamMap.subscribe(params => {
      const activeTab = params.get('tab');
      if (activeTab) this.activeTab.set(activeTab);
    });
  }

  updateHeader(data: { name?: string; headline?: string; avatar?:File; bg?:File; action:string; }) {
    this.companyStore.updateHeader(data);
  }

  onChangeTab(tab: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    }).then(() => {
      this.activeTab.set(tab);
    });
  }
}
