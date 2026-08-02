import { axiosClient } from "../axiosClient";
import { normalizeResponse } from "../responseHandler";

export const getApplications = async (payload) => {
  const response = await axiosClient.post(
    "applications/v1/fetchApplications",
    payload,
  );
  // console.log("object", response)
  return normalizeResponse(response);
};
export const uploadMedia = async (payload) => {
  const response = await axiosClient.post(
    "applications/v1/media/upload",
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return normalizeResponse(response);
};

export const createApplication = async (payload) => {
  const response = await axiosClient.post(
    "applications/v1/createApplication",
    payload,
  );

  return normalizeResponse(response);
};
export const getAllApplications = async (payload) => {
  const response = await axiosClient.post("applications/v1/fetchApplications", payload);

  return normalizeResponse(response);
};
export const updateStatus = async (payload) => {
  const response = await axiosClient.patch("applications/v1/updateApplication", payload);

  return normalizeResponse(response);
};

