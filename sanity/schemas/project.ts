import { defineType, defineField, defineArrayMember } from "sanity";

const linkFields = [
  defineField({ name: "github", title: "GitHub URL", type: "url" }),
  defineField({ name: "demo", title: "Live Demo URL", type: "url" }),
  defineField({ name: "paper", title: "Paper / Docs URL", type: "url" }),
];

const imageWithAlt = defineArrayMember({
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (R) => R.required(),
    }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({ name: "thumbnail", type: "image", options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })] }),
    defineField({
      name: "techStack",
      type: "array",
      of: [{ type: "string" }],
      description: "Technology tags shown in hero (e.g. Python, LangGraph)",
    }),
    defineField({
      name: "perspective",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Engineering", value: "Engineering" },
          { title: "Product", value: "Product" },
          { title: "Business", value: "Business" },
          { title: "Research", value: "Research" },
        ],
      },
    }),
    defineField({
      name: "status",
      type: "string",
      options: { list: ["SHIPPED", "IN PROGRESS", "STABLE", "ARCHIVED"] },
    }),
    defineField({ name: "timeline", type: "string", description: 'e.g. "4 months"' }),
    defineField({ name: "role", type: "string", description: 'e.g. "Solo Architect"' }),
    defineField({
      name: "impact",
      type: "text",
      rows: 2,
      description: "One-liner impact shown in project cards (in quotes)",
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "LLMs & Agents", value: "LLMs & Agents" },
          { title: "RAG & Search", value: "RAG & Search" },
          { title: "Tools & Products", value: "Tools & Products" },
          { title: "Research", value: "Research" },
          { title: "Business Impact", value: "Business Impact" },
        ],
      },
    }),
    defineField({
      name: "featured",
      type: "boolean",
      description: "Show as a full-width featured card on /projects",
      initialValue: false,
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower = appears first. Controls prev/next navigation on case study.",
    }),
    defineField({ name: "links", type: "object", fields: linkFields }),

    /* ── Case Study ───────────────────────────────────────────────────────── */
    defineField({
      name: "caseStudy",
      title: "Case Study",
      type: "object",
      description: "Fill this out for projects with a full /projects/[slug] case study page.",
      fields: [
        defineField({
          name: "problem",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", initialValue: "Engineering Challenge" }),
            defineField({ name: "heading", type: "string" }),
            defineField({ name: "body", type: "text" }),
            defineField({ name: "items", type: "array", of: [{ type: "string" }] }),
          ],
        }),
        defineField({
          name: "approach",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", initialValue: "Strategic Framework" }),
            defineField({ name: "heading", type: "string" }),
            defineField({
              name: "steps",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "step",
                  fields: [
                    defineField({ name: "num", type: "string", description: "e.g. 01, 02" }),
                    defineField({ name: "title", type: "string" }),
                    defineField({ name: "desc", type: "text", rows: 2 }),
                  ],
                  preview: { select: { title: "title", subtitle: "num" } },
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "engineering",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", initialValue: "Technical Deep-dive" }),
            defineField({ name: "heading", type: "string" }),
            defineField({ name: "archDiagram", type: "image", options: { hotspot: true },
              fields: [defineField({ name: "alt", type: "string" })] }),
            defineField({ name: "archDiagramCaption", type: "string" }),
            defineField({ name: "codeSnippet", type: "text", rows: 12 }),
            defineField({ name: "codeLanguage", type: "string", description: 'e.g. "Python 3.10"' }),
            defineField({ name: "codeFilename", type: "string", description: 'e.g. "graph_definition.py"' }),
            defineField({ name: "keyDecision", type: "text", rows: 3 }),
          ],
        }),
        defineField({
          name: "product",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", initialValue: "User Experience" }),
            defineField({ name: "heading", type: "string" }),
            defineField({ name: "wireframe", type: "image", options: { hotspot: true },
              fields: [defineField({ name: "alt", type: "string" })] }),
            defineField({ name: "wireframeCaption", type: "string" }),
            defineField({ name: "body", type: "text" }),
            defineField({
              name: "tradeoffs",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "tradeoff",
                  fields: [
                    defineField({ name: "option", type: "string" }),
                    defineField({ name: "reason", type: "text", rows: 2 }),
                  ],
                  preview: { select: { title: "option" } },
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "business",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", initialValue: "Commercial Viability" }),
            defineField({ name: "heading", type: "string" }),
            defineField({ name: "body", type: "text" }),
            defineField({
              name: "metrics",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "metric",
                  fields: [
                    defineField({ name: "label", type: "string" }),
                    defineField({ name: "value", type: "string" }),
                  ],
                  preview: { select: { title: "label", subtitle: "value" } },
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "results",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", initialValue: "Impact Metrics" }),
            defineField({ name: "heading", type: "string" }),
            defineField({
              name: "metrics",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "metric",
                  fields: [
                    defineField({ name: "value", type: "string", description: 'e.g. "60% ↓"' }),
                    defineField({ name: "label", type: "string", description: 'e.g. "Avg Latency"' }),
                    defineField({ name: "highlight", type: "boolean", description: "Show in primary/violet color", initialValue: false }),
                  ],
                  preview: { select: { title: "label", subtitle: "value" } },
                }),
              ],
            }),
            defineField({ name: "body", type: "text" }),
          ],
        }),
        defineField({
          name: "reflection",
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", initialValue: "Editorial Reflection" }),
            defineField({ name: "heading", type: "string" }),
            defineField({
              name: "paragraphs",
              type: "array",
              of: [{ type: "text" }],
              description: "Each item becomes a paragraph in the reflection section",
            }),
          ],
        }),
      ],
    }),
  ],

  orderings: [
    {
      title: "Manual Order",
      name: "manualOrder",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],

  preview: {
    select: { title: "title", subtitle: "status", media: "thumbnail" },
  },
});
