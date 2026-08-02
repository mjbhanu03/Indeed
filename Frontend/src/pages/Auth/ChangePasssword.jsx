import { useState } from "react";

const ChangePasssword = () => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container py-5">
      <div
        className="card shadow-sm border-0 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="card-body p-4">
          <h3 className="mb-4 text-center">
            🔒 Change Password
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                className="form-control"
                placeholder="Enter current password"
                value={formData.current_password}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                className="form-control"
                placeholder="Enter new password"
                value={formData.new_password}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm_password"
                className="form-control"
                placeholder="Confirm new password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasssword;