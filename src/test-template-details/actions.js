import webApi from './utils/webApi';

const PAGE_NAME = 'TEST_TEMPLATE_DETAILS';

export const START_TEST = `${PAGE_NAME}/START_TEST`;
export const GET_TEST_INSTANCES = `${PAGE_NAME}/GET_TEST_INSTANCES`;

export const startTest = () => (dispatch, getState) => {
  dispatch({
    type: START_TEST,
  });
}

export const getTestInstances = (testId) => async(dispatch, getState) => {
  const response = await webApi.getTestInstances(testId);
  console.log(response);
  dispatch({
    type: GET_TEST_INSTANCES,
    data: response.data,
  });
}
