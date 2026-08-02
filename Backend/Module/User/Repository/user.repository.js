const conn = require("../../../Config/db");
const { param } = require("../Routes/user.routes");

// Fetch user details by ID
const getUserById = async (user_id) => {
  const query = `select u.user_id, up.full_name, u.email, up.mobile_number, up.job_role from tbl_user u
  left join tbl_user_profile up on up.user_id = u.user_id
  where u.user_id = ? and u.is_active = 1 and u.is_delete = 0`;
  const params = [user_id];

  const [[user]] = await conn.query(query, params);

  return user || null;
};

// Update profile
const updateProfile = async (data) => {
  const { user_id, fullName, mobile_number, job_role, email } = data;
  const userObject = {};
  const userProfileObject = {};

  fullName && (userProfileObject.full_name = fullName);
  mobile_number && (userProfileObject.mobile_number = mobile_number);
  job_role && (userProfileObject.job_role = job_role);
  email && (userObject.email = email);

  if (
    !Object.keys(userObject).length ||
    !Object.keys(userProfileObject).length
  ) {
    return { success: false, key: "invalidProfileData" };
  }

  let userResult;
  if (Object.keys(userObject).length > 0) {
    [userResult] = await conn.query(
      `UPDATE tbl_user SET ? WHERE user_id = ? AND is_active = 1 AND is_delete = 0`,
      [userObject, user_id],
    );
  }

  let userProfileResult;
  if (Object.keys(userProfileObject).length > 0) {
    [userProfileResult] = await conn.query(
      `UPDATE tbl_user_profile SET ? WHERE user_id = ? AND is_active = 1 AND is_delete = 0`,
      [userProfileObject, user_id],
    );
  }

  if (!userResult && !userProfileResult) {
    return false;
  } else {
    return true;
  }
};

const getTotalAppliedJobs = async (user_id)=>{
  const [totalAppliedJobs] = await conn.query(`select count(*) as total from tbl_application where user_id = ?`, [user_id]);
  return totalAppliedJobs[0].total
}
const getTotalPendingApplications = async (user_id)=>{
  const [totalPendingApplications] = await conn.query(`select count(*) as total from tbl_application where user_id = ? and status = 'applied'`, [user_id]);
  return totalPendingApplications[0].total
}
const getTotalRejectedApplications = async (user_id)=>{
  const [totalRejectedApplications] = await conn.query(`select count(*) as total from tbl_application where user_id = ? and status = 'rejected'`, [user_id]);
  return totalRejectedApplications[0].total
}
const getTotalApprovedApplications = async (user_id)=>{
  const [totalApprovedApplications] = await conn.query(`select count(*) as total from tbl_application where user_id = ? and status = 'approved'`, [user_id]);
  return totalApprovedApplications[0].total
}
module.exports = {
  getUserById,
  updateProfile,
  getTotalAppliedJobs,
  getTotalPendingApplications,
  getTotalRejectedApplications,
  getTotalApprovedApplications
  
};
