import axios from 'axios';

class Client {
  BASE_URL = '/api';
  get = path => axios.get(`${this.BASE_URL}/${path}`);
  post = (path, data) => axios.post(`${this.BASE_URL}/${path}`, data);
  delete = path => axios.delete(`${this.BASE_URL}/${path}`);
}

let client;
const getClient = () => {
  if (!client) {
    client = new Client();
  }
  return client;
};

export default getClient;
