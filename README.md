# Dynamic Portfolio Frontend (JavaScript)

![HTML5](https://img.shields.io/badge/Language-HTML5-orange?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/Style-CSS3-blue?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow?style=for-the-badge&logo=javascript)

A modern, responsive, and single-page portfolio frontend built with vanilla JavaScript to consume a RESTful API and dynamically display projects.

---

![Preview](https://s1.ezgif.com/tmp/ezgif-1bf71e3133e4c3.gif)

---

## 📋 Table of Contents

*   [About The Project](#-about-the-project)
*   [Key Features](#-key-features)
*   [Architecture](#️-architecture-how-it-works)
*   [Getting Started](#-getting-started)
*   [Configuration](#️-configuration)

---

## 📖 About The Project

This project is a dynamic, single-page application (SPA) portfolio frontend, built with pure JavaScript. It was designed to be lightweight and performant, consuming data from a Flask RESTful API to display projects in real-time. The interface is clean, fully responsive, and provides a modern user experience, including a dark mode and subtle animations, demonstrating advanced DOM manipulation and asynchronous communication with a backend.

---

## ✨ Key Features

*   ✅ **Dynamic Content via API**: Projects are not hard-coded; they are loaded dynamically from an API endpoint, making portfolio updates instant without needing to redeploy the frontend.
*   ✅ **Server "Wake-Up" Logic**: Includes a visual feedback mechanism and retry logic to handle the initial boot time of APIs hosted on free-tier services (like Render).
*   ✅ **Dark Mode**: Features a theme switcher that toggles between light and dark modes, saving the user's preference in the browser's `localStorage`.
*   ✅ **Fully Responsive Design**: The interface seamlessly adapts to any screen size, from desktops to mobile devices, using a hamburger menu for mobile navigation.
*   ✅ **Functional Contact Form**: A contact form that submits data to an API endpoint, complete with frontend email validation and a cooldown timer to prevent spam.
*   ✅ **Scroll Animations**: Elements smoothly fade into view as the user scrolls, utilizing the `Intersection Observer API` for optimal performance.

---

## ⚙️ Architecture (How It Works)

The project is structured with a clear separation of concerns, even while being built with vanilla technologies:

1.  **`HTML (index.html)`**: Provides the semantic structure and skeleton for all content. It contains the placeholders where dynamic data will be injected.
2.  **`CSS (style.css)`**: Responsible for all styling, the responsive layout, the dark theme, and animations. The class-based structure allows for easy style manipulation via JavaScript.
3.  **`JavaScript (script.js)`**: The "brain" of the project. Organized into a single `App` object, it manages:
    *   **Application State**: Such as the current theme or loading status.
    *   **API Calls**: Uses the `Fetch API` to retrieve project data and send contact form messages.
    *   **DOM Manipulation**: Renders the project cards, updates the theme icon, and displays status messages.
    *   **Event Handling**: Listens for user clicks (menu, theme) and form submissions.

The data flow is unidirectional:
**External API** → **Fetch (JavaScript)** → **DOM Manipulation** → **Render (HTML/CSS)**

---

## 🚀 Getting Started

To run this project locally, follow the steps below.

1.  Clone the repository to your machine:
    ```sh
    git clone https://github.com/victorebouvie/js-portfolio-frontend
    ```
2.  Navigate into the project directory:
    ```sh
    cd your-frontend-repo
    ```
3.  Because the project makes `fetch` requests to an API, opening it directly as a file (`file://`) may cause CORS errors. The best way to run it is with a local server.
    *   If you use **Visual Studio Code**, you can install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and click "Go Live" in the bottom-right corner.
    *   Alternatively, if you have Python installed, you can run a simple server with the command:
        ```sh
        # For Python 3
        python -m http.server
        ```
    *   Open your browser and navigate to `http://localhost:8000`.

---

## 🛠️ Configuration

The main project configuration can be found at the top of the `js/script.js` file, inside the `App.config` object.

*   **API URL**: To point the frontend to your own backend, simply change the `apiBaseUrl` variable:
    ```javascript
    // Inside js/script.js
    const App = {
      config: {
        apiBaseUrl: 'https://your-api.onrender.com', // Change this line
        // ... other settings
      },
    // ...
    ```
