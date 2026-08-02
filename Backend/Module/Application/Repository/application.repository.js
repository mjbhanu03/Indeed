const { create } = require("framer-motion/m");
const conn = require("../../../Config/db");
const { get } = require("../Routes/application.routes");
// Fetch Jobs
const fetchApplications = async (queries = {}, user_id) => {
  let query = `SELECT
  a.id,
  a.job_id,
  j.job_title,
  j.company_name,
  a.user_id,
  a.full_name,
  a.email,
  a.mobile_number,
  a.cover_letter_file_path,
  a.resume_file_path,
  a.status,
  a.created_at
FROM tbl_application a
Left Join tbl_job j on a.job_id = j.id`;

  let counterQuery = `SELECT COUNT(*) as total
  FROM tbl_application a
  Left Join tbl_job j on a.job_id = j.id`;

  let conditions = ['a.is_delete = 0 and a.is_active = 1'];


  if(queries.query) conditions.push(`j.job_title LIKE '%${queries.query}%' or j.company_name LIKE '%${queries.query}%'`);
  if(queries.status){
    if(queries.status === 'approved') conditions.push(`a.status = 'approved'`);
    if(queries.status === 'rejected') conditions.push(`a.status = 'rejected'`);
    if(queries.status === 'applied') conditions.push(`a.status = 'applied'`);
  }
  if(user_id)conditions.push(`a.user_id = ${user_id}`);

  if (conditions.length > 0) {
    query += ` WHERE (${conditions.join(" ) AND ( ")})`
    counterQuery += ` WHERE (${conditions.join(" ) AND ( ")})`
  };
  let page = parseInt(queries?.page) || 1;
  let limit = parseInt(queries?.limit) || 10;
  console.log(page)
  const offset = (page - 1) * limit;
  query += ` LIMIT ? OFFSET ?`;
  
  const [applications] = await conn.query(query, [limit, offset]);
  const [[counter]] = await conn.query(counterQuery);
  const obj = {
    applications,
    totalCount: counter.total,
  }
  console.log("obj", obj);
  if (!applications.length) return { success: false, key: "noDataFound" };
  return { success: true, key: "dataFound", obj};
};

// Create Application
const createApplication = async (data, user_id) => {
  let object = {user_id: 29, job_id: data.job_id, full_name: data.full_name, email: data.email, mobile_number: data.mobile_number, resume_file_path: data.resume, cover_letter_file_path: data.cover_letter};

  const [application] = await conn.query(`INSERT INTO tbl_application SET ?`, [object]);

  return { success: true, key: "applicationCreated", data: application.insertId };
};

// Update Application
const updateApplication = async (data) => {
  let object = {};
  if (data.status) object.status = data.status;


  const [job] = await conn.query(`UPDATE tbl_application SET ? WHERE id = ?`, [
    object,
    data.application_id,
  ]);
if(job.affectedRows === 0) return { success: false, key: "noDataFound" };
  return { success: true, key: "applicationUpdated" };
};

module.exports = {
  fetchApplications,
  createApplication,
  updateApplication
};
