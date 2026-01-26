/**
 * Business Calendar Action Plans
 *
 * Wealth-code-aligned monthly action plans for business owners.
 * Each wealth code has 10 tasks with realistic varied durations, detailed hooks, 
 * 7-10 action steps, and 3 "what to avoid" points.
 */

import type { WealthCodeKey } from "../analysis_constants/wealth_code_mapping";

/**
 * Single task in the business calendar.
 */
export type BusinessCalendarTask = {
  /** Task number (1-10) */
  taskNum: number;
  /** Short task title */
  title: string;
  /** Hook/story that sets context */
  hook: string;
  /** Starting day (0-29) */
  startDay: number;
  /** Task duration in days */
  duration: number;
  /** Impact level for visual badge */
  impact: "high" | "medium" | "quick-win";
  /** Detailed action steps (expanded to 7-10) */
  actions: string[];
  /** What to avoid during this task (expanded to 3 points) */
  avoidPoints: string[];
};

/**
 * Complete action plan for a wealth code.
 */
export type BusinessCalendarPlan = {
  /** Wealth code key */
  key: WealthCodeKey;
  /** Display label */
  label: string;
  /** Month theme label (what the founder will focus on this month) */
  monthTheme: string;
  /** Tasks for this wealth code */
  tasks: BusinessCalendarTask[];
};

/**
 * Investment Brain action plan (Capital & ROI focused).
 */
