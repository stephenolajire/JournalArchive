import { useContext, useState } from "react";
import { FaSearch, FaUserCircle, FaStar } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import Swal from "sweetalert2";
import styles from "../css/Navigation.module.css";
import { GlobalContext } from "../constant/GlobalContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, auth } = useContext(GlobalContext); // Add auth from context
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    Swal.fire({
      title: "Logged Out",
      text: "You have successfully logged out.",
      icon: "success",
      confirmButtonColor: "var(--primary)",
      background: "var(--light)",
      customClass: {
        popup: styles.swalPopup,
        title: styles.swalTitle,
        confirmButton: styles.swalButton,
      },
    }).then(() => {
      auth(); // This will update the authentication state
      navigate("/");
    });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            JournalArchive
          </Link>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="search"
            placeholder="Search journals..."
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
        </div>

        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        <div
          className={`${styles.navLinks} ${isMenuOpen ? styles.active : ""}`}
        >
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/browse" className={styles.navLink}>
            Browse
          </Link>
          <Link to="/submit" className={styles.navLink}>
            Submit Journal
          </Link>
          <Link to="/saved" className={styles.navLink}>
            <FaStar className={styles.userIcon} />
            Saved
          </Link>
          {isAuthenticated ? (
            <div className={styles.navLink} onClick={handleLogout}>
              <FaUserCircle className={styles.userIcon} />
              Logout
            </div>
          ) : (
            <Link to="/login" className={styles.navLink}>
              <FaUserCircle className={styles.userIcon} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
