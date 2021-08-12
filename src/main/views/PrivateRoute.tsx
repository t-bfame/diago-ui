import { useContext, Component } from "react";
import { UserContext } from "../../hooks/UserContext";
import {
  Route,
  Redirect,
} from "react-router-dom";

interface IPrivateRouteProps {
  component: Component
  path: string
}

export default function PrivateRoute({ component, ...rest }: IPrivateRouteProps) {
  let auth = useContext(UserContext);
  console.log(auth);
  console.log(auth.user.username);
  console.log(auth.user.username && auth.user.username !== "");
  return (
    <Route
      {...rest}
      render={props =>
        (auth.user.username && auth.user.username !== "") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/auth/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}