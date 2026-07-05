import { KnowledgeArticle } from '@/types/reports';

const now = new Date().toISOString();

export const FALLBACK_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-1',
    title: 'Flood Prevention: A Community Playbook',
    slug: 'flood-prevention-playbook',
    excerpt:
      'Practical steps every household and neighborhood can take to reduce flood risk before, during, and after heavy rains.',
    content:
      'Floods are among the most disruptive environmental hazards Nigerian communities face. Prevention starts with clean, unblocked drainage, elevated waste storage, and simple neighborhood watch systems that report early warning signs.\n\nThis guide walks through actionable steps you can take today: clearing drains, protecting valuables, building sandbag barriers, identifying safe evacuation routes, and using ECHO to report high-risk areas so authorities can respond faster.',
    cover_image:
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=60',
    category: 'Flood Prevention',
    tags: ['floods', 'preparedness', 'community'],
    status: 'published',
    is_featured: true,
    read_time_minutes: 6,
    view_count: 1240,
    published_at: now,
    created_at: now,
  },
  {
    id: 'kb-2',
    title: 'Waste Management for Cleaner Neighborhoods',
    slug: 'waste-management-cleaner-neighborhoods',
    excerpt:
      'How proper waste sorting, collection scheduling, and reporting illegal dumps transform community health.',
    content:
      'Effective waste management reduces disease vectors, protects waterways, and beautifies public spaces. Start by separating organics, plastics, and hazardous items at source.\n\nUse the ECHO reporting tool to flag illegal dumpsites and overflowing bins. When authorities receive verified reports with photos and locations, response time drops dramatically.',
    cover_image:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=60',
    category: 'Waste Management',
    tags: ['waste', 'recycling', 'sanitation'],
    status: 'published',
    is_featured: false,
    read_time_minutes: 5,
    view_count: 860,
    published_at: now,
    created_at: now,
  },
  {
    id: 'kb-3',
    title: 'How to Report Blocked Drainage That Actually Gets Fixed',
    slug: 'reporting-blocked-drainage',
    excerpt:
      'A step-by-step guide to submitting drainage reports that agencies act on quickly.',
    content:
      'Blocked drains cause floods, breed mosquitoes, and damage roads. The difference between a report that sits idle and one that gets fixed comes down to detail.\n\nInclude a clear photo, precise location (drop a pin), the extent of the blockage, and any nearby landmarks. ECHO auto-verifies your submission and routes it to the responsible local government area.',
    cover_image:
      'https://images.unsplash.com/photo-1587613864411-3cc16ab35b47?auto=format&fit=crop&w=1200&q=60',
    category: 'Community Sanitation',
    tags: ['drainage', 'reporting', 'infrastructure'],
    status: 'published',
    is_featured: false,
    read_time_minutes: 4,
    view_count: 640,
    published_at: now,
    created_at: now,
  },
  {
    id: 'kb-4',
    title: 'Organizing a Successful Community Cleanup',
    slug: 'organizing-community-cleanup',
    excerpt:
      'Everything you need to run a safe, well-attended, high-impact cleanup event.',
    content:
      'A great cleanup begins two weeks before the event: choose a site, get local government sign-off, secure gloves and bags, and mobilize volunteers.\n\nOn the day, brief volunteers on safety, split into zones, weigh and photograph what you collect, and log the impact through ECHO to help the community track long-term progress.',
    cover_image:
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=60',
    category: 'Community Sanitation',
    tags: ['cleanup', 'volunteering', 'events'],
    status: 'published',
    is_featured: true,
    read_time_minutes: 7,
    view_count: 1020,
    published_at: now,
    created_at: now,
  },
  {
    id: 'kb-5',
    title: 'Understanding the Community Health Score',
    slug: 'community-health-score-explained',
    excerpt:
      'How ECHO calculates your community\'s environmental health score — and how to improve it.',
    content:
      'The Community Health Score blends four signals: hazard reports resolved, air and water quality data, active volunteer participation, and verified cleanup activity.\n\nEach signal is weighted and normalized to a 0–100 scale. Improving your score is straightforward: report hazards early, join local cleanups, and encourage neighbors to verify open reports.',
    cover_image:
      'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&w=1200&q=60',
    category: 'Environmental Health',
    tags: ['health-score', 'analytics', 'community'],
    status: 'published',
    is_featured: true,
    read_time_minutes: 5,
    view_count: 1580,
    published_at: now,
    created_at: now,
  },
  {
    id: 'kb-6',
    title: 'Climate Safety Tips for Nasarawa Residents',
    slug: 'climate-safety-tips-nasarawa',
    excerpt:
      'Region-specific guidance on heat waves, flash floods, and dry-season health risks in Nasarawa State.',
    content:
      'Nasarawa\'s climate swings from intense dry-season heat to sudden rainy-season flash floods. Households should stock oral rehydration salts, maintain elevated food storage, and identify one safe higher-ground meeting point per compound.\n\nECHO users can subscribe to hyper-local climate alerts and receive push notifications when regional weather stations detect elevated risk.',
    cover_image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60',
    category: 'Climate Change',
    tags: ['climate', 'nasarawa', 'safety'],
    status: 'published',
    is_featured: false,
    read_time_minutes: 6,
    view_count: 720,
    published_at: now,
    created_at: now,
  },
];
