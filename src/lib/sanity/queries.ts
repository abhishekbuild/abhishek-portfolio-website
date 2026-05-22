import { client } from "./client";
import type { Project, ProjectCard } from "./types";

const IMAGE_FIELDS = `{ _type, asset, alt, hotspot }`;

const PROJECT_CARD_FIELDS = `
  _id,
  title,
  slug,
  summary,
  thumbnail ${IMAGE_FIELDS},
  techStack,
  perspective,
  status,
  impact,
  categories,
  featured,
  order,
  links
`;

export async function getAllProjectCards(): Promise<ProjectCard[]> {
  return client.fetch(
    `*[_type == "project"] | order(featured desc, order asc) { ${PROJECT_CARD_FIELDS} }`
  );
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      summary,
      thumbnail ${IMAGE_FIELDS},
      coverImage ${IMAGE_FIELDS},
      techStack,
      perspective,
      status,
      timeline,
      role,
      impact,
      categories,
      featured,
      order,
      links,
      caseStudy {
        problem { label, heading, body, items },
        approach { label, heading, steps[] { _key, num, title, desc } },
        engineering {
          label, heading,
          archDiagram ${IMAGE_FIELDS},
          archDiagramCaption,
          codeSnippet, codeLanguage, codeFilename,
          keyDecision
        },
        product {
          label, heading,
          wireframe ${IMAGE_FIELDS},
          wireframeCaption, body,
          tradeoffs[] { _key, option, reason }
        },
        business {
          label, heading, body,
          metrics[] { _key, label, value }
        },
        results {
          label, heading, body,
          metrics[] { _key, value, label, highlight }
        },
        reflection { label, heading, paragraphs }
      },
      "prevProject": *[_type == "project" && order < ^.order] | order(order desc) [0] {
        title, slug, thumbnail ${IMAGE_FIELDS}
      },
      "nextProject": *[_type == "project" && order > ^.order] | order(order asc) [0] {
        title, slug, thumbnail ${IMAGE_FIELDS}
      }
    }`,
    { slug }
  );
}

export async function getAllProjectSlugs(): Promise<{ slug: string }[]> {
  return client.fetch(
    `*[_type == "project"] { "slug": slug.current }`
  );
}
