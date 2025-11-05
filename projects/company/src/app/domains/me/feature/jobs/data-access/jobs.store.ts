import { Injectable, inject, signal } from "@angular/core";
import { AuthHttpService } from "@shared/auth/auth-http.service";
import { AlertService } from "@shared/commun/alert.service";
import { Job } from "./job";

@Injectable({ providedIn: 'root' })
export class JobsStore {
    private http = inject(AuthHttpService);
    private alert = inject(AlertService);
    private apiUrl = 'http://localhost:8083/api/v1/mbe-company/jobs';

    jobsSignal = signal<Job[]>([]);

    jobs = this.jobsSignal.asReadonly();

    loadJobs(username: string) {
        this.http.get<Job[]>(`${this.apiUrl}?=username=${username}`).subscribe({
            next: (data) => {
                this.jobsSignal.set(data);
            },
            error: () => {
                this.alert.show("We couldn't load Jobs", 'error');
            }
        });
    }

    delete(jobId: string) {
        this.http.delete(`${this.apiUrl}/${jobId}`).subscribe({
            next: () => {
                const updatedJobs = this.jobsSignal().filter(job => job.id !== jobId);
                this.jobsSignal.set(updatedJobs);
                this.alert.show('Job deleted successfully', 'success');
            },
            error: () => {
                this.alert.show("We couldn't delete the Job", 'error');
            }
        });
    }

    update(job: Job) {
        this.http.put<Job>(this.apiUrl, job).subscribe({
            next: (updatedJob) => {
                const jobs = this.jobsSignal();
                const index = jobs.findIndex(j => j.id === updatedJob.id);
                if (index !== -1) {
                    jobs[index] = updatedJob;
                    this.jobsSignal.set([...jobs]);
                    this.alert.show('Job updated successfully', 'success');
                    return;
                }
                this.jobsSignal.set([...jobs, updatedJob]);
                this.alert.show('Job added successfully', 'success');
            },
            error: () => {
                this.alert.show("We couldn't update the Job", 'error');
            }
        });
    }

    search(query: string) {
        const q = query.toLowerCase();
      
        const sortedJobs = this.jobsSignal().sort((a, b) => {
          const aMatch =
            a.position.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q) ||
            a.location.toLowerCase().includes(q);
      
          const bMatch =
            b.position.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q) ||
            b.location.toLowerCase().includes(q);
      
          if (aMatch === bMatch) return 0;
          return aMatch ? -1 : 1;
        });
      
        this.jobsSignal.set([...sortedJobs]);
    }
      
}