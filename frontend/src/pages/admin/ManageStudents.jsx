import { useState, useEffect } from "react";
import { FiSearch, FiMail } from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import styles from "./ManageStudents.module.css";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setStudents([
      {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        rollNumber: "21CS101",
        ratingsCount: 45,
      },
      {
        _id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        rollNumber: "21CS102",
        ratingsCount: 38,
      },
      {
        _id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        rollNumber: "21CS103",
        ratingsCount: 52,
      },
    ]);
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Manage Students</h1>
            <p>View registered students</p>
          </div>
          <span className={styles.count}>{students.length} students</span>
        </header>

        <div className={styles.searchBox}>
          <Input
            type="text"
            placeholder="Search by name, roll number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={FiSearch}
          />
        </div>

        <Card className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Email</th>
                <th>Ratings</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div className={styles.studentCell}>
                      <div className={styles.avatar}>
                        {student.name.charAt(0)}
                      </div>
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td>{student.rollNumber}</td>
                  <td>
                    <a
                      href={`mailto:${student.email}`}
                      className={styles.email}
                    >
                      <FiMail /> {student.email}
                    </a>
                  </td>
                  <td>
                    <span className={styles.ratingsBadge}>
                      {student.ratingsCount} ratings
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <p className={styles.noResults}>No students found</p>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ManageStudents;
