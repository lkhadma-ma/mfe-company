import { Component, Injector, OnInit, ViewChild, ViewContainerRef, effect, inject, signal } from '@angular/core';
import { SectionComponent } from '@shared/ui/section/section.component';
import { CompanyStore } from '../data-access/company-store';
import { HeaderComponent } from "../ui/header.component";
import { ActivatedRoute, Router } from '@angular/router';
import { TabsComponent, TapComponent, ContentComponent } from "../ui/taps.component";
import { HomeShellComponent } from "./home/feature/home-shell.component";
import { AboutShellComponent } from "./about/feature/about-shell.component";
import { JobsShellComponent } from "./jobs/feature/jobs-shell.component";
import { loadRemoteModule } from '@angular-architects/native-federation';


@Component({
  selector: 'mfe-company-me-shell',
  imports: [SectionComponent, HeaderComponent, TabsComponent, TapComponent, ContentComponent, HomeShellComponent, AboutShellComponent, JobsShellComponent],
  template: `
    <mfe-company-section ngxClass="md:mfe-company-pt-[5rem]" >
      <div class="mfe-company-w-full mfe-company-mb-40 md:mfe-company-space-x-6 md:mfe-company-flex">
        <div class="mfe-company-w-full">
          <div class="mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-4">
          @let company = companyInStore();
          @let isCurrentCompany = isCurrentCompanyInStore();
          @if(company){
            <mfe-company-header [isCurrentCompany]="isCurrentCompany" [company]="company" (update)="updateHeader($event)"></mfe-company-header>
            <mfe-company-tabs [activeTab]="activeTab()" (onChange)="onChangeTab($event)">

              @for (avinableTab of avinableTabs; track $index) {
                <mfe-company-tap [label]="avinableTab"></mfe-company-tap>
              }

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
          <ng-template #switchAccount></ng-template>
        </div>
      </div>
    </mfe-company-section>
  `,
})
export class MeShellComponent implements OnInit {
  private companyStore = inject(CompanyStore);
  private injector = inject(Injector);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeTab = signal('Home');
  avinableTabs = ['Home', 'About', 'Jobs'];

  companyInStore = this.companyStore.company;
  isCurrentCompanyInStore  = this.companyStore.isCurrentcompany;

  @ViewChild('switchAccount', { read: ViewContainerRef, static: true })
  switchAccountContainer!: ViewContainerRef;
  
  constructor() {
    effect(() => {
      if (this.isCurrentCompanyInStore()) {
        this.loadsSwitchAccountComponent();
      } else {
        this.switchAccountContainer.clear();
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const companyname = params.get('username')!;
      this.companyStore.loadCompany(companyname);
    });
    this.route.queryParamMap.subscribe(params => {
      const activeTab = params.get('tab');
      if(activeTab && this.avinableTabs.includes(activeTab)){
        this.activeTab.set(activeTab);
        return;
      }
      this.activeTab.set('Home');
    });
  }

  async loadsSwitchAccountComponent() {
    const switchAccountModule = await loadRemoteModule({
      remoteName: 'shared', 
      exposedModule: './ShellSwitchAccountComponent'
    });

    const shellSwitchAccountComponent = switchAccountModule.ShellSwitchAccountComponent;

    this.switchAccountContainer.createComponent(shellSwitchAccountComponent, { injector: this.injector });
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
