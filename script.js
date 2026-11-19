// ── Now: one object, edit it to update the strip near the top ───────────
const NOW = [
  { tag: "Shipped", text: "DropCove 1.2.2", detail: "2026-11-18", href: "#dropcove" },
  { tag: "Next", text: "Launching on Product Hunt", detail: "Dec 1" },
  { tag: "Watch", text: "The new DropCove demo", href: "https://youtu.be/LQPvZWMQlDQ" },
  { tag: "Follow", text: "@kristoffbuilds on YouTube", href: "https://www.youtube.com/@kristoffbuilds" },
]

// Motion: the visitor's choice (command palette) wins over the system setting.
const motion = (() => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  const listeners = new Set()
  let choice = null
  try {
    choice = localStorage.getItem("motion")
  } catch (_) {}
  const reduced = () => (choice ? choice === "reduce" : query.matches)
  const apply = () => {
    document.documentElement.dataset.motion = reduced() ? "reduce" : "full"
    listeners.forEach((fn) => fn(reduced()))
  }
  query.addEventListener("change", apply)
  apply()
  return {
    reduced,
    onChange: (fn) => listeners.add(fn),
    toggle() {
      choice = reduced() ? "full" : "reduce"
      try {
        localStorage.setItem("motion", choice)
      } catch (_) {}
      apply()
      return reduced()
    },
  }
})()

document.addEventListener("DOMContentLoaded", () => {
  const masthead = document.getElementById("masthead")
  const themeMeta = document.querySelector('meta[name="theme-color"]')

  // Masthead: the full name condenses to initials once the page scrolls.
  const onScroll = () => masthead.classList.toggle("condensed", window.scrollY > 40)
  window.addEventListener("scroll", onScroll, { passive: true })
  onScroll()

  // Worlds: the masthead takes on the palette of the band passing beneath it.
  const bands = document.querySelectorAll("main [data-theme]:not(.hero-latest)")
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

  // Now strip.
  const now = document.getElementById("now-list")
  if (now) {
    now.innerHTML = NOW.map((item) => {
      const external = item.href && !item.href.startsWith("#")
      const body = `<span class="now-tag">${item.tag}</span><span class="now-text">${item.text}${
        item.detail ? ` <span class="now-detail">${item.detail}</span>` : ""
      }</span>`
      if (!item.href) return `<li>${body}</li>`
      return `<li><a href="${item.href}"${external ? ' target="_blank" rel="noopener"' : ""}>${body}${
        external ? '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="sr-only"> (opens in a new tab)</span>' : ""
      }</a></li>`
    }).join("")
  }

  // Loops: play only while on screen, and never on their own under reduced motion.
  const videos = document.querySelectorAll("video.loop")
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        target.dataset.visible = isIntersecting ? "1" : ""
        if (isIntersecting && !motion.reduced() && !target.dataset.userPaused) {
          target.play().catch(() => {})
        } else {
          target.pause()
        }
      })
    },
    { threshold: 0.25 }
  )
  motion.onChange((reduced) => {
    videos.forEach((v) => {
      if (reduced) v.pause()
      else if (v.dataset.visible && !v.dataset.userPaused) v.play().catch(() => {})
    })
  })
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

    const flip = () => {
      if (video.paused) {
        delete video.dataset.userPaused
        video.play().catch(() => {})
      } else {
        video.dataset.userPaused = "true"
        video.pause()
      }
    }
    toggle.addEventListener("click", flip)
    video.addEventListener("click", flip)
  })

  // Demos: each band's playground loads only when the band comes near.
  const demos = new Map()
  const loadDemo = (el) => {
    if (!demos.has(el)) {
      demos.set(
        el,
        import(`./js/${el.dataset.demo}.js`)
          .then((mod) => mod.default(el, { motion }))
          .catch((err) => {
            el.dataset.failed = "true"
            console.error(err)
          })
      )
    }
    return demos.get(el)
  }
  const demoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return
        demoObserver.unobserve(target)
        loadDemo(target)
      })
    },
    { rootMargin: "400px 0px" }
  )
  document.querySelectorAll("[data-demo]").forEach((el) => demoObserver.observe(el))

  // Command palette: ⌘K / Ctrl+K, or the masthead button.
  let palette
  const loadPalette = () =>
    (palette =
      palette ||
      import("./js/palette.js")
        .then((mod) => mod.default({ motion, loadDemo }))
        .catch((err) => {
          palette = null // a failed load (offline, say) can be retried
          throw err
        }))
  const openPalette = () => loadPalette().then((p) => p.open(), () => {})
  // Warm the palette once the page is idle, so a fast ⌘K never drops keystrokes.
  ;(window.requestIdleCallback || setTimeout)(() => loadPalette().catch(() => {}))
  document.querySelectorAll("[data-palette-open]").forEach((b) => b.addEventListener("click", openPalette))
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === "k") {
      e.preventDefault()
      openPalette()
    }
  })
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  document.querySelectorAll(".kbd-mod").forEach((k) => (k.textContent = isMac ? "⌘" : "Ctrl"))
})
