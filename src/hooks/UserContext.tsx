  
import { createContext } from 'react';
import { IUserContext } from './index.d';

export const UserContext = createContext<IUserContext>({
    user: {username : "", exp: ""},
    setUser: user => {},
    isLoading: false,
    setLoading: isLoading => {},
    token: "",
    setToken: token => {}
});