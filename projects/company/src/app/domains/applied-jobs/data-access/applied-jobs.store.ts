import { Injectable, inject, signal } from '@angular/core';
import { AppliedJobsService } from './applied-jobs.service';
import { JobApplication } from './job-application';

@Injectable({providedIn: 'root'})
export class AppliedJobsStore {
    private appliedJobsService = inject(AppliedJobsService);
    
    private jobApplicationSignal = signal<JobApplication[] | null>([
        {
            user:{
                username: 'oyaagoub5',
                name: 'Oussama Yaagoub',
                avatar: 'https://avatars.githubusercontent.com/u/63155454?v=4',
                headline: 'Frontend Developer'
            },
            pipelineStage: [
                {
                    status: 'SUBMITTED',
                    createdAt: '2025-11-26T22:50:12.567+00:00'
                },
                {
                    status: 'VIEWED',
                    createdAt: '2025-11-26T21:50:12.567+00:00'
                }
            ]
        }
    ]);

    jobApplications = this.jobApplicationSignal.asReadonly();

    loadJobApplications() {
        this.jobApplicationSignal.set(null);
        this.appliedJobsService.getAppliedJobs().subscribe({
            next: (applications) => {
                this.jobApplicationSignal.set(applications);
            }
        });
    }
}