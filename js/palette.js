// Command palette: a native <dialog> holding an ARIA combobox and listbox.
const ARROW = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const DOWN = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

export default function init({ motion, loadDemo }) {
  const jump = (id, focusSel) => () => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: motion.reduced() ? "auto" : "smooth", block: "start" })
    const demo = focusSel && document.querySelector(focusSel)
    if (demo) {
      const focus = () => demo.focus({ preventScroll: true })
      demo.closest("[data-demo]") ? loadDemo(demo.closest("[data-demo]")).then(focus) : focus()
    }
    history.replaceState(null, "", "#" + id)
  }
  const open = (url) => () => window.open(url, "_blank", "noopener")

  const commands = [
    { group: "Play", label: "Convert an image to WebP", hint: "DropCove", run: jump("dropcove", "#dc-notch"), keys: "drop notch webp image compress resize" },
    { group: "Play", label: "Log “5.75 for coffee”", hint: "Linaw", run: jump("linaw", "#ln-input"), keys: "voice money expense speak" },
    { group: "Play", label: "Run tortui --demo", hint: "tortui", run: jump("tortui", "#tt-term"), keys: "terminal torrent search cli" },
    { group: "Play", label: "Start a workout timer", hint: "Liftrix", run: jump("liftrix", "#lx-start"), keys: "amrap emom for time clock" },
    { group: "Go to", label: "DropCove", hint: "#dropcove", run: jump("dropcove"), icon: DOWN },
    { group: "Go to", label: "Liftrix", hint: "#liftrix", run: jump("liftrix"), icon: DOWN },
    { group: "Go to", label: "Linaw", hint: "#linaw", run: jump("linaw"), icon: DOWN },
    { group: "Go to", label: "tortui", hint: "#tortui", run: jump("tortui"), icon: DOWN },
    { group: "Go to", label: "Capabilities", hint: "#capabilities", run: jump("capabilities"), icon: DOWN },
    { group: "Open", label: "dropcoveapp.com", run: open("https://dropcoveapp.com"), icon: ARROW, keys: "dropcove site" },
    { group: "Open", label: "liftrix.app", run: open("https://liftrix.app"), icon: ARROW, keys: "liftrix site" },
    { group: "Open", label: "linaw.app", run: open("https://linaw.app"), icon: ARROW, keys: "linaw site" },
    { group: "Open", label: "tortui on GitHub", run: open("https://github.com/kdta91/tortui"), icon: ARROW, keys: "repo source" },
    { group: "Open", label: "YouTube: @kristoffbuilds", run: open("https://www.youtube.com/@kristoffbuilds"), icon: ARROW, keys: "video channel" },
    { group: "Open", label: "Links page", hint: "/links/", run: () => (location.href = "links/"), keys: "bio linktree" },
    { group: "Contact", label: "Start a conversation on GitHub", hint: "github.com/kdta91", run: open("https://github.com/kdta91"), icon: ARROW, keys: "contact hire email message" },
    { group: "Page", label: "Copy link to this page", run: copyLink, keys: "share url clipboard" },
    { group: "Page", label: "", dynamic: () => (motion.reduced() ? "Turn motion back on" : "Reduce motion"), run: () => announce(motion.toggle() ? "Motion reduced" : "Motion on"), keys: "animation accessibility reduce motion" },
  ]

  const dialog = document.createElement("dialog")
  dialog.className = "palette"
  dialog.setAttribute("aria-label", "Command palette")
  dialog.innerHTML = `
    <div class="palette-field">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input id="palette-input" type="text" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Jump, play or open…" aria-label="Search commands" />
      <kbd>esc</kbd>
    </div>
    <ul id="palette-list" role="listbox" aria-label="Commands"></ul>
    <p class="palette-foot" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> run</span><span><kbd>esc</kbd> close</span></p>
    <p class="sr-only" aria-live="polite" id="palette-status"></p>`
  document.body.appendChild(dialog)

  const input = dialog.querySelector("input")
  const list = dialog.querySelector("ul")
  const status = dialog.querySelector("#palette-status")
  let shown = []
  let active = 0
  let opener = null

  function announce(text) {
    const live = document.getElementById("page-status")
    if (live) {
      live.textContent = ""
      setTimeout(() => (live.textContent = text), 50)
    }
  }

  function copyLink() {
    const url = location.origin + location.pathname
    const done = () => announce("Link copied")
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => announce("Couldn't copy: " + url))
    else announce("Copy this link: " + url)
  }

  // Substring in the label first, then any word of the group, hint or keywords starting with the query.
  const score = (text, q) => {
    if (!q) return 1
    text = text.toLowerCase()
    if (text.includes(q)) return 100 - text.indexOf(q)
    return text.split(/[\s#/.:@-]+/).some((w) => w.startsWith(q)) ? 20 : 0
  }

  function render() {
    const q = input.value.trim().toLowerCase()
    shown = commands
      .map((c) => ({ c, label: c.dynamic ? c.dynamic() : c.label }))
      .map((x) => ({ ...x, s: Math.max(score(x.label, q), score(`${x.c.group} ${x.c.hint || ""} ${x.c.keys || ""}`, q) / 2) }))
      .filter((x) => x.s > 0)
    if (q) shown.sort((a, b) => b.s - a.s)
    active = Math.min(active, Math.max(shown.length - 1, 0))
    let lastGroup = ""
    list.innerHTML = shown.length
      ? shown
          .map((x, i) => {
            const head = !q && x.c.group !== lastGroup ? `<li role="presentation" class="palette-group">${x.c.group}</li>` : ""
            lastGroup = x.c.group
            return `${head}<li role="option" id="pc-${i}" data-i="${i}" aria-selected="${i === active}"><span>${x.label}</span>${
              x.c.hint ? `<span class="palette-hint">${x.c.hint}</span>` : ""
            }${x.c.icon || ""}</li>`
          })
          .join("")
      : `<li class="palette-empty" role="presentation">No command matches “${input.value.replace(/[<&]/g, "")}”</li>`
    if (shown.length) input.setAttribute("aria-activedescendant", `pc-${active}`)
    else input.removeAttribute("aria-activedescendant")
    status.textContent = `${shown.length} command${shown.length === 1 ? "" : "s"}`
    const el = list.querySelector('[aria-selected="true"]')
    if (el) el.scrollIntoView({ block: "nearest" })
  }

  const run = (i) => {
    const x = shown[i]
    if (!x) return
    dialog.close()
    x.c.run()
  }

  input.addEventListener("input", () => {
    active = 0
    render()
  })
  input.addEventListener("keydown", (e) => {
    if (e.isComposing) return
    if (e.key === "ArrowDown") active = (active + 1) % Math.max(shown.length, 1)
    else if (e.key === "ArrowUp") active = (active - 1 + shown.length) % Math.max(shown.length, 1)
    else if (e.key === "Home") active = 0
    else if (e.key === "End") active = shown.length - 1
    else if (e.key === "Enter") return e.preventDefault(), run(active)
    else return
    e.preventDefault()
    render()
  })
  list.addEventListener("click", (e) => {
    const li = e.target.closest("[data-i]")
    if (li) run(+li.dataset.i)
  })
  list.addEventListener("pointermove", (e) => {
    const li = e.target.closest("[data-i]")
    if (li && +li.dataset.i !== active) {
      active = +li.dataset.i
      list.querySelectorAll("[aria-selected]").forEach((o) => o.setAttribute("aria-selected", o === li))
      input.setAttribute("aria-activedescendant", li.id)
    }
  })
  // A click on the backdrop closes it.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close()
  })
  dialog.addEventListener("close", () => {
    if (opener && document.contains(opener) && document.activeElement === document.body) opener.focus()
  })

  return {
    open() {
      if (dialog.open) return input.focus()
      opener = document.activeElement
      input.value = ""
      active = 0
      render()
      dialog.showModal()
      input.focus()
    },
  }
}
