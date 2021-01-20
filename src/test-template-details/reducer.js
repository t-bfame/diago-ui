import * as actions from './actions';

const initialState = {
  testInstances: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.START_TEST:
      return {
        ...state,
      };
    case actions.GET_TEST_INSTANCES:
      return {
        ...state,
        testInstances: action.data.payload,
      };
    default:
      return state;
  }
};

export default reducer;
