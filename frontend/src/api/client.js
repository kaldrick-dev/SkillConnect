const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("skillconnect_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem("skillconnect_token");
      localStorage.removeItem("skillconnect_user");
    }
    throw new ApiError(data.error || "Something went wrong. Please try again.", response.status);
  }
  return data;
}

export const authApi = {
  login: (credentials) => api("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),
  register: (details) => api("/auth/register", {
    method: "POST",
    body: JSON.stringify(details),
  }),
};

export const internshipsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== "" && value != null),
    );
    return api(`/internships${query.size ? `?${query}` : ""}`);
  },
  apply: (id) => api(`/internships/${id}/apply`, { method: "POST" }),
  create: (details) => api("/internships", {
    method: "POST",
    body: JSON.stringify(details),
  }),
};

export const profileApi = {
  get: (id) => api(`/students/${id}`),
  update: (id, details) => api(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(details),
  }),
};
