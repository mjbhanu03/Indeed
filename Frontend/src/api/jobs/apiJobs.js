
import { axiosClient } from "../axiosClient";
import { normalizeResponse } from "../responseHandler";

export const getJobs = async () => {

  const response = await axiosClient.post(
    "/jobs/v1/fetchJobs",
    {},
    {
      requireAuth: false
    }
  );
  console.log("Idhar to dekho", response)
  return normalizeResponse(response);
};
export const getFilteredJobs = async (payload) => {

  const response = await axiosClient.post(
    "/jobs/v1/fetchJobs",
    payload,
    {
      requireAuth: false
    }
  );

  return normalizeResponse(response);
};
export const getJobsDetails = async (id) => {
  const response = await axiosClient.get(
    `/jobs/v1/fetchJobDetails/${id}`,
    {},
    {
      requireAuth: false
    }
  );

  return normalizeResponse(response);
};
export const deleteJob = async (payload) => {
  const response = await axiosClient.delete(`/jobs/v1/deleteJob`, {
    data: payload});

  return normalizeResponse(response);
};
export const createJob = async (payload) => {
  const response = await axiosClient.post(`/jobs/v1/createJob`, payload);

  return normalizeResponse(response);
};
export const editJob = async (payload) => {
  const response = await axiosClient.patch(`/jobs/v1/updateJob`, payload);

  return normalizeResponse(response);
};
