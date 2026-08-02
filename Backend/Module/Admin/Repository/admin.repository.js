const { create } = require("framer-motion/m");
const conn = require("../../../Config/db");
const { get } = require("../Routes/admin.routes");
// Fetch Jobs
const fetchUsers = async (queries={}, user_id) => {
  let query = `SELECT
  u.user_id,
  u.email,
  up.full_name,
  up.mobile_number,
  up.job_role,
  u.is_active
  from tbl_user u
  LEFT JOIN tbl_user_profile up on up.user_id = u.user_id
  `;
  let conditions = ['u.is_delete = 0 and is_admin=0'];
  if(user_id) conditions.push(`u.user_id = ${user_id}`);
  if(queries.status) conditions.push(`u.is_active = ${queries.status === 'active' ? 1 : 0}`);
  if(queries.query) conditions.push(`up.full_name LIKE '%${queries.query}%'`);

  if(conditions.length > 0) query += ` WHERE (${conditions.join(" ) AND ( ")})`;

  let page = parseInt(queries?.page) || 1;
  let limit = parseInt(queries?.limit) || 10;
  const offset = (page - 1) * limit;
  if(!user_id) query += ` LIMIT ${limit} OFFSET ${offset}`;
  const [data] = await conn.query(query);
  console.log(data)
  if (!data.length) return { success: false, key: "noDataFound" };
  return { success: true, key: "dataFound", data };
};

// Update Application
const updateUserActiveStatus = async (data) => {

  const [job] = await conn.query(`UPDATE tbl_user SET is_active=? WHERE user_id = ?`, [
    data.is_active,
    data.user_id,
  ]);
if(job.affectedRows === 0) return { success: false, key: "noDataFound" };
  return { success: true, key: "applicationUpdated" };
};

// Total Jobs
const totalJobs = async () => {
  const [job] = await conn.query(`SELECT count(*) as total FROM tbl_job WHERE is_delete = 0`);
  return job[0].total;
}
// Active Jobs
const totalActiveJobs = async () => {
  const [job] = await conn.query(`SELECT count(*) as total FROM tbl_job WHERE is_delete = 0 and is_active = 1`);
  return job[0].total;
}
// Closed Jobs
const totalClosedJobs = async () => {
  const [job] = await conn.query(`SELECT count(*) as total FROM tbl_job WHERE is_delete = 0 and is_active = 0`);
  return job[0].total;
}
// Total Applications
const totalApplications = async () => {
  const [job] = await conn.query(`SELECT count(*) as total FROM tbl_application WHERE is_delete = 0`);
  return job[0].total;
}
// Total Users
const totalUsers = async () => {
  const [job] = await conn.query(`SELECT count(*) as total FROM tbl_user WHERE is_delete = 0 and is_admin = 0`);
  return job[0].total;
}

const fetchSkills = async () => {
  const [skills] = await conn.query(`SELECT id, skill_name FROM tbl_skill WHERE is_delete = 0`);
  if(skills.length === 0) return { success: false, key: "noDataFound" };
  return { success: true, key: "dataFound", data: skills };
}

module.exports = {
  fetchUsers,
  updateUserActiveStatus,
  totalJobs,
  totalActiveJobs,
  totalClosedJobs,
  totalApplications,
  totalUsers,
  fetchSkills
};
