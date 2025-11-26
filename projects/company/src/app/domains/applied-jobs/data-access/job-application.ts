export type JobApplication = {
    user: {
      username: string;
      name: string;
      avatar: string;
      headline: string;
    };
    pipelineStage: {
        status: JobApplicationStatus;
        createdAt: string;
        note?: string;
    }[];
}

export type JobApplicationStatus = 'SUBMITTED' | 'VIEWED' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED' | 'PASSED';
