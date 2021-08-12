export interface IUserCookie {
    username: string;
    exp: string;
}

export interface IUserContext {
    user: IUserCookie, 
    setUser: React.Dispatch<React.SetStateAction<IUserCookie>>,
    isLoading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    token: string,
    setToken: React.Dispatch<React.SetStateAction<string>>
}