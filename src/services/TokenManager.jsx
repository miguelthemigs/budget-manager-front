import { jwtDecode } from 'jwt-decode';
/**
- Session Storage: 
no theft of tokens, bc its cleared when the tab is closed
no data sent every http request

- Local Storage:
persists after tab is closed
tokens has to be explicitly cleared
prone to XSS attacks
no data sent every http request

- Cookies:
persist across sessions
more complex
sent in every http request, making it prone to CSRF attacks

As I am prioritizing security because we are gonna have to do a security report, 
the most secure and simpler way is to use session storage, as I don't need to worry about token theft
and XSS and CSRF attacks.
 */
const TokenManager = {
    getAccessToken: () => sessionStorage.getItem("accessToken"),
    getClaims: () => {
        if (!sessionStorage.getItem("claims")) return undefined;
        return JSON.parse(sessionStorage.getItem("claims"));
    },
    setAccessToken: (token) => {
        try {
            const claims = jwtDecode(token);
            sessionStorage.setItem("accessToken", token);
            sessionStorage.setItem("claims", JSON.stringify(claims));
            console.log("Token set", claims);
            return claims;
            
        } catch (error) {
            console.error("Invalid token", error);
            TokenManager.clear();
            return undefined;
        }
    },
    getUserId: () => {
        const claims = TokenManager.getClaims();
        return claims?.userId || null; 
    },
    getUserRole: () => {
        const claims = TokenManager.getClaims();
        return claims?.role || null;
    },
    isTokenExpired: () => {
        const claims = TokenManager.getClaims();
        if (!claims || !claims.exp) return true; 
        return Date.now() >= claims.exp * 1000; 
    },
    clear: () => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("claims");
    }
};

export default TokenManager;
