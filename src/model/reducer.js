import { RECEIVE_DOCUMENTS } from './actions';

const reduceDocs = (state={}, action) => {
  switch(action.type) {
    case RECEIVE_DOCUMENTS:
      const { docType, docs } = action.data;
      return {
        ...state,
        [docType]: new Map([...(state[docType] || new Map()), ...docs.map(doc => [doc.ID, doc])]),
      };
    default:
      return state;
  }
}

export default reduceDocs;
