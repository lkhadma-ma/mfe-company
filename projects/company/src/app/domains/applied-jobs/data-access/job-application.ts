export type JobApplication = {
    user: {
      username: string;
      name: string;
      avatar: string;
      about: string;
      headline: string;
      skills: string[];
    };
    pipelineStage: {
        status: JobApplicationStatus;
        createdAt: string;
        note?: string;
    }[];
}

export type JobApplicationStatus = 'SUBMITTED' | 'VIEWED' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED' | 'PASSED';

export type JobApplicationMessage = 'SUBMITTED' | 'VIEWED';