const INVESTMENT_BRAIN_PLAN: BusinessCalendarPlan = {
  key: "investmentBrain",
  label: "Investment Brain",
  monthTheme: "Financial Optimization Month",
  tasks: [
    {
      taskNum: 1,
      title: "The 48-Hour Cash Reality Check",
      hook: "Most founders think they know where their money goes. Then they actually track it and find $3-5K/month in \"zombie spend.\" Here's the forensic audit that saved my client $47K in 6 months.",
      startDay: 0,
      duration: 3,
      impact: "quick-win",
      actions: [
        "Pull 90 days of bank & credit card statements into one spreadsheet → Tag every expense by category: Tools, Marketing, Team, Operations, \"WTF is this?\" Most founders discover 15-20% is unaccounted for",
        "Calculate your \"Cost Per Revenue Dollar\" for each category → Marketing spend ÷ Revenue generated = Your marketing tax → If you spend $1 to make $3, that's a 33% tax → Anything above 40% needs immediate attention",
        "Find the \"Zombie Subscriptions\" → Software you signed up for 8 months ago and forgot → Services on auto-renew that teams don't use → Average business has $800-2K/month in zombie spend",
        "Identify the \"Vanity Expenses\" → The premium tool when the basic plan works fine → The \"we might need it someday\" purchases → The \"everyone else uses it\" subscriptions",
        "Build your \"ROI Evidence File\" → For every expense over $200/month, document its value → Can you tie it to revenue? Customer satisfaction? Time saved? → If you can't justify it in 30 seconds, it's on the chopping block",
        "Calculate your \"Cash Conversion Cycle\" → How many days from spending $1 to earning it back? → Industry benchmark for SaaS: 30-90 days → If yours is >120 days, you have a cash flow problem, not a revenue problem",
        "Create a \"Stop Spending\" trigger list → Define scenarios that automatically freeze non-essential spending → Example: If monthly revenue drops 15%, all non-critical subscriptions pause → This prevents panic cuts that hurt the business",
      ],
      avoidPoints: [
        "The \"Cutting Muscle, Not Fat\" trap → Don't eliminate expenses that directly generate revenue → One client cut their $500/month ad spend... and lost $3K/month in sales → Real savings come from efficiency, not amputation",
        "The \"Analysis Paralysis\" trap → Don't spend 2 weeks building the perfect expense model → Get 80% done in 2 days, make decisions, move on → Perfection is procrastination in a suit",
        "The \"Set It and Forget It\" trap → This isn't a one-time audit → Schedule monthly 30-min \"cash reviews\" or costs creep back → What you don't track, you don't control",
      ],
    },
    {
      taskNum: 2,
      title: "Channel ROI Forensics: Where Your Money Really Goes",
      hook: "A founder came to me spending $12K/month on ads. I asked: \"Which channel makes you money?\" He said: \"I think Facebook?\" That \"I think\" cost him $84K in 7 months. Here's how we fixed it.",
      startDay: 3,
      duration: 3,
      impact: "high",
      actions: [
        "Map every single dollar spent in the last 180 days → Paid ads, content creation, partnerships, events, referrals → Include hidden costs: time, freelancers, tools → Most businesses discover 30-40% of spending is invisible",
        "Calculate true CAC (Customer Acquisition Cost) by channel → Total Channel Cost ÷ New Customers = Real CAC → Include ad spend + creative costs + tool fees + time investment → Most founders underestimate CAC by 50-70%",
        "Compute LTV (Lifetime Value) by original source → Track which channels bring customers who stay longest → Track which bring highest AOV (average order value) → A $500 CAC customer worth $5K LTV beats a $50 CAC customer worth $200 LTV",
        "Build your \"Payback Period\" spreadsheet → How long until a customer pays back their acquisition cost? → Industry benchmark: 3-12 months for most businesses → Channels with >18 month payback kill cash flow, even if profitable long-term",
        "Identify \"Vanity Channels\" that feel good but don't convert → 10K Instagram followers but 0 sales → Speaking gigs that boost ego but not revenue → PR mentions that don't drive qualified traffic",
        "Create a visual \"Channel Profitability Matrix\" → X-axis: Volume of customers → Y-axis: Profit per customer → Top-right quadrant = Scale these immediately → Bottom-left quadrant = Kill these immediately",
        "Set up real-time tracking dashboards → Don't wait for monthly reports → Use tools that show daily CAC, LTV, ROAS → What gets measured gets managed",
        "Run \"source cohort analysis\" → Compare customers from different channels over 6-12 months → Do Facebook customers churn faster than referrals? → Do LinkedIn leads have higher LTV than cold outbound? → This reveals where to invest for sustainable growth",
      ],
      avoidPoints: [
        "The \"Vanity Metrics\" trap → Impressions, reach, and followers don't pay bills → A channel with 10 customers at $1K profit beats 1000 followers with $0 profit → Focus ruthlessly on revenue and profit, not attention",
        "The \"Ignoring Time Cost\" trap → That \"free\" organic content took 40 hours to create → Your time has value → Calculate: (Your hourly rate × time spent) + direct costs = true channel cost",
        "The \"Attribution Confusion\" trap → Customer saw your ad, read your blog, then bought via email → Which channel gets credit? → Use \"first touch\" and \"last touch\" attribution → Understand the full customer journey, not just the final click",
      ],
    },
    {
      taskNum: 3,
      title: "The Kill/Keep/Scale Decision Sprint",
      hook: "The hardest business decision isn't starting something new. It's killing something you've invested in. But every dollar in a losing channel is a dollar not in a winning one. Here's the framework that helped a client reallocate $8K/month and 3x their ROI in 60 days.",
      startDay: 6,
      duration: 4,
      impact: "high",
      actions: [
        "Use the \"Bottom 20% Rule\" → Rank all channels by ROI (return on investment) → The bottom 20% are usually consuming 40% of your time and budget → These are your cut candidates",
        "Run the \"3-Month Test\" → Has this channel been profitable in the last 90 days? → If not, do you have a specific, testable hypothesis for why it will be in the next 30? → If you answer \"I hope so\" or \"maybe,\" it's time to kill it",
        "Calculate \"Opportunity Cost\" → That $2K/month in a losing channel could be $6K in profit if moved to a winning one → Make this math visible → Suddenly the decision becomes obvious",
        "Document your \"Stop-Loss Framework\" → Define clear criteria for when to exit a channel → Example: If CAC stays >$500 for 3 months and LTV is $400, stop immediately → Remove emotion from the decision",
        "Communicate the \"Why\" to your team → Don't just announce cuts → Show the data, explain the reasoning → Frame it as \"reallocating to what works\" not \"giving up\"",
        "Set \"revival triggers\" for paused channels → Market conditions change → Maybe Facebook doesn't work now, but might in 6 months → Define what would make you re-test it",
        "Execute the reallocation immediately → Don't let money sit in limbo → Move budget to proven winners within 48 hours → Speed matters in capitalizing on what works",
      ],
      avoidPoints: [
        "The \"Sunk Cost Fallacy\" trap → \"But we already spent $10K on this!\" → That money is gone regardless → The question is: Should you spend another $10K? → Judge channels by future potential, not past investment",
        "The \"Shiny Object\" trap → Killing a losing channel is great → But don't immediately chase the next new thing → Double down on proven winners first → Innovation comes after optimization",
        "The \"Fear of Missing Out\" trap → \"But what if this channel takes off next month?\" → Set clear revival criteria → If metrics hit X, you can always restart → Opportunity cost of waiting usually exceeds the upside of persistence",
      ],
    },
    {
      taskNum: 4,
      title: "The 3-Bucket Budget System: Stop Guessing, Start Controlling",
      hook: "A founder asked me: \"Should I spend this $5K on ads or hire a freelancer?\" I said: \"Your budget should answer that for you.\" Most businesses don't have a budget—they have a wishlist with numbers.",
      startDay: 10,
      duration: 3,
      impact: "medium",
      actions: [
        "Design your \"60/25/15 Framework\" → 60% Operations (keeping the lights on) → 25% Growth (tested channels + experiments) → 15% Emergency Reserve (unexpected opportunities or disasters)",
        "Define \"Operating Bucket\" rules → Payroll, core tools, essential services → These are non-negotiable → Calculate your \"minimum operating cost\" → This is your business survival number",
        "Structure your \"Growth Bucket\" → 80% goes to proven channels (ROI >2x) → 20% goes to experiments (new channels, offers, audiences) → Never let experiments exceed 20% → Most businesses fail by betting too much on unproven ideas",
        "Build your \"Emergency Reserve\" criteria → Only for genuine emergencies or rare opportunities → Define \"emergency\" clearly → Example: Key hire becomes available, competitor goes under, platform change requires fast pivot",
        "Set approval thresholds per bucket → Operating: Team can spend up to $X without approval → Growth: Requires data showing projected ROI → Emergency: Founder-only approval",
        "Create visual dashboards showing bucket health → Use color coding: Green (healthy), Yellow (approaching limit), Red (over budget) → Make budget status visible to leadership team → Transparency drives accountability",
        "Schedule monthly budget reviews → Are the buckets balanced? → Is growth spending generating returns? → Does the framework need adjustment? → Good budgets evolve with the business",
      ],
      avoidPoints: [
        "The \"Growth at All Costs\" trap → Don't allocate 50% to experiments before validating unit economics → Saw a startup burn $200K testing 15 channels → They should have put $150K into the 2 channels that worked → Growth comes from optimization first, experimentation second",
        "The \"Zero Emergency Fund\" trap → Business opportunities come unexpectedly → A client had a chance to acquire a competitor's client list for $5K → They had no reserve and missed it → That list would have generated $40K in year one",
        "The \"Set It and Forget It Budget\" trap → Markets change, channels shift, teams grow → Review budgets quarterly at minimum → A budget from January is often wrong by June → Stay flexible and data-driven",
      ],
    },
    {
      taskNum: 5,
      title: "Micro-Bet Portfolio: Test Fast, Fail Cheap, Scale Winners",
      hook: "Big bets break businesses. Small bets build them. Here's how we turned $4K into $47K in 90 days by running 6 tiny experiments instead of one big campaign.",
      startDay: 13,
      duration: 4,
      impact: "high",
      actions: [
        "Design your \"$500-$2K Test Matrix\" → Each experiment gets a tiny budget → Run 3-5 tests simultaneously → This spreads risk and accelerates learning",
        "Structure each test with these 5 elements → Clear hypothesis (\"I believe X will drive Y\") → Success metric (revenue, leads, engagement—pick ONE) → Time limit (7-14 days max) → Stop-loss trigger (if metric hits Z, stop immediately) → Scale trigger (if metric exceeds A, double budget)",
        "Choose your 3-5 test variables → New channel (TikTok, Reddit, podcasts) → New offer (bundle, payment plan, upsell) → New audience (different industry, company size, role) → New message (pain point, benefit angle, social proof type) → Only change ONE variable per test",
        "Set up \"real-time tracking\" for each test → Check metrics daily, not weekly → Use simple spreadsheet or tool like Google Sheets → Track: spend, conversions, CAC, revenue → Fast feedback loops = faster decisions",
        "Run \"post-mortem reviews\" after each test → Winner or loser, document what you learned → What worked? What didn't? Why? → Share learnings with team → One failed test with good documentation is more valuable than a win you don't understand",
        "Build your \"Scale Fast\" playbook → If a test hits success metrics, immediately 2-3x the budget → Don't wait for perfection → Speed compounds when you have a winner → Document the playbook so you can replicate it",
        "Create a \"Test Pipeline\" → Always have 3 tests running → As one finishes, start another → Continuous testing = continuous growth → Companies that stop testing stop growing",
      ],
      avoidPoints: [
        "The \"Too Many Variables\" trap → Changing 3 things at once means you don't know what worked → Test one variable at a time → Yes, it's slower. But you actually learn something → Speed without learning is just expensive noise",
        "The \"Falling in Love with the Idea\" trap → You think this test will be \"the one\" → You ignore the data because you want it to work → Kill losers fast. The faster you kill losers, the faster you find winners → Emotion kills ROI",
        "The \"Scaling Too Early\" trap → Test hit 2 conversions and you're ready to bet the farm → Small sample sizes lie → Wait for statistical significance (usually 30+ data points) → Patience in validation saves pain in scaling",
      ],
    },
    {
      taskNum: 6,
      title: "Unit Economics Documentation: Know Your Numbers or Die Slowly",
      hook: "A founder told me: \"We're growing fast!\" I asked: \"Are you profitable per customer?\" He paused. \"I... think so?\" That \"think so\" is why 82% of businesses fail. Not from lack of customers. From lack of understanding the math.",
      startDay: 17,
      duration: 3,
      impact: "high",
      actions: [
        "Build your \"Business Math Bible\" spreadsheet → This single document will save your business → Include: CAC, LTV, payback period, contribution margin, churn rate → Update monthly → Make it your most important document",
        "Calculate CAC (Customer Acquisition Cost) by segment → Don't average all customers together → Break down by: source, product, customer size, industry → A $200 CAC for SMBs might be great, but terrible for enterprise → Segment or die",
        "Compute LTV (Lifetime Value) with churn factored in → Avg purchase value × Purchase frequency × Avg customer lifespan → Most founders overestimate LTV by 40-60% → Be conservative in your estimates → It's better to be surprised by profit than crushed by loss",
        "Determine your \"Payback Period\" → How many months until a customer pays back their acquisition cost? → Formula: CAC ÷ (Monthly revenue per customer - Monthly cost to serve) → Target: <12 months for most businesses → >18 months kills cash flow even if profitable long-term",
        "Map your \"Contribution Margin\" per customer → Revenue - Direct Costs = Contribution Margin → This tells you if you can afford to grow → If margin is 20%, you need 5 customers to pay for 1 customer acquisition → Low margins mean slow growth",
        "Identify your \"most profitable segments\" → Which customers are easiest to acquire? → Which stay longest? Which spend most? → Focus your growth efforts here → One client found that 15% of customers drove 60% of profit → They fired the bottom 20% and margins jumped 35%",
        "Set \"red line metrics\" that trigger alarms → If CAC exceeds $X, stop that channel → If churn exceeds Y%, pause growth and fix retention → If payback period hits Z months, freeze new spending → Automate these alerts so you never miss them",
        "Share these numbers with your leadership team → Everyone should know the math → Sales should know CAC targets → Marketing should know LTV goals → When everyone understands the unit economics, decisions get better",
      ],
      avoidPoints: [
        "The \"Averaging Everything\" trap → \"Our average CAC is $200\" hides the truth → Maybe Facebook CAC is $50 and Google is $500 → You're subsidizing losers with winners → Segment your data or you'll make terrible decisions",
        "The \"Vanity LTV\" trap → Calculating LTV based on \"best customers\" not average ones → Or assuming 0% churn (no one stays forever) → Overstating LTV justifies bad spending → Be brutally honest with your numbers",
        "The \"Ignoring Cash Flow\" trap → \"We're profitable on paper!\" → But if payback period is 24 months, you'll run out of cash before you see profit → Unit economics without cash flow analysis is incomplete → Know both",
      ],
    },
    {
      taskNum: 7,
      title: "The Vendor Negotiation Sprint: Slash Costs Without Cutting Value",
      hook: "Most founders pay full price because they never ask for a discount. I saved a client $23K annually in 3 days by asking one question: \"What's your best price?\" Here's the system.",
      startDay: 20,
      duration: 3,
      impact: "quick-win",
      actions: [
        "Identify your \"Top 10 Recurring Expenses\" → Software, services, contractors, platforms → Sort by monthly cost (highest first) → These are your negotiation targets → Even 10-20% savings here compounds to $10K-50K annually",
        "Research competitive alternatives for each → Don't negotiate without leverage → Find 2-3 alternatives for each vendor → Know their pricing, features, and terms → Screenshot competitive pricing to show vendors",
        "Run the \"3-Question Negotiation Script\" → Question 1: \"We're reviewing all vendors this quarter—what's your best renewal price?\" → Question 2: \"We're comparing you to [Competitor]—they're offering X. Can you match or beat that?\" → Question 3: \"If we prepay annually, what discount can you offer?\" → These 3 questions save 15-30% on average",
        "Target 15-25% cost reduction per vendor → Start by asking for 30% (anchor high) → Settle for 15-20% → If they won't negotiate, threaten to switch → 40% of vendors will give a discount when you actually start canceling",
        "Negotiate contract terms, not just price → Ask for monthly instead of annual (preserve cash flow) → Ask for performance clauses (if tool has >X downtime, partial refund) → Ask for rollover (unused seats/credits carry forward) → Terms matter as much as price",
        "Batch negotiations in one week → Tell vendors \"I'm reviewing all tools this week\" → Creates urgency on their side → Sales reps have quotas and will discount to close fast → Use time pressure to your advantage",
        "Document new agreements and set renewal reminders → Lock in new pricing for 12-24 months → Set calendar reminders 60 days before renewal → Renegotiate every cycle → What you negotiate once, you can negotiate again",
      ],
      avoidPoints: [
        "The \"No Alternatives Researched\" trap → Vendors know when you're bluffing → If you haven't researched competitors, they'll call your bluff → Do the homework or don't negotiate → Leverage is everything",
        "The \"Threatening Without Following Through\" trap → If you say \"I'll cancel,\" be ready to actually cancel → Vendors track who's serious and who's posturing → If you back down once, you lose credibility forever",
        "The \"Negotiating Without Usage Data\" trap → If you're only using 40% of seats, ask for a smaller plan → If you're at 90% usage, ask for volume discounts → Show vendors your usage data → It justifies your ask and builds trust",
      ],
    },
    {
      taskNum: 8,
      title: "Build Your \"Scale Playbook\": Document What Works Before You Forget",
      hook: "A founder 3x'd revenue in 6 months. I asked: \"Can you do it again?\" He said: \"I... think so?\" He couldn't. Because he didn't document what worked. Luck doesn't scale. Systems do.",
      startDay: 23,
      duration: 3,
      impact: "medium",
      actions: [
        "Identify your \"highest ROI channel\" from experiments → This is the channel you'll scale → It should have: proven ROI >3x, consistent performance, room to grow",
        "Document the \"Complete Playbook\" → What exactly did you do? → What copy, creative, targeting, offer worked? → What budget, timeline, and sequence? → Write it as if you're handing it to a new hire who's never seen your business",
        "Break the playbook into 3 sections → Setup (tools, accounts, access) → Execution (step-by-step task list with screenshots) → Optimization (what to test, when to scale, when to pause) → Make it so detailed a 12-year-old could follow it",
        "Train your team on the playbook → Don't keep it in your head → Walk through it with 2-3 team members → Have them execute it while you watch → Refine the playbook based on their questions",
        "Set up \"automated tracking and alerts\" → Use dashboards (Google Sheets, Looker, Tableau) → Set alerts for: CAC exceeds $X, ROAS drops below Y, conversions dip Z% → Automation ensures you catch problems before they become disasters",
        "Define your \"scale triggers\" → If ROI stays >3x for 30 days, double the budget → If CAC stays under $X for 14 days, increase spend 50% → Remove emotion, let data decide when to scale → Speed matters when you have a winner",
        "Build a \"rollback plan\" → What if scaling breaks the channel? → Define scenarios where you'd reduce spend → Know your \"safe zone\" budget → Scaling is aggressive, but smart scaling has guardrails",
      ],
      avoidPoints: [
        "The \"Scaling Too Fast\" trap → Doubling budget overnight often doubles CAC → Platforms (Facebook, Google) need time to adjust → Scale in 25-50% increments → Give the algorithm 5-7 days to stabilize → Slow scaling is faster than crashing and restarting",
        "The \"Forgetting to Document\" trap → You run a winning campaign → You move on to the next thing → 3 months later, you can't remember what worked → Document in real-time, not after the fact → Your future self will thank you",
        "The \"No Quality Control\" trap → Scaling usually means hiring or automating → Quality dips when you hand things off → Set quality benchmarks → Review 10% of output weekly → One bad campaign can kill a good channel",
      ],
    },
    {
      taskNum: 9,
      title: "The Margin Expansion Deep-Dive: Grow Profit, Not Just Revenue",
      hook: "A founder grew from $500K to $1.2M in revenue. He was excited. I looked at his profit: $40K to $45K. He grew 140% in revenue and 12% in profit. That's not growth. That's a vanity metric trap.",
      startDay: 26,
      duration: 2,
      impact: "high",
      actions: [
        "Calculate your \"Gross Margin\" per product/service → Revenue - Direct Costs (COGS, delivery, support) = Gross Profit → Gross Profit ÷ Revenue = Gross Margin % → Target: 60-80% for services, 40-60% for products → If yours is below target, you have a pricing or cost problem",
        "Identify \"low-margin traps\" → Which offerings have <30% margins? → Are they loss leaders driving other sales, or just losers? → One client had a $99 product with 15% margin that consumed 40% of support time → They killed it and profit jumped 28%",
        "Run a \"Price Increase Test\" → Pick your top 3 products/services → Increase price by 10-15% for new customers → Track: conversion rate, revenue, customer quality → Most founders find conversion drops <10% but revenue increases 20-30% → Higher prices often attract better customers",
        "Explore \"high-margin add-ons\" → What can you offer existing customers with minimal extra cost? → Coaching add-on to a course → Priority support tier → Done-for-you implementation → Add-ons often have 70-90% margins because the infrastructure already exists",
        "Audit \"hidden costs\" eating margin → Support time, refunds, chargebacks, revisions → One client found that 20% of customers consumed 60% of support → They created a premium support tier → Margin improved and support quality increased",
        "Map \"margin by customer segment\" → Not all customers are equally profitable → Enterprise might have higher LTV but also higher acquisition and support costs → SMBs might have lower LTV but scale faster → Know which segments drive profit, not just revenue",
        "Set a \"margin improvement target\" → Increase gross margin by 5-10% this quarter → Even small margin improvements compound massively → A business with $1M revenue at 50% margin makes $500K gross profit → Improve margin to 55% = $550K = extra $50K to reinvest",
      ],
      avoidPoints: [
        "The \"Revenue Vanity Metric\" trap → Founders celebrate revenue growth → But profit is flat (or negative) → $10M revenue at 5% margin ($500K profit) is worse than $3M revenue at 25% margin ($750K profit) → Optimize for profit, not revenue",
        "The \"Scared to Raise Prices\" trap → \"But customers will leave!\" → Some will. Most won't. → If 10% leave but you make 25% more revenue, you win → Test price increases on new customers first → Data beats fear",
        "The \"Ignoring Customer Profitability\" trap → Treating all customers equally → Some customers are 5x more profitable than others → Fire the bottom 10% (high cost, low value) → Focus on acquiring more of the top 20% → Margin comes from customer selection, not just pricing",
      ],
    },
    {
      taskNum: 10,
      title: "The 90-Day ROI Retrospective: Learn, Lock, Level Up",
      hook: "Most founders finish a quarter and immediately start the next one. No reflection. No learning. Just more doing. That's why they repeat the same mistakes for years. Here's how to break the cycle.",
      startDay: 28,
      duration: 2,
      impact: "medium",
      actions: [
        "Compile your \"90-Day Numbers\" in one view → Revenue, profit, CAC, LTV, churn, cash flow → Compare to 90 days ago → What improved? What got worse? Why? → Numbers don't lie, but they don't explain themselves either",
        "Run the \"Start, Stop, Continue\" exercise → Start: What 1-2 new things should we do next quarter based on learnings? → Stop: What 1-2 things should we kill because they didn't work? → Continue: What 1-2 things should we double down on because they worked? → Simple framework, massive clarity",
        "Identify your \"Top 3 Wins\" → What worked better than expected? → Why did it work? → Can we replicate it? → How do we scale it? → Wins are only valuable if you learn from them",
        "Analyze your \"Top 3 Losses\" → What failed or underperformed? → Why did it fail? Was it execution, timing, strategy, or market? → What would we do differently next time? → Failures are only expensive if you don't learn from them",
        "Calculate your \"ROI by initiative\" → You ran experiments, campaigns, hires, tools → Which had the highest return? → Which had the lowest? → Rank everything by ROI → This tells you where to allocate next quarter",
        "Build your \"Next 90-Day Roadmap\" → Pick 1 big goal (revenue, profit, or transformation) → Break it into 3 monthly milestones → Assign resources and owners → Share with the team → Clear goals drive clear action",
        "Schedule this review every 90 days → Make it non-negotiable → The companies that learn fastest win → Learning comes from reflection, not just action → Build this into your operating rhythm",
      ],
      avoidPoints: [
        "The \"No Time to Reflect\" trap → \"We're too busy to look back!\" → So you repeat the same mistakes → Reflection isn't a luxury, it's a competitive advantage → Block 2-4 hours every 90 days → The ROI on this time is 10x any task you'd do instead",
        "The \"Celebrating Wins, Ignoring Losses\" trap → Wins feel good. Losses hurt. → But losses teach more than wins → Spend equal time analyzing what failed → The companies that confront failure outgrow those that don't",
        "The \"Too Many Goals\" trap → Next quarter, you decide to do 10 new things → You'll do all 10 poorly → Pick 1-3 priorities max → Depth beats breadth → Focus compounds",
      ],
    },
  ],
};

