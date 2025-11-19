import axios from "axios";

// Base Axios instance with defaults
const api = axios.create({
baseURL:"http://localhost:5000/api/auth",
withCredentials: true, // important for cookies/session
headers: {
"Content-Type": "application/json",
},
});

// Signup function
export const signup = async ({ email, password }) => {
return api.post("/signup", { email, password });
};

// Login function
export const login = async ({ email, password }) => {
return api.post("/login", { email, password });
};

// Logout function
export const logout = async () => {
return api.post("/logout");
};

// Fetch current user
export const getMe = async () => {
return api.get("/me");
};

// Request password reset
export const requestPasswordReset = async (email) => {
return api.post("/forget-password", { email });
};

// Reset password
export const resetPassword = async ({ email, token, newPassword }) => {
return api.post("/reset-password", { email, token, newPassword });
};
