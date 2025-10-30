import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'mfe-company-multi-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mfe-company-relative mfe-company-w-full">
  <!-- Selected Tags Display -->
  <div 
    class="mfe-company-flex mfe-company-flex-wrap mfe-company-items-center mfe-company-gap-2 mfe-company-p-3 mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-lg mfe-company-min-h-[44px] mfe-company-cursor-pointer mfe-company-bg-white mfe-company-transition-colors mfe-company-duration-200"
    [class.mfe-company-border-red-500]="isInvalid"
    [class.mfe-company-border-blue-500]="isOpen"
    [class.mfe-company-ring-2]="isOpen"
    [class.mfe-company-ring-blue-200]="isOpen"
    (click)="toggleDropdown()"
  >
    <!-- Selected Tags -->
    <div 
      *ngFor="let selectedOption of selectedOptions; let i = index" 
      class="mfe-company-bg-blue-50 mfe-company-text-blue-700 mfe-company-px-3 mfe-company-py-1.5 mfe-company-rounded-full mfe-company-text-sm mfe-company-flex mfe-company-items-center mfe-company-gap-2 mfe-company-border mfe-company-border-blue-200 mfe-company-transition-colors mfe-company-duration-150"
    >
      <span class="mfe-company-font-medium">{{ selectedOption.label }}</span>
      <button 
        type="button"
        (click)="removeTag($event, i)"
        class="mfe-company-w-5 mfe-company-h-5 mfe-company-rounded-full mfe-company-bg-blue-100 hover:mfe-company-bg-blue-200 mfe-company-flex mfe-company-items-center mfe-company-justify-center mfe-company-text-blue-600 hover:mfe-company-text-blue-800 mfe-company-transition-colors mfe-company-duration-150 mfe-company-text-xs mfe-company-font-bold"
      >
        ×
      </button>
    </div>

    <!-- Input for new tags -->
    <input
      *ngIf="mode === 'tags'"
      #tagInput
      type="text"
      [placeholder]="selectedOptions.length === 0 ? placeholder : 'Add more...'"
      (keydown)="onTagInputKeydown($event)"
      (blur)="onTagInputBlur()"
      class="mfe-company-outline-none mfe-company-min-w-[120px] mfe-company-flex-1 mfe-company-bg-transparent mfe-company-text-gray-700 mfe-company-placeholder-gray-400"
    >

    <!-- Placeholder when no selection -->
    <div 
      *ngIf="selectedOptions.length === 0 && mode !== 'tags'" 
      class="mfe-company-text-gray-500 mfe-company-text-sm mfe-company-italic"
    >
      {{ placeholder }}
    </div>
  </div>

  <!-- Dropdown Arrow -->
  <div class="mfe-company-absolute mfe-company-top-1/2 mfe-company-right-3 mfe-company-transform mfe-company--translate-y-1/2 mfe-company-pointer-events-none mfe-company-transition-transform mfe-company-duration-200"
       [class.mfe-company-rotate-180]="isOpen">
    <svg class="mfe-company-w-4 mfe-company-h-4 mfe-company-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </div>

  <!-- Dropdown Menu -->
  <div 
    *ngIf="isOpen"
    class="mfe-company-absolute mfe-company-z-50 mfe-company-w-full mfe-company-bg-white mfe-company-border mfe-company-border-gray-200 mfe-company-rounded-lg mfe-company-shadow-xl mfe-company-mt-2 mfe-company-max-h-60 mfe-company-overflow-y-auto mfe-company-animate-in mfe-company-fade-in mfe-company-slide-in-from-top-1"
  >
    <!-- Search Input -->
    <div *ngIf="searchable" class="mfe-company-sticky mfe-company-top-0 mfe-company-bg-white mfe-company-p-3 mfe-company-border-b mfe-company-border-gray-100 mfe-company-z-10">
      <div class="mfe-company-relative">
        <svg class="mfe-company-absolute mfe-company-left-3 mfe-company-top-1/2 mfe-company-transform mfe-company--translate-y-1/2 mfe-company-w-4 mfe-company-h-4 mfe-company-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          #searchInput
          type="text"
          [placeholder]="searchPlaceholder"
          (input)="onSearchChange($event)"
          class="mfe-company-w-full mfe-company-pl-10 mfe-company-pr-3 mfe-company-py-2.5 mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-lg mfe-company-text-sm focus:mfe-company-outline-none focus:mfe-company-ring-2 focus:mfe-company-ring-blue-500 focus:mfe-company-border-blue-500 mfe-company-bg-gray-50"
        >
      </div>
    </div>

    <!-- Options -->
    <div class="mfe-company-py-2">
      <div 
        *ngFor="let option of filteredOptions"
        (click)="toggleOption(option)"
        [class.mfe-company-bg-blue-50]="isSelected(option)"
        [class.mfe-company-text-blue-700]="isSelected(option)"
        class="mfe-company-px-4 mfe-company-py-3 mfe-company-cursor-pointer mfe-company-text-sm mfe-company-transition-colors mfe-company-duration-150 hover:mfe-company-bg-gray-50 mfe-company-flex mfe-company-items-center mfe-company-justify-between mfe-company-border-l-2 mfe-company-border-transparent"
        [class.mfe-company-border-l-blue-500]="isSelected(option)"
      >
        <span class="mfe-company-font-medium">{{ option.label }}</span>
        <span *ngIf="isSelected(option)" class="mfe-company-text-blue-600 mfe-company-font-bold">
          <svg class="mfe-company-w-4 mfe-company-h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </span>
      </div>

      <!-- No Results -->
      <div 
        *ngIf="filteredOptions.length === 0" 
        class="mfe-company-px-4 mfe-company-py-8 mfe-company-text-center mfe-company-text-gray-500 mfe-company-text-sm"
      >
        <svg class="mfe-company-w-12 mfe-company-h-12 mfe-company-mx-auto mfe-company-mb-2 mfe-company-text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="mfe-company-font-medium">No options found</p>
        <p class="mfe-company-text-xs mfe-company-mt-1">Try adjusting your search</p>
      </div>
    </div>
  </div>
