import React, { useState } from 'react';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  Block,
} from '@mui/icons-material';
import type { UserRole } from '@/types/auth.types';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

const mockUsers: UserData[] = [
  { id: '1', name: 'Govind (Administrator)', email: 'admin@enterprise.com', role: 'admin', department: 'IT', status: 'active', lastActive: '2 min ago' },
  { id: '2', name: 'Prem (Manager)', email: 'manager@enterprise.com', role: 'manager', department: 'Operations', status: 'active', lastActive: '5 min ago' },
  { id: '3', name: 'Arun (Employee)', email: 'user@enterprise.com', role: 'user', department: 'Sales', status: 'active', lastActive: '1 hour ago' },
  { id: '4', name: 'Kusuma', email: 'shiva.j@enterprise.com', role: 'user', department: 'Marketing', status: 'pending', lastActive: 'Never' },
  { id: '5', name: 'Shiva', email: 'chandana.c@enterprise.com', role: 'manager', department: 'Engineering', status: 'active', lastActive: '30 min ago' },
  { id: '6', name: 'Naga', email: 'naga.b@enterprise.com', role: 'user', department: 'HR', status: 'inactive', lastActive: '2 days ago' },
];

const statusStyles = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/10 text-warning',
};

export const UserManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <button className="btn-primary">
          <Add className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="enterprise-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterList className="h-5 w-5 text-muted-foreground" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
              className="form-input w-auto"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="enterprise-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Active</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge role-badge-${user.role}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{user.department}</td>
                  <td>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusStyles[user.status]
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{user.lastActive}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                        <Block className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Delete className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {mockUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-secondary py-1.5 px-3 text-sm" disabled>
              Previous
            </button>
            <button className="btn-secondary py-1.5 px-3 text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
