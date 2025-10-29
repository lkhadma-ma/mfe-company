import { Injectable, inject, signal } from "@angular/core";
import { CompanyComplated } from "./company";
import { AuthHttpService } from "@shared/auth/auth-http.service";
import { AlertService } from "@shared/commun/alert.service";



@Injectable({ providedIn: 'root' })
export class CompanyStore {
    // Inject
    private http = inject(AuthHttpService);
    private alert = inject(AlertService);

    // Constants
    private readonly baseUrl = 'http://localhost:8080/mbe-user/api/v1';
    
    // Signals
    private companySignal = signal<CompanyComplated | null>(null);
    private isCurrentCompanySignal = signal<boolean>(false);

    // Methods
    company = this.companySignal.asReadonly();
    isCurrentcompany = this.isCurrentCompanySignal.asReadonly();

    // Actions
    loadCompany(username: string) {
        this.http.get<{
          search: CompanyComplated,
          current: string
        }>(`${this.baseUrl}/companies/${username}`).subscribe(company => {
            this.companySignal.set(company.search);
            this.isCurrentCompanySignal.set(company.current === company.search.username);
        },
        () => {
            this.companySignal.set(null);
            this.isCurrentCompanySignal.set(false);
            this.alert.show("We couldn't load Company Profile", 'error');
        }
        );
    }

    updateHeader(data: {
      name?: string;
      headline?: string;
      avatar?:File;
      bg?:File;
      action:string;
    }) {

      switch(data.action) {
        case 'name&headline':
          this.http.put<{ name: string; headline: string }>(`${this.baseUrl}/companies/header`, { name: data.name, headline: data.headline }).subscribe(({ name, headline }) => {
            const current = this.companySignal();
            if (!current) return;
        
            this.companySignal.set({
              ...current,
              name,
              headline,
            });
            this.alert.show('Header information updated successfully', 'success');
          },
          () => {
            this.alert.show("We couldn't update header information", 'error');
          }
          );
          break;
        case 'avatar':
          const formDatAavatar = new FormData();
          formDatAavatar.append('file', data.avatar!);
          this.http.put<{ avatar: string }>(`${this.baseUrl}/users/avatar`, formDatAavatar ).subscribe(({ avatar }) => {
            const current = this.companySignal();
            if (!current) return;
        
            this.companySignal.set({
              ...current,
              avatar,
            });
            this.alert.show('Avatar updated successfully', 'success');
          },
          () => {
            this.alert.show("We couldn't update avatar", 'error');
          }
          );
          break;
        case 'bg':
          const formDataBg = new FormData();
          formDataBg.append('file', data.bg!);
          this.http.put<{ bg: string }>(`${this.baseUrl}/users/bg`, formDataBg).subscribe(({ bg }) => {
            const current = this.companySignal();
            if (!current) return;
        
            this.companySignal.set({
              ...current,
              bg,
            });
            this.alert.show('Background image updated successfully', 'success');
          },
          () => {
            this.alert.show("We couldn't update background image", 'error');
          }
          );
          break;
        default:
          this.alert.show("Invalid action for updating header", 'error');
          return;
      }
      
    }
}