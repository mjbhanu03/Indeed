
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getJobs, getJobsDetails, getFilteredJobs, deleteJob, createJob, editJob } from "../../api/jobs/apiJobs";

export const useJobs = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs
  });
};

export const useFilteredJobs = () => {

  return useMutation({
    mutationFn: getFilteredJobs,
  });
};
export const useJobsDetails = (id) => {
  return useQuery({
    queryKey: ["jobs-details", id],
    queryFn: ()=>getJobsDetails(id)
  });
};
export const useDeleteJobs = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ["jobs"]})
    }
  });
};
export const useCreateJob = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createJob,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ["jobs"]})
    }
  });
};
export const useEditJob = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: editJob,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey: ["jobs"]})
    }
  });
};