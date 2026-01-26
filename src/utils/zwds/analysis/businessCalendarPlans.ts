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
 * Investment Brain: Focus on cash flow, ROI, cutting waste, and scaling winners.
 * Target audience: Founders who need to optimize unit economics and profitability.
 */
const INVESTMENT_BRAIN_PLAN: BusinessCalendarPlan = {
  key: "investmentBrain",
  label: "Investment Brain",
  monthTheme: "Financial Optimization Month",
  tasks: [
    {
      taskNum: 1,
      title: "Days 1-3: Kill $2K in Dead Expenses",
      hook: "Most founders pay for 10+ tools they don't use. Cut them TODAY, save $2K/month, takes 2 hours.",
      startDay: 0,
      duration: 3,
      impact: "quick-win",
      actions: [
        "Log into your bank account, download last 30 days of transactions as CSV. Open credit card portal, download those too. Takes 10 minutes.",
        "Open Google Sheets. Create 5 columns:\n• Vendor Name\n• Monthly Cost\n• Last Used?\n• Keep or Cancel?\n• Annual Savings if Cancelled\n\nCopy-paste all recurring charges.",
        "Go through each subscription. Ask: 'Did I use this in the last 7 days?' If NO, mark 'Cancel'. Be ruthless. Goal: Find 5-8 items to cancel.",
        "Cancel every 'Cancel' subscription RIGHT NOW. Don't wait. Click the cancel button. If you need it later, you can always re-subscribe. Goal: Cancel 3-5 items, save $200-500/month.",
        "List your 3 biggest vendor expenses (software, hosting, agencies, tools). Write down:\n• Current monthly cost\n• Contract end date\n• Alternative options",
        "Call vendor #1. Script:\n\n\"Hi [name], we're reviewing all expenses this quarter. I really like your product, but I need to either get 20% off or cancel by Friday. Can you help me stay on?\"\n\nTake detailed notes.",
        "Call vendors #2 and #3 using same script. If they refuse, ACTUALLY cancel. There's always a cheaper alternative. Don't bluff if you won't follow through. Goal: Save $500-1000/month total.",
        "Open Google Sheets. Calculate last month's numbers:\n\n`Revenue $____ - Total Expenses $____ = Profit $____`\n\nThen: `(Profit ÷ Revenue) × 100 = Profit Margin ____%`",
        "If profit margin is below 20%, you have a spending problem, not a revenue problem. Write down top 3 expense categories. Which one can you cut 30% from THIS WEEK?",
        "Text your top 3 customers: 'Quick question - planning next quarter. What's the #1 thing we could do better for you?' Write down their EXACT words. This tells you where to invest, not guess.",
      ],
      avoidPoints: [
        "Cutting revenue-generators → Don't cancel ads that bring customers → Saw a founder cut $500/month in ads, lost $3K/month in sales → Cut waste, not muscle",
        "Analysis paralysis → Don't spend 3 days building perfect models → 80% done in 2 hours beats 100% done never → Cancel subscriptions NOW, not next week",
        "One-time audit mentality → Costs creep back in 60 days → Set a monthly 30-min calendar reminder to review expenses → What you don't track, you don't control",
      ],
    },
    {
      taskNum: 2,
      title: "Days 3-6: Find Your $10K Winning Channel",
      hook: "A founder spent $12K/month on ads across 5 channels. Only 1 was profitable. Finding it saved him $84K in 7 months.",
      startDay: 3,
      duration: 3,
      impact: "high",
      actions: [
        "Open Google Sheets. Create columns:\n• Channel\n• Ad Spend\n• New Customers\n• Revenue Generated\n• CAC (Customer Acquisition Cost)\n• LTV (Lifetime Value)\n\nList every channel you've spent money on in last 90 days: Facebook, Google, LinkedIn, referrals, partnerships.",
        "For each channel, calculate CAC. Formula:\n\n`Total spent on channel ÷ Number of new customers = CAC`\n\nExample: Spent $2000, got 10 customers = $200 CAC. Write it down.",
        "Calculate LTV by channel. Go into your CRM (Customer Relationship Management system) or payment system. Track which channel each customer came from. Average their total spending. Example: 10 Facebook customers spent $5000 total = $500 LTV each.",
        "For each channel, calculate ROI (Return on Investment). Formula:\n\n`(Revenue from channel - Cost of channel) ÷ Cost × 100 = ROI%`\n\nExample: Spent $1000, made $3000 = 200% ROI. Any channel below 100% ROI is LOSING money.",
        "Calculate payback period per channel. Formula:\n\n`CAC ÷ Average monthly revenue per customer = Months to break even`\n\nExample: $300 CAC ÷ $50/month = 6 months. Target: Under 12 months. Over 18 months kills cash flow.",
        "Rank channels by ROI (highest to lowest). Top 2 channels = your winners. Middle channels = maintain but don't grow. Bottom 2 channels = kill in next 30 days. Be ruthless with losers.",
        "Log into ad platforms for bottom 2 channels. Pause all campaigns RIGHT NOW. Don't 'test one more week.' Losing channels don't magically become winners. Cut losses fast.",
        "Take budget from killed channels. Move it to your #1 winning channel. If Facebook had 200% ROI and you were spending $1000/month, test $1500 next month. Winners compound when you feed them.",
        "Set up weekly tracking. Every Monday, check:\n• Spend per channel\n• Customers acquired\n• CAC\n• ROI\n\nUse Google Sheets or dashboard tool. What gets measured weekly gets managed. Monthly reviews are too slow.",
      ],
      avoidPoints: [
        "Vanity metrics trap → 10K followers with $0 revenue is worthless → 100 customers at $1K profit beats 10K followers → Track revenue and profit, not likes and reach",
        "Ignoring time costs → 'Free' organic content that took 40 hours isn't free → Calculate: Your hourly rate × hours spent = true cost → Include it in channel ROI",
        "Averaging all customers → Don't lump all channels together → Facebook customers might stay 2x longer than Google customers → Segment CAC and LTV by source or you'll make bad decisions",
      ],
    },
    {
      taskNum: 3,
      title: "Days 6-10: Call Top 10 Customers, Upsell 3 of Them",
      hook: "Easiest sale is to someone who already bought. A founder made 10 calls, upsold 4 customers, added $2K MRR in one week.",
      startDay: 6,
      duration: 4,
      impact: "high",
      actions: [
        "Open your CRM (Customer Relationship Management system) or customer list. Sort by:\n• Highest paying customers, OR\n• Longest tenure, OR\n• Best results\n\nExport top 20 customers. These are your upsell targets.",
        "For each customer, write down:\n• What they bought\n• What they're NOT using yet\n• What problems they mentioned\n\nLook at your product tiers. What's the next level up? What could they add?",
        "Create upsell offers for 3 types:\n• Upgrade to higher tier\n• Add complementary service\n• Increase volume/seats\n\nWrite down pricing. Example: $500/month → $750/month for premium tier.",
        "Text or email top 10 customers:\n\n\"Hey [name]! Planning some new offerings for Q[X]. You've been a great customer. Got 10 minutes this week for a quick call? Want your input.\"\n\nSchedule 10 calls.",
        "Run the 10 calls. Use this script:\n\n\"Thanks for the time. Quick question - what's your #1 challenge with [their business] right now?\"\n\n[Listen]\n\n\"Interesting. We're launching [upsell offer] that helps with exactly that. Would you be interested in trying it for [price]?\"",
        "Tally results in Google Sheets. How many said yes? How many said maybe? How many said no? If 3-4 said yes, you just added $X in MRR (Monthly Recurring Revenue). If fewer, refine your offer or script.",
        "For customers who said 'maybe', send follow-up email:\n\n\"Hey [name], thought about our call. Here's exactly what you get with [upsell]: [Benefit 1], [Benefit 2], [Benefit 3]. Want to start Monday? Just reply YES.\"",
        "For customers who said YES, send onboarding details immediately. Don't wait. Momentum dies when you delay. Send:\n• Welcome email\n• Setup instructions\n• Timeline\n• Point of contact\n\nMake them feel VIP.",
        "Calculate revenue impact. Example: Upsold 3 customers from $500 to $750/month = $750 extra monthly = $9K annually. That's the value of 10 phone calls. Document what worked so you can repeat it.",
      ],
      avoidPoints: [
        "Selling to everyone trap → Not all customers are upsell candidates → Focus on happiest customers first → Unhappy customers need fixing, not upselling",
        "No clear offer trap → Don't call and ask 'Want to spend more?' → Have specific offers with specific prices → Vague asks get vague responses",
        "Waiting for perfect timing → There's never a perfect time → Schedule calls THIS WEEK → Speed beats perfection when you're talking to people who already trust you",
      ],
    },
    {
      taskNum: 4,
      title: "Days 10-13: Raise Prices 15%, Track Who Complains",
      hook: "Most founders underprice by 20-30%. One founder raised prices 15%, lost 2 customers, gained $4K/month. Net gain: $3.5K/month.",
      startDay: 10,
      duration: 3,
      impact: "medium",
      actions: [
        "Open Google Sheets. Write down:\n• Current price for each product/service\n• Number of customers at that price\n• Monthly revenue per product\n\nCalculate total monthly revenue.",
        "Create 'New Price' column. Increase each price by 15%. Example: $100/month becomes $115/month. Calculate new potential revenue if all customers stayed:\n\n`20 customers × $115 = $2300 (vs $2000 current)`",
        "Predict churn. Industry average: 5-10% of customers will leave when you raise prices 15%. Calculate worst case:\n\n`Lose 2 of 20 customers = 18 × $115 = $2070 (still $70 more than current $2000)`",
        "Decide on implementation:\n• Option A: Grandfather existing customers, new customers pay new price (safest)\n• Option B: Everyone moves to new price in 30 days (maximize revenue)\n\nWrite down your choice.",
        "If Option A, update your website pricing RIGHT NOW. All new signups see new prices starting today. In your CRM (Customer Relationship Management system), tag existing customers as 'Legacy pricing'. No announcement needed.",
        "If Option B, draft email to customers:\n\n\"Quick update - starting [date 30 days out], pricing will be $X (currently $Y). This lets us continue delivering [value you provide]. Questions? Hit reply.\"\n\nSend it.",
        "Track responses. Use Google Sheets:\n• Customer Name\n• Current Price\n• Response (OK / Complained / Cancelled)\n• Outcome\n\nCount how many actually cancel vs threaten to cancel.",
        "For customers who threaten to cancel, reply:\n\n\"I understand. Our new pricing reflects [specific value adds]. Is price the only concern or is there something else?\"\n\n50% will stay. 30% will cancel. 20% will ask for discount.",
        "Calculate actual revenue impact after 30 days:\n\n`(New customers × New price) + (Existing customers × Their price) - Lost revenue from cancellations = Net change`\n\nIf positive, you win. Document learnings for next price increase.",
      ],
      avoidPoints: [
        "Apologizing for price increases → Don't say 'Sorry, but...' → Frame it as investment in better service → Confident pricing attracts better customers",
        "Raising prices without adding value → If nothing changed, why does it cost more? → Add feature, improve support, or explain increased costs → Give customers a reason",
        "Testing on all customers at once → Test on new customers first for 30 days → See conversion impact before rolling to existing base → De-risk the increase",
      ],
    },
    {
      taskNum: 5,
      title: "Days 13-17: Run $500 Test on New Channel",
      hook: "Big bets break businesses. Small bets build them. One $500 test on Reddit ads returned 340% ROI. Scaled to $5K/month.",
      startDay: 13,
      duration: 4,
      impact: "high",
      actions: [
        "Pick ONE new channel to test. Options:\n• Reddit ads\n• TikTok ads\n• Twitter ads\n• Podcast sponsorship\n• Newsletter sponsorship\n• Affiliate partners\n\nChoose based on where your customers actually hang out.",
        "Set test budget: $500 max. Set test duration: 7 days. Set success metric: $1000+ in revenue = 100% ROI (Return on Investment) minimum to scale. Write in Google Sheets:\n• Channel\n• Budget\n• Goal Revenue\n• Actual Results",
        "Create ad account for new channel. Set daily budget cap:\n\n`$500 ÷ 7 days = ~$71/day`\n\nThis prevents accidentally spending $500 in day 1. Set maximum cost per click bid LOW ($1-2). Start slow.",
        "Create 3 ad variations. Keep offer IDENTICAL to what works elsewhere. Only test:\n• Different headlines\n• Different images\n• Different opening hooks\n\nDon't change offer and channel at same time or you won't know what worked.",
        "Set up tracking pixel or UTM (Urchin Tracking Module) links. In Google Analytics, create goal tracking for:\n• Link clicks\n• Signups\n• Purchases\n\nYou MUST know which ad drove which result. No tracking = wasted money.",
        "Launch ads. Check stats 6 hours later. Are ads running? Any clicks? Any conversions? If zero clicks after 6 hours, pause and adjust targeting. If clicks but no conversions, landing page is the problem not the ad.",
        "Check results DAILY. Track in Google Sheets:\n• Day\n• Spend\n• Clicks\n• Conversions\n• Revenue\n• CAC (Customer Acquisition Cost)\n• ROI%\n\nIf CAC exceeds your target by 2x, PAUSE immediately. Don't burn full $500 on a loser.",
        "Calculate final results:\n\n`Total revenue ÷ Total spend = ROI`\n\nIf over 100% ROI ($1000+ revenue from $500 spend), you have a winner. If 50-100% ROI, needs optimization. If under 50%, kill it and test something else.",
        "If winner, immediately increase budget to $1000 for next 7 days. If loser, document why (bad targeting? wrong audience? weak offer?) and pick next channel to test. Speed of learning compounds.",
      ],
      avoidPoints: [
        "Testing multiple variables → Don't change channel AND offer AND creative at same time → Change ONE thing only → Otherwise you'll never know what actually worked or failed",
        "No stop-loss → Burning full $500 even when it's clearly failing → If CAC is 3x your target after $200 spent, STOP → Save $300 to test something else",
        "Scaling on small sample size → 3 conversions doesn't mean it works → Wait for 20-30 conversions minimum before scaling → Small samples lie, large samples tell truth",
      ],
    },
    {
      taskNum: 6,
      title: "Days 17-20: Document Unit Economics in One Sheet",
      hook: "A founder didn't know his numbers. When I asked 'Are you profitable per customer?' he guessed. Built one spreadsheet, decisions got 10x clearer.",
      startDay: 17,
      duration: 3,
      impact: "high",
      actions: [
        "Open Google Sheets. Title: 'Business Math Bible'. Create columns:\n• Metric Name\n• Formula\n• Current Value\n• Target Value\n• Status\n\nThis is your single source of truth.",
        "Calculate CAC (Customer Acquisition Cost). Formula:\n\n`Total marketing spend last month ÷ New customers acquired = CAC`\n\nExample: Spent $5000, got 25 customers = $200 CAC. Write it down.",
        "Calculate LTV (Lifetime Value). Formula:\n\n`Average purchase value × Average purchases per year × Average customer lifespan in years = LTV`\n\nExample: $100/month × 12 months × 2 years = $2400 LTV. Be conservative on lifespan.",
        "Calculate LTV:CAC ratio. Formula:\n\n`LTV ÷ CAC = Ratio`\n\nExample: $2400 ÷ $200 = 12. Target: Minimum 3:1 ratio. If yours is under 3:1, you're spending too much to acquire customers or they're not staying long enough.",
        "Calculate Payback Period. Formula:\n\n`CAC ÷ Average monthly revenue per customer = Months to break even`\n\nExample: $200 CAC ÷ $100/month = 2 months. Target: Under 12 months. Over 18 months kills cash flow even if profitable long-term.",
        "Calculate Gross Margin. Formula:\n\n`(Revenue - Cost of Goods Sold) ÷ Revenue × 100 = Gross Margin %`\n\nExample: ($10K revenue - $4K costs) ÷ $10K = 60%. Target: 60-80% for services, 40-60% for products. If lower, you have a pricing or cost problem.",
        "Calculate Monthly Churn Rate. Formula:\n\n`Customers lost this month ÷ Customers at start of month × 100 = Churn %`\n\nExample: Lost 5 of 100 = 5% monthly churn. Target: Under 5% monthly for most businesses. Over 10% is crisis mode.",
        "Set alert thresholds. In your sheet, add 'Red Flag' column. Write rules:\n• If CAC exceeds $X, STOP ads\n• If churn exceeds Y%, fix retention BEFORE adding new customers\n• If payback period exceeds Z months, freeze growth spending",
        "Share sheet with leadership team. Schedule monthly 30-min review meeting. Everyone should know these numbers. When everyone understands the math, decisions get faster and better. What gets shared gets managed.",
      ],
      avoidPoints: [
        "Averaging everything → 'Average CAC is $200' hides that Facebook CAC is $50 and Google is $500 → Segment by channel, product, customer type → Averages hide problems",
        "Overestimating LTV → Using 'best customers' instead of average → Assuming 0% churn → Being optimistic kills businesses → Use conservative numbers, be surprised by upside",
        "Ignoring cash flow → Profitable on paper but payback is 24 months → You'll run out of cash before profit arrives → Track both profitability AND cash flow timing",
      ],
    },
    {
      taskNum: 7,
      title: "Days 20-23: Audit Products, Kill Bottom 20%",
      hook: "A founder had 15 products. Top 5 drove 80% of profit. Bottom 5 LOST money. Killed bottom 5, profit jumped 23%.",
      startDay: 20,
      duration: 3,
      impact: "quick-win",
      actions: [
        "Open Google Sheets. List every product/service you sell. Columns:\n• Product Name\n• Units Sold Last Month\n• Revenue\n• Direct Costs\n• Gross Profit\n• Gross Margin %",
        "For each product, calculate Gross Margin. Formula:\n\n`(Revenue - Direct Costs) ÷ Revenue × 100 = Gross Margin %`\n\nExample: $1000 revenue - $600 costs = $400 profit ÷ $1000 = 40% margin. Target: 50%+ for services, 40%+ for products.",
        "Calculate 'hidden costs' per product. Include:\n• Support time (hours × your hourly rate)\n• Refunds/chargebacks\n• Revisions\n• Storage/hosting\n\nAdd these to Direct Costs. Recalculate margin. Most products are less profitable than you think.",
        "Rank products by Gross Margin (highest to lowest). Mark bottom 20% (lowest margin products). These are your 'kill candidates'. They're consuming resources but generating little profit.",
        "For each kill candidate, ask:\n• Is this a 'loss leader' that brings customers who buy high-margin products?\n• Is this strategic (builds brand/community)?\n\nIf NO to both, mark for elimination.",
        "Make the cuts. Remove products from website TODAY. Send email to past customers:\n\n\"Quick update - we're discontinuing [product] to focus on [higher-value products]. Here's what we recommend instead: [alternative].\"",
        "Redirect resources from killed products:\n• Time you spent supporting low-margin products → Invest in marketing high-margin ones\n• Ad spend on losers → Move to winners\n\nCalculate time saved per week.",
        "Run new profit projection. Take last month's revenue, remove killed products, assume you convert 30% of those customers to higher-margin alternatives. Calculate new projected profit. Usually 15-25% higher even with some customer loss.",
        "Document learnings. Why were these products low-margin? Underpriced? Too much support needed? Wrong audience? Use insights to avoid creating new low-margin products.",
      ],
      avoidPoints: [
        "Emotional attachment → 'But I created this product!' → Data beats feelings → If it's losing money, it's hurting the business",
        "Revenue obsession → 'But it brings in $5K/month!' → $5K revenue at 10% margin ($500 profit) is worse than $2K revenue at 50% margin ($1K profit) → Optimize for profit not revenue",
        "Fear of losing customers → Some will leave. Most will buy alternatives → Keeping unprofitable products to avoid losing 5% of customers kills business → Better to lose 5% and gain 20% profit",
      ],
    },
    {
      taskNum: 8,
      title: "Days 23-26: Add $200 Upsell at Checkout, Test Conversion",
      hook: "A founder added one upsell at checkout. 18% took it. Added $3.6K monthly with zero extra marketing spend.",
      startDay: 23,
      duration: 3,
      impact: "medium",
      actions: [
        "Open Google Sheets. Calculate:\n• Current AOV (Average Order Value)\n• Number of transactions per month\n• Total monthly revenue\n\nExample: $100 AOV × 50 transactions = $5000/month.",
        "Brainstorm 3 upsell ideas that complement main purchase. Options:\n• Premium version (+$100-200)\n• Additional service (+$50-150)\n• Bundle deal (buy 2 get discount but higher total)\n\nPick the one customers ask for most.",
        "Price the upsell at 20-40% of main purchase price. Example: Main product is $500, upsell is $100-200. Too cheap looks low-value. Too expensive gets rejected. Sweet spot: 20-40% of main price.",
        "Write upsell copy. Format:\n\n\"Wait! Before you go...\n\nX% of customers also add [upsell] to [get benefit]\n\n✓ Benefit 1\n✓ Benefit 2\n✓ Benefit 3\n\nAdd for just $X\n\n[YES] or [No thanks]\"\n\nKeep it simple.",
        "If you have developer, add upsell to checkout flow. Show AFTER main purchase decision, BEFORE payment. One-click add to cart. If no developer, use tools like Shopify upsell apps, ClickFunnels, ThriveCart.",
        "Set tracking. You need to know:\n• How many saw upsell offer?\n• How many accepted?\n• Conversion rate?\n• Additional revenue?\n\nUse Google Analytics events or platform's built-in analytics. No tracking = no learning.",
        "Run test. Don't change anything else. Track daily:\n• Upsell views\n• Upsell conversions\n• Upsell conversion rate\n• Additional revenue\n\nTarget: 10-20% conversion rate. Industry average: 15%.",
        "Calculate impact. Example:\n\n`50 transactions/month × 15% took upsell (7.5 people) × $150 upsell = $1125 extra monthly = $13.5K annually`\n\nThat's the value of ONE upsell. Imagine having 3-4.",
        "If conversion is under 10%, test new copy or lower price. If over 20%, test higher price or different upsell. Optimize until you hit 15-25% conversion rate. Each 5% improvement is thousands in annual revenue.",
      ],
      avoidPoints: [
        "Offering irrelevant upsells → Don't offer random products → Upsell must enhance main purchase → Buying running shoes? Offer socks, not a water bottle",
        "Upsell before main sale → Don't show upsell before they commit to main purchase → They'll abandon cart → Show upsell AFTER they decide to buy, BEFORE they pay",
        "Complicated upsell flow → If accepting upsell requires 3 extra steps, conversion dies → Make it ONE CLICK to add → Friction kills conversions",
      ],
    },
    {
      taskNum: 9,
      title: "Days 26-28: Double Budget on Winning Channel",
      hook: "A founder found a channel with 300% ROI. Kept budget flat for 6 months. Finally doubled it, added $8K monthly profit.",
      startDay: 26,
      duration: 2,
      impact: "high",
      actions: [
        "Review your channel ROI (Return on Investment) sheet from earlier. Identify your #1 channel by ROI. Example:\n\n`Facebook ads - Spent $2000, generated $8000 revenue, $6000 profit = 300% ROI`\n\nThis is your scale candidate.",
        "Check consistency. Has this channel maintained 200%+ ROI for at least 30 days? If YES, proceed to scale. If NO, wait until it's consistent. Scaling inconsistent channels burns money.",
        "Document current performance baseline. Write down:\n• Current daily/weekly budget\n• Current CAC (Customer Acquisition Cost)\n• Current conversion rate\n• Current ROAS (Return on Ad Spend)\n\nYou'll compare these after scaling to see if efficiency holds.",
        "Increase budget by 50% (not 100% yet). Example: Currently spending $1000/week → Increase to $1500/week. Gradual scaling prevents algorithm shock on platforms like Facebook/Google. Let it stabilize for 5-7 days.",
        "Monitor daily. Track:\n• Spend\n• Conversions\n• CAC\n• ROAS\n\nCompare to baseline. If CAC increases more than 20%, you're scaling too fast. If stable, continue.",
        "Review 7-day results. If CAC stayed within 20% of baseline AND ROAS stayed above 200%, increase another 50%. Example: $1500/week → $2250/week. You've now doubled from $1000 to $2250 gradually.",
        "If metrics degraded (CAC up 30%+, ROAS dropped below 150%), rollback to previous budget level. Not every channel can scale infinitely. Document the 'maximum efficient spend' for this channel.",
        "Review after 14 days at new budget. Calculate new profit:\n\n`(New revenue - New spend) vs (Old revenue - Old spend)`\n\nGoal: Add $2K-5K in monthly profit from one channel scale.",
      ],
      avoidPoints: [
        "Doubling overnight → Jumping from $1K to $2K budget in one day often doubles CAC → Platforms need time to optimize → Scale in 25-50% increments every 5-7 days",
        "Scaling without baseline → If you don't know what 'normal' looks like, you can't tell if scaling broke something → Document baseline metrics before scaling",
        "Ignoring quality decline → More volume can mean worse leads → Check lead quality, customer satisfaction, sales close rate → Revenue without quality leads to refunds and churn",
      ],
    },
    {
      taskNum: 10,
      title: "Days 28-30: 30-Day Money Review & Next Month Plan",
      hook: "Most founders finish a month and start the next without learning. One founder added monthly reviews, ROI improved 40% in 90 days.",
      startDay: 28,
      duration: 2,
      impact: "medium",
      actions: [
        "Open Google Sheets. Create 'Month Review' tab. Write down:\n• Total revenue this month\n• Total expenses this month\n• Net profit\n• Profit margin %\n\nCompare to last month. Revenue up or down? Profit up or down?",
        "List top 3 wins this month. Format:\n• What happened?\n• Why did it work?\n• How much revenue/profit did it generate?\n• Can we repeat it next month?\n\nExample: 'Upsell test - 18% conversion - Added $1200 MRR (Monthly Recurring Revenue) - YES repeat and optimize.'",
        "List top 3 losses/failures this month. Format:\n• What didn't work?\n• Why did it fail?\n• How much did it cost us?\n• What would we do differently?\n\nExample: 'TikTok ads - $500 spent, $200 revenue - Wrong audience - Test different creative next time.'",
        "Calculate ROI (Return on Investment) by initiative. List everything you tried: Channel tests, price changes, upsells, partnerships. Formula for each:\n\n`(Revenue generated - Cost) ÷ Cost × 100 = ROI%`\n\nRank from highest to lowest ROI.",
        "Run Start-Stop-Continue exercise:\n• START: What 1-2 new things to test next month?\n• STOP: What 1-2 things to kill?\n• CONTINUE: What 1-2 things to double down on?\n\nKeep it simple. 1-2 each max.",
        "Set ONE big goal for next month. Format:\n\n\"Increase [metric] from [current] to [target] by [date]\"\n\nExample: 'Increase MRR from $10K to $12K by end of next month.' One goal only. Focus compounds.",
        "Break goal into weekly milestones:\n• Week 1: [What needs to happen]\n• Week 2: [What needs to happen]\n• Week 3: [What needs to happen]\n• Week 4: [What needs to happen]\n\nClear milestones = clear action.",
        "Schedule next month's review. Put it in calendar for same time next month. 2-hour blocked time. Non-negotiable. The companies that review monthly outgrow those that review quarterly or never.",
      ],
      avoidPoints: [
        "No time to reflect → 'Too busy to look back' means repeating mistakes → Block 2 hours monthly → ROI on reflection is 10x any task you'd skip",
        "Celebrating only wins → Losses teach more than wins → Spend equal time on what failed → Companies that confront failure grow faster",
        "Too many goals → Setting 5 goals for next month means doing 5 things poorly → Pick ONE big goal → Focus beats variety",
      ],
    },
  ],
};

