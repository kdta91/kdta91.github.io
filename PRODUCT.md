# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS on GitHub Pages (kdta91.github.io), no build step. Motion clips are pre-rendered video files (HyperFrames) committed to the repo.

## Purpose

Personal portfolio of Kristoff Ampong, a full-stack and mobile engineer (14 years in production). It exists to win freelance and contract work by proving he can design, build and ship a product end to end.

## Primary user

Prospective freelance or contract clients (founders, product leads, agencies) deciding whether to reach out. They skim on desktop or phone and want evidence of shipped work, range and seniority, fast.

## Evidence (confirmed)

- **Liftrix** (liftrix.app, App Store id6770000287): training app for functional fitness, fitness racing, powerlifting, weightlifting and bodybuilding. iOS live, Android in closed testing, plus web and a multi-tenant gym portal. Expo/React Native, native Swift and Kotlin modules, Supabase, RevenueCat, Gemini, Next.js on Cloudflare Workers.
- **Linaw** (linaw.app): voice-first money log for iPhone. SwiftUI, SwiftData + CloudKit, App Intents, Vision, StoreKit 2 with server verification, Supabase, Gemini.
- **DropCove** (dropcoveapp.com, live since 2026-11-11, v1.1.2; Pro on sale through Polar; Product Hunt launch 2026-12-01): a native macOS menu bar app that acts on files dropped onto the notch (image, video and PDF actions) and on what you copy (a clipboard lens with ten detectors, plus history). Free download with a one-time Pro upgrade; offline Ed25519 license keys issued by a Cloudflare Worker from Polar webhooks. Swift 6, AppKit, SwiftUI, AVFoundation, PDFKit, Vision, an XPC media helper, SQLite, Sparkle, CryptoKit. macOS 26+, Apple silicon, signed and notarized, not on the Mac App Store. Copy on the site is checked against dropcoveapp.com and the PRD: every action on-device (video and OCR in the XPC helper, PDF in-app); no account or telemetry, the only network traffic is the update check; API keys masked, never saved, cleared from the clipboard after 60 s; the top action is pre-run for images and text only. The marketing site is Astro on Cloudflare. The site's clip is the hero loop recorded from the real app by `dropcove/scripts/record-hero.sh`. Avoid quoting the dated launch price.
- **tortui** (github.com/kdta91/tortui, public, MIT, latest release v1.1.0): a terminal UI for searching torrent indexers and downloading in one place. Go, Bubble Tea, Lip Gloss, anacrolix/torrent, bbolt. Single static binary for macOS, Linux and Windows; Torznab or YAML sources; ships with one lawful default source (the Internet Archive); no telemetry. The site's clip is the repo's own `tortui --demo` recording (synthetic data, no network), labelled as such.
- Prior work (anonymised only): real-time voice and applied AI, platforms and infrastructure, security and delivery, leading a team of five. Figures used on the site come from the owner's résumé (Kristoff-Ampong-Resume.pdf, 2026) and the earlier version of this site: 14 years in production; live voice translation in nine languages at about three seconds end to end; compute cut about 29% with scheduled operating hours; 58 penetration-test and audit findings remediated.

## Constraints

- No personal contact details (no phone, personal email, home location). Contact is GitHub only: github.com/kdta91.
- No employer, client or education names.
- Liftrix copy stays multi-discipline, never CrossFit-exclusive; no HYROX branding.
- Linaw marketing avoids "AI-powered", "smart" and "intelligent".
- Screenshots and icons are real captures from the apps; never generated.
- Experience and skills are condensed (index list + stack strip), never résumé bullets.
