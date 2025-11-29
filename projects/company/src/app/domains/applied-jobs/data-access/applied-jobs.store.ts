import { Injectable, inject, signal } from '@angular/core';
import { AppliedJobsService } from './applied-jobs.service';
import { JobApplication } from './job-application';
import { User } from './user';

@Injectable({providedIn: 'root'})
export class AppliedJobsStore {
    private appliedJobsService = inject(AppliedJobsService);
    
    private jobApplicationSignal = signal<JobApplication[] | undefined | null>(undefined);
    private userSignal = signal<User | undefined | null>(undefined);

    jobApplications = this.jobApplicationSignal.asReadonly();
    user = this.userSignal.asReadonly();

    loadJobApplications(id: number) {
        this.jobApplicationSignal.set(undefined);
        this.appliedJobsService.getAppliedJobs(id).subscribe({
            next: (applications) => {
                this.jobApplicationSignal.set(applications);
            },
            error: () => {
                this.jobApplicationSignal.set(null);
            }
        });
    }

    loadUserInfo(username: string) {
        this.userSignal.set(undefined);
        this.appliedJobsService.loadUserInfo(username).subscribe({
            next: (userInfo) => {
                this.userSignal.set(userInfo);
            },
            error: () => {
                this.userSignal.set(null);
            }
        });
    }
}