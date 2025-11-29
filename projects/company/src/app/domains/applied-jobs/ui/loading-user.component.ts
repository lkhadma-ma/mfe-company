import { Component } from '@angular/core';

@Component({
  selector: 'mfe-company-loading-user',
  host: {
    class: 'mfe-company-w-full mfe-company-flex mfe-company-flex-col'
  },
  template: `

    <div class="mfe-company-mx-auto mfe-company-w-full mfe-company-rounded-md mfe-company-p-4">
        <div class="mfe-company-flex mfe-company-animate-pulse mfe-company-space-x-4 mfe-company-items-center">
              <div class="mfe-company-flex-1 mfe-company-space-y-4 mfe-company-py-1">
                <div class="mfe-company-w-[--w] mfe-company-h-2 mfe-company-rounded mfe-company-bg-gray-200" [style.--w]="'20%'"></div>
                <div class="mfe-company-w-[--w] mfe-company-h-2 mfe-company-rounded mfe-company-bg-gray-200" [style.--w]="'50%'"></div>
                <div class="mfe-company-w-[--w] mfe-company-h-2 mfe-company-rounded mfe-company-bg-gray-200" [style.--w]="'70%'"></div>                  
                <div class="mfe-company-w-[--w] mfe-company-h-2 mfe-company-rounded mfe-company-bg-gray-200" [style.--w]="'100%'"></div>                  
                <div class="mfe-company-w-[--w] mfe-company-h-2 mfe-company-rounded mfe-company-bg-gray-200" [style.--w]="'100%'"></div>                 
                <div class="mfe-company-w-[--w] mfe-company-h-2 mfe-company-rounded mfe-company-bg-gray-200" [style.--w]="'100%'"></div>                  
                <div class="mfe-company-w-[--w] mfe-company-h-2 mfe-company-rounded mfe-company-bg-gray-200" [style.--w]="'100%'"></div>                  
        </div>
    </div>
  `
})
export class LoadingUserComponent {

}
