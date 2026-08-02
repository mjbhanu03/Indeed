import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createApplication, getAllApplications, getApplications, updateStatus, uploadMedia } from "../../api/applications/apiApplications"

export const useApplications = (user_id) =>{
  return useQuery({
    queryKey: ["my-applications", user_id],
    queryFn: ()=>getApplications({user_id})
  })
}
export const useAllApplications = ({page}) =>{
  return useQuery({
    queryKey: ["applications", page],
    queryFn: () => getAllApplications({ page })
  })
}

export const useUploadMedia = () =>{
  return useMutation({
    mutationFn: uploadMedia
  })
}
export const useUpdateApplicationStatus = () =>{
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateStatus,
      onSuccess: ()=>{
        queryClient.invalidateQueries({ queryKey: ["applications"]})
      }
    }
  )
}

export const useCreateApplication = () =>{
  return useMutation({
    mutationFn: createApplication
  })
}