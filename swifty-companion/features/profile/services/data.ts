import { apiFetch } from "@/services/api";

// type Image = {
//     link: string;
//     versions: {
//         large: string;
//         medium: string;
//         small: string;
//         micro: string;
//     }
// }

// A DEPLACER dans type ??
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
        // slug
        // parent_id
    };
    cursus_ids: number[];
    marked_at: string;
    marked: boolean;
    retriable_at: string | null;
    created_at: string | null;
    // updated_at: string | null;
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
    // user pas besoin
    // cursus pas besoin (le type de cursus associé je pense)
}

type Me = {
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

export async function getMe(): Promise<Me> {
    // Gestion d'erreur ?
    return await apiFetch<Me>("/me");
}

export function extractUser(me: Me): User {
  
    return {
      id: me.id,
      email: me.email,
      login: me.login,
      phone: me.phone ?? undefined,
      image: me.image?.versions?.small ?? "default",
      correction_point: me.correction_point,
      pool_month: me.pool_month,
      pool_year: me.pool_year,
      location: me.location ?? undefined,
    };
}

function extractCursusUser(cursus: CursusUser): CursusUser {
    return {
        id: cursus.id,
        begin_at: cursus.begin_at,
        end_at: cursus.end_at ?? null,
        grade: cursus.grade,
        level: cursus.level,
        skills: cursus.skills,
        cursus_id: cursus.cursus_id,
        has_coalition: cursus.has_coalition,
        blackholed_at: cursus.blackholed_at ?? null,
        created_at: cursus.created_at,
        updated_at: cursus.updated_at
    }
}


export function extractLastActiveCursus(me: Me): CursusUser | null {
    // Si aucun cursus return null
    if (me.cursus_users.length === 0) return null;

    const active = me.cursus_users.filter(c => c.end_at === null);
    if (active.length > 1) console.warn("Multiple active cursus detected", active);
    // A priori un seul actif a la fois mais on fallaback pour en choisir un 
    if (active.length > 0) {
        const cursus: CursusUser = active[0];
        return extractCursusUser(cursus);
    }
    // Sinon on fallback sur le dernier en date
    const cursus: CursusUser = [...me.cursus_users].sort(
        (a, b) =>
            new Date(b.begin_at).getTime() -
            new Date(a.begin_at).getTime()
    )[0];
    return extractCursusUser(cursus);
}

function exctractProject(project_user: ProjectUser): ProjectUser {
    return {
        id: project_user.id,
        occurrence: project_user.occurrence,
        final_mark: project_user.final_mark,
        status: project_user.status,
        "validated?": project_user["validated?"],
        current_team_id: project_user.current_team_id,
        project: project_user.project,
        cursus_ids: project_user.cursus_ids,
        marked_at: project_user.marked_at,
        marked: project_user.marked,
        retriable_at: project_user.retriable_at,
        created_at: project_user.created_at,
    }
}

export function exteractUserProjects(me: Me, cursus_id: number): ProjectUser[] {
    if (me.projects_users.length === 0) return [];

    // extraire les projets uniquement du cursus_id
    const projects : ProjectUser[] = me.projects_users.filter(p => p.cursus_ids.includes(cursus_id))
    console.log("exteractUserProjects for lastActiveCursus count = ", projects.length);
    // for (const p of projects) {
    //     console.log(`Projet : ${p.project.name} validated = ${p["validated?"]} marked = ${p.final_mark}`);

    // }
    // Les reformater
    return projects.map(exctractProject);
}