/**
 * Branding Magnet action plan (Visibility & Authority focused).
 */
const BRANDING_MAGNET_PLAN: BusinessCalendarPlan = {
  key: "brandingMagnet",
  label: "Branding Magnet",
  monthTheme: "Brand Building Month",
  tasks: [
    {
      taskNum: 1,
      title: "Brand Positioning Sprint: Own Your Lane",
      hook: "A founder had 5K followers but zero inbound leads. I asked what he's known for. He said 'I do a lot of things.' That's the problem. Here's how we fixed it in 72 hours.",
      startDay: 0,
      duration: 3,
      impact: "high",
      actions: [
        "Write your one-sentence positioning → 'I help [WHO] achieve [WHAT] through [HOW]' → Test on 10 people: Can they repeat it back?",
        "Define your 'This Not That' statement → Who you serve vs who you don't → Repelling wrong customers attracts right ones",
        "Identify your top 3 audience pain points → Interview 5 customers → Use their exact words in your messaging",
        "Update all profiles with consistent positioning → LinkedIn, Twitter, website, email signature → Repetition builds recognition",
        "Create your differentiation statement → What makes you different from competitors? → If you can't articulate it, neither can customers",
        "Build a content pillar system → 3-5 topics you'll own → All content should ladder up to your positioning",
        "Set positioning review quarterly → Markets shift, you evolve → Update messaging based on what's working",
      ],
      avoidPoints: [
        "The 'Everything to Everyone' trap → Trying to serve multiple audiences dilutes your message → Narrow focus = stronger positioning",
        "The 'Jargon Overload' trap → Industry buzzwords don't differentiate you → Speak in simple human language customers use",
        "The 'Skipping Customer Research' trap → Don't guess what resonates → Talk to real customers before finalizing positioning",
      ],
    },
    {
      taskNum: 2,
      title: "Social Proof Arsenal: Build Trust at Scale",
      hook: "Added 15 testimonials to a founder's site. Conversions jumped 34% in 14 days. Social proof isn't vanity—it's your unfair advantage.",
      startDay: 3,
      duration: 3,
      impact: "high",
      actions: [
        "List 50 happy customers → Filter by best results → These are your testimonial targets",
        "Send specific testimonial requests → 'Share: 1) Problem before, 2) Result after, 3) Why recommend' → Specific questions get specific answers",
        "Collect 15-20 written testimonials with numbers → 'Great service!' is useless → 'Increased revenue $40K in 90 days' is gold",
        "Record 5 video testimonials → Video builds trust 10x faster than text → Phone quality is fine, authenticity > production",
        "Create 3-5 detailed case studies → Problem → Solution → Result → Include metrics and customer background",
        "Design visual assets from testimonials → Quote graphics for social media → Build a 'wall of love' page on website",
        "Organize proof by customer type → Segment by industry, company size, use case → Prospects want to see 'someone like me' succeeded",
      ],
      avoidPoints: [
        "The 'Generic Praise' trap → Vague testimonials don't convince → Get specific numbers, timelines, and transformations",
        "The 'Asking Too Late' trap → Ask immediately after delivering a win → Fresh success = enthusiastic detailed testimonials",
        "The 'No Permission' trap → Always get written permission to use publicly → Clarify: Can you use name, company, photo?",
      ],
    },
    {
      taskNum: 3,
      title: "30-Day Content Machine: Consistency Without Burnout",
      hook: "A founder said 'I don't have time for content.' I showed him how 4 hours creates 30 days of content. He's been posting daily for 6 months. Inbound leads up 3x.",
      startDay: 6,
      duration: 4,
      impact: "medium",
      actions: [
        "Pick 5 content themes aligned with positioning → Education, transformation, behind-scenes, opinions, lessons learned",
        "Batch-create 20-30 posts in one 4-hour session → Write outlines for 30, flesh out best 20 → Batching is 5x faster than daily creation",
        "Use Hook-Story-Lesson-CTA framework → Hook grabs attention → Story makes it relatable → Lesson provides value → CTA drives engagement",
        "Schedule across all platforms → LinkedIn, Twitter, Instagram → Post 3-5x per week minimum → Consistency beats perfection",
        "Set daily engagement blocks (30 min) → Comment on others' content → Reply to your comments → Engagement = algorithm boost",
        "Repurpose top content into multiple formats → LinkedIn post → Twitter thread → Newsletter → YouTube script",
        "Track performance metrics → Engagement rate, reach, profile visits → Double down on what works, cut what doesn't",
      ],
      avoidPoints: [
        "The 'Random Posting' trap → Content without strategy gets random results → Every post should support your positioning",
        "The 'Perfectionism Paralysis' trap → Waiting for perfect post means never posting → Done beats perfect, improve over time",
        "The 'Post and Ghost' trap → Posting without engaging = shouting into void → First 90 minutes after posting are critical",
      ],
    },
    {
      taskNum: 4,
      title: "Authority Content Blitz: Prove You're the Expert",
      hook: "A founder wrote 5 in-depth articles. Inbound leads doubled in 45 days. Anyone can claim expertise. Few can prove it through content.",
      startDay: 10,
      duration: 3,
      impact: "high",
      actions: [
        "Publish 5 authority posts with contrarian takes → Don't repeat what everyone says → Unique perspectives spark conversation",
        "Write 2-3 long-form articles (1000-2000 words) → Deep dives on topics your audience cares about → Publish on LinkedIn, Medium, your blog",
        "Engage with 30-50 industry leaders daily → Thoughtful comments (not 'Great post!') → Share with your take → DM genuine compliments",
        "Pitch 5-10 podcast guest appearances → Find shows your customers listen to → Personalize pitch: why you, why their audience",
        "Share behind-the-scenes of your journey → Wins, losses, pivots, lessons → Vulnerability builds relatability and trust",
        "Host live Q&A or workshop → Demonstrate expertise in real-time → Record and repurpose for content",
        "Create your signature framework → A repeatable system you teach → Frameworks make you memorable and shareable",
      ],
      avoidPoints: [
        "The 'Playing It Safe' trap → Safe content is forgettable → Strong opinions (backed by experience) build authority faster",
        "The 'No Proof' trap → Don't just share theories → Back claims with data, case studies, personal results",
        "The 'One-Way Broadcasting' trap → Authority isn't a monologue → Engage in conversations, reply to comments, ask for feedback",
      ],
    },
    {
      taskNum: 5,
      title: "Strategic Partnership Pipeline: Multiply Reach Without Ads",
      hook: "A founder spent $5K/month on ads. Partnered with 3 complementary brands instead. Generated $40K in 90 days. Zero ad spend.",
      startDay: 13,
      duration: 4,
      impact: "medium",
      actions: [
        "List 30-50 complementary brands → Serve your customers with different solutions → Not competitors, collaborators",
        "Score by audience overlap (1-10) and brand alignment (1-10) → Focus on brands scoring >7 in both",
        "Research decision-makers → Find who runs partnerships → Look for warm intro paths through mutual connections",
        "Draft personalized pitches → Show you understand their business → Highlight mutual value, not just what you want",
        "Suggest 3-5 collaboration concepts → Co-host webinar, cross-promote, bundle offers, guest content, referral partnerships",
        "Prioritize top 15 partnerships → Don't reach out to all 50 at once → Personalize every message",
        "Track in partnership CRM → Who you contacted, response status, next steps → Organized follow-up wins deals",
      ],
      avoidPoints: [
        "The 'Spray and Pray' trap → Mass generic outreach gets ignored → Personalize every single message",
        "The 'What's In It For Me' trap → If pitch is all about what you want, they'll ignore → Lead with value for them",
        "The 'No Follow-Up' trap → Most partnerships happen after 2-4 touchpoints → Persist without being annoying",
      ],
    },
    {
      taskNum: 6,
      title: "Content Sprint: Build Momentum Through Volume",
      hook: "A founder posted 3x/week for 6 months. Decent results. Then posted daily for 30 days. Reach tripled. Momentum compounds.",
      startDay: 17,
      duration: 3,
      impact: "high",
      actions: [
        "Post daily across platforms for 5 straight days → LinkedIn, Twitter, Instagram → Flood your network with visibility",
        "Create 3-5 short videos (60-90 seconds) → Show personality, not just slides → Talk directly to camera → Video outperforms text 2-3x",
        "Write 2 long-form pieces (1500+ words) → Deep dives establishing authority → Publish on LinkedIn Articles or Medium",
        "Go live at least once → Live video builds connection faster → Host Q&A, workshop, or behind-scenes → Authenticity > polish",
        "Engage with every comment and DM → Respond within 24 hours → Keep conversations going → Engagement signals value to algorithms",
        "Repurpose top content → Best post becomes carousel, video, article → One idea = 5 pieces of content",
        "Track metrics daily → Engagement, reach, profile visits, follower growth → What's working? Double down on winners",
      ],
      avoidPoints: [
        "The 'Quantity Over Quality' trap → Daily posting with bad content hurts → Every post should provide value or entertainment",
        "The 'Overproduction' trap → Perfect lighting/script/everything → Authenticity > polish → People connect with humans not robots",
        "The 'Post and Ghost' trap → First 90 minutes after posting are critical → Reply to comments, engage with others",
      ],
    },
    {
      taskNum: 7,
      title: "Lead Magnet Launch: Trade Value for Attention",
      hook: "A founder had 10K followers but no email list. Built a lead magnet. 500 emails in 30 days. Now he controls the relationship, not the algorithm.",
      startDay: 20,
      duration: 3,
      impact: "high",
      actions: [
        "Identify audience's #1 pain point → What are they struggling with now? → Lead magnet should solve piece of that problem",
        "Design premium resource → Checklist, template, toolkit, mini-course, cheat sheet → Make it so valuable people would pay $20-50",
        "Create high-converting landing page → Headline: Promise outcome → Bullets: What's inside → Visual: Show the resource → CTA: 'Download Now'",
        "Write 5-7 email nurture sequence → Email 1: Deliver + welcome → 2-4: Additional value, tips, case studies → 5-6: Introduce offer softly → 7: CTA",
        "Set up tracking → Landing page visitors? Opt-in rate (target 30-50%)? Email open rate (target 40-60%)? → Optimize based on data",
        "Promote everywhere → Pin to profiles → Mention in content → Add to email signature → Run soft launch campaign",
        "Test and optimize → Different headlines, CTAs, email copy → A/B test landing pages → 30% to 40% conversion = 33% more leads",
      ],
      avoidPoints: [
        "The 'Generic PDF' trap → Boring text-heavy PDFs no one reads → Make it visual, actionable, immediately useful",
        "The 'No Nurture' trap → Capturing email and doing nothing wastes effort → Most won't buy day 1 → Nurture builds trust",
        "The 'Set and Forget' trap → Lead magnets need promotion → Actively drive traffic → Promote it weekly",
      ],
    },
    {
      taskNum: 8,
      title: "Conversion Optimization Sprint",
      hook: "A founder had 10K visitors/month. 12 customers. 0.12% conversion. Industry average is 2-5%. We made 5 changes in 1 week. Jumped to 2.8%. Same traffic, 23x more customers.",
      startDay: 23,
      duration: 3,
      impact: "quick-win",
      actions: [
        "Audit every CTA on your site → Are they clear and specific? → 'Learn More' is weak, 'Get Your Free Toolkit' is strong",
        "Test 2-3 headline variations → Benefit-driven vs curiosity-driven vs social proof-driven → Track which converts best",
        "Add trust signals above the fold → Testimonials, client logos, certifications → People scan for proof before scrolling",
        "Simplify forms → Every extra field reduces conversions 5-10% → Ask only what you need now, get more info later",
        "Set up exit-intent popups → Capture people before they leave → Offer lead magnet, discount, consultation → 10-20% capture rate",
        "Implement retargeting campaigns → 97% don't convert first visit → Retarget with ads on Facebook, Google, LinkedIn",
        "Measure baseline conversion rates → Homepage, landing pages, opt-ins, checkout → Can't improve what you don't measure",
      ],
      avoidPoints: [
        "The 'Guessing Game' trap → Don't assume what converts → Test everything → Data decides, not opinions",
        "The 'Too Many CTAs' trap → Every page needs ONE primary action → Multiple CTAs confuse → Confusion kills conversions",
        "The 'Ignoring Mobile' trap → 60-70% traffic is mobile → If site isn't mobile-optimized, losing half your customers",
      ],
    },
    {
      taskNum: 9,
      title: "Brand Audit & Iteration",
      hook: "Most founders build their brand once and never revisit it. Markets shift. Audiences evolve. Your brand should too. Quarterly audits keep you relevant.",
      startDay: 26,
      duration: 2,
      impact: "medium",
      actions: [
        "Review performance metrics → Traffic, followers, engagement, email growth, inbound leads → Compare to 90 days ago",
        "Survey your audience → 'What do you want more of?' 'What's not resonating?' → Direct feedback > assumptions",
        "Identify top 3 content pieces → What got most engagement? Why? → Create more like it",
        "Identify bottom 3 pieces → What flopped? Why didn't it work? → Stop that content or try different angle",
        "Revisit positioning → Still accurate? Has ideal customer changed? → Positioning should evolve with business",
        "Plan next 90 days content themes → Based on what worked, audience feedback, market trends",
        "Set 1-3 brand goals for next quarter → Grow email 500, double LinkedIn engagement, launch community → Specific measurable targets",
      ],
      avoidPoints: [
        "The 'Chasing Every Trend' trap → Not every trend fits your brand → Stay true to positioning → Consistency > trends",
        "The 'Ignoring Feedback' trap → Your audience tells you what they want → Listen and adapt → Ignoring feedback = irrelevance",
        "The 'No Clear Goals' trap → 'Grow brand' isn't a goal → Set specific measurable targets → Track progress, adjust strategy",
      ],
    },
    {
      taskNum: 10,
      title: "Community Building: Followers to Advocates",
      hook: "Followers scroll past you. Community members fight for you. A founder built 200-person Slack group. $120K in referrals in 6 months. Community is your moat.",
      startDay: 28,
      duration: 2,
      impact: "high",
      actions: [
        "Choose platform → Slack, Discord, Circle, Facebook/LinkedIn Group → Pick where audience already hangs out",
        "Define community purpose → What value do members get? → What makes this different from following on social?",
        "Invite 50-100 ideal members to start → Don't launch to thousands → Small and engaged > large and silent",
        "Set community guidelines → What's allowed, what's not → How to engage respectfully → Clear rules prevent chaos",
        "Create engagement rituals → Weekly Q&A, monthly challenges, member spotlights → Give reasons to return → Consistency builds habit",
        "Empower peer-to-peer help → Don't make it all about you → Encourage members helping each other → Best communities are member-driven",
        "Recognize active members → Highlight top contributors → Offer exclusive perks → Recognition drives participation",
      ],
      avoidPoints: [
        "The 'Build It They'll Come' trap → Community without promotion is ghost town → Actively invite, seed conversations",
        "The 'Over-Moderation' trap → Don't control every conversation → Let members lead → Over-control kills organic engagement",
        "The 'Founder MIA' trap → If founder isn't active, why should members be? → Show up daily (10 min) → Your presence sets tone",
      ],
    },
  ],
};

