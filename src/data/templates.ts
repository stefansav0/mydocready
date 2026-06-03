import { ResumeElement } from "@/types/resume";

interface TemplateType {
  id: string;

  name: string;

  category: string;

  preview: string;

  bgColor: string;

  elements: ResumeElement[];
}

export const templates: TemplateType[] = [
  {
    id: "modern",

    name: "Modern Developer",

    category: "Professional",

    preview: "/templates/modern.webp",

    bgColor: "#ffffff",

    elements: [
      {
        id: "1",

        type: "text",

        content: "JOHN DOE",

        x: 60,

        y: 60,

        w: 500,

        h: 60,

        fontSize: 42,

        fontWeight: "bold",

        color: "#1e40af",

        fontFamily: "Inter",

        textAlign: "left",
      },

      {
        id: "2",

        type: "text",

        content: "Full Stack Developer",

        x: 60,

        y: 120,

        w: 300,

        h: 30,

        fontSize: 18,

        color: "#475569",

        fontFamily: "Inter",
      },

      {
        id: "3",

        type: "text",

        content:
          "PROFILE",

        x: 60,

        y: 200,

        w: 200,

        h: 30,

        fontSize: 18,

        fontWeight: "bold",

        color: "#111827",
      },

      {
        id: "4",

        type: "text",

        content:
          "Passionate developer with experience building scalable modern applications.",

        x: 60,

        y: 240,

        w: 650,

        h: 80,

        fontSize: 15,

        color: "#4b5563",

        fontFamily: "Inter",
      },

      {
        id: "5",

        type: "text",

        content:
          "SKILLS",

        x: 60,

        y: 360,

        w: 200,

        h: 30,

        fontSize: 18,

        fontWeight: "bold",

        color: "#111827",
      },

      {
        id: "6",

        type: "text",

        content:
          "React.js\nNext.js\nTypeScript\nNode.js\nTailwind CSS",

        x: 60,

        y: 400,

        w: 300,

        h: 150,

        fontSize: 15,

        color: "#4b5563",
      },
    ],
  },

  {
    id: "minimal",

    name: "Minimal ATS",

    category: "ATS",

    preview: "/templates/minimal.webp",

    bgColor: "#ffffff",

    elements: [
      {
        id: "11",

        type: "text",

        content: "YOUR NAME",

        x: 50,

        y: 50,

        w: 500,

        h: 50,

        fontSize: 36,

        fontWeight: "bold",

        color: "#000000",
      },

      {
        id: "12",

        type: "text",

        content:
          "email@example.com | +91 9999999999 | portfolio.com",

        x: 50,

        y: 100,

        w: 600,

        h: 25,

        fontSize: 14,

        color: "#4b5563",
      },

      {
        id: "13",

        type: "text",

        content:
          "EXPERIENCE",

        x: 50,

        y: 180,

        w: 300,

        h: 30,

        fontSize: 18,

        fontWeight: "bold",

        color: "#111827",
      },

      {
        id: "14",

        type: "text",

        content:
          "Frontend Developer - ABC Company\n2022 - Present",

        x: 50,

        y: 220,

        w: 600,

        h: 60,

        fontSize: 15,

        color: "#4b5563",
      },
    ],
  },

  {
    id: "creative",

    name: "Creative Designer",

    category: "Creative",

    preview: "/templates/creative.webp",

    bgColor: "#f8fafc",

    elements: [
      {
        id: "21",

        type: "text",

        content: "ALEX CARTER",

        x: 70,

        y: 80,

        w: 500,

        h: 60,

        fontSize: 44,

        fontWeight: "bold",

        color: "#7c3aed",
      },

      {
        id: "22",

        type: "text",

        content:
          "UI/UX Designer",

        x: 70,

        y: 140,

        w: 300,

        h: 30,

        fontSize: 20,

        color: "#6d28d9",
      },
    ],
  },

  {
    id: "dark",

    name: "Dark Professional",

    category: "Modern",

    preview: "/templates/dark.webp",

    bgColor: "#111827",

    elements: [
      {
        id: "31",

        type: "text",

        content: "MICHAEL SMITH",

        x: 60,

        y: 60,

        w: 500,

        h: 60,

        fontSize: 42,

        fontWeight: "bold",

        color: "#ffffff",
      },

      {
        id: "32",

        type: "text",

        content:
          "Software Engineer",

        x: 60,

        y: 120,

        w: 300,

        h: 30,

        fontSize: 18,

        color: "#d1d5db",
      },
    ],
  },
];