import { Injectable, inject, signal } from '@angular/core';
import { AppliedJobsService } from './applied-jobs.service';
import { JobApplication } from './job-application';

@Injectable({providedIn: 'root'})
export class AppliedJobsStore {
    private appliedJobsService = inject(AppliedJobsService);
    
    private jobApplicationSignal = signal<JobApplication[] | undefined | null>(undefined);
    private aboutUserSignal = signal<string | undefined | null>(undefined);

    jobApplications = this.jobApplicationSignal.asReadonly();
    aboutUser = this.aboutUserSignal.asReadonly();

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
        this.aboutUserSignal.set(undefined);
        this.appliedJobsService.loadUserInfo(username).subscribe({
            next: (userInfo) => {
                this.aboutUserSignal.set(userInfo.about);
            },
            error: () => {
                this.aboutUserSignal.set(null);
            }
        });
    }
}