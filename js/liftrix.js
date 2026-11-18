// Liftrix: a working workout timer (AMRAP, EMOM, For time). Sound starts only
// after the visitor presses Start, through WebAudio.
const LEAD_IN = 3

export const fmt = (s) => {
  s = Math.max(0, Math.ceil(s))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

export default function init(root, { motion }) {
  const digits = root.querySelector(".lx-digits")
  const phase = root.querySelector(".lx-phase")
  const roundEl = root.querySelector(".lx-round")
  const startBtn = root.querySelector("#lx-start")
  const resetBtn = root.querySelector(".lx-reset")
  const roundBtn = root.querySelector(".lx-add-round")
  const soundBtn = root.querySelector(".lx-sound")
  const minutesOut = root.querySelector(".lx-minutes")
  const minutesLabel = root.querySelector(".lx-minutes-label")
  const live = root.querySelector(".lx-live")
  const modes = root.querySelectorAll('input[name="lx-mode"]')

  let mode = "amrap"
  let minutes = 10
  let running = false
  let elapsed = 0 // seconds, including the lead-in
  let started = 0
  let rounds = 0
  let finished = false
  let lastSecond = null
  let audio = null
  let sound = true
  let id = null

  const say = (text) => {
    live.textContent = ""
    setTimeout(() => (live.textContent = text), 30)
  }

  function beep(long) {
    if (!sound || !audio) return
    const t = audio.currentTime
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = "sine"
    osc.frequency.value = long ? 1320 : 880
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + (long ? 0.5 : 0.14))
    osc.connect(gain).connect(audio.destination)
    osc.start(t)
    osc.stop(t + (long ? 0.55 : 0.16))
  }

  const total = () => minutes * 60

  // What the clock shows for a given elapsed time.
  function view(t) {
    if (t === 0 && !running) {
      const clock = mode === "amrap" ? fmt(total()) : mode === "emom" ? "1:00" : "0:00"
      return { clock, phase: mode === "amrap" ? "As many rounds as possible" : mode === "emom" ? "Every minute on the minute" : `For time, ${minutes} min cap`, minute: 1 }
    }
    if (t < LEAD_IN) return { clock: String(LEAD_IN - Math.floor(t)), phase: "Get ready", lead: true }
    const w = t - LEAD_IN
    if (w >= total()) return { clock: mode === "fortime" ? fmt(total()) : "0:00", phase: mode === "fortime" ? "Time cap" : "Time", done: true }
    if (mode === "amrap") return { clock: fmt(total() - w), phase: "As many rounds as possible" }
    if (mode === "emom") {
      const minute = Math.floor(w / 60)
      return { clock: fmt(60 - (w % 60)), phase: "Every minute on the minute", minute: minute + 1 }
    }
    return { clock: fmt(w), phase: `For time, ${minutes} min cap` }
  }

  function roundText(v) {
    if (mode === "emom") return `Round ${Math.min(v.minute || 1, minutes)} / ${minutes}`
    return `${rounds} round${rounds === 1 ? "" : "s"}`
  }

  function render() {
    const v = view(elapsed)
    digits.textContent = v.clock
    digits.classList.toggle("is-lead", !!v.lead)
    phase.textContent = finished && mode === "fortime" && !v.done ? `Done in ${fmt(elapsed - LEAD_IN)}` : v.phase
    roundEl.textContent = roundText(v)
    startBtn.textContent = running ? "Pause" : elapsed > 0 && !finished ? "Resume" : finished ? "Again" : "Start"
    startBtn.setAttribute("aria-label", `${startBtn.textContent} the ${modeName()} timer`)
    roundBtn.hidden = mode === "emom"
    roundBtn.disabled = !running || !!v.lead
    minutesOut.textContent = String(minutes)
    minutesLabel.textContent = mode === "emom" ? "rounds" : mode === "fortime" ? "min cap" : "min"
    root.classList.toggle("is-running", running)
    root.dataset.mode = mode
    modes.forEach((m) => (m.disabled = running))
    root.querySelectorAll(".lx-step").forEach((b) => (b.disabled = running || (elapsed > 0 && !finished)))
  }

  const modeName = () => ({ amrap: "AMRAP", emom: "EMOM", fortime: "For time" })[mode]

  function frame() {
    elapsed = (performance.now() - started) / 1000
    const v = view(elapsed)
    const sec = Math.floor(elapsed)
    if (sec !== lastSecond) {
      lastSecond = sec
      // Beeps: the lead-in count, each EMOM minute, the last three seconds.
      if (v.lead) beep(false)
      else if (sec === LEAD_IN) {
        beep(true)
        say(`Go. ${modeName()}, ${minutes} ${mode === "emom" ? "rounds" : "minutes"}.`)
      } else if (!v.done) {
        const w = sec - LEAD_IN
        const left = mode === "emom" ? 60 - (w % 60) : mode === "amrap" ? total() - w : total() - w
        if (mode === "emom" && w % 60 === 0) {
          beep(true)
          say(`Round ${v.minute}`)
        } else if (left <= 3 && left > 0) beep(false)
      }
    }
    if (v.done) {
      elapsed = LEAD_IN + total()
      stop()
      finished = true
      beep(true)
      say(mode === "amrap" ? `Time. ${rounds} rounds.` : mode === "emom" ? "Time. All rounds done." : "Time cap reached.")
    }
    render()
  }

  function start() {
    if (!audio) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (Ctx) audio = new Ctx()
    }
    if (audio && audio.state === "suspended") audio.resume()
    if (finished) reset(true)
    running = true
    started = performance.now() - elapsed * 1000
    lastSecond = Math.floor(elapsed) - (elapsed === 0 ? 1 : 0)
    id = setInterval(frame, 100)
    frame()
  }

  function stop() {
    running = false
    clearInterval(id)
    id = null
  }

  function reset(quiet) {
    stop()
    elapsed = 0
    rounds = 0
    finished = false
    lastSecond = null
    render()
    if (!quiet) say("Reset")
  }

  startBtn.addEventListener("click", () => {
    if (running) {
      stop()
      if (mode === "fortime" && elapsed > LEAD_IN) {
        say(`Paused at ${fmt(elapsed - LEAD_IN)}`)
      } else say("Paused")
      render()
    } else start()
  })
  resetBtn.addEventListener("click", () => reset())
  roundBtn.addEventListener("click", () => {
    rounds++
    render()
    say(`${rounds} round${rounds === 1 ? "" : "s"}`)
    if (!motion.reduced()) {
      roundEl.classList.remove("is-bump")
      void roundEl.offsetWidth
      roundEl.classList.add("is-bump")
    }
  })
  soundBtn.addEventListener("click", () => {
    sound = !sound
    soundBtn.setAttribute("aria-pressed", String(sound))
    soundBtn.querySelector("span").textContent = sound ? "Sound on" : "Sound off"
  })
  modes.forEach((m) =>
    m.addEventListener("change", () => {
      mode = m.value
      minutes = mode === "emom" ? 10 : mode === "fortime" ? 12 : 10
      reset(true)
      say(`${modeName()}, ${minutes} ${mode === "emom" ? "rounds" : "minutes"}`)
    })
  )
  root.querySelectorAll(".lx-step").forEach((b) =>
    b.addEventListener("click", () => {
      minutes = Math.max(1, Math.min(60, minutes + +b.dataset.step))
      render()
      say(`${minutes} ${minutesLabel.textContent}`)
    })
  )
  // Space toggles the clock while the timer has focus, like a gym clock remote.
  root.addEventListener("keydown", (e) => {
    if (e.key === " " && e.target === root.querySelector(".lx-face")) {
      e.preventDefault()
      startBtn.click()
    }
  })
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && running) frame()
  })

  render()
  root.dataset.ready = "true"
}
