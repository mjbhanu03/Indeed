const conn = require("../../../Config/db");
const { get } = require("../Routes/auth.routes");

// Check Email
const checkEmail = async (email) => {
  const [[query]] = await conn.query(
    `select * from tbl_user where email = ? AND is_active = 1 and is_deleted = 0`,
    [email],
  );

  return query;
};


// Get User
const getUser = async (field) => {
  const [[query]] = await conn.query(
    `select * from tbl_user where (user_id=?  or email = ? ) and (is_delete = 0 and is_active = 1) limit 1`,
    [field, field],
  );

  return query;
};
// Get User Profile
const getUserProfile = async (field) => {
  const [[query]] = await conn.query(
    `select * from tbl_user_profile where user_id=? and is_delete = 0 and is_active = 1 limit 1`,
    [field],
  );

  return query;
};


// Signup Repository
const signUp = async (email,  password) => {
  try {
    const insertObject = {
  email,
  password,
}

    const [query] = await conn.query(
      `Insert into tbl_user SET ?`,
      insertObject,
    );

    return {
      success: true,
      key: "userCreated",
      user: query.insertId
    };
  } catch (error) {
    console.error(error);
    return { success: false, key: "somethingWentWrong", error: error.message };
  }
};

// Set Profile
const setProfile = async (user_id, full_name, mobile_number, job_role) => {
  try {
    const object = {
      user_id,
      full_name,
      mobile_number,
      job_role
    }
    const [query] = await conn.query(`insert into tbl_user_profile set ?`, [
      object
    ]);
    return { success: true, key: "profileCreated" };
  } catch (error) {
    console.error(error);
    return { success: false, key: "somethingWentWrong", error: error.message };
  }
};


// Add Address
const addAddress = async (data) => {
  try {
    console.log(data);
    const [query] = await conn.query(`insert into tbl_address set ?`, [data]);

    if (query.affectedRows > 0) return { success: true, key: "addressAdded" };
    return { success: false, key: "failedToAddAddress" };
  } catch (error) {
    console.error(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Check city, state, country is exist or not
const checkCityStateCountry = async (city_id) => {
  try {
    const [[query]] = await conn.query(
      `select c.city_id, s.state_id, co.country_id from tbl_city c join tbl_state s on c.state_id = s.state_id join tbl_country co on s.country_id = co.country_id where c.city_id = ? and c.is_deleted = 0 and s.is_deleted = 0 and co.is_deleted = 0`,
      [city_id],
    );
    return query;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Update Address Step  
const updateToken = async (user_id, token) => {
  try {
    const [query] = await conn.query(
      `update tbl_user set token=? where user_id=?`,
      [token, user_id],
    );
    if (query.affectedRows > 0)
      return { success: true, key: "tokenUpdated" };
    return { success: false, key: "failedToUpdateToken" };
  } catch (error) {
    console.error(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Logout
const logout = async (token, user_id) => {
    const [query] = await conn.query(
      `update tbl_user set token=null where user_id=? and token=? and is_active=1`,
      [user_id, token],
    );
    
    return query.affectedRows 
};

// Check Token
const checkToken = async (token) => {
  try {
    const [[isTokenLoggedOut]] = await conn.query(
      `select 1 from tbl_user where token = ? and is_active = 1 and is_delete = 0`,
      [token],
    );
    return isTokenLoggedOut;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Update Password
const changePassword = async (user_id, new_password) => {
  try {
    const [query] = await conn.query(
      `update tbl_user set password = ? where user_id = ?`,
      [new_password, user_id],
    );
    if (query.affectedRows > 0)
      return { success: true, key: "passwordChanged" };
    return { success: false, key: "failedToupdate" };
  } catch (error) {
    console.error(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

module.exports = {
  checkEmail,
  getUserProfile,
  signUp,
  setProfile,
  getUser,
  addAddress,
  checkCityStateCountry,
  updateToken,
  logout,
  checkToken,
  changePassword,
};
