import { Injectable, inject, signal } from "@angular/core";
import { AuthHttpService } from "@shared/auth/auth-http.service";
import { About } from "./about";
import { AlertService } from "@shared/commun/alert.service";
import { CompanySize } from "./company-size";


@Injectable({
    providedIn: 'root'
})
export class AboutStore {
    private apiUrl = 'http://localhost:8083/mbe-company/api/v1/abouts';

    private http = inject(AuthHttpService);
    private alert = inject(AlertService);
    
    private aboutSegnal = signal<About | null>(null);

    about = this.aboutSegnal.asReadonly();

    loadAbout(username: string) {
        this.http.get<About>(`${this.apiUrl}/${username}`).subscribe({
            next: (data) => {
                this.aboutSegnal.set(data);
            },
            error: () => {
                this.aboutSegnal.set(null);
            }
        });
    }

    updateAbout(data: About) {
        this.http.put<About>(this.apiUrl, data).subscribe({
            next: (updatedAbout) => {
                this.aboutSegnal.set(updatedAbout);
                this.alert.show("About Information updated successfully", 'success');
            },
            error: () => {
                this.alert.show("We couldn't update About Information", 'error');
            }
        });
    }

}