/**
 * Branding Magnet: Focus on visibility, content, authority, and personal brand.
 * Target audience: Founders who need to build their presence and attract inbound leads.
 */
const BRANDING_MAGNET_PLAN: BusinessCalendarPlan = {
  key: "brandingMagnet",
  label: "Branding Magnet",
  monthTheme: "Brand Building Month",
  tasks: [
    {
      taskNum: 1,
      title: "Days 1-3: Fix LinkedIn Profile, Get 5 Inbound DMs",
      hook: "A founder had 5K followers but zero inbound leads. Fixed his LinkedIn in 3 hours. Got 12 DMs in first week.",
      startDay: 0,
      duration: 3,
      impact: "high",
      actions: [
        "Log into LinkedIn. Click 'Edit Profile'. Change your headline from job title to value statement. Format:\n\n\"I help [WHO] achieve [WHAT]\"\n\nExample: 'I help B2B SaaS (Software as a Service) founders scale from $100K to $1M ARR (Annual Recurring Revenue) without paid ads'. Not 'CEO at Company X'.",
        "Update profile photo. Use professional headshot (NOT logo, NOT group photo). Smile. Eye contact. Plain background. If you don't have one, use your phone + natural light. Takes 5 minutes. Good photo increases profile views 14x.",
        "Write 'About' section using this template:\n\n\"Most [audience] struggle with [problem]. I help them [solution] through [method]. Results: [Client outcome 1], [Client outcome 2], [Client outcome 3]. If you want [benefit], send me a DM.\"\n\nKeep it under 150 words. Write like you talk.",
        "Add 'Featured' section. Pin your best 3 posts, your best case study, or your lead magnet. Visitors should see your best work immediately. Click 'Add Featured' → Select 'Posts' or 'Links'.",
        "Update your banner/cover image. Use Canva (free). Add text: Your main value proposition + call to action. Example: 'Helping SaaS Founders 10x Their MRR (Monthly Recurring Revenue) | DM me for free growth audit'. Takes 15 minutes.",
        "Turn on Creator Mode. LinkedIn profile → Resources → Creator mode → Toggle ON. This adds 'Follow' button, shows your top topics, increases reach. Literally one click. Do it now.",
        "Post your first value-bomb. Use this format:\n\n\"[Bold claim or question]\n\nI [did X thing].\n\nHere's what I learned:\n• [Lesson 1]\n• [Lesson 2]\n• [Lesson 3]\n\nMost people [common mistake]. Do this instead: [your approach].\"\n\nPost it. Track engagement.",
        "Engage with 20 posts from your ideal customers. Find them by searching for:\n• Your industry keywords\n• Your competitors' posts\n• Industry hashtags\n\nLeave 2-3 sentence comments (not 'Great post!'). Add your take. Goal: Get 5 profile visits from engagement.",
      ],
      avoidPoints: [
        "Generic corporate speak → 'Passionate thought leader driving synergies' means nothing → Talk like a human. 'I help founders make more money' is clear",
        "No call to action → Profile with no CTA is a dead end → Tell people what to do next: DM you, visit your website, download your guide",
        "Perfect photos paralysis → Waiting for professional photoshoot means waiting months → Phone photo with good lighting beats no photo. Ship now, improve later",
      ],
    },
    {
      taskNum: 2,
      title: "Days 3-6: Post 3x Per Day, Get 100+ Impressions Per Post",
      hook: "A founder posted weekly for 6 months. No results. Switched to 3x daily for 2 weeks. Reach jumped 10x.",
      startDay: 3,
      duration: 3,
      impact: "high",
      actions: [
        "Create content batch for 9 posts (3 days × 3 posts). Open Google Doc or Notion. Use this template for EACH post:\n• Hook: Bold statement\n• Story: 2-3 sentences\n• Lesson: 3 bullet points\n• CTA (Call to Action): Ask question\n\nExample in next action.",
        "Example post:\n\n\"Most founders waste $10K on ads before testing organic. I did. Lost $8K in 60 days. Then I tried this:\n• Post 3x daily for 30 days\n• Comment on 20 posts per day\n• DM everyone who engaged\n\nResult: 40 inbound leads, $25K in sales, $0 ad spend. What's stopping you from posting daily?\"\n\nCopy this format. Make it your own.",
        "Write 3 posts about:\n• Your biggest mistake\n• Your best win\n• Your contrarian take\n\nBe specific. Use numbers. Make it personal. No corporate speak. Write like you're texting a friend. Takes 30 minutes to write all 3.",
        "Schedule posts in LinkedIn. Click 'Start a post' → Write post → Click clock icon (bottom right) → Schedule for 8am, 12pm, 5pm. Best times:\n• Morning (8-10am)\n• Lunch (12-1pm)\n• Evening (5-6pm)\n\nSpread them out. Schedule all 9 posts now.",
        "Set 30-min engagement blocks 3x per day. Morning (8:30am), Lunch (12:30pm), Evening (5:30pm). Spend 30 mins:\n• Comment on 10 posts from your ideal customers\n• Reply to every comment on YOUR posts\n• DM (Direct Message) people who engaged with value (not a pitch)",
        "Track results in Google Sheets. Columns:\n• Post Date\n• Topic\n• Impressions\n• Comments\n• Profile Visits\n• DMs Received\n\nGoal: 100+ impressions per post. If under 100, you're not engaging enough. More comments = more reach.",
        "Identify your best post. Which one got most engagement? Why? Topic? Format? Hook? Tone? Write down what worked. Create 3 more posts using same pattern. What works once will work again.",
      ],
      avoidPoints: [
        "Post and ghost → Posting without engaging gets no results → First 60 minutes after posting are CRITICAL → Reply to comments, it boosts reach",
        "Salesy content → 'Buy my course!' gets ignored → Provide value first, pitch later → 90% value, 10% promotion",
        "Inconsistency → Posting 3x today then nothing for 5 days kills momentum → Algorithm rewards consistency → 1 post daily beats 7 posts on Monday",
      ],
    },
    {
      taskNum: 3,
      title: "Days 6-9: DM 50 People Who Engaged, Book 5 Calls",
      hook: "A founder posted content but never DM'd anyone. Zero sales. Started DM'ing people who commented. Booked 18 calls in 30 days.",
      startDay: 6,
      duration: 4,
      impact: "medium",
      actions: [
        "Open Google Sheets. Create DM (Direct Message) tracker:\n• Name\n• How They Engaged\n• DM Sent?\n• Response?\n• Call Booked?\n\nThis keeps you organized. You'll DM 50 people. Track every single one.",
        "Identify 50 people to DM. Who?\n• People who commented on your posts\n• People who viewed your profile\n• People who liked/shared your content\n\nGo to 'Notifications' on LinkedIn. Export the names. If under 50, go back 2 weeks.",
        "Write DM template. Use this:\n\n\"Hey [name]! Saw you [commented on my post / checked out my profile / are also in [industry]]. Really liked your take on [specific thing they said]. Quick question - what's your biggest challenge with [problem your product solves] right now? Always curious to hear from people doing [their thing].\"\n\nPersonalize first sentence. Rest can be template.",
        "Send 15 DMs per day for 3 days (total 45). Don't send all 50 at once or LinkedIn flags you as spam. Spread it out. Takes 20 minutes per day. Copy template, personalize first line, send. Track in your sheet.",
        "When someone replies, engage in conversation. Don't pitch immediately. Ask followup questions. Understand their problem. After 2-3 messages back and forth, then offer:\n\n\"Would it help if I showed you how I solved that? I can hop on a quick 15-min call this week. No pitch, just want to share what worked for me.\"",
        "Goal: Book 5 calls. Industry average DM → call conversion: 10-15%. So 50 DMs should get 5-7 calls. If under 5, your DM template needs work. Make it more personal. Less salesy. More curious.",
        "For people who book calls, use this call structure:\n• First 10 mins: Understand their problem (ask questions, listen)\n• Last 5 mins: \"Based on what you said, I think [your solution] could help. Want me to send you details?\"\n\nDon't hard sell. Soft offer.",
      ],
      avoidPoints: [
        "Generic mass DMs → 'Hey, check out my product!' gets ignored → Personalize first line, reference what they did, ask genuine question",
        "Pitching in first message → Instant turn-off → Build rapport first, offer value second, pitch third (if at all)",
        "No follow-up → People are busy, they forget → If no response in 3 days, send gentle followup: 'Hey [name], following up on my message. Still curious about [thing you asked]. No worries if timing isn't right!'",
      ],
    },
    {
      taskNum: 4,
      title: "Days 10-13: Collect 10 Testimonials with Numbers",
      hook: "Added 15 testimonials to a founder's site. Conversions jumped 34% in 14 days. Testimonials are free marketing that works 24/7.",
      startDay: 10,
      duration: 3,
      impact: "high",
      actions: [
        "List your 20 happiest customers. Sort by:\n• Best results\n• Longest tenure\n• Most enthusiastic\n\nExport to Google Sheets. These are your testimonial targets. You need 10 testimonials with specific results/numbers.",
        "Write testimonial request email template:\n\n\"Hey [name]! Quick favor - would love a testimonial from you. Can you share:\n1) What problem were you facing before?\n2) What results have you seen? (Numbers are gold!)\n3) Why would you recommend me?\n\nJust 3-4 sentences is perfect. Would mean a lot!\"\n\nKeep it casual.",
        "Send email to all 20 customers. Don't wait. Do it now. Takes 15 minutes. Goal: Get 10+ responses. Industry average: 50% response rate. So 20 emails should get 10 testimonials. If under 10, follow up with personal text/call.",
        "For top 5 customers, request VIDEO testimonial. Text them:\n\n\"Hey [name], your written testimonial was amazing! Would you be up for a quick 2-min video? Just film on your phone, answer those same 3 questions. I'll make you look good, promise!\"\n\nVideo testimonials convert 2-3x better than text.",
        "Create testimonial doc in Google Docs. Format:\n• Customer name\n• Company\n• Testimonial\n• Result numbers\n• Date received\n• Permission to use publicly\n\nGet explicit permission: 'Can I use this on my website/social media? Can I use your name and company?'",
        "Design testimonial graphics. Use Canva (free). Template:\n• Customer quote\n• Their photo\n• Result number in big text\n• Your logo\n\nExample: '[Quote]' - John Smith, CEO | '$50K in 90 days' in large font. Create 5-10 graphics from best testimonials.",
        "Add testimonials to website. Create 'Results' or 'Testimonials' page. Add section on homepage. Include:\n• Written testimonials\n• Video testimonials\n• Logos of clients (if B2B)\n\nMake them visible. Social proof buried on page 5 doesn't convert.",
        "Post testimonials on social media. Share 1 testimonial per week on LinkedIn. Format:\n\n\"Results speak louder than promises. Here's what [name] achieved: [testimonial + results]. If you want similar results with [your service], DM me.\"\n\nTestimonial posts get high engagement.",
      ],
      avoidPoints: [
        "Asking for generic praise → 'Great to work with!' means nothing → Ask for specific results: dollar amounts, time saved, problems solved → Numbers convince",
        "Asking too late → Ask right after delivering a win, when excitement is high → Wait 6 months, enthusiasm fades → Strike while iron is hot",
        "No permission → Using testimonials without explicit permission is risky → Always ask: Can I use your name? Company? Photo? Get it in writing",
      ],
    },
    {
      taskNum: 5,
      title: "Days 13-17: Create 1 Video, Post to 3 Platforms",
      hook: "A founder finally made a video. Reached 10x more people than text posts. Video isn't optional anymore, it's required.",
      startDay: 13,
      duration: 4,
      impact: "medium",
      actions: [
        "Pick ONE topic for your video. Best topics:\n• Your biggest lesson\n• Your biggest mistake\n• Your contrarian take\n• A how-to tutorial\n\nKeep it simple. 1 video = 1 topic. Don't try to cover everything.",
        "Write a 30-second script. Format:\n\n\"I [did X thing]. It [result - good or bad]. Here's what I learned: [Lesson 1], [Lesson 2], [Lesson 3]. Don't make the same mistake I did. [Call to action].\"\n\nWrite it out word-for-word. You'll forget if you wing it.",
        "Set up your recording space. No fancy equipment needed. Use your phone. Find spot with:\n• Good natural light (face a window)\n• Plain background (wall or bookshelf)\n• Quiet environment\n\nProp phone at eye level (use books/stand).",
        "Record the video. Press record. Look at camera (not screen). Speak clearly. Smile. Be yourself. First take will suck. That's normal. Do 3-5 takes. Pick best one. Aim for 60-90 seconds. Short videos perform better.",
        "Edit video (optional but recommended). Use CapCut (free) or iPhone iMovie. Add:\n• Captions (80% watch without sound)\n• Your logo/watermark\n• Zoom effect on key points\n\nTakes 15-20 minutes. Editing makes it look 10x more professional.",
        "Post to LinkedIn first. Upload native video (don't link to YouTube). Write caption: Hook + context + call to action. Example:\n\n\"I wasted $8K on Facebook ads before I tried this. [Video explains the lesson]. What's your biggest marketing mistake? Comment below.\"\n\nPost it.",
        "Post to Twitter/X. Same video, shorter caption. Twitter likes punchy. Example:\n\n\"Your biggest marketing mistake (probably). [Video]\"\n\nUse 2-3 relevant hashtags. Post 2 hours after LinkedIn post.",
        "Post to Instagram/TikTok. Vertical format (9:16). Use phone to re-record vertical if needed. Add trending audio or music. Post 4 hours after Twitter. Track which platform gets most views. Double down on that one next time.",
        "Track results. Platform | Views | Comments | DMs (Direct Messages) | Profile Visits. Goal: 500+ views total across all platforms. If under 500, your topic wasn't interesting enough OR you didn't engage enough after posting. Reply to every comment to boost reach.",
      ],
      avoidPoints: [
        "Perfectionism paralysis → Waiting for perfect setup means never posting → Phone quality is fine. Authenticity beats production value → Ship first video TODAY",
        "Reading from script on camera → Looks robotic → Memorize your 3 key points, then speak naturally → It's okay to stumble, it's relatable",
        "Posting once and quitting → One video won't make you viral → Commit to 1 video per week for 8 weeks minimum → Consistency builds audience",
      ],
    },
    {
      taskNum: 6,
      title: "Days 17-20: Write 1 Case Study, Get 50+ Engagement",
      hook: "A founder wrote detailed case study of customer success. That ONE post generated 8 inbound leads. Case studies sell better than ads.",
      startDay: 17,
      duration: 3,
      impact: "high",
      actions: [
        "Pick your best customer result. Who had the most dramatic transformation? Most revenue impact? Fastest results? Best story? That's your case study subject. Text or call them:\n\n\"Your results were amazing. Can I write a case study? Make you look good + show what's possible.\"",
        "Interview them for 20 minutes. Ask:\n1) What was the problem before? (Be specific - what did their typical day look like? What were they struggling with?)\n2) Why did they choose you?\n3) What was the process?\n4) What results did they get? (NUMBERS)\n5) What would they tell someone considering working with you?",
        "Write case study using this structure:\n\n• Title: \"How [Customer] achieved [specific result] in [timeframe]\"\n• Paragraph 1: The Problem (paint the picture - where they were, what they tried, why it wasn't working)\n• Paragraph 2: The Solution (how you helped, what you did differently, key steps)\n• Paragraph 3: The Results (specific numbers: revenue, time saved, growth percentage, etc)\n• Paragraph 4: Customer quote\n• Paragraph 5: Call to action",
        "Make it scannable. Use bullet points for key results. Bold the numbers. Add subheadings. People skim. Make the good stuff easy to find. Example format:\n\nResults:\n• Revenue: $45K → $120K (+167%)\n• Time saved: 15 hours/week\n• Customer acquisition: 2x in 90 days",
        "Get customer approval. Send draft:\n\n\"Hey [name], here's the case study. Does this look accurate? Anything you'd change?\"\n\nGet their written 'approved to publish' confirmation. Screenshot it. Protects you legally.",
        "Design visual version. Use Canva. Create carousel (LinkedIn) or PDF (website). Make it visual:\n• Customer photo\n• Big numbers\n• Quotes in highlight boxes\n• Before/after comparison\n\nText-only case studies get skipped. Visual case studies get shared.",
        "Post on LinkedIn. Format:\n\nHook: \"This customer increased revenue 167% in 90 days. Here's how:\"\n+ Summary\n+ Link to full case study\n+ Relevant image/carousel\n\nTag the customer (if they're okay with it). They'll likely share it = 2x the reach.",
        "Post on your website. Create 'Case Studies' or 'Success Stories' page. Add this case study with images. Update your homepage to link to it. Case studies on homepage increase conversions 25-40%. Make them easy to find.",
        "Promote it for 7 days. Share on:\n• Twitter\n• Instagram\n• Email newsletter\n• Relevant Facebook groups (if allowed)\n• DMs when prospects ask 'Does this work?'\n\nMilk this asset. One case study = 10+ pieces of content.",
      ],
      avoidPoints: [
        "Too vague → 'They grew their business' doesn't convince → Use specific numbers: '$45K to $120K in 90 days' is concrete and believable",
        "Focusing on you → Case study isn't about how great YOU are → It's about the CUSTOMER'S transformation → Make them the hero, you're the guide",
        "Publishing without permission → Never publish customer info without explicit approval → Get it in writing → Legal issues kill businesses",
      ],
    },
    {
      taskNum: 7,
      title: "Days 20-23: Write LinkedIn Article, Get 500+ Views",
      hook: "A founder wrote 5 detailed LinkedIn articles. Inbound leads doubled in 45 days. Long-form content positions you as the expert.",
      startDay: 20,
      duration: 3,
      impact: "high",
      actions: [
        "Pick one topic you can teach in depth. Best topics:\n• Your framework/methodology\n• Common mistake in your industry\n• Step-by-step tutorial\n• Contrarian take with proof\n\nAim for 800-1200 words. Pick something you've done 100+ times.",
        "Create article outline. Structure:\n1) Hook paragraph (bold claim or problem statement)\n2) Why this matters (context/stakes)\n3) The solution (your framework/steps in detail)\n4) Example or case study\n5) Common mistakes to avoid\n6) Call to action\n\nWrite outline first. Makes writing 5x faster.",
        "Write the article. Don't overthink it. Write like you're explaining to a friend. Use short paragraphs (2-3 sentences max). Use bullet points. Use subheadings every 200 words. Make it scannable. People don't read online, they skim. Make the good stuff easy to find.",
        "Add visuals. Use screenshots, diagrams, charts, or images every 300 words. Canva (free) works great. Visual breaks keep people reading. Walls of text get skipped. Example: If teaching a framework, create simple diagram showing the steps.",
        "Write compelling title. Format:\n• \"How to [achieve result] without [common pain point]\"\n• \"The [number] [thing] that [result]\"\n• \"[Bold claim]: [Explanation]\"\n\nExample: \"How to Get 100 Leads Without Spending $1 on Ads\" or \"I Generated $50K from LinkedIn in 90 Days (Here's My Exact Process)\".",
        "Publish on LinkedIn Articles. Log into LinkedIn → Click 'Write article' (top of feed) → Paste your content → Add featured image → Publish. LinkedIn Articles get WAY more reach than regular posts. Algorithm pushes them harder.",
        "Promote the article. After publishing, create a regular LinkedIn POST linking to the article. Write hook:\n\n\"Just published my complete framework for [topic]. Covers [key point 1], [key point 2], [key point 3]. Link in comments 👇\"\n\nComment with article link. Post this.",
        "Share in 5 other places:\n• Twitter (with key takeaways)\n• Your email list\n• Relevant Facebook/Slack groups (if allowed)\n• Your website blog\n• As PDF in sales conversations\n\nOne article = 10+ places to promote it. Promote it for 2 weeks.",
        "Track performance. LinkedIn shows:\n• Views\n• Reactions\n• Comments\n\nGoal: 500+ views in first week. If under 500, promote harder. Share in DMs (Direct Messages), tag people mentioned in article, engage with commenters immediately. First 48 hours determine reach.",
      ],
      avoidPoints: [
        "Generic advice everyone knows → 'Post consistently on LinkedIn' has been said 1000 times → Share YOUR specific process with numbers and examples → Specificity wins",
        "Too short → 300-word article isn't enough → LinkedIn Articles should be 800-1200 words → Go deep. Show expertise → Short posts are fine, but articles need substance",
        "Writing and ghosting → Post the article then disappear → Reply to EVERY comment → Each reply boosts reach → Engagement in first hour = critical",
      ],
    },
    {
      taskNum: 8,
      title: "Days 23-26: Build Free Lead Magnet, Get 20 Emails",
      hook: "A founder had 10K followers but no email list. Built a lead magnet. 500 emails in 30 days. Email owns the relationship, social media rents it.",
      startDay: 23,
      duration: 3,
      impact: "quick-win",
      actions: [
        "Identify ONE problem your audience has RIGHT NOW that you can solve in 10-15 minutes. Common formats:\n• Checklist\n• Template\n• Swipe file\n• Mini-tutorial\n• Cheat sheet\n\nExample: 'The 20-Point LinkedIn Profile Audit Checklist' or '10 Email Subject Lines That Get 40%+ Open Rates'.",
        "Create the lead magnet. Use Google Docs or Canva. Make it visual and actionable. Include:\n• Title page\n• Intro (what they'll get)\n• The content (checklist/template/etc)\n• Call to action at end (\"Want help implementing this? Book a call\")\n\nKeep it 3-5 pages. Don't overthink it. Done beats perfect.",
        "Set up landing page. Use Carrd (free), Mailchimp landing page (free), or Google Form + Doc. Required elements:\n• Headline (promise the outcome - \"Get My Free [Thing] That [Result]\")\n• 3-5 bullets (what's inside)\n• Image (show the resource)\n• Email capture form\n• Download button\n\nSimple converts better than complex.",
        "Connect to email tool. Use Mailchimp (free up to 500 contacts), ConvertKit, or Beehiiv. When someone enters email, automatically send them:\n1) Welcome email with download link\n2) Email asking \"What's your #1 challenge with [topic]?\"\n3) Email sharing one tip\n\nSet up this 3-email sequence. Takes 20 minutes.",
        "Create promo post for LinkedIn. Format:\n\n\"I created a free [resource] that helps you [achieve result]. Includes:\n• [Benefit 1]\n• [Benefit 2]\n• [Benefit 3]\n\nComment 'SEND IT' and I'll DM you the link.\"\n\nThis format gets HIGH engagement. Send link via DM (Direct Message), not comments - LinkedIn throttles links.",
        "Promote in 5 places:\n1) Pin to LinkedIn profile\n2) Add to Twitter bio with link\n3) Mention in every DM conversation\n4) Add to email signature\n5) Share in relevant communities\n\nPromote it EVERYWHERE for 7 days straight.",
        "Track signups. Use Google Sheets:\n• Date\n• Source (where they found it)\n• Email\n• Converted to Call/Customer?\n\nGoal: 20+ signups in first 7 days. If under 20, promote harder. Share it in DMs, create more posts about it, offer it in comments.",
        "Follow up with signups. Email them personally after 3 days:\n\n\"Hey [name], did you get a chance to check out the [resource]? Any questions? I'm here if you need help with [topic].\"\n\nPersonal touch increases conversion to calls/customers by 3x.",
      ],
      avoidPoints: [
        "Making it too complex → 50-page ebook nobody reads → Keep it simple and actionable → 5 pages that get used beats 50 pages that don't",
        "Hiding the opt-in → Lead magnet buried on a subpage nobody visits → Promote it EVERYWHERE → Make it impossible to miss",
        "No follow-up → Collecting emails then never emailing them → Email at least weekly → Provide value → Email list only works if you use it",
      ],
    },
    {
      taskNum: 9,
      title: "Days 26-28: Go Live on LinkedIn, Get 10+ Attendees",
      hook: "A founder was terrified of going live. Finally did it. 23 people attended. Got 4 leads. Live video builds trust 10x faster.",
      startDay: 26,
      duration: 2,
      impact: "medium",
      actions: [
        "Pick topic for live session. Best formats:\n• Q&A (\"Ask me anything about [your expertise]\")\n• Tutorial (\"Watch me [do something valuable] in real-time\")\n• Hot take (\"My controversial opinion on [industry topic]\")\n• Behind-the-scenes (\"How I [achieved result]\")\n\nPick one you can talk about for 20-30 minutes.",
        "Promote 3 days before. Create post:\n\n\"Going LIVE on [day] at [time] to talk about [topic]. Bring your questions. Comment 'IN' if you're joining!\"\n\nPost this 3 days out, 1 day out, and 1 hour before. Each reminder increases attendance 30-40%.",
        "Prepare loose outline (not script). Write down:\n• 3 key points you'll cover\n• 5 common questions people ask\n• 1 story or example\n• Call to action at end\n\nDON'T script word-for-word. You want natural conversation, not reading teleprompter. Just know your 3 points.",
        "Set up your space. Same as video:\n• Good light (face window)\n• Clean background\n• Phone/laptop at eye level\n• Test audio (use headphones with mic if possible)\n• Have water nearby\n• Charge device\n\nDo tech check 10 minutes before. Nothing worse than tech fails on live video.",
        "Go live on LinkedIn. Open LinkedIn app → Click '+' → Select 'Video' → Choose 'LinkedIn Live' (may need to enable in settings first). Say hi, introduce topic, deliver your 3 key points, answer questions from comments, give call to action, end. Aim for 20-30 minutes. Short enough to hold attention, long enough to provide value.",
        "Engage during the live. Read comments OUT LOUD and answer them.\n\n\"Great question from Sarah...\"\n\nPeople want interaction. That's why they showed up live vs watching replay. Acknowledge everyone who comments. Makes them feel seen. They'll come back next time.",
        "Repurpose the recording. After live ends, LinkedIn saves it. Download it. Post it:\n1) As regular video post next day\n2) Upload to YouTube\n3) Extract 3-5 short clips for Reels/TikTok\n4) Transcribe and turn into article\n\nOne 30-min live = 10+ pieces of content.",
        "Make it recurring.\n\n\"See you next [frequency] for another live session!\"\n\nMonthly or bi-weekly is sustainable. Consistency builds audience. People will start expecting it. \"Oh it's Tuesday, that's when [your name] goes live.\" Recurring beats one-off.",
      ],
      avoidPoints: [
        "Perfectionism paralysis → 'I need professional setup first' → No you don't → Phone + good light = good enough → Waiting means never starting",
        "Not promoting enough → Going live with no promotion = 2 attendees (your mom and your friend) → Promote 3x minimum → Each promo increases attendance",
        "Talking AT people instead of WITH them → Live video isn't a webinar → It's a conversation → Read comments, answer questions, interact → Engagement is the point",
      ],
    },
    {
      taskNum: 10,
      title: "Days 28-30: Review Content Performance, Double Down on Winners",
      hook: "Most founders create content randomly. One founder tracked what worked, doubled down on top 3 formats. Leads increased 3x in 60 days.",
      startDay: 28,
      duration: 2,
      impact: "high",
      actions: [
        "Export last 30 days of content performance. For LinkedIn: Go to Analytics → Posts → Download last 30 days. For other platforms, manually log:\n• Post date\n• Topic\n• Format (video/text/carousel)\n• Impressions\n• Engagement rate\n• Profile visits\n• DMs (Direct Messages) received\n\nPut it all in Google Sheets.",
        "Calculate engagement rate for each post. Formula:\n\n`(Likes + Comments + Shares) ÷ Impressions × 100 = Engagement rate %`\n\nExample: 50 engagements ÷ 1000 impressions = 5% engagement rate. Industry average: 2-3%. Above 5% = winner. Below 1% = loser.",
        "Identify top 3 performers. Which posts had:\n• Highest engagement rate\n• Most profile visits\n• Most DMs/leads\n\nWrite down: What was the topic? What was the format? What was the hook? What time did you post? Look for patterns. Your top posts reveal what your audience wants.",
        "Identify bottom 3 performers. Which posts flopped? Why? Wrong topic? Weak hook? Bad timing? Too salesy? Analyze what didn't work. Avoid these topics/formats going forward. Stop creating content that doesn't land. Focus energy on what works.",
        "Create content plan for next 30 days based on data. Format: Week | Monday | Tuesday | Wednesday | Thursday | Friday. Fill it with:\n• 70% proven winners (topics/formats that performed well)\n• 20% new tests (slight variations)\n• 10% promotional (your offer/service)\n\nData-driven content beats guessing.",
        "Set 3 specific goals for next month. Examples:\n• Increase average engagement rate from 3% to 5%\n• Get 50 new email subscribers\n• Book 10 calls from inbound DMs\n\nMake them measurable. Track weekly. Adjust if not hitting targets. What gets measured gets managed.",
        "Batch-create next week's content RIGHT NOW. Don't wait until Monday. Write 5-7 posts based on your proven winners. Schedule them using LinkedIn's scheduler or Buffer/Hootsuite. Front-load the work. Frees you up to engage and respond during the week. Creation and distribution are separate activities.",
        "Schedule next month's review. Put it in calendar for same date next month. 2-hour block. Non-negotiable. Monthly reviews turn content from random acts into systematic growth. Companies that review monthly outperform those that don't by 3-5x.",
      ],
      avoidPoints: [
        "Ignoring the data → Creating content you THINK will work vs what DATA shows works → Your opinion doesn't matter, your audience's behavior does → Follow the numbers",
        "Trying to please everyone → Your worst-performing content tried to appeal to everyone → Your best content spoke to specific pain point → Narrow focus beats broad appeal",
        "No follow-through → Reviewing performance but not changing behavior → Insights without action = wasted time → Implement what you learn or don't bother reviewing",
      ],
    },
  ],
};

