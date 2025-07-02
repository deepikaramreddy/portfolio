// STEP 1: Install dependencies using:
// npm init -y
// npm install express

const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from public folder (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html (or you can change to customize.html if you prefer)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to handle form submission and redirect to chosen template
app.post('/generate', (req, res) => {
  const { name, role, bio, projects, linkedin, github, template } = req.body;

  // Safely encode user data to avoid script issues
  const userData = {
    name: sanitize(name),
    role: sanitize(role),
    bio: sanitize(bio),
    projects: sanitize(projects),
    linkedin: sanitize(linkedin),
    github: sanitize(github)
  };

  const chosenTemplate = sanitize(template || 'template1');

  // Inject user data into browser using localStorage
  const script = `
    <script>
      localStorage.setItem('portfolioData', '${JSON.stringify(userData)}');
      window.location.href = '/${chosenTemplate}.html';
    </script>
  `;

  res.send(script);
});

// Basic sanitization function to escape special characters
function sanitize(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
