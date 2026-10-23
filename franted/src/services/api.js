const API_URL = import.meta.env.VITE_API_URL || "/api";

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem("token", token);
        return;
    }

    localStorage.removeItem("token");
};

export const setAuthUser = (user) => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        return;
    }

    localStorage.removeItem("user");
};

export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const api = async (
    endpoint,
    options = {}
) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {}),
                ...(options.headers || {}),
            },
        }
    );

    const text = await response.text();
    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch (error) {
            throw new Error(
                "The backend returned an HTML page instead of JSON. Please make sure the API server is running.",
                { cause: error }
            );
        }
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
};

export const login = async (email, password) => {
    const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });

    setAuthToken(data.token);
    setAuthUser(data.user);

    return data;
};

export const logout = () => clearAuth();

export const getDashboard = () =>
    api("/dashboard");

export const getProperties = (params = "") =>
    api(`/properties${params}`);

export const getProperty = (id) =>
    api(`/properties/${id}`);

export const createProperty = (data) =>
    api("/properties", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateProperty = (id, data) =>
    api(`/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteProperty = (id) =>
    api(`/properties/${id}`, {
        method: "DELETE",
    });

export const getProjects = (params = "") =>
    api(`/projects${params}`);

export const getProject = (id) =>
    api(`/projects/${id}`);

export const createProject = (data) =>
    api("/projects", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateProject = (id, data) =>
    api(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteProject = (id) =>
    api(`/projects/${id}`, {
        method: "DELETE",
    });

export const getLeads = (params = "") =>
    api(`/leads${params}`);

export const createLead = (data) =>
    api("/leads", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateLead = (id, data) =>
    api(`/leads/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteLead = (id) =>
    api(`/leads/${id}`, {
        method: "DELETE",
    });

export const getVisits = (params = "") =>
    api(`/visits${params}`);

export const createVisit = (data) =>
    api("/visits", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateVisit = (id, data) =>
    api(`/visits/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteVisit = (id) =>
    api(`/visits/${id}`, {
        method: "DELETE",
    });

export const getSiteSettings = () =>
    api("/site-settings");

export const updateSiteSettings = (data) =>
    api("/site-settings", {
        method: "PUT",
        body: JSON.stringify(data),
    });