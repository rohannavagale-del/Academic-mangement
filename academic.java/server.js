const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser"); // ✅ keep this here

// Set view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Middleware
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true })); // ✅ after expressLayouts
app.set("layout", "layout"); // layout.ejs will be used as default layout

// Serve static files
app.use(express.static(__dirname + "/public"));

// In-memory data store (in a real app, this would be a database)
const appData = {
  departments: ["Computer Science", "Mechanical", "Electrical"].map((name, id) => ({ id: id + 1, name })),
  programs: ["B.Tech", "M.Tech", "MBA"].map((name, id) => ({ id: id + 1, name })),
  courses: ["AI", "DBMS", "Networks", "Thermodynamics"].map((name, id) => ({ id: id + 1, name })),
  students: ["Rohan", "Amit", "Sneha", "Priya"].map((name, id) => ({ id: id + 1, name })),
  faculty: ["Dr. Sharma", "Prof. Rao", "Dr. Meena"].map((name, id) => ({ id: id + 1, name }))
};

// Relationships
const relationships = {
  enrollments: [], // Initialize empty enrollments array
};

// Routes
app.get("/", (req, res) => {
  const data = {
    ...appData,
    ...relationships,
    departments: appData.departments || [],
    programs: appData.programs || [],
    courses: appData.courses || [],
    students: appData.students || [],
    faculty: appData.faculty || []
  };
  res.render("index", { title: "Academic Management", data });
});

// Add new student route
app.post("/students", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Student name is required");
  }
  const newId = appData.students.length > 0 ? Math.max(...appData.students.map(s => s.id)) + 1 : 1;
  appData.students.push({ id: newId, name });
  res.redirect("/");
});

// Delete student route
app.post("/students/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  appData.students = appData.students.filter(student => student.id !== id);
  res.redirect("/");
});

// Edit student route
app.post("/students/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Student name is required");
  }
  const studentIndex = appData.students.findIndex(student => student.id === id);
  if (studentIndex !== -1) {
    appData.students[studentIndex].name = name;
  }
  res.redirect("/");
});

// Department routes
app.post("/departments", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Department name is required");
  const newId = appData.departments.length > 0 ? Math.max(...appData.departments.map(d => d.id)) + 1 : 1;
  appData.departments.push({ id: newId, name });
  res.redirect("/#departments");
});

app.post("/departments/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  appData.departments = appData.departments.filter(dept => dept.id !== id);
  res.redirect("/#departments");
});

app.post("/departments/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  if (!name) return res.status(400).send("Department name is required");
  const deptIndex = appData.departments.findIndex(dept => dept.id === id);
  if (deptIndex !== -1) appData.departments[deptIndex].name = name;
  res.redirect("/#departments");
});

// Program routes
app.post("/programs", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Program name is required");
  const newId = appData.programs.length > 0 ? Math.max(...appData.programs.map(p => p.id)) + 1 : 1;
  appData.programs.push({ id: newId, name });
  res.redirect("/#programs");
});

app.post("/programs/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  appData.programs = appData.programs.filter(prog => prog.id !== id);
  res.redirect("/#programs");
});

app.post("/programs/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  if (!name) return res.status(400).send("Program name is required");
  const progIndex = appData.programs.findIndex(prog => prog.id === id);
  if (progIndex !== -1) appData.programs[progIndex].name = name;
  res.redirect("/#programs");
});

// Course routes
app.post("/courses", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Course name is required");
  const newId = appData.courses.length > 0 ? Math.max(...appData.courses.map(c => c.id)) + 1 : 1;
  appData.courses.push({ id: newId, name });
  res.redirect("/#courses");
});

app.post("/courses/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  appData.courses = appData.courses.filter(course => course.id !== id);
  res.redirect("/#courses");
});

app.post("/courses/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  if (!name) return res.status(400).send("Course name is required");
  const courseIndex = appData.courses.findIndex(course => course.id === id);
  if (courseIndex !== -1) appData.courses[courseIndex].name = name;
  res.redirect("/#courses");
});

// Faculty routes
app.post("/faculty", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Faculty name is required");
  const newId = appData.faculty.length > 0 ? Math.max(...appData.faculty.map(f => f.id)) + 1 : 1;
  appData.faculty.push({ id: newId, name });
  res.redirect("/#faculty");
});

app.post("/faculty/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  appData.faculty = appData.faculty.filter(faculty => faculty.id !== id);
  res.redirect("/#faculty");
});

app.post("/faculty/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  if (!name) return res.status(400).send("Faculty name is required");
  const facultyIndex = appData.faculty.findIndex(faculty => faculty.id === id);
  if (facultyIndex !== -1) appData.faculty[facultyIndex].name = name;
  res.redirect("/#faculty");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
