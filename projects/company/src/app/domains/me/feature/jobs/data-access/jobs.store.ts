import { Injectable, inject, signal } from "@angular/core";
import { AuthHttpService } from "@shared/auth/auth-http.service";
import { AlertService } from "@shared/commun/alert.service";
import { Job, JobWithCompany } from "./job";
import { EmploymentType } from "./employment-type";
import { LocationType } from "./location-type";

@Injectable({ providedIn: 'root' })
export class JobsStore {
    private http = inject(AuthHttpService);
    private alert = inject(AlertService);
    private apiUrl = 'http://localhost:8083/api/v1/companies/me/jobs';

    jobsSignal = signal<Job[]>([
        {
            id: '1',
            position: 'Software Engineer',
            description: 'We are looking for a skilled Software Engineer to join our dynamic team. The ideal candidate will have experience in developing high-quality software solutions and a passion for technology.',
            location: 'New York, NY',
            employmentType: EmploymentType.FULL_TIME,
            locationType: LocationType.HYBRID,
            skills: []
        },
        {
            id: '2',
            position: 'Product Manager',
            description: 'Seeking an experienced Product Manager to lead the development and launch of innovative products. The candidate should have a strong background in product lifecycle management and customer-centric design.',
            location: 'San Francisco, CA',
            employmentType: EmploymentType.APPRENTICESHIP,
            locationType: LocationType.ON_SITE,
            skills: []
        }
    ]);

    companySignal = signal<{ avatar: string } | null>({
        avatar: 'http://localhost:8081/mbe-mutli-media/api/drive/view/d/197WU2awWwfbmCFmKACxqRgVEjttlMP3T'
    });

    jobs = this.jobsSignal.asReadonly();
    company = this.companySignal.asReadonly();


    loadJobs() {
        this.http.get<JobWithCompany>(this.apiUrl).subscribe({
            next: (data) => {
                this.jobsSignal.set(data.jobs);
                this.companySignal.set(data.company);
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
}