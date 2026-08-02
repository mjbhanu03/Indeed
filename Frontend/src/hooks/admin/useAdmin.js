import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getDashboard, getFilteredUsers, getSkills, getUserDetails, getUsers, updateUserActiveStatus } from "../../api/admin/apiAdmin"

export const useDashboard = () =>{
  return useQuery({
    queryKey: ["indeed-admin"],
    queryFn: getDashboard
  })
}
export const useFilteredUser = (payload) =>{
  return useQuery({
    queryKey: ["users-list"],
    queryFn: ()=> getFilteredUsers(payload)
  })
}
export const useUser = () =>{
  return useQuery({
    queryKey: ["users-list"],
    queryFn: getUsers
  })
}
export const useSkills = () =>{
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills
  })
}

export const useUserDetails = (id) => {
  return useQuery({
    queryKey: ["user-details", id],
    queryFn: ()=>getUserDetails(id)
  });
};

export const useUpdateActiveStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUserActiveStatus,
    

    onSuccess: (_data, variables)=>{
      queryClient.invalidateQueries({ queryKey: ["user-details", variables.user_id] })
      queryClient.invalidateQueries({ queryKey: ["users-list"] })
    }
  });
};