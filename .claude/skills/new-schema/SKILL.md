---
name: new-schema
description: >
  Use this skill when creating or modifying a Sanity CMS schema type for the portfolio.
  Triggers on: "add a schema", "create a content type", "add a [name] field",
  "update the schema", "add [field] to [type]", or any Sanity content model change.
---

# new-schema

Creates or modifies Sanity v3 schema types for the portfolio CMS.
All content — posts, projects, settings, uses items — flows through Sanity.
Getting schemas right is critical: bad schemas are painful to migrate later.

## Before Writing Any Code

Ask the following if not already clear:
1. **Operation** — New type, or adding/changing fields on existing type?
2. **Type name** — What is it called? (camelCase, singular: `post` not `posts`)
3. **Fields** — What data does it store? For each field: name, type, required?
4. **Relations** — Does it reference other document types?
5. **Which pages consume it** — Needed to write the right GROQ projection

## File Structure

```
/sanity/schemas/
  {typeName}.ts        ← create this
  index.ts             ← always update this after creating
```

## Schema File Template

```ts
// /sanity/schemas/{typeName}.ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const {typeName} = defineType({
  name: '{typeName}',
  title: '{Display Name}',
  type: 'document',
  // Icon from lucide-react — makes Studio navigation clearer
  // icon: SomeIcon,
  fields: [
    // Required fields first
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',         // auto-generates from title
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // Optional fields below
  ],

  // Controls Studio list view
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',   // adjust per type
    },
  },

  // Controls document ordering in Studio
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
```

## Field Type Reference

Use these exact patterns — they match the GROQ queries in the codebase.

### String (short text)
```ts
defineField({
  name: 'title',
  title: 'Title',
  type: 'string',
  validation: (Rule) => Rule.required().max(100),
})
```

### Text (multi-line, no rich text)
```ts
defineField({
  name: 'excerpt',
  title: 'Excerpt',
  type: 'text',
  rows: 3,
  validation: (Rule) => Rule.max(300),
})
```

### Portable Text (rich text body — use for all long-form content)
```ts
defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({ type: 'block' }),  // standard text blocks

    // Code block
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code Block',
      fields: [
        defineField({ name: 'language', type: 'string', title: 'Language' }),
        defineField({ name: 'code', type: 'text', title: 'Code' }),
        defineField({ name: 'filename', type: 'string', title: 'Filename (optional)' }),
      ],
    }),

    // Callout box
    defineArrayMember({
      type: 'object',
      name: 'calloutBox',
      title: 'Callout Box',
      fields: [
        defineField({
          name: 'type',
          type: 'string',
          options: { list: ['insight', 'warning', 'business'] },
        }),
        defineField({ name: 'body', type: 'text', title: 'Content' }),
      ],
    }),

    // Image with caption
    defineArrayMember({
      type: 'object',
      name: 'imageWithCaption',
      fields: [
        defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'caption', type: 'string' }),
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
      ],
    }),

    // Video embed (YouTube / Loom)
    defineArrayMember({
      type: 'object',
      name: 'videoEmbed',
      fields: [
        defineField({ name: 'url', type: 'url', title: 'Video URL' }),
        defineField({ name: 'caption', type: 'string' }),
      ],
    }),
  ],
})
```

### Image (with hotspot)
```ts
defineField({
  name: 'coverImage',
  title: 'Cover Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
```

### Reference (to another document type)
```ts
defineField({
  name: 'author',
  title: 'Author',
  type: 'reference',
  to: [{ type: 'author' }],
  validation: (Rule) => Rule.required(),
})
```

### Array of strings (tags, tech stack)
```ts
defineField({
  name: 'tags',
  title: 'Tags',
  type: 'array',
  of: [defineArrayMember({ type: 'string' })],
  options: {
    layout: 'tags',    // renders as tag input in Studio
  },
})
```

### Array of strings with predefined options (perspective)
```ts
defineField({
  name: 'perspective',
  title: 'Perspective',
  type: 'array',
  of: [defineArrayMember({ type: 'string' })],
  options: {
    list: [
      { title: 'Engineering', value: 'engineering' },
      { title: 'Product', value: 'product' },
      { title: 'Business', value: 'business' },
    ],
  },
  validation: (Rule) => Rule.required().min(1),
})
```

### DateTime
```ts
defineField({
  name: 'publishedAt',
  title: 'Published At',
  type: 'datetime',
  options: { dateFormat: 'YYYY-MM-DD' },
})
```

### Number
```ts
defineField({
  name: 'readTime',
  title: 'Read Time (minutes)',
  type: 'number',
  validation: (Rule) => Rule.min(1).max(60),
})
```

### URL
```ts
defineField({
  name: 'url',
  title: 'URL',
  type: 'url',
  validation: (Rule) =>
    Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
})
```

## Updating the Schema Index

After creating any new schema file, always update `/sanity/schemas/index.ts`:

```ts
// /sanity/schemas/index.ts
import { post } from './post'
import { project } from './project'
import { author } from './author'
import { usesItem } from './usesItem'
import { siteSettings } from './siteSettings'
import { {newTypeName} } from './{newTypeName}'   // ← add this

export const schemaTypes = [
  post,
  project,
  author,
  usesItem,
  siteSettings,
  {newTypeName},   // ← and this
]
```

## After Creating the Schema

1. Use Sanity MCP to verify the schema deployed correctly:
   - Ask: "Check that the {typeName} schema is visible in the development dataset"
2. Write a matching GROQ query using `/groq` skill
3. Run: `npx sanity documents validate`
4. Generate TypeScript types: `npx sanity typegen generate`
   - Outputs to `/sanity/types.ts` — never edit this file manually

## Common Mistakes to Avoid

- ❌ Using `type: 'object'` at the document level (use `defineType` with `type: 'document'`)
- ❌ Forgetting to add the new type to `schemas/index.ts`
- ❌ Using `default export` — always named export matching the type name
- ❌ Skipping `alt` text field on image types
- ❌ Not running `typegen generate` after schema changes
- ❌ Hardcoding list options as plain strings without `{ title, value }` shape
