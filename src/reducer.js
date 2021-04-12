export const RECEIVE_DASH_META = 'receive_dash_meta';

export const dashReducer = (state={}, action) => {
  switch(action.type) {
    case RECEIVE_DASH_META:
      const { meta } = action.data;
      return {
        ...state,
        meta,
      };
    default:
      return state;
  }
}
