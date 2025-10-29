import { Component, input, output } from '@angular/core';
import { DynamicFormComponent, FormConfig } from '@shared/ui/dynamic-form/dynamic-form.component';

@Component({
  selector: 'mfe-company-form-header',
  template: `
    <mfe-company-dynamic-form
      [config]="headerFormConfig"
      [initialData]="initialData() || {}"
      [isOpen]="isheaderModalOpen"
      (submitted)="onHeaderSubmit($event)"
      (closed)="onModalClosed()"
    >
    </mfe-company-dynamic-form>
  `,
  imports: [DynamicFormComponent],
})
export class FormHeaderComponent {
  isheaderModalOpen = false;
  initialData = input<{
    name: string;
    headline: string;
  } | null>();
  onSubmit = output<any>();

  headerFormConfig: FormConfig = {
    id: 'add-header',
    title: 'Update Header Information',
    subtitle: 'Update your header to make your profile stand out',
    sections: [
      {
        title: 'Information',
        fields: [
          {
            key: 'name',
            label: 'Fullname',
            type: 'text',
            required: true,
            placeholder: 'e.g. Oussama Yaagoub'
          },
          {
            key: 'headline',
            label: 'Headline',
            type: 'textarea',
            required: true,
            placeholder: 'e.g. Full Stack Developer & Angular architect'
          },
        ]
      }
    ],
    submitText: 'Save',
    cancelText: 'Cancel'
  };

  openHeaderModal() {
    this.isheaderModalOpen = true;
  }

  onHeaderSubmit(headerData: any) {
    this.onSubmit.emit(headerData);
  }

  onModalClosed() {
    this.isheaderModalOpen = false;
  }
  
}
