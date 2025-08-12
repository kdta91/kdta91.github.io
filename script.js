// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("navigation")
  const mobileMenuToggle = document.getElementById("mobileMenuToggle")
  const mobileMenu = document.getElementById("mobileMenu")
  const hamburgerIcon = mobileMenuToggle.querySelector(".hamburger-icon")
  const closeIcon = mobileMenuToggle.querySelector(".close-icon")
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")
  const navLinks = document.querySelectorAll(".nav-link")

  // Handle scroll effect on navigation
  function handleScroll() {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled")
    } else {
      nav.classList.remove("scrolled")
    }
  }

  // Handle mobile menu toggle
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains("open")

    if (isOpen) {
      mobileMenu.classList.remove("open")
      hamburgerIcon.style.display = "block"
      closeIcon.style.display = "none"
    } else {
      mobileMenu.classList.add("open")
      hamburgerIcon.style.display = "none"
      closeIcon.style.display = "block"
    }
  }

  // Handle mobile menu link clicks
  function handleMobileMenuClick(href) {
    // Close mobile menu
    mobileMenu.classList.remove("open")
    hamburgerIcon.style.display = "block"
    closeIcon.style.display = "none"

    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  // Event listeners
  window.addEventListener("scroll", handleScroll)
  mobileMenuToggle.addEventListener("click", toggleMobileMenu)

  // Mobile navigation links
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const href = this.getAttribute("data-href")
      handleMobileMenuClick(href)
    })
  })

  // Desktop navigation links (smooth scrolling)
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const href = this.getAttribute("href")
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    })
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open")
      hamburgerIcon.style.display = "block"
      closeIcon.style.display = "none"
    }
  })

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      mobileMenu.classList.remove("open")
      hamburgerIcon.style.display = "block"
      closeIcon.style.display = "none"
    }
  })
})
