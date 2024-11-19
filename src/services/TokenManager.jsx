import { jwtDecode } from 'jwt-decode';

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
