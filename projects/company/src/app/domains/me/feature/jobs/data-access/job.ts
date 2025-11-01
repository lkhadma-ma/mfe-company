
export type Job = {
    id: string;
    position: string;
    location: string;
    employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Temporary';
    locationType: 'On-site' | 'Remote' | 'Hybrid';
    description: string;
    skills: {
        label: string;
        value: string;
    }[];
};

export type JobWithCompany = {
    jobs: Job[];
    company: {
        avatar: string;
    };
}

export type JobView = Pick<Job, 'id' | 'position' | 'locationType' | 'description'> & {
    company: {
        avatar: string;
    };
};