/**
 * Strategy Planner action plan (Systems & Execution focused).
 */
const STRATEGY_PLANNER_PLAN: BusinessCalendarPlan = {
  key: "strategyPlanner",
  label: "Strategy Planner",
  monthTheme: "Systems & Process Month",
  tasks: [
    {
      taskNum: 1,
      title: "90-Day Strategic Roadmap",
      hook: "A founder had 15 priorities. Accomplished 2. I made him pick ONE 90-day goal. He hit it in 75 days. Focus isn't limitation—it's leverage.",
      startDay: 0,
      duration: 3,
      impact: "high",
      actions: [
        "Define ONE clear quarterly objective → Revenue goal, growth milestone, or transformation → Clarity creates momentum",
        "Break into 4 milestone checkpoints → What needs to happen by week 4, 8, 12, 16? → Milestones maintain momentum",
        "Assign 3-5 KPIs to track weekly → Choose metrics that directly indicate progress → What gets measured gets managed",
        "Map resources needed → Team bandwidth, budget allocation, tools required, time investment → Know costs upfront",
        "Create visual roadmap → Show dependencies and timeline → Share with team for alignment → Visual clarity drives execution",
        "Get team commitment → Review roadmap with leadership → Ensure buy-in before execution → Commitment prevents mid-quarter pivots",
        "Schedule bi-weekly check-ins → Review progress, identify blockers, adjust if needed → Consistent reviews keep you on track",
      ],
      avoidPoints: [
        "The 'Too Many Goals' trap → 10 goals = 0 goals → Pick ONE big objective, commit fully → Depth beats breadth",
        "The 'No Buy-In' trap → Creating roadmap alone then announcing it → Get team input early → Ownership drives execution",
        "The 'Set and Forget' trap → Creating plan then not reviewing progress → Bi-weekly check-ins are non-negotiable",
      ],
    },
    {
      taskNum: 2,
      title: "Process Inventory & Bottleneck Analysis",
      hook: "A founder's team spent 40% of time on rework. We documented 5 core processes. Rework dropped to 8%. Same team, 5x more output.",
      startDay: 3,
      duration: 3,
      impact: "medium",
      actions: [
        "List all core processes → Lead generation to delivery → Sales, onboarding, fulfillment, support",
        "Identify top 5 bottlenecks → Where do delays happen? Where do errors occur? → Ask team for pain points",
        "Prioritize by impact → Which bottleneck costs most? Revenue impact? Customer satisfaction? → Fix highest impact first",
        "Estimate wasted time → How many hours per week on inefficient processes? → Make waste visible to create urgency",
        "Document current state → Write down how it works now (even if broken) → Can't improve what you haven't documented",
        "Design ideal future state → How should it work? → What would 10x better look like?",
        "Create 30-day improvement roadmap → Prioritize quick wins first → Build momentum with visible improvements",
      ],
      avoidPoints: [
        "The 'Fix Everything' trap → Trying to improve 20 processes at once → Fix top 3 bottlenecks first → Sequential > parallel",
        "The 'Perfectionism' trap → Waiting for perfect process before documenting → Document current mess first, improve iteratively",
        "The 'Skipping Team Input' trap → Designing processes without asking people who do the work → Frontline knows the pain",
      ],
    },
    {
      taskNum: 3,
      title: "SOP Documentation Sprint",
      hook: "A founder's entire sales process lived in one person's head. That person quit. Revenue dropped 60% overnight. Here's how to never let that happen.",
      startDay: 6,
      duration: 4,
      impact: "high",
      actions: [
        "Prioritize 5 most critical workflows → Revenue-generating or customer-facing processes first",
        "Document step-by-step → Screen recordings, written steps, decision trees → Make it detailed enough for new hire",
        "Create checklists for each process → Quality standards at each step → Checklists prevent errors",
        "Record video walkthroughs → 5-10 min videos showing how it's done → Video > text for complex processes",
        "Assign process owners → One person accountable for quality and updates → Ownership drives maintenance",
        "Build SOPs library in shared space → Notion, Google Drive, Confluence → Accessible to entire team",
        "Train team on new documented processes → Walk through together → Get feedback → Refine based on real usage",
      ],
      avoidPoints: [
        "The 'Over-Engineering' trap → Creating 50-page manuals no one reads → Start with simple checklists, add detail as needed",
        "The 'Perfectionism' trap → Get 80% documented now, improve over time → Perfect SOPs take forever, good-enough SOPs ship",
        "The 'One-Time Documentation' trap → Processes evolve → Review and update SOPs quarterly",
      ],
    },
    {
      taskNum: 4,
      title: "Project Management System Setup",
      hook: "A founder had tasks in email, Slack, spreadsheets, sticky notes. Nothing got done on time. We implemented one PM system. On-time delivery went from 40% to 92%.",
      startDay: 10,
      duration: 3,
      impact: "medium",
      actions: [
        "Choose PM tool that fits team → Monday, Asana, ClickUp, Notion → Don't over-engineer, start simple",
        "Migrate all active projects into system → Get everything out of email and Slack → Single source of truth",
        "Create project templates for recurring work → Saves time, ensures consistency → Templates scale your process",
        "Set up automation rules → Auto-assign tasks, send reminders, update statuses → Automation reduces manual work",
        "Define task naming conventions → Clear titles, proper tagging → Makes search and filtering easy",
        "Train entire team on system → Group training + 1-on-1s for questions → Adoption is critical",
        "Set weekly review ritual → What's on track? What's blocked? → Consistent reviews surface issues early",
      ],
      avoidPoints: [
        "The 'Tool Switching' trap → Changing PM tools every 6 months → Pick one, commit for 12 months minimum",
        "The 'Feature Overload' trap → Using every feature on day 1 → Start with basics: tasks, due dates, assignees → Add features as needed",
        "The 'No Training' trap → Implementing tool without teaching team → Low adoption = wasted investment",
      ],
    },
    {
      taskNum: 5,
      title: "Weekly Sprint Cadence Design",
      hook: "A team had meetings about meetings. 15 hours/week in unnecessary calls. We redesigned their weekly rhythm. Meetings dropped to 3 hours. Output doubled.",
      startDay: 13,
      duration: 4,
      impact: "quick-win",
      actions: [
        "Design Monday kickoff (30 min) → Review priorities, assign tasks, set weekly targets → Alignment prevents wasted effort",
        "Create Friday review template (30 min) → Wins, misses, learnings, next week prep → Reflection drives improvement",
        "Set up daily standups (15 min) → What did you do? What will you do? What's blocking you? → Quick alignment",
        "Build KPI dashboard visible to team → Revenue, pipeline, customer satisfaction → Visibility drives accountability",
        "Define 'maker time' blocks → No meetings Tuesday/Thursday afternoons → Deep work requires uninterrupted time",
        "Create meeting rules → Agenda required, 25/50 min max, recording sent after → Respect people's time",
        "Use async updates when possible → Loom videos, written updates → Don't meet for info sharing",
      ],
      avoidPoints: [
        "The 'Meeting Overload' trap → Defaulting to meetings for everything → Ask: Could this be an email/Loom?",
        "The 'No Agenda' trap → Meetings without clear purpose waste time → No agenda = no meeting",
        "The 'Interruption Culture' trap → Allowing constant interruptions → Protect maker time, batch communications",
      ],
    },
    {
      taskNum: 6,
      title: "Automation Implementation",
      hook: "A team spent 20 hours/week on manual data entry. We automated 5 processes. Freed up 15 hours/week. ROI: 6 weeks. Same work, 75% less time.",
      startDay: 17,
      duration: 3,
      impact: "high",
      actions: [
        "List 10 most time-consuming manual tasks → Data entry, reporting, follow-ups, scheduling → Quantify hours spent",
        "Research automation tools → Zapier, Make, native integrations → Compare cost vs time saved",
        "Prioritize by ROI → Implement automations with biggest time savings first",
        "Start with 3-5 quick-win automations → Email sequences, data sync, report generation → Build momentum",
        "Document automation setup → Screenshots, credentials, troubleshooting guide → Future-proof your automations",
        "Train team on automated workflows → Show what changed, how to use, what to do if breaks",
        "Measure time savings → Track hours before vs after → Prove ROI to justify further automation investment",
      ],
      avoidPoints: [
        "The 'Automate Broken Processes' trap → Fix process first, then automate → Automation of bad process = faster bad results",
        "The 'Over-Complication' trap → Building complex automations that break constantly → Start simple, add complexity as needed",
        "The 'No Documentation' trap → Automation breaks and no one knows how to fix → Document everything",
      ],
    },
    {
      taskNum: 7,
      title: "Quality Assurance Framework",
      hook: "A client's deliverables had 30% error rate. Clients were frustrated. We implemented QA checklists. Error rate dropped to 3%. Same team, 10x better quality.",
      startDay: 20,
      duration: 3,
      impact: "medium",
      actions: [
        "Define quality benchmarks → What does 'good' look like for each deliverable? → Make standards objective not subjective",
        "Create review checklists → Pre-delivery checks for every client-facing output → Checklists prevent overlooked details",
        "Implement approval workflow → Who reviews? What triggers escalation? → Clear accountability prevents errors shipping",
        "Set up quality metrics tracking → Error rates, customer complaints, rework hours → What gets measured gets managed",
        "Build feedback loops → When errors happen, update checklist → Continuous improvement prevents recurring mistakes",
        "Train team on quality standards → Group training + spot checks → Reinforce importance of quality",
        "Celebrate quality wins → Recognize team members with zero errors → What gets rewarded gets repeated",
      ],
      avoidPoints: [
        "The 'Subjective Quality' trap → 'It looks good' isn't a standard → Define objective measurable criteria",
        "The 'Blame Culture' trap → Punishing errors prevents reporting → Focus on improving process not blaming people",
        "The 'No Time for QA' trap → 'Too busy to review' leads to rework → Investing 10 min in QA saves 2 hours in rework",
      ],
    },
    {
      taskNum: 8,
      title: "Delegation & Responsibility Matrix",
      hook: "A founder worked 80 hours/week. Team worked 40. We built a delegation system. Founder's hours dropped to 50. Team took ownership. Revenue grew 2x.",
      startDay: 23,
      duration: 3,
      impact: "high",
      actions: [
        "List everything you do in a week → Every task, meeting, decision → Comprehensive brain dump",
        "Categorize by: Only I can do / I should do / Someone else can do / Shouldn't be done → Be honest about what's truly unique to you",
        "Build RACI matrix → Responsible, Accountable, Consulted, Informed for key decisions → Clarity prevents bottlenecks",
        "Delegate 'someone else can do' tasks → Start with low-risk tasks → Train, don't just assign",
        "Create decision-making guidelines → What decisions need your approval? What can team make? → Empower team to act",
        "Set up weekly delegation reviews → What went well? What needs more training? → Improve delegation over time",
        "Track time freed up → What are you doing with reclaimed hours? → Delegation should free you for high-leverage work",
      ],
      avoidPoints: [
        "The 'I Can Do It Faster' trap → Yes, today. But training someone saves 100x the time long-term",
        "The 'Delegate and Disappear' trap → Delegation isn't abdication → Provide training, support, and feedback",
        "The 'Only Delegating Unimportant' trap → If you only delegate low-value work, you stay stuck → Delegate important work with training",
      ],
    },
    {
      taskNum: 9,
      title: "Metrics Dashboard Build",
      hook: "A founder asked me 'How's your business doing?' He said 'I think good?' I asked for numbers. He had none. Built a dashboard. Decisions got 10x better.",
      startDay: 26,
      duration: 2,
      impact: "quick-win",
      actions: [
        "Identify your 5-7 critical metrics → Revenue, profit, CAC, LTV, churn, pipeline, customer satisfaction",
        "Choose dashboard tool → Google Sheets, Looker, Tableau, or native in your PM tool",
        "Connect data sources → Pull from accounting, CRM, analytics → Automate data updates",
        "Design clear visualizations → Graphs for trends, numbers for absolute values → Make it scannable in 30 seconds",
        "Set up alerts for red flags → If metric drops X%, send alert → Catch issues before they become crises",
        "Share dashboard with leadership team → Everyone sees same numbers → Aligned understanding drives aligned action",
        "Review dashboard weekly → Track trends over time → Data-informed decisions beat gut feelings",
      ],
      avoidPoints: [
        "The 'Too Many Metrics' trap → Tracking 30 numbers = tracking zero → Focus on 5-7 that truly matter",
        "The 'Vanity Metrics' trap → Followers and page views don't pay bills → Focus on revenue and profit indicators",
        "The 'Manual Data Entry' trap → If updating dashboard takes 2 hours, you won't do it → Automate data collection",
      ],
    },
    {
      taskNum: 10,
      title: "Next Quarter Planning",
      hook: "Most founders repeat the same quarter over and over. They don't learn from wins or losses. The companies that reflect and adapt outgrow the rest by 10x.",
      startDay: 28,
      duration: 2,
      impact: "medium",
      actions: [
        "Review current quarter vs goals → What did you accomplish? What did you miss? → Honest assessment drives improvement",
        "Run Start-Stop-Continue exercise → What to start next quarter? Stop? Continue? → Simple framework, powerful clarity",
        "Identify top 3 wins → Why did they work? Can you replicate? → Success leaves patterns",
        "Analyze top 3 losses → Why did they fail? Execution? Timing? Strategy? → Failures teach more than wins",
        "Gather team feedback → What should we do differently? → Frontline has valuable insights",
        "Draft Q2 objectives based on Q1 learnings → Set 1 big goal, 3-5 supporting initiatives → Learn and iterate",
        "Schedule quarterly planning session → Block 4 hours, full leadership team → Strategic planning can't be rushed",
      ],
      avoidPoints: [
        "The 'No Reflection' trap → Moving straight to next quarter without learning → Repeating mistakes is expensive",
        "The 'Blame Game' trap → Focusing on who failed vs what can improve → Process improvement > people blaming",
        "The 'Too Ambitious' trap → Setting 10 new goals for next quarter → Focus on 1-3 priorities max",
      ],
    },
  ],
};

