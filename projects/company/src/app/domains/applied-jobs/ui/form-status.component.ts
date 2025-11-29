import { Component, computed, input, output } from '@angular/core';
import { DynamicFormComponent, FormConfig } from '@shared/ui/dynamic-form/dynamic-form.component';
import { JobApplicationStatus, NewPipelineStage } from '../data-access/job-application';


@Component({
  selector: 'mfe-company-form-status',
  template: `
    <mfe-company-dynamic-form
      [config]="ApplicationFormConfig"
      [initialData]="{}"
      [isOpen]="isApplicationModalOpen"
      (submitted)="onApplicationSubmit($event)"
      (closed)="onModalClosed()"
    >
    </mfe-company-dynamic-form>
  `,
  imports: [DynamicFormComponent],
})
export class FormStatusComponent {
  isApplicationModalOpen = false;

  latestStatus = input<JobApplicationStatus | undefined>(undefined);
  onSubmit = output<any>();

  optionsStatus = computed(() => {
    const status = this.latestStatus();

    const allOptions = [
        { value: 'INTERVIEW', label: 'Interview' },
        { value: 'ACCEPTED', label: 'Accepted' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'PASSED', label: 'Passed' }
    ];

    return allOptions.filter(option => option.value !== status);
});

  ApplicationFormConfig: FormConfig = {
    id: 'change-Application-status-form',
    title: 'Change Application Application Status',
    subtitle: 'Update the status of the Application application',
    sections: [
      {
        title: 'Information',
        fields: [
          {
            key: 'note',
            label: 'Feedback Note',
            type: 'text',
            required: true,
            placeholder: 'e.g. Candidate has strong communication skills...'
          },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            options: this.optionsStatus()
          },
        ]
      }
    ],
    submitText: 'Save',
    cancelText: 'Cancel'
  };

  openApplicationModal() {
    this.isApplicationModalOpen = true;
  }

  onApplicationSubmit(ApplicationData: any) {
    this.onSubmit.emit(ApplicationData);
  }

  onModalClosed() {
    this.isApplicationModalOpen = false;
  }
  
}
