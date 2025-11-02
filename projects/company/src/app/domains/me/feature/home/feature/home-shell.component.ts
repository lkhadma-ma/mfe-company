import { Component, inject } from '@angular/core';
import { OverviewComponent } from "../ui/overview.component";
import { ActivatedRoute, Router } from '@angular/router';
import { RecentJobOpeningsComponent } from "../ui/recent-job-openings.component";

@Component({
  selector: 'mfe-company-home-shell',
  host: { class: 'mfe-company-w-full mfe-company-flex mfe-company-flex-col mfe-company-space-y-4' },
  template: `
  <mfe-company-overview (onChangeTab)="onChangeTab('About')" overview="We are looking for a skilled Software Engineer to join our dynamic team. The ideal candidate will have experience in developing high-quality software solutions and a passion for technology."></mfe-company-overview>
  <mfe-company-recent-job-openings (onChangeTab)="onChangeTab('Jobs')" [job]="{
    id: 'job-123',
    position: 'Software Engineer',
    location: 'Remote',
    company: {
      avatar: 'http://localhost:8081/mbe-mutli-media/api/drive/view/d/197WU2awWwfbmCFmKACxqRgVEjttlMP3T',
    }
  }" ></mfe-company-recent-job-openings>
  `,
  imports: [OverviewComponent, RecentJobOpeningsComponent]
})
export class HomeShellComponent {

  #router = inject(Router);
  #route = inject(ActivatedRoute);

  onChangeTab(tab: string) {
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }

}
