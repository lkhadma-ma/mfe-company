import { Injectable } from '@angular/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {

  constructor() {
    marked.setOptions({
      gfm: true,
      breaks: true
    });

    DOMPurify.setConfig({
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'iframe', 'object', 'embed','a'],
      FORBID_ATTR: ['style', 'onerror', 'onclick']
    });
  }

  toSafeHtml(markdown: string): string {
    const rawHtml = marked.parse(markdown ?? '');
    return DOMPurify.sanitize(rawHtml as string);
  }
}
