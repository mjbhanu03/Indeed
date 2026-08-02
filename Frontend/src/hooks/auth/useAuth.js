import { useQuery } from "@tanstack/react-query";
import { signUpApi } from "../../api/auth/apiAuth";

export const useSignUp = (payload) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: signUpApi(payload)
  });
};