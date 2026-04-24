export type UserRole = 'admin' | 'colaborador';

export type User = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatarColor: string;
};
