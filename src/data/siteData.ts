import type {
  Program,
  Startup,
  Event,
  PastEvent,
  BlogPost,
  Value,
  JourneyStep,
  Stat,
  JourneyStripItem,
  VisionStatement,
  LongTermGoal,
  ContactInfo,
} from "./types";

export interface SiteData {
  name: string;
  tagline: string;
  fullForm: string;
  academicYear: string;
  hashtag: string;
  heroDescription: string;
  mission: string;
  missionPillars: { pillar: string; practice: string }[];
  vision: VisionStatement;
  longTermGoals: LongTermGoal[];
  brandPhilosophy: { word: string; description: string; icon: string }[];
  audiences: { audience: string; offers: string }[];
  contact: ContactInfo;
  journey: JourneyStripItem[];
  stats: Stat[];
  programs: Program[];
  studentJourney: JourneyStep[];
  startups: Startup[];
  events: { upcoming: Event[]; past: PastEvent[] };
  blogPosts: BlogPost[];
  values: Value[];
}

export const siteData: SiteData = {
  name: "BLIEVE",
  tagline: "Where Belief Becomes Business.",
  fullForm: "Believe \u00b7 Learn \u00b7 Innovate \u00b7 Execute \u00b7 Venture \u00b7 Excel",
  academicYear: "2026\u201327",
  hashtag: "#BLIEVE100",

  heroDescription:
    "The student-run Entrepreneurship Cell of Aditya College of Engineering and Technology (ACET), Bengaluru \u2014 a structured pipeline that carries a student from an unformed idea through validation, mentorship and prototyping to a launch-ready venture.",

  mission:
    "To empower students through entrepreneurial education, innovation, mentorship, industry collaboration, and hands-on startup experiences that transform ideas into successful ventures.",

  missionPillars: [
    {
      pillar: "Entrepreneurial Education",
      practice:
        "Structured, practical curriculum on business fundamentals, delivered outside the standard academic calendar.",
    },
    {
      pillar: "Innovation",
      practice:
        "Dedicated time and space for students to explore genuinely new ideas, not just refine existing ones.",
    },
    {
      pillar: "Mentorship",
      practice:
        "A standing bench of alumni, faculty and industry mentors matched to teams by stage and domain.",
    },
    {
      pillar: "Industry Collaboration",
      practice:
        "Direct partnerships with startups and companies for pilots, internships and problem statements.",
    },
    {
      pillar: "Hands-On Experience",
      practice:
        "Every programme ends in a tangible artefact \u2014 a prototype, a pilot or a pitch \u2014 not a certificate alone.",
    },
  ],

  vision: {
    statement:
      "To build a generation of student entrepreneurs who transform belief into impactful ventures, creating innovation, employment, and sustainable change for society.",
    meta: "Official Vision Statement",
    targets: [
      { value: "100+", label: "Startups Incubated", icon: "Rocket" },
      { value: "10,000", label: "Direct & Indirect Jobs", icon: "Users" },
      { value: "5 Years", label: "To National Recognition", icon: "TrendingUp" },
    ],
  },

  longTermGoals: [
    {
      value: "Default",
      label: "Starting Point for Entrepreneurship at ACET",
    },
    {
      value: "Self-Sustaining",
      label: "Incubation Space That Outlives Any Single Batch",
    },
    {
      value: "Track Record",
      label: "Ventures Raising Capital or Reaching Profitability",
    },
    {
      value: "Replicable",
      label: "A Documented Model Other E-Cells Can Adopt",
    },
  ],

  brandPhilosophy: [
    {
      word: "Dream",
      icon: "Sparkles",
      description:
        "Every venture starts as an unreasonable picture of a future that does not yet exist. We protect the space for students to dream before they are asked how they will make money.",
    },
    {
      word: "Believe",
      icon: "Heart",
      description:
        "A dream becomes a venture only once someone decides to take it seriously enough to act. Belief is the decision to move from imagining to attempting.",
    },
    {
      word: "Build",
      icon: "Hammer",
      description:
        "Belief without a build is just an opinion. We push every idea toward a tangible artefact as fast as possible, because nothing teaches a founder faster than a real person reacting to a real thing.",
    },
    {
      word: "Lead",
      icon: "Flag",
      description:
        "Building a venture means building a team, and building a team means learning to lead people who did not have to say yes to you.",
    },
    {
      word: "Impact",
      icon: "Globe",
      description:
        "We measure success by the change a venture creates for a customer, a community or an industry \u2014 not by the size of the deck it was pitched with.",
    },
  ],

  audiences: [
    {
      audience: "Students",
      offers: "A structured path from idea to venture, mentorship, and a peer community of builders",
    },
    {
      audience: "Faculty",
      offers: "A channel to translate research and classroom ideas into real-world ventures",
    },
    {
      audience: "Alumni",
      offers: "A way to stay connected to campus and to mentor or invest in the next generation",
    },
    {
      audience: "Startups",
      offers: "Access to student talent, interns, and campus pilot opportunities",
    },
    {
      audience: "Investors",
      offers: "Early visibility into a curated pipeline of vetted student ventures",
    },
    {
      audience: "Incubators",
      offers: "A feeder programme of pre-validated teams ready for formal incubation",
    },
    {
      audience: "Industry Experts",
      offers: "A platform to mentor, judge, and shape the next generation of builders",
    },
  ],

  contact: {
    email: "president@blieve.in",
    phone: "+91 90198 08476",
    phoneHref: "+919019808476",
    location: "Aditya College of Engineering and Technology (ACET), Bengaluru",
    instagramUrl: "https://www.instagram.com/blieve_ecell",
    instagramHandle: "@blieve_ecell",
    mapQuery: "Aditya College of Engineering and Technology, Bengaluru",
  },

  journey: [
    { label: "Believe", icon: "Heart", description: "The entry point where students can voice an unfinished idea." },
    { label: "Learn", icon: "BookOpen", description: "Structured exposure to customer discovery, business models, unit economics and storytelling." },
    { label: "Innovate", icon: "Lightbulb", description: "Differentiate an idea and create genuine new value." },
    { label: "Execute", icon: "Target", description: "Turn the validated idea into a working prototype or MVP." },
    { label: "Venture", icon: "Rocket", description: "Formalise the idea into an actual business and acquire first customers." },
    { label: "Excel", icon: "TrendingUp", description: "Scale what works through growth strategy and fundraising readiness." },
  ],

  stats: [
    { value: "500+", label: "Students", icon: "Users" },
    { value: "4", label: "Ventures", icon: "Rocket" },
    { value: "9", label: "Portfolios", icon: "Layers" },
    { value: "14", label: "Programmes", icon: "BookOpen" },
  ],

  programs: [
    {
      id: 1,
      title: "Workshops",
      description:
        "Hands-on sessions on the practical skills founders need \u2014 customer discovery, business models, unit economics and pitching.",
      for: "All students building hard and soft business skills",
      icon: "BookOpen",
      category: "learning",
    },
    {
      id: 2,
      title: "Startup Bootcamps",
      description:
        "Intensive programmes that take an idea from napkin sketch to a defensible plan \u2014 ideation, validation and pitch preparation.",
      for: "Aspiring founders ready to validate and launch",
      icon: "Rocket",
      category: "learning",
    },
    {
      id: 3,
      title: "Founder Talks",
      description:
        "Conversations with founders, mentors and industry leaders sharing unfiltered stories of building companies from campus.",
      for: "Anyone curious about the startup journey",
      icon: "Megaphone",
      category: "learning",
    },
    {
      id: 4,
      title: "Hackathons",
      description:
        "Time-boxed building sprints where teams prototype solutions to real problems and ship something before the clock runs out.",
      for: "Developers, designers and problem-solvers",
      icon: "Zap",
      category: "competition",
    },
    {
      id: 5,
      title: "Pitch Competitions",
      description:
        "Regular pitch sessions with structured feedback from mentors, industry experts and investors \u2014 feedback first, trophies second.",
      for: "Ventures ready to present their idea",
      icon: "Target",
      category: "competition",
    },
    {
      id: 6,
      title: "Innovation Challenges",
      description:
        "Open challenges inviting students to solve real problems with original thinking \u2014 such as the #BLIEVE100 Poster Challenge.",
      for: "Students who want a reason to create",
      icon: "Lightbulb",
      category: "competition",
    },
    {
      id: 7,
      title: "Business Plan Competitions",
      description:
        "Teams develop comprehensive business plans and defend them live in front of industry veterans.",
      for: "Teams with research-backed business concepts",
      icon: "Award",
      category: "competition",
    },
    {
      id: 8,
      title: "Mentorship",
      description:
        "Structured pairing with mentors from industry and academia, matched to teams by stage and domain.",
      for: "Students with early-stage ideas needing guidance",
      icon: "Users",
      category: "support",
    },
    {
      id: 9,
      title: "Incubation",
      description:
        "Dedicated workspace, structured programme milestones and operational support past the prototype stage.",
      for: "Teams with validated ideas ready to build",
      icon: "Building2",
      category: "support",
    },
    {
      id: 10,
      title: "Investor Connect",
      description:
        "Curated introductions to angel investors and early-stage funds interested in campus-born startups.",
      for: "Founders seeking early-stage capital",
      icon: "IndianRupee",
      category: "support",
    },
    {
      id: 11,
      title: "Networking",
      description:
        "Meetups connecting students, alumni, founders and professionals \u2014 relationships built here outlast college.",
      for: "Anyone building their professional network",
      icon: "Handshake",
      category: "community",
    },
    {
      id: 12,
      title: "Industrial Visits",
      description:
        "Organised visits to startups and companies to understand real-world operations and scaling challenges.",
      for: "Students wanting exposure to real businesses",
      icon: "Compass",
      category: "community",
    },
    {
      id: 13,
      title: "Startup Tours",
      description:
        "Walkthroughs of incubators and startup ecosystems beyond campus, to see how ventures grow in the wild.",
      for: "Students curious about the wider ecosystem",
      icon: "Globe",
      category: "community",
    },
    {
      id: 14,
      title: "Community Outreach",
      description:
        "Initiatives where ventures address community challenges \u2014 building impact alongside business sense.",
      for: "Students passionate about purpose-driven ventures",
      icon: "Heart",
      category: "community",
    },
  ],

  studentJourney: [
    { stage: "Student Joins BLIEVE", description: "Sign up, attend orientation, and join a community of driven peers." },
    { stage: "Learns", description: "Structured exposure to customer discovery, business models and the fundamentals of building." },
    { stage: "Builds Skills", description: "Develop technical, business and leadership skills through hands-on projects." },
    { stage: "Gets Mentorship", description: "Get paired with mentors who guide your thinking and challenge your assumptions." },
    { stage: "Validates Idea", description: "Test hypotheses with real users. Fail fast, learn faster." },
    { stage: "Builds MVP", description: "Develop a minimum viable product and put it in front of early adopters." },
    { stage: "Launches Startup", description: "Formalise the venture, find first customers, and begin the real journey." },
    { stage: "Raises Funding", description: "Pitch to investors, secure seed capital, and fuel growth." },
    { stage: "Creates Jobs", description: "Scale the venture, hire the first team, and create economic impact." },
  ],

  startups: [],

  events: {
    upcoming: [
      {
        title: "Next Challenge \u2014 Coming Soon",
        date: "Dates to be announced",
        time: "",
        location: "ACET, Bengaluru",
        description:
          "We are cooking up something exciting. Stay tuned for the next BLIEVE challenge \u2014 bigger prizes, bigger ideas, bigger impact. Follow @blieve_ecell for the announcement.",
        type: "announcement",
      },
    ],
    past: [
      {
        title: "BLIEVE Poster Challenge",
        date: "10\u201312 Aug 2026",
        highlights:
          "Our first open design challenge \u00b7 \u20b969 entry \u00b7 \u20b91,000 and \u20b9500 prizes \u00b7 Results announced 13 Aug 2026",
      },
    ],
  },

  blogPosts: [
    {
      slug: "why-we-dropped-the-first-letter",
      title: "Why We Dropped the First Letter",
      author: "Sachin",
      date: "Aug 5, 2026",
      excerpt:
        "BLIEVE takes its name from the middle of the word 'believe'. Here is what the missing letter stands for \u2014 and why it shapes everything we run.",
      category: "About BLIEVE",
      content:
        "BLIEVE takes its name from the middle of the word 'believe' \u2014 deliberately dropping the first letter to signal that belief is only the starting point, not the destination. What follows the drop, Learn, Innovate, Execute, Venture, Excel, is the actual work of entrepreneurship. The name is a roadmap disguised as a word.\n\nEvery startup begins with belief \u2014 a conviction, usually held by one or two people, that something the world currently accepts as normal does not have to stay that way. Before there is a product, a customer, or a rupee of revenue, there is only belief, and it is almost always unreasonable. Every founder we admire was, at the very beginning, someone who chose to trust an idea before the world gave them any reason to.\n\nBut belief alone has never built anything. Every entrepreneur we have studied paired that belief with courage \u2014 the willingness to say the idea out loud, to show a rough prototype to a stranger, to ask for the first sale before the product was ready. Courage is what turns a private conviction into a public attempt.\n\nAnd even courage is not enough. Ideas are abundant; execution is rare. The students on our campus are not short on ideas \u2014 walk into any hostel common room and you will hear three good ones before dinner. What is missing is the infrastructure to execute: the mentorship, the deadlines, the co-founders, and the first hundred users. Execution is where belief becomes something real, and execution is where BLIEVE puts almost all its effort.\n\nThat is why BLIEVE is built as a continuous pipeline rather than a single flagship event. Belief needs a place to go the moment it appears \u2014 not a one-day workshop, but a system that carries it through learning, building, and launching.\n\nThe first letter is dropped because we were never interested in stopping at belief. If you have one, bring us your unreasonable idea.",
    },
    {
      slug: "belief-courage-execution",
      title: "Belief, Courage, Execution: How Ideas Actually Get Built",
      author: "Mohammed Maaz",
      date: "Jul 28, 2026",
      excerpt:
        "Three stages separate an idea that stays a conversation from one that becomes a company. Most teams stall at the second.",
      category: "Insights",
      content:
        "When students bring an idea to us, the conversation usually goes the same way. There is belief \u2014 genuine excitement about a problem worth solving. What rarely follows is the next two steps, and that gap is where most campus ideas quietly die.\n\nBelief is the easy part. It costs nothing, requires no evidence, and feels good. The problem is that belief is private. It lives in your head, unchallenged, and an unchallenged idea does not improve. It just gets more precious.\n\nCourage is the second stage, and it is where most teams stall. Saying the idea out loud to a stranger, showing a rough prototype to someone who might laugh, asking a classmate to pay for something that barely works \u2014 these acts feel small but they change everything. They convert a private conviction into a public attempt, and public attempts gather feedback. Feedback is the raw material of every good product.\n\nExecution is the third stage, and the rarest. Ideas are abundant; execution is not. In our mentorship sessions, the question that matters is never 'is this a good idea?' It is 'what did you build this week?' Progress is measured in prototypes, conversations and trials \u2014 not in plans.\n\nAs mentors, our job is to push teams from stage to stage. Belief gets encouragement. Courage gets cover \u2014 someone standing next to you when you show the rough version. Execution gets structure: deadlines, milestones, and a next step small enough to actually finish.\n\nIf you are stuck, do not ask whether your idea is good enough. Ask which of the three stages you are in, and what the very next act of courage or execution looks like. Usually it is smaller than you think.",
    },
    {
      slug: "the-nine-stage-journey",
      title: "The Nine-Stage Journey From Idea to Jobs",
      author: "Sushritha S H",
      date: "Aug 1, 2026",
      excerpt:
        "Joining, learning, validating, building, launching, hiring \u2014 the full path every BLIEVE team moves along, and why it loops backwards.",
      category: "Programs",
      content:
        "Every programme we design maps onto one path: Student Joins BLIEVE, Learns, Builds Skills, Gets Mentorship, Validates Idea, Builds MVP, Launches Startup, Raises Funding, Creates Jobs. If you remember nothing else about how BLIEVE works, remember these nine stages.\n\nThe first four stages are about preparation. Joining puts you in a room with people who are also trying to build something, which matters more than any single workshop. Learning covers the foundations \u2014 customer discovery, business models, unit economics, storytelling. Skill-building happens through doing, not listening: you write the copy, build the landing page, run the interview. Mentorship then gives you someone who has made expensive mistakes before, so you can borrow their judgement instead of paying full price for your own.\n\nThe next three stages are about proof. Validation is where most ideas should die, and that is fine \u2014 an idea that survives contact with real users has earned its next step. Building an MVP is deliberately modest: the smallest thing that lets a real person solve a real problem. Launching is when the venture stops being a project and starts having customers.\n\nThe final two stages, raising funding and creating jobs, are outcomes rather than tasks. Funding follows traction more often than it follows slides, and jobs are what happen when a venture grows beyond its founders.\n\nOne important detail: this journey is iterative by design. Teams move back from MVP to validation as they learn \u2014 sometimes repeatedly. That is not failure; it is the loop working as intended.\n\nWherever you are on this path right now, there is a programme, a mentor, and a portfolio at BLIEVE built for that exact stage.",
    },
    {
      slug: "recap-blieve-poster-challenge-2026",
      title: "Recap: The BLIEVE Poster Challenge",
      author: "Abhishek T",
      date: "Aug 14, 2026",
      excerpt:
        "Three days, a \u20b969 entry fee, and students from every branch designing what entrepreneurship looks like on our campus. Here is how our first challenge went.",
      category: "Events",
      content:
        "From 10 to 12 August 2026, BLIEVE hosted its first open poster design challenge at ACET, Bengaluru. Students from all branches were invited to create an original poster that captured the spirit of entrepreneurship \u2014 belief, creation, and inspiration. The challenge ran for three days, giving participants time to ideate, design, and submit their best work.\n\nThe format was simple on purpose. A \u20b969 entry fee kept the field honest, the brief was open enough that no two entries looked alike, and every submission had to answer one question: what does entrepreneurship mean on this campus?\n\nWinners were announced on 13 August 2026, with a \u20b91,000 first prize and a \u20b9500 second prize. More important than the prizes was what the challenge proved \u2014 that when you give students a concrete brief and a real deadline, they show up. Entries came from branches that had never participated in a BLIEVE activity before.\n\nDesign was a deliberate choice for our first challenge. Before we ask students to pitch ventures or write business plans, we wanted to start with something anyone could enter \u2014 no coding, no capital, no co-founders required. Belief, it turns out, looks good on a poster.\n\nThe next challenge is in the works, with bigger prizes and bigger ideas. Follow @blieve_ecell to hear about it first.",
    },
  ],

  values: [
    { title: "Belief", description: "We take unproven ideas seriously, because every proven idea was once unproven.", icon: "Heart" },
    { title: "Innovation", description: "We reward ideas that create genuine new value over ideas that repackage something that already exists.", icon: "Lightbulb" },
    { title: "Integrity", description: "We expect founders to be honest about their numbers, their traction, and their failures.", icon: "Star" },
    { title: "Leadership", description: "We treat leadership as something practised on small teams before it is exercised on large ones.", icon: "Award" },
    { title: "Collaboration", description: "We believe ventures are built faster in the open than in isolation.", icon: "Users" },
    { title: "Impact", description: "We judge our programmes by what they change for someone else, not by attendance numbers.", icon: "Globe" },
  ],
};
