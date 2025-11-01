import { Component, input, output } from '@angular/core';
import { DynamicFormComponent, FormConfig } from '@shared/ui/dynamic-form/dynamic-form.component';

@Component({
  selector: 'mfe-company-form-about',
  template: `
    <mfe-company-dynamic-form
      [config]="AboutFormConfig"
      [initialData]="initialData() || {}"
      [isOpen]="isAboutModalOpen"
      (submitted)="onAboutSubmit($event)"
      (closed)="onModalClosed()"
    >
    </mfe-company-dynamic-form>
  `,
  imports: [DynamicFormComponent],
})
export class FormAboutComponent {
  isAboutModalOpen = false;
  initialData = input<{
    id?: string;
    overview: string;
    website: string;
    industry: string;
    companySize: string;
    founded: string;
    specialties: string;
  } | null>();
  onSubmit = output<any>();

  AboutFormConfig: FormConfig = {
    id: 'add-about',
    title: 'Update About Information',
    subtitle: 'Update your company about information',
    sections: [
      {
        title: 'Information',
        fields: [
          {
            key: 'id',
            label: 'id',
            type: 'hidden',
            required: false,
            placeholder: 'id'
          },
          {
            key: 'overview',
            label: 'Overview',
            type: 'textarea',
            required: true,
            placeholder: 'e.g. We are a leading tech company specializing in...'
          },
          {
            key: 'website',
            label: 'Website',
            type: 'url',
            required: true,
            placeholder: 'e.g. https://www.mycompany.com'
          },
          {
            key: 'industry',
            label: 'Industry',
            type: 'text',
            required: true,
            placeholder: 'e.g. Information Technology'
          },
          {
            key: 'companySize',
            label: 'Company Size',
            type: 'select',
            required: true,
            placeholder: 'e.g. 201-500 employees',
            options: [
              { label: '1-10 employees', value: '1-10' },
              { label: '11-50 employees', value: '11-50' },
              { label: '51-200 employees', value: '51-200' },
              { label: '201-500 employees', value: '201-500' },
              { label: '501-1000 employees', value: '501-1000' },
              { label: '1001+ employees', value: '1001+' },
            ]
          },
          {
            key: 'founded',
            label: 'Founded',
            type: 'number',
            required: true,
            placeholder: 'e.g. 2010'
          },
          {
            key: 'specialties',
            label: 'Specialties',
            type: 'textarea',
            required: true,
            placeholder: 'e.g. Software Development, Cloud Computing'
          }
        ]
      }
    ],
    submitText: 'Save',
    cancelText: 'Cancel'
  };

  openAboutModal() {
    this.isAboutModalOpen = true;
  }

  onAboutSubmit(AboutData: any) {
    this.onSubmit.emit(AboutData);
  }

  onModalClosed() {
    this.isAboutModalOpen = false;
  }
  
}
