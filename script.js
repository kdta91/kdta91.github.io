document.addEventListener("DOMContentLoaded", () => {
  const masthead = document.getElementById("masthead")
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const themeMeta = document.querySelector('meta[name="theme-color"]')

  // Masthead: the full name condenses to initials once the page scrolls.
  const onScroll = () => masthead.classList.toggle("condensed", window.scrollY > 40)
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()

  // Worlds: the masthead takes on the palette of the band passing beneath it.
  const bands = document.querySelectorAll("main [data-theme]")
  const setWorld = (theme) => {
    if (masthead.dataset.theme === theme) return
    masthead.dataset.theme = theme
    if (themeMeta) themeMeta.content = getComputedStyle(masthead).getPropertyValue("--bg").trim()
  }
  const worldObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setWorld(entry.target.dataset.theme)
      })
    },
    { rootMargin: "0px 0px -94% 0px" }
  )
  bands.forEach((band) => worldObserver.observe(band))

  // Loops: play only while on screen, and never on their own under reduced motion.
  const videos = document.querySelectorAll("video.loop")
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting && !reduceMotion.matches && !target.dataset.userPaused) {
          target.play().catch(() => {})
        } else {
          target.pause()
        }
      })
    },
    { threshold: 0.25 }
  )
  const PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>'
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>'

  videos.forEach((video) => {
    videoObserver.observe(video)

    // A visible, keyboard-reachable control for every loop.
    const figure = video.closest("figure")
    figure.classList.add("media")
    const toggle = document.createElement("button")
    toggle.type = "button"
    toggle.className = "loop-toggle"
    figure.appendChild(toggle)

    const sync = () => {
      const playing = !video.paused
      toggle.innerHTML = playing ? PAUSE : PLAY
      toggle.setAttribute("aria-label", (playing ? "Pause " : "Play ") + (video.getAttribute("aria-label") || "video"))
    }
    video.addEventListener("play", sync)
    video.addEventListener("pause", sync)
    sync()

    // In the hero one control runs both phones; elsewhere each loop has its own.
    const stage = video.closest(".hero-stage")
    const group = stage ? [...stage.querySelectorAll("video.loop")] : [video]
    const flip = () => {
      const resume = video.paused
      group.forEach((v) => {
        if (resume) {
          delete v.dataset.userPaused
          v.play().catch(() => {})
        } else {
          v.dataset.userPaused = "true"
          v.pause()
        }
      })
    }
    toggle.addEventListener("click", flip)
    video.addEventListener("click", flip)
  })
})
