import React, { useReducer, useEffect, useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { UserContext } from '../../hooks/UserContext';
import getClient from '../../model/client';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      height: 0,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#212121',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(25)
    }
  })

);
  
  const initialState = {
    username: '',
    password: '',
    isButtonDisabled: true,
    helperText: '',
    isError: false,
    registerLogin: 0
  };
  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'setUsername': 
        return {
          ...state,
          username: action.payload
        };
      case 'setPassword': 
        return {
          ...state,
          password: action.payload
        };
      case 'setIsButtonDisabled': 
        return {
          ...state,
          isButtonDisabled: action.payload
        };
      case 'loginSuccess': 
        return {
          ...state,
          helperText: action.payload,
          isError: false
        };
      case 'loginFailed': 
        return {
          ...state,
          helperText: action.payload,
          isError: true
        };
      case 'setIsError': 
        return {
          ...state,
          isError: action.payload
        };
      case 'swapFieldType':
        return {
          ...state,
          registerLogin: action.payload
        };
    }
  }

const Login = () => {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);
    const {setToken} = useContext(UserContext);
    let history = useHistory();

    useEffect(() => {
        if (state.username.trim() && state.password.trim()) {
         dispatch({
           type: 'setIsButtonDisabled',
           payload: false
         });
        } else {
          dispatch({
            type: 'setIsButtonDisabled',
            payload: true
          });
        }
      }, [state.username, state.password]);

    const handleLogin = async () => {
      return getClient().post('login, {
          username: state.username,
          password: state.password,
      })
      .then((res) => res.json())
      .then(async (result) => {
        if (result["data"]["success"] === "true") {
          setToken(result["data"]["payload"]["token"]);
          dispatch({
            type: 'loginSuccess',
            payload: 'Login Successful'
          });
          history.push("/dashboard");
        } else {
          dispatch({
            type: 'loginFailed',
            payload: 'Incorrect username or password'
          });
        }
      })
    };

    const handleSignUp = async () => {
      return getClient().post(`user`, {
        username: state.username,
        password: state.password,
      })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        if (result["data"]["success"] === "true") {
          dispatch({
            type: 'loginSuccess',
            payload: 'Account created!'
          });
        } else {
          dispatch({
            type: 'loginFailed',
            payload: 'Username already exists!'
          });
          console.log(result);
        }
      });
    }
    
    const handleKeyPress = (event: React.KeyboardEvent) => {
      if (event.keyCode === 13 || event.which === 13) {
        state.isButtonDisabled || handleFunc();
      }
    };
    
    const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
      (event) => {
        dispatch({
          type: 'setUsername',
          payload: event.target.value
        });
      };
    
    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
      (event) => {
        dispatch({
          type: 'setPassword',
          payload: event.target.value
        });
      }

    const handleFormTypeChange = () => {
      if (state.registerLogin === 1) {
        dispatch({
          type: "swapFieldType",
          payload: 0
        });
      } else {
        dispatch({
          type: "swapFieldType",
          payload: 1
        });
      }
    }

    let buttonText;
    let linkText;
    let handleFunc;
    let titleText;
    if (state.registerLogin === 1) {
      buttonText = "Login"
      linkText = "Don't have an account? Sign up here!"
      handleFunc = handleLogin
      titleText = "Sign in!"
    } else {
      buttonText = "Sign up"
      linkText = "Already have an account? Log in here!"
      handleFunc = handleSignUp
      titleText = "Sign up!"
    }

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title={titleText} />
          <CardContent>
            <div>
              <TextField
                error={state.isError}
                fullWidth
                id="username"
                type="email"
                label="Username"
                placeholder="Username"
                margin="normal"
                onChange={handleUsernameChange}
                onKeyPress={handleKeyPress}
              />
              <TextField
                error={state.isError}
                fullWidth
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                margin="normal"
                helperText={state.helperText}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
              />
            </div>
          </CardContent>
          <Link href="#" onClick={handleFormTypeChange}>{linkText}</Link>
          <CardActions>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className={classes.loginBtn}
              onClick={handleFunc}
              disabled={state.isButtonDisabled}>
              {buttonText}
            </Button>
          </CardActions>
        </Card>
      </form>
    );
  }
  
  export default Login;