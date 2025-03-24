import { useEffect } from "react";
import {ReactTyped} from "react-typed";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaSearch,
  FaBookReader,
  FaCloudUploadAlt,
  FaChartLine,
  FaUsers,
  FaGraduationCap,
  FaAward,
  FaGlobe,
  FaBookOpen,
} from "react-icons/fa";
import styles from "../css/LandingPage.module.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 data-aos="fade-up">
            Your Gateway to 
            <ReactTyped
              strings={[
                " Academic Excellence",
                " Research Innovation",
                " Knowledge Discovery",
              ]}
              typeSpeed={40}
              backSpeed={50}
              loop
              className={styles.typedText}
            />
          </h1>
          <p data-aos="fade-up" data-aos-delay="200">
            Access thousands of peer-reviewed journals and research papers to
            enhance your academic journey
          </p>
          <div
            className={styles.heroButtons}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Link to="/register" className={styles.primaryBtn}>Get Started</Link>
            <Link to="/browse" className={styles.secondaryBtn}>Browse Journals</Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2 data-aos="fade-up">Why Choose JournalArchive?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard} data-aos="fade-up">
            <FaSearch className={styles.featureIcon} />
            <h3>Smart Search</h3>
            <p>
              Advanced AI-powered search algorithm to find the most relevant
              research papers
            </p>
          </div>
          <div
            className={styles.featureCard}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <FaBookReader className={styles.featureIcon} />
            <h3>Vast Collection</h3>
            <p>
              Access to over 10,000 peer-reviewed journals across multiple
              disciplines
            </p>
          </div>
          <div
            className={styles.featureCard}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <FaCloudUploadAlt className={styles.featureIcon} />
            <h3>Easy Submission</h3>
            <p>
              Streamlined process for submitting and sharing your research work
            </p>
          </div>
        </div>
      </section>

      <section className={styles.categories} data-aos="fade-up">
        <h2>Popular Research Categories</h2>
        <div className={styles.categoryGrid}>
          {[
            "Computer Science",
            "Engineering",
            "Medicine",
            "Social Sciences",
            "Environmental Science",
            "Business",
          ].map((category, index) => (
            <div key={index} className={styles.categoryCard}>
              <h3>{category}</h3>
              <p>Explore latest research</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.process}>
        <h2 data-aos="fade-up">How It Works</h2>
        <div className={styles.processGrid}>
          <div className={styles.processStep} data-aos="zoom-in">
            <div className={styles.stepNumber}>1</div>
            <h3>Sign Up</h3>
            <p>Create your academic profile and join our research community</p>
          </div>
          <div className={styles.processStep} data-aos="fade-up">
            <div className={styles.stepNumber}>2</div>
            <h3>Browse & Search</h3>
            <p>
              Access thousands of peer-reviewed journals and research papers
            </p>
          </div>
          <div className={styles.processStep} data-aos="zoom-in">
            <div className={styles.stepNumber}>3</div>
            <h3>Download & Cite</h3>
            <p>Get full access to papers and use our citation tools</p>
          </div>
        </div>
      </section>

      <section className={styles.benefits}>
        <h2 data-aos="fade-up">Benefits for Researchers</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard} data-aos="fade-up">
            <FaGlobe className={styles.benefitIcon} />
            <h3>Global Reach</h3>
            <p>Share your research with scholars worldwide</p>
          </div>
          <div
            className={styles.benefitCard}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <FaChartLine className={styles.benefitIcon} />
            <h3>Impact Tracking</h3>
            <p>Monitor citations and track your research impact</p>
          </div>
          <div
            className={styles.benefitCard}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <FaBookOpen className={styles.benefitIcon} />
            <h3>Open Access</h3>
            <p>Make your research accessible to everyone</p>
          </div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2 data-aos="fade-up">What Researchers Say</h2>
        <div className={styles.testimonialGrid}>
          {[
            {
              name: "Dr. Sarah Johnson",
              role: "Professor of Computer Science",
              text: "JournalArchive has revolutionized how I access and share research papers.",
            },
            {
              name: "Prof. Michael Chen",
              role: "Research Director",
              text: "The platform's search capabilities are outstanding for finding relevant papers.",
            },
            {
              name: "Dr. Emily Brown",
              role: "PhD Researcher",
              text: "An invaluable resource for my doctoral research and publications.",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className={styles.testimonialCard}
              data-aos="fade-up"
            >
              <p>"{testimonial.text}"</p>
              <h4>{testimonial.name}</h4>
              <p className={styles.role}>{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard} data-aos="fade-up">
            <FaBookOpen className={styles.statIcon} />
            <h3>50K+</h3>
            <p>Research Papers</p>
          </div>
          <div
            className={styles.statCard}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <FaUsers className={styles.statIcon} />
            <h3>20K+</h3>
            <p>Active Researchers</p>
          </div>
          <div
            className={styles.statCard}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <FaGraduationCap className={styles.statIcon} />
            <h3>500+</h3>
            <p>Academic Institutions</p>
          </div>
          <div
            className={styles.statCard}
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <FaAward className={styles.statIcon} />
            <h3>100+</h3>
            <p>Research Fields</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent} data-aos="fade-up">
          <h2>Ready to Advance Your Research?</h2>
          <p>
            Join our growing community of researchers and contribute to global
            knowledge sharing
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryBtn}>Sign Up Now</button>
            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
