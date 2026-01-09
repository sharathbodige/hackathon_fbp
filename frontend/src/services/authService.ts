import type {
  LoginCredentials,
  LoginResponse,
  User,
  UserRole,
} from '@/types/auth.types';

// =======================
// ENV CONFIG
// =======================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
console.log('API BASE URL:', import.meta.env.VITE_API_BASE_URL);


if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

// =======================
// MOCK USERS (DEMO)
// =======================
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@enterprise.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@enterprise.com',
      firstName: 'John',
      lastName: 'Administrator',
      role: 'admin',
      department: 'IT Administration',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
    },
  },
  'manager@enterprise.com': {
    password: 'manager123',
    user: {
      id: '2',
      email: 'manager@enterprise.com',
      firstName: 'Sarah',
      lastName: 'Manager',
      role: 'manager',
      department: 'Operations',
      createdAt: '2024-02-15T00:00:00Z',
      lastLogin: new Date().toISOString(),
    },
  },
  'user@enterprise.com': {
    password: 'user123',
    user: {
      id: '3',
      email: 'user@enterprise.com',
      firstName: 'Mike',
      lastName: 'Employee',
      role: 'user',
      department: 'Sales',
      createdAt: '2024-03-20T00:00:00Z',
      lastLogin: new Date().toISOString(),
    },
  },
};

// =======================
// HELPERS
// =======================
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const generateToken = (user: User): string => {
  return btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 60 * 60 * 1000,
    })
  );
};

const generateRefreshToken = (user: User): string => {
  return btoa(
    JSON.stringify({
      sub: user.id,
      type: 'refresh',
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  );
};

// =======================
// AUTH SERVICE
// =======================
export const authService = {
  // -----------------------
  // LOGIN (DEMO + BACKEND)
  // -----------------------
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const email = credentials.email.toLowerCase();

    // 🧪 DEMO LOGIN
    if (MOCK_USERS[email]) {
      await delay(800);

      const mockUser = MOCK_USERS[email];
      if (mockUser.password !== credentials.password) {
        throw new Error('Invalid email or password');
      }

      const user: User = {
        ...mockUser.user,
        lastLogin: new Date().toISOString(),
      };

      return {
        user,
        token: generateToken(user),
        refreshToken: generateRefreshToken(user),
      };
    }

    // 🌐 REAL BACKEND LOGIN
    const response = await fetch(`${API_BASE_URL}/endpointApi`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  // -----------------------
  // LOGOUT
  // -----------------------
  async logout(): Promise<void> {
    await delay(300);
  },

  // -----------------------
  // REFRESH TOKEN (DEMO)
  // -----------------------
  async refreshToken(
    refreshToken: string
  ): Promise<{ token: string; user: User }> {
    await delay(300);

    const payload = JSON.parse(atob(refreshToken));

    if (payload.exp < Date.now()) {
      throw new Error('Refresh token expired');
    }

    const userData = Object.values(MOCK_USERS).find(
      (u) => u.user.id === payload.sub
    );

    if (!userData) {
      throw new Error('User not found');
    }

    return {
      token: generateToken(userData.user),
      user: userData.user,
    };
  },

  // -----------------------
  // VALIDATE TOKEN (DEMO)
  // -----------------------
  async validateToken(token: string): Promise<User> {
    await delay(200);

    const payload = JSON.parse(atob(token));

    if (payload.exp < Date.now()) {
      throw new Error('Token expired');
    }

    const userData = Object.values(MOCK_USERS).find(
      (u) => u.user.id === payload.sub
    );

    if (!userData) {
      throw new Error('User not found');
    }

    return userData.user;
  },

  // -----------------------
  // DEMO CREDENTIALS
  // -----------------------
  getDemoCredentials(): { role: UserRole; email: string; password: string }[] {
    return [
      { role: 'admin', email: 'admin@enterprise.com', password: 'admin123' },
      { role: 'manager', email: 'manager@enterprise.com', password: 'manager123' },
      { role: 'user', email: 'user@enterprise.com', password: 'user123' },
    ];
  },
};
