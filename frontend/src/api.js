const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/auth"; // Ensure the correct backend URL

// Signup Function
export const signupUser = async (userData) => {
  try {
    const formData = new FormData();
    formData.append("fullName", userData.fullName);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("mobile", userData.mobile);
    formData.append("password", userData.password);
    if (userData.profilePicture) {
      formData.append("profilePicture", userData.profilePicture);
    }

    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error("Error signing up:", error);
  }
};

// Login Function
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();

    if (data.token) {
      localStorage.setItem("user", JSON.stringify(data.user));  // Save user info
      localStorage.setItem("token", data.token);  // Save token
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};
