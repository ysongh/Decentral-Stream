import axios from "axios";

import { HUDDLE01_APIKEY } from "../keys";

export const createRoomAPI = async () => {
  try {
    const response = await axios.post(
      'https://iriko.testing.huddle01.com/api/v1/create-room',
      {
        title: 'Huddle01-Test',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': HUDDLE01_APIKEY,
        },
      }
    );
    console.log(response);
    return response.data.data.roomId;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getMeetingDetailAPI = async (roomId) => {
  try {
    const response = await axios.get(
      `https://iriko.testing.huddle01.com/api/v1/meeting-details/${roomId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': HUDDLE01_APIKEY,
        },
      }
    );
    console.log(response.data);
    alert(JSON.stringify(response.data));
  } catch (error) {
    console.log(error);
    return null;
  }
}