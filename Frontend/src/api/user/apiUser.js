
import { axiosClient } from "../axiosClient";
import { normalizeResponse } from "../responseHandler";

export const getDashboard = async () => {

  const response = await axiosClient.get(
    "/user/v1/dashboard",
    {}
  );

  return normalizeResponse(response);
};

export const getUserProfile = async (payload) =>{
  const response =  await axiosClient.get(
    "/user/v1/profile",
    payload
  )

  return normalizeResponse(response)
}