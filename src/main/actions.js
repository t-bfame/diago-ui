import WebApi from './utils/webApi';

const PAGE_NAME = 'MAIN';

export const TOGGLE_LOGIN = `${PAGE_NAME}/TOGGLE_LOGIN`;

export const toggleLogin = () => (dispatch, getState) => {
  dispatch({
    type: TOGGLE_LOGIN,
  });
}
