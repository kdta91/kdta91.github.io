// DropCove: a notch you can drop an image on. Everything runs on this page:
// the image is decoded and re-encoded with canvas, nothing is uploaded.
const ICONS = {
  convert: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.7M20 4v4.7h-4.7M20 12a8 8 0 0 1-13.7 5.6L4 15.3M4 20v-4.7h4.7"/>',
  resize: '<path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/>',
  compress: '<path d="M4 14h6v6M4 20l6-6M20 10h-6V4M20 4l-6 6"/>',
  photo: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>',
}
const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`

const MAX_BYTES = 40e6
const LONG_EDGE = 1280

// "240 KB", "1.4 MB": decimal units, like the app's ByteCountFormatter.
export const formatBytes = (n) =>
  n < 1000 ? `${n} bytes` : n < 1e6 ? `${Math.round(n / 1000)} KB` : `${(n / 1e6).toFixed(n < 1e7 ? 1 : 0)} MB`
export const percent = (before, after) => {
  const p = Math.round(((after - before) / before) * 100)
  return p === 0 ? "0%" : p < 0 ? `−${-p}%` : `+${p}%`
}

const KINDS = { "image/png": "PNG", "image/jpeg": "JPEG", "image/webp": "WebP", "image/gif": "GIF", "image/avif": "AVIF", "image/bmp": "BMP" }
const EXT = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" }
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])

const useOffscreen = typeof OffscreenCanvas !== "undefined" && "convertToBlob" in OffscreenCanvas.prototype

async function decode(file) {
  if (window.createImageBitmap) {
    try {
      return await createImageBitmap(file)
    } catch (_) {}
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function encode(source, w, h, type, quality) {
  const canvas = useOffscreen ? new OffscreenCanvas(w, h) : Object.assign(document.createElement("canvas"), { width: w, height: h })
  const ctx = canvas.getContext("2d")
  if (type === "image/jpeg") {
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, w, h)
  }
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(source, 0, 0, w, h)
  const blob = useOffscreen
    ? await canvas.convertToBlob({ type, quality })
    : await new Promise((resolve) => canvas.toBlob(resolve, type, quality))
  if (!blob) throw new Error("encode failed")
  return blob
}

export default function init(stage, { motion }) {
  const band = stage.closest(".project")
  const notch = stage.querySelector(".dc-notch")
  const lip = stage.querySelector("#dc-notch")
  const panel = stage.querySelector(".dc-panel")
  const live = stage.querySelector(".dc-live")
  const picker = Object.assign(document.createElement("input"), { type: "file", accept: "image/*", hidden: true })
  picker.setAttribute("aria-hidden", "true")
  picker.tabIndex = -1
  stage.appendChild(picker)

  const actions = {
    convert: {
      title: "Convert",
      line: () => (webpOK === false ? "JPEG · quality 80%" : "WebP · quality 80%"),
      // Canvas silently falls back to PNG for a type it can't encode, so probe first.
      run: async (s) => encode(s.bitmap, s.w, s.h, (await webpProbe) ? "image/webp" : "image/jpeg", 0.8),
      name: (base, blob) => `${base}.${EXT[blob.type] || "img"}`,
    },
    resize: {
      title: "Resize",
      line: () => `${LONG_EDGE} px long edge`,
      dims(s) {
        const scale = Math.min(1, LONG_EDGE / Math.max(s.w, s.h))
        return [Math.round(s.w * scale), Math.round(s.h * scale)]
      },
      detail(s) {
        const [w, h] = this.dims(s)
        return `${Math.max(s.w, s.h)} → ${Math.max(w, h)} px`
      },
      run(s) {
        const [w, h] = this.dims(s)
        const type = EXT[s.type] ? s.type : "image/png"
        return encode(s.bitmap, w, h, type, 0.9)
      },
      name: (base, blob) => `${base}-${LONG_EDGE}.${EXT[blob.type] || "img"}`,
    },
    compress: {
      title: "Compress",
      line: () => "Quality 70%, smaller",
      detail: (s) => `${KINDS[s.type] || "Image"} → JPEG`,
      run: (s) => encode(s.bitmap, s.w, s.h, "image/jpeg", 0.7),
      name: (base) => `${base}-small.jpg`,
    },
  }
  // Ranked by what you use, like the app; ties keep this order.
  const uses = { convert: 0, resize: 0, compress: 0 }
  const ranked = () => Object.keys(actions).sort((a, b) => uses[b] - uses[a])

  let state = "idle"
  let src = null // { file, bitmap, w, h, type, base, url }
  let result = null // { blob, url, name, action }
  let prerun = null // { key, promise }
  let webpOK = null
  const webpProbe = encode(Object.assign(document.createElement("canvas"), { width: 1, height: 1 }), 1, 1, "image/webp", 0.8)
    .then((b) => b.type === "image/webp")
    .catch(() => false)
    .then((ok) => (webpOK = ok))
  let token = 0 // bumped by every load and close; stale async work checks it and bails
  let dragDepth = 0

  const say = (text) => {
    live.textContent = ""
    setTimeout(() => (live.textContent = text), 30)
  }

  function setOpen(open) {
    notch.toggleAttribute("data-open", open)
    lip.setAttribute("aria-expanded", String(open))
    panel.hidden = !open
  }

  function render() {
    notch.dataset.state = state
    if (state === "idle") return setOpen(false)
    setOpen(true)
    if (state === "empty" || state === "drag" || (state === "working" && !src)) {
      const busy = state === "working"
      panel.innerHTML = `
        <div class="dc-drop${state === "drag" ? " is-over" : ""}">
          ${svg("photo")}
          <p class="dc-drop-title">${busy ? "Opening the image…" : state === "drag" ? "Release to drop" : "Drop an image on the notch"}</p>
          <p class="dc-drop-sub">PNG, JPEG, WebP or GIF. It stays in this browser.</p>
          <div class="dc-drop-actions">
            <button type="button" class="dc-btn primary" data-act="pick"${busy ? " disabled" : ""}>Choose an image</button>
            <button type="button" class="dc-btn" data-act="sample"${busy ? " disabled" : ""}>Try a sample</button>
          </div>
        </div>
        <button type="button" class="dc-key dc-close" data-act="close" aria-label="Close the notch">esc</button>`
      return
    }
    if (state === "error") {
      panel.innerHTML = `
        <div class="dc-drop">
          <p class="dc-drop-title">${esc(errorText)}</p>
          <div class="dc-drop-actions">
            <button type="button" class="dc-btn primary" data-act="pick">Choose another</button>
            <button type="button" class="dc-btn" data-act="sample">Try a sample</button>
          </div>
        </div>
        <button type="button" class="dc-key dc-close" data-act="close" aria-label="Close the notch">esc</button>`
      return
    }
    const head = `
      <div class="dc-head">
        <img class="dc-thumb" src="${src.url}" alt="" width="44" height="44" />
        <div class="dc-file"><strong>${esc(src.file.name)}</strong><span>${KINDS[src.type] || "Image"} · ${formatBytes(src.file.size)} · ${src.w} × ${src.h}</span></div>
        <button type="button" class="dc-key" data-act="close" aria-label="Close the notch">esc</button>
      </div>`
    if (state === "loaded" || state === "working") {
      const order = ranked()
      panel.innerHTML = `${head}
        <div class="dc-tiles" role="group" aria-label="Actions, ranked by use">
          ${order
            .map((key, i) => {
              const a = actions[key]
              const busy = state === "working" && busyKey === key
              const estimate = prerun && prerun.key === key && prerun.size ? `≈ ${formatBytes(prerun.size)}` : ""
              const detail = a.detail ? a.detail(src) : estimate || "&nbsp;"
              return `<button type="button" class="dc-tile${i === 0 ? " is-top" : ""}" data-run="${key}" aria-keyshortcuts="${i + 1}"${
                state === "working" ? " disabled" : ""
              }>
                <span class="dc-tile-top">${svg(key)}<span class="dc-key" aria-hidden="true">${i === 0 ? "↵" : i + 1}</span></span>
                <strong>${busy ? "Working…" : a.title}</strong>
                <span class="dc-tile-line">${a.line()}</span>
                <span class="dc-tile-data">${detail}</span>
              </button>`
            })
            .join("")}
        </div>
        <p class="dc-foot"><span>${esc(src.file.name)} → ${esc(actions[order[0]].name(src.base, { type: order[0] === "convert" ? (webpOK === false ? "image/jpeg" : "image/webp") : EXT[src.type] ? src.type : "image/png" }))} · in this browser</span><span class="dc-keys" aria-hidden="true"><span class="dc-key">1–3</span><span class="dc-key">↵</span></span></p>`
      return
    }
    if (state === "done") {
      const delta = percent(src.file.size, result.blob.size)
      const smaller = result.blob.size < src.file.size
      panel.innerHTML = `${head}
        <div class="dc-result">
          <img class="dc-out" src="${result.url}" alt="${esc(`Result: ${result.name}`)}" />
          <div class="dc-result-text">
            <p class="dc-result-name">${esc(result.name)}</p>
            <p class="dc-result-size"><span>${formatBytes(src.file.size)} → ${formatBytes(result.blob.size)}</span> <strong class="${smaller ? "is-down" : ""}">${delta}</strong></p>
            ${result.note ? `<p class="dc-result-note">${esc(result.note)}</p>` : ""}
            <div class="dc-drop-actions">
              <a class="dc-btn primary" href="${result.url}" download="${esc(result.name)}">Download</a>
              <button type="button" class="dc-btn" data-act="back">Back to actions</button>
            </div>
            <p class="dc-private">Nothing left your browser.</p>
          </div>
        </div>`
    }
  }

  let errorText = ""
  let busyKey = null

  // Re-rendering replaces the panel; keep focus on the same control, or the first one.
  function renderKeepFocus() {
    const el = document.activeElement
    const key = el && panel.contains(el) ? el.dataset.run || el.dataset.act : null
    render()
    const again = key && panel.querySelector(`[data-run="${key}"], [data-act="${key}"]`)
    if (again && !again.disabled) again.focus()
    else if (key || !stage.contains(document.activeElement)) focusTop()
  }

  function fail(text) {
    errorText = text
    state = "error"
    renderKeepFocus()
    focusTop()
    say(text)
  }

  async function load(file) {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      return fail("The demo here takes images. The app also handles video and PDF.")
    }
    if (file.size > MAX_BYTES) return fail("That image is over 40 MB. Try a smaller one.")
    const t = ++token
    clear()
    state = "working"
    renderKeepFocus()
    let next
    try {
      const bitmap = await decode(file)
      if (t !== token) return bitmap.close && bitmap.close()
      const w = bitmap.width
      const h = bitmap.height
      if (!w || !h || w * h > 50e6) {
        if (bitmap.close) bitmap.close()
        return fail("That image is too large to convert in a browser tab.")
      }
      next = { file, bitmap, w, h, type: file.type, base: file.name.replace(/\.[^.]+$/, "") || "image", url: URL.createObjectURL(file) }
    } catch (_) {
      if (t === token) fail("This browser can't read that image. Try a PNG or JPEG.")
      return
    }
    src = next
    state = "loaded"
    busyKey = null
    render()
    focusTop()
    say(`${src.file.name}, ${formatBytes(src.file.size)}. Three actions; the top one, ${actions[ranked()[0]].title}, is ready.`)
    // The top action is already done before you click, like the app does for images.
    const key = ranked()[0]
    const promise = actions[key].run(src)
    prerun = { key, promise, for: src }
    promise
      .then((blob) => {
        if (t === token && prerun && prerun.promise === promise && state === "loaded") {
          prerun.size = blob.size
          renderKeepFocus()
        }
      })
      .catch(() => {})
  }

  async function run(key) {
    if (!src || state !== "loaded") return
    const t = token
    const s = src
    state = "working"
    busyKey = key
    renderKeepFocus()
    try {
      let blob
      if (prerun && prerun.key === key && prerun.for === s) blob = await prerun.promise
      else blob = await actions[key].run(s)
      if (t !== token || src !== s) return // closed, or another image arrived meanwhile
      let note = ""
      if (key === "convert" && blob.type !== "image/webp") note = "This browser can't encode WebP, so you got JPEG. The app always writes WebP."
      if (key === "resize" && Math.max(s.w, s.h) <= LONG_EDGE) note = `Already ${LONG_EDGE} px or smaller, so the size stayed and the file was re-encoded.`
      uses[key]++
      if (result) URL.revokeObjectURL(result.url)
      result = { blob, url: URL.createObjectURL(blob), name: actions[key].name(s.base, blob), note }
      state = "done"
      render()
      panel.querySelector(".dc-btn.primary")?.focus()
      say(`${actions[key].title} done. ${formatBytes(s.file.size)} to ${formatBytes(blob.size)}, ${percent(s.file.size, blob.size).replace("\u2212", "minus ")}. Download is ready. Nothing left your browser.`)
    } catch (_) {
      if (t === token && src === s) fail("That didn't work in this browser. Try another image.")
    }
  }

  function clear() {
    if (src) {
      URL.revokeObjectURL(src.url)
      if (src.bitmap.close) src.bitmap.close()
    }
    if (result) URL.revokeObjectURL(result.url)
    src = result = prerun = null
  }

  const focusTop = () => panel.querySelector(".dc-tile:not([disabled]), .dc-btn:not([disabled]), .dc-key")?.focus()

  function close() {
    token++ // a run in flight is abandoned; reopening shows the actions again
    state = "idle"
    render()
    lip.focus()
  }

  async function sample() {
    if (state === "working") return
    const t = ++token
    state = "working"
    renderKeepFocus()
    try {
      const res = await fetch("media/dropcove-poster.webp")
      const bitmap = await createImageBitmap(await res.blob())
      const png = await encode(bitmap, bitmap.width, bitmap.height, "image/png")
      if (bitmap.close) bitmap.close()
      if (t === token) load(new File([png], "Screenshot of DropCove.png", { type: "image/png" }))
    } catch (_) {
      if (t === token) fail("Couldn't load the sample. Choose an image instead.")
    }
  }

  lip.addEventListener("click", () => {
    if (state === "idle") {
      state = src ? (result ? "done" : "loaded") : "empty"
      render()
      focusTop()
    } else close()
  })

  panel.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act], [data-run]")
    if (!btn) return
    const act = btn.dataset.act
    if (btn.dataset.run) run(btn.dataset.run)
    else if (act === "pick" && state !== "working") picker.click()
    else if (act === "sample") sample()
    else if (act === "close") close()
    else if (act === "back") {
      state = "loaded"
      render()
      focusTop()
    }
  })

  picker.addEventListener("change", () => {
    load(picker.files[0])
    picker.value = ""
  })

  stage.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state !== "idle") {
      e.preventDefault()
      return close()
    }
    if (state === "loaded" && /^[1-3]$/.test(e.key) && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      run(ranked()[+e.key - 1])
    }
  })

  // Drag anywhere over the band opens the notch, as dragging to the top of the screen does.
  const hasFiles = (e) => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes("Files")
  band.addEventListener("dragenter", (e) => {
    if (!hasFiles(e)) return
    e.preventDefault()
    dragDepth++
    if (state !== "drag" && state !== "working") {
      state = "drag"
      render()
    }
  })
  band.addEventListener("dragover", (e) => {
    if (!hasFiles(e)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  })
  band.addEventListener("dragleave", (e) => {
    if (!hasFiles(e)) return
    dragDepth = Math.max(0, dragDepth - 1)
    if (dragDepth === 0 && state === "drag") {
      state = src ? "loaded" : "idle"
      render()
    }
  })
  band.addEventListener("drop", (e) => {
    if (!hasFiles(e)) return
    e.preventDefault()
    dragDepth = 0
    load(e.dataTransfer.files[0])
  })

  stage.dataset.ready = "true"
  return { load, run }
}
