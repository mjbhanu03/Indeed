const repository = require("../Repository/user.repository");
const common = require("../../../Common/common");
const callAI = require("../../../Gen Ai/genai");

// Fetch Dashboard
const fetchDashboard = async (user_id) => {
  try {
    const totalAppliedJobs = await repository.getTotalAppliedJobs(user_id);
    const totalPendingApplications = await repository.getTotalPendingApplications(user_id )
    const totalRejectedApplications = await repository.getTotalRejectedApplications(user_id)
    const totalApprovedApplications = await repository.getTotalApprovedApplications(user_id)


    return { success: true, key: "userDashboardFetched", data: { totalAppliedJobs, totalPendingApplications, totalRejectedApplications, totalApprovedApplications } };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Fetch User Profile 
const fetchProfile = async (user_id)=>{
  try {
    const user = await repository.getUserById(user_id);
    console.log("user", user)
    if (!user) return { success: false, key: "noUserFound" };

    return { success: true, key: "userProfileFetched", data: user };
  
} catch (error) {
     console.log(error);
    return { success: false, key: "somethingWentWrong" }; 
}
}

// Update profile
const updateProfile = async (data) => {
  try {
    const profile = await repository.updateProfile(data);
    if (!profile) return { success: false, key: "profileUpdateFailed" };

    const Updateduser = await repository.getUserById(data.user_id);

    return { success: true, key: "profileUpdated", user: Updateduser };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Chat with AI
const chatWithAI = async (data) =>{
  try {
    const response = await callAI(data.id, data.question)
    return response 
  } catch (error) {
    console.log(error)
    return  
  }
}
module.exports = {
  fetchProfile,
  updateProfile,
  fetchDashboard,
  chatWithAI
};
