# DrishtiVoice

**Your World, Described Through Voice.**

DrishtiVoice is a voice-first visual assistant for blind and visually impaired people in India. You speak a question, point your phone camera at what you want to understand, and hear a spoken answer — what's around you, what a document says, or where an everyday object is.

The whole product is built around one idea: a blind user should be able to finish the main experience without ever looking at the screen.

## What's here

| Page | What it does |
| --- | --- |
| `/` | Landing page: the problem, the six feature areas, how it works, and the accessibility statement |
| `/assistant` | The core experience — a large microphone button, live listening states, quick voice actions, and spoken answers you can replay or stop |
| `/camera` | Rear-camera preview, capture and retake, four tasks (describe, read text, find object, ask about the image), and an analysis panel with read-aloud |
| `/languages` | Speaking and response language for English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi and Bengali, with voice preview |
| `/accessibility` | Text size, high contrast, voice speed and volume, preferred voice, audio instructions, reduced animations |
| `/history` | Past questions and answers with replay, delete, and clear |
| First-use setup | A dialog that opens on your first visit: pick a language, test the microphone and camera, and learn the voice controls. Reopenable from the header at any time |

## Try it

```sh
npm install
npm run dev
```

Then open the URL Vite prints. Speech recognition and the camera need a browser that supports them and your permission; both are requested only after you tap something, and every one of them has a typed or on-screen fallback.

Other scripts: `npm run build`, `npm run preview`, `npm run lint`, `npm run test`.

## How it's put together

React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Router and Start, Lucide icons, and shadcn/ui primitives.

```
src/
  routes/       one file per page
  components/   logo, header, waveform, first-use setup
  hooks/        camera lifecycle, device permission tests, spoken questions
  services/     speech recognition, text-to-speech, image analysis
  contexts/     language, accessibility and history preferences
  lib/          request validation and the server-side AI call
```

Camera logic, speech, and UI stay in separate modules so each can be swapped without touching the others. Language, accessibility, and history preferences are saved in the browser's local storage.

## Honest limits

- Camera answers are demonstration responses until the AI vision service is connected; the app says so on screen and never presents demo output as a real reading of your camera.
- DrishtiVoice is an assistive information tool. It is not a navigation or collision-avoidance system, and it does not replace a white cane, a guide dog, or your own judgement.
- Answers about unclear images come with an uncertainty note rather than a guess.
- Camera images and voice recordings are not stored by default.

## Accessibility

Semantic landmarks, a skip link, descriptive labels on every control, visible focus rings, 48px+ touch targets, ARIA live announcements for state changes, full keyboard operation, and TalkBack/VoiceOver support. Nothing essential is communicated by colour alone.

## Built with Lovable

This project was built with [Lovable](https://lovable.dev). Continue developing it in the [Lovable editor](https://lovable.dev/projects/9eb2d6d2-a4b8-458f-805b-3b6780e01e96) — changes made there are committed straight to this repository, and pushing to `main` syncs them back.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
