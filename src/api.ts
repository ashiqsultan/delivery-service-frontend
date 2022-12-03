import axios from 'axios';
import { Point } from 'geojson';
import { API_URL } from './constants';
import { TokenRes, UserRes, ShipmentRes } from './types';

const getToken = () => localStorage.getItem('x-access-token') || '';

export const createUser = async (
  email: string,
  name: string,
  password: string
) => {
  try {
    const roles = ['default'];
    const data = {
      email,
      name,
      password,
      roles,
    };
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data as UserRes;
  } catch (error) {
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  const basicAuth = 'Basic ' + btoa(email + ':' + password);
  const response = await axios.post(
    `${API_URL}/auth/login`,
    {},
    { headers: { Authorization: basicAuth } }
  );
  return response.data as TokenRes;
};

export const getUserData = async (): Promise<UserRes> => {
  const config = {
    method: 'get',
    url: `${API_URL}/user`,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
  const response = await axios(config);
  return response.data as UserRes;
};

export const createShipment = async (
  pickupLocation: Point,
  dropLocation: Point
): Promise<ShipmentRes> => {
  var data = { pickupLocation, dropLocation };
  var config = {
    method: 'post',
    url: `${API_URL}/shipment`,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };
  const response = await axios(config);
  return response.data as ShipmentRes;
};
