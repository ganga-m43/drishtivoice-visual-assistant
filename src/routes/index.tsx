import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accessibility,
  ArrowRight,
  Camera,
  Eye,
  FileText,
  Globe,
  Headphones,
  MessageSquare,
  Mic,
  Search,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import heroImage from "@/assets/hero-drishtivoice.jpg";
import { AppHeader } from "@/components/AppHeader";
import { DrishtiLogo } from "@/components/DrishtiLogo";
import { VoiceWaveform } from "@/components/VoiceWaveform";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DrishtiVoice — See the World Through Your Voice" },
      {
        name: "description",
        content:
          "An intelligent, voice-first visual assistant helping blind and visually impaired people in India understand surroundings, read documents, and find everyday objects.",
      },
      { property: "og:title", content: "DrishtiVoice — See the World Through Your Voice" },
      {
        property: "og:description",
        content:
          "Voice-first AI visual assistant designed for blind and visually impaired people in India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: Eye,
    title: "Understand Your Surroundings",
    description:
      "Hear calm, structured descriptions of rooms, tables, signage, and nearby items without needing to look at the screen.",
  },
  {
    icon: FileText,
    title: "Read Any Document",
    description:
      "Point your smartphone camera at medicine strips, bills, letters, or menus and listen to clear spoken readings.",
  },
  {
    icon: Search,
    title: "Find Everyday Objects",
    description:
      "Locate essentials like your water bottle, eyeglasses, keys, or notebook with image-relative directional cues.",
  },
  {
    icon: MessageSquare,
    title: "Talk Naturally With AI",
    description:
      "Ask follow-up questions in plain speech—no complex menus, tiny icons, or rigid voice commands required.",
  },
  {
    icon: Globe,
    title: "Support Indian Languages",
    description:
      "Designed for English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, and Bengali with mixed-language preferences.",
  },
  {
    icon: Accessibility,
    title: "Accessible by Design",
    description:
      "Built from the ground up for Android TalkBack, iOS VoiceOver, large touch targets, and high-contrast clarity.",
  },
];

const STEPS = [
  { step: "01", title: "Speak your question", desc: "Tap the large microphone button and ask naturally in your preferred language." },
  { step: "02", title: "Capture surroundings", desc: "Use your smartphone's rear camera to frame a document, object, or room." },
  { step: "03", title: "AI understands the image", desc: "Visual context, text, and relative object positions are analyzed clearly." },
  { step: "04", title: "Hear the answer", desc: "Listen to a concise, natural spoken response—and replay or ask follow-ups anytime." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Link
        to="/talk"
        className="flex min-h-16 items-center justify-center gap-3 bg-accent px-4 py-4 text-center text-lg font-bold text-accent-foreground"
      >
        <Mic className="h-6 w-6" aria-hidden="true" />
        Blind or low vision? Open hands-free mode — tap once and just speak.
      </Link>
      <AppHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="space-y-6 lg:col-span-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-subtle px-4 py-1.5 text-sm font-semibold text-secondary">
              <Headphones className="h-4 w-4" aria-hidden="true" />
              Your World, Described Through Voice
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl lg:text-6xl lg:leading-[1.08]">
              See the World Through Your Voice.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              An intelligent visual assistant that helps blind and visually impaired people
              understand the world around them using natural voice conversations.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="min-h-13 gap-2 bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/talk">
                  <Mic className="h-5 w-5" aria-hidden="true" />
                  Start Voice Assistant
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-13 gap-2 px-7 text-base font-semibold"
              >
                <a href="#how-it-works">
                  Discover How It Works
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-subtle shadow-lg">
              <img
                src={heroImage}
                alt="A visually impaired Indian woman smiling calmly while using her smartphone camera with DrishtiVoice in a sunlit living room"
                width={1280}
                height={1024}
                className="aspect-[5/4] w-full object-cover"
              />
            </div>

            {/* Product interface preview card */}
            <div
              aria-label="DrishtiVoice interface preview"
              className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-md sm:mx-4 sm:-mt-16 sm:relative sm:z-10"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm">
                    <Mic className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-secondary uppercase">
                      Voice Assistant Active
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      "What is in front of me?"
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <VoiceWaveform active label="Sample active voice waveform" size="sm" />
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground"
                    aria-hidden="true"
                  >
                    <Camera className="h-5 w-5" />
                  </span>
                </div>
              </div>
              <div className="mt-3 rounded-xl bg-surface-subtle p-3.5 text-sm leading-relaxed text-foreground">
                <span className="font-semibold text-primary">DrishtiVoice: </span>
                "There is a wooden table in front of you. A water bottle is on the right side and a
                plant is on the left."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Everyday visual tasks shouldn't require waiting for help.
            </h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground lg:col-span-7">
            <p>
              Millions of blind and visually impaired people across India navigate daily moments
              that depend on visual information—checking a medicine expiry date, reading a utility
              bill, finding a misplaced bottle on a table, or identifying what is in front of them.
            </p>
            <p>
              DrishtiVoice brings camera understanding and natural voice conversation together in a
              calm, screen-reader-friendly experience designed for independence.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-y border-border bg-card py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Built for clarity, independence, and trust.
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Every capability is designed so you can complete tasks comfortably by voice.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            How DrishtiVoice Works
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Four simple steps from spoken question to clear audio answer.
          </p>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <li key={item.step} className="rounded-2xl border border-border bg-card p-6">
              <span className="text-sm font-extrabold tracking-wider text-secondary">
                STEP {item.step}
              </span>
              <h3 className="mt-3 text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Accessibility Section */}
      <section className="border-y border-border bg-card py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-7">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Accessibility is the foundation, not an afterthought.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              DrishtiVoice works seamlessly with Android TalkBack and iOS VoiceOver. Every control
              carries descriptive labels, 48px+ touch targets, logical keyboard order, live voice
              status announcements, and high-contrast readability.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" variant="outline" className="min-h-12 gap-2">
                <Link to="/accessibility">
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  Customize Accessibility Settings
                </Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface-subtle p-6 lg:col-span-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-secondary" aria-hidden="true" />
              <div>
                <h3 className="text-base font-bold text-foreground">Important Safety Note</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  DrishtiVoice is an assistive visual-information tool, not a guaranteed navigation
                  or collision-avoidance system. Always continue using your white cane, guide dog,
                  and mobility training for safe movement. Camera frames are not stored by default.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 lg:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your world deserves to be understood.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/85">
            Start a calm, voice-first session or explore camera assistance right from your browser.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-h-13 bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/assistant">Experience DrishtiVoice</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="min-h-13 px-8 text-base font-semibold"
            >
              <Link to="/camera">Open Camera Assistance</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <DrishtiLogo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your World, Described Through Voice. Built for blind and visually impaired people
              across India with privacy-respecting, voice-first design.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/assistant" className="hover:text-foreground">Voice Assistant</Link></li>
              <li><Link to="/camera" className="hover:text-foreground">Camera Assistance</Link></li>
              <li><Link to="/languages" className="hover:text-foreground">Indian Languages</Link></li>
              <li><Link to="/history" className="hover:text-foreground">Conversation History</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Accessibility & Trust</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/accessibility" className="hover:text-foreground">Accessibility Settings</Link></li>
              <li><span>Privacy: No images stored by default</span></li>
              <li><span>Contact: support@drishtivoice.in</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
