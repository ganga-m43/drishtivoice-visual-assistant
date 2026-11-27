export type VisionTask = "describe" | "read_text" | "find_object" | "ask_image";

export interface DetectedObject {
  name: string;
  position: string;
  confidence: "clear" | "approximate";
}

export interface VisionAnalysisResult {
  isDemo: boolean;
  task: VisionTask;
  description: string;
  objects: DetectedObject[];
  uncertaintyNote: string;
}

/**
 * Service layer prepared for future backend AI vision integration.
 * Currently runs in transparent demonstration mode when no live vision API is connected.
 */
export async function analyzeCameraImage(
  _imageDataUrl: string,
  task: VisionTask,
  followUpQuestion?: string,
): Promise<VisionAnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 1100));

  const uncertaintyNote =
    "Demo mode active: this sample response illustrates DrishtiVoice's output format and is not generated from a live AI vision model on your captured photo.";

  if (task === "read_text") {
    return {
      isDemo: true,
      task,
      description:
        "Sample document reading: 'Paracetamol 500 mg Tablets — Take one tablet after meals as directed by your physician. Expiry: 08/2027.' Some smaller lines at the bottom edge appear slightly blurry.",
      objects: [
        { name: "Printed medicine strip", position: "Center of frame", confidence: "clear" },
        { name: "Dosage label block", position: "Upper center", confidence: "clear" },
      ],
      uncertaintyNote,
    };
  }

  if (task === "find_object") {
    return {
      isDemo: true,
      task,
      description:
        "Sample object search: A stainless-steel water bottle appears on the right side of the table, and a pair of eyeglasses rests near the front-left edge.",
      objects: [
        { name: "Water bottle", position: "Right side, mid-distance", confidence: "clear" },
        { name: "Eyeglasses", position: "Front-left corner", confidence: "approximate" },
        { name: "Notebook", position: "Center", confidence: "clear" },
      ],
      uncertaintyNote,
    };
  }

  if (task === "ask_image") {
    const q = followUpQuestion?.trim() || "What details stand out here?";
    return {
      isDemo: true,
      task,
      description: `Sample answer to "${q}": The scene appears to be a well-lit indoor desk with a wooden surface, a ceramic mug on the right, and a small potted plant on the left. Lighting is even, though background details are soft.`,
      objects: [
        { name: "Wooden table", position: "Foreground, center", confidence: "clear" },
        { name: "Ceramic mug", position: "Right side", confidence: "clear" },
        { name: "Potted plant", position: "Left side", confidence: "approximate" },
      ],
      uncertaintyNote,
    };
  }

  return {
    isDemo: true,
    task: "describe",
    description:
      "Sample scene description: There is a wooden table directly in front of you. A water bottle is on the right side, a notebook sits in the center, and a small potted plant is on the left. Please rely on your cane or guide for safe movement.",
    objects: [
      { name: "Wooden table", position: "Directly ahead", confidence: "clear" },
      { name: "Water bottle", position: "Right side of table", confidence: "clear" },
      { name: "Potted plant", position: "Left side of table", confidence: "clear" },
      { name: "Chair backrest", position: "Further back, slightly right", confidence: "approximate" },
    ],
    uncertaintyNote,
  };
}

/**
 * Service layer prepared for future backend conversational AI integration.
 */
export async function askVoiceAssistant(question: string): Promise<{
  answer: string;
  isDemo: boolean;
}> {
  await new Promise((resolve) => setTimeout(resolve, 850));
  const lower = question.toLowerCase();

  if (lower.includes("read") || lower.includes("text") || lower.includes("document") || lower.includes("label")) {
    return {
      isDemo: true,
      answer:
        "I can read printed text for you. Open Camera Assistance to capture a label or document. In this demo, a sample label reads: 'Filter Coffee — Roasted & Ground, 250 grams. Best before December 2026.'",
    };
  }
  if (lower.includes("find") || lower.includes("where") || lower.includes("bottle") || lower.includes("keys")) {
    return {
      isDemo: true,
      answer:
        "Looking at the sample scene: the water bottle is on the right side of the wooden table, and your keys are near the front-left corner.",
    };
  }
  if (lower.includes("identify") || lower.includes("what is this") || lower.includes("holding")) {
    return {
      isDemo: true,
      answer:
        "In this demo preview, the object in the center appears to be a 500-rupee Indian currency note, folded once lengthwise. For real-time identification, connect a live AI vision backend.",
    };
  }

  return {
    isDemo: true,
    answer:
      "There is a wooden table in front of you. A water bottle is on the right side and a plant is on the left.",
  };
}