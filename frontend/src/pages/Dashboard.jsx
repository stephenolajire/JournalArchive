import { useState, useEffect } from "react";
import {
  FaBook,
  FaCode,
  FaFlask,
  FaPaintBrush,
  FaCog,
  FaDownload,
  FaSave,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaUserMd,
  FaUserGraduate
} from "react-icons/fa";
import styles from "../css/Dashboard.module.css";
import api from "../constant/api";
import Swal from "sweetalert2";

const faculties = [
  { name: "All", icon: <FaBook /> },
  { name: "Faculty of Engineering", icon: <FaCog /> },
  { name: "Faculty of Science", icon: <FaFlask /> },
  { name: "Faculty of Arts", icon: <FaPaintBrush /> },
  { name: "Faculty of Basic Science", icon: <FaUserMd/> },
  { name: "Faculty of Law", icon: <FaPaintBrush /> },
  { name: "Faculty of Social Science", icon: <FaUserGraduate /> },
];

const Dashboard = () => {
  const [journals, setJournals] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const journalsPerPage = 9;

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("list/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      setJournals(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching journals:", error);
      setError("Failed to load journals. Please try again later.");
      Swal.fire({
        title: "Error",
        text: "Failed to load journals. Please try again later.",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacultyClick = (faculty) => {
    setSelectedFaculty(faculty);
    setCurrentPage(1);
  };

  const handleSaveJournal = async (journalId) => {
    try {
      const response = await api.post(
        "save/",
        { journal_id: journalId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      if (response.data) {
        Swal.fire({
          title: "Success!",
          text: "Journal saved successfully",
          icon: "success",
          confirmButtonColor: "var(--primary)",
        });

        // Update the UI to show the journal is saved
        const updatedJournals = journals.map((journal) =>
          journal.id === journalId ? { ...journal, is_saved: true } : journal
        );
        setJournals(updatedJournals);
      }
    } catch (error) {
      console.error("Error saving journal:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to save journal. Please try again.",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
    }
  };

  const filteredJournals = journals.filter((journal) => {
    if (selectedFaculty === "All") return true;
    return journal.faculty === selectedFaculty;
  });

  const indexOfLastJournal = currentPage * journalsPerPage;
  const indexOfFirstJournal = indexOfLastJournal - journalsPerPage;
  const currentJournals = filteredJournals.slice(
    indexOfFirstJournal,
    indexOfLastJournal
  );

  const paginate = (direction) => {
    if (direction === "next" && indexOfLastJournal < filteredJournals.length) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading journals...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        {faculties.map((fac) => (
          <button
            key={fac.name}
            className={`${styles.facultyButton} ${
              selectedFaculty === fac.name ? styles.active : ""
            }`}
            onClick={() => handleFacultyClick(fac.name)}
          >
            {fac.icon}
            <span>{fac.name}</span>
          </button>
        ))}
      </aside>

      <main className={styles.mainContent}>
        <h2>{selectedFaculty} Journals</h2>
        {currentJournals.length > 0 ? (
          <div className={styles.journalGrid}>
            {currentJournals.map((journal) => (
              <div key={journal.id} className={styles.journalCard}>
                <h3>{journal.title}</h3>
                <p className={styles.faculty}>{journal.faculty}</p>
                {/* <p>{journal.abstract}</p> */}
                <div className={styles.cardActions}>
                  <a
                    href={journal.file_url}
                    download
                    className={styles.actionIcon}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaDownload title="Download" className={styles.download} />
                  </a>
                  <button
                    className={`${styles.actionIcon} ${
                      journal.is_saved ? styles.saved : ""
                    }`}
                    onClick={() => handleSaveJournal(journal.id)}
                    disabled={journal.is_saved}
                  >
                    <FaSave
                      title={journal.is_saved ? "Already Saved" : "Save"}
                      className={styles.save}
                    />
                  </button>
                  <button
                    className={styles.actionIcon}
                    onClick={() => setModalData(journal)}
                  >
                    <FaInfoCircle title="Details" className={styles.detail} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noJournals}>
            No journals found for this faculty.
          </div>
        )}

        {filteredJournals.length > journalsPerPage && (
          <div className={styles.pagination}>
            <button
              onClick={() => paginate("prev")}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => paginate("next")}
              disabled={indexOfLastJournal >= filteredJournals.length}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </main>

      {modalData && (
        <div className={styles.modalOverlay} onClick={() => setModalData(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{modalData.title}</h3>
            <p>
              <strong>Faculty:</strong> {modalData.faculty}
            </p>
            <p>
              <strong>Abstract:</strong> {modalData.abstract}
            </p>
            <p>
              <strong>Keywords:</strong> {modalData.keywords}
            </p>
            <div className={styles.modalAction}>
              <a
                href={modalData.file_url}
                download
                className={styles.downloadBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF
              </a>
              <button onClick={() => setModalData(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
