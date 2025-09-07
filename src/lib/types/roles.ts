export type Role = 'resident' | 'owner' | 'board' | 'admin';

export const roleLabels: Record<Role, string> = {
  resident: 'Bewohner',
  owner: 'Eigentümer',
  board: 'Beirat',
  admin: 'Administrator',
};
