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
  departments: ["Computer Science", "Mechanical", "Electrical"].map((name, id) => {
    const tier = ["basic", "pro", "premium"][Math.floor(Math.random() * 3)];
    const deliveryTime = {
      'basic': '5-7 business days',
      'pro': '2-3 business days',
      'premium': '24 hours'
    }[tier];
    return {
      id: id + 1,
      name,
      tier,
      deliveryTime
    };
  }),
  programs: ["B.Tech", "M.Tech", "MBA"].map((name, id) => {
    const tier = ["basic", "pro", "premium"][Math.floor(Math.random() * 3)];
    const deliveryTime = {
      'basic': '5-7 business days',
      'pro': '2-3 business days',
      'premium': '24 hours'
    }[tier];
    return {
      id: id + 1,
      name,
      departmentId: Math.floor(Math.random() * 3) + 1, // Randomly assign to departments 1-3
      tier,
      deliveryTime
    };
  }),
  courses: ["AI", "DBMS", "Networks", "Thermodynamics"].map((name, id) => ({ id: id + 1, name })),
  students: ["Rohan", "Amit", "Sneha", "Priya"].map((name, id) => ({ 
    id: id + 1, 
    name,
    programId: Math.floor(Math.random() * 3) + 1 // Randomly assign to programs 1-3
  })),
  faculty: ["Dr. Sharma", "Prof. Rao", "Dr. Meena"].map((name, id) => ({ 
    id: id + 1, 
    name,
    departmentId: Math.floor(Math.random() * 3) + 1 // Randomly assign to departments 1-3
  }))
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
  const { name, programId } = req.body;
  if (!name) {
    return res.status(400).send("Student name is required");
  }
  if (!programId) {
    return res.status(400).send("Program selection is required");
  }
  const newId = appData.students.length > 0 ? Math.max(...appData.students.map(s => s.id)) + 1 : 1;
  appData.students.push({ id: newId, name, programId: parseInt(programId) });
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
  const { name, programId } = req.body;
  if (!name) {
    return res.status(400).send("Student name is required");
  }
  if (!programId) {
    return res.status(400).send("Program selection is required");
  }
  const studentIndex = appData.students.findIndex(student => student.id === id);
  if (studentIndex !== -1) {
    appData.students[studentIndex].name = name;
    appData.students[studentIndex].programId = parseInt(programId);
  }
  res.redirect("/");
});

// Department routes
app.post("/departments", (req, res) => {
  const { name, tier } = req.body;
  if (!name) return res.status(400).send("Department name is required");
  if (!tier) return res.status(400).send("Tier selection is required");
  const deliveryTime = {
    'basic': '5-7 business days',
    'pro': '2-3 business days',
    'premium': '24 hours'
  }[tier];
  const newId = appData.departments.length > 0 ? Math.max(...appData.departments.map(d => d.id)) + 1 : 1;
  appData.departments.push({ id: newId, name, tier, deliveryTime });
  res.redirect("/#departments");
});

app.post("/departments/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  appData.departments = appData.departments.filter(dept => dept.id !== id);
  res.redirect("/#departments");
});

app.post("/departments/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, tier } = req.body;
  if (!name) return res.status(400).send("Department name is required");
  if (!tier) return res.status(400).send("Tier selection is required");
  const deptIndex = appData.departments.findIndex(dept => dept.id === id);
  if (deptIndex !== -1) {
    const deliveryTime = {
      'basic': '5-7 business days',
      'pro': '2-3 business days',
      'premium': '24 hours'
    }[tier];
    appData.departments[deptIndex].name = name;
    appData.departments[deptIndex].tier = tier;
    appData.departments[deptIndex].deliveryTime = deliveryTime;
  }
  res.redirect("/#departments");
});

// Program routes
app.post("/programs", (req, res) => {
  const { name, departmentId, tier } = req.body;
  if (!name) return res.status(400).send("Program name is required");
  if (!departmentId) return res.status(400).send("Department selection is required");
  if (!tier) return res.status(400).send("Tier selection is required");
  const deliveryTime = {
    'basic': '5-7 business days',
    'pro': '2-3 business days',
    'premium': '24 hours'
  }[tier];
  const newId = appData.programs.length > 0 ? Math.max(...appData.programs.map(p => p.id)) + 1 : 1;
  appData.programs.push({ id: newId, name, departmentId: parseInt(departmentId), tier, deliveryTime });
  res.redirect("/#programs");
});

app.post("/programs/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  appData.programs = appData.programs.filter(prog => prog.id !== id);
  res.redirect("/#programs");
});

app.post("/programs/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, departmentId, tier } = req.body;
  if (!name) return res.status(400).send("Program name is required");
  if (!departmentId) return res.status(400).send("Department selection is required");
  if (!tier) return res.status(400).send("Tier selection is required");
  const progIndex = appData.programs.findIndex(prog => prog.id === id);
  if (progIndex !== -1) {
    const deliveryTime = {
      'basic': '5-7 business days',
      'pro': '2-3 business days',
      'premium': '24 hours'
    }[tier];
    appData.programs[progIndex].name = name;
    appData.programs[progIndex].departmentId = parseInt(departmentId);
    appData.programs[progIndex].tier = tier;
    appData.programs[progIndex].deliveryTime = deliveryTime;
  }
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
  const { name, departmentId } = req.body;
  if (!name) return res.status(400).send("Faculty name is required");
  if (!departmentId) return res.status(400).send("Department selection is required");
  const newId = appData.faculty.length > 0 ? Math.max(...appData.faculty.map(f => f.id)) + 1 : 1;
  appData.faculty.push({ id: newId, name, departmentId: parseInt(departmentId) });
  res.redirect("/#faculty");
});

app.post("/faculty/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  appData.faculty = appData.faculty.filter(faculty => faculty.id !== id);
  res.redirect("/#faculty");
});

app.post("/faculty/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, departmentId } = req.body;
  if (!name) return res.status(400).send("Faculty name is required");
  if (!departmentId) return res.status(400).send("Department selection is required");
  const facultyIndex = appData.faculty.findIndex(faculty => faculty.id === id);
  if (facultyIndex !== -1) {
    appData.faculty[facultyIndex].name = name;
    appData.faculty[facultyIndex].departmentId = parseInt(departmentId);
  }
  res.redirect("/#faculty");
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
