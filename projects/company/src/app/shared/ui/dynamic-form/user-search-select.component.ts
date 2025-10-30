import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

export interface UserOption {
  username: string;
  avatar: string;
  name: string;
  headline?: string;
}

@Component({
  selector: 'mfe-company-search-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="mfe-company-relative mfe-company-w-full">
  <!-- Selected User -->
  <div 
    class="mfe-company-flex mfe-company-items-center mfe-company-justify-between mfe-company-px-3 mfe-company-py-2 mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-lg mfe-company-bg-white mfe-company-cursor-pointer mfe-company-min-h-[44px]"
    [class.mfe-company-border-red-500]="isInvalid"
    [class.mfe-company-border-blue-500]="isOpen"
    (click)="toggleDropdown()"
  >
    <div class="mfe-company-flex mfe-company-items-center mfe-company-gap-3">
      <img *ngIf="selectedUser" [src]="selectedUser.avatar" alt="avatar" class="mfe-company-w-8 mfe-company-h-8 mfe-company-rounded-full" />
      <div *ngIf="selectedUser; else placeholderTpl" class="mfe-company-flex mfe-company-flex-col">
        <span class="mfe-company-font-medium mfe-company-text-sm">{{ selectedUser.name }}</span>
        <span class="mfe-company-text-gray-500 mfe-company-text-xs">@{{ selectedUser.username }}</span>
      </div>
      <ng-template #placeholderTpl>
        <span class="mfe-company-text-gray-400 mfe-company-text-sm">{{ placeholder }}</span>
      </ng-template>
    </div>

    <!-- Arrow -->
    <svg class="mfe-company-w-4 mfe-company-h-4 mfe-company-text-gray-400 mfe-company-transition-transform"
         [class.mfe-company-rotate-180]="isOpen"
         fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  </div>

  <!-- Dropdown -->
  <div *ngIf="isOpen" 
       class="mfe-company-absolute mfe-company-z-50 mfe-company-w-full mfe-company-bg-white mfe-company-border mfe-company-border-gray-200 mfe-company-rounded-lg mfe-company-shadow-xl mfe-company-mt-2 mfe-company-max-h-64 mfe-company-overflow-y-auto">
    
    <!-- Search Input -->
    <div class="mfe-company-p-3 mfe-company-border-b mfe-company-border-gray-100">
      <input
        type="text"
        [placeholder]="searchPlaceholder"
        (input)="onSearchInput($event)"
        class="mfe-company-w-full mfe-company-px-3 mfe-company-py-2 mfe-company-border mfe-company-border-gray-300 mfe-company-rounded-lg mfe-company-text-sm focus:mfe-company-outline-none focus:mfe-company-ring-2 focus:mfe-company-ring-blue-500"
      />
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="mfe-company-text-center mfe-company-text-gray-500 mfe-company-text-sm mfe-company-p-3">
      Searching...
    </div>

    <!-- User List -->
    <div *ngFor="let user of filteredUsers"
         (click)="selectUser(user)"
         class="mfe-company-flex mfe-company-items-center mfe-company-gap-3 mfe-company-px-4 mfe-company-py-3 mfe-company-cursor-pointer hover:mfe-company-bg-gray-50 mfe-company-transition">
      <img [src]="user.avatar" alt="avatar" class="mfe-company-w-8 mfe-company-h-8 mfe-company-rounded-full" />
      <div class="mfe-company-flex-1">
        <div class="mfe-company-font-medium mfe-company-text-sm">{{ user.name }}</div>
        <div class="mfe-company-text-gray-500 mfe-company-text-xs">@{{ user.username }}</div>
        <div *ngIf="user.headline" class="mfe-company-text-gray-400 mfe-company-text-xs">{{ user.headline }}</div>
      </div>
      <div *ngIf="selectedUser?.username === user.username" class="mfe-company-text-blue-600 mfe-company-font-bold">✓</div>
    </div>

    <!-- No Results -->
    <div *ngIf="!loading && filteredUsers.length === 0" 
         class="mfe-company-text-center mfe-company-text-gray-500 mfe-company-text-sm mfe-company-p-4">
      No users found
    </div>
  </div>
</div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserSearchSelectComponent),
      multi: true
    }
  ]
})
export class UserSearchSelectComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder = 'Select a user...';
  @Input() searchPlaceholder = 'Search users...';
  @Input() isInvalid = false;
  @Input() fetchUsers!: (query: string) => Observable<UserOption[]>;

  selectedUser: UserOption | null = null;
  filteredUsers: UserOption[] = [];
  loading = false;
  isOpen = false;

  private searchTerms = new Subject<string>();
  private onChange: (value: UserOption | null) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || !this.fetchUsers) return of([]);
        this.loading = true;
        return this.fetchUsers(term).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(users => {
      this.filteredUsers = users;
      this.loading = false;
    });
  }

  writeValue(value: UserOption | null): void {
    this.selectedUser = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    this.onTouched();
  }

  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value.trim();
    this.searchTerms.next(term);
  }

  selectUser(user: UserOption): void {
    this.selectedUser = user;
    this.isOpen = false;
    this.emitValue();
  }

  private emitValue(): void {
    this.onChange(this.selectedUser);
  }
}
