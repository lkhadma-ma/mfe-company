import { CompanySize } from "./company-size";


export type About = {
    id?: string;
    overview: string;
    website: string;
    industry: string;
    companySize: CompanySize;
    founded: string;
    specialties: string;
};