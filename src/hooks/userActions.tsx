import jwtDecode from 'jwt-decode';
import { useState, useEffect } from 'react';
import { IUserCookie } from './index.d';

export default function useUserActions() {

    let userStr = sessionStorage.getItem("user");
    let userRes : IUserCookie = userStr ? JSON.parse(userStr) : {username : "", exp: ""};
    const [user, setUser] = useState<IUserCookie>(userRes);

    let tokenStr = sessionStorage.getItem("access_token");
    if (tokenStr == null) {
        tokenStr = "";
    }
    const [token, setToken] = useState(tokenStr);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (token !== "invalid" && token !== "") {
            sessionStorage.setItem("access_token", token);
            let decoded = jwtDecode<IUserCookie>(token);
            setUser(decoded);
        } else if (token === "invalid") {
            console.log("here");
            sessionStorage.removeItem("access_token");
            setUser({username: "", exp: ""});
        }
    }, [token]);

    useEffect(() => {
        sessionStorage.setItem("user", JSON.stringify(user));
    }, [user]);
    
    return {
        user,
        setUser,
        isLoading,
        setLoading,
        token,
        setToken
    }
}