import axios from "axios";
import TokenManager from "./TokenManager";

const AuthAPI = {
  login: async (email, password) => {
    try {
      const response = await axios
        .post("http://localhost:8080/auth/login", { email, password });
      const accessToken = response.data;
      if (!accessToken) {
        throw new Error("No access token returned.");
      }
      // Set the access token and claims
      TokenManager.setAccessToken(accessToken);
      return accessToken;
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Rethrow the error so it can be handled in the component
    }
  },

  register: async (registrationData) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/register", registrationData);
      console.log("Registration successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  },

  logout: () => {
    TokenManager.clear(); // Clear the token and claims from sessionStorage
  }
};

export default AuthAPI;