</div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent implements ControlValueAccessor, OnInit {
  @Input() options: { value: any; label: string }[] = [];
  @Input() placeholder: string = 'Select options...';
  @Input() searchPlaceholder: string = 'Search...';
  @Input() mode: 'multiple' | 'tags' = 'multiple';
  @Input() searchable: boolean = true;
  @Input() isInvalid: boolean = false;

  selectedOptions: { value: any; label: string }[] = [];
  isOpen = false;
  searchTerm = '';
  filteredOptions: { value: any; label: string }[] = [];

  private onChange: (value: { value: any; label: string }[]) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  // ControlValueAccessor methods
  writeValue(value: { value: any; label: string }[]): void {
    if (value && Array.isArray(value)) {
      this.selectedOptions = value;
    } else {
      this.selectedOptions = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }

  // Component methods
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    this.onTouched();
  }

  toggleOption(option: { value: any; label: string }): void {
    const index = this.selectedOptions.findIndex(opt => 
      opt.value === option.value && opt.label === option.label
    );
    
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push(option);
    }

    this.emitValue();
  }

  removeTag(event: Event, index: number): void {
    event.stopPropagation();
    this.selectedOptions.splice(index, 1);
    this.emitValue();
  }

  onTagInputKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addCustomTag(input.value);
      input.value = '';
    } else if (event.key === 'Backspace' && input.value === '' && this.selectedOptions.length > 0) {
      this.selectedOptions.pop();
      this.emitValue();
    }
  }

  onTagInputBlur(): void {
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input && input.value) {
      this.addCustomTag(input.value);
      input.value = '';
    }
  }

  addCustomTag(label: string): void {
    if (label.trim()) {
      const newOption: { value: any; label: string } = {
        value: null, // null value for custom tags
        label: label.trim()
      };

      // Check if already exists in selected options
      const exists = this.selectedOptions.some(opt => 
        opt.label.toLowerCase() === label.trim().toLowerCase()
      );

      if (!exists) {
        this.selectedOptions.push(newOption);
        
        // Add to options if not already present
        const optionExists = this.options.some(opt => 
          opt.label.toLowerCase() === label.trim().toLowerCase()
        );
        
        if (!optionExists) {
          this.options.push(newOption);
          this.filteredOptions = [...this.options];
        }
        
        this.emitValue();
      }
    }
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.filterOptions();
  }

  filterOptions(): void {
    if (!this.searchTerm) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  isSelected(option: { value: any; label: string }): boolean {
    return this.selectedOptions.some(selected => 
      selected.value === option.value && selected.label === option.label
    );
  }

  private emitValue(): void {
    this.onChange([...this.selectedOptions]);
  }
}