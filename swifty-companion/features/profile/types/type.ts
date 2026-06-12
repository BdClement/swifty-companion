export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ProjectUser = {
    id: number;
    occurrence: number;
    final_mark: number;
    status: string;
    "validated?": boolean | null;
    current_team_id: number;
    project: {
        id: number;
        name: string;
    };
    cursus_ids: number[];
    marked_at: string;
    marked: boolean;
    retriable_at: string | null;
    created_at: string | null;
}

export type Skill = {
    id: number;
    name: string;
    level: number;
}

export type CursusUser = {
    id: number;
    begin_at: string;
    end_at?: string | null;
    grade: string;
    level: number;
    skills: Skill[];
    cursus_id: number;
    has_coalition: boolean;
    blackholed_at?: string | null;
    created_at: string;
    updated_at: string;
}

export type Me = {
    id: number;
    email: string;
    login: string;
    phone?: string;
    image?: {
        link: string;
        versions: {
            small:string;
        }
    };
    correction_point: number;
    pool_month: string;
    pool_year: string;
    location?: string;

    cursus_users: CursusUser[];
    projects_users: ProjectUser[];
}

export type User = {
    id: number;
    email: string;
    login: string;
    phone?: string;
    image?: string;
    correction_point: number;
    pool_month: string;
    pool_year: string;
    location?: string;
}

export type HeaderProfileProps = {
    user: User | null;
    lastActiveCursus: CursusUser | null;
};

export type SkillBarProps = {
    skill: Skill
}