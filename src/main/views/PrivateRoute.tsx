import { useContext, Component } from "react";
import { UserContext } from "../../hooks/UserContext";
import {
    Route,
    Redirect,   
  } from "react-router-dom";

interface IPrivateRouteProps {
    component : Component
    path: string
}

export default function PrivateRoute({ component, ...rest } : IPrivateRouteProps) {
  let auth = useContext(UserContext);
  console.log(auth);
  return (
    <Route
      {...rest}
      render={props =>
        (auth.user.username !== "") ? (
          <Component {...props} />
        ) : (
          <Redirect to ="/auth/login"/>
        )
      }
    />
  );
}