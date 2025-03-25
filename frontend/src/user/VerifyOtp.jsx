import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "../css/VerifyOtp.module.css";
import api from "../constant/api";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("reset_email");
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      Swal.fire({
        title: "Error",
        text: "Please enter all 6 digits",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const email = localStorage.getItem("reset_email");
      const response = await api.post("verify-otp/", {
        email,
        otp: otpString,
      });

      if (response.data) {
        Swal.fire({
          title: "Success!",
          text: "OTP verified successfully",
          icon: "success",
          confirmButtonColor: "var(--primary)",
        });
        navigate("/reset-password");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Invalid OTP",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendOTP = async () => {
    try {
      const email = localStorage.getItem("reset_email");
      await api.post("verify-email/", { email });
      
      setTimeLeft(600); // Reset timer
      Swal.fire({
        title: "Success!",
        text: "New OTP has been sent to your email",
        icon: "success",
        confirmButtonColor: "var(--primary)",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to resend OTP",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Verify OTP</h2>
        <p className={styles.subtitle}>
          Enter the 6-digit code sent to your email
        </p>

        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={styles.otpInput}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <p className={styles.timer}>
          Time remaining: {formatTime(timeLeft)}
        </p>

        {timeLeft === 0 && (
          <button
            type="button"
            className={styles.resendBtn}
            onClick={handleResendOTP}
          >
            Resend OTP
          </button>
        )}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting || timeLeft === 0}
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/forgot-password")}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;