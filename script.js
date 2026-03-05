// ==============================
// IT Student Grade System - Firebase Version
// ==============================

// // Reference to "students" collection
const dbStudents = collection(db, "students");

// Calculate average & status
function calculateAverage(s) {
  return (
    Number(s.ias302) +
    Number(s.sa301) +
    Number(s.itelec3) +
    Number(s.itelec4) +
    Number(s.cap301)
  ) / 5;
}

function getStatus(avg) {
  if (avg >= 90) return ["Excellent", "excellent"];
  if (avg >= 75) return ["Good", "good"];
  if (avg >= 60) return ["Passed", "good"];
  return ["Failed", "failed"];
}

// Add student to Firebase
export async function addStudent() {
  const student = {
    name: document.getElementById("name").value,
    ias302: Number(document.getElementById("ias302").value),
    sa301: Number(document.getElementById("sa301").value),
    itelec3: Number(document.getElementById("itelec3").value),
    itelec4: Number(document.getElementById("itelec4").value),
    cap301: Number(document.getElementById("cap301").value)
  };

  await addDoc(dbStudents, student);
  clearForm();
}

// Delete student
export async function deleteStudent(id) {
  await deleteDoc(doc(db, "students", id));
}

// Render table & stats
function renderTable(students) {
  const table = document.getElementById("tableBody");
  table.innerHTML = "";

  let total = 0;
  let top = students[0];
  let topAvg = calculateAverage(top);

  students.forEach((s) => {
    const avg = calculateAverage(s);
    total += avg;
    const status = getStatus(avg);

    if (avg > topAvg) {
      topAvg = avg;
      top = s;
    }

    table.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.ias302}</td>
        <td>${s.sa301}</td>
        <td>${s.itelec3}</td>
        <td>${s.itelec4}</td>
        <td>${s.cap301}</td>
        <td>${avg.toFixed(2)}</td>
        <td class="${status[1]}">${status[0]}</td>
        <td><button onclick="deleteStudent('${s.id}')">Delete</button></td>
      </tr>
    `;
  });

  updateStats(students, total, top);
}

// Update stats
function updateStats(students, total, top) {
  document.getElementById("totalStudents").innerText = students.length;

  if (students.length === 0) {
    document.getElementById("classAverage").innerText = 0;
    document.getElementById("topStudent").innerText = "None";
    return;
  }

  const classAvg = (total / students.length).toFixed(2);
  document.getElementById("classAverage").innerText = classAvg;
  document.getElementById("topStudent").innerText = top.name;
}

// Clear input form
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("ias302").value = "";
  document.getElementById("sa301").value = "";
  document.getElementById("itelec3").value = "";
  document.getElementById("itelec4").value = "";
  document.getElementById("cap301").value = "";
}

// Real-time listener
onSnapshot(dbStudents, (snapshot) => {
  const students = [];
  snapshot.forEach((docItem) => {
    const data = docItem.data();
    data.id = docItem.id; // needed for delete
    students.push(data);
  });
  renderTable(students);
}); objects (from your HTML script)
const dbStudents = collection(db, "students");

// ------------------------------
// Calculate Average & Status
// ------------------------------
function calculateAverage(s) {
  return (
    Number(s.ias302) +
    Number(s.sa301) +
    Number(s.itelec3) +
    Number(s.itelec4) +
    Number(s.cap301)
  ) / 5;
}

function getStatus(avg) {
  if (avg >= 90) return ["Excellent", "excellent"];
  if (avg >= 75) return ["Good", "good"];
  if (avg >= 60) return ["Passed", "good"];
  return ["Failed", "failed"];
}

// ------------------------------
// Add Student to Firebase
// ------------------------------
export async function addStudent() {
  const student = {
    name: document.getElementById("name").value,
    ias302: Number(document.getElementById("ias302").value),
    sa301: Number(document.getElementById("sa301").value),
    itelec3: Number(document.getElementById("itelec3").value),
    itelec4: Number(document.getElementById("itelec4").value),
    cap301: Number(document.getElementById("cap301").value),
  };

  await addDoc(dbStudents, student);

  clearForm();
}

// ------------------------------
// Delete Student from Firebase
// ------------------------------
export async function deleteStudent(id) {
  await deleteDoc(doc(db, "students", id));
}

// ------------------------------
// Render Table & Stats
// ------------------------------
function renderTable(students) {
  const table = document.getElementById("tableBody");
  table.innerHTML = "";

  let total = 0;
  let top = students[0];
  let topAvg = calculateAverage(top);

  students.forEach((s) => {
    const avg = calculateAverage(s);
    total += avg;
    const status = getStatus(avg);

    if (avg > topAvg) {
      topAvg = avg;
      top = s;
    }

    table.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.ias302}</td>
        <td>${s.sa301}</td>
        <td>${s.itelec3}</td>
        <td>${s.itelec4}</td>
        <td>${s.cap301}</td>
        <td>${avg.toFixed(2)}</td>
        <td class="${status[1]}">${status[0]}</td>
        <td>
          <button onclick="deleteStudent('${s.id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  updateStats(students, total, top);
}

// ------------------------------
// Update Class Stats
// ------------------------------
function updateStats(students, total, top) {
  document.getElementById("totalStudents").innerText = students.length;

  if (students.length === 0) {
    document.getElementById("classAverage").innerText = 0;
    document.getElementById("topStudent").innerText = "None";
    return;
  }

  const classAvg = (total / students.length).toFixed(2);
  document.getElementById("classAverage").innerText = classAvg;
  document.getElementById("topStudent").innerText = top.name;
}

// ------------------------------
// Clear Form Inputs
// ------------------------------
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("ias302").value = "";
  document.getElementById("sa301").value = "";
  document.getElementById("itelec3").value = "";
  document.getElementById("itelec4").value = "";
  document.getElementById("cap301").value = "";
}

// ------------------------------
// Real-time Listener (Load Data)
// ------------------------------
onSnapshot(dbStudents, (snapshot) => {
  const students = [];
  snapshot.forEach((docItem) => {
    const data = docItem.data();
    data.id = docItem.id; // store the document id for delete
    students.push(data);
  });
  renderTable(students);
});
