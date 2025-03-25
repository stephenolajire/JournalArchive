import { useState } from "react";
import Swal from "sweetalert2";
import styles from "../css/ForgotPassword.module.css";
import { useNavigate } from "react-router-dom";
import api from "../constant/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is invalid";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await api.post("verify-email/", {
          email: email,
        });

        if (response.data) {
          Swal.fire({
            title: "Success!",
            text: "Please check your email for the OTP code",
            icon: "success",
            confirmButtonColor: "var(--primary)",
            background: "var(--light)",
            customClass: {
              popup: styles.swalPopup,
              title: styles.swalTitle,
              confirmButton: styles.swalButton,
            },
          });
          // Store email in localStorage for the next step
          localStorage.setItem("reset_email", email);
          // Navigate to OTP verification page
          navigate("/verify-otp");
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Email verification failed",
          icon: "error",
          confirmButtonColor: "var(--primary)",
          background: "var(--light)",
          customClass: {
            popup: styles.swalPopup,
            title: styles.swalTitle,
            confirmButton: styles.swalButton,
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.subtitle}>
          Enter your email address to receive a verification code
        </p>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? styles.errorInput : ""}
            placeholder="Enter your email"
          />
          {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Verification Code"}
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

export default ForgotPassword;