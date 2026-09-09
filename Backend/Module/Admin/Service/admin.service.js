const common = require("../../../Common/common");
const repository = require("../Repository/admin.repository");
const middleware = require("../../../Common/Middleware/middleware");
const constant = require("../../../Constant/constant");
const bcrypt = require("bcrypt");
const { checkToken } = require("../../Auth/Repository/auth.repository");
const jwt = require("jsonwebtoken");
// Fetch Users
const fetchUsers = async (req) => {
  try {
      let result = req.params.id ? await repository.fetchUsers(req.body, req.params.id) : await repository.fetchUsers(req.body);
    if (!result.success ) return { success: false, key: result.key };
    

    return { success: true, key: "dataFound", data: result.data  };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Update User Active Status
const updateUserActiveStatus = async (req) => {
  try {
    const result = await repository.updateUserActiveStatus(req);
    if (!result.success ) return { success: false, key: result.key };
    return { success: true, key: "userStatusUpdated", data: result.data  };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
}

// dashboard
const dashboard = async () =>{
  const totalJobs = await repository.totalJobs();
  const totalActiveJobs = await repository.totalActiveJobs();
  const totalClosedJobs = await repository.totalClosedJobs();
  const totalApplications = await repository.totalApplications();
  const totalUsers = await repository.totalUsers();

  return { success: true, key: "dataFound", data: { totalJobs, totalActiveJobs, totalClosedJobs, totalApplications, totalUsers } };
}

const fetchSkills = async () => {
  try {
    const result = await repository.fetchSkills();
    if (!result.success ) return { success: false, key: result.key };
    return { success: true, key: "dataFound", data: result.data  };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
}
module.exports = {
  fetchUsers,
  dashboard,
  updateUserActiveStatus,
  fetchSkills
};
