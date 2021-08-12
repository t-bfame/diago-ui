import { useContext, Component } from "react";
import { UserContext } from "../../hooks/UserContext";
import {
  Route,
  Redirect,
} from "react-router-dom";

export default function PrivateRoute({ component: Component, ...rest }) {
  let auth = useContext(UserContext);
  console.log(auth);
  return (
    <Route
      {...rest}
      render={props =>
        (auth.user.username !== "") ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/login" />
        )
      }
    />
  );
}