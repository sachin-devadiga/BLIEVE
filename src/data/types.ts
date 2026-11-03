export interface JourneyStripItem {
  label: string;
  icon: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
  icon: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  for: string;
  icon: string;
  category: "learning" | "competition" | "community" | "support";
}

export interface JourneyStep {
  stage: string;
  description: string;
}

export interface Startup {
  name: string;
  pitch: string;
  founders: string[];
  stage: "Idea" | "MVP" | "Launched" | "Funded";
  logo: string;
}

export interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: "bootcamp" | "talk" | "hackathon" | "networking" | "challenge" | "announcement";
}

export interface PastEvent {
  title: string;
  date: string;
  highlights: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  category: string;
  content: string;
}

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface VisionStatement {
  statement: string;
  meta: string;
  targets: Stat[];
}

export interface LongTermGoal {
  value: string;
  label: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  phoneHref: string;
  location: string;
  instagramUrl: string;
  instagramHandle: string;
  mapQuery: string;
}
