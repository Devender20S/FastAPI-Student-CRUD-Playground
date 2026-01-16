import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/student";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    course: "",
    marks: ""
  });

  const loadStudents = async () => {
    const res = await axios.get(API);
    setStudents(res.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addStudent = async () => {
    await axios.post(API, {
      ...form,
      marks: Number(form.marks)
    });
    resetForm();
    loadStudents();
  };

  const updateStudent = async () => {
    await axios.put(`${API}/${editingId}`, {
      ...form,
      marks: Number(form.marks)
    });
    resetForm();
    loadStudents();
  };

  const editStudent = (s) => {
    setEditingId(s.student_id);
    setForm({
      first_name: s.first_name,
      last_name: s.last_name,
      gender: s.gender,
      course: s.course,
      marks: s.marks
    });
  };

  const deleteStudent = async (id) => {
    await axios.delete(`${API}/${id}`);
    loadStudents();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ first_name: "", last_name: "", gender: "", course: "", marks: "" });
  };

  const filteredStudents = students.filter((s) =>
    (s.first_name + " " + s.last_name + s.course + s.gender)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Management System</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search by name, course or gender"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "300px", marginBottom: "10px" }}
      />

      <br />

      {/* FORM */}
      <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange}/>
      <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange}/>
      <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange}/>
      <input name="course" placeholder="Course" value={form.course} onChange={handleChange}/>
      <input name="marks" placeholder="Marks" value={form.marks} onChange={handleChange}/>

      <br /><br />

      {editingId ? (
        <>
          <button onClick={updateStudent}>Update Student</button>
          <button onClick={resetForm} style={{ marginLeft: "10px" }}>Cancel</button>
        </>
      ) : (
        <button onClick={addStudent}>Add Student</button>
      )}

      {/* TABLE */}
      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Gender</th><th>Course</th><th>Marks</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(s => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.first_name} {s.last_name}</td>
              <td>{s.gender}</td>
              <td>{s.course}</td>
              <td>{s.marks}</td>
              <td>
                <button onClick={() => editStudent(s)}>Edit</button>
                <button onClick={() => deleteStudent(s.student_id)} style={{ marginLeft: "10px" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default App;
