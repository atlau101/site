import { ProjectData } from './types';

export const chambergptProject: ProjectData = {
  slug: 'chambergpt',
  title: 'ChamberGPT',
  year: 'Spring 2025',
  type: 'AI · Workflows · Automation',
  skills: ['Voiceflow', 'Platform Evaluation', 'AI & Chatbots', 'No-Code'],
  tagline: 'A member/guest-facing support chatbot for the SF Chamber of Commerce, built on Voiceflow with $0 budget.',
  description: `Led an end-to-end project for the San Francisco Chamber of Commerce's Business Development team, building a member & guest-facing chatbot designed to answer questions across four knowledge domains: General Services, Marketing, Small Business Development, and Public Policy Advocacy. The bot was projected to reduce inbound inquiries by 20–30% and increase membership conversion by 5–10%, all on a zero budget. I also developed a detailed handoff memo for whoever inherited the project, covering full workflow documentation, known issues, platform limitations, and future ideas.`,
  outputs: [
    { label: 'Support Coverage', value: '4 recurring member-service domains in one bot flow' },
    { label: 'Projected Inquiry Deflection', value: '20–30% fewer repetitive inbound questions' },
    { label: 'Projected Membership Lift', value: '5–10% increase in membership conversion' },
  ],
  visuals: [
    {
      src: '/proj-attachments/chambergpt/screenshot-6.png',
      caption: 'Overarching workflow: full bot architecture from entry to resolution.',
    },
    {
      src: '/proj-attachments/chambergpt/screenshot-5.png',
      caption: 'Intro block: User enters the conversation and sees the welcome message.',
    },
    {
      src: '/proj-attachments/chambergpt/screenshot-4.png',
      caption: 'Category selection: Member chooses a topic area to route their question. Branch tracks if they ask something else.',
    },
    {
      src: '/proj-attachments/chambergpt/screenshot-3.png',
      caption: 'Knowledge base search triggered by semantic similarity matching, based on question.',
    },
    {
      src: '/proj-attachments/chambergpt/screenshot-2.png',
      caption: 'LLM generates an answer from retrieved knowledge base chunks.',
    },
    {
      src: '/proj-attachments/chambergpt/screenshot-1.png',
      caption: 'Agent prompt: System instruction and guardrails governing bot behavior. Red team tested.',
    },
  ],
  lessons: [
    {
      title: 'Scoping is half the work.',
      summary: 'An open brief is a test — you need to interview stakeholders to understand what matters.',
      full: 'The project brief I was originally handed was broad: create a general purpose tool centered around AI for members. Due to this, my first pass was too broad: basically an AI assistant that could answer anything about SF business. To narrow it down, I had to interview department heads to understand what questions members actually asked. That process took longer than I expected. It also produced better results than any of my initial ideas would have.',
    },
    {
      title: 'A $0 budget is a design constraint, not a footnote.',
      summary: 'Budget constraints force thoughtful design decisions.',
      full: 'I evaluated 15 platforms before landing on Voiceflow. Open-source options (Rasa, Botpress) were free but required Python I didn\'t have and server infrastructure the Chamber didn\'t have. No-code platforms had credit limits — and on Voiceflow\'s free plan, every single message costs a credit, AI or prewritten. That made every design decision (how many intro messages, how the loop worked) a cost decision. I wouldn\'t have thought that carefully about flow architecture if budget hadn\'t forced me to.',
    },
    {
      title: 'Platform evaluation is its own skill.',
      summary: 'Vendor comparison requires systematic analysis of tradeoffs.',
      full: 'Before I built anything, I spent time working through Botpress, Rasa, Tidio, Intercom, Drift, HubSpot, ManyChat, Zendesk, Google Dialogflow, Microsoft Bot Framework, and several others. That was my first real vendor evaluation — comparing pricing models, deployment requirements, scalability tradeoffs. The research mattered: Voiceflow was the right call for the constraints.',
    },
    {
      title: 'Organizational dynamics shape a job.',
      summary: 'You have to work within institutional dynamics, not around them.',
      full: 'This was my first true internship, where I was employed and working in a functioning company. As a student, you\'re responsible for and allowed to make decisions end-to-end. However, in my first couple weeks, I had to learn to acknowledge organizational constraints. Outdated processes, layers of approval, etc. I learned to be wary of what I can control and what I can\'t, and to work with the constraints I was given.',
    },
  ],
  redos: [
    `Nowadays, this project wouldn't be all that impressive given how much AI coding has improved in just the last year alone. **If I were given this project again with the tools I have now and the knowledge I have now I'd scrap Voiceflow entirely.** In my handoff memo, I listed a third option alongside Voiceflow and Botpress: build and host the chatbot yourself with Python and LLM API calls. I ruled it out because it was "best suited for someone with CS experience." That was true in Spring 2025. It isn't true now. AI-assisted development tools have closed the gap between what I can imagine and what I can actually build.`,
    `**The custom solution I couldn't take then is the obvious choice today** — direct LLM API calls (Claude, GPT-4o, Gemini), a proper vector database (Pinecone, Supabase, Chroma) with separate namespaces per category, metadata filtering on queries. Handfuls of other issues I ran into with Voiceflow would be nonexistent now. And instead of 100 platform credits burning through in a few test conversations, LLM API calls for this kind of Q&A cost fractions of a cent.`,
    `**The bigger change is what the bot could actually do.** Every feature I hadn't added: capturing membership leads, routing inquiries to the right person, integrating with Salesforce — those are agentic workflows now. The passive FAQ tool becomes something that can take actions. That was imaginable then. Instead, it's buildable now.`,
  ],
  specifics: `## Chatbot Architecture

The flow: intro message → button block (4 category options + a freetext "no match" path) → user types a question → the message is captured in a variable called \`{last_utterance}\` → KB search runs against it via semantic similarity → top-N chunks returned → prompt block generates an answer → "anything else?" → loops back.

Chunk mechanics: each KB source document gets split into 150–300 word passages with content and metadata (source doc ID, location, topical tags). When a query runs, the system retrieves chunks by semantic similarity, ranks them by relevance score, and feeds the top-N to the LLM as context.

Two tunable parameters: **Chunk Limit** (max chunks returned per search; too many creates noise; too few risks missing relevant detail) and **Minimum Chunk Score** (relevance threshold; anything below gets discarded).

The precision/recall tradeoff was the main ongoing issue. Low threshold (0.3–0.5): higher recall, more noise. High threshold (0.7–0.9): higher precision, risk of missing borderline content. I had consistent trouble getting the right content for questions with specific answers — permit procedures would sometimes return event listings, small business grant info would return general membership content. The flat KB architecture was the root cause.

## System Prompt and Guardrails

The production system prompt pulled only from KB chunks, answered exactly what was asked — no outside info, no speculation. Response structure: process queries get numbered steps; informational queries get bullet lists or a short paragraph. Escalation: "I'm sorry, I don't have that information. Please email us at info@sfchamber.com." I also wrote a question simplifier — a pre-processing prompt that rewrote convoluted or multi-part user inputs into a single clean query before it hit the KB.
`,
};
