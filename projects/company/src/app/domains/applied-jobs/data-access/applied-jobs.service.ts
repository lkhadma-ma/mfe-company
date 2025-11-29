import { Injectable, inject } from '@angular/core';
import { AuthHttpService } from '@shared/auth/auth-http.service';
import { JobApplication } from './job-application';

@Injectable({providedIn: 'root'})
export class AppliedJobsService {
    private http = inject(AuthHttpService);

    private readonly companyBaseUrl = 'http://localhost:8083/mbe-company/api/v1';
    private readonly userBaseUrl = 'http://localhost:8080/mbe-user/api/v1';


    getAppliedJobs(id: number) {
        return this
            .http.get<JobApplication[]>(`${this.companyBaseUrl}/applications/applied?idJob=${id}`);
    }
    
    loadUserInfo(username: string) {
        return this.http.get<{
            about: string;
        }>(`${this.userBaseUrl}/users/job-application/${username}`);
    }
}