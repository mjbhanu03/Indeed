import {axiosClient} from "../axiosClient"
import { normalizeResponse } from "../responseHandler"
export const signUpApi = async (payload) =>{
  const response = await axiosClient.post(
    "/auth/v1/signUp", payload
    ,{
      requireAuth: false
    }
  )

  return normalizeResponse(response)
}
export const loginApi = async (payload) =>{
  const response = await axiosClient.post(
    "/auth/v1/signIn", payload
    ,{
      requireAuth: false
    }
  )

  return normalizeResponse(response)
}
export const changePassword = async (payload) =>{
  const response = await axiosClient.patch(
    "/auth/v1/signIn", payload
    ,{
      requireAuth: false
    }
  )

  return normalizeResponse(response)
}

