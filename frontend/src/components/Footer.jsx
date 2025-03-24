import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import styles from '../css/Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>About JournalArchive</h3>
          <p className={styles.footerText}>
            Your trusted platform for academic journal articles. Supporting research and knowledge sharing in the academic community.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Quick Links</h3>
          <ul className={styles.footerLinks}>
            <li><a href="/about">About Us</a></li>
            <li><a href="/browse">Browse Journals</a></li>
            <li><a href="/submit">Submit Paper</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Contact Info</h3>
          <ul className={styles.contactInfo}>
            <li>
              <FaPhone /> <span>+234 123 456 7890</span>
            </li>
            <li>
              <FaEnvelope /> <span>info@journalarchive.com</span>
            </li>
            <li>
              <FaMapMarkerAlt /> <span>Lagos, Nigeria</span>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Newsletter</h3>
          <form className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.newsletterInput}
            />
            <button type="submit" className={styles.newsletterButton}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.socialLinks}>
          <a href="#"><FaGithub /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaLinkedin /></a>
        </div>
        <p className={styles.copyright}>
          © {currentYear} JournalArchive. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;