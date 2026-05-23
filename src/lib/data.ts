/**
 * Shared mock data. In production this will be served from Lovable Cloud
 * (Supabase) — see README "Future automation preparation" for integration
 * touchpoints.
 */

import roofAgeImage from "@/assets/resources/roof-age.png";
import roofRenewalWarningImage from "@/assets/resources/roof-renewal-warning-signs.png";
import roofingScamImage from "@/assets/resources/roofing-scam-door-to-door.png";
import fourPointInspectionImage from "@/assets/resources/four-point-inspection-family.png";
import windMitigationImage from "@/assets/resources/wind-mitigation-inspection.png";
import hurricanePrepImage from "@/assets/resources/hurricane-prep-supplies.png";
import waterDamageImage from "@/assets/resources/water-damage-response.png";
import metalVsShingleImage from "@/assets/resources/metal-vs-shingle-roof.png";

export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export const RISK_CATEGORIES = [
  { key: "roof", label: "Roof age & condition", description: "Florida insurers track roof age closely — past 15 years, renewal options drop sharply.", icon: "Home" },
  { key: "wind", label: "Wind mitigation credits", description: "Most homes are missing 1–3 credits worth $300–$1,200/yr in premium savings.", icon: "Wind" },
  { key: "flood", label: "Flood zone exposure", description: "FEMA zone changes can quietly require flood policies at renewal.", icon: "Waves" },
  { key: "fourpoint", label: "4-point inspection", description: "Roof, electrical, HVAC and plumbing — one failure can cancel coverage.", icon: "ClipboardCheck" },
  { key: "deductible", label: "Hurricane deductible", description: "Many homeowners don't realize their named-storm deductible is 2–5× standard.", icon: "PiggyBank" },
  { key: "claims", label: "Claims readiness", description: "Photos, receipts and policy copies stored before a storm pay off in weeks, not months.", icon: "Camera" },
] as const;

export const ARTICLES = [
  {
    slug: "why-florida-insurance-cares-about-roof-age",
    title: "Why Florida insurance companies care about roof age",
    excerpt: "Roof age is the single biggest variable in Florida renewal decisions. Here's what carriers actually look at.",
    category: "Roofing Education",
    categorySlug: "roofing-education",
    readMinutes: 6,
    author: "HomeShield Editorial",
    publishedAt: "May 4, 2026",
    featured: true,
    tags: ["roof", "renewal", "underwriting"],
    image: roofAgeImage,
  },
  {
    slug: "5-signs-your-roof-may-hurt-your-insurance-renewal",
    title: "5 signs your roof may hurt your insurance renewal",
    excerpt: "Curling shingles, exposed nails, granule loss — what underwriters flag before non-renewal letters go out.",
    category: "Roofing Education",
    categorySlug: "roofing-education",
    readMinutes: 5,
    author: "HomeShield Editorial",
    publishedAt: "Apr 22, 2026",
    tags: ["roof", "inspection"],
    image: roofRenewalWarningImage,
  },
  {
    slug: "door-to-door-roofing-scam-after-hurricanes",
    title: "The door-to-door roofing scam after hurricanes",
    excerpt: "Storm chasers move fast. Here's the exact script they use — and how to shut it down at the door.",
    category: "Contractor Scam Alerts",
    categorySlug: "contractor-scam-alerts",
    readMinutes: 7,
    author: "HomeShield Editorial",
    publishedAt: "Apr 18, 2026",
    featured: true,
    tags: ["scam", "contractor", "hurricane"],
    image: roofingScamImage,
  },
  {
    slug: "lost-coverage-after-ignoring-4-point",
    title: "How one family lost coverage after ignoring a 4-point inspection",
    excerpt: "A real-world cautionary case: the 4-point came back with three flags. They didn't act. Renewal didn't either.",
    category: "Claims Help",
    categorySlug: "claims-help",
    readMinutes: 8,
    author: "HomeShield Editorial",
    publishedAt: "Apr 9, 2026",
    tags: ["inspection", "claims"],
    image: fourPointInspectionImage,
  },
  {
    slug: "wind-mitigation-explained-plain-english",
    title: "Wind mitigation explained in plain English",
    excerpt: "Seven credits, one form, hundreds of dollars per year. Here's what each line on the OIR-B1-1802 actually means.",
    category: "Insurance Education",
    categorySlug: "insurance-education",
    readMinutes: 9,
    author: "HomeShield Editorial",
    publishedAt: "Mar 28, 2026",
    featured: true,
    tags: ["wind-mitigation", "credits", "savings"],
    image: windMitigationImage,
  },
  {
    slug: "prepare-home-before-hurricane-season",
    title: "How to prepare your home before hurricane season",
    excerpt: "Pre-June checklist: roof, openings, documents, evacuation. Calm, not panic.",
    category: "Hurricane Prep",
    categorySlug: "hurricane-prep",
    readMinutes: 10,
    author: "HomeShield Editorial",
    publishedAt: "Mar 14, 2026",
    tags: ["hurricane", "checklist"],
    image: hurricanePrepImage,
  },
  {
    slug: "what-to-do-after-water-damage",
    title: "What to do immediately after water damage",
    excerpt: "The first 72 hours decide your claim. Document, mitigate, communicate — in that order.",
    category: "Claims Help",
    categorySlug: "claims-help",
    readMinutes: 6,
    author: "HomeShield Editorial",
    publishedAt: "Mar 2, 2026",
    tags: ["water-damage", "claims"],
    image: waterDamageImage,
  },
  {
    slug: "metal-roof-vs-shingle-florida",
    title: "Metal roof vs shingle roof in Florida",
    excerpt: "Cost, longevity, insurance impact and resale. The honest tradeoffs no contractor will explain.",
    category: "Roofing Education",
    categorySlug: "roofing-education",
    readMinutes: 11,
    author: "HomeShield Editorial",
    publishedAt: "Feb 20, 2026",
    tags: ["roof", "materials"],
    image: metalVsShingleImage,
  },
];

