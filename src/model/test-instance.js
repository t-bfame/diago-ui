import Document from './document';
import getClient from './client';
import store from '../store';
import { RECEIVE_DOCUMENTS } from './actions';

export default class TestInstance extends Document {
  static docName() {
    return 'test-instances';
  }

  static async forTestId(testId) {
    const response = await getClient().get(`${this.docName()}/${testId}`);
    if (response.data?.success) {
      const docs = response.data?.payload.map(raw => new this(raw));
      store.dispatch({
        type: RECEIVE_DOCUMENTS,
        data: {
          docs,
          docType: this.docName(),
        },
      });
      return Object.assign(response, { docs });
    }
    return response;
  }

  isTerminal() {
    return ['done', 'failed', 'stopped'].includes(this.Status);
  }
}
