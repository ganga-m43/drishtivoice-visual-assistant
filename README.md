# DrishtiVoice Visual Assistant

Build a complete, highly polished, premium, responsive frontend web application called DrishtiVoice.

Tagline: "Your World, Described Through Voice."

DrishtiVoice is an AI-powered, voice-first visual assistant designed for blind and visually impaired people in India. It uses a smartphone camera, voice input, and AI vision to help users understand their surroundings, identify everyday objects, and read printed text.

This must look and feel like a real, professionally funded accessibility technology startup product. Do not create a generic chatbot template or a basic student project UI.

Build the complete frontend with functional navigation, interactive controls, realistic demo states, and a consistent visual design system.

1. DESIGN DIRECTION AND BRAND IDENTITY

Create a premium, modern, minimal, elegant, accessible design.

Brand personality:

Trustworthy

Intelligent

Human-centered

Calm

Inclusive

Futuristic but not overly complicated

Color palette:

Primary: Deep navy #14243A

Secondary: Teal #0F766E

Accent: Bright blue #2563EB

Background: #F7F9FC

Cards: #FFFFFF

Main text: #172033

Secondary text: #64748B

Success: #16A34A

Warning: #D97706

Use soft gradients, subtle shadows, generous whitespace, rounded cards, beautiful micro-interactions, and elegant typography.

Use Inter or Manrope as the primary font.

Use Lucide icons consistently.

Avoid excessive gradients, cluttered dashboards, cartoon illustrations, and unnecessary animations.

The design should resemble a combination of a premium AI startup product and an Apple-quality accessibility application.

2. RESPONSIVE DESIGN

The primary target is smartphone users, especially Android users.

Build mobile-first, but make the application beautiful on tablets and desktop browsers too.

Requirements:

Fully responsive layouts.

Large touch targets.

Minimum 48px interactive touch targets wherever practical.

Clear visual focus indicators.

High-contrast text.

Scalable typography.

Simple navigation.

No essential information communicated through color alone.

The application must be compatible with screen readers such as Android TalkBack and iOS VoiceOver.

Use semantic HTML, descriptive accessible labels, logical heading structures, keyboard navigation, and accessible status announcements.

Never depend on visual-only interactions.

3. PAGES TO BUILD

Create all the following pages with React Router or an equivalent routing solution.

PAGE 1: LANDING / HOME PAGE

Route: /

Create a stunning premium landing page.

Navigation bar:

DrishtiVoice logo with a simple eye + soundwave symbol.

Home

Features

How It Works

Accessibility

Language selector

Get Started button

Hero section:

Main heading:
"See the World Through Your Voice."

Supporting text:
"An intelligent visual assistant that helps blind and visually impaired people understand the world around them using natural voice conversations."

Primary CTA: "Start Voice Assistant"

Secondary CTA: "Discover How It Works"

Create a beautiful hero visual showing a visually impaired Indian person independently using a smartphone camera with DrishtiVoice.

Include a product interface mockup showing:

A large microphone button.

Camera icon.

Voice waveform.

Example spoken AI response.

Below the hero, include:

Problem section:
Explain the everyday challenges visually impaired people face when reading documents, identifying objects, and understanding their surroundings.

Features section:
Create premium feature cards:

Understand Your Surroundings.

Read Any Document.

Find Everyday Objects.

Talk Naturally With AI.

Support Indian Languages.

Accessible by Design.

How It Works section:
Show a clean four-step visual process:

Speak your question.

Capture surroundings using the camera.

AI understands the image.

Hear the answer.

Accessibility section:
Highlight TalkBack, VoiceOver, voice interaction, high contrast, and screen-reader-friendly navigation.

Final CTA:
"Your world deserves to be understood."

Button: "Experience DrishtiVoice"

Footer with brand description, features, accessibility information, privacy, and contact links.

PAGE 2: VOICE ASSISTANT

Route: /assistant

This is the most important page in the application.

Make it the central product experience.

Design a beautiful, distraction-free interface.

Top section:

DrishtiVoice logo.

Assistant status.

Language indicator.

Back button.

Main content:

Greeting:
"Hello! I'm your DrishtiVoice assistant."

Subtitle:
"You don't need to see the screen. Just speak naturally."

Place a VERY LARGE circular microphone button in the center.

Microphone states:

Idle: "Tap to speak."

Listening: "I'm listening..."

Processing: "Understanding your question..."

Responding: "Here's what I found."

Error: "I couldn't hear you clearly. Please try again."

Use beautiful waveform animations when listening.

Show a conversation area with:

User's recognized speech.

AI response.

Speaker/replay button.

Stop speaking button.

Ask another question button.

Add quick voice-action cards:

Describe surroundings.

Read text.

Find an object.

Identify something.

Example conversation:

User: "What is in front of me?"

AI: "There is a wooden table in front of you. A water bottle is on the right side and a plant is on the left."

