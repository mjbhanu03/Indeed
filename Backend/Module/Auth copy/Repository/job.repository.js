const { create } = require("framer-motion/m");
const conn = require("../../../Config/db");
const { get } = require("../Routes/job.routes");
// Fetch Jobs
const fetchJobs = async (queries={}, user_id=null) =>{
  console.log("user", user_id)
  let query = `SELECT
  j.id,
  j.job_title,
  j.company_name,
  j.job_desc,
  j.location,
  j.salary,
  j.experience,
  j.job_type,
  j.is_active,
  j.created_at
  ${user_id ? `, exists(select 1 from tbl_application a where a.job_id=j.id and a.user_id=${user_id}) as is_applied`: ""}
FROM tbl_job j`;
let countQuery = `SELECT COUNT(*) as total FROM tbl_job j`;

let conditions = ['j.is_delete=0'];
queries.searchQuery && conditions.push(`j.job_title LIKE '%${queries.searchQuery}%' or j.company_name LIKE '%${queries.query}%'`);
queries.status && queries.status !== "all" && conditions.push(`j.is_active = ${queries.status === 'active' ? 1 : 0}`);
queries.job_type && queries.status !== "all" && conditions.push(`j.job_type = '${queries.job_type}'`);
  queries.location && conditions.push(`j.location = '${queries.location}'`);
  queries.min_salary && conditions.push(`j.salary >= ${queries.min_salary}`);
  queries.max_salary && conditions.push(`j.salary <= ${queries.max_salary}`);

  if (conditions.length > 0) {
    query += ` WHERE (${conditions.join(" ) AND ( ")})`;
    countQuery += ` WHERE (${conditions.join(" ) AND ( ")})`;
  }
        if (queries.sortBy) {
            if (queries.sortBy === 'salary_asc') {
                query += `, salary ASC`
            } else if (queries.sortBy === 'salary_desc') {
                query += `, salary DESC`
            } else {
                return { success: false, key: "invalidSortBy" };
            }
        }
 
        page =  queries?.page || 1
        limit =  queries?.limit || 10
        const offset = (page - 1) * limit
       
        query += ` LIMIT ? OFFSET ?`
 
        // console.log(queryParams)
  const [data] = await conn.query(query, [limit, offset]);
  const [[{total}]] = await conn.query(countQuery);
  const obj = {
    jobs: data,
    totalCount: total,
  }
  if(!data) return { success: false, key: "noDataFound" };
  return { success: true, key: "dataFound", data: obj };
}

// Fetch job details
const fetchJobDetails = async (job_id, user_id) => {
  const query = user_id ? 
    `SELECT
    j.id,
    j.job_title,
    j.company_name,
    j.job_desc,
    j.location,
    j.salary,
    j.experience,
    j.job_type,
    j.is_active,
    (select GROUP_CONCAT(s.skill_name) from tbl_skill s left join tbl_job_skill js on s.id = js.skill_id where js.job_id=j.id) as skills,
    exists(select 1 from tbl_application ap where ap.job_id = j.id and ap.user_id = ?) as is_applied,
    j.created_at
    from tbl_job j
    where j.id = ? and j.is_delete = 0` : 

    `SELECT 
    j.id,
    j.job_title,
    j.company_name,
    j.job_desc,
    j.location,
    j.salary,
    j.experience,
    j.job_type,
    j.is_active,
    j.created_at,
    (select GROUP_CONCAT(s.skill_name) from tbl_skill s left join tbl_job_skill js on s.id = js.skill_id where js.job_id=j.id) as skills
    from tbl_job j
    where j.id = ? and  j.is_delete = 0`;
    const params = user_id ? [user_id, job_id] : [job_id];
  const [data] = await conn.query(query, params);
  if(!data.length) return { success: false, key: "noDataFound" };
  return { success: true, key: "dataFound", data };
}

// Create Job
const createJob = async (data) => {
  let skills = data.skills;
  let object = {};
  object.job_title = data.job_title;
  object.company_name = data.company_name;
  object.job_desc = data.description;
  object.location = data.location;
  object.salary = data.salary;
  object.experience = data.experience;
  object.job_type = data.job_type;

  let checkIsAllSkillsActive;
  if(data.skills){
    for(const skill of data.skills){
      const [[isActive]] = await conn.query(`select 1 from tbl_skill where id = ? and is_active = 1`, [skill]);
      if(!isActive) checkIsAllSkillsActive =  { success: false, key: "invalidSkills" };
    }
    // object.skills.map(async (skill) => {
    //   const isActive = await conn.query(`select 1 from tbl_skill where id = ? and is_active = 1`, [skill]);
    //   if(!isActive) checkIsAllSkillsActive =  { success: false, key: "invalidSkill" };
    // });
  }
  if(checkIsAllSkillsActive?.success === false) return checkIsAllSkillsActive;

  const [job] = await conn.query(`INSERT INTO tbl_job SET ?`, [object]);
  const jobId = job.insertId;
  let skillsObj = skills.map((skill) => [skill, jobId]);

  const [skill] = await conn.query(`INSERT INTO tbl_job_skill (skill_id, job_id)  values ?`, [skillsObj]);
  return { success: true, key: "jobCreated", data: jobId };
}

// Update Job
const updateJob = async (data) => {
  let object = {};
  if(data.job_title) object.job_title = data.job_title;
  if(data.company_name) object.company_name = data.company_name;
  if(data.description) object.job_desc = data.description;
  if(data.location) object.location = data.location;
  if(data.salary) object.salary = data.salary;
  if(data.experience) object.experience = data.experience;
  if(data.job_type) object.job_type = data.job_type;

  const [job] = await conn.query(`UPDATE tbl_job SET ? WHERE id = ?`, [object, data.job_id]);
  data.skills && await conn.query(`DELETE FROM tbl_job_skill WHERE job_id = ?`, [data.job_id]);

  let skills = data.skills;
  let skillsObj = skills.map((skill) => [skill, data.job_id]);
  const [skill] = await conn.query(`INSERT INTO tbl_job_skill (skill_id, job_id)  values ?`, [skillsObj]);

  return { success: true, key: "jobUpdated" };
  
}

const deleteJob = async (job_id) => {
  const [job] = await conn.query(`UPDATE tbl_job SET is_delete = 1 WHERE id = ?`, [job_id]);
  if(job.affectedRows === 0) return { success: false, key: "noDataFound" };
  return { success: true, key: "jobDeleted" };
}
module.exports = {
  fetchJobs,
  fetchJobDetails,
  createJob,
  updateJob,
  deleteJob
};

