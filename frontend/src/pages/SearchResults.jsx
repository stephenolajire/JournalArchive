import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../css/SearchResults.module.css";
import { FaDownload, FaSave, FaInfoCircle } from "react-icons/fa";
import api from "../constant/api";
import Swal from "sweetalert2";

const SearchResults = () => {
  const location = useLocation();
  const { results, searchQuery } = location.state || {
    results: [],
    searchQuery: "",
  };
  const [modalData, setModalData] = useState(null);

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
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to save journal",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Search Results for "{searchQuery}"</h2>

      {results.journals?.length > 0 ? (
        <div className={styles.resultsGrid}>
          {results.journals.map((journal) => (
            <div key={journal.id} className={styles.journalCard}>
              <h3>{journal.title}</h3>
              <p className={styles.author}>
                By: {journal.user.first_name} {journal.user.last_name}
              </p>
              <p className={styles.faculty}>{journal.faculty}</p>
              <p className={styles.abstract}>{journal.abstract}</p>

              <div className={styles.actions}>
                <a
                  href={journal.file_url}
                  download
                  className={styles.actionBtn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDownload title="Download" />
                </a>
                <button
                  className={styles.actionBtn}
                  onClick={() => handleSaveJournal(journal.id)}
                >
                  <FaSave title="Save" />
                </button>
                <button
                  className={styles.actionBtn}
                  onClick={() => setModalData(journal)}
                >
                  <FaInfoCircle title="Details" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          No journals found matching your search.
        </div>
      )}

      {/* Modal for journal details */}
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
            <p>
              <strong>Submitted by:</strong> {modalData.user.first_name}{" "}
              {modalData.user.last_name}
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

export default SearchResults;
