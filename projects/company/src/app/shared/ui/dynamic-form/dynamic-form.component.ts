// dynamic-form.component.ts
import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { UserOption, UserSearchSelectComponent } from "./user-search-select.component";
import { Observable } from 'rxjs';

// Interfaces
export interface FormFieldConfig {
  key: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'date'
    | 'radio'
    | 'file'
    | 'number'
    | 'url'
    | 'hidden'
    | 'multiselect'
    | 'userselect';
  required?: boolean;
  placeholder?: string;
  options?: { value: any; label: string, selected?: boolean }[];
  fetchOptions?: ( username:string ) => Observable<UserOption[]>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
  disabled?: boolean;
  hidden?: boolean;
  multiple?: boolean;
  searchable?: boolean; // Add this for multi-select
  mode?: 'multiple' | 'tags'; // Add this for multi-select
}

export interface FormSectionConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  columns?: number;
}

export interface FormConfig {
  id: string;
  title: string;
  subtitle?: string;
  sections: FormSectionConfig[];
  submitText?: string;
  cancelText?: string;
}

@Component({
  selector: 'mfe-company-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiSelectComponent, UserSearchSelectComponent],
  template: `
    <!-- Modal Backdrop -->
    <div
      *ngIf="isOpen"
      class="mfe-company-fixed mfe-company-inset-0 mfe-company-bg-black mfe-company-bg-opacity-50 mfe-company-flex mfe-company-items-center mfe-company-justify-center mfe-company-p-4 mfe-company-z-50 mfe-company-w-screen mfe-company-h-screen"
      (click)="onBackdropClick($event)"
    >
      <!-- Modal Container -->
      <div
        class="mfe-company-bg-white mfe-company-rounded-lg mfe-company-shadow-xl mfe-company-max-w-2xl mfe-company-w-full mfe-company-max-h-[90vh] mfe-company-overflow-hidden mfe-company-flex mfe-company-flex-col"
      >
        <!-- Form -->
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="mfe-company-flex mfe-company-flex-col mfe-company-h-full mfe-company-overflow-hidden"
        >
          <!-- Fixed Header -->
          <div
            class="mfe-company-flex-shrink-0 mfe-company-p-6 mfe-company-border-b mfe-company-border-gray-200 mfe-company-bg-white"
          >
            <h2
              class="mfe-company-text-2xl mfe-company-font-semibold mfe-company-text-gray-900"
            >
              {{ config.title }}
            </h2>
            <p
              *ngIf="config.subtitle"
              class="mfe-company-mt-1 mfe-company-text-sm mfe-company-text-gray-600"
            >
              {{ config.subtitle }}
            </p>
          </div>

          <!-- Scrollable Form Content -->
          <div class="mfe-company-flex-1 mfe-company-overflow-y-auto mfe-company-p-6">
            <div class="mfe-company-space-y-6">
              <!-- Form Sections -->
              <div
                *ngFor="let section of config.sections"
                class="mfe-company-space-y-4"
              >
                <!-- Section Header -->
                <div *ngIf="section.title" class="mfe-company-mb-4">
                  <h3
                    class="mfe-company-text-lg mfe-company-font-medium mfe-company-text-gray-900"
                  >
                    {{ section.title }}
                  </h3>
                  <p
                    *ngIf="section.description"
                    class="mfe-company-mt-1 mfe-company-text-sm mfe-company-text-gray-600"
                  >
                    {{ section.description }}
                  </p>
                </div>

                <!-- Form Fields Grid -->
                <div
                  [class]="getGridClass(section.columns || 1)"
                  class="mfe-company-gap-4"
                >
                  <!-- Text Input -->
                  <div
                    *ngFor="let field of section.fields"
                    [class.hidden]="field.hidden"
                    class="mfe-company-space-y-2"
                  >
                    <!-- Your existing modal structure remains the same -->

                    <!-- Inside the form fields section, add the multi-select case -->
                    <div *ngIf="field.type === 'multiselect'">
                      <label [for]="field.key" class="mfe-company-block mfe-company-text-sm mfe-company-font-medium mfe-company-text-gray-700">
                        {{ field.label }}
                        <span *ngIf="field.required" class="mfe-company-text-red-500">*</span>
                      </label>
                      
                      <mfe-company-multi-select
                        [formControlName]="field.key"
                        [options]="field.options || []"
                        [placeholder]="field.placeholder || 'Select options...'"
                        [mode]="field.mode || 'multiple'"
                        [searchable]="field.searchable ?? true"
                        [isInvalid]="isFieldInvalid(field)"
                      ></mfe-company-multi-select>
                      
                      <div *ngIf="isFieldInvalid(field)" class="mfe-company-text-sm mfe-company-text-red-600 mfe-company-mt-1">
                        {{ getFieldError(field) }}
                      </div>
                    </div>
                    <!-- user select-->
                   
                    @if(field.type === 'userselect'){
                      <mfe-company-search-select
                        [formControlName]="field.key"
                        [fetchUsers]="field.fetchOptions!"
                        [placeholder]="field.placeholder || 'Select user...'"
                      ></mfe-company-search-select>
                    }


                    <!-- Text, Email, Password -->
                    <div
                      *ngIf="
                        field.type === 'text' ||
                        field.type === 'email' ||
                        field.type === 'password' ||
                        field.type === 'url'
                      "
                    >
                      <label
                        [for]="field.key"
                        class="mfe-company-block mfe-company-text-sm mfe-company-font-medium mfe-company-text-gray-700"
                      >
                        {{ field.label }}
                        <span
                          *ngIf="field.required"
                          class="mfe-company-text-red-500"
                          >*</span
                        >
                      </label>
                      <input
                        [id]="field.key"
                        [type]="field.type"
                        [formControlName]="field.key"
                        [placeholder]="field.placeholder || ''"
                        [class.mfe-company-border-red-300]="isFieldInvalid(field)"
                        class="mfe-company-w-full mfe-company-px-3 mfe-company-py-2 mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-md mfe-company-shadow-sm focus:mfe-company-outline-none focus:mfe-company-ring-2 focus:mfe-company-ring-blue-500 focus:mfe-company-border-blue-500"
                      />
                      <div
                        *ngIf="isFieldInvalid(field)"
                        class="mfe-company-text-sm mfe-company-text-red-600"
                      >
                        {{ getFieldError(field) }}
                      </div>
                    </div>
                    <!-- Number and hidden Input -->
                    <div
                      *ngIf="field.type === 'number' || field.type === 'hidden'"
                      [class.mfe-company-hidden]="
                        field.type === 'hidden'
                      "
                    >
                      <label
                        [for]="field.key"
                        class="mfe-company-block mfe-company-text-sm mfe-company-font-medium mfe-company-text-gray-700"
                      >
                        {{ field.label }}
                        <span
                          *ngIf="field.required"
                          class="mfe-company-text-red-500"
                          >*</span
                        >
                      </label>
                      <input
                        [id]="field.key"
                        type="number"
                        [formControlName]="field.key"
                        [placeholder]="field.placeholder || ''"
                        [class.mfe-company-border-red-300]="isFieldInvalid(field)"
                        class="mfe-company-w-full mfe-company-px-3 mfe-company-py-2 mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-md mfe-company-shadow-sm focus:mfe-company-outline-none focus:mfe-company-ring-2 focus:mfe-company-ring-blue-500 focus:mfe-company-border-blue-500"
                      />
                      <div
                        *ngIf="isFieldInvalid(field)"
                        class="mfe-company-text-sm mfe-company-text-red-600"
                      >
                        {{ getFieldError(field) }}
                      </div>
                    </div>

                    <!-- Textarea -->
                    <div *ngIf="field.type === 'textarea'">
                      <label
                        [for]="field.key"
                        class="mfe-company-block mfe-company-text-sm mfe-company-font-medium mfe-company-text-gray-700"
                      >
                        {{ field.label }}
                        <span
                          *ngIf="field.required"
                          class="mfe-company-text-red-500"
                          >*</span
                        >
                      </label>
                      <textarea
                        [id]="field.key"
                        [formControlName]="field.key"
                        [placeholder]="field.placeholder || ''"
                        [class.mfe-company-border-red-300]="isFieldInvalid(field)"
                        rows="4"
                        class="mfe-company-w-full mfe-company-px-3 mfe-company-py-2 mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-md mfe-company-shadow-sm focus:mfe-company-outline-none focus:mfe-company-ring-2 focus:mfe-company-ring-blue-500 focus:mfe-company-border-blue-500 mfe-company-resize-none"
                      >
                      </textarea>
                      <div
                        *ngIf="isFieldInvalid(field)"
                        class="mfe-company-text-sm mfe-company-text-red-600"
                      >
                        {{ getFieldError(field) }}
                      </div>
                    </div>

                    <!-- Select -->
                    <div *ngIf="field.type === 'select'">
                      <label
                        [for]="field.key"
                        class="mfe-company-block mfe-company-text-sm mfe-company-font-medium mfe-company-text-gray-700"
                      >
                        {{ field.label }}
                        <span
                          *ngIf="field.required"
                          class="mfe-company-text-red-500"
                          >*</span
                        >
                      </label>
                      <select
                        [id]="field.key"
                        [formControlName]="field.key"
                        [class.mfe-company-border-red-300]="isFieldInvalid(field)"
                        class="mfe-company-w-full mfe-company-px-3 mfe-company-py-2 mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-md mfe-company-shadow-sm focus:mfe-company-outline-none focus:mfe-company-ring-2 focus:mfe-company-ring-blue-500 focus:mfe-company-border-blue-500"
                      >
                      @if(!hasAnySelectedOption(field.options)){
                        <option class="mfe-company-text-gray-600" value="" selected>
                          {{ field.placeholder || 'Please select' }}
                        </option>
                      }
                        <option
                          *ngFor="let option of field.options"
                          [value]="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                      <div
                        *ngIf="isFieldInvalid(field)"
                        class="mfe-company-text-sm mfe-company-text-red-600"
                      >
                        {{ getFieldError(field) }}
                      </div>
                    </div>

                    <!-- Checkbox -->
                    <div
                      *ngIf="field.type === 'checkbox'"
                      class="mfe-company-flex mfe-company-items-center"
                    >
                      <label
                        class="mfe-company-flex mfe-company-items-center mfe-company-space-x-2"
                      >
                        <input
                          type="checkbox"
                          [formControlName]="field.key"
                          class="mfe-company-w-4 mfe-company-h-4 mfe-company-text-blue-600 mfe-company-border-gray-300 mfe-company-rounded focus:mfe-company-ring-blue-500"
                        />
                        <span class="mfe-company-text-sm mfe-company-text-gray-700">{{
                          field.label
                        }}</span>
                      </label>
                    </div>

                    <!-- Date -->
                    <div *ngIf="field.type === 'date'">
                      <label
                        [for]="field.key"
                        class="mfe-company-block mfe-company-text-sm mfe-company-font-medium mfe-company-text-gray-700"
                      >
                        {{ field.label }}
                        <span
                          *ngIf="field.required"
                          class="mfe-company-text-red-500"
                          >*</span
                        >
                      </label>
                      <input
                        [id]="field.key"
                        type="date"
                        [formControlName]="field.key"
                        [class.mfe-company-border-red-300]="isFieldInvalid(field)"
                        class="mfe-company-w-full mfe-company-px-3 mfe-company-py-2 mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-md mfe-company-shadow-sm focus:mfe-company-outline-none focus:mfe-company-ring-2 focus:mfe-company-ring-blue-500 focus:mfe-company-border-blue-500"
                      />
                      <div
                        *ngIf="isFieldInvalid(field)"
                        class="mfe-company-text-sm mfe-company-text-red-600"
                      >
                        {{ getFieldError(field) }}
                      </div>
                    </div>

                    <!-- Radio -->
                    <div *ngIf="field.type === 'radio'">
                      <label
                        class="mfe-company-block mfe-company-text-sm mfe-company-font-medium mfe-company-text-gray-700"
                      >
                        {{ field.label }}
                        <span
                          *ngIf="field.required"
                          class="mfe-company-text-red-500"
                          >*</span
                        >
                      </label>
                      <div class="mfe-company-mt-2 mfe-company-space-y-2">
                        <div
                          *ngFor="let option of field.options"
                          class="mfe-company-flex mfe-company-items-center"
                        >
                          <input
                            type="radio"
                            [id]="field.key + '-' + option.value"
                            [formControlName]="field.key"
                            [value]="option.value"
                            class="mfe-company-w-4 mfe-company-h-4 mfe-company-text-blue-600 mfe-company-border-gray-300 focus:mfe-company-ring-blue-500"
                          />
                          <label
                            [for]="field.key + '-' + option.value"
                            class="mfe-company-ml-2 mfe-company-text-sm mfe-company-text-gray-700"
                          >
                            {{ option.label }}
                          </label>
                        </div>
                      </div>
                      <div
                        *ngIf="isFieldInvalid(field)"
                        class="mfe-company-text-sm mfe-company-text-red-600"
                      >
                        {{ getFieldError(field) }}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Actions -->
          <div
            class="mfe-company-flex-shrink-0 mfe-company-flex mfe-company-justify-end mfe-company-space-x-3 mfe-company-p-6 mfe-company-border-t mfe-company-border-gray-200 mfe-company-bg-gray-50"
          >
            <button
              type="button"
              (click)="onCancel()"
              class="mfe-company-px-4 mfe-company-py-2 mfe-company-text-sm mfe-company-font-medium mfe-company-text-gray-700 mfe-company-bg-white mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-md hover:mfe-company-bg-gray-50 focus:mfe-company-outline-none focus:mfe-company-ring-2 focus:mfe-company-ring-blue-500"
            >
              {{ config.cancelText || 'Cancel' }}
            </button>
            <button
              type="submit"
              [disabled]="isSubmitting"
              class="mfe-company-px-4 mfe-company-py-2 mfe-company-text-sm mfe-company-font-medium mfe-company-text-white mfe-company-bg-blue-600 mfe-company-border mfe-company-border-transparent mfe-company-rounded-md hover:mfe-company-bg-blue-700 focus:mfe-company-outline-none focus:mfe-company-ring-2 focus:mfe-company-ring-blue-500 disabled:mfe-company-bg-blue-300"
            >
              {{ isSubmitting ? 'Saving...' : config.submitText || 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class DynamicFormComponent implements OnInit {
  @Input() config!: FormConfig;
  @Input() initialData: any = {};
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();

  form!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
    this.patchFormValues();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.form) {
      this.createForm();
      this.patchFormValues();
    }
  }

  private patchFormValues() {
    if (!this.form || !this.initialData) return;

    Object.keys(this.initialData).forEach((key) => {
      if (this.form.get(key)) {
        this.form.get(key)!.setValue(this.initialData[key]);
      }
    });
  }

  private createForm() {
    const formControls: any = {};

    this.config.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const validators = this.getValidators(field);
        let value =
          this.initialData[field.key] ||
          (field.type === 'checkbox' ? false : '');
        if (
          !this.initialData[field.key] &&  
          field.type === 'select' &&
          field.options?.some(opt => opt.selected)
        ) {
          const selectedOption = field.options.find(opt => opt.selected);
          value = selectedOption ? selectedOption.value : value;
        }
        formControls[field.key] = [value, validators];
      });
    });

    this.form = this.fb.group(formControls);
  }

  private getValidators(field: FormFieldConfig) {
    const validators = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validation) {
      if (field.validation.minLength) {
        validators.push(Validators.minLength(field.validation.minLength));
      }
      if (field.validation.maxLength) {
        validators.push(Validators.maxLength(field.validation.maxLength));
      }
      if (field.validation.pattern) {
        validators.push(Validators.pattern(field.validation.pattern));
      }
    }

    return validators;
  }

  onSubmit() {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitted.emit(this.form.value);
      // Reset submitting state after a short delay
      setTimeout(() => {
        this.isSubmitting = false;
        this.close();
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.close();
  }

  close() {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (
      (event.target as HTMLElement).classList.contains('mfe-company-bg-opacity-50')
    ) {
      this.close();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsTouched();
    });
  }

  getFieldError(field: FormFieldConfig): string {
    const control = this.form.get(field.key);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${field.label} is required`;
      }
      if (control.errors['minlength']) {
        return `${field.label} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['maxlength']) {
        return `${field.label} must be less than ${control.errors['maxlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return `${field.label} format is invalid`;
      }
    }
    return '';
  }

  isFieldInvalid(field: FormFieldConfig): boolean {
    const control = this.form.get(field.key);
    return !!(control?.invalid && control.touched);
  }

  hasAnySelectedOption(options: { value: any; label: string, selected?: boolean }[] | undefined ): boolean {
    if (!options || options.length === 0) return false;
    return options.some(option => option.selected);
  }

  getGridClass(columns: number): string {
    switch (columns) {
      case 1:
        return 'mfe-company-grid mfe-company-grid-cols-1';
      case 2:
        return 'mfe-company-grid mfe-company-grid-cols-1 md:mfe-company-grid-cols-2';
      case 3:
        return 'mfe-company-grid mfe-company-grid-cols-1 md:mfe-company-grid-cols-3';
      default:
        return 'mfe-company-grid mfe-company-grid-cols-1';
    }
  }
}
