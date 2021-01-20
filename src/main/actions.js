import WebApi from './utils/webApi';

const PAGE_NAME = 'MAIN';

export const CREATE_TEST = `${PAGE_NAME}/CREATE_TEST`;
export const GET_TEST = `${PAGE_NAME}/GET_TEST`;

export const createTest = () => (dispatch, getState) => {
  dispatch({
    type: CREATE_TEST,
  });
}

export const getTest = (testId) => async(dispatch, getState) => {
  if (!testId) {
    dispatch({
      type: GET_TEST,
      data: {payload: null}
    })
    return;
  }
  const response = await WebApi.getTest(testId);
  dispatch({
    type: GET_TEST,
    data: response.data,
  });
}
