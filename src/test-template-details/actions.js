import webApi from './utils/webApi';

const PAGE_NAME = 'TEST_TEMPLATE_DETAILS';

export const START_TEST = `${PAGE_NAME}/START_TEST`;
export const GET_TEST_INSTANCES = `${PAGE_NAME}/GET_TEST_INSTANCES`;
export const CREATE_TEST_SCHEDULE = `${PAGE_NAME}/CREATE_TEST_SCHEDULE`;

export const startTest = (testId) => async(dispatch, getState) => {
  console.log("ACTION: starting test!");
  try {
    const response = await webApi.startTest(testId);
  } catch (error) {
    console.log(error);
  }
  // TODO: display success or error feedback depending on whether start test was successful
  dispatch({
    type: START_TEST,
  });
  await getTestInstances(testId)(dispatch, getState);
}

export const getTestInstances = (testId) => async(dispatch, getState) => {
  console.log("ACTION: getting test instances!");
  const response = await webApi.getTestInstances(testId);
  console.log(response);
  dispatch({
    type: GET_TEST_INSTANCES,
    data: response.data,
  });
}

export const createTestSchedule = (testId, scheduleName, cronspec) => async(dispatch, getState) => {
  try {
    const response = await webApi.createTestSchedule(testId, scheduleName, cronspec);
    console.log(response);
    dispatch({
      type: CREATE_TEST_SCHEDULE,
      data: response.data,
    });
  } catch (error) {
    console.log(error);
  }
}
