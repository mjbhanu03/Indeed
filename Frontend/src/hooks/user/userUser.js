
import { useQuery } from "@tanstack/react-query";
import { getDashboard, getUserProfile } from "../../api/user/apiUser";

export const useUser = () => {
  return useQuery({
    queryKey: ["user-dashboard"],
    queryFn: getDashboard
  });
};
export const useUserProfile = (id) => {
  return useQuery({
    queryKey: ["user-profile", id],
    queryFn: ()=>getUserProfile(id)
  });
};