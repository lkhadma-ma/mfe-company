import { Component, input, output } from '@angular/core';
import { DynamicFormComponent, FormConfig } from '@shared/ui/dynamic-form/dynamic-form.component';
import { Job } from '../data-access/job';

@Component({
  selector: 'mfe-company-form-job',
  template: `
    <mfe-company-dynamic-form
      [config]="JobFormConfig"
      [initialData]="initialData() || {}"
      [isOpen]="isJobModalOpen"
      (submitted)="onJobSubmit($event)"
      (closed)="onModalClosed()"
    >
    </mfe-company-dynamic-form>
  `,
  imports: [DynamicFormComponent],
})
export class FormJobComponent {
  isJobModalOpen = false;
  initialData = input<Job | null>();
  onSubmit = output<any>();

  optionsEmploymentType = [
    { value: 'FULL_TIME', label: 'Full-time', selected: true },
    { value: 'PART_TIME', label: 'Part-time' },
    { value: 'SELF_EMPLOYED', label: 'Self-employed' },
    { value: 'FREELANCE', label: 'Freelance' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'APPRENTICESHIP', label: 'Apprenticeship' },
    { value: 'TEMPORARY_CIVIL_SERVANT', label: 'Temporary civil servant' },
    { value: 'DIRECT_CONTRACT', label: 'Direct contract' },
    { value: 'LIFETIME_CIVIL_SERVANT', label: 'Lifetime civil servant' },
    { value: 'CO_OP', label: 'Co-op' }
  ]

  optionsLocationType = [
    { value: 'REMOTE', label: 'Remote' },
    { value: 'HYBRID', label: 'Hybrid' },
    { value: 'ON_SITE', label: 'On-site', selected: true}
  ]

  JobFormConfig: FormConfig = {
    id: 'add-Job',
    title: 'Add Job Information',
    subtitle: 'Post a new job to attract potential candidates',
    sections: [
      {
        title: 'Information',
        fields: [
          {
            key: 'id',
            label: 'id',
            type: 'hidden',
            required: false,
            placeholder: 'e.g. id'
          },
          {
            key: 'position',
            label: 'Position',
            type: 'text',
            required: true,
            placeholder: 'e.g. Frontend Developer'
          },
          {
            key: 'location',
            label: 'Location',
            type: 'text',
            required: true,
            placeholder: 'e.g. New York, USA'
          },
          {
            key: 'employmentType',
            label: 'Employment Type',
            type: 'select',
            required: true,
            options: this.optionsEmploymentType
          },
          {
            key: 'locationType',
            label: 'Location type',
            type: 'select',
            required: true,
            options: this.optionsLocationType
            
          },
          {
            key: 'description',
            label: 'description',
            type: 'textarea',
            required: true,
            placeholder: 'e.g. We are looking for a skilled Frontend Developer to join our dynamic team...'
          },
          {
            key: 'skills',
            label: 'Skills',
            type: 'multiselect',
            required: true,
            placeholder: 'Select needed skills...',
            mode: 'tags',
            searchable: true,
            options: []
          },
        ]
      }
    ],
    submitText: 'Save',
    cancelText: 'Cancel'
  };

  openJobModal() {
    this.isJobModalOpen = true;
  }

  onJobSubmit(JobData: any) {
    this.onSubmit.emit(JobData);
  }

  onModalClosed() {
    this.isJobModalOpen = false;
  }
  
}
