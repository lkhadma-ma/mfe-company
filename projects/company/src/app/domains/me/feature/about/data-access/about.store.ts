import { Injectable, inject, signal } from "@angular/core";
import { AuthHttpService } from "@shared/auth/auth-http.service";
import { About } from "./about";
import { AlertService } from "@shared/commun/alert.service";


@Injectable({
    providedIn: 'root'
})
export class AboutStore {
    private apiUrl = 'http://localhost:8083/api/v1/companies/about';

    private http = inject(AuthHttpService);
    private alert = inject(AlertService);
    
    private aboutSegnal = signal<About | null>({
        overview: "we are a company that values excellence and innovation. Our mission is to provide top-notch services to our clients while fostering a collaborative and inclusive work environment for our employees.",
        website: "https://www.examplecompany.com",
        industry: "Information Technology",
        companySize: "201-500 employees",
        founded: "2010",
        Specialties: "Software Development, Cloud Computing, AI Solutions"
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

}