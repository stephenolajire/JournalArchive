import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../css/ResetPassword.module.css";
import api from "../constant/api";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("reset_email");
    if (!email) {
      navigate("/forgot-password");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const email = localStorage.getItem("reset_email");
        const response = await api.post("reset-password/", {
          email,
          password: formData.password,
        });

        if (response.data) {
          Swal.fire({
            title: "Success!",
            text: "Your password has been reset successfully",
            icon: "success",
            confirmButtonColor: "var(--primary)",
          }).then(() => {
            localStorage.removeItem("reset_email");
            navigate("/login");
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to reset password",
          icon: "error",
          confirmButtonColor: "var(--primary)",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.subtitle}>Please enter your new password</p>

        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles.errorInput : ""}
            placeholder="Enter new password"
          />
          {errors.password && (
            <p className={styles.errorMsg}>{errors.password}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? styles.errorInput : ""}
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <p className={styles.errorMsg}>{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>

        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;