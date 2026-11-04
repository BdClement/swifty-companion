import React, { createContext, useState } from "react";
import { FullIdentityResponse } from "@/features/profile/types/type";

type ProfileContextType = {
  fullIdentity: FullIdentityResponse | null;
  setFullIdentity: React.Dispatch<React.SetStateAction<FullIdentityResponse | null>>;
};

export const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [fullIdentity, setFullIdentity] = useState<FullIdentityResponse | null>(null);

  return (
    <ProfileContext.Provider value={{ fullIdentity, setFullIdentity }}>
      {children}
    </ProfileContext.Provider>
  );
}
