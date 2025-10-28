export const API_CONFIG = {
  BASE_URL: "http://localhost:3001",
  ENDPOINTS: {
    // Auth
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",

    // Users
    PROFILE: "/users/profile",
    USERS: "/users",

    // Tasks
    TASKS: "/tasks",
    TASK_STATS: "/tasks/stats",
  },

  // Configurações do JWT
  TOKEN_KEY: "task_manager_token",
  TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
} as const;

export const APP_CONFIG = {
  APP_NAME: "Task Manager",
  DEFAULT_PAGE_SIZE: 10,
  ROUTES: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    TASKS: "/tasks",
    PROFILE: "/profile",
  },
} as const;
