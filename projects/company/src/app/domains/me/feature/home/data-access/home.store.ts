import { Injectable, inject, signal } from "@angular/core";
import { AuthHttpService } from "@shared/auth/auth-http.service";
import { AlertService } from "@shared/commun/alert.service";
import { Job } from "./job";
import { Home } from "./home";



@Injectable({
    providedIn: 'root'
})
export class HomeStore {
    private apiUrl = 'http://localhost:8083/mbe-company/api/v1/companies/overview';

    private http = inject(AuthHttpService);
    private alert = inject(AlertService);
    
    private homeSegnal = signal<Home | null>(null);

    home = this.homeSegnal.asReadonly();

    loadHome(username: string) {
        this.http.get<Home>(`${this.apiUrl}/${username}`).subscribe({
            next: (data) => {
                this.homeSegnal.set(data);
            },
            error: () => {
                this.alert.show("We couldn't load overview Information", 'error');
            }
        });
    }

}