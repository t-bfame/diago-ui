import { ReactNode, useContext } from "react";
import { UserContext } from "../../hooks/UserContext";
import {
    Route,
    Redirect,   
  } from "react-router-dom";

interface IPrivateRouteProps {
    children : ReactNode
    path: string
}

export default function PrivateRoute({ children, ...rest } : IPrivateRouteProps) {
    let auth = useContext(UserContext);
    return (
      <Route
        {...rest}
        render={({ location }) =>
          (auth.user.username !== "") ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }