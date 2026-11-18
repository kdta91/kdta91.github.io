// tortui: a keyboard-driven replica of `tortui --demo`. Synthetic data, no
// network: the rows mirror the repo's own demo fixtures.
const GLYPH = { other: "·", audio: "♪", video: "►", image: "▣", text: "≡", software: "⌘", data: "▤" }
const ROWS = [
  { title: "Regional Cloud Cover Dataset (1998-2024)", size: 1.4e9, s: 42, l: 3, cat: "data", age: "1d", src: "demo-archive" },
  { title: "Community Radio Broadcast Recordings Vol. 3", size: 780e6, s: 12, l: 1, cat: "audio", age: "3d", src: "demo-archive" },
  { title: "Open Firmware Toolchain Snapshot 2026.01", size: 2.1e9, s: 88, l: 6, cat: "software", age: "today", src: "demo-archive" },
  { title: "気象観測データセット・アーカイブ集成 全巻", size: 512e6, s: 25, l: 2, cat: "data", age: "7d", src: "demo-archive" },
  { title: "Space Mission Telemetry Archive, Complete Set", size: 96e6, s: 150, l: 20, cat: "data", age: "2d", src: "demo-archive" },
  { title: "Complete Regional Satellite Imagery Archive 2010-2026", size: 2.5e12, s: 9, l: 4, cat: "image", age: "1mo", src: "demo-archive" },
  { title: "Historical Weather Station Log Bundle", size: 63e6, s: 7, l: 1, cat: "data", age: "4d", src: "demo-mirror" },
  { title: "Mirror Index README", size: 512, s: 3, l: 0, cat: "text", age: "10d", src: "demo-mirror" },
  { title: "Archived Utility Collection Vol. 9 (unseeded)", size: 45e6, s: 0, l: 0, cat: "software", age: "6mo", src: "demo-mirror" },
]
const TABS = ["Search", "Results", "Details", "Downloads"]

const size = (n) => {
  const u = ["B", "KB", "MB", "GB", "TB"]
  let i = 0
  while (n >= 1000 && i < u.length - 1) (n /= 1000), i++
  return `${i ? n.toFixed(n < 10 ? 1 : 0) : n} ${u[i]}`
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])
const slug = (t) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "")
const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"

