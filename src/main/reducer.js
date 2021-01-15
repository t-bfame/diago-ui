import * as actions from './actions';

const initialState = {
  loggedIn: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_LOGIN:
      return {
        ...state,
        loggedIn: !state.loggedIn,
      }
    default:
      return state
  }
};

export default reducer;
