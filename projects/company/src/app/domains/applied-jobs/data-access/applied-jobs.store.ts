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
                about: 'Passionate about technology and software development. Experienced in building web applications using modern frameworks and tools. Always eager to learn and take on new challenges.',
                headline: 'Full Stack Developer',
                skills: [
                    'JavaScript',
                    'TypeScript',
                    'Angular',
                    'React',
                    'Node.js',
                    'Express',
                    'MongoDB',
                    'SQL',
                    'HTML',
                    'CSS'
                ]
            },
            pipelineStage: [
                {
                    status: 'SUBMITTED',
                    createdAt: new Date().toISOString()
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