/**
 * Strategy Planner: Focus on systems, processes, SOPs, and optimization.
 * Target audience: Founders who need to build scalable operations and reduce chaos.
 */
const STRATEGY_PLANNER_PLAN: BusinessCalendarPlan = {
  key: "strategyPlanner",
  label: "Strategy Planner",
  monthTheme: "Systems & Process Month",
  tasks: [
    {
      taskNum: 1,
      title: "Days 1-3: Document Your Top 3 Money-Making Processes",
      hook: "A founder's sales process lived in one person's head. That person quit. Revenue dropped 60% overnight. Document or die.",
      startDay: 0,
      duration: 3,
      impact: "high",
      actions: [
        "List every process in your business:\n• Sales\n• Onboarding\n• Delivery\n• Support\n• Marketing\n• Hiring\n• Etc.\n\nWrite them all down in Google Doc or Notion. You probably have 15-20. Don't skip this step.",
        "Identify your top 3 revenue-generating processes. Which processes directly make you money? Usually:\n• Sales (how you close deals)\n• Delivery (how you fulfill)\n• Marketing (how you get leads)\n\nCircle these 3. Start here.",
        "Pick process #1. Record yourself doing it start to finish. Use Loom or phone screen recorder. Talk out loud:\n\n\"First I do X, then I check Y, then I send Z.\"\n\nDon't edit. Just capture how it actually works TODAY, mess and all. Aim for 10-15 minute video.",
        "While watching the recording, write step-by-step checklist. Format: Step number | Action | Tool used | Quality check. Example:\n\n1. Open CRM (Customer Relationship Management) | Salesforce | Verify contact info complete\n2. Send intro email | Gmail | Use template A\n3. Wait 48 hours | Calendar | Set reminder\n\nBe specific.",
        "Repeat for processes #2 and #3. Record video, create checklist. By end of this task, you should have:\n• 3 Loom videos (10-15 mins each)\n• 3 checklists (10-20 steps each)\n\nSave everything in one folder: 'Core Processes'.",
        "Test the checklist. Give it to teammate or imagine you're training new hire. Can they follow it WITHOUT asking you questions? If yes, it's good. If they're confused, add more detail. Goal: 80% complete without your help.",
        "Create process library in Notion or Google Drive. Create folder structure:\n• /Core Processes/Sales\n• /Core Processes/Delivery\n• /Core Processes/Marketing\n\nUpload videos and checklists. Make it accessible to entire team. Share the link.",
        "Assign process owners. Who's responsible for:\n• Keeping this process updated\n• Training new people on it\n• Improving it quarterly\n\nWrite owner name at top of each checklist. Accountability = maintenance.",
      ],
      avoidPoints: [
        "Perfectionism → 'I'll document it when I have time to make it perfect' → Perfect never happens → Document messy version NOW, improve later → Done beats perfect",
        "Documenting everything at once → 20 processes = overwhelming = nothing gets done → Start with top 3 money-makers → More later",
        "Skipping the video → 'I'll just write it down' → Writing misses 50% of nuance → Video captures how you actually do it → Both video + checklist",
      ],
    },
    {
      taskNum: 2,
      title: "Days 3-6: Create Quality Checklists, Cut Errors 50%",
      hook: "A team had 30% error rate on deliverables. Added simple checklists. Errors dropped to 3%. Same people, 10x better quality.",
      startDay: 3,
      duration: 3,
      impact: "medium",
      actions: [
        "Identify your 3 highest-error processes. Where do mistakes happen most? Check:\n• Customer complaints\n• Internal rework\n• Refunds/revisions\n• Support tickets\n\nAsk team: 'Where do we mess up most?' Write down top 3.",
        "For process #1, list every step where errors occur. Example:\n\nSales process:\n• Wrong pricing quoted\n• Contract terms missed\n• Onboarding email not sent\n\nProposal process:\n• Typos in document\n• Wrong deliverables listed\n• Deadline miscalculated\n\nWrite every error type you've seen in last 60 days.",
        "Create quality checklist for process #1. Format:\n\n□ [Action item] - [What good looks like] - [How to check]\n\nExample:\n□ Verify pricing - Matches pricing sheet exactly - Cross-reference with current price doc\n□ Proofread contract - Zero typos, client name correct - Read out loud once\n□ Send onboarding email - Within 24 hours of signing - Check Sent folder\n\nMake each item checkable.",
        "Define 'what good looks like' for each step. Don't assume people know. Example:\n\nNOT: \"Proofread document\"\n\nINSTEAD: \"Read document out loud once, check all numbers against source, verify client name appears correctly 3x\"\n\nSpecific standards prevent interpretation errors.",
        "Add the checklist to the end of your process:\n\nTeam member completes process → Before submitting/sending, works through checklist → Checks every box → Then delivers\n\nChecklist is LAST step before delivery. Non-negotiable gate.",
        "Repeat for processes #2 and #3. By end of this task:\n• 3 quality checklists (5-15 items each)\n• Integrated into your documented processes\n• Team trained on using them\n\nPrint them out if needed. Make them visible.",
        "Track error rate for 2 weeks. Before checklist: X errors per week. After checklist: Y errors per week. Calculate reduction:\n\n`(X - Y) ÷ X × 100 = % reduction`\n\nGoal: 50%+ reduction in errors. If under 50%, checklist needs more detail.",
        "Make checklists part of culture. When error happens, response isn't \"Who screwed up?\" It's \"What checklist item did we miss?\" Update checklist to prevent future errors. Living document, not set-and-forget.",
      ],
      avoidPoints: [
        "Vague quality standards → 'Make it good' means different things to different people → Define specific, measurable quality → 'Zero typos' is measurable",
        "Making checklists optional → 'Use if you want' = nobody uses them → Make checklists mandatory → Non-negotiable step before delivery → Require sign-off",
        "Creating and ignoring → Checklist exists but team doesn't use it → Audit randomly: 'Show me your completed checklist for last delivery' → Accountability drives usage",
      ],
    },
    {
      taskNum: 3,
      title: "Days 6-9: Find Your #1 Bottleneck, Fix It This Week",
      hook: "A team spent 40% of time waiting on approvals. One process change. Wait time dropped to 5%. Same team, 8x faster output.",
      startDay: 6,
      duration: 4,
      impact: "high",
      actions: [
        "Survey your team. Send this message:\n\n\"What's the #1 thing that slows you down every week? What do you spend too much time waiting for or redoing?\"\n\nCollect responses from everyone. No judgment. Raw truth only.",
        "Compile bottleneck list. Common bottlenecks:\n• Waiting for approvals\n• Finding information\n• Redoing work due to unclear requirements\n• Technical issues\n• Waiting for other people\n• Manual data entry\n\nWrite down everything mentioned. Count how many people mentioned each.",
        "Pick #1 bottleneck. Whichever issue got mentioned most = your bottleneck. If tie, pick the one that:\n• Affects revenue most\n• Wastes most time\n• Frustrates team most\n\nYou're fixing ONE bottleneck this week. Not three. ONE.",
        "Map the current process causing the bottleneck. Example:\n\nApproval bottleneck:\nRequest submitted → Waits in queue → Manager reviews (3 days later) → Gets feedback → Resubmit → Wait again (2 days) → Finally approved\n\nTotal: 5+ days. Draw this out visually or write each step.",
        "Identify the constraint in the process. Usually:\n• One person who's the approval gate\n• Missing information that causes delays\n• Unclear criteria for decision\n• Too many approval layers\n\nCircle the constraint. That's what you're fixing.",
        "Design new process that removes/reduces constraint. Example solutions:\n• Set approval criteria (auto-approve if under $X)\n• Add backup approver\n• Create template that includes all needed info upfront\n• Reduce approval layers from 3 to 1\n\nPick simplest solution that works 80% of time.",
        "Implement the new process THIS WEEK. Don't wait for perfect. Make the change. Update the documented process. Tell the team:\n\n\"We're trying this new way starting Monday. Give it 2 weeks, then we'll review.\"\n\nSpeed of implementation matters.",
        "Measure impact after 2 weeks:\n\n`Before: Average time for [bottleneck process] = X days`\n`After: Average time = Y days`\n`Reduction: X - Y = time saved per instance`\n`Total saved: Time saved × # of instances per month`\n\nGoal: 50%+ reduction. If less, try different solution.",
      ],
      avoidPoints: [
        "Trying to fix everything → You have 10 bottlenecks → Pick ONE → Fix it completely → Then move to next → Parallel fixes = nothing gets fixed",
        "Over-engineering the solution → 'We need new software and 3 months to implement' → Usually you need simpler criteria or fewer approvals → Simple fixes work 80% of time",
        "Not measuring impact → You implement change but don't track if it worked → Measure before and after → Data shows if solution worked → Adjust if needed",
      ],
    },
    {
      taskNum: 4,
      title: "Days 9-12: Automate 1 Task with Zapier, Save 5 Hours/Week",
      hook: "A team spent 20 hours/week on manual data entry. Automated 5 tasks with Zapier. Freed up 15 hours/week. ROI: 6 weeks.",
      startDay: 10,
      duration: 3,
      impact: "medium",
      actions: [
        "List every manual, repetitive task you do weekly. Examples:\n• Copying data from email to CRM (Customer Relationship Management)\n• Sending same email to new customers\n• Creating invoices from won deals\n• Updating spreadsheets\n• Adding contacts to email list\n\nWrite down everything that's copy-paste or repetitive. Should have 10-15 items.",
        "Calculate time spent per task per week. Example:\n\n`Manually adding leads to CRM = 30 mins/day × 5 days = 2.5 hours/week`\n`Creating invoices = 20 mins per invoice × 10 invoices = 3.3 hours/week`\n\nWrite time estimate next to each task. Total it up. Probably 10-20 hours of manual work per week.",
        "Pick #1 automation candidate. Highest time investment + easiest to automate = your winner. Best candidates:\n• Data transfer between tools\n• Email sequences\n• File organization\n• Notifications\n\nExample: \"When deal closes in CRM, automatically create invoice in QuickBooks\" (saves 3 hours/week).",
        "Sign up for Zapier (free plan covers most needs). Go to zapier.com. Create account. Free plan = 100 tasks/month. Plenty for first automation. Paid plans = $20-50/month for more. Start free.",
        "Build your first Zap (that's what automations are called). Click 'Make a Zap':\n\nChoose trigger: \"When this happens...\"\n• Example: New row in Google Sheets, New email in Gmail, Deal won in CRM\n\nChoose action: \"Do this...\"\n• Example: Add to CRM, Send email, Create invoice\n\nFollow prompts. Takes 10-15 minutes.",
        "Test the automation. Run a test case. Does it work? If yes, turn it on. If no, adjust the settings. Common issues:\n• Wrong field mapping\n• Missing filter\n• Incorrect trigger\n\nZapier shows you exactly where it failed. Fix and retest. Get it working before moving on.",
        "Monitor for 1 week. Check daily:\n• Is automation running?\n• Any errors?\n• Any edge cases it can't handle?\n\nFirst week reveals issues. Fix them as they come up. By week 2, should be smooth.",
        "Calculate time saved:\n\n`Before: X hours/week`\n`After: Y hours/week`\n`Savings: X - Y hours = time back`\n`Money saved: Time saved × your hourly rate`\n\nExample: Saved 3 hours/week × $100/hour = $300/week value = $15.6K/year. That's ROI (Return on Investment) of one automation. Now build 4 more.",
      ],
      avoidPoints: [
        "Automating broken processes → 'Let's automate this mess' → Fix the process FIRST, then automate → Automation of bad process = faster bad results",
        "Over-complicating first automation → 15-step automation with 5 conditional branches → Start simple: 2-step automation (trigger → action) → Get win, build confidence, then do complex ones",
        "Not handling edge cases → Automation works 90% of time, breaks 10% of time → Add filters and conditions → Example: 'Only run if email contains invoice' → Reduces errors",
      ],
    },
    {
      taskNum: 5,
      title: "Days 13-17: Build Weekly Meeting Rhythm, Cut Meetings 50%",
      hook: "A team had 15 hours/week in meetings. Redesigned weekly cadence. Meetings dropped to 3 hours. Output doubled. Less meetings = more work.",
      startDay: 13,
      duration: 4,
      impact: "quick-win",
      actions: [
        "Audit current meetings. List every recurring meeting:\n• Title\n• Duration\n• Attendees\n• Purpose\n\nAdd it up. Total hours per week in meetings? Most teams: 10-20 hours. That's 25-50% of work week. Time to cut.",
        "Design Monday kickoff meeting (30 mins max). Purpose: Set weekly priorities. Format:\n\n• 5 mins: Week review\n• 20 mins: This week's top 3 goals + who owns what\n• 5 mins: Blockers/questions\n\nRequired attendees: Leadership only. Everyone else: Optional. Keep it tight. No status updates (send those async - asynchronously).",
        "Design Friday review meeting (30 mins max). Purpose: Close the week. Format:\n\n• 10 mins: Wins (what went well)\n• 10 mins: Misses (what didn't)\n• 5 mins: Learnings\n• 5 mins: Next week preview\n\nThis replaces all other status meetings. One review meeting per week. That's it.",
        "Replace daily standups with async (asynchronous) updates. Instead of 15-min daily meeting (5 hours/week), use Slack/email standup. Template:\n\n\"Yesterday: [X]\nToday: [Y]\nBlocked by: [Z or Nothing]\"\n\nTakes 2 minutes to write. Everyone reads when convenient. Save 4.5 hours/week per person.",
        "Cancel every other meeting. Seriously. Go through your meeting list. Ask:\n• Can this be an email?\n• A Loom video?\n• A Slack message?\n\nIf YES, cancel it. Recurring 1-on-1s can be bi-weekly. Project updates can be async. Be ruthless. Goal: Cut 50% of meetings.",
        "Create 'No Meeting' blocks. Tuesday and Thursday afternoons = no meetings allowed. These are deep work blocks. Calendar shows 'Focus Time - Do Not Book'. Team needs uninterrupted time to actually do work. Meetings are for coordination. Work happens in focus blocks.",
        "Set meeting rules. Post these in Slack:\n\n1) All meetings require agenda (sent 24h before)\n2) Default to 25/50 mins (not 30/60)\n3) Decline meeting if no agenda\n4) Meetings start on time, end on time\n5) Record and share notes\n\nMake them non-negotiable.",
        "Track meeting time for 2 weeks:\n\n`Before: X hours/week in meetings`\n`After: Y hours/week`\n`Reduction: X - Y = hours saved`\n\nGoal: 50% reduction. If less, cancel more meetings. If you're not willing to cancel meetings, you'll never have time for actual work.",
      ],
      avoidPoints: [
        "Defaulting to meetings → Every question becomes a meeting → Ask: Can this be solved with 5-min Slack thread? 2-min Loom? → Async first, meeting last resort",
        "No agenda = waste → Meeting with no agenda is guaranteed waste of time → Make agenda mandatory → No agenda? Decline the meeting → Your time is valuable",
        "Status update meetings → Spending 1 hour so everyone can say what they did → Status updates are async → Use standups or Slack → Meetings are for decisions, not updates",
      ],
    },
    {
      taskNum: 6,
      title: "Days 17-20: Set Up Project Management Tool, Get Team Using It",
      hook: "A founder had tasks in email, Slack, spreadsheets, sticky notes. Nothing got done on time. One PM tool. On-time delivery: 40% → 92%.",
      startDay: 17,
      duration: 3,
      impact: "high",
      actions: [
        "Pick ONE project management tool. Options:\n• Asana (free for small teams)\n• Trello (visual/simple)\n• ClickUp (powerful)\n• Monday (intuitive)\n• Notion (flexible)\n\nDon't overthink it. They all work. Pick one, commit for 6 months minimum. Tool switching kills productivity.",
        "Create account and set up workspace. Add team members. Create 3-5 main project folders/boards:\n• Sales Pipeline\n• Client Delivery\n• Marketing\n• Operations\n• Admin\n\nKeep structure simple. You can add more later. Complexity kills adoption.",
        "Migrate your current active projects. Go through email, Slack, spreadsheets. Every open task/project → Add to PM (Project Management) tool. Format:\n• Task name\n• Who's responsible\n• Due date\n• Priority\n\nMove everything. If it's not in the PM tool, it doesn't exist. This takes 2-3 hours. Do it anyway.",
        "Create task templates for recurring work. Example:\n\nNew customer onboarding template:\n• 15 steps: Send welcome email, Schedule kickoff, Create project folder, etc.\n\nSales process template:\n• 10 steps: Discovery call, Send proposal, Follow up, etc.\n\nTemplates ensure consistency and save time. Build 3-5 core templates.",
        "Set up basic views/filters. Create views by:\n• Person (who's doing what)\n• Due date (what's due this week)\n• Project (all tasks for Project X)\n• Priority (urgent vs can wait)\n\nTeam needs to filter by what matters to them. Make it easy to find their work.",
        "Train the team (30-min session). Screen share. Show how to:\n• Add task\n• Assign to someone\n• Set due date\n• Mark complete\n• Use templates\n• Filter views\n\nRecord the training. Send recording + written guide. Answer questions. Make adoption easy.",
        "Make it mandatory. Starting Monday, ALL tasks go in PM tool. No more \"I'll remember\", no more tasks in Slack/email. If it's not in the tool, it doesn't get done. Check tool every morning. This is non-negotiable. Tool only works if everyone uses it.",
        "Review weekly. Monday meeting: Everyone opens PM tool. \"What are your top 3 tasks this week?\" Friday meeting: \"What did you complete? What's rolling to next week?\" Visibility drives accountability. If tasks aren't moving, you'll see it immediately.",
      ],
      avoidPoints: [
        "Tool switching → Trying Asana for 2 weeks, then Trello, then ClickUp → Pick one, stick with it for 6 months → Learning curve exists → Push through it",
        "Using every feature day 1 → Tool has 100 features, you try to use them all → Start with basics only: Add task, assign, due date, mark done → Add features as needed",
        "Optional adoption → 'Use the tool if you want' → Nobody will → Make it mandatory → If task isn't in tool, it's not official → Accountability drives usage",
      ],
    },
    {
      taskNum: 7,
      title: "Days 20-23: Build 5-Metric Dashboard, Check It Daily",
      hook: "A founder asked me 'How's your business?' He said 'I think good?' No numbers. Built dashboard. Decisions got 10x clearer. Track or guess. Your choice.",
      startDay: 20,
      duration: 3,
      impact: "medium",
      actions: [
        "Identify your 5 most important metrics. Choose metrics that:\n1) Tell you if business is healthy\n2) You can influence directly\n3) Update frequently\n\nCommon ones: Revenue, Profit, Active customers, CAC (Customer Acquisition Cost), Churn rate, Pipeline value, Cash balance. Pick YOUR 5. Write them down.",
        "Create Google Sheets dashboard. Open new Google Sheet. Title: 'Business Dashboard'. Create columns:\n• Metric\n• Goal\n• Current\n• Status (Green/Yellow/Red)\n• Weekly Change\n\nAdd your 5 metrics. Example row: 'Revenue | $50K | $48K | Yellow | -4%'.",
        "Set up automatic data pulls where possible. Connect tools: Google Sheets can pull from:\n• Stripe (revenue)\n• QuickBooks (expenses)\n• CRM (Customer Relationship Management - pipeline)\n• Analytics (website traffic)\n\nUse built-in integrations or Zapier. Automation reduces manual updates. Set it up once, updates forever.",
        "Define green/yellow/red thresholds. For each metric:\n• Green = on track or better\n• Yellow = slightly behind (5-10% off)\n• Red = significantly behind (>10% off)\n\nExample: Revenue goal $50K → Green: $48K+, Yellow: $45-48K, Red: <$45K. Visual status makes problems obvious.",
        "Update dashboard daily or weekly. If data isn't automated, block 10 minutes Monday morning. Update all 5 metrics. Takes 10 minutes max. Make it part of weekly routine. Can't manage what you don't measure. Daily check = daily awareness.",
        "Share dashboard with leadership team. Google Sheets → Share → Add team emails. Everyone sees same numbers. No more \"I think we're doing well\" conversations. Numbers don't lie. Shared visibility drives shared accountability.",
        "Use dashboard in Monday meeting.\n\n\"Let's look at the dashboard. Revenue: Green. Pipeline: Red. What are we doing this week to fix pipeline?\"\n\nDashboard drives agenda. Decisions based on data, not feelings. This is how real businesses operate.",
        "Set alerts for red metrics. If any metric goes red, automatic alert (use Zapier + Slack). Example:\n\n\"Alert: Revenue dropped below $45K. Current: $43K.\"\n\nImmediate visibility means immediate action. Don't wait for Monday meeting to discover problems.",
      ],
      avoidPoints: [
        "Too many metrics → Tracking 20 numbers = tracking zero → Pick 5 most important → You can always add more later → Focus beats breadth",
        "Vanity metrics → Tracking Instagram followers when you need revenue → Pick metrics that matter for your business model → Revenue > likes",
        "Manual updates that don't happen → 'I'll update it when I have time' → Automate data pulls → Or set specific update time → Otherwise dashboard becomes stale and useless",
      ],
    },
    {
      taskNum: 8,
      title: "Days 23-26: Delegate 3 Tasks, Free Up 5 Hours/Week",
      hook: "A founder worked 80 hours/week. Team worked 40. Delegated 5 tasks. Founder dropped to 50 hours. Team took ownership. Revenue grew 2x.",
      startDay: 23,
      duration: 3,
      impact: "high",
      actions: [
        "Time audit for one week. Track everything you do in 15-min increments for 7 days. Use Google Sheets or time tracking app. At end of week, you'll have list of every task you did. Most founders discover 40-50% of their time is on tasks others could do.",
        "Categorize every task. Create 4 buckets:\n\n1) Only I can do (strategy, key client relationships, fundraising)\n2) I should do but could delegate (important decisions, approvals)\n3) Someone else should do (admin, scheduling, data entry, routine tasks)\n4) Nobody should do (time wasters)\n\nBe ruthless. \"Only I can do\" should be <20% of your time.",
        "Pick 3 tasks from bucket #3 to delegate this week. Start with:\n• Highest time investment\n• Easiest to teach\n• Lowest risk if mistakes happen\n\nExamples: Email management, Social media scheduling, Report generation, Calendar management, Data entry. Pick 3. You're delegating them THIS WEEK.",
        "Choose who gets each task. Look at current team. Who has:\n• Capacity (can add 2-5 hours/week)\n• Skills match (or can learn quickly)\n• Motivation (wants to grow)\n\nMatch tasks to people. If nobody on team, hire VA (Virtual Assistant) for $10-20/hour. Still cheaper than your time.",
        "Create training doc for each task. Format:\n• Task name\n• Why it matters\n• Step-by-step instructions\n• Quality standards\n• Common mistakes\n• Who to ask for help\n\nRecord Loom video walking through it. Give them both: Written doc + Video. Takes 30 mins per task. Worth it.",
        "Hand off with \"I do, we do, you do\" method:\n• Week 1: You do it, they watch\n• Week 2: You do it together\n• Week 3: They do it, you review\n• Week 4: They own it\n\nDon't just throw task over fence and disappear. Proper handoff = successful delegation.",
        "Review quality weekly for first month. Check their work. Give feedback:\n\n\"This part was great. This needs improvement. Here's how to do it better.\"\n\nBe specific. After month, if quality is good, they own it fully. Spot check monthly after that.",
        "Calculate time saved:\n\n`3 tasks × hours per task = weekly time saved`\n\nExample: Email management (3 hrs) + Scheduling (2 hrs) + Reports (3 hrs) = 8 hours/week saved. That's 32 hours/month = almost full work week. What will you do with 32 extra hours? Work on revenue-generating activities.",
      ],
      avoidPoints: [
        "'I can do it faster' trap → Yes, for next 2 weeks → Then they're faster than you → Training investment pays off 100x → Stop being bottleneck",
        "Delegate and disappear → Throwing task at someone with no training → They fail → You blame them → Your fault, not theirs → Train properly or don't delegate",
        "Only delegating easy stuff → If you only delegate $10/hour tasks, you'll always be doing $10/hour work → Delegate $30-50/hour tasks → Free yourself for $200/hour work",
      ],
    },
    {
      taskNum: 9,
      title: "Days 26-28: Batch Similar Tasks, Work in Focused Blocks",
      hook: "A founder switched between 10 different tasks per hour. Exhausted, nothing finished. Started batching. 2x output, half the stress. Context switching kills productivity.",
      startDay: 26,
      duration: 2,
      impact: "quick-win",
      actions: [
        "Track task switching for one day. Every time you switch tasks, make a tally mark. Most founders: 30-50 switches per day. Every switch costs 5-15 mins of refocus time. That's 2.5-12 hours lost daily. You're hemorrhaging productivity.",
        "Group similar tasks into batches. Categories:\n• Creation (writing, designing, planning)\n• Communication (emails, calls, messages)\n• Admin (invoicing, scheduling, data entry)\n• Deep work (strategy, analysis, problem-solving)\n\nList every task type. Group them.",
        "Design themed time blocks:\n• Monday AM: Deep work\n• Monday PM: Meetings\n• Tuesday AM: Content creation\n• Tuesday PM: Admin\n• Wednesday AM: Sales calls\n• Wednesday PM: Team support\n• Etc.\n\nMatch your energy: Hard thinking in AM, routine tasks in PM. Theme your calendar.",
        "Batch email processing. Instead of checking 20 times/day, batch to 3x:\n• Morning (30 mins)\n• Lunch (30 mins)\n• End of day (30 mins)\n\nUse template responses for common questions. Archive/delete ruthlessly. Goal: Inbox zero at end of each session. Close email between sessions.",
        "Batch meetings into 2 days/week. Example:\n• Monday and Thursday = meeting days\n• Tuesday, Wednesday, Friday = no meetings\n\nStack meetings back-to-back on meeting days (30-min gaps max). Protect no-meeting days fiercely. Deep work requires uninterrupted blocks.",
        "Use timers for focus blocks. Work in 90-min focused blocks:\n\nTimer starts → Phone on airplane mode → Close all tabs except what you're working on → Work until timer ends → 15-min break → Repeat\n\nNo multitasking. Single focus = faster, better work.",
        "Automate task transitions:\n• End of email batch → Close email completely\n• End of calls → Close Zoom\n• End of creation → Save, close, clear desk\n\nPhysical reset between batches. Don't keep 12 apps/tabs open. Clean slate for each new batch.",
        "Measure productivity improvement:\n\n`Before batching: X tasks completed per week`\n`After batching: Y tasks completed per week`\n`Increase: (Y - X) ÷ X × 100 = % improvement`\n\nGoal: 30-50% more output with same hours. Batching works. Data will prove it.",
      ],
      avoidPoints: [
        "Reactive work mode → Responding to every ping immediately → Turns you into support bot → Batch responses → Control your schedule or it controls you",
        "Micro-batching → 'I'll batch for 15 minutes' → Not enough time to get deep → Minimum 60-90 mins per batch → Deep work requires deep time",
        "No boundaries → Letting people interrupt batches → 'Quick question' becomes 20 minutes → Protect batch time → Use calendar blocks, close door, headphones on → Interruption kills the point",
      ],
    },
    {
      taskNum: 10,
      title: "Days 28-30: Monthly Process Review, Update What's Broken",
      hook: "Most founders create processes once, never update them. Markets change, teams change, processes should too. Monthly reviews = continuous improvement.",
      startDay: 28,
      duration: 2,
      impact: "medium",
      actions: [
        "Pull out all documented processes. Open your process library (Notion/Google Drive). List every documented process. Count them. You probably have 5-10 by now from earlier tasks. Time to review them.",
        "Survey team on what's working vs broken. Send message:\n\n\"Which processes are working well? Which are frustrating or outdated? What should we change?\"\n\nCollect feedback from everyone who uses these processes. Frontline knows what's broken better than you do.",
        "Identify top 3 broken processes. From feedback, which processes:\n• Cause most errors\n• Take too long\n• Frustrate team most\n• Changed but documentation didn't\n\nPick top 3 that need updating. You're fixing these this month.",
        "Update process #1. Open the documented process. Compare to how work actually happens now:\n• What steps changed?\n• What steps were added?\n• What steps are obsolete?\n\nUpdate the checklist + video. If major changes, re-record the Loom. If minor, just update written steps.",
        "Test updated process with team. Give updated process to 1-2 team members. Have them use it for next instance of that task. Ask:\n\n\"Is this better? Anything still missing or unclear?\"\n\nGet real-world feedback before rolling out to everyone.",
        "Roll out updates. Update the master process doc. Announce in Slack/email:\n\n\"Updated [process name]. Main changes: [1], [2], [3]. New version is in shared folder. Old version archived. Use new one starting Monday.\"\n\nClear communication = smooth adoption.",
        "Repeat for processes #2 and #3. Same steps: Review, update, test, roll out. By end of this task, you've refreshed 3 processes based on real team feedback. They're now aligned with how work actually happens.",
        "Schedule next monthly review. Put it in calendar for same date next month. 2-hour block. Non-negotiable. Monthly process reviews are how great companies stay great. Static processes = stagnant companies. Living processes = growing companies.",
      ],
      avoidPoints: [
        "Set and forget → Creating process once, never touching it again → Processes become outdated within 90 days → Monthly reviews keep them current",
        "Updating without team input → You update process based on your assumptions → Team doesn't follow it because it doesn't match reality → Get their feedback first",
        "Perfect process obsession → 'Process needs to cover every edge case' → 80/20 rule: Document 80% case, handle edge cases manually → Perfect is enemy of done",
      ],
    },
  ],
};

