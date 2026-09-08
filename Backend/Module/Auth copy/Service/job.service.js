const common = require("../../../Common/common");
const repository = require("../Repository/job.repository");
const middleware = require("../../../Common/Middleware/middleware");
const constant = require("../../../Constant/constant");
const bcrypt = require("bcryptjs");
const { checkToken } = require("../../Auth/Repository/auth.repository");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const callAI = require("../../../Gen Ai/chatForJob");
env.config()

// Fetch Jobs
const fetchJobs = async (queries, user_id=null) => {
  try {
    const result = await repository.fetchJobs(queries, user_id);
    if (!result.success ) return { success: false, key: result.key };
    

    return { success: true, key: "dataFound", data: result.data  };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Fetch job details
const fetchJobDetails = async (id, req) => {
  try {
    let result;
    if(req.headers.token){
      const token = req.headers.token;
    const isTokenLoggedOut = await checkToken(token);
    if (!token)
      return res
    .status(401)
        .send({ code: responseCode.ERROR, message: "tokenMissing", data: {} });

    const decoded = jwt.verify(token, process.env.JWT_WEB_TOKEN);

    if (!decoded)
      return res
        .status(401)
        .send({ code: responseCode.ERROR, message: "tokenExpired", data: {} });
    if (!isTokenLoggedOut)
      return res
        .status(401)
        .send({ code: responseCode.ERROR, message: "invalidToken", data: {} });
      if(!isTokenLoggedOut) return { success: false, key: "invalidToken" };
      req.user = decoded
    }
    if(req.user?.role === "user") result = await repository.fetchJobDetails(id, req.user.user_id);
    else result = await repository.fetchJobDetails(id);
    if (!result.success ) return { success: false, key: result.key };
    return { success: true, key: "dataFound", data: result.data  };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
}

// Create Job
const createJob = async (queries) => {
  try {
    console.log(queries)
    const result = await repository.createJob(queries);
    if (!result.success ) return { success: false, key: result.key };
    return { success: true, key: "jobCreated", data: result.data  };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Update Job
const updateJob = async (req) => {
  try {
    const result = await repository.updateJob(req);
    if (!result.success ) return { success: false, key: result.key };
    return { success: true, key: "jobUpdated", data: result.data  };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
}

// Delete Job
const deleteJob = async (req) => {
  try {
    const result = await repository.deleteJob(req);
    if (!result.success ) return { success: false, key: result.key };
    return { success: true, key: "jobDeleted", data: result.data  };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
}

// Chat with AI
const chatWithAI = async (data) =>{
  try {
    let interactionId = null, conversation_id = null

    const conversation = await repository.checkConversation(data.job_id)
    if(!conversation.conversation_id){
      const createConversatoin = await repository.createConversatoin(data.job_id, data.user_id, `Conversation for ${job_id}`)
      conversation_id = createConversatoin 
    }else{
      console.log("conversation_id", conversation.conversation_id)
      conversation_id = conversation.conversation_id
    }
      interactionId = await repository.checkLastMessageForInteractnionID(conversation_id)
      console.log(interactionId)
    const response = await callAI(interactionId, data.question)
    const createUserMessage = await repository.createMessage("user", data.question, null, conversation_id)
    const createAdminMessage = await repository.createMessage("admin", response.message, response.id, conversation_id)
    return response 
  } catch (error) {
    console.log(error)
    return  
  }
}

// Fetch Chats
const fetchChats = async (data) =>{
  try {
    const chats = await repository.fetchChats(data.user_id, data.job_id)
    if(!chats) return {success: true, message: "chatsNotFound"}
    else return {success: true, message: "chatsFound", data: chats}
  } catch (error) {
    console.log(error)
    return  
  }
}


module.exports = {
  fetchJobs,
  fetchJobDetails,
  createJob,
  updateJob,
  deleteJob,
  chatWithAI,
  fetchChats,
};
