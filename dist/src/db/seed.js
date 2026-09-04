import { count } from "drizzle-orm";
import { db } from "./index.js";
import { companies, jobs, blogPosts } from "./schema.js";
import { slugify } from "../lib/utils.js";
const jobSeed = [
    {
        company: 0,
        title: "Senior Frontend Engineer",
        industry: "IT & Software",
        location: "Bangalore",
        workMode: "hybrid",
        employmentType: "full-time",
        experienceMin: 4,
        experienceMax: 8,
        salaryMin: 18,
        salaryMax: 28,
        summary: "Lead the web experience for a fast-growing SaaS platform used by 40,000+ businesses. React, TypeScript and a genuine say in product direction.",
        description: "You'll own the customer-facing web app end to end — from architecture decisions to the last pixel. The team is small, senior and ships weekly. You'll work directly with the founders on roadmap priorities and mentor two junior engineers as the product scales.",
        responsibilities: [
            "Own the React/Next.js application architecture and performance budget",
            "Partner with design on a component system used across products",
            "Mentor junior engineers through reviews and pairing",
            "Drive accessibility and Core Web Vitals improvements",
        ],
        requirements: [
            "4+ years building production React applications",
            "Strong TypeScript and modern CSS",
            "Experience with testing and CI/CD practices",
            "SaaS or startup background is a plus",
        ],
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        openings: 2,
        featured: true,
    },
    {
        company: 0,
        title: "Backend Engineer — Node.js",
        industry: "IT & Software",
        location: "Remote (India)",
        workMode: "remote",
        employmentType: "full-time",
        experienceMin: 3,
        experienceMax: 6,
        salaryMin: 14,
        salaryMax: 22,
        summary: "Build the APIs and event pipelines behind a platform processing millions of requests a day. Fully remote, async-first culture.",
        description: "We're looking for a backend engineer who loves clean domain modelling and boring, reliable systems. You'll design services in Node.js and Postgres, write integration tests that catch real bugs, and help keep p99 latency under 200ms as traffic doubles.",
        responsibilities: [
            "Design and build Node.js services and REST/GraphQL APIs",
            "Model data in PostgreSQL and own migrations",
            "Instrument observability and lead incident reviews",
            "Contribute to an RFC-driven design culture",
        ],
        requirements: [
            "3+ years with Node.js in production",
            "Solid SQL and data-modelling instincts",
            "Experience with queues, caching and idempotent design",
        ],
        skills: ["Node.js", "PostgreSQL", "Redis", "AWS"],
        openings: 1,
        featured: false,
    },
    {
        company: 0,
        title: "QA Automation Engineer (Contract)",
        industry: "IT & Software",
        location: "Bangalore",
        workMode: "hybrid",
        employmentType: "contract",
        experienceMin: 2,
        experienceMax: 5,
        salaryMin: 10,
        salaryMax: 16,
        summary: "Six-month contract (extendable) to build out Playwright-based end-to-end coverage across two flagship products.",
        description: "A contract role for someone who treats flaky tests as a personal insult. You'll stand up a Playwright suite from near-zero, wire it into CI, and leave behind a framework the in-house team can maintain.",
        responsibilities: [
            "Build a Playwright E2E suite integrated with CI",
            "Define test strategy with engineering leads",
            "Document patterns and hand over to the core team",
        ],
        requirements: [
            "2+ years in test automation",
            "Playwright or Cypress experience",
            "Comfortable reading TypeScript",
        ],
        skills: ["Playwright", "TypeScript", "CI/CD"],
        openings: 1,
        featured: false,
    },
    {
        company: 1,
        title: "Data Analyst — Lending Products",
        industry: "Finance & Banking",
        location: "Bangalore",
        workMode: "on-site",
        employmentType: "full-time",
        experienceMin: 2,
        experienceMax: 5,
        salaryMin: 10,
        salaryMax: 16,
        summary: "Turn lending data into decisions. SQL-heavy role partnering with credit risk and product teams at a well-funded NBFC.",
        description: "You'll be the analyst for our lending book — building dashboards leaders actually read, designing experiments on pricing and limits, and digging into cohort performance when numbers move. High-ownership seat with direct exposure to the leadership team.",
        responsibilities: [
            "Own KPI dashboards for portfolio health and growth",
            "Run pricing and eligibility experiments end to end",
            "Partner with credit risk on model monitoring",
        ],
        requirements: [
            "Advanced SQL; comfortable with large datasets",
            "Strong grasp of statistics and experimentation",
            "Python or R for analysis is a plus",
            "Fintech/BFSI experience preferred",
        ],
        skills: ["SQL", "Python", "Metabase", "Statistics"],
        openings: 1,
        featured: true,
    },
    {
        company: 1,
        title: "DevOps Engineer",
        industry: "Finance & Banking",
        location: "Bangalore",
        workMode: "hybrid",
        employmentType: "full-time",
        experienceMin: 4,
        experienceMax: 8,
        salaryMin: 16,
        salaryMax: 26,
        summary: "Own AWS infrastructure, Kubernetes clusters and deployment pipelines for a regulated fintech processing high-volume transactions.",
        description: "Security-minded DevOps engineer to run our cloud footprint: Terraform-managed AWS, EKS workloads, and compliance-aware deployment practices. You'll work closely with engineering leads to keep releases safe, fast and auditable.",
        responsibilities: [
            "Manage AWS (EKS, RDS, IAM) via Terraform",
            "Harden CI/CD with policy checks and audit trails",
            "Drive reliability: alerting, runbooks, DR drills",
        ],
        requirements: [
            "4+ years in DevOps/platform roles",
            "Kubernetes and Terraform in production",
            "Understanding of security baselines (CIS, ISO 27001 a plus)",
        ],
        skills: ["AWS", "Kubernetes", "Terraform", "GitHub Actions"],
        openings: 1,
        featured: false,
    },
    {
        company: 2,
        title: "Staff Nurse — ICU",
        industry: "Healthcare",
        location: "Bangalore",
        workMode: "on-site",
        employmentType: "full-time",
        experienceMin: 1,
        experienceMax: 5,
        salaryMin: 6,
        salaryMax: 9,
        summary: "Join a 300-bed multispecialty hospital's ICU team. Rotational shifts, structured training and a strong nursing culture.",
        description: "We're expanding our critical-care unit and hiring staff nurses who want real clinical growth. You'll work alongside experienced intensivists, with sponsored ACLS/BLS certification and clear progression to senior roles.",
        responsibilities: [
            "Deliver ICU nursing care to assigned patients",
            "Administer medication and monitor critical parameters",
            "Maintain accurate clinical documentation",
        ],
        requirements: [
            "GNM or B.Sc Nursing with valid KNC registration",
            "1+ year ICU/CCU experience preferred",
            "Calm, precise and compassionate under pressure",
        ],
        skills: ["Critical Care", "ACLS/BLS", "Patient Care"],
        openings: 6,
        featured: false,
    },
    {
        company: 2,
        title: "HR Business Partner — Clinical Teams",
        industry: "Healthcare",
        location: "Bangalore",
        workMode: "on-site",
        employmentType: "full-time",
        experienceMin: 4,
        experienceMax: 8,
        salaryMin: 9,
        salaryMax: 14,
        summary: "Partner with clinical leadership on staffing, engagement and retention for a 1,200-person hospital workforce.",
        description: "An HRBP role with a difference: your stakeholders are doctors, nurses and technicians. You'll own workforce planning for clinical units, run engagement programmes that reduce attrition, and coach unit heads on people decisions.",
        responsibilities: [
            "Own HR delivery for clinical units (~600 staff)",
            "Drive retention and engagement programmes",
            "Support workforce planning with department heads",
        ],
        requirements: [
            "4+ years HRBP experience, healthcare a strong plus",
            "Working knowledge of labour compliance",
            "Data-driven approach to attrition and engagement",
        ],
        skills: ["HRBP", "Employee Engagement", "Compliance"],
        openings: 1,
        featured: false,
    },
    {
        company: 3,
        title: "Production Supervisor — Assembly Line",
        industry: "Manufacturing",
        location: "Bangalore (Peenya)",
        workMode: "on-site",
        employmentType: "full-time",
        experienceMin: 3,
        experienceMax: 7,
        salaryMin: 7,
        salaryMax: 11,
        summary: "Run a 40-person assembly shift for an automotive components manufacturer. Lean mindset, safety-first leadership.",
        description: "You'll own daily production targets, line balancing and quality gates for a precision assembly line. The plant is modernising fast — expect exposure to automation upgrades and lean transformation projects.",
        responsibilities: [
            "Plan and run shift production to target",
            "Enforce safety and 5S standards on the floor",
            "Drive kaizen and line-balancing improvements",
        ],
        requirements: [
            "Diploma/BE with 3+ years on assembly lines",
            "Exposure to lean/kaizen methodologies",
            "Kannada and English communication",
        ],
        skills: ["Lean Manufacturing", "5S", "Shift Management"],
        openings: 2,
        featured: false,
    },
    {
        company: 4,
        title: "Category Manager — Home & Living",
        industry: "E-commerce & Retail",
        location: "Bangalore",
        workMode: "hybrid",
        employmentType: "full-time",
        experienceMin: 5,
        experienceMax: 9,
        salaryMin: 15,
        salaryMax: 22,
        summary: "Own P&L for a top-3 category at a leading e-commerce marketplace. Vendor strategy, pricing and assortment — full ownership.",
        description: "This is a business-owner role: you'll set the strategy for Home & Living, negotiate with national brands, and work with growth and supply-chain teams to hit ambitious GMV targets. Ideal for someone from marketplace category management or top-tier consulting.",
        responsibilities: [
            "Own category P&L, revenue and margin targets",
            "Lead vendor negotiations and joint business plans",
            "Shape assortment, pricing and promotion strategy",
        ],
        requirements: [
            "5+ years in category management/consulting",
            "Strong commercial negotiation track record",
            "Analytical depth in Excel/SQL",
        ],
        skills: ["Category Management", "Negotiation", "SQL", "Pricing"],
        openings: 1,
        featured: true,
    },
    {
        company: 5,
        title: "Performance Marketing Lead",
        industry: "Advertising & Media",
        location: "Bangalore",
        workMode: "hybrid",
        employmentType: "full-time",
        experienceMin: 4,
        experienceMax: 8,
        salaryMin: 8,
        salaryMax: 14,
        summary: "Lead paid acquisition for a portfolio of D2C brands at an independent creative agency. ₹2Cr+ monthly budgets, real creative freedom.",
        description: "You'll run performance strategy for 4–6 D2C clients: media planning, creative testing pipelines and CRO experiments. The agency pairs media buyers with its in-house studio, so your tests get great creative fast.",
        responsibilities: [
            "Own Meta/Google performance for D2C clients",
            "Design creative testing frameworks with the studio",
            "Report on CAC/LTV and drive CRO experiments",
        ],
        requirements: [
            "4+ years hands-on performance marketing",
            "Managed ₹1Cr+ monthly spends",
            "Fluent in analytics and attribution tooling",
        ],
        skills: ["Meta Ads", "Google Ads", "GA4", "CRO"],
        openings: 1,
        featured: false,
    },
    {
        company: 5,
        title: "UI/UX Designer",
        industry: "Advertising & Media",
        location: "Bangalore",
        workMode: "hybrid",
        employmentType: "full-time",
        experienceMin: 3,
        experienceMax: 6,
        salaryMin: 9,
        salaryMax: 15,
        summary: "Design digital experiences for consumer brands — from campaign sites to full product redesigns. Portfolio-first evaluation.",
        description: "A designer who thinks in systems and sweats micro-interactions. You'll work across brand and product projects, present to clients directly, and see your work ship fast. We review portfolios, not pedigree.",
        responsibilities: [
            "Design responsive web and product experiences",
            "Build and maintain Figma component libraries",
            "Present concepts to clients and iterate on feedback",
        ],
        requirements: [
            "3+ years in digital/product design",
            "A portfolio showing craft and systems thinking",
            "Figma fluency; motion skills a bonus",
        ],
        skills: ["Figma", "Design Systems", "Prototyping"],
        openings: 1,
        featured: false,
    },
    {
        company: 6,
        title: "Academic Counsellor",
        industry: "Education",
        location: "Bangalore",
        workMode: "on-site",
        employmentType: "full-time",
        experienceMin: 1,
        experienceMax: 4,
        salaryMin: 5,
        salaryMax: 8,
        summary: "Guide students and parents toward the right programmes at a growing ed-tech. Empathy + targets, in equal measure.",
        description: "You'll speak with prospective learners, understand their goals, and match them to programmes where they'll genuinely succeed. Backed by a strong training team and a no-pressure, consultative sales culture.",
        responsibilities: [
            "Counsel prospective students on programme fit",
            "Own the admission pipeline end to end",
            "Maintain CRM hygiene and follow-ups",
        ],
        requirements: [
            "1+ year in counselling/inside sales (education preferred)",
            "Excellent spoken English; Hindi/Kannada a plus",
            "Comfortable with consultative targets",
        ],
        skills: ["Counselling", "CRM", "Communication"],
        openings: 3,
        featured: false,
    },
    {
        company: 7,
        title: "Guest Relations Executive",
        industry: "Hospitality & Travel",
        location: "Bangalore",
        workMode: "on-site",
        employmentType: "full-time",
        experienceMin: 0,
        experienceMax: 3,
        salaryMin: 4,
        salaryMax: 6,
        summary: "Be the face of a boutique luxury property. Freshers from hospitality programmes welcome — grooming and training provided.",
        description: "A front-of-house role at a 60-room boutique hotel loved for its service. You'll handle check-ins, guest requests and the small surprises that turn a stay into a story. Structured training and rapid growth into duty management.",
        responsibilities: [
            "Manage check-in/check-out and guest queries",
            "Coordinate with F&B and housekeeping teams",
            "Handle feedback and service recovery",
        ],
        requirements: [
            "Hospitality diploma/degree (freshers welcome)",
            "Polished communication and grooming",
            "Flexibility for rotational shifts",
        ],
        skills: ["Guest Relations", "Front Office", "Communication"],
        openings: 2,
        featured: false,
    },
];
const companySeed = [
    {
        name: "TechVeda Labs",
        industry: "IT & Software",
        size: "51–200",
        location: "Bangalore",
        website: "https://example.com",
        description: "B2B SaaS for operations teams, trusted by 40,000+ businesses.",
    },
    {
        name: "Nimbus Fintech",
        industry: "Finance & Banking",
        size: "201–1000",
        location: "Bangalore",
        website: "https://example.com",
        description: "Digital lending platform making credit accessible across Bharat.",
    },
    {
        name: "CareFirst Hospitals",
        industry: "Healthcare",
        size: "1000+",
        location: "Bangalore",
        description: "Multispecialty hospital group with a nursing-first culture.",
    },
    {
        name: "Precision AutoWorks",
        industry: "Manufacturing",
        size: "201–1000",
        location: "Bangalore (Peenya)",
        description: "Tier-1 automotive components manufacturer serving global OEMs.",
    },
    {
        name: "ShopKart",
        industry: "E-commerce & Retail",
        size: "1000+",
        location: "Bangalore",
        description: "Marketplace connecting Indian brands with 100M+ shoppers.",
    },
    {
        name: "BrightAds Studio",
        industry: "Advertising & Media",
        size: "51–200",
        location: "Bangalore",
        description: "Independent creative agency for ambitious consumer brands.",
    },
    {
        name: "LearnBridge Education",
        industry: "Education",
        size: "201–1000",
        location: "Bangalore",
        description: "Career-focused learning programmes with 92% placement outcomes.",
    },
    {
        name: "Palm Grove Hotels",
        industry: "Hospitality & Travel",
        size: "11–50",
        location: "Bangalore",
        description: "Boutique stays known specifically for warm, personal service.",
    },
];
const blogSeed = [
    {
        slug: "cut-time-to-hire-without-cutting-corners",
        title: "How to Cut Time-to-Hire Without Cutting Corners",
        excerpt: "Slow hiring loses great candidates. Here are five structural fixes that speed things up while raising the bar — from sharper role definitions to tighter interview loops.",
        category: "Hiring",
        readMinutes: 6,
        authorName: "Tranquil Peeplz Editorial",
        coverImage: "https://images.pexels.com/photos/5439447/pexels-photo-5439447.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        content: `Every hiring manager knows the pain: the perfect candidate accepts another offer while your process is still scheduling round three. In competitive markets like Bangalore, the best candidates are off the market in ten to fifteen days. The answer isn't to rush — it's to redesign.

## Start with a sharper brief

Most hiring delays are born before the first CV arrives. A vague job description produces a flood of mismatched applications, which produces slow screening, which produces candidate drop-off. Spend one focused hour with the hiring manager defining what success looks like at 90 days and 12 months. That clarity cuts screening time dramatically.

## Compress the loop

Three rounds is usually enough if each round has a clear owner and question set. Map your loop: which round tests craft, which tests collaboration, which sells the opportunity? When interviews overlap, you're paying twice for the same signal.

## Decide in 24 hours

Feedback decays. Ask every interviewer to submit written feedback within 24 hours, and hold a fifteen-minute debrief within 48. Momentum is the single strongest signal you can send a candidate about your culture.

## Keep a warm bench

The teams that hire fastest don't start from zero. They maintain relationships with past finalists and referrals. A short quarterly note to your bench costs almost nothing and can fill a role in days.

## Measure the funnel

Track stage-by-stage conversion and time-in-stage. You can't fix what you haven't named — and in most funnels, the biggest leak is a stage nobody owns.`,
    },
    {
        slug: "contract-vs-permanent-staffing-mix",
        title: "Contract vs. Permanent: Designing the Right Staffing Mix",
        excerpt: "The strongest teams blend permanent hires with contract talent deliberately. A practical framework for deciding which roles to staff flexibly — and which to anchor.",
        category: "Staffing",
        readMinutes: 5,
        authorName: "Tranquil Peeplz Editorial",
        coverImage: "https://images.pexels.com/photos/7693729/pexels-photo-7693729.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        content: `Workforce planning used to be simple: decide headcount, open requisitions, hire permanently. Today the more interesting question is the mix — which roles belong to your permanent core, and which are better served by contract or temporary talent.

## Anchor roles that compound

Roles that accumulate context — product owners, engineering leads, key account managers — reward permanence. Their value grows with tenure, and turnover is disproportionately expensive. Anchor these.

## Flex roles that spike

QA surges before a release, retail staffing before Diwali, support capacity during a launch: demand that spikes and recedes is ideal territory for contract staffing. You buy exactly the capacity you need, and specialists stay specialists.

## Use contract-to-hire for uncertainty

When the role is real but the fit is uncertain — a new function, a first-of-its-kind hire — contract-to-hire de-risks both sides. Six months of real work beats six rounds of interviews for predicting success.

## Mind the hidden costs

Flexibility has a price: onboarding overhead, knowledge leakage, and the management attention contractors require. A healthy mix is usually 70–85% permanent core, with flexible layers around it — but let your demand curve, not habit, set the ratio.`,
    },
    {
        slug: "bangalore-talent-market-2026",
        title: "Bangalore's Talent Market in 2026: What Employers Should Know",
        excerpt: "Salaries are stabilising, hybrid is the default, and candidates are choosing culture over brand names. Notes from the front lines of India's busiest hiring market.",
        category: "Insights",
        readMinutes: 7,
        authorName: "Tranquil Peeplz Editorial",
        coverImage: "https://images.pexels.com/photos/9301835/pexels-photo-9301835.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        content: `Bangalore remains India's deepest talent pool, but the rules of engagement have shifted. Here's what we're seeing across hundreds of placements this year.

## Compensation has found its level

The frenzied salary inflation of the early 2020s has cooled. Packages for most engineering and business roles have plateaued, with premiums surviving only in genuinely scarce skill clusters — applied AI, platform engineering, and regulatory-literate fintech roles. Employers who still compete on salary alone are overpaying by 15–20%.

## Hybrid is the settled default

Three days in office has become the market standard for knowledge work. Companies insisting on five days on-site see their offer-acceptance rates fall by a third; fully remote roles attract seven to eight times the applicants. Leadership teams are learning to treat flexibility as infrastructure, not perk.

## Candidates read the culture fine-print

Employer brand used to mean the logo on the offer letter. Now candidates triangulate: Glassdoor, ex-employee LinkedIn messages, and pointed questions about attrition in the team they're joining. Teams with honest stories — even about hard problems — close candidates faster than teams with polished ones.

## The counteroffer epidemic continues

Roughly half of accepted offers in hot segments now trigger counteroffers. The antidote is engagement between offer and joining day: a welcome note from the manager, early invites to team rituals, and a clear 30-60-90 plan. The notice period is where offers go to die — guard it.`,
    },
    {
        slug: "interview-scorecards-that-predict-performance",
        title: "Interview Scorecards That Actually Predict Performance",
        excerpt: "Most interviews measure confidence, not competence. A well-designed scorecard fixes that. Here's a structure we've seen work across industries.",
        category: "Hiring",
        readMinutes: 5,
        authorName: "Tranquil Peeplz Editorial",
        coverImage: "https://images.pexels.com/photos/4344878/pexels-photo-4344878.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        content: `Unstructured interviews are charming and nearly useless. Decades of evidence say they predict job performance little better than a coin flip — yet most organisations still run them. The fix isn't more interviews; it's more structure.

## Score dimensions, not vibes

Break the role into four to six assessable dimensions: craft skill, problem decomposition, communication, collaboration, drive. Each interviewer owns a subset, and each dimension gets evidence-based questions with follow-ups.

## Anchor your scale

A 1–5 scale means nothing until it's anchored. Write down what a 2 and a 4 look like for each dimension, in behavioural terms. "Shipped a project alone under deadline pressure" is an anchor; "seems senior" is not.

## Capture evidence, not adjectives

Train interviewers to write what the candidate did and said, not how the answer felt. "Described debugging a production outage for two hours, then changing the deploy process" will help a debrief; "good communicator" will not.

## Debrief before discussion

Have every interviewer lock their scorecard before the group discussion. This single rule protects your process from the loudest voice in the room — and it's the cheapest accuracy improvement available.

Structure doesn't remove judgement. It aims it.`,
    },
];
/**
 * Idempotent seed: inserts companies, approved jobs and blog posts only when
 * the jobs table is empty. No user accounts exist in this build.
 */
