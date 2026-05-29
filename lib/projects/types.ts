export interface Lesson {
  title: string;
  summary: string;
  full: string;
}

export interface ProjectOutputs {
  label: string;
  value: string;
}

export interface ProjectVisual {
  src: string;
  caption: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  year: string;
  type: string;
  skills: string[];
  tagline: string;
  descriptionLead?: string;
  description: string;
  image?: string;
  imageCaption?: string;
  visuals?: ProjectVisual[];
  outputs?: ProjectOutputs[];
  links?: ProjectLink[];
  lessons: Lesson[];
  redos: string[];
  specifics?: string;
}
