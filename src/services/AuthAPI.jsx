import axios from "axios";
import TokenManager from "./TokenManager";

const AuthAPI = {
  login: (email, password) => {
    return axios
      .post("http://localhost:8080/auth/login", { email, password })
      .then((response) => {
        const accessToken = response.data;
        if (!accessToken) {
          throw new Error("No access token returned.");
        }
        // Set the access token and claims
        TokenManager.setAccessToken(accessToken);
        return accessToken; // Return the token in case you want to use it elsewhere
      })
      .catch((error) => {
        console.error("Login failed", error);
        throw error; // Rethrow the error so it can be handled in the component
      });
  },

  register: (username, email, password, repeatedPassword) => {
    return axios
      .post("http://localhost:8080/auth/register", { username, email, password, repeatedPassword })
      .then((response) => {
        // You may want to process the response here, e.g., handle user registration success
        console.log("Registration successful:", response.data);
        return response.data; // This can be used for further steps like logging in or redirecting
      })
      .catch((error) => {
        console.error("Registration failed", error);
        throw error; // Rethrow the error so it can be handled in the component
      });
  },

  logout: () => {
    TokenManager.clear(); // Clear the token and claims from sessionStorage
  }
};

export default AuthAPI;
