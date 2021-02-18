import axios from 'axios';

const BASE_URL = '/api';

const startTest = async(testId) => {
  const response = await axios.get(`${BASE_URL}/start-test/${testId}`);
  return response;
}

const getTestInstances = async(testId) => {
  const response = await axios.get(`${BASE_URL}/test-instances/${testId}`);
  return response;
}

export default {
  startTest,
  getTestInstances,
};
