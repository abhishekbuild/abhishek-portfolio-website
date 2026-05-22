export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
}

export interface CaseStudyStep {
  _key: string;
  num: string;
  title: string;
  desc: string;
}

export interface CaseStudyTradeoff {
  _key: string;
  option: string;
  reason: string;
}

export interface BusinessMetric {
  _key: string;
  label: string;
  value: string;
}

export interface ImpactMetric {
  _key: string;
  value: string;
  label: string;
  highlight: boolean;
}

export interface CaseStudy {
  problem: {
    label: string;
    heading: string;
    body: string;
    items: string[];
  };
  approach: {
    label: string;
    heading: string;
    steps: CaseStudyStep[];
  };
  engineering: {
    label: string;
    heading: string;
    archDiagram: SanityImage;
    archDiagramCaption: string;
    codeSnippet: string;
    codeLanguage: string;
    codeFilename: string;
    keyDecision: string;
  };
  product: {
    label: string;
    heading: string;
    wireframe: SanityImage;
    wireframeCaption: string;
    body: string;
    tradeoffs: CaseStudyTradeoff[];
  };
  business: {
    label: string;
    heading: string;
    body: string;
    metrics: BusinessMetric[];
  };
  results: {
    label: string;
    heading: string;
    metrics: ImpactMetric[];
    body: string;
  };
  reflection: {
    label: string;
    heading: string;
    paragraphs: string[];
  };
}

export interface ProjectLinks {
  github?: string;
  demo?: string;
  paper?: string;
}

export interface ProjectNavRef {
  title: string;
  slug: { current: string };
  thumbnail: SanityImage;
}

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  thumbnail: SanityImage;
  coverImage: SanityImage;
  techStack: string[];
  perspective: string[];
  status: string;
  timeline: string;
  role: string;
  impact: string;
  categories: string[];
  featured: boolean;
  order: number;
  links: ProjectLinks;
  caseStudy?: CaseStudy;
  prevProject?: ProjectNavRef;
  nextProject?: ProjectNavRef;
}

export interface ProjectCard
  extends Pick<
    Project,
    | "_id"
    | "title"
    | "slug"
    | "summary"
    | "thumbnail"
    | "perspective"
    | "status"
    | "impact"
    | "categories"
    | "featured"
    | "order"
    | "links"
  > {
  techStack: string[];
}
