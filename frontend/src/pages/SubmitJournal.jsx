import { useState } from "react";
import swal from "sweetalert2";
import styles from "../css/SubmitJournal.module.css";
import api from "../constant/api";
import { useNavigate } from "react-router-dom";

const faculties = [
  "Faculty of Engineering",
  "Faculty of Science",
  "Faculty of Arts",
  "Faculty of Social Sciences",
  "Faculty of Law",
  "Faculty of Basic Sciences",
];

const SubmitJournal = () => {
  const [formData, setFormData] = useState({
    title: "",
    faculty: "",
    abstract: "",
    keywords: "",
    file: null,
  });

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.title.trim() ||
      !formData.faculty ||
      !formData.abstract.trim() ||
      !formData.keywords.trim() ||
      !formData.file
    ) {
      swal.fire({
        title: "Error",
        text: "Please fill in all fields and upload a file!",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }

    // Validate file type
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(formData.file.type)
    ) {
      swal.fire({
        title: "Error",
        text: "Only PDF and DOCX files are allowed.",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
      return;
    }

    // Create FormData object
    const submitData = new FormData();
    submitData.append("title", formData.title.trim());
    submitData.append("faculty", formData.faculty); // Make sure this matches exactly with backend
    submitData.append("abstract", formData.abstract.trim());
    submitData.append("keywords", formData.keywords.trim());
    submitData.append("file", formData.file);

    // Log the data being sent (for debugging)
    for (let pair of submitData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Add timeout and validate status
        timeout: 8000,
        validateStatus: (status) => status >= 200 && status < 300,
      };

      const response = await api.post("submit/", submitData, config);

      if (response.data) {
        swal.fire({
          title: "Success!",
          text: "Your journal has been submitted successfully.",
          icon: "success",
          confirmButtonColor: "var(--primary)",
        });

        // Reset form
        setFormData({
          title: "",
          faculty: "",
          abstract: "",
          keywords: "",
          file: null,
        });

        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = "";
        }
        navigate('/')
      }
    } catch (error) {
      console.error("Submission error:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      swal.fire({
        title: "Submission Failed",
        text:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "var(--primary)",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Submit Your Journal</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Project Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project title"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Faculty</label>
          <select
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
          >
            <option value="">Select Faculty</option>
            {faculties.map((fac, idx) => (
              <option key={idx} value={fac}>
                {fac}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Abstract</label>
          <textarea
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            placeholder="Write a short abstract"
            rows="5"
          ></textarea>
        </div>

        <div className={styles.formGroup}>
          <label>Keywords (comma-separated)</label>
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder="e.g. AI, Machine Learning, Robotics"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Upload File (PDF/DOCX)</label>
          <input
            type="file"
            name="file"
            accept=".pdf,.docx"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          Submit Journal
        </button>
      </form>
    </div>
  );
};

export default SubmitJournal;
