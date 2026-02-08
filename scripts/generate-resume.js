const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

// Create a new PDF document
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

// Set font
doc.setFont('helvetica');

// Header
doc.setFontSize(24);
doc.setFont('helvetica', 'bold');
doc.text('Max Zavala', 105, 20, { align: 'center' });

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
doc.setTextColor(59, 130, 246);
doc.text('Software Engineer | AI Enthusiast', 105, 28, { align: 'center' });

doc.setTextColor(0, 0, 0);
doc.setFontSize(10);
doc.text('max@zavalatechlabs.com | GitHub: @zavalatechlabs | LinkedIn: /in/maxzavala', 105, 35, { align: 'center' });

// Professional Summary
let y = 50;
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Professional Summary', 20, y);

y += 8;
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
const summary = doc.splitTextToSize(
  'Passionate software engineer with expertise in full-stack development, AI automation, and cloud infrastructure. Proven track record of building scalable applications and leading technical initiatives. Specialized in modern web frameworks, intelligent systems, and delivering high-quality solutions that drive business impact.',
  170
);
doc.text(summary, 20, y);
y += summary.length * 5 + 10;

// Work Experience
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Work Experience', 20, y);
y += 8;

// Job 1
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('Senior Software Engineer', 20, y);
doc.setFont('helvetica', 'normal');
doc.text('2024 - Present', 170, y);
y += 6;
doc.setTextColor(59, 130, 246);
doc.text('Tech Innovations Inc.', 20, y);
doc.setTextColor(0, 0, 0);
y += 6;
doc.setFontSize(9);
const job1Points = [
  '• Led development of enterprise-scale web applications serving 100K+ users',
  '• Architected microservices infrastructure using Node.js, Docker, and AWS',
  '• Implemented CI/CD pipelines reducing deployment time by 60%',
  '• Mentored junior developers and conducted code reviews'
];
job1Points.forEach(point => {
  const lines = doc.splitTextToSize(point, 165);
  doc.text(lines, 25, y);
  y += lines.length * 4;
});
y += 3;
doc.setFontSize(8);
doc.text('Tech: Next.js, TypeScript, PostgreSQL, Docker, AWS', 25, y);
y += 8;

// Job 2
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('Full-Stack Developer', 20, y);
doc.setFont('helvetica', 'normal');
doc.text('2022 - 2024', 170, y);
y += 6;
doc.setTextColor(59, 130, 246);
doc.text('Digital Solutions Co.', 20, y);
doc.setTextColor(0, 0, 0);
y += 6;
doc.setFontSize(9);
const job2Points = [
  '• Built and maintained React-based SaaS platform with real-time features',
  '• Designed RESTful APIs and GraphQL endpoints for mobile and web clients',
  '• Optimized database queries improving application performance by 40%',
  '• Collaborated with design team to implement pixel-perfect UIs'
];
job2Points.forEach(point => {
  const lines = doc.splitTextToSize(point, 165);
  doc.text(lines, 25, y);
  y += lines.length * 4;
});
y += 3;
doc.setFontSize(8);
doc.text('Tech: React, Node.js, Express, MongoDB, Redis', 25, y);
y += 8;

// Job 3
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('Software Engineer', 20, y);
doc.setFont('helvetica', 'normal');
doc.text('2020 - 2022', 170, y);
y += 6;
doc.setTextColor(59, 130, 246);
doc.text('StartupXYZ', 20, y);
doc.setTextColor(0, 0, 0);
y += 6;
doc.setFontSize(9);
const job3Points = [
  '• Developed features for early-stage product from MVP to production',
  '• Implemented automated testing reducing bug reports by 50%',
  '• Worked in agile environment with 2-week sprint cycles'
];
job3Points.forEach(point => {
  const lines = doc.splitTextToSize(point, 165);
  doc.text(lines, 25, y);
  y += lines.length * 4;
});
y += 3;
doc.setFontSize(8);
doc.text('Tech: JavaScript, Vue.js, Python, Django, PostgreSQL', 25, y);
y += 10;

// Education
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Education', 20, y);
y += 8;

doc.setFontSize(11);
doc.text('Bachelor of Science in Computer Science', 20, y);
doc.setFont('helvetica', 'normal');
doc.text('2016 - 2020', 170, y);
y += 6;
doc.setTextColor(59, 130, 246);
doc.text('Tech University', 20, y);
doc.setTextColor(0, 0, 0);
y += 6;
doc.setFontSize(9);
doc.text('Focus: Software Engineering, Artificial Intelligence, and Algorithms', 20, y);
y += 10;

// Technical Skills
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Technical Skills', 20, y);
y += 8;

doc.setFontSize(10);
doc.setFont('helvetica', 'bold');
doc.text('Languages:', 20, y);
doc.setFont('helvetica', 'normal');
doc.text('TypeScript, JavaScript, Python, SQL, Go, Bash', 50, y);
y += 6;

doc.setFont('helvetica', 'bold');
doc.text('Frameworks:', 20, y);
doc.setFont('helvetica', 'normal');
const frameworks = doc.splitTextToSize('Next.js, React, Node.js, Express, FastAPI, TailwindCSS, Prisma, LangChain', 145);
doc.text(frameworks, 50, y);
y += frameworks.length * 5;

doc.setFont('helvetica', 'bold');
doc.text('Tools:', 20, y);
doc.setFont('helvetica', 'normal');
const tools = doc.splitTextToSize('AWS, Docker, Git, GitHub Actions, Vercel, PostgreSQL, MongoDB, Redis, OpenAI API', 145);
doc.text(tools, 50, y);

// Save the PDF
const outputPath = path.join(__dirname, '..', 'public', 'resume.pdf');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
doc.save(outputPath);

console.log(`✅ Resume PDF created successfully at: ${outputPath}`);
