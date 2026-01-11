export interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'user';
    department: string;
    status: 'active' | 'inactive' | 'pending';
    lastActive: string;
  }
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  export const UserService = {
    async getUsers(): Promise<UserData[]> {
      const res = await fetch(`${BASE_URL}/users`);
      if (!res.ok) throw new Error('Fetch failed');
      return res.json();
    },
  
    async addUser(user: Omit<UserData, 'id'>): Promise<UserData> {
      const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Add failed');
      return res.json();
    },
  
    async updateUser(id: string, user: UserData): Promise<UserData> {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error('Update failed');
      return res.json();
    },
  
    async deleteUser(id: string): Promise<void> {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
    },
  
    async toggleBlock(id: string): Promise<UserData> {
      const res = await fetch(`${BASE_URL}/users/${id}/block`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error('Block failed');
      return res.json();
    },
  };
  
