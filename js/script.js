const App = {
  config: {
    apiBaseUrl: 'https://python-portfolio-api-f3x7.onrender.com',
    maxRetries: 15,
    retryDelay: 3000,
  },
  
  dom: {
    projectsContainer: null,
    loader: null,
    hamburgerBtn: null,
    mainNav: null,
    themeSwitch: null,
    body: null,
    contactForm: null,
    formStatus: null,
    submitBtn: null,
    dotsInterval: null,
  },

  init() {
    this.cacheDomElements();
    this.setupEventListeners();
    this.loadTheme();
    this.fetchProjectsWithRetry();
  },

  cacheDomElements() {
    this.dom.projectsContainer = document.getElementById('projects-container');
    this.dom.loader = document.getElementById('loader')
    this.dom.hamburgerBtn = document.getElementById('hamburger-btn');
    this.dom.mainNav = document.querySelector('.main-nav');
    this.dom.themeSwitch = document.getElementById('theme-change');
    this.dom.body = document.body;
    this.dom.contactForm = document.getElementById('contact-form');
    this.dom.formStatus = document.getElementById('form-status');
    this.dom.submitBtn = document.getElementById('submit-btn');
  },

  setupEventListeners() {
    if (this.dom.hamburgerBtn && this.dom.mainNav) {
      this.dom.hamburgerBtn.addEventListener('click', this.toggleMenu.bind(this));
    }
    if (this.dom.themeSwitch) {
      this.dom.themeSwitch.addEventListener('click', this.toggleTheme.bind(this));
    }
    if (this.dom.contactForm) {
      this.dom.contactForm.addEventListener('submit', this.handleContactFormSubmit.bind(this));
    }
  },

  toggleMenu() {
    this.dom.mainNav.classList.toggle('is-active');
    this.dom.hamburgerBtn.classList.toggle('is-active');
  },

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.dom.body.classList.add('dark-mode');
    }
    this.updateThemeIcon();
  },

  toggleTheme() {
    this.dom.body.classList.toggle('dark-mode');
    const isDarkMode = this.dom.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    this.updateThemeIcon();
    this.dom.themeSwitch.classList.add('shake');
    setTimeout(() => {
      this.dom.themeSwitch.classList.remove('shake');
    }, 400);
  },

  updateThemeIcon() {
    const isDarkMode = this.dom.body.classList.contains('dark-mode');
    this.dom.themeSwitch.textContent = isDarkMode ? '☀️' : '🌙';
  },

  startDotsAnimation() {
    const dotSpan = document.getElementById('dots')

    let dotCount = 1

    this.dotsInterval = setInterval(() => {
        dotCount = (dotCount % 3) + 1
        dotSpan.textContent = '.'.repeat(dotCount)
    }, 500)
  },

  stopDotsAnimation() {
    clearInterval(this.dotsInterval)
    this.dotsInterval = null
  },

  renderLoading(show = true) {
    if (this.dom.loader) {
        this.dom.loader.style.display = show ? 'block' : 'none'
    }

    if (show) {
        this.startDotsAnimation()
    } else{
        this.stopDotsAnimation()
    }
  },

  createProjectCardHTML(project) {
    return `
      <h3>${project.name}</h3>
      <p>${project.description}</p>
      <div class="technologies">
        ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
      </div>
      <div class="project-links">
        <a href="${project.github_url}" target="_blank">See in GitHub</a>
      </div>
    `;
  },

  renderProjects(projects) {
    this.renderLoading(false)
    this.dom.projectsContainer.innerHTML = '';
    projects.forEach(project => {
      const projectCard = document.createElement('article');
      projectCard.className = 'project-card';
      projectCard.innerHTML = this.createProjectCardHTML(project);
      this.dom.projectsContainer.appendChild(projectCard);
    });
  },

  renderError(message) {
    this.renderLoading(false)
    this.dom.projectsContainer.innerHTML = `<p>${message}</p>`;
  },

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  async fetchProjectsWithRetry() {
    this.renderLoading(true)

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
        try {
            const response = await fetch(`${this.config.apiBaseUrl}/api/projects`)
            if (!response.ok) {
                throw new Error (`HTTP error! status: ${response.status}`)
            }
            const projects = await response.json()
            this.renderProjects(projects)
            return
        }catch (error) {
            console.warn(`Fetch attempt ${attempt} failed:`, error.message)
            if (attempt === this.config.maxRetries) {
                console.error("All fetch attempts failed.")
                this.renderError('It was not possible to load the projects. Please try refreshing the page later.')
                break
            }
            await this.wait(this.config.retryDelay)
        }
    }
  },

  async handleContactFormSubmit(event) {
    event.preventDefault();
    this.dom.submitBtn.disabled = true;
    this.dom.submitBtn.textContent = 'Sending...';

    const formData = {
      name: this.dom.contactForm.elements.name.value,
      email: this.dom.contactForm.elements.email.value,
      message: this.dom.contactForm.elements.message.value,
    };

    try {
      const response = await fetch(`${this.config.apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (response.ok) {
        this.dom.formStatus.textContent = result.message;
        this.dom.formStatus.style.color = 'green';
        this.dom.contactForm.reset();
      } else {
        throw new Error(result.error || 'An error occurred');
      }
    } catch (error) {
      this.dom.formStatus.textContent = error.message || 'Connection error, try again.';
      this.dom.formStatus.style.color = 'red';
    } finally {
      this.dom.submitBtn.disabled = false;
      this.dom.submitBtn.textContent = 'Send Message';
    }
  },
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});