import { atom } from 'nanostores';

export type Role = "Artisan" | "Owner" | "Verifier" | "Buyer";
export const ROLES: Role[] = ["Artisan", "Owner", "Verifier", "Buyer"];

export const $roleStore = atom<Role>("Artisan");
