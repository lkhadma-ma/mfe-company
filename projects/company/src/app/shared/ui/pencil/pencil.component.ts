import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mfe-company-pencil',
  host: { class: 'mfe-company-z-10 mfe-company-cursor-pointer mfe-company-absolute mfe-company-top-[0rem] mfe-company-right-[-.25rem] hover:mfe-company-scale-105 mfe-company-w-10 mfe-company-h-10 mfe-company-rounded-full mfe-company-bg-white mfe-company-flex mfe-company-items-center mfe-company-justify-center mfe-company-shadow-md mfe-company-mt-3 mfe-company-mr-3' },
  template: `
  <i class="fa-solid fa-pencil"></i>
  `
})
export class PencilComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
