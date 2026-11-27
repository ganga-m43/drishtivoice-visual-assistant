# DrishtiVoice – Your World, Described Through Voice

**An AI-powered, voice-first visual assistant for blind and visually impaired people.**

DrishtiVoice helps users understand their surroundings through voice interactions and camera-based assistance. Users can ask questions, capture images, read documents, identify objects, and receive spoken responses through an accessible interface.

## ✨ Key Features

- **Voice Interaction:** Ask questions and interact using voice commands.
- **Scene Description:** Understand surroundings through camera-based image analysis.
- **Text Recognition:** Read and extract information from documents.
- **Object Identification:** Identify everyday objects using the camera.
- **Image Question Answering:** Ask questions about captured images.
- **Multilingual Support:** English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, and Bengali.
- **Accessibility Settings:** Customize text size, contrast, voice speed, and volume.
- **Interaction History:** Access and replay previous questions and responses.

## 🛠️ Tech Stack

- **Frontend:** React.js, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Routing:** TanStack Router
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Browser APIs:** Web Speech API, Speech Synthesis API, MediaDevices API
- **Storage:** Browser Local Storage

## 📁 Project Structure

```text
src/
├── routes/       # Application pages
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── services/     # Speech, camera and AI services
├── contexts/     # Language and accessibility settings
└── lib/          # Utilities and request handling
```

## 🚀 Getting Started

**Prerequisites:** Node.js and npm.

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project
cd <repository-name>

# Install dependencies
npm install

# Start development server
npm run dev
```

Open the local URL provided by Vite in your browser.

## ♿ Accessibility & Privacy

- Screen-reader-friendly labels and semantic elements.
- Keyboard navigation and visible focus indicators.
- High-contrast mode and adjustable text size.
- Audio feedback and customizable speech settings.
- Camera and microphone access only with user permission.
- Images and voice recordings are not stored by default.

## ⚠️ Limitations

- Camera analysis currently uses demonstration responses until the AI vision service is integrated.
- Speech and camera features depend on browser support and permissions.
- DrishtiVoice is an assistive information tool, not a replacement for mobility aids or navigation systems.

## 🎯 Vision

To make everyday visual information more accessible through voice, AI, and inclusive technology.

**Making the world easier to understand, one voice interaction at a time.**