Make all buttons genuinely interactive.

Include a clear End Session button.

PAGE 3: CAMERA ASSISTANCE

Route: /camera

Create a professional camera interface.

Features:

Request rear-camera permission.

Live camera preview.

Start camera button.

Capture image button.

Retake image button.

Stop camera button.

Image preview after capture.

Below the camera, create four task buttons:

Describe Surroundings.

Read Text.

Find Object.

Ask About Image.

When an image is captured, show an elegant analysis panel with a loading animation.

After analysis, display:

AI-generated description.

Important visible objects.

Approximate image-relative object positions when clear.

Read-aloud button.

Ask follow-up question button.

Create realistic demo responses if the backend is not connected.

Do not falsely claim that an AI response is based on a real camera image when demo mode is active.

PAGE 4: LANGUAGE SETTINGS

Route: /languages

Create a premium language selection page.

Support these initial language options in the interface:

English

Hindi

Kannada

Tamil

Telugu

Malayalam

Marathi

Bengali

Include:

Preferred speaking language.

Preferred response language.

Auto-detect language toggle.

Mixed-language support setting.

Voice preview button.

Display a note that actual recognition and response support depends on the connected speech and AI providers.

Save language preferences in local storage.

PAGE 5: ACCESSIBILITY SETTINGS

Route: /accessibility

This page is extremely important.

Create settings for:

Text size: Small / Medium / Large / Extra Large.

High contrast mode.

Screen reader support information.

Voice speed control.

Voice volume preference.

Audio instructions toggle.

Reduce animations toggle.

Preferred voice.

Keyboard navigation guidance.

Show a clear accessibility statement.

Ensure the settings actually affect the frontend wherever applicable.

PAGE 6: CONVERSATION HISTORY

Route: /history

Create a clean history interface.

Include:

Previous questions.

AI responses.

Conversation date and time.

Replay response button.

Delete conversation button.

Clear history button.

Use sample conversations for the initial demo.

Make clear that history is demonstration data unless actual persistence is implemented.

4. FUNCTIONAL INTERACTIONS

Do not make this a static design.

Implement working frontend interactions:

Navigation between all pages.

Microphone button state changes.

Listening waveform animation.

Speech recognition integration where browser support permits.

Text-to-speech response playback.

Camera permission and rear-camera access using MediaDevices API.

Capture and retake images.

Language selection.

Accessibility settings.

Conversation history interactions.

Toast notifications and clear error messages.

Loading and processing states.

If speech recognition or camera functionality is unavailable, show an accessible explanation and provide a fallback.

Use browser APIs carefully and request permission only after user action.

5. VOICE-FIRST EXPERIENCE

The entire application must be designed around this principle:

"A blind user should be able to complete the main experience without needing to see the screen."

Implement:

Accessible button names.

Screen-reader announcements for state changes.

Proper focus management.

Keyboard accessibility.

Logical reading order.

No instructions that depend only on visual icons.

Easy repeat and stop controls.

Example welcome speech:

"Welcome to DrishtiVoice. I can describe your surroundings, read documents, and help you identify objects. You can ask me anything using your voice."

Example error speech:

"I couldn't understand that clearly. Please speak again."

6. TECHNICAL REQUIREMENTS

Use:

React.

Vite.

TypeScript.

Tailwind CSS.

React Router.

Lucide React icons.

Reusable components.

Clean component architecture.

Organize the application into:

components

pages

hooks

services

contexts

assets

Keep camera logic, speech recognition, text-to-speech, and UI components separate.

Use local state and local storage for frontend preferences and demo history.

Prepare clean service functions for future backend integration.

Do not expose secret API keys in the frontend.

Do not pretend that real AI vision or external voice services are connected if they are not.

7. IMPORTANT PRODUCT SAFETY

DrishtiVoice is an assistive visual-information product, not a guaranteed navigation or collision-avoidance system.

Never claim that it can reliably detect all obstacles, identify safe paths, or replace white canes and guide dogs.

Provide uncertainty messages for unclear images.

Do not store camera images or voice recordings by default.

Make camera-active and stop-camera states obvious and accessible.

8. FINAL QUALITY EXPECTATIONS

I want the final result to feel like a polished, premium startup product ready for a hackathon demonstration.

Prioritize:

Exceptional visual consistency.

Beautiful typography.

Thoughtful spacing.

Premium mobile UI.

Smooth but subtle animations.

Functional interactions.

Accessibility-first design.

Realistic sample conversations.

Clear user flows.

Do not stop after generating the landing page. Build every page listed above.

Do not use generic placeholder dashboards.

Make the voice assistant the visual and functional centerpiece of the product.

Final product statement:

DrishtiVoice — Your World, Described Through Voice.

Build an experience where people do not need to look at their phones to interact with the world around them.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9eb2d6d2-a4b8-458f-805b-3b6780e01e96).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
