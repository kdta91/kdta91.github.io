// Linaw: a demo of the logging flow. Say or type "5.75 for coffee" and a few
// lines of JavaScript on this page turn it into a row. Nothing is saved.
const SMALL = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 }
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 }

const CATEGORIES = [
  ["Coffee", /\b(coffee|latte|espresso|cappuccino|americano|cafe|café|tea|matcha|frappe)\b/],
  ["Food", /\b(lunch|dinner|breakfast|brunch|food|snacks?|pizza|burgers?|ramen|sushi|meal|takeout|restaurant|bakery|bread|jollibee|mcdo|kfc)\b/],
  ["Groceries", /\b(groceries|grocery|market|supermarket|produce|eggs|milk|rice)\b/],
  ["Transport", /\b(grab|uber|taxi|cab|bus|train|jeep|jeepney|tricycle|gas|fuel|petrol|parking|toll|fare|mrt|lrt)\b/],
  ["Bills", /\b(rent|electric|electricity|water|internet|wifi|phone|load|bill|bills|insurance)\b/],
  ["Health", /\b(gym|pharmacy|medicine|meds|doctor|dentist|vitamins|clinic)\b/],
  ["Fun", /\b(movie|movies|cinema|netflix|spotify|games?|concert|drinks|beer|bar)\b/],
  ["Shopping", /\b(shoes|shirt|clothes|book|books|gift|gadget|shopping)\b/],
]

const titleCase = (s) => s.replace(/\b\p{L}/gu, (c) => c.toUpperCase())

// Turns spoken number words into digits: "five seventy five" -> "5.75" is too
// ambiguous, so only plain numbers ("twelve", "two hundred fifty") are read.
function wordsToNumber(text) {
  return text.replace(/\b((?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|and|-|\s)+)\b/g, (match) => {
    const words = match.trim().split(/[\s-]+/).filter((w) => w && w !== "and")
    if (!words.length || words.every((w) => w === "hundred" || w === "thousand")) return match
    let total = 0
    let current = 0
    for (const w of words) {
      if (w in SMALL) current += SMALL[w]
      else if (w in TENS) current += TENS[w]
      else if (w === "hundred") current = (current || 1) * 100
      else if (w === "thousand") {
        total += (current || 1) * 1000
        current = 0
      }
    }
    const lead = match.match(/^\s*/)[0]
    const tail = match.match(/\s*$/)[0]
    return `${lead}${total + current}${tail}`
  })
}

