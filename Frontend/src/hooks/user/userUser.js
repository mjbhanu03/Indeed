import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getDashboard, getUserProfile } from "../../api/user/apiUser";

export const useUser = () => {
  return useQuery({
    queryKey: ["user-dashboard"],
    queryFn: getDashboard,
  });
};
export const useUserProfile = (id) => {
  const authenticatedUserId = useSelector((state) => state.auth.user?.user_id);
  const userId = id ?? authenticatedUserId;
  console.log("user id will pass by here",userId)
  console.log("user id will pass by here",authenticatedUserId)
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile({user: userId}),
    enabled: Boolean(userId),
  });
};
