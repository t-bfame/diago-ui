import * as actions from './actions';

const initialState = {
  testTemplate: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.CREATE_TEST:
      return {
        ...state,
      };
    case actions.GET_TEST:
      return {
        ...state,
        testTemplate: action.data.payload,
      };
    default:
      return state;
  }
};

export default reducer;
