// import React, { useState } from 'react';
// import {
//   Add,
//   Search,
//   FilterList,
//   Edit,
//   Delete,
//   Block,
// } from '@mui/icons-material';
// import type { UserRole } from '@/types/auth.types';

// /* ================= TYPES ================= */
// interface UserData {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   department: string;
//   status: 'active' | 'inactive' | 'pending';
//   lastActive: string;
// }

// /* ================= INITIAL DATA ================= */
// const initialUsers: UserData[] = [
//   {
//     id: '1',
//     name: 'Govind',
//     email: 'admin@enterprise.com',
//     role: 'admin',
//     department: 'IT',
//     status: 'active',
//     lastActive: '2 min ago',
//   },
//   {
//     id: '2',
//     name: 'Prem',
//     email: 'manager@enterprise.com',
//     role: 'manager',
//     department: 'Operations',
//     status: 'active',
//     lastActive: '5 min ago',
//   },
//   {
//     id: '3',
//     name: 'Arun',
//     email: 'user@enterprise.com',
//     role: 'user',
//     department: 'Sales',
//     status: 'pending',
//     lastActive: 'Never',
//   },
// ];

// const emptyUser: UserData = {
//   id: '',
//   name: '',
//   email: '',
//   role: 'user',
//   department: '',
//   status: 'active',
//   lastActive: 'Just now',
// };

// const statusStyles = {
//   active: 'bg-success/10 text-success',
//   inactive: 'bg-muted text-muted-foreground',
//   pending: 'bg-warning/10 text-warning',
// };

// /* ================= COMPONENT ================= */
// const UserManagementPage: React.FC = () => {
//   const [users, setUsers] = useState<UserData[]>(initialUsers);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingUserId, setEditingUserId] = useState<string | null>(null);
//   const [formUser, setFormUser] = useState<UserData>(emptyUser);

//   /* ================= FILTER ================= */
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesRole =
//       roleFilter === 'all' || user.role === roleFilter;

//     return matchesSearch && matchesRole;
//   });

//   /* ================= ADD / EDIT ================= */
//   const openAddModal = () => {
//     setEditingUserId(null);
//     setFormUser(emptyUser);
//     setIsModalOpen(true);
//   };

//   const openEditModal = (user: UserData) => {
//     setEditingUserId(user.id);
//     setFormUser(user);
//     setIsModalOpen(true);
//   };

//   const handleSaveUser = () => {
//     if (!formUser.name || !formUser.email || !formUser.department) {
//       alert('Please fill all fields');
//       return;
//     }

//     if (editingUserId) {
//       // EDIT
//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === editingUserId ? { ...formUser } : u
//         )
//       );
//     } else {
//       // ADD → TOP
//       setUsers((prev) => [
//         {
//           ...formUser,
//           id: Date.now().toString(),
//           lastActive: 'Just now',
//         },
//         ...prev,
//       ]);
//     }

//     setIsModalOpen(false);
//     setFormUser(emptyUser);
//     setEditingUserId(null);
//   };

//   /* ================= BLOCK / UNBLOCK ================= */
//   const toggleBlockUser = (id: string) => {
//     setUsers((prev) =>
//       prev.map((u) =>
//         u.id === id
//           ? {
//               ...u,
//               status: u.status === 'inactive' ? 'active' : 'inactive',
//             }
//           : u
//       )
//     );
//   };

//   /* ================= DELETE ================= */
//   const deleteUser = (id: string) => {
//     if (confirm('Are you sure you want to delete this user?')) {
//       setUsers((prev) => prev.filter((u) => u.id !== id));
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">User Management</h1>
//           <p className="text-muted-foreground">
//             Manage users and roles
//           </p>
//         </div>
//         <button className="btn-primary" onClick={openAddModal}>
//           <Add className="h-5 w-5" />
//           Add User
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="enterprise-card flex gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//           <input
//             className="form-input pl-10"
//             placeholder="Search users..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <FilterList className="h-5 w-5 text-muted-foreground" />
//           <select
//             className="form-input"
//             value={roleFilter}
//             onChange={(e) =>
//               setRoleFilter(e.target.value as UserRole | 'all')
//             }
//           >
//             <option value="all">All Roles</option>
//             <option value="admin">Admin</option>
//             <option value="manager">Manager</option>
//             <option value="user">User</option>
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="enterprise-card p-0 overflow-hidden">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th>User</th>
//               <th>Role</th>
//               <th>Department</th>
//               <th>Status</th>
//               <th className="text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>
//                   <p className="font-medium">{user.name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {user.email}
//                   </p>
//                 </td>
//                 <td className="capitalize">{user.role}</td>
//                 <td>{user.department}</td>
//                 <td>
//                   <span
//                     className={`rounded-full px-2 py-1 text-xs ${statusStyles[user.status]}`}
//                   >
//                     {user.status}
//                   </span>
//                 </td>
//                 <td>
//                   <div className="flex justify-end gap-2">
//                     <button onClick={() => openEditModal(user)}>
//                       <Edit className="h-4 w-4" />
//                     </button>
//                     <button onClick={() => toggleBlockUser(user.id)}>
//                       <Block className="h-4 w-4" />
//                     </button>
//                     <button onClick={() => deleteUser(user.id)}>
//                       <Delete className="h-4 w-4 text-destructive" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//           <div className="enterprise-card w-full max-w-md space-y-4">
//             <h2 className="text-lg font-semibold">
//               {editingUserId ? 'Edit User' : 'Add User'}
//             </h2>

