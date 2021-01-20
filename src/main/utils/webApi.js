import axios from 'axios';

const BASE_URL = '/api';

const createTest = async(name, jobs) => {
  const response = await axios.post(`${BASE_URL}/tests`, {
    "Name": name,
    "Jobs": jobs,
  });
  return response;
}

const getTest = async(testId) => {
  const response = await axios.get(`${BASE_URL}/tests/${testId}`);
  return response;
}

const submitTest = async() => {

}

const getTestInstance = async() => {

}

export default {
  createTest,
  getTest,
};
