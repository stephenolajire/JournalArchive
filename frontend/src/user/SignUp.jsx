import { useState } from "react";
import Swal from "sweetalert2";
import styles from "../css/Signup.module.css";
import api from "../constant/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let tempErrors = {};

    if (!formData.firstname) tempErrors.firstname = "First name is required";
    if (!formData.lastname) tempErrors.lastname = "Last name is required";

    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      tempErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await api.post("register/", {
          first_name: formData.firstname,
          last_name: formData.lastname,
          email: formData.email,
          password: formData.password,
          confirm_password:formData.confirmPassword
        });

        if (response.data) {
          Swal.fire({
            title: "Registration Successful!",
            text: `Welcome, ${formData.firstname}!`,
            icon: "success",
            confirmButtonColor: "var(--primary)",
            background: "var(--light)",
            customClass: {
              popup: styles.swalPopup,
              title: styles.swalTitle,
              confirmButton: styles.swalButton,
            },
          });
          navigate("/login");
        }
      } catch (error) {
        Swal.fire({
          title: "Registration Failed",
          text:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
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
    <div className={styles.signupContainer}>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create your JournalArchive Account</h2>

        <div className={styles.formGroup}>
          <label>First Name</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className={errors.firstname ? styles.errorInput : ""}
            placeholder="Enter your first name"
          />
          {errors.firstname && (
            <p className={styles.errorMsg}>{errors.firstname}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Last Name</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className={errors.lastname ? styles.errorInput : ""}
            placeholder="Enter your last name"
          />
          {errors.lastname && (
            <p className={styles.errorMsg}>{errors.lastname}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? styles.errorInput : ""}
            placeholder="Enter your email"
          />
          {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? styles.errorInput : ""}
            placeholder="Create a password"
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
            placeholder="Confirm your password"
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
          {isSubmitting ? "Registering..." : "Sign Up"}
        </button>

        <p className={styles.loginLink}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
