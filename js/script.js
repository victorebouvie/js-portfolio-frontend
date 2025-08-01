const App = {
  config: {
    apiBaseUrl: 'https://python-portfolio-api-f3x7.onrender.com',
    maxRetries: 15,
    retryDelay: 3000,
    contactFormCooldown: 2 * 60 * 1000,
    statusMessageDuration: 5000,
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
    dots: null,
    dotsInterval: null,
    statusTimeoutId: null,
  },

  init() {
    this.cacheDomElements()
    this.setupEventListeners()
    this.loadTheme()
    this.fetchProjectsWithRetry()
  },

  cacheDomElements() {
    this.dom.projectsContainer = document.getElementById('projects-container')
    this.dom.loader = document.getElementById('loader')
    this.dom.hamburgerBtn = document.getElementById('hamburger-btn')
    this.dom.mainNav = document.querySelector('.main-nav')
    this.dom.themeSwitch = document.getElementById('theme-change')
    this.dom.body = document.body
    this.dom.contactForm = document.getElementById('contact-form')
    this.dom.formStatus = document.getElementById('form-status')
    this.dom.submitBtn = document.getElementById('submit-btn')
    this.dom.dots = document.getElementById('dots')
  },

  setupEventListeners() {
    if (this.dom.hamburgerBtn && this.dom.mainNav) {
      this.dom.hamburgerBtn.addEventListener('click', this.toggleMenu.bind(this))
    }
    if (this.dom.themeSwitch) {
      this.dom.themeSwitch.addEventListener('click', this.toggleTheme.bind(this))
    }
    if (this.dom.contactForm) {
      this.dom.contactForm.addEventListener('submit', this.handleContactFormSubmit.bind(this))
    }
  },

  toggleMenu() {
    this.dom.mainNav.classList.toggle('is-active')
    this.dom.hamburgerBtn.classList.toggle('is-active')
  },

  loadTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      this.dom.body.classList.add('dark-mode')
    }
    this.updateThemeIcon()
  },

  toggleTheme() {
    this.dom.body.classList.toggle('dark-mode')
    const isDarkMode = this.dom.body.classList.contains('dark-mode')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    this.updateThemeIcon()
    this.dom.themeSwitch.classList.add('shake')
    setTimeout(() => {
      this.dom.themeSwitch.classList.remove('shake')
    }, 400)
  },

  updateThemeIcon() {
    const isDarkMode = this.dom.body.classList.contains('dark-mode')
    this.dom.themeSwitch.textContent = isDarkMode ? '☀️' : '🌙'
  },

  startDotsAnimation() {
    if (!this.dom.dots) return
    let dotCount = 1
    this.dom.dotsInterval = setInterval(() => {
        dotCount = (dotCount % 3) + 1
        this.dom.dots.textContent = '.'.repeat(dotCount)
    }, 500)
  },

  stopDotsAnimation() {
    clearInterval(this.dom.dotsInterval)
    this.dom.dotsInterval = null
  },

  renderLoading(show = true) {
    if (this.dom.loader) {
      this.dom.loader.style.display = show ? 'block' : 'none'
    }
    if (show) {
      this.startDotsAnimation()
    } else {
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
    `
  },
  
  renderProjects(projects) {
    if (!this.dom.projectsContainer) return
    this.renderLoading(false)
    this.dom.projectsContainer.innerHTML = ''
    projects.forEach(project => {
      const projectCard = document.createElement('article')
      projectCard.className = 'project-card'
      projectCard.innerHTML = this.createProjectCardHTML(project)
      this.dom.projectsContainer.appendChild(projectCard)
    })
  },

  renderError(message) {
    if (!this.dom.projectsContainer) return
    this.renderLoading(false)
    this.dom.projectsContainer.innerHTML = `<p class="status-error">${message}</p>`
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
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const projects = await response.json()
        this.renderProjects(projects)
        this.setupAnimations()
        return
      } catch (error) {
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

  showStatusMessage(message, statusType) {
    if (this.dom.statusTimeoutId) {
      clearTimeout(this.dom.statusTimeoutId)
    }
    this.dom.formStatus.textContent = message
    this.dom.formStatus.className = 'form-status'
    this.dom.formStatus.classList.add(`status-${statusType}`)

    this.dom.statusTimeoutId = setTimeout(() => {
        this.dom.formStatus.textContent = ''
        this.dom.formStatus.className = 'form-status'
    }, this.config.statusMessageDuration)
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  async handleContactFormSubmit(event) {
    event.preventDefault()

    const lastSubmissionTime = localStorage.getItem('lastSubmissionTime')
    if (lastSubmissionTime && Date.now() - lastSubmissionTime < this.config.contactFormCooldown) {
      const remainingTime = Math.ceil((this.config.contactFormCooldown - (Date.now() - lastSubmissionTime)) / 60000)
      this.showStatusMessage(`Please wait ${remainingTime} more minute(s) before sending another message.`, 'warning')
      return
    }

    const emailValue = this.dom.contactForm.elements.email.value
    if (!this.isValidEmail(emailValue)) {
      this.showStatusMessage('Please enter a valid email address.', 'error')
      return
    }

    this.dom.submitBtn.disabled = true
    this.dom.submitBtn.textContent = 'Sending...'

    const formData = {
      name: this.dom.contactForm.elements.name.value,
      email: emailValue,
      message: this.dom.contactForm.elements.message.value,
    }

    try {
      const response = await fetch(`${this.config.apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await response.json()

      if (response.ok) {
        this.showStatusMessage(result.message, 'success')
        localStorage.setItem('lastSubmissionTime', Date.now())
        this.dom.contactForm.reset()
      } else {
        throw new Error(result.error || 'An error occurred')
      }
    } catch (error) {
      this.showStatusMessage(error.message || 'Connection error, try again.', 'error')
    } finally {
      this.dom.submitBtn.disabled = false
      this.dom.submitBtn.textContent = 'Send Message'
    }
  },

  setupAnimations() {
    this.triggerInitialAnimation()
  },

  triggerInitialAnimation() {
    const elements = document.querySelectorAll('.hidden-on-load')
    elements.forEach(el => {
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
        setTimeout(() => {
            el.classList.remove('hidden-on-load')
        }, 100)
    })
  },
}

document.addEventListener('DOMContentLoaded', () => {
  App.init()
})