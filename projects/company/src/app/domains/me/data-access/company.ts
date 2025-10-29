export interface CompanyComplated {
    username: string;
    address: string;
    avatar: string;
    headline: string;
    name: string;
    bg: string;
}

export type CompanyHeader = Pick<CompanyComplated, 'name' | 'headline' | 'avatar' | 'bg'>;
