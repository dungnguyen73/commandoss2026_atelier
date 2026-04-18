import { atom } from 'nanostores';

const ROLE_STORAGE_KEY = 'atelier-active-role';

export type Role = "Artisan" | "Owner" | "Verifier" | "Buyer";
export const ROLES: Role[] = ["Artisan", "Owner", "Verifier", "Buyer"];

// Helper to load from localStorage
const loadRole = (): Role => {
  try {
    const stored = localStorage.getItem(ROLE_STORAGE_KEY);
    return (stored && ROLES.includes(stored as Role)) ? (stored as Role) : "Artisan";
  } catch (e) {
    return "Artisan";
  }
};

export const $roleStore = atom<Role>(loadRole());

// Listen for changes and persist
$roleStore.listen((role) => {
  localStorage.setItem(ROLE_STORAGE_KEY, role);
});
