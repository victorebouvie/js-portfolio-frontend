const apiUrl = 'https://python-portfolio-api.onrender.com'

async function fetchAndDisplayProjects() {
    try{
        const response = await fetch(apiUrl)
        const projects = await response.json()
        const container = document.getElementById('projects-container')
        container.innerHTML = ''

        projects.forEach(project =>{
        const projectCard = document.createElement('article')
        projectCard.className = 'project-card'

        projectCard.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="technologies">
            ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
        </div>
        <div class="project-links">
            <a href="${project.github_url}" target="_blank">See in GitHub</a>
        </div>
        `
        container.appendChild(projectCard)
    })
    } catch (error){
        console.error("Error trying to search projects")
        const container = document.getElementById('projects-container')
        container.innerHTML = '<p>It was not possible load the projects, try again later.</p>'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn')
    const mainNav = document.querySelector('.main-nav')

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('is-active')
            hamburgerBtn.classList.toggle('is-active')
        })
    }
})

fetchAndDisplayProjects()