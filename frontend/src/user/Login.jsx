import { useContext, useState } from "react";
import Swal from "sweetalert2";
import styles from "../css/Login.module.css";
import { useNavigate } from "react-router-dom";
import api from "../constant/api";
import {GlobalContext} from '../constant/GlobalContext'

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {auth} = useContext(GlobalContext)


  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let tempErrors = {};
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

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await api.post("token/", {
          email: formData.email,
          password: formData.password,
        });

        const { access, refresh } = response.data;

        if (access && refresh) {
          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);
          Swal.fire({
            title: "Login Successful!",
            text: "Welcome!",
            icon: "success",
            confirmButtonColor: "var(--primary)",
            background: "var(--light)",
            customClass: {
              popup: styles.swalPopup,
              title: styles.swalTitle,
              confirmButton: styles.swalButton,
            },
          });
          auth();
          navigate("/");
        }
      } catch (error) {
        Swal.fire({
          title: "Login Failed",
          text:
            error.response?.data?.detail ||
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
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login to JournalArchive</h2>

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
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className={styles.errorMsg}>{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className={styles.registerLink}>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
