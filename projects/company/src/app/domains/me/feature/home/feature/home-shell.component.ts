import { Component, OnInit, inject } from '@angular/core';
import { SectionComponent } from "../ui/section.component";
import { OverviewComponent } from "../ui/overview.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mfe-company-home-shell',
  host: { class: 'mfe-company-w-full mfe-company-space-y-4' },
  template: `
  <mfe-company-overview (onChangeTab)="onChangeTab('About')" overview="We are looking for a skilled Software Engineer to join our dynamic team. The ideal candidate will have experience in developing high-quality software solutions and a passion for technology."></mfe-company-overview>
  
  `,
  imports: [OverviewComponent]
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