export async function seedIfEmpty() {
    const [existing] = await db.select({ value: count() }).from(jobs);
    if ((existing?.value ?? 0) > 0) {
        return { seeded: false };
    }
    const companyIds = [];
    for (const c of companySeed) {
        const [company] = await db
            .insert(companies)
            .values({
            name: c.name,
            industry: c.industry,
            size: c.size,
            location: c.location,
            website: c.website ?? null,
            description: c.description,
        })
            .returning({ id: companies.id });
        companyIds.push(company.id);
    }
    for (const j of jobSeed) {
        const companyName = companySeed[j.company].name;
        await db.insert(jobs).values({
            companyId: companyIds[j.company],
            contactName: `${companyName} Hiring Team`,
            contactEmail: `careers@${slugify(companyName).replace(/-/g, "")}.example.com`,
            title: j.title,
            slug: `${slugify(j.title)}-${Math.random().toString(36).slice(2, 7)}`,
            industry: j.industry,
            location: j.location,
            workMode: j.workMode,
            employmentType: j.employmentType,
            experienceMin: j.experienceMin,
            experienceMax: j.experienceMax,
            salaryMin: j.salaryMin,
            salaryMax: j.salaryMax,
            summary: j.summary,
            description: j.description,
            responsibilities: j.responsibilities,
            requirements: j.requirements,
            skills: j.skills,
            openings: j.openings,
            featured: j.featured,
            status: "open",
        });
    }
    const [blogCount] = await db.select({ value: count() }).from(blogPosts);
    if ((blogCount?.value ?? 0) === 0) {
        for (const b of blogSeed) {
            await db.insert(blogPosts).values({
                slug: b.slug,
                title: b.title,
                excerpt: b.excerpt,
                category: b.category,
                readMinutes: b.readMinutes,
                authorName: b.authorName,
                coverImage: b.coverImage,
                content: b.content,
                publishedAt: new Date(),
            });
        }
    }
    const [after] = await db.select({ value: count() }).from(jobs);
    return { seeded: true, jobs: after?.value ?? 0 };
}
//# sourceMappingURL=seed.js.map