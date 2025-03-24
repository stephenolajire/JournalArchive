import { useState, useEffect } from "react";
import { FaDownload, FaTrashAlt, FaInfoCircle } from "react-icons/fa";
import styles from "../css/SavedJournal.module.css";
import api from "../constant/api";
import Swal from "sweetalert2";

const SavedJournals = () => {
  const [savedJournals, setSavedJournals] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedJournals();
  }, []);

  const fetchSavedJournals = async () => {
    try {
      const response = await api.get("saved-journals/");
      setSavedJournals(response.data);
    } catch (error) {
      console.error("Error fetching saved journals:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load saved journals",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unsaveJournal = async (id) => {
    try {
      // First show confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This journal will be removed from your saved items",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--primary)",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it",
        cancelButtonText: "Cancel",
      });

      // If user confirms deletion
      if (result.isConfirmed) {
        await api.delete(`save/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        // Update state to remove the journal
        setSavedJournals((prev) => prev.filter((journal) => journal.id !== id));

        // Show success message
        Swal.fire({
          title: "Removed!",
          text: "Journal has been removed from saved items",
          icon: "success",
          confirmButtonColor: "var(--primary)",
        });
      }
    } catch (error) {
      console.error("Error removing journal:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to remove journal",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
    }
  };

  const openModal = (journal) => {
    setModalData(journal);
  };

  const closeModal = () => {
    setModalData(null);
  };

  if (isLoading) {
    return <div className={styles.empty}>Loading saved journals...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Saved Journals</h2>
      <div className={styles.grid}>
        {savedJournals.length > 0 ? (
          savedJournals.map((journal) => (
            <div key={journal.id} className={styles.card}>
              <h3>{journal.title}</h3>
              <p className={styles.faculty}>{journal.faculty}</p>
              {/* <p className={styles.desc}>{journal.abstract}</p> */}
              <div className={styles.actions}>
                <a
                  href={journal.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDownload className={styles.icon} title="Download" />
                </a>
                <button onClick={() => unsaveJournal(journal.id)}>
                  <FaTrashAlt className={styles.icon} title="Unsave" />
                </button>
                <button onClick={() => openModal(journal)}>
                  <FaInfoCircle className={styles.icon} title="Details" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>You have no saved journals.</p>
        )}
      </div>

      {modalData && (
        <div className={styles.modalOverlay} onClick={closeModal}>
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
            <div className={styles.modalActions}>
              <a
                href={modalData.file_url}
                download
                className={styles.modalBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
              <button onClick={closeModal} className={styles.modalBtnSecondary}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedJournals;