export const RESOURCE_CATEGORIES = [
  { slug: "roofing-education", title: "Roofing Education", description: "How roofs affect coverage, age limits, materials and inspections.", count: 12 },
  { slug: "insurance-education", title: "Insurance Education", description: "Policies, deductibles, exclusions and renewals — in plain English.", count: 18 },
  { slug: "hurricane-prep", title: "Hurricane Prep", description: "Pre-season checklists, openings, documents and evacuation.", count: 9 },
  { slug: "flood-protection", title: "Flood Protection", description: "FEMA zones, NFIP basics, elevation certificates.", count: 7 },
  { slug: "mold-prevention", title: "Mold Prevention", description: "Humidity, drying, post-storm inspections, coverage limits.", count: 5 },
  { slug: "hvac-systems", title: "HVAC Systems", description: "Age, efficiency, maintenance and how AC age affects 4-points.", count: 6 },
  { slug: "home-maintenance", title: "Home Maintenance", description: "The 30-minute monthly walk that prevents 80% of insurance issues.", count: 8 },
  { slug: "contractor-scam-alerts", title: "Contractor Scam Alerts", description: "Door-to-door, AOB abuse, fake adjusters, permit fraud.", count: 11 },
  { slug: "inspection-guides", title: "Inspection Guides", description: "Wind mitigation, 4-point, roof, sewer scope — what each one looks at.", count: 9 },
  { slug: "claims-help", title: "Claims Help", description: "Filing, documenting, appealing and avoiding underpayment.", count: 10 },
];

export const SCAM_ALERTS = [
  {
    id: "storm-chaser-door-to-door",
    severity: "high" as const,
    title: "Storm chaser door-to-door roof inspections",
    summary: "Crews flooding a neighborhood within 48 hours of a storm offering 'free' inspections, often climbing the roof and creating damage.",
    tactics: ["Unsolicited knock within days of storm", "Out-of-state license plate", "Pressure to sign an Assignment of Benefits on the spot"],
    redFlags: ["No local license number", "Won't leave a written estimate", "Requires deposit by Zelle or cash"],
    posted: "May 12, 2026",
  },
  {
    id: "fake-public-adjuster",
    severity: "high" as const,
    title: "Fake public adjuster impersonation",
    summary: "Individuals claiming to be public adjusters or 'sent by your insurance' to inspect damage, then sell unrelated services.",
    tactics: ["Show fake ID badges", "Quote your policy number from public records", "Insist they need access to your attic immediately"],
    redFlags: ["Won't show Florida DFS license", "No appointment scheduled by carrier", "Refuse to wait for you to call your insurer"],
    posted: "May 5, 2026",
  },
  {
    id: "permit-pulling-scam",
    severity: "elevated" as const,
    title: "Contractor asks YOU to pull the permit",
    summary: "Licensed contractors who push the homeowner to pull the permit shift legal liability and almost always indicate unlicensed work.",
    tactics: ["'Saves you money on permit fees'", "'Faster if you do it'", "'My license is being renewed'"],
    redFlags: ["Any reason a licensed contractor cannot pull a permit themselves", "Discount offered for cash-only"],
    posted: "Apr 28, 2026",
  },
  {
    id: "aob-abuse",
    severity: "high" as const,
    title: "Assignment of Benefits (AOB) abuse",
    summary: "Contractors who require you to sign an AOB before any work, then bill your insurer for inflated or fabricated scope.",
    tactics: ["AOB included inside a standard estimate", "'Required to start work'", "Refuses to share final invoice with you"],
    redFlags: ["Insurer flagged your claim for AOB fraud", "Contractor sues your insurer in your name"],
    posted: "Apr 14, 2026",
  },
  {
    id: "pressure-financing",
    severity: "moderate" as const,
    title: "High-pressure financing at the door",
    summary: "Tablet-based financing apps used to lock homeowners into 9–18% loans for repairs that could be insurance-covered.",
    tactics: ["'Today only' discount", "Pre-filled financing application", "Quote pressure within 15 minutes"],
    redFlags: ["No itemized estimate", "Won't accept insurance payment", "Salesperson stays past your stated 'no'"],
    posted: "Apr 1, 2026",
  },
  {
    id: "deposit-disappears",
    severity: "high" as const,
    title: "Large deposit, then disappears",
    summary: "Demand for 40–60% upfront after a storm, then weeks of delay and ultimately no work performed.",
    tactics: ["Cash, Zelle or Venmo only", "Pressure to pay before materials are on-site", "New LLC formed after the storm"],
    redFlags: ["Business registered <90 days ago", "No physical address", "No referenceable past jobs in Florida"],
    posted: "Mar 22, 2026",
  },
];