/**
 * Collaborator action plan (Partnerships & People focused).
 */
const COLLABORATOR_PLAN: BusinessCalendarPlan = {
  key: "collaborator",
  label: "Collaborator",
  monthTheme: "Networking & Partnerships Month",
  tasks: [
    {
      taskNum: 1,
      title: "Strategic Partnership Mapping",
      hook: "A founder cold-emailed 100 potential partners. Zero replies. We mapped warm paths to 20 ideal partners. 12 responded. 5 signed deals. Warm beats cold 20:1.",
      startDay: 0,
      duration: 3,
      impact: "high",
      actions: [
        "List 40 potential partners → Brands serving your customers with different solutions → Complementary, not competitive",
        "Score each: Audience fit (1-10) + Brand alignment (1-10) → Focus on partners scoring >14 total",
        "Research decision-makers → Who runs partnerships or marketing? → LinkedIn, company site, mutual connections",
        "Map warm intro paths → Mutual connections, shared communities, common customers → Warm intros convert 10x better",
        "Draft partnership value props → What's in it for them? What's in it for you? → Mutual benefit is non-negotiable",
        "Prioritize top 15 partnerships → These are your focus for outreach → Quality > quantity",
        "Build partnership tracking system → CRM or spreadsheet → Track: contact, status, next step, value potential",
      ],
      avoidPoints: [
        "The 'Cold Mass Outreach' trap → 100 generic cold emails get ignored → 20 warm personalized intros win deals",
        "The 'What's In It For Me' trap → Pitch focused on what you want → Lead with how you'll help them win",
        "The 'No Research' trap → Reaching out without understanding their business → Personalization requires preparation",
      ],
    },
    {
      taskNum: 2,
      title: "Partnership Outreach Campaign",
      hook: "Sent 25 partnership pitches. 18 opened. 10 replied. 7 calls scheduled. The secret? We led with value, not asks.",
      startDay: 3,
      duration: 3,
      impact: "high",
      actions: [
        "Send 25 personalized warm intros → Reference mutual connection or shared experience → Show you did homework",
        "Follow up 2-3 times if no response → 80% of deals happen after multiple touchpoints → Persistence ≠ annoying if you add value each time",
        "Schedule 10 discovery calls → Understand their goals, challenges, opportunities → Listen more than pitch",
        "Pitch 5 specific collaboration concepts → Co-webinar, content swap, bundle, referral program, co-marketing → Make it specific and easy",
        "Track response rates by message type → What subject lines work? What pitches resonate? → Iterate and improve",
        "Build relationship pipeline → Track stage: contacted, call scheduled, proposal sent, deal signed → Manage partnerships like sales",
        "Nurture even if timing isn't right → Not now ≠ not ever → Keep in touch for future opportunities",
      ],
      avoidPoints: [
        "The 'Transactional Pitch' trap → Treating partnership as one-off transaction → Build long-term relationships",
        "The 'One Follow-Up and Done' trap → Most deals take 3-5 touchpoints → Giving up after one no costs you deals",
        "The 'Generic Templates' trap → Copy-paste partnership pitches → Personalization shows respect and drives responses",
      ],
    },
    {
      taskNum: 3,
      title: "Partnership Agreement Template",
      hook: "A founder had verbal partnership agreement. Partner changed terms mid-deal. Founder lost $15K. Now he uses written agreements. Zero disputes in 2 years.",
      startDay: 6,
      duration: 4,
      impact: "medium",
      actions: [
        "Create standard partnership terms document → Scope, deliverables, timeline, compensation → Clarity prevents conflicts",
        "Define revenue share models → How are earnings split? When are payments made? → Money misunderstandings kill partnerships",
        "Outline roles and responsibilities → Who does what by when? → Ambiguity breeds resentment",
        "Include exit clauses → How either party can end partnership → Clear exits prevent messy breakups",
        "Add performance metrics → What defines success? When do you review and adjust? → Metrics drive accountability",
        "Build renewal terms → Is this one-time or ongoing? How to renew? → Set expectations upfront",
        "Get legal review → Have lawyer review template → $500 now saves $50K later",
      ],
      avoidPoints: [
        "The 'Verbal Agreement' trap → Handshake deals lead to misunderstandings → Always put terms in writing",
        "The 'Vague Terms' trap → 'We'll figure it out as we go' → Ambiguity kills partnerships → Be specific",
        "The 'No Exit Strategy' trap → Only planning for success → Plan for ending partnership gracefully too",
      ],
    },
    {
      taskNum: 4,
      title: "Joint Venture Pilot Launch",
      hook: "A founder signed 2-year partnership deal. It failed in 3 months. Another founder ran 30-day pilot first. It worked, then scaled. Pilots de-risk partnerships.",
      startDay: 10,
      duration: 3,
      impact: "high",
      actions: [
        "Co-create pilot offer with partner → Combine strengths, serve both audiences → Start small and contained",
        "Define pilot success metrics → Revenue, customers acquired, satisfaction scores → Know what winning looks like",
        "Split deliverables 50/50 based on strengths → You do what you're best at, they do what they're best at",
        "Launch to 15-20 customers from combined audiences → Small test before full commitment",
        "Collect feedback throughout pilot → What's working? What's not? → Iterate in real-time",
        "Document learnings → What worked? What didn't? Why? → Insights inform future partnerships",
        "Decide: Scale, adjust, or exit → Based on data, not emotions → Pilots exist to test assumptions",
      ],
      avoidPoints: [
        "The 'Skipping Pilot' trap → Jumping straight to full commitment → Test partnership dynamics small before going big",
        "The 'No Clear Metrics' trap → 'Let's try it and see' → Define success criteria upfront or you'll never know if it worked",
        "The 'Unequal Effort' trap → One partner doing 80% of work → Balance or resentment builds fast",
      ],
    },
    {
      taskNum: 5,
      title: "Client Feedback Collection",
      hook: "A founder asked clients 'Are you happy?' Everyone said yes. He asked 'What could we improve?' Gold mine of insights. Turned 3 into case studies. Upsold 5 others.",
      startDay: 13,
      duration: 4,
      impact: "quick-win",
      actions: [
        "Survey top 15 clients → Those with best results → Use simple form or 15-min calls",
        "Ask specific questions → What's working? What's not? What would you pay more for? → Specific questions get specific answers",
        "Identify common pain points → Patterns reveal improvement opportunities → Fix what affects multiple clients",
        "Spot upsell opportunities → What else do they need that you could provide? → Current customers are easiest to sell",
        "Ask for referrals → Happy clients know others with similar problems → Warm referrals close faster",
        "Request testimonials from top performers → Get specific results and metrics → Social proof attracts similar clients",
        "Thank respondents with value → Bonus resource, discount, early access → Appreciation drives future engagement",
      ],
      avoidPoints: [
        "The 'Only Asking Happy Clients' trap → Critical feedback helps you improve most → Survey mix of happy and challenging clients",
        "The 'Generic Surveys' trap → 'How are we doing?' gets generic answers → Ask specific actionable questions",
        "The 'Survey and Ignore' trap → Collecting feedback then doing nothing → Act on insights or don't ask",
      ],
    },
    {
      taskNum: 6,
      title: "Client Success Process Upgrade",
      hook: "A business had 30% churn. We redesigned onboarding based on client feedback. Churn dropped to 8%. Same product, better experience.",
      startDay: 17,
      duration: 3,
      impact: "medium",
      actions: [
        "Redesign onboarding based on feedback → Address common confusion points → First impression sets tone",
        "Create milestone check-ins → Days 7, 30, 60, 90 → Proactive outreach prevents silent churn",
        "Build client success playbook → Best practices for getting results → Systematize what works",
        "Set up proactive outreach triggers → If usage drops, reach out → Catch issues before they become problems",
        "Define early warning signals → What behaviors predict churn? → Monitor and intervene early",
        "Train team on new success process → Group training + shadowing → Consistency requires training",
        "Measure impact on retention → Churn rate before vs after → Prove ROI of improved process",
      ],
      avoidPoints: [
        "The 'Wait for Complaints' trap → By time client complains, often too late → Proactive outreach catches issues early",
        "The 'One-Size-Fits-All' trap → Different client segments need different touch → Segment your success process",
        "The 'No Measurement' trap → Not tracking retention metrics → Can't improve what you don't measure",
      ],
    },
    {
      taskNum: 7,
      title: "Partnership Performance Review",
      hook: "A founder had 8 active partnerships. 2 drove 80% of results. 4 were break-even. 2 lost money. We killed the bottom 4. Freed up time to double down on top 2. Partnership revenue 3x'd.",
      startDay: 20,
      duration: 3,
      impact: "high",
      actions: [
        "Analyze metrics for all partnerships → Revenue generated, customers acquired, effort invested → Quantify ROI",
        "Identify top 20% performers → These deserve more investment → Success compounds",
        "Evaluate middle 60% → Can they be improved or should they be maintained? → Sometimes good enough is fine",
        "Exit bottom 20% professionally → Losing partnerships drain energy → Polite exit protects relationship for future",
        "Plan Q2 strategy for winning partnerships → How to 2-3x results from best partners? → Double down on winners",
        "Schedule quarterly reviews with key partners → Keep communication open → Strong partnerships require maintenance",
        "Document partnership lessons learned → What worked? What didn't? → Apply insights to future partnerships",
      ],
      avoidPoints: [
        "The 'Holding Onto Losers' trap → Sunk cost fallacy keeps bad partnerships alive → Exit non-performers to free resources",
        "The 'No Performance Tracking' trap → Can't manage what you don't measure → Track partnership ROI religiously",
        "The 'Burning Bridges' trap → Exiting partnerships unprofessionally → Today's bad partner might be tomorrow's client",
      ],
    },
    {
      taskNum: 8,
      title: "Referral Program Launch",
      hook: "A founder got 3 random referrals per year. We built a formal program. 47 referrals in 12 months. Same customers, systematic approach.",
      startDay: 23,
      duration: 3,
      impact: "medium",
      actions: [
        "Design referral incentive → What motivates your customers? Cash, discount, service upgrade? → Make reward compelling",
        "Create simple referral process → One-click share link or email template → Friction kills referrals",
        "Build referral landing page → Pre-fill with referrer info → Make it easy for referred person to convert",
        "Promote to happy customers → Email, in-app message, personal ask → Happy customers want to help",
        "Track referral sources → Who refers most? Why? → Double down on best referrers",
        "Thank and reward referrers promptly → Immediate gratification drives repeat behavior → What gets rewarded gets repeated",
        "Share success stories → 'John referred 5 people!' → Social proof drives participation",
      ],
      avoidPoints: [
        "The 'Complicated Process' trap → If referring takes 10 steps, no one does it → Make it stupid simple",
        "The 'Weak Incentive' trap → $10 gift card doesn't motivate → Make reward meaningful to your customer",
        "The 'Set and Forget' trap → Launching program then never promoting → Remind customers regularly",
      ],
    },
    {
      taskNum: 9,
      title: "Customer Advocacy Program",
      hook: "A SaaS company turned 10 happy customers into advocates. They created case studies, spoke at events, referred 30+ customers. Advocacy > advertising.",
      startDay: 26,
      duration: 2,
      impact: "high",
      actions: [
        "Identify 10 biggest fans → Customers with best results who love you → These are advocacy candidates",
        "Create exclusive advocate benefits → Early access, special pricing, direct line to founder → VIP treatment",
        "Invite advocates to co-create → Case studies, webinars, content, events → Give them platform",
        "Build private community for advocates → Slack or Circle → Let them network with each other",
        "Ask advocates to speak at your events → Customer voice > your voice → Real stories convert",
        "Feature advocates in marketing → Their success is your social proof → Showcase transformations",
        "Nurture relationships personally → Founder sends personal thank you → Genuine appreciation drives loyalty",
      ],
      avoidPoints: [
        "The 'Taking Advantage' trap → Asking for favors without giving value → Advocacy is exchange not extraction",
        "The 'No Recognition' trap → Using customer stories without thanking them → Public recognition matters",
        "The 'One-Way Relationship' trap → Only reaching out when you need something → Build genuine relationships",
      ],
    },
    {
      taskNum: 10,
      title: "Network Expansion Sprint",
      hook: "A founder's network: 50 people, all similar to him. Stagnant opportunities. We helped him expand strategically. Added 200 diverse connections. 3 major deals in 6 months.",
      startDay: 28,
      duration: 2,
      impact: "medium",
      actions: [
        "Audit current network → Who do you know? What industries? What stages? → Identify gaps",
        "Join 2-3 strategic communities → Where your ideal customers and partners hang out → Online or in-person",
        "Attend 1-2 industry events per month → Conferences, meetups, workshops → Show up consistently",
        "Engage online daily → Comment on posts, share insights, DM interesting people → Digital networking counts",
        "Host your own event → Dinner, workshop, mastermind → Bringing people together builds strong ties",
        "Make 5 introductions per week → Connect people in your network → Giving creates reciprocity",
        "Follow up within 48 hours → Send personalized message after meeting → Follow-up converts connections to relationships",
      ],
      avoidPoints: [
        "The 'Collecting Business Cards' trap → 500 shallow connections < 50 real relationships → Depth > breadth",
        "The 'Only Networking When Needing' trap → Showing up only when you need something → Build relationships before you need them",
        "The 'No Follow-Through' trap → Meeting people then never following up → Consistent touch turns contacts into collaborators",
      ],
    },
  ],
};

