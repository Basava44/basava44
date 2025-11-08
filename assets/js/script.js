// Load portfolio data
let portfolioData = {};

async function loadPortfolioData() {
  try {
    const response = await fetch("assets/data/portfolioData.json");
    portfolioData = await response.json();
    renderPortfolio();
  } catch (error) {
    console.error("Error loading portfolio data:", error);
  }
}

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const currentTheme = localStorage.getItem("theme") || "dark";
body.setAttribute("data-theme", currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
}

// Code background animation
function createCodeBackground() {
  const background = document.getElementById("codeBackground");
  const codeSnippets = [
    'const portfolio = { name: "Karibasaveshwara TG" };',
    'function buildWebApp() { return "scalable & elegant"; }',
    'import { Angular, React, Vue } from "frameworks";',
    'const experience = "4+ years";',
    "async function createImpact() { ... }",
    "export default FullStackDeveloper;",
  ];

  for (let i = 0; i < 6; i++) {
    const line = document.createElement("div");
    line.className = "code-line";
    line.textContent = codeSnippets[i];
    line.style.top = `${20 + i * 15}%`;
    line.style.animationDelay = `${i * 2}s`;
    background.appendChild(line);
  }
}

// Render portfolio
function renderPortfolio() {
  // Hero Section
  const nameParts = portfolioData.name.split(" ");
  const firstName = nameParts[0] || portfolioData.name;
  document.getElementById("heroName").textContent = firstName;
  
  // Split role: "Full Stack Developer (Frontend-Focused)"
  // First line: "Full Stack Developer", Second line: "(Frontend-Focused)"
  const role = portfolioData.role || "Full Stack Developer (Frontend-Focused)";
  const parenIndex = role.indexOf("(");
  
  if (parenIndex !== -1) {
    // Split at the opening parenthesis
    const firstPart = role.substring(0, parenIndex).trim();
    const secondPart = role.substring(parenIndex).trim();
    document.getElementById("heroTitlePart1").textContent = firstPart || "Full Stack Developer";
    document.getElementById("heroTitlePart2").textContent = secondPart || "(Frontend-Focused)";
  } else {
    // Fallback if no parentheses found
    document.getElementById("heroTitlePart1").textContent = role;
    document.getElementById("heroTitlePart2").textContent = "";
  }
  
  // Use a shorter description for hero
  const shortDescription = portfolioData.about?.short_intro || portfolioData.summary || "I'm a developer passionate about building beautiful and functional web experiences.";
  document.getElementById("heroDescription").textContent = shortDescription;
  
  // Set resume link
  if (portfolioData.resume) {
    const resumeLink = document.getElementById("resumeLink");
    if (resumeLink) {
      resumeLink.href = portfolioData.resume;
    }
  }

  // About Section
  document.getElementById("shortIntro").textContent =
    portfolioData.about.short_intro;
  document.getElementById("detailedAbout").textContent =
    portfolioData.about.detailed;

  // Social Icons
  const socialIcons = document.getElementById("socialIcons");
  const socialLinks = [
    { icon: "fab fa-linkedin", url: portfolioData.linkedin, label: "LinkedIn" },
    { icon: "fab fa-github", url: portfolioData.github, label: "GitHub" },
    { icon: "fab fa-medium", url: portfolioData.medium, label: "Medium" },
    {
      icon: "fab fa-instagram",
      url: portfolioData.instagram,
      label: "Instagram",
    },
  ];
  socialLinks.forEach((social) => {
    const link = document.createElement("a");
    link.href = social.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "social-icon";
    link.innerHTML = `<i class="${social.icon}"></i>`;
    link.setAttribute("aria-label", social.label);
    socialIcons.appendChild(link);
  });

  // Experience Section
  const experienceTimeline = document.getElementById("experienceTimeline");
  portfolioData.experience.forEach((exp) => {
    // Find awards related to this company
    const relatedAwards = portfolioData.awards?.filter(
      (award) => award.organization && exp.company && 
      (award.organization.toLowerCase().includes(exp.company.toLowerCase()) || 
       exp.company.toLowerCase().includes(award.organization.toLowerCase()))
    ) || [];
    
    const item = document.createElement("div");
    item.className = "experience-item";
    item.innerHTML = `
            <div class="experience-card">
                <div class="experience-header">
                <div>
                        <div class="experience-title">${exp.position}</div>
                        <div class="experience-company">${exp.company}</div>
                </div>
                    <div class="experience-duration">${exp.duration}</div>
                </div>
                ${exp.projects
                  .map(
                    (project) => {
                      const isStandardBank = project.title.toLowerCase().includes('standard bank');
                      return `
                    <div class="project-item">
                        <div class="project-title">
                          ${isStandardBank ? `<img src="assets/images/standardBank.png" alt="Standard Bank Logo" class="company-logo-small">` : ''}
                          ${project.title}
                        </div>
                        <div class="project-description">${
                          project.description
                        }</div>
                        <ul class="achievements-list">
                            ${project.achievements
                              .map((achievement) => `<li>${achievement}</li>`)
                              .join("")}
                        </ul>
                </div>
                `;
                    }
                  )
                  .join("")}
                ${relatedAwards.length > 0 ? `
                <div class="awards-section">
                    <div class="awards-title">
                        <i class="fas fa-trophy"></i> Awards & Recognition
                    </div>
                    ${relatedAwards.map(award => `
                        <div class="award-item">
                            <div class="award-name">${award.title}</div>
                            ${award.description ? `<div class="award-description">${award.description}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    experienceTimeline.appendChild(item);
  });

  // Projects Section
  const projectsGrid = document.getElementById("projectsGrid");
  portfolioData.projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";
    const wipBadge = project.status
      ? `<span class="wip-badge">${project.status}</span>`
      : "";
    card.innerHTML = `
            <div class="project-header">
                <div class="project-name">${project.title}</div>
                ${wipBadge}
            </div>
            <div class="project-description">${project.description}</div>
            <div class="tech-stack">
                ${project.techStack
                  .map((tech) => `<span class="tech-badge">${tech}</span>`)
                  .join("")}
            </div>
            <div class="project-links">
                ${
                  project.url
                    ? `<a href="${project.url}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>`
                    : ""
                }
                ${
                  project.demoVideo
                    ? `<a href="${project.demoVideo}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i> Demo Video</a>`
                    : ""
                }
                ${
                  project.toolLink
                    ? `<a href="${project.toolLink}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fas fa-tools"></i> Tool</a>`
                    : ""
                }
                ${
                  project.frontendRepo
                    ? `<a href="${project.frontendRepo}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Frontend</a>`
                    : ""
                }
                ${
                  project.backendRepo
                    ? `<a href="${project.backendRepo}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Backend</a>`
                    : ""
                }
                ${
                  project.githubRepo
                    ? `<a href="${project.githubRepo}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>`
                    : ""
                }
            </div>
        `;
    projectsGrid.appendChild(card);
  });

  // Skills Section
  const skillsContainer = document.getElementById("skillsContainer");

  // Icon mapping for skills
  const skillIconMap = {
    Angular: "fab fa-angular",
    "Ember.js": "fab fa-ember",
    "Vue.js": "fab fa-vuejs",
    React: "fab fa-react",
    JavaScript: "fab fa-js-square",
    TypeScript: "fab fa-js-square",
    HTML5: "fab fa-html5",
    CSS3: "fab fa-css3-alt",
    SCSS: "fab fa-sass",
    "Tailwind CSS": "fas fa-wind",
    Bootstrap: "fab fa-bootstrap",
    "Angular Material": "fab fa-angular",
    NgRx: "fab fa-angular",
    Redux: "fab fa-react",
    RxJS: "fab fa-js-square",
    "RESTful APIs": "fas fa-code",
    Golang: "fa-brands fa-golang",
    "Node.js": "fab fa-node-js",
    "Express.js": "fab fa-node-js",
    MongoDB: "fas fa-database",
    Jasmine: "fas fa-vial",
    Jest: "fas fa-vial",
    Docker: "fab fa-docker",
    Observability: "fas fa-chart-line",
    Accessibility: "fas fa-universal-access",
    Nomad: "fas fa-server",
  };

  // Get all skills from JSON
  portfolioData.skills.forEach((skill) => {
    const skillItem = document.createElement("div");
    skillItem.className = "skill-item";
    const icon = skillIconMap[skill] || "fas fa-code";
    skillItem.innerHTML = `<i class="${icon}"></i><span>${skill}</span>`;
    skillsContainer.appendChild(skillItem);
  });

  // Education Section
  const educationCards = document.getElementById("educationCards");
  portfolioData.education.forEach((edu) => {
    const card = document.createElement("div");
    card.className = "info-card";
    let gradeInfo = "";
    if (edu.cgpa) {
      gradeInfo = `CGPA: ${edu.cgpa}`;
    } else if (edu.percentage) {
      gradeInfo = `Percentage: ${edu.percentage}`;
    }
    card.innerHTML = `
            <div class="info-card-icon"><i class="fas fa-graduation-cap"></i></div>
            <div class="info-card-title">${edu.degree}</div>
            <div class="info-card-subtitle">${edu.institution}</div>
            <div class="info-card-text">${edu.year}${gradeInfo ? ` • ${gradeInfo}` : ""}</div>
        `;
    educationCards.appendChild(card);
  });


  // Publications Section
  const publicationsCards = document.getElementById("publicationsCards");
  portfolioData.publications.forEach((pub) => {
    const card = document.createElement("div");
    card.className = "info-card";
    card.innerHTML = `
            <div class="info-card-icon"><i class="fas fa-book"></i></div>
            <div class="info-card-title">${pub.title}</div>
            <div class="info-card-subtitle">${pub.publisher}</div>
            <a href="${pub.link}" class="info-card-link" target="_blank" rel="noopener noreferrer">
                Read Publication <i class="fas fa-external-link-alt"></i>
            </a>
        `;
    publicationsCards.appendChild(card);
  });

  // Blog Section
  if (portfolioData.blogs && portfolioData.blogs.length > 0) {
    const blog = portfolioData.blogs[0];
    const blogTitle = document.getElementById("blogTitle");
    const blogDescription = document.getElementById("blogDescription");
    const blogLink = document.getElementById("blogLink");
    
    if (blogTitle) blogTitle.textContent = blog.platform;
    if (blogDescription) blogDescription.textContent = blog.description;
    if (blogLink && blog.url) {
      blogLink.href = blog.url;
      blogLink.setAttribute("href", blog.url);
      // Ensure the link opens correctly
      blogLink.addEventListener("click", function(e) {
        // The href should handle it, but this ensures it works
        if (!blogLink.href || blogLink.href === "#" || blogLink.href === window.location.href) {
          e.preventDefault();
          if (blog.url) {
            window.open(blog.url, "_blank", "noopener,noreferrer");
          }
        }
      });
    }
  }

  // Contact Section
  document.getElementById("contactEmail").textContent =
    portfolioData.contact.email;
  document.getElementById("contactPhone").textContent =
    portfolioData.contact.phone;
  document.getElementById("contactLocation").textContent =
    portfolioData.location;

  const contactSocialIcons = document.getElementById("contactSocialIcons");
  Object.entries(portfolioData.contact.social).forEach(([platform, url]) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "social-icon";
    const iconMap = {
      linkedin: "fab fa-linkedin",
      github: "fab fa-github",
      medium: "fab fa-medium",
      instagram: "fab fa-instagram",
    };
    link.innerHTML = `<i class="${iconMap[platform]}"></i>`;
    link.setAttribute("aria-label", platform);
    contactSocialIcons.appendChild(link);
  });

  // Footer
  document.getElementById("footerTagline").textContent =
    portfolioData.footer.tagline;
  document.getElementById("footerCopyright").textContent =
    portfolioData.footer.copyright;

}

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const navHeight = document.querySelector("nav").offsetHeight;
      const targetPosition = target.offsetTop - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById("scrollToTop");
const contactSection = document.getElementById("contact");

function toggleScrollToTop() {
  if (contactSection) {
    const contactSectionTop = contactSection.offsetTop;
    const scrollPosition = window.scrollY + window.innerHeight;
    
    // Show button when contact section is in view or scrolled past it
    if (scrollPosition >= contactSectionTop) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  }
}

// Scroll to top functionality
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Show/hide button on scroll
window.addEventListener("scroll", toggleScrollToTop);
window.addEventListener("resize", toggleScrollToTop);

// Custom Cursor
const customCursor = document.getElementById("customCursor");
let cursorX = 0;
let cursorY = 0;
let currentX = 0;
let currentY = 0;

if (customCursor) {
  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  // Smooth cursor animation
  function animateCursor() {
    currentX += (cursorX - currentX) * 0.1;
    currentY += (cursorY - currentY) * 0.1;
    customCursor.style.left = currentX + "px";
    customCursor.style.top = currentY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effects - use event delegation for dynamically loaded content
  document.addEventListener("mouseover", (e) => {
    const target = e.target;
    if (target.matches("a, button, .btn, .social-icon, .project-link, .info-card-link, .theme-toggle")) {
      customCursor.classList.add("hover");
    }
  });

  document.addEventListener("mouseout", (e) => {
    const target = e.target;
    if (target.matches("a, button, .btn, .social-icon, .project-link, .info-card-link, .theme-toggle")) {
      customCursor.classList.remove("hover");
    }
  });
}

// Initialize
createCodeBackground();
loadPortfolioData();
