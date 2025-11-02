import {
  Component,
  ContentChildren,
  QueryList,
  input,
  signal,
  effect,
  TemplateRef,
  AfterContentInit,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mfe-company-tap',
  standalone: true,
  template: ``
})
export class TapComponent {
  label = input<string>('');
  isActive = signal(false);
}

@Component({
  selector: 'mfe-company-content',
  standalone: true,
  template: `<ng-content></ng-content>`
})
export class ContentComponent {
  label = input<string>('');
  template = input<TemplateRef<unknown>>();
}

@Component({
  selector: 'mfe-company-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="mfe-company-border mfe-company-rounded-lg mfe-company-bg-white">
  <div class="mfe-company-px-4 mfe-company-pt-4 mfe-company-space-y-2">
    <div class="mfe-company-border-b mfe-company-border-gray-200">
      <nav class="mfe-company-flex mfe-company-space-x-8 mfe-company-overflow-x-auto mfe-company-no-scrollbar">
        <button
          *ngFor="let tab of tabs"
          (click)="selectTab(tab.label())"
          [class]="getTabClass(tab.label())">
          {{ tab.label() }}
        </button>
      </nav>
    </div>
  </div>
</div>

<div class="mfe-company-space-y-2">
  <div class="mfe-company-mt-4">
    <ng-container *ngFor="let content of contents">
      <ng-container *ngIf="activeTab() === content.label() && content.template()">
        <ng-container *ngTemplateOutlet="content.template()"></ng-container>
      </ng-container>
    </ng-container>
  </div>
</div>
  `
})
export class TabsComponent implements AfterContentInit {
  activeTab = input<string>('');
  onChange = output<string>();

  @ContentChildren(TapComponent) tabs!: QueryList<TapComponent>;
  @ContentChildren(ContentComponent) contents!: QueryList<ContentComponent>;

  constructor() {
    effect(() => {
      const current = this.activeTab();
      this.tabs?.forEach(t => t.isActive.set(t.label() === current));
    });
  }

  ngAfterContentInit() {
    const initial = this.activeTab() || this.tabs.first?.label() || '';
    this.onChange.emit(initial);
  }

  selectTab(tab: string): void {
    this.onChange.emit(tab);
  }

  getTabClass(tab: string): string {
    const base =
      'mfe-company-py-2 mfe-company-px-1 mfe-company-font-medium mfe-company-text-sm mfe-company-whitespace-nowrap mfe-company-focus:outline-none';
    return this.activeTab() === tab
      ? `${base} mfe-company-border-b-2 mfe-company-border-blue-500 mfe-company-text-blue-600`
      : `${base} mfe-company-border-b-2 mfe-company-border-transparent mfe-company-text-gray-500 hover:mfe-company-text-gray-700 hover:mfe-company-border-gray-300`;
  }
}