/**
 * Master plan registry.
 */
const BUSINESS_CALENDAR_PLANS: Record<WealthCodeKey, BusinessCalendarPlan> = {
  investmentBrain: INVESTMENT_BRAIN_PLAN,
  brandingMagnet: BRANDING_MAGNET_PLAN,
  strategyPlanner: STRATEGY_PLANNER_PLAN,
  collaborator: COLLABORATOR_PLAN,
};

/**
 * Get business calendar plan for a wealth code.
 * Returns null if wealth code is not recognized.
 */
export function getBusinessCalendarPlan(
  wealthCode: WealthCodeKey | null
): BusinessCalendarPlan | null {
  if (!wealthCode) return null;
  return BUSINESS_CALENDAR_PLANS[wealthCode] ?? null;
}

/**
 * Validate that plan data is well-formed.
 */
export function validateBusinessCalendarPlan(plan: BusinessCalendarPlan): boolean {
  if (!plan || typeof plan !== "object") return false;
  if (!plan.key || !plan.label || !Array.isArray(plan.tasks)) return false;
  if (plan.tasks.length === 0) return false;

  return plan.tasks.every((task) => {
    if (typeof task.taskNum !== "number") return false;
    if (typeof task.title !== "string" || task.title.trim().length === 0) return false;
    if (typeof task.hook !== "string" || task.hook.trim().length === 0) return false;
    if (typeof task.startDay !== "number" || task.startDay < 0) return false;
    if (typeof task.duration !== "number" || task.duration < 1) return false;
    if (task.impact !== "high" && task.impact !== "medium" && task.impact !== "quick-win") return false;
    if (!Array.isArray(task.actions) || task.actions.length === 0) return false;
    if (!Array.isArray(task.avoidPoints) || task.avoidPoints.length === 0) return false;
    return true;
  });
}