/**
 * Collaborator: Focus on partnerships, networking, JVs, and relationship building.
 * Target audience: Founders who need to build strategic relationships and use partnerships to grow.
 */
const COLLABORATOR_PLAN: BusinessCalendarPlan = {
  key: "collaborator",
  label: "Collaborator",
  monthTheme: "Networking & Partnerships Month",
  tasks: [
    {
      taskNum: 1,
      title: "Days 1-3: List 30 Partners, DM 15 Today",
      hook: "A founder cold-emailed 100 partners. Zero replies. We got mutual friends to introduce him to 20 others. Got 12 responses, 5 deals. Introductions beat cold messages 20:1.",
      startDay: 0,
      duration: 3,
      impact: "high",
      actions: [
        "List 30 complementary businesses. Who serves your customers but isn't a competitor? Examples:\n• You sell software → Partner with consultants\n• You do consulting → Partner with software\n• You sell to HR (Human Resources) → Partner with recruitment firms\n\nWrite down 30 brands/people who serve your audience with different solutions.",
        "Research each potential partner. Open Google Sheets. Columns:\n• Partner Name\n• Their Audience\n• Our Overlap\n• Decision Maker\n• LinkedIn Profile\n• Email\n• Mutual Connections\n• Partnership Idea\n\nFill it in for all 30. Takes 2-3 hours. This research makes or breaks your outreach.",
        "Score each partner on two criteria:\n\nAudience Overlap (1-10): How much does their audience match yours?\nBrand Alignment (1-10): Do your brands/values align?\n\nAdd scores. Focus on partners scoring 14+. These are your top tier. Circle the top 15.",
        "Find who can introduce you to them. Open LinkedIn, search each partner. Do you have mutual friends? Are you in the same Facebook/Slack groups? Do you share customers?\n\nIf YES, that's your intro. Message your mutual friend:\n\n\"Hey, can you intro me to [partner name]? Want to discuss potential collab.\"\n\nIf NO mutual connections, you'll have to cold DM (Direct Message) them (way harder, 10x worse response rate).",
        "Craft personalized pitch for each of top 15. Template:\n\n\"Hey [name], [mutual connection] suggested I reach out. I run [your company] helping [your audience] with [your solution]. Noticed you serve similar audience with [their solution]. Thought about potential collaboration - [specific idea: co-webinar, content swap, referral partnership]. Open to 15-min call this week to explore? No pitch, just curious if there's mutual value.\"\n\nCustomize for each person.",
        "Reach out to 15 partners THIS WEEK. 5 per day for 3 days. If you found mutual friend, ask them to intro you. If no mutual friend, send personalized LinkedIn DM or email (but expect lower response rate). Track in your spreadsheet:\n• Date contacted\n• Response (Yes/No/No response yet)\n• Next step\n\nGoal: 8-10 responses out of 15 (50-67% response rate).",
        "Set up partnership tracking system. Create tab in Google Sheets or add to CRM (Customer Relationship Management system). Track:\n• Partner name\n• Contact date\n• Response\n• Call date\n• Proposal sent\n• Deal status\n• Value potential\n\nYou'll manage partnerships like you manage sales pipeline. What gets tracked gets closed.",
      ],
      avoidPoints: [
        "Mass cold messages → Sending same generic DM to 100 strangers → Gets 1-2% response rate → Getting mutual friends to introduce you to 15 people → Gets 50%+ response → Quality beats quantity",
        "Leading with what you want → 'I want you to promote my product' → Instant no → Lead with mutual value: 'Here's how we could both reach more customers' → Collaboration beats extraction",
        "No research → Reaching out blind → They can tell you didn't do homework → 15 mins of research per partner = 10x better response rate → Show you understand their business",
      ],
    },
    {
      taskNum: 2,
      title: "Days 3-6: Book 5 Partner Discovery Calls",
      hook: "Sent 25 pitches. 18 opened. 10 replied. 7 calls booked. Secret? Led with specific value, not vague asks.",
      startDay: 3,
      duration: 3,
      impact: "high",
      actions: [
        "Follow up with non-responders after 3 days. Check your partner tracker. Who hasn't responded yet? Send follow-up:\n\n\"Hey [name], following up on my message from [day]. Still think there could be interesting collaboration here. Any interest in quick call? I have 3 specific ideas that could benefit both our audiences.\"\n\nFollow-up doubles response rate.",
        "When partners respond positively, book calls immediately. Reply within 1 hour:\n\n\"Awesome! How's [day] at [time] for 15-min call? Here's my Zoom link: [link].\"\n\nMake it EASY. Give them specific time options. Provide link upfront. Remove all friction. Speed matters - hot leads go cold fast.",
        "Prepare for each call. Before call, research:\n• Their recent content\n• Their customers\n• Their challenges (check their LinkedIn/blog/podcast)\n\nWrite down 3 specific partnership ideas tailored to them. Have questions ready: \"What's your #1 goal for Q[X]?\" \"Who's your ideal customer?\" \"What partnerships have worked for you before?\"",
        "Run discovery call using this format:\n\n• First 5 mins: Build rapport, ask about their business, their goals\n• Next 5 mins: Listen more than talk. Understand their needs\n• Last 5 mins: Share 1-2 specific collaboration ideas. \"Based on what you said, what if we [specific idea]? Would that be valuable?\" Get their reaction.",
        "Pitch 3 collaboration types based on their goals:\n\n• Option 1 - Co-content: Joint webinar, co-authored article, podcast swap\n• Option 2 - Referral partnership: You send customers to them, they send to you, track via links\n• Option 3 - Bundle: Package your services together, split revenue\n\nChoose based on their interest level and ease of implementation.",
        "Get commitment or clear next step. Don't end call with \"Let me think about it.\" Either:\n• They say YES (move to implementation)\n• They want to think (schedule follow-up call in 1 week)\n• They say NO (ask for feedback, stay in touch for future)\n\nAlways leave with defined next step.",
        "Track all calls in partnership pipeline. Update spreadsheet:\n• Partner name\n• Call date\n• Their interest level (Hot/Warm/Cold)\n• Partnership type discussed\n• Next step\n• Follow-up date\n\nManage partnerships like sales. More follow-ups = higher close rate.",
        "Follow up within 24 hours of call. Send email:\n\n\"Great talking today! Here's what we discussed: [summary]. Next steps: [specific actions]. I'll [what you'll do]. Can you [what they'll do]? Let's reconnect [specific date].\"\n\nWritten summary prevents miscommunication and keeps momentum.",
      ],
      avoidPoints: [
        "Vague partnership ideas → 'Let's collaborate somehow' gets nowhere → Be specific: 'Let's co-host webinar on [topic] for [audience] on [date]' → Specific proposals get yes/no, vague ones get maybe",
        "Pitching in first message → Leading with 'Promote my stuff' → They ignore you → Lead with 'Here's how I can help YOUR audience' → Value first, ask second",
        "One follow-up and done → 80% of partnerships close after 3-5 follow-ups → One no doesn't mean never → Follow up with value: new idea, relevant article, intro to someone useful",
      ],
    },
    {
      taskNum: 3,
      title: "Days 6-9: Design Joint Offer, Split Revenue 50/50",
      hook: "Two founders combined services. Created bundle. Sold to both audiences. Each made $15K in 30 days. Joint offers = instant audience doubling.",
      startDay: 6,
      duration: 4,
      impact: "medium",
      actions: [
        "Pick your best partnership from discovery calls. Which partner has:\n• Most aligned audience\n• Most enthusiasm\n• Easiest to work with\n\nYou're creating a joint offer with them. One partner, one offer, fully executed. Don't try to do 3 at once.",
        "Define what each partner contributes:\n\nYou provide: [your service/product]\nThey provide: [their service/product]\n\nExample: You're marketing consultant, they're web designer. Joint offer: \"Complete Brand Launch Package - Strategy + Website in 30 days.\" Write down exactly what's included from each side.",
        "Set pricing and revenue split:\n\n`Total package price: $X`\n`Your normal price: $A`\n`Their normal price: $B`\n`Bundle discount: 15-20% off combined price`\n`Revenue split: Usually 50/50, unless one does way more work`\n\nExample: Normally $2K + $3K = $5K → Bundle price $4K → Each gets $2K. Document this clearly.",
        "Create simple partnership agreement. Use Google Doc. Include:\n1) What we're selling\n2) Price and revenue split\n3) Who does what\n4) How customers get delivered to\n5) Payment terms (pay each other within 7 days of customer payment)\n6) How long agreement lasts (start with 90-day pilot)\n7) How to end it (30-day written notice)\n\nBoth sign.",
        "Design the joint offer marketing. Create 1-page PDF or landing page. Title: \"[Outcome] Package\". Sections:\n• Problem (what customer struggles with)\n• Solution (how this bundle solves it)\n• What's included (list both services)\n• Results (what they'll achieve)\n• Price\n• CTA (Call to Action - how to buy)\n\nMake it simple and clear. Both partners approve before launch.",
        "Decide who handles what operationally:\n• Who collects payment? (Usually one partner)\n• Who onboards customer? (Both or divided)\n• Who delivers first? (Sequence it)\n• How do you hand off between partners? (Clear process)\n• Who handles support? (Both)\n\nWrite this down. Unclear operations kill partnerships.",
        "Set success metrics and review date:\n• How many customers is success? Minimum: 3-5 customers in first 30 days\n• Revenue target: $X\n• Review date: 30 days after launch\n• We'll look at: Sales, customer satisfaction, what worked, what didn't\n\nContinuous improvement.",
        "Launch to BOTH audiences simultaneously:\n• Partner A posts on LinkedIn\n• Partner B posts same day\n• Both email lists\n• Both promote in communities\n\nCoordinated launch = 2x the reach. Track where customers come from (Partner A's audience vs Partner B's). Helps with future splits if needed.",
      ],
      avoidPoints: [
        "Verbal agreements → 'Let's just shake on it' → Partner changes terms later → You're stuck → ALWAYS write it down → Even simple Google Doc > handshake",
        "Unclear revenue split → 'We'll figure it out when money comes in' → Causes fights → Decide upfront → 50/50 is simplest unless workload is very unequal",
        "No pilot period → Committing to 12-month partnership before testing → Start with 90-day pilot → If it works, extend → If it doesn't, clean exit",
      ],
    },
    {
      taskNum: 4,
      title: "Days 9-12: Co-Create Content, Reach 2x Audience",
      hook: "Two founders co-hosted webinar. Each had 1000 followers. Webinar reached 1800 people. Combined audiences = instant growth. Collaboration beats solo content.",
      startDay: 10,
      duration: 3,
      impact: "high",
      actions: [
        "Pick content format to co-create. Options:\n• Joint webinar (highest impact, most work)\n• Co-written LinkedIn article\n• Podcast interview swap\n• Instagram/LinkedIn Live together\n• Joint email to both lists\n\nPick one you can execute THIS WEEK. Start simple. Webinar if you're ambitious, article if you want easier.",
        "Choose topic that serves BOTH audiences:\n\nBad: Topic only your audience cares about\nGood: Topic both audiences struggle with\n\nExample: You're sales coach, partner is marketing consultant. Topic: \"How to turn marketing leads into sales conversations.\" Both audiences need this. Brainstorm 3 topics, pick best one.",
        "Divide content creation 50/50:\n\nFor webinar:\n• You create slides 1-10, they create 11-20\n• You handle tech/registration, they handle promotion graphics\n\nFor article:\n• You write first half, they write second\n\nFor podcast:\n• You prep questions, they handle recording/editing\n\nEqual effort prevents resentment.",
        "Create promotion plan:\n\nWeek before:\n• Each posts 3x on social media\n• Each emails list 2x\n• Each shares in relevant communities\n\nDay of:\n• Each goes live on their channels reminding people\n\nCoordinated promotion = maximum reach. Track: How many attendees from your audience vs theirs?",
        "Execute the co-content. Show up. Deliver value. Cross-promote naturally. Example in webinar:\n\n\"If you want help with [partner's expertise], check out [partner].\"\n\nThey do same for you. Not salesy. Just helpful. Audience appreciates relevant resources.",
        "Collect audience contact info:\n• For webinar: Registration form captures emails\n• For article: CTA (Call to Action) to download related resource\n• For podcast: Link in show notes\n\nGoal: Build email list from partner's audience. These are warm leads who already know you through partner endorsement.",
        "Follow up with attendees/readers within 24 hours. Send:\n\n\"Thanks for joining! Here's the recording/article. Here's [bonus resource]. If you want help with [your service], reply to this email.\"\n\nSoft pitch. Most won't buy immediately. That's fine. You're now on their radar.",
        "Review results with partner:\n• Attendees: X\n• Emails collected: Y\n• Sales: Z\n\nWhat worked? What didn't? Should we do this monthly? Quarterly? Or was it one-time? Decide together. If it worked, make it recurring. Recurring co-content = continuous audience growth.",
      ],
      avoidPoints: [
        "Unequal promotion → You promote 10x, partner promotes 1x → Lopsided reach → Set clear promotion expectations → Both commit equally or don't do it",
        "Too salesy during content → Turning webinar/article into 30-min pitch → Audience leaves → 90% value, 10% soft promotion → Value first always",
        "No follow-up → Creating content then not capturing audience → Wasted opportunity → Always have CTA to capture emails → Content without follow-up = missed revenue",
      ],
    },
    {
      taskNum: 5,
      title: "Days 13-17: Survey 10 Customers, Find 3 Upsell Opportunities",
      hook: "A founder asked customers 'Are you happy?' Everyone said yes. Asked 'What else do you need?' Found $12K in upsells. Current customers = easiest sales.",
      startDay: 13,
      duration: 4,
      impact: "quick-win",
      actions: [
        "List your 20 best customers. Who has:\n• Best results\n• Longest tenure\n• Highest satisfaction\n• Most engagement\n\nThese are your feedback targets. Export to Google Sheets.",
        "Create short feedback survey (5 questions max):\n\nQuestion 1: \"On scale 1-10, how satisfied are you with [your service]?\"\nQuestion 2: \"What's working really well?\"\nQuestion 3: \"What could be better?\"\nQuestion 4: \"What other challenges are you facing that we don't help with?\"\nQuestion 5: \"Would you recommend us? If yes, who to?\"\n\nUse Google Forms or Typeform. Takes 10 mins to create.",
        "Send survey to 20 customers. Email template:\n\n\"Hey [name], quick favor - we're improving [service] and your input would be gold. 5 questions, takes 2 mins. [Survey link]. Thanks!\"\n\nSend it. Give them 5 days to respond. Follow up once if no response.",
        "Compile responses in one doc. For each response:\n• What's working\n• What needs improvement\n• Other needs\n• Referral potential\n\nLook for patterns. If 5+ people mention same improvement, that's high priority. If 3+ mention same additional need, that's an upsell opportunity.",
        "Identify 3-5 upsell opportunities. Common patterns:\n• Current customers needing adjacent service (you do marketing, they need sales help)\n• Customers wanting done-for-you version of DIY service (coaching → implementation)\n• Customers needing more volume/frequency (monthly → weekly)\n\nWrite down top 3 upsell ideas.",
        "Call 3 customers who mentioned specific needs. Script:\n\n\"Hey [name], thanks for survey feedback. You mentioned [specific challenge]. We're actually developing solution for that. Would you be interested in beta testing? Discounted rate for feedback.\"\n\nSoft pitch. Gauge interest.",
        "For interested customers, create custom proposals. Show:\n• Their specific problem\n• Your proposed solution\n• Deliverables\n• Timeline\n• Price (10-20% discount for being early adopter)\n\nSend within 24 hours while interest is hot. Goal: Close 2-3 from these calls.",
        "Thank all survey respondents. Send:\n\n\"Thanks for feedback! Here's what we heard: [top 3 themes]. Here's what we're changing: [specific actions]. Your input directly shapes our roadmap.\"\n\nShow you listened and took action. Builds loyalty.",
      ],
      avoidPoints: [
        "Generic surveys → 'How are we doing?' gets useless answers → Ask specific, actionable questions → Reference their actual usage → Get specific feedback",
        "Surveying and ignoring → Collecting feedback then doing nothing → Customers notice → Either act on feedback or don't ask → Trust dies when input is ignored",
        "Only asking happy customers → Critical feedback reveals improvement opportunities → Mix happy and challenging customers → Unhappy customers tell you what's broken",
      ],
    },
    {
      taskNum: 6,
      title: "Days 17-20: Fix Onboarding, Cut Churn from 30% to 10%",
      hook: "A business had 30% churn. Redesigned onboarding based on where customers got stuck. Churn dropped to 8%. Same product, better process.",
      startDay: 17,
      duration: 3,
      impact: "medium",
      actions: [
        "Map current onboarding journey. List every step from:\n\nCustomer signs up → First login → First value achieved\n\nExample: Sign up → Welcome email → Account setup → First project created → First result\n\nFor each step, note:\n• % of customers who complete it\n• Average time it takes\n• Where people get stuck\n\nMost companies lose 40-60% of customers in onboarding.",
        "Identify the biggest drop-off point. Where do most customers get stuck or quit? Common culprits:\n• Confusing setup process\n• Unclear next steps\n• No quick win\n• Lack of support\n\nExample: 80% sign up, 60% log in first time, 30% complete setup, 10% achieve first result. Your problem: Setup to first result. Fix this step.",
        "Redesign that step to be easier/faster. Solutions:\n• Add step-by-step checklist\n• Create video walkthrough\n• Send daily emails with next step\n• Add chat support for this phase\n• Simplify the process (remove unnecessary steps)\n\nExample: If setup is complex, create \"Quick Start\" option that skips advanced features. Get them to first win FAST.",
        "Create milestone check-in system. Automated emails/calls at:\n• Day 1: Welcome + first steps\n• Day 3: Check on progress + offer help\n• Day 7: First win achieved? Celebrate!\n• Day 30: Using regularly? Any questions?\n\nProactive outreach prevents silent churn. Customers who engage in first 7 days have 3x better retention.",
        "Build \"at-risk customer\" alert system. Define signals:\n• Haven't logged in 7+ days\n• Low usage (bottom 20%)\n• Support tickets increasing\n• Negative feedback\n\nWhen customer triggers alert, assigned success manager reaches out same day:\n\n\"Hey [name], noticed you haven't logged in lately. Everything okay? Any blockers we can help with?\"\n\nCatch problems before they quit.",
        "Document the new onboarding process. Create checklist:\n• What customer does at each step\n• What you do proactively\n• What good engagement looks like\n• When to escalate to manager\n\nTrain team on it. Consistent onboarding = consistent results.",
        "Measure impact for 30 days. Track:\n• % completing onboarding\n• Time to first value\n• Day 30 retention rate\n\nBefore changes: X%. After changes: Y%. Goal: 20%+ improvement in retention. If not hitting goal, iterate on the process. Keep improving until churn drops significantly.",
      ],
      avoidPoints: [
        "Waiting for complaints → By the time customer complains, they're already half-checked-out → Proactive outreach at Days 3, 7, 30 → Catch issues early",
        "Complex onboarding → Showing every feature on day 1 → Overwhelms customers → They quit → Get them to first win FAST → Advanced features later",
        "Not tracking drop-off → 'I think onboarding is fine' → Data shows 70% don't complete it → Track every step → Fix biggest leaks first",
      ],
    },
    {
      taskNum: 7,
      title: "Days 20-23: Launch Referral Program, Get 5 Referrals",
      hook: "A founder got 3 random referrals per year. Built formal program. 47 referrals in 12 months. Same customers, systematic approach. Referrals close 3x faster.",
      startDay: 20,
      duration: 3,
      impact: "high",
      actions: [
        "Design referral incentive that motivates. Options:\n• Cash ($50-500 per referral)\n• Discount (20% off next month)\n• Service upgrade (free premium feature for 3 months)\n• Account credit ($100 credit per referral)\n\nPick what your customers value. Survey them if unsure. Make reward compelling enough to take action.",
        "Create simple referral process (3 steps max):\n• Step 1: Customer gets unique referral link\n• Step 2: They share link with friends\n• Step 3: When friend signs up, both get reward\n\nUse tools: Referral Rock, Rewardful, or simple tracking in Google Sheets. Complexity kills participation. Make it stupid simple.",
        "Build referral landing page. When referred person clicks link, they see:\n\n\"You've been referred by [customer name]! Get [their benefit: discount/trial]. Plus [referrer] gets [their reward].\"\n\nClear value for both sides. One-click signup. Referral code pre-filled. Remove all friction.",
        "Announce program to existing customers. Email everyone:\n\n\"Excited to launch referral program! Refer friend → They get [X benefit] → You get [Y reward]. Here's your unique link: [link]. Know someone who needs [your service]? Send them this link!\"\n\nMake it feel exclusive. \"You're our best customers, wanted you to know first.\"",
        "Track referrals in spreadsheet. Columns:\n• Referrer Name\n• Referee Name\n• Date Referred\n• Status (Signed up? Y/N)\n• Reward Sent?\n\nTrack everything. Follow up personally:\n\n\"Hey [name], your friend [referee] just signed up! Your reward: [X]. Thanks for spreading the word!\"\n\nPersonal touch increases future referrals.",
        "Promote referral program weekly. Every time you talk to customers:\n• Onboarding email (mention it)\n• Monthly newsletter (feature top referrer)\n• Account dashboard (show their referral link)\n• Support conversations (remind them)\n\nMake it impossible to forget. Visibility drives participation.",
        "Recognize top referrers publicly. Monthly:\n\n\"Shout-out to [name] who referred 3 customers this month! 🎉\"\n\nPost in customer community, send personal thank you, give bonus reward. Public recognition drives competitive participation. People want to be featured.",
        "Calculate referral program ROI (Return on Investment):\n\n`Referrals generated: X`\n`Cost per referral (reward + program cost): $Y`\n`Customer LTV (Lifetime Value): $Z`\n\nIf Z > Y, program is profitable. Goal: 5-10 referrals per month. Track monthly. If under 5, increase reward or simplify process. Iterate until it works.",
      ],
      avoidPoints: [
        "Complicated process → 'Fill out form, submit essay, wait for approval' → Nobody does it → One-click sharing → Instant reward → Simple wins",
        "Weak incentive → '$10 Amazon gift card' doesn't motivate → Make reward 10-20% of customer value → $50-100+ for B2B → People refer when reward is worth their effort",
        "Launch and forget → Announcing once then never mentioning again → Remind customers MONTHLY → Keep it top of mind → Consistent promotion = consistent referrals",
      ],
    },
    {
      taskNum: 8,
      title: "Days 23-26: Review All Partnerships, Kill Bottom 20%",
      hook: "A founder had 8 partnerships. 2 drove 80% of results. 4 were break-even. 2 lost money. Killed bottom 4. Doubled down on top 2. Partnership revenue 3x'd.",
      startDay: 23,
      duration: 3,
      impact: "medium",
      actions: [
        "List all active partnerships in Google Sheets. Columns:\n• Partner Name\n• Type (referral/joint offer/co-content)\n• Revenue Generated\n• Customers from Partnership\n• Time Invested (hours/month)\n• Status\n\nInclude everything - formal deals and informal collabs.",
        "Calculate ROI (Return on Investment) per partnership. Formula:\n\n`Revenue generated ÷ (Time invested × your hourly rate) = ROI`\n\nExample: Partner A generated $2K, invested 10 hours. If your time = $100/hour, cost = $1000. ROI = $2K ÷ $1K = 2x (good). Partner B generated $500, invested 20 hours = $500 ÷ $2K = 0.25x (bad, losing money).",
        "Rank partnerships by ROI (highest to lowest):\n• Top 20% = winners\n• Middle 60% = okay, maintain\n• Bottom 20% = losers, draining time\n\nCircle bottom 20%. These are the partnerships you'll end. Be ruthless. Your time is limited. Invest it in winners.",
        "For bottom 20%, send professional exit message. Template:\n\n\"Hey [name], been thinking about our partnership. Really enjoyed working together, but I need to focus energy elsewhere right now. Let's wrap up current commitments and reconnect in [timeframe]? Thanks for collaborating!\"\n\nPolite. Professional. Leaves door open for future.",
        "For middle 60%, send maintenance message. Template:\n\n\"Hey [name], checking in on our partnership. What's working? What could be better? Want to do more or keep at current level?\"\n\nGauge interest. Some will fade naturally, others will want to increase. Let them decide.",
        "For top 20%, schedule strategy calls. Template:\n\n\"Hey [name], our partnership has been great - we've done [results]. Want to hop on call this week to discuss how we can 2-3x this? Have some ideas.\"\n\nDouble down on winners. These are your growth partnerships.",
        "Document lessons from each partnership:\n\nWhat worked: [Common traits of top partnerships]\nWhat didn't: [Common traits of failed partnerships]\n\nExample learnings: \"Partners with engaged audiences convert 5x better than partners with large but disengaged audiences.\" Apply these insights to future partnerships.",
        "Set quarterly partnership review calendar. Every 90 days, repeat this process. Partnerships die without maintenance. Winners evolve. Losers drag on. Regular reviews keep partnership portfolio healthy and profitable.",
      ],
      avoidPoints: [
        "Sunk cost fallacy → 'But we already invested 6 months!' → That time is gone → Question is: Should you invest 6 MORE months? → Cut losers fast",
        "No performance tracking → 'I think our partnerships are good' → Data shows 2 are great, 4 are mediocre, 2 are losers → Track ROI or you're guessing",
        "Burning bridges → Ending partnerships unprofessionally → Today's failed partner might be tomorrow's customer/referrer → Exit gracefully always",
      ],
    },
    {
      taskNum: 9,
      title: "Days 26-28: Create VIP Customer Group, Get 3 Case Studies",
      hook: "A SaaS company turned 10 happy customers into advocates. They created case studies, spoke at events, referred 30+ customers. Advocates > ads.",
      startDay: 26,
      duration: 2,
      impact: "high",
      actions: [
        "Identify your 10 biggest fans. Criteria:\n• Best results\n• Most enthusiastic\n• Actively refer others\n• Engage with your content\n• Respond to emails\n\nLook at: Who opens every email? Who comments on your posts? Who's referred people already? These are advocacy candidates.",
        "Create VIP (Very Important Person) program benefits. What can you offer that makes them feel special? Options:\n• Early access to new features (2 weeks before everyone else)\n• Exclusive monthly Q&A (Questions & Answers) with founder\n• 20% discount on all purchases\n• Direct Slack/text line to support\n• Feature them in marketing\n• Invite to annual VIP dinner\n\nMake them feel valued.",
        "Invite 10 customers to VIP program. Email:\n\n\"Hey [name], you're one of our best customers. Want to join our VIP program? Benefits: [list 3-4 benefits]. In exchange, occasional feedback and maybe a testimonial/case study when you hit milestones. Interested?\"\n\nPersonal invitation. Not mass email. Hand-pick each person.",
        "Set up private VIP community. Create private Slack channel or Facebook group. Name it something exclusive:\n• \"Founders Circle\"\n• \"Inner Circle\"\n• \"Elite Members\"\n\nPurpose: Network with each other, early access to company news, direct line to you. Make it feel special. Limited membership.",
        "Request case studies from 3 VIPs. For customers with best results, ask:\n\n\"Your results have been incredible. Want to do case study? I'll write it, make you look great, and share with our audience. Could drive more business your way too.\"\n\nMost will say yes if you position it as helping THEM get exposure.",
        "Feature VIPs prominently. Add them to:\n• Website testimonials page (with photo and company)\n• Monthly newsletter (\"Customer Spotlight\")\n• Social media posts (\"See what [name] achieved\")\n\nTag them. They'll share it. Their audience becomes aware of you. Win-win.",
        "Thank VIPs personally every quarter. Founder sends personal message:\n\n\"Hey [name], just wanted to say thanks for being awesome customer and advocate. Really appreciate you.\"\n\nAdd: Handwritten note, small gift, exclusive early access. Authentic appreciation drives loyalty and more advocacy.",
      ],
      avoidPoints: [
        "Asking without giving → 'Can you write testimonial?' then disappearing → Give VIP benefits FIRST → Build relationship → Then asks feel natural",
        "No recognition → Using their stories without thanking them → Always credit them → Tag them in posts → Give them exposure → Recognition matters more than money sometimes",
        "Only contacting when you need something → Reaching out only for favors → Check in regularly → Share useful stuff → Build real relationship → Advocacy comes from genuine connection",
      ],
    },
    {
      taskNum: 10,
      title: "Days 28-30: Attend 1 Event, Make 10 Quality Connections",
      hook: "A founder's network: 50 people, all similar to him. Stagnant opportunities. Added 200 diverse connections strategically. 3 major deals in 6 months. Network = net worth.",
      startDay: 28,
      duration: 2,
      impact: "medium",
      actions: [
        "Find 1 relevant event happening THIS MONTH. Options:\n• Industry conference\n• Local meetup\n• Online summit\n• Workshop\n• Mastermind\n\nSearch: Eventbrite, LinkedIn Events, Facebook Events, industry associations. Pick event where: Your ideal customers/partners attend, Topic is relevant, Entry cost is reasonable (free-$500). Register TODAY.",
        "Set networking goal: 10 quality connections. Not 100 business cards. 10 real conversations. Quality > quantity. Before event, prepare:\n• 30-second introduction (\"I help [who] achieve [what]\")\n• 5 good questions to ask others (\"What's your biggest challenge with [topic]?\" \"What brings you here?\" \"What's working well in your business?\")\n• Business cards or LinkedIn ready",
        "During event, use 70/30 rule. 70% listening, 30% talking. Ask questions. Let them talk about themselves. Find common ground. When they ask what you do, keep it brief and benefit-focused. Don't pitch. Just connect. Take mental notes about each person:\n• Their challenge\n• Their goal\n• Something personal they mentioned",
        "Collect contact info from 10 people. LinkedIn connections preferred (easier to stay in touch). Or business cards. When connecting:\n\n\"Great meeting you at [event]! Enjoyed learning about [specific thing they mentioned]. Let's stay in touch!\"\n\nPersonal reference shows you listened. Generic \"Nice to meet you\" gets ignored.",
        "Follow up within 48 hours. THE CRITICAL STEP most people skip. Send personalized message to all 10:\n\n\"Hey [name], following up from [event]. Really enjoyed our conversation about [specific topic]. [Something helpful: article they'd like, intro to someone, answer to their question]. Let me know if I can ever be helpful!\"\n\nLead with value, not ask.",
        "Make 2-3 valuable introductions. From your 10 new connections, who should know each other? Connect them:\n\n\"Hey [person A] and [person B], met you both at [event]. Thought you should connect because [specific reason]. [Person A] does [X], [Person B] does [Y]. Could be mutually valuable!\"\n\nBringing value to your network makes you valuable.",
        "Schedule 3 follow-up calls. For the 3 most relevant connections, suggest:\n\n\"Would love to learn more about what you're building. 15-min call next week?\"\n\nTurn connection into relationship. Most networking ends at first meeting. Following up puts you in top 5%. Scheduling call makes you top 1%.",
        "Add all connections to CRM (Customer Relationship Management system) or spreadsheet. Track:\n• Name\n• Company\n• How you met\n• Their main challenge\n• Follow-up date\n• Status (New connection / Had call / Potential partner / Customer)\n\nNetwork only works if you maintain it. Monthly check-ins turn contacts into relationships. Relationships turn into opportunities.",
      ],
      avoidPoints: [
        "Collecting business cards → Leaving event with 50 cards, never following up → They go in drawer and die → Better: 10 connections with immediate follow-up",
        "Only networking when you need something → Showing up only when job hunting or need clients → Transparent and off-putting → Build relationships BEFORE you need them",
        "No follow-up → 'I'll reach out next week' → Never do → 48-hour follow-up rule → Strike while memory is fresh → Delayed follow-up = wasted opportunity",
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
