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

// A deplacer dans type ??
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

export async function getUser(): Promise<User> {
    const me = await apiFetch<Me>("/me");
    // Gestion d'erreur ?
  
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