import Document from './document';
import getClient from './client';
import store from '../store';
import { RECEIVE_DOCUMENTS } from './actions';

export default class Test extends Document {
  static docName() {
    return 'tests';
  }

  static async forPrefix(prefix) {
    const response = await getClient().get(`${this.docName()}?prefix=${prefix}`);
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

  async start() {
    const response = await getClient().post(`${Test.docName()}/${this.ID}/start`);
    return response;
  }

  async stop() {
    const response = await getClient().post(`${Test.docName()}/${this.ID}/stop`);
    return response;
  }
}