//             <input
//               className="form-input"
//               placeholder="Name"
//               value={formUser.name}
//               onChange={(e) =>
//                 setFormUser({ ...formUser, name: e.target.value })
//               }
//             />

//             <input
//               className="form-input"
//               placeholder="Email"
//               value={formUser.email}
//               onChange={(e) =>
//                 setFormUser({ ...formUser, email: e.target.value })
//               }
//             />

//             <select
//               className="form-input"
//               value={formUser.role}
//               onChange={(e) =>
//                 setFormUser({
//                   ...formUser,
//                   role: e.target.value as UserRole,
//                 })
//               }
//             >
//               <option value="admin">Admin</option>
//               <option value="manager">Manager</option>
//               <option value="user">User</option>
//             </select>

//             <input
//               className="form-input"
//               placeholder="Department"
//               value={formUser.department}
//               onChange={(e) =>
//                 setFormUser({
//                   ...formUser,
//                   department: e.target.value,
//                 })
//               }
//             />

//             <select
//               className="form-input"
//               value={formUser.status}
//               onChange={(e) =>
//                 setFormUser({
//                   ...formUser,
//                   status: e.target.value as
//                     | 'active'
//                     | 'inactive'
//                     | 'pending',
//                 })
//               }
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="pending">Pending</option>
//             </select>

//             <div className="flex justify-end gap-2">
//               <button
//                 className="btn-secondary"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button className="btn-primary" onClick={handleSaveUser}>
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagementPage;


//api with fake data 


import React, { useEffect, useState } from 'react';
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  Block,
} from '@mui/icons-material';
import { UserService, UserData } from '@/services/user.service';

/* ================= FAKE DATA (FALLBACK) ================= */
const fallbackUsers: UserData[] = [
  {
    id: 'f1',
    name: 'Demo Admin',
    email: 'demo@enterprise.com',
    role: 'admin',
    department: 'IT',
    status: 'active',
    lastActive: '1 min ago',
  },
];

const emptyUser: UserData = {
  id: '',
  name: '',
  email: '',
  role: 'user',
  department: '',
  status: 'active',
  lastActive: 'Just now',
};

const statusStyles = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-muted text-muted-foreground',
  pending: 'bg-warning/10 text-warning',
};

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserData['role']>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formUser, setFormUser] = useState<UserData>(emptyUser);

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await UserService.getUsers();
        setUsers(data);
      } catch {
        setUsers(fallbackUsers); // 👈 fake data
      }
    };
    loadUsers();
  }, []);

  /* ================= FILTER ================= */
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  /* ================= ADD / EDIT ================= */
  const saveUser = async () => {
    if (!formUser.name || !formUser.email || !formUser.department) {
      alert('All fields required');
      return;
    }

    try {
      if (editingId) {
        const updated = await UserService.updateUser(editingId, formUser);
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
      } else {
        const created = await UserService.addUser({
          ...formUser,
          lastActive: 'Just now',
        });
        setUsers((prev) => [created, ...prev]); // 👈 TOP
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormUser(emptyUser);
    } catch {
      alert('Server error');
    }
  };

  /* ================= DELETE ================= */
  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await UserService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  /* ================= BLOCK ================= */
  const toggleBlock = async (id: string) => {
    try {
      const updated = await UserService.toggleBlock(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? updated : u))
      );
    } catch {
      alert('Action failed');
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingId(null);
            setFormUser(emptyUser);
            setIsModalOpen(true);
          }}
        >
          <Add className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="enterprise-card flex gap-4">
        <input
          className="form-input flex-1"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-input"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="enterprise-card p-0">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <b>{u.name}</b>
                  <div className="text-sm text-muted-foreground">
                    {u.email}
                  </div>
                </td>
                <td>{u.role}</td>
                <td>{u.department}</td>
                <td>
                  <span className={statusStyles[u.status]}>
                    {u.status}
                  </span>
                </td>
                <td className="text-right">
                  <Edit
                    onClick={() => {
                      setEditingId(u.id);
                      setFormUser(u);
                      setIsModalOpen(true);
                    }}
                  />
                  <Block onClick={() => toggleBlock(u.id)} />
                  <Delete onClick={() => deleteUser(u.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="enterprise-card w-full max-w-md space-y-3">
            <h2>{editingId ? 'Edit User' : 'Add User'}</h2>

            <input
              className="form-input"
              placeholder="Name"
              value={formUser.name}
              onChange={(e) =>
                setFormUser({ ...formUser, name: e.target.value })
              }
            />
            <input
              className="form-input"
              placeholder="Email"
              value={formUser.email}
              onChange={(e) =>
                setFormUser({ ...formUser, email: e.target.value })
              }
            />
            <input
              className="form-input"
              placeholder="Department"
              value={formUser.department}
              onChange={(e) =>
                setFormUser({ ...formUser, department: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={saveUser}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
