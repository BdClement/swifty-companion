import { apiFetch } from "@/services/api";
import { CursusUser, FullIdentityResponse, ProjectUser, User } from "../types/type";

const MAIN_CURSUS_ID = 21;

export async function getMe(): Promise<FullIdentityResponse> {
    // Gestion d'erreur ?
    return await apiFetch<FullIdentityResponse>("/me");
}

export async function getFullIdentityFromLogin(login: string) : Promise<FullIdentityResponse> {
    return await apiFetch<FullIdentityResponse>(`/users/${encodeURIComponent(login)}`)
}

export function extractUser(full_identity: FullIdentityResponse): User {
  
    return {
      id: full_identity.id,
      email: full_identity.email,
      login: full_identity.login,
      phone: full_identity.phone ?? undefined,
      image: full_identity.image?.versions?.small ?? "default",
      correction_point: full_identity.correction_point,
      pool_month: full_identity.pool_month ?? null,
      pool_year: full_identity.pool_year ?? null,
      location: full_identity.location ?? undefined,
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


export function extractCursus(full_identity: FullIdentityResponse): CursusUser | null {
    // Si aucun cursus return null
    if (full_identity.cursus_users.length === 0) return null;

    const active = full_identity.cursus_users.filter(c => c.end_at === null);
    if (active.length > 1) console.warn("Multiple active cursus detected", active);
    if (active.length > 0) {
        const cursus: CursusUser = active.find(c => c.cursus_id === MAIN_CURSUS_ID) ??
            [...active].sort(
                (a, b) =>
                    new Date(b.begin_at).getTime() -
                    new Date(a.begin_at).getTime()
            )[0];
        return extractCursusUser(cursus);
    }
    // Sans cursus actif, utiliser le plus récent.
    const cursus: CursusUser = [...full_identity.cursus_users].sort(
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

export function exteractUserProjects(me: FullIdentityResponse, cursus_id: number): ProjectUser[] {
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