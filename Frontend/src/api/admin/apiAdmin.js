import {axiosClient} from "../axiosClient"
import {normalizeResponse} from "../responseHandler"

export const getDashboard = async () =>{
  const response = await axiosClient.get("/admin/v1/dashboard")

  return normalizeResponse(response)
}

export const getFilteredUsers = async (payload) =>{
  const response = await axiosClient.post("admin/v1/fetchUsers", payload)

  return normalizeResponse(response)
}


export const getUsers = async () =>{
  const response = await axiosClient.post("admin/v1/fetchUsers")

  return normalizeResponse(response)
}
export const getSkills = async () =>{
  const response = await axiosClient.get("admin/v1/skills")

  return normalizeResponse(response)
}

export const getUserDetails = async (id) => {
  const response = await axiosClient.get(
    `/admin/v1/fetchUsers/${id}`
  );

  return normalizeResponse(response);
};
export const updateUserActiveStatus = async (payload) => {
  const response = await axiosClient.patch(`admin/v1/updateUserActiveStatus`, payload);

  return normalizeResponse(response);
};