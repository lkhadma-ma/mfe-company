import { Injectable, inject, signal } from '@angular/core';
import { AppliedJobsService } from './applied-jobs.service';
import { JobApplication, NewPipelineStage, PipelineStage } from './job-application';
import { User } from './user';
import { AlertService } from '@shared/commun/alert.service';

@Injectable({providedIn: 'root'})
export class AppliedJobsStore {
    private appliedJobsService = inject(AppliedJobsService);
    private alertService = inject(AlertService);
    
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

    changeStatusApplication(jobApplicationId:number, newPipelineStage : NewPipelineStage) {
        this.appliedJobsService.changeStatusApplication(jobApplicationId, newPipelineStage)
        .subscribe({
            next: (pipelineStage) => {
                if (!pipelineStage) {
                    return;
                }
                this.jobApplicationSignal()?.forEach((app, index) => {
                    if (app.id === jobApplicationId) {
                        const updatedApp = {
                            ...app,
                            pipelineStage: [...(app.pipelineStage ?? []), pipelineStage]
                        };
                        const currentApps = this.jobApplicationSignal();
                        if (currentApps) {
                            const newApps = [...currentApps];
                            newApps[index] = updatedApp;
                            this.jobApplicationSignal.set(newApps);
                        }
                    }
                });
            },
            error: () => {
                this.alertService.show('Error updating application status', 'error');
            }
        });
    }
}