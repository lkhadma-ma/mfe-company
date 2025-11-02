import { Injectable, inject, signal } from "@angular/core";
import { AuthHttpService } from "@shared/auth/auth-http.service";
import { About } from "./about";
import { AlertService } from "@shared/commun/alert.service";
import { CompanySize } from "./company-size";


@Injectable({
    providedIn: 'root'
})
export class AboutStore {
    private apiUrl = 'http://localhost:8083/api/v1/about';

    private http = inject(AuthHttpService);
    private alert = inject(AlertService);
    
    private aboutSegnal = signal<About | null>({
        overview: "we are a company that values excellence and innovation. Our mission is to provide top-notch services to our clients while fostering a collaborative and inclusive work environment for our employees.",
        website: "https://www.examplecompany.com",
        industry: "Information Technology",
        companySize: CompanySize["201-500"],
        founded: "2010",
        specialties: "Software Development, Cloud Computing, AI Solutions"
    });

    about = this.aboutSegnal.asReadonly();

    loadAbout() {
        this.http.get<About>(this.apiUrl).subscribe({
            next: (data) => {
                this.aboutSegnal.set(data);
            },
            error: () => {
                this.alert.show("We couldn't load About Information", 'error');
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