export const STORM_CHECKLIST = {
  beforeSeason: [
    { label: "Photograph every room and serial-numbered item", detail: "Cloud-backup the photos. Your insurer will ask for a baseline." },
    { label: "Save a copy of your policy declaration page off-device", detail: "Email it to yourself and a trusted contact." },
    { label: "Confirm your hurricane deductible amount in dollars", detail: "Not just the percentage — calculate the actual dollar figure." },
    { label: "Trim trees and secure outdoor furniture storage location", detail: "Don't wait for a named storm to make a plan." },
    { label: "Test generator, inspect fuel storage, replace batteries", detail: "Generators sitting unused 11 months a year fail when needed." },
  ],
  watchWarning: [
    { label: "Fill bathtubs and large containers with water" },
    { label: "Charge all devices and portable batteries" },
    { label: "Bring in or secure anything that can become a projectile" },
    { label: "Photograph property exterior before the storm hits" },
    { label: "Locate and screenshot your evacuation zone" },
  ],
  afterStorm: [
    { label: "Document damage with timestamped photos and video before any cleanup" },
    { label: "Make only emergency repairs to prevent further damage", detail: "Tarping, boarding — save receipts." },
    { label: "File a claim with your insurer directly — not through a contractor" },
    { label: "Refuse unsolicited 'free' roof inspections", detail: "Verify any inspector against the Florida DBPR license database." },
    { label: "Wait for your adjuster before signing any AOB or repair contract" },
  ],
};

export const PROVIDERS = [
  { id: "p1", name: "Sunshine Wind Mitigation Inspections", type: "Wind Mitigation Inspector", region: "Tampa Bay", license: "HI-9842", rating: 4.9, reviews: 312, verified: true },
  { id: "p2", name: "Atlantic Coastal 4-Point Co.", type: "4-Point Inspector", region: "Miami–Dade", license: "HI-7733", rating: 4.8, reviews: 198, verified: true },
  { id: "p3", name: "PalmTree Roof Inspections", type: "Roof Inspector", region: "Orlando Metro", license: "HI-4421", rating: 4.7, reviews: 144, verified: true },
  { id: "p4", name: "Bayshore Mold Specialists", type: "Mold Specialist", region: "St. Petersburg", license: "MRSR-2210", rating: 4.9, reviews: 88, verified: true },
  { id: "p5", name: "First Response Storm Recovery", type: "Emergency Services", region: "Statewide", license: "FL-EMR-118", rating: 4.6, reviews: 421, verified: true },
  { id: "p6", name: "Coastline Insurance Review Group", type: "Insurance Reviewer", region: "Jacksonville", license: "PA-3387", rating: 4.8, reviews: 156, verified: true },
  { id: "p7", name: "Gulf Breeze Roof Inspections", type: "Roof Inspector", region: "Pensacola", license: "HI-9001", rating: 4.7, reviews: 102, verified: true },
  { id: "p8", name: "Tropical Mitigation Pros", type: "Wind Mitigation Inspector", region: "Fort Lauderdale", license: "HI-8810", rating: 4.9, reviews: 240, verified: true },
];
