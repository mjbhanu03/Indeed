const common = require("../../../Common/common");
const repository = require("../Repository/auth.repository");
const bcrypt = require("bcrypt");
const {responseCode: constant} = require("../../../Constant/constant")

// Sign Up
const signUp = async (data) => {
  try {
    let user;
    if (data.email) {
      user = await repository.getUser(data.email);
    }
    console.log(user)
    if (user)
      return {
        success: false,
        code: constant.VALIDATION_ERROR,
        key: "emailIsAlreadyUsed",
      };

    const {
      full_name,
      email,
      job_role,
      mobile_number,
      password
        } = data;

    let encPassword = await bcrypt.hash(password, 10);
    // Sign Up
    const signUpResult = await repository.signUp(email, encPassword);
    if (signUpResult.success) {
      const userProfile = await repository.setProfile(
        signUpResult.user,
        full_name,
        mobile_number,
        job_role,
      );
      if (!userProfile.success)
        return { success: false, key: "userCreationFailed", errors: userProfile.error };

      const userProfileData = await repository.getUserProfile(
        signUpResult.user,
      );

      const tokenData = {
        user_id: signUpResult.user.user_id,
        role: "user",
      };

      // Generate Token
      const token = common.generateToken(tokenData);
      const updateToken = await repository.updateToken(
        signUpResult.user,
        token.token,
      );
      const userData = await repository.getUser(signUpResult.user);

      user = {
        user_id: userData.user_id,
        email: userData.email,
        full_name: userProfileData.full_name,
        mobile_number: userProfileData.mobile_number,
        token: userData.token,
        role: "user"
      };
      return { success: true, key: "userCreated", user: user };
    } else {
      return { success: false, key: "userCreationFailed", errors: signUpResult.error };
    }
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong", errors: error.message };
  }
};

// Sign In
const signIn = async (data) => {
  try {
    let user;
    if (data.email) {
      user = await repository.getUser(data.email);
    }

    if (!user)
      return {
        success: false,
        code: constant.VALIDATION_ERROR,
        key: "invalidEmail",
      };

    // // is passowrd or social id is correct
    const result = await bcrypt.compare(data.password, user.password);

    // console.log('ades', result)
    if (!result)
      return {
        success: false,
        code: constant.VALIDATION_ERROR,
        key: "invalidPassword",
      };

    // Generate Token
    const tokenData = {
      user_id: user.user_id,
      email: user.email,
      role: user.is_admin === 0 ? "user" : "admin",
    };
    const token = common.generateToken(tokenData);

    // Save Device Details and Token
    const updateDeviceTokenResult = await repository.updateToken(
      user.user_id,
      token.token,
    );
    
    const userProfile = user.is_admin !== 1 ? await repository.getUserProfile(user.user_id) : null

    user = 
    user.is_admin !== 1 ? {
      ...tokenData,
      full_name: userProfile?.full_name || "",
      mobile_number: userProfile?.mobile_number || "",
      job_role: userProfile?.job_role || "",
      token: token.token
    } : {
      ...tokenData,
      token: token.token
    }

    return {
      success: true,
      code: 1,
      key: "signInSuccess",
      user,
    };
  } catch (error) {
    console.log(error);
    return { success: false, code: constant.ERROR, key: "somethingWentWrong" };
  }
};

// Logout
const logout = async (token, user_id) => {
  try {
    let user = await repository.getUser(user_id);
    if (!user) return { success: false, key: "userNotFound" };

    const result = await repository.logout(token, user_id);
    console.log(result);
    if (!result) return { success: false, key: "logoutFailed" };
    return { success: true, key: "logoutSuccess" };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

// Change Password
const changePassword = async (data, loggedInUser) => {
  try {
    const { current_password, new_password, confirm_password } = data;
    console.log("sa", loggedInUser.user_id);
    let user = await repository.getUser(loggedInUser.user_id);
    if (!user) return { success: false, key: "userNotFound" };
    console.log(current_password, user.password);
    const is_passwordMatched = await bcrypt.compare(
      current_password,
      user.password,
    );

    if (!is_passwordMatched)
      return { success: false, key: "invalidCurrentPassword" };
    const newPasswordHashed = await bcrypt.hash(new_password, 10);
    const result = await repository.changePassword(
      user.user_id,
      newPasswordHashed,
    );
    if (!result.success) return { success: false, key: "passwordChangeFailed" };
    return { success: true, key: "passwordChangeSuccess" };
  } catch (error) {
    console.log(error);
    return { success: false, key: "somethingWentWrong" };
  }
};

module.exports = {
  signUp,
  signIn,
  logout,
  changePassword,
};