export default function init(root, { motion }) {
  const term = root.querySelector("#tt-term")
  const screen = root.querySelector(".tt-screen")
  const tabs = root.querySelector(".tt-tabs")
  const statusbar = root.querySelector(".tt-status")
  const live = root.querySelector(".tt-live")
  const form = root.querySelector(".tt-search")
  const input = root.querySelector("#tt-query")

  let tab = "Search"
  let query = ""
  let results = []
  let cursor = 0
  let downloads = [] // { row, done, paused, rate }
  let quitting = false
  let exited = false
  let timer = null
  let searching = null
  let flash = ""

  const say = (text) => {
    live.textContent = ""
    setTimeout(() => (live.textContent = text), 30)
  }

  function renderTabs() {
    tabs.innerHTML = TABS.map((t, i) => `<button type="button" class="tt-tab${t === tab ? " is-on" : ""}" data-tab="${t}"${t === tab ? ' aria-current="page"' : ""}>${t} [${i + 1}]</button>`).join('<span class="tt-dim" aria-hidden="true"> · </span>')
  }

  function bar(p, cells) {
    const full = Math.round(p * cells)
    return `<span class="tt-bar-fill">${"█".repeat(full)}</span><span class="tt-bar-rest">${"░".repeat(cells - full)}</span>`
  }

  function render() {
    renderTabs()
    form.hidden = tab !== "Search" || exited
    let html = ""
    if (exited) {
      html = `<p class="tt-dim">$ tortui --demo</p><p>Bye. Nothing was written outside the demo sandbox.</p><p class="tt-dim">[enter] run it again</p>`
    } else if (tab === "Search") {
      html = searching
        ? `<p><span class="tt-cyan">${motion.reduced() ? "…" : SPIN[searching.frame % SPIN.length]}</span> Searching 3 sources for “${esc(query || "everything")}”</p>`
        : `<p class="tt-dim">Try <button type="button" class="tt-link" data-q="archive">archive</button>, <button type="button" class="tt-link" data-q="weather">weather</button> or <button type="button" class="tt-link" data-q="firmware">firmware</button>. Enter on an empty query lists everything.</p>`
    } else if (tab === "Results") {
      if (!results.length) {
        html = query || searching === null ? `<p class="tt-dim">No results${query ? ` for “${esc(query)}”` : ""}. Press [1] or / to search.</p>` : ""
      } else {
        html = `<p class="tt-cyan">Search: “${esc(query)}”</p>
          <p class="tt-warn">1/3 sources failed: demo-flaky (tracker refused connection, demo fixture)</p>
          <div class="tt-table" role="presentation">
            <div class="tt-tr tt-th"><span>C</span><span>Title</span><span class="r">Size</span><span class="r">S/L</span><span class="r tt-age">Age</span><span class="tt-src">Source</span></div>
            ${results
              .map(
                (r, i) => `<div class="tt-tr${i === cursor ? " is-cursor" : ""}" data-row="${i}">
                <span>${GLYPH[r.cat]}</span><span class="tt-title">${esc(r.title)}</span><span class="r">${size(r.size)}</span><span class="r">${r.s}/${r.l}</span><span class="r tt-age">${r.age}</span><span class="tt-src">${r.src}</span></div>`
              )
              .join("")}
          </div>`
      }
    } else if (tab === "Details") {
      const r = results[cursor]
      html = r
        ? `<p class="tt-cyan tt-title-big">${esc(r.title)}</p>
          <dl class="tt-dl">
            <dt>Size</dt><dd>${size(r.size)}</dd>
            <dt>Seeders</dt><dd>${r.s}${r.s === 0 ? ' <span class="tt-warn">no seeders: it may never finish</span>' : ""}</dd>
            <dt>Leechers</dt><dd>${r.l}</dd>
            <dt>Category</dt><dd>${GLYPH[r.cat]} ${r.cat}</dd>
            <dt>Source</dt><dd>${r.src}</dd>
            <dt>Added</dt><dd>${r.age === "today" ? "today" : `${r.age} ago`}</dd>
          </dl>
          <p class="tt-dim">[a] add to downloads · [esc] back</p>`
        : `<p class="tt-dim">Pick a result first: [2] Results.</p>`
    } else if (tab === "Downloads") {
      const active = downloads.filter((d) => d.done < 1)
      const done = downloads.filter((d) => d.done >= 1)
      const item = (d) => {
        const total = Math.min(d.row.size, 4.7e9)
        return `<div class="tt-dl-item">
          <p class="${d.done >= 1 ? "" : "tt-cyan"}">${esc(slug(d.row.title))}</p>
          <p class="tt-progress">${bar(d.done, 20)} <span>${Math.floor(d.done * 100)}%</span> <span>${size(total * d.done)}/${size(total)}</span> <span class="tt-hide-sm">down ${d.paused || d.done >= 1 ? "0 B/s" : size(d.rate) + "/s"}</span> <span>ETA ${d.done >= 1 ? "done" : d.paused ? "paused" : !d.rate ? "∞" : Math.max(1, Math.round(((1 - d.done) * 100) / 12)) + "s"}</span></p>
          ${d.done < 1 && !d.rate ? '<p class="tt-warn">stalled: no seeders, 0 peers (demo fixture)</p>' : ""}
          <p class="tt-dim">${d.done >= 1 ? '<span class="tt-ok">seeding policy not reported by this engine</span>' : "[p]ause [x] remove"}</p>
        </div>`
      }
      html = downloads.length
        ? `${active.length ? `<p class="tt-dim">Active (${active.length})</p>${active.map(item).join("")}` : ""}${done.length ? `<p class="tt-dim">Completed (${done.length})</p>${done.map(item).join("")}` : ""}`
        : `<p class="tt-dim">No downloads yet. Open a result and press [a].</p>`
    }
    if (quitting) html += `<p class="tt-warn tt-quit">Quit tortui? ${downloads.some((d) => d.done < 1) ? "A download is still running. " : ""}[y] yes · [n] no</p>`
    screen.innerHTML = html
    const active = downloads.filter((d) => d.done < 1)
    statusbar.innerHTML = `<span>Downloads</span> <span class="tt-dim">${active.length} active</span> <span class="tt-dim tt-hide-sm">down ${size(active.reduce((a, d) => a + (d.paused ? 0 : d.rate), 0))}/s</span> ${
      flash ? `<span class="tt-cyan">${esc(flash)}</span>` : `<span class="tt-dim tt-hide-sm">[/] search [j/k] move [⏎] open [a] add [q] back</span>`
    }`
    const row = screen.querySelector(".is-cursor")
    if (row) row.scrollIntoView({ block: "nearest" })
  }

  function go(next) {
    tab = next
    quitting = false
    render()
    if (tab === "Search") input.focus()
    else if (!term.contains(document.activeElement) || document.activeElement === input || !document.activeElement.isConnected) term.focus()
    const r = results[cursor]
    say(
      tab === "Results"
        ? results.length
          ? `Results, ${results.length} for ${query || "everything"}. Row ${cursor + 1}: ${r.title}, ${size(r.size)}, ${r.s} seeders.`
          : "No results"
        : tab === "Details" && r
          ? `Details: ${r.title}. ${size(r.size)}, ${r.s} seeders, ${r.l} leechers, ${r.cat}. Press a to add.`
          : tab === "Downloads"
            ? `Downloads, ${downloads.length} item${downloads.length === 1 ? "" : "s"}`
            : tab
    )
  }

  function search(q) {
    query = q.trim()
    if (searching) clearInterval(searching.id), clearTimeout(searching.done)
    const job = { frame: 0 }
    searching = job
    // The suggestion that was clicked is about to be re-rendered away; keep the keys working.
    if (!term.contains(document.activeElement) || document.activeElement !== input) term.focus()
    render()
    say(`Searching for ${query || "everything"}`)
    job.id = setInterval(() => {
      job.frame++
      if (!motion.reduced()) render()
    }, 80)
    job.done = setTimeout(() => {
      clearInterval(job.id)
      if (searching !== job || exited) return
      searching = null
      const words = query.toLowerCase().split(/\s+/).filter(Boolean)
      results = ROWS.filter((r) => words.every((w) => `${r.title} ${r.cat}`.toLowerCase().includes(w))).sort((a, b) => b.s - a.s)
      cursor = 0
      go("Results")
    }, 650)
  }

  function move(d) {
    if (tab !== "Results" || !results.length) return
    cursor = Math.max(0, Math.min(results.length - 1, cursor + d))
    render()
    const r = results[cursor]
    say(`Row ${cursor + 1} of ${results.length}: ${r.title}, ${size(r.size)}, ${r.s} seeders, ${r.l} leechers`)
  }

  function add() {
    const r = results[cursor]
    if (tab !== "Details" || !r) return
    if (!downloads.some((d) => d.row === r)) downloads.unshift({ row: r, done: 0, paused: false, rate: r.s ? 1.4e6 + r.s * 9e3 : 0 })
    flash = `added ${r.title}`
    setTimeout(() => {
      flash = ""
      render()
    }, 3000)
    go("Downloads")
    tick()
  }

  function tick() {
    if (timer) return
    timer = setInterval(() => {
      let running = false
      downloads.forEach((d) => {
        if (d.done < 1 && !d.paused && d.rate) {
          d.done = Math.min(1, d.done + (motion.reduced() ? 0.1 : 0.025))
          running = true
          if (d.done >= 1) say(`${d.row.title} finished`)
        }
      })
      if (tab === "Downloads") render()
      if (!running) {
        clearInterval(timer)
        timer = null
        if (tab !== "Downloads") render()
      }
    }, motion.reduced() ? 800 : 200)
  }

  function back() {
    if (tab === "Details") go("Results")
    else if (tab === "Results" || tab === "Downloads") go("Search")
    else {
      quitting = true
      render()
      say("Quit tortui? y for yes, n for no")
    }
  }

  const act = {
    up: () => move(-1),
    down: () => move(1),
    open: () => (tab === "Results" && results.length ? go("Details") : tab === "Search" ? search(input.value) : null),
    add,
    back,
    search: () => go("Search"),
  }

  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key === "Tab") return
    const k = e.key
    if (e.target.closest && e.target.closest("button") && (k === "Enter" || k === " ")) return
    const inInput = e.target === input
    if (exited) {
      if (k === "Enter") {
        e.preventDefault()
        exited = false
        downloads = []
        results = []
        query = ""
        cursor = 0
        input.value = ""
        go("Search")
      }
      return
    }
    if (quitting) {
      if (k === "y" || k === "Y") {
        exited = true
        quitting = false
        clearInterval(timer)
        timer = null
        if (searching) clearInterval(searching.id), clearTimeout(searching.done), (searching = null)
        render()
        term.focus()
        say("tortui exited. Press Enter to run it again.")
      } else if (k === "n" || k === "N" || k === "Escape") {
        quitting = false
        render()
      }
      e.preventDefault()
      return
    }
    if (inInput) {
      if (k === "Escape") {
        e.preventDefault()
        input.blur()
        term.focus()
      } else if (k === "ArrowDown" && results.length) {
        e.preventDefault()
        go("Results")
      }
      return
    }
    const map = {
      ArrowUp: act.up, k: act.up, ArrowDown: act.down, j: act.down, Enter: act.open,
      a: act.add, q: act.back, Escape: act.back, "/": act.search,
      g: () => move(-1e9), G: () => move(1e9),
      p: () => {
        const d = downloads.find((x) => x.done < 1)
        if (tab === "Downloads" && d) (d.paused = !d.paused), render(), tick()
      },
      x: () => {
        // Remove the item the "[x] remove" hint sits on: the first active one.
        const i = downloads.findIndex((d) => d.done < 1)
        if (tab === "Downloads" && i >= 0) downloads.splice(i, 1), render(), say("Removed")
      },
      1: () => go("Search"), 2: () => go("Results"), 3: () => go("Details"), 4: () => go("Downloads"),
    }
    if (map[k]) {
      e.preventDefault()
      map[k]()
    }
  }

  term.addEventListener("keydown", onKey)
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    search(input.value)
  })
  term.addEventListener("click", (e) => {
    const tabBtn = e.target.closest("[data-tab]")
    if (tabBtn) return go(tabBtn.dataset.tab)
    const link = e.target.closest("[data-q]")
    if (link) {
      input.value = link.dataset.q
      return search(link.dataset.q)
    }
    const row = e.target.closest("[data-row]")
    if (row) {
      const i = +row.dataset.row
      if (i === cursor) go("Details")
      else (cursor = i), render()
      return
    }
    if (tab === "Search" && !exited) input.focus()
    else if (!e.target.closest("input, button")) term.focus()
  })
  root.querySelectorAll("[data-key]").forEach((b) =>
    b.addEventListener("click", () => {
      if (exited || quitting) return onKey({ key: b.dataset.key === "back" ? (quitting ? "n" : "q") : "Enter", target: term, preventDefault() {} })
      act[b.dataset.key]()
    })
  )

  render()
  root.dataset.ready = "true"
}
