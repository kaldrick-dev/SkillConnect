const API_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("skillconnect_token");
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("The API is unavailable. Make sure the backend is running and try again.", 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem("skillconnect_token");
      localStorage.removeItem("skillconnect_user");
    }
    const fallbackMessage = response.status === 404 || response.status === 405
      ? "This action is not available on the running API. Restart or redeploy the backend and try again."
      : response.status >= 500
        ? "The API could not complete the request. Please try again."
        : `Request failed (${response.status}). Please try again.`;
    throw new ApiError(data.error || data.message || fallbackMessage, response.status);
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
  get: (id) => api(`/internships/${id}`),
  update: (id, details) => api(`/internships/${id}`, {
    method: "PUT",
    body: JSON.stringify(details),
  }),
  myApplications: () => api("/applications/mine"),
  applications: (id) => api(`/internships/${id}/applications`),
  workspace: (id) => api(`/internships/${id}/workspace`),
  updateApplication: (id, status) => api(`/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  }),
  assess: (id, details) => api(`/internships/${id}/assess`, {
    method: "POST",
    body: JSON.stringify(details),
  }),
  certificate: (id, studentId) => api(`/internships/${id}/certificate`, {
    method: "POST",
    body: JSON.stringify({ student_id: studentId }),
  }),
};

export const profileApi = {
  get: (id) => api(`/students/${id}`),
  update: (id, details) => api(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(details),
  }),
};

export const employersApi = {
  list: () => api("/employers/"),
  get: (userId) => api(`/employers/${userId}`),
  internships: (userId) => api(`/employers/${userId}/internships`),
  update: (userId, details) => api(`/employers/${userId}`, {
    method: "PUT",
    body: JSON.stringify(details),
  }),
};

export const mentorsApi = {
  list: () => api("/mentors/"),
  students: (mentorId) => api(`/mentors/${mentorId}/students`),
};

export const tasksApi = {
  list: (internshipId) => api(`/internships/${internshipId}/tasks`),
  create: (internshipId, details) => api(`/internships/${internshipId}/tasks`, {
    method: "POST",
    body: JSON.stringify(details),
  }),
  submit: (taskId, contentUrl) => api(`/tasks/${taskId}/submit`, {
    method: "POST",
    body: JSON.stringify({ content_url: contentUrl }),
  }),
};

export const submissionsApi = {
  mine: () => api("/submissions/mine"),
  forTask: (taskId) => api(`/submissions/task/${taskId}`),
  review: (submissionId, details) => api(`/submissions/${submissionId}/review`, {
    method: "PUT",
    body: JSON.stringify(details),
  }),
};

export const certificatesApi = {
  forStudent: (studentId) => api(`/certificates/student/${studentId}`),
};

export const adminApi = {
  overview: () => api("/admin/overview"),
  stats: () => api("/admin/stats"),
  users: () => api("/admin/users"),
  deactivate: (userId) => api(`/admin/users/${userId}`, {
    method: "DELETE",
  }),
  reactivate: (userId) => api(`/admin/users/${userId}/reactivate`, {
    method: "PATCH",
  }),
};