export function parse(input) {
  let text = ` ${String(input).toLowerCase()} `
    .replace(/[₱$€£¥]/g, " ")
    .replace(/(\d),(\d{3})\b/g, "$1$2")
  text = wordsToNumber(text)
  // "1.2k" -> 1200
  text = text.replace(/(\d+(?:\.\d+)?)\s*k\b/g, (_, n) => String(Math.round(parseFloat(n) * 1000)))
  // "5 dollars 75 (cents)" -> 5.75
  text = text.replace(/(\d+)\s*(?:dollars?|bucks|pesos?|euros?|pounds?)\s+(?:and\s+)?(\d{1,2})\b(?:\s*cents?)?/g, "$1.$2")
  const m = text.match(/\d+(?:\.\d{1,2})?/)
  if (!m) return null
  const amount = parseFloat(m[0])
  if (!(amount > 0) || amount > 1e7) return null

  let rest = (text.slice(0, m.index) + " " + text.slice(m.index + m[0].length))
    .replace(/\b(dollars?|bucks|pesos?|php|usd|eur|euros?|pounds?|cents?)\b/g, " ")
    .replace(/\b(i\s+)?(spent|spend|paid|pay|log|add|bought|got|just|today|yesterday|for|on|a|an|the|my|some|of)\b/g, " ")
    .replace(/[^\p{L}\p{N}&' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()

  let merchant = ""
  const at = rest.match(/\bat (.+)$/)
  if (at) {
    merchant = at[1]
    rest = rest.slice(0, at.index).trim()
  }
  const what = rest.replace(/\bat\b/g, "").trim()
  const haystack = `${what} ${merchant}`
  const found = CATEGORIES.find(([, re]) => re.test(haystack))
  const category = found ? found[0] : "Other"
  const name = merchant || what || category
  return { amount, merchant: titleCase(name).slice(0, 40), note: merchant && what ? titleCase(what) : "", category }
}

const GLYPHS = {
  Coffee: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2.5M11 3.5v2.5"/>',
  Food: '<path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M16 3c-1.7 0-3 2-3 5s1.3 4 3 4v9"/>',
  Groceries: '<path d="M4 6h2l2 10h10l2-7H7M10 20h.01M17 20h.01"/>',
  Transport: '<rect x="4" y="5" width="16" height="11" rx="2.5"/><path d="M4 11h16M7 19l1-3M17 19l-1-3"/>',
  Bills: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',
  Health: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  Fun: '<path d="M5 8h14v10H5zM5 8l3-4M12 8l3-4M9 11l5 2.5L9 16z"/>',
  Shopping: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  Other: '<circle cx="12" cy="12" r="7.5"/><path d="M9 12h6"/>',
}
const glyph = (c) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${GLYPHS[c] || GLYPHS.Other}</svg>`
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])
const money = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function init(root, { motion }) {
  const form = root.querySelector("form")
  const input = root.querySelector("#ln-input")
  const list = root.querySelector(".ln-list")
  const total = root.querySelector(".ln-total-value")
  const count = root.querySelector(".ln-count")
  const live = root.querySelector(".ln-live")
  const hint = root.querySelector(".ln-hint")
  const mic = root.querySelector(".ln-mic")
  const clearBtn = root.querySelector(".ln-clear")
  const rows = []

  const say = (text) => {
    live.textContent = ""
    setTimeout(() => (live.textContent = text), 30)
  }

  function render(fresh) {
    const sum = rows.reduce((a, r) => a + r.amount, 0)
    total.textContent = money(sum)
    count.textContent = rows.length ? `${rows.length} ${rows.length === 1 ? "entry" : "entries"}` : "Nothing logged yet"
    clearBtn.hidden = !rows.length
    list.innerHTML = rows
      .map(
        (r, i) => `<li class="${i === 0 && fresh && !motion.reduced() ? "is-new" : ""}">
          <span class="ln-glyph">${glyph(r.category)}</span>
          <span class="ln-row-text"><strong>${esc(r.merchant)}</strong><span>${esc(r.category)}${r.note ? ` · ${esc(r.note)}` : ""}</span></span>
          <span class="ln-amount">${money(r.amount)}</span>
        </li>`
      )
      .join("")
  }

  function log(text) {
    const row = parse(text)
    if (!row) {
      hint.textContent = `Couldn't find an amount in “${text.trim().slice(0, 60)}”. Try “12 for lunch”.`
      hint.classList.add("is-error")
      say(hint.textContent)
      return false
    }
    rows.unshift(row)
    if (rows.length > 6) rows.pop()
    hint.classList.remove("is-error")
    hint.textContent = `Heard “${text.trim().slice(0, 60)}”.`
    render(true)
    say(`Logged ${money(row.amount)}, ${row.merchant}, ${row.category}. Total ${money(rows.reduce((a, r) => a + r.amount, 0))}.`)
    return true
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const text = input.value
    if (!text.trim()) return input.focus()
    if (log(text)) input.value = ""
  })
  root.querySelectorAll("[data-say]").forEach((chip) =>
    chip.addEventListener("click", () => {
      log(chip.dataset.say)
    })
  )
  clearBtn.addEventListener("click", () => {
    rows.length = 0
    render()
    hint.classList.remove("is-error")
    hint.textContent = ""
    say("Cleared")
    input.focus()
  })

  // Voice, where the browser has speech recognition. Typing works everywhere.
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (Recognition) {
    mic.hidden = false
    root.classList.add("has-voice")
    let rec = null
    const stop = () => {
      mic.setAttribute("aria-pressed", "false")
      mic.setAttribute("aria-label", "Speak an expense")
      root.classList.remove("is-listening")
    }
    mic.addEventListener("click", () => {
      if (rec) return rec.stop()
      rec = new Recognition()
      rec.lang = "en-US"
      rec.interimResults = true
      rec.maxAlternatives = 1
      let finalText = ""
      rec.onresult = (e) => {
        const r = e.results[e.results.length - 1]
        input.value = r[0].transcript
        if (r.isFinal) finalText = r[0].transcript
      }
      rec.onerror = (e) => {
        hint.classList.add("is-error")
        hint.textContent =
          e.error === "not-allowed" || e.error === "service-not-allowed"
            ? "Microphone blocked. Type it instead."
            : e.error === "no-speech"
              ? "Didn't hear anything. Try again, or type it."
              : "Voice isn't available right now. Type it instead."
        say(hint.textContent)
      }
      rec.onend = () => {
        rec = null
        stop()
        if (finalText && log(finalText)) input.value = ""
      }
      try {
        rec.start()
        mic.setAttribute("aria-pressed", "true")
        mic.setAttribute("aria-label", "Stop listening")
        root.classList.add("is-listening")
        hint.classList.remove("is-error")
        hint.textContent = "Listening… say something like “5.75 for coffee”."
      } catch (_) {
        rec = null
        stop()
      }
    })
  }
  render()
  root.dataset.ready = "true"
}
