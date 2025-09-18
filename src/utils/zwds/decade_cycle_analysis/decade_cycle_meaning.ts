/**
 * Zi Wei Dou Shu meanings as a single lookup object.
 * Keys:
 *  - Cycle (12 Decade Palaces): "大命","大兄","大夫","大子","大财","大疾","大迁","大友","大官","大田","大福","大父"
 *  - Star (18 primaries): "紫微","破军","天府","廉贞","太阴","贪狼","巨门","天同","天相","武曲","天梁","太阳","七杀","天机","左辅","右弼","文昌","文曲"
 *
 * The current file includes fully-populated text for Da Ming  and 大兄.
 * Other cycles are placeholders you can fill progressively.
 */

export type StarKey =
  | "紫微"
  | "破军"
  | "天府"
  | "廉贞"
  | "太阴"
  | "贪狼"
  | "巨门"
  | "天同"
  | "天相"
  | "武曲"
  | "天梁"
  | "太阳"
  | "七杀"
  | "天机"
  | "左辅"
  | "右弼"
  | "文昌"
  | "文曲";

export type CycleKey =
  | "大命"
  | "大兄"
  | "大夫"
  | "大子"
  | "大财"
  | "大疾"
  | "大迁"
  | "大友"
  | "大官"
  | "大田"
  | "大福"
  | "大父";

export type DecadeStarEntry = {
  readonly paragraphs?: readonly string[];
  readonly action_points_title?: string;
  readonly action_points?: readonly string[];
};

/**
 * Single JSON-like lookup: Cycle -> Star -> Meaning
 * Using Partial<Record<StarKey, string>> so incomplete cycles are valid.
 */
export const DECADE_CYCLE_MEANINGS: Record<
  CycleKey,
  Partial<Record<StarKey, DecadeStarEntry>>
> = {
  大命: {
    破军: {
      paragraphs: [
        "You've always known it: when something grows stale, your whole body wants to tear it down and start again. You can smell dead promises, feel the itch in your hands to cut cords, strip paint, rip out the rot. Part of you worries you're 'too much', that your appetite for real change will make you the villain in someone else's story; another part thrills at the clean snap of an ending because it gives you oxygen. People ask why you can't keep it steady. But your inner compass points to the edge, where pressure becomes clarity. In this decade, Po Jun sits in your Life gate: the breaker, the reformer, the one who ends what cannot be healed so something true can stand.",
        "This is a demolition-and-rebuild cycle, not chaos for chaos's sake. Careers can pivot, homes can shift, alliances can dissolve; if you wield the blade with craft, the rubble becomes foundation. If you swing in anger or boredom, the collateral damage lingers - money leaks, burned bridges, exhausted nerves. Your medicine is precision: decide which walls must come down, which beams must be braced, and where the new doorway opens. Build buffers, name your non-negotiables, and time your strikes. Po Jun gives you rare courage; pair it with method and you'll claim clean sky after the storm. Ignore it, and you may win the fight yet lose the map. Take this seriously - your future self is watching how you end things now.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set kill criteria for big goals: three measurable checkpoints and a calendar exit date before you start.",
        "Fund a 6-12 month cash runway; don't resign or relocate until it's in your account.",
        "For any irreversible move, wait 24 hours, then write a one-page exit plan: steps, costs, who to inform, and exact dates.",
        "Channel destruction into pilots: 90-day side tests with budget caps and clear metrics before burning the main bridge.",
        "Speak plainly in conflicts: I want X, I won't accept Y. Schedule tough talks in daylight; no decisions after 9 p.m. or on less than 6 hours sleep.",
        "Protect your downside: drive slower, avoid intoxicated choices; back up data, review contracts, update insurance before you start over.",
      ],
    },
    紫微: {
      paragraphs: [
        "There’s a quiet authority in you that others feel before you speak. You constantly measure the room ,  who’s ready, what will hold. You want to lead, yet you fear misusing power; so you swing between taking charge of everything and retreating into watchful silence when people ignore your foresight. You crave respect, not flattery; fairness, not chaos. This decade in Da Ming  with Zi Wei places the mantle squarely on your shoulders: fewer tasks, bigger decisions. People will read your standards as law, your calm as permission, your hesitations as policy. Nights may find you mapping outcomes, mornings carrying the weight of everyone’s expectations. But this is the era to sit fully on the throne of your life, to set the cadence, to be the steady sun others orbit.",
        "The pitfalls are pride, isolation, and perfection. When you aim for flawless, momentum stalls; when you give without boundaries, resentment grows. A castle without a drawbridge becomes a prison ,  invite counsel, not chorus. Build rituals that steady your nervous system, and lead with justice before popularity. Make generosity visible, but keep authority clear: praise openly, correct privately, decide promptly. If you define the game with integrity and rhythm, your world organizes itself around that gravity ,  and people rise with you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a one-page Charter: 3 non-negotiables, decision criteria, work/rest hours. Share it with your inner circle within 30 days.",
        "Use the 70% rule: when you have 70% of the info, set a 48-hour deadline and decide.",
        "Form a cabinet of three (mentor, operator-peer, truth-teller). Hold a 60-minute monthly council and require one pushback from each.",
        "State expectations in plain words: “I need X by Y because Z.” Follow with a brief written recap.",
        "Praise in public weekly; deliver corrections 1-to-1 within 72 hours, with a clear next step.",
        "Protect deep work: two 90-minute blocks daily, phone outside the room, default reply “not now” to off-mission asks.",
      ],
    },
    廉贞: {
      paragraphs: [
        "You carry a clean edge and a hot core. People read you as composed, but inside there’s a fierce hunger to shape the room, test loyalties, and prove who truly has the keys. You want order, and you want the thrill. You’re the one who can spot a crooked joint in any system and the one who secretly wonders how far a well-placed shortcut could take you. This decade turns that inner trial into your main stage: the judge and the rule-bender in the same body, choosing which voice gets the mic.",
        "Life will usher you into corridors where decisions actually bite, promotions with strings, alliances that feel electric, projects with reputations attached. Your magnetism rises; people confide, plot, and court you. It’s intoxicating. But the stakes are real: one impulsive message, one private side deal, one unchecked attraction can cost you years. Your gift is reform, seeing the hidden mechanism and rebuilding it tighter, cleaner, sharper. The medicine is slow fire: disciplined rituals, transparent processes, and a personal code you won’t trade for applause.",
        "Play this decade as a reformer, not a rebel without a ledger. Choose your vows early, around money, intimacy, influence, and truth, and guard them like flame in wind. Do that and you become the one who cleans house and sets better rules. Neglect it, and you weave a net that eventually catches you. Power favors the steady burn, not the wildfire.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a five-rule personal code (money, intimacy, influence, secrets, conflict). Print it, carry it, and review every Sunday.",
        "Before any alliance or contract, map it on one page: who wins, who loses, single points of failure, exit clauses. If unclear, wait 48 hours.",
        "Use a two-step message rule: draft the hot reply, save it, move your body (walk, shower, workout), then send only if it helps the long game.",
        "Schedule heat into the body: 3 sessions weekly (martial arts, strength, laps). Treat them as non-movable meetings to burn impulse into focus.",
        "Quarterly relationship audit: top 10 contacts → green (trust), yellow (unclear), red (costly). Have one clarifying talk per yellow; set boundaries or exit reds within two weeks.",
        "Create a transparency layer: shared folders, written recaps after meetings, and email confirmations of decisions to protect reputation and align allies.",
      ],
    },
    天府: {
      paragraphs: [
        "You move through life like a well-stocked vault - quiet, reassuring, seldom rushed. People lean on you because you hold the keys: to calm decisions, full cupboards, plans that actually get finished. Yet inside there’s a tug: the part that loves comfort and control versus the part that wants to build a legacy bigger than your arms can hold. You dislike waste, gamble rarely, and prefer improvement over upheaval. Still, you sense that simply guarding what you have will not be enough. In this Da Ming  decade, Tian Fu sits at your core, asking you to own your role as steward, provider, and designer of durable structures. The question humming beneath your routines is simple and relentless: will you let security be a shell you hide in, or the soil that feeds bolder growth?",
        "This cycle favors consolidation that becomes expansion: turn reserves into engines, not trophies. Build systems that keep money, time, and energy circulating - clear pipelines instead of swelling storage. Choose a few pillars to master and fund them properly: a home that runs itself, a portfolio with rules, a team you trust. Prune the comfortable clutter that eats attention. Watch for softness: overindulgent meals, saying yes out of obligation, hoarding tasks because only you “do it right.” Measured generosity multiplies your influence; strategic delegation preserves your crown. Your body and schedule will tell you when the vault is too tight - listen and loosen. If you work the soil, the harvest will be steady and compounding. If you simply fortify the walls, you’ll be safe - and slowly, quietly, stuck.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Hold a monthly treasury review: cash flow, obligations, energy budget, and upcoming risks.",
        "Set risk bands: a floor you must invest monthly, a cap you won't exceed. Automate it.",
        "Delegate one control-heavy task per quarter; document the process, hand it off, and don't reclaim it.",
        "Open and maintain a legacy file: will, beneficiaries, key accounts, passwords, and instructions; review it twice a year.",
        "Create a no-clutter rule: one in, one out for subscriptions, tools, and commitments.",
        "Guard your body's vault: finish dinner 3 hours before sleep; walk 8-10k steps daily.",
      ],
    },
    太阴: {
      paragraphs: [
        "You move like moonlight, quiet, observant, pulling tides without noise. In any room you read mood first, care for others before they ask, then wonder why no one notices your effort. You crave solitude yet ache to be someone’s safe harbor. Nights wake you with ideas and worries; days require a composed face. You want choices to be “right,” so you compare, wait, and keep doors half-open. You manage resources carefully, then spend on comfort and the people you love. With Tai Yin in your Life palace this decade, sensitivity is not a flaw, it’s the instrument you must learn to play on purpose. The tension: needing softness while being called to lead yourself.",
        "This cycle asks you to become keeper of your inner shore: not just soothing others, but naming your tides and building banks. Patterns are power, track mood, money, and energy to see when to create, when to rest, when to negotiate. Roles that thrive: quiet strategy, writing, design, finance, healing, hospitality. Anchor each with clear outcomes so you don’t drift into invisible labor. In love and friendship, stop hinting; ask plainly and set timelines. Let home be mission control, light, water, sleep, privacy. Warning: if you avoid conflict and float along, choices will be made for you. Choose the light you want, or you’ll live under whatever lamp is nearest.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a 72-hour decision window with your top 3 criteria written. Decide at deadline; stop researching after 48 hours.",
        "Speak needs plainly: “I need X by Y because Z.” No hints, tests, or silent resentment.",
        "Run a Moon Budget: auto-transfer 15% to savings, 5% to Comfort Fund; review accounts every new moon.",
        "Protect energy: schedule two 90-minute night creative blocks weekly; set up a quiet corner; screens off 60 minutes before sleep.",
        "Boundaries protocol: when asked for help, rate capacity 1-10; if under 6, offer two alternatives or a later date.",
        "Be seen weekly: publish a post, email, or demo; ask directly for feedback, introductions, or payment.",
      ],
    },
    贪狼: {
      paragraphs: [
        "Your hidden truth is appetite: for experience, for connection, for beautiful risks. When you enter a room the air shifts; people lean in without knowing why. You can reinvent on cue, lover, leader, rainmaker, artist, yet the same magnetism that opens doors tempts you to try them all at once. You fear being “too much,” so you either over-promise and ghost, or play small and feel starved. Your compass swings between devotion and distraction, purity and pleasure. At 3 a.m. you swear you’ll choose one path; at noon you crave another. That tension is the engine of this decade.",
        "With Tan Lang sitting in your Da Ming  for these ten years, your identity is braided with desire and reinvention. Charm becomes currency; networks multiply; the worlds of branding, entertainment, sales, partnerships, culture, and nightlife feel unusually responsive to you. You can turn attention into opportunity, if you direct it. The shadows are real: overindulgence, tangled loyalties, scattered hustle, and money burned on thrill instead of build. People will project fantasies onto you; some will test your boundaries; a few will try to ride your wave. Your task is not to shrink, but to choose: name your values, set clean agreements, and let discipline carry what charisma starts.",
        "This can be the decade you alchemize desire into devotion and create a life that actually fits your hunger. Design containers for your fire, rituals, training, creative work, that let you feast without burning your house down. Slow your “yes,” deepen your “why,” and put your magnetism in service of one worthy obsession. Do that, and momentum becomes inevitable. Ignore it, and the same heat turns to debt, drama, and a reputation you’ll spend years repairing. Choose with your whole chest.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write three non-negotiables for body, money, and intimacy; post them where you see them daily and review every Sunday.",
        "Set a desire budget: max two late nights per week, a fixed monthly “thrill” amount, and a hard rule, no major decisions after 11 p.m.",
        "Practice clean asks: say exactly what you want in one sentence (scope, timeline, compensation or boundaries); no hints, no tests.",
        "Pick one yearlong obsession (a craft, business, or role); schedule five 90-minute deep-work blocks weekly and track outputs, not hours.",
        "Use charm responsibly: don’t flirt to avoid conflict; have the difficult conversation within 48 hours and confirm agreements in writing.",
        "Build friction and accountability: app-limit social media, autopay 15% to savings, make deals in daylight/no-drink settings, and do a weekly check-in with a friend or coach.",
      ],
    },
    巨门: {
      paragraphs: [
        "You’ve always carried a blade and a lantern in your mouth: words that cut through fog, questions that won’t stop until the truth sits still. You draft and delete messages, replay talks at 2 a.m., catch the quiver in someone’s tone and the seam in their story. Part of you longs to say it plain; another part keeps peace by swallowing your sharpest lines. You hunger for clean facts and clean motives, yet you can’t ignore the murk that other people pretend not to see. Your gift is seeing the subtext; your ache is what to do with it.",
        "In this decade, Ju Men takes the main seat of your life. Your voice becomes weather: rooms tilt toward your questions, contracts hinge on your definitions, and opportunities appear where analysis, negotiation, compliance, research, or cuisine meet precision. You’ll be asked to name the thing nobody else can name. But light draws moths: rumors, misquotes, debates that want to become wars. Stress may sit in the throat, jaw, or gut if you carry every clash home. Choose your battlegrounds. Not every inconsistency deserves a trial; some only require a label and a boundary. When you steer your speech, your speech stops steering you.",
        "Let this be the decade you turn scrutiny into stewardship. Ask clean questions, then let silence work. Put clarity above cleverness. Keep simple rituals that rinse your inner water, journaling before sleep, slow walks after hard talks, warm broths that settle the stomach. When your words serve meaning instead of mood, you become the trusted filter in any room, the one who clarifies, not condemns. Do this, and the next ten years shift from courtroom to council, from argument to authority.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Start messages with the headline: one clear sentence of what you want.",
        "Use the structure: “I saw X, I felt Y, I need Z” instead of accusations.",
        "Put every agreement in writing within 24 hours, owner, deadline, and definition of done.",
        "Wait 12 hours before sending anything written in anger; reread it aloud once.",
        "Schedule a weekly 30-minute worry audit: list concerns, rank them, pick next actions.",
        "Train your voice and protect throat/gut: join Toastmasters or coaching; warm water; avoid late-night spicy food; screens off after 10 p.m.",
      ],
    },
    天相: {
      paragraphs: [
        "You keep the room balanced like a velvet glove over a precise scale. People confide in you because you are fair, composed, and quietly exacting. Behind the calm, you carry ledgers, who promised what, what is ethical, what is possible. You rework plans so others can land softly, even if it costs you sleep. The tug inside is real: you want to be the arbiter of clarity, yet you fear being unfair, so you delay, polish, and check everyone’s temperature again. You cherish order and dignity, but a part of you wants to name the truth without apology and let the chips fall where they must.",
        "This decade puts the gavel in your hand. Tian Xiang in the Life palace asks you to move from mediator to steward, set the standard, codify agreements, build structures that outlast your mood. Your reputation is ready to solidify; authority arrives through service, not sacrifice. Decide from principles, not pressure, and design systems so kindness has teeth. The warning: if you keep cushioning everyone, you’ll drown in meetings, become the polite gatekeeper of your own life, and your body will pay. Claim the bench: when you choose your verdict early and speak it plainly, doors open and the right allies gather. Let your fairness become a force that frees you, too.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Choose three non-negotiable values; write them on the first page of your notebook and use them to accept or decline every request for 90 days.",
        "Create a one-page charter for each key project/relationship: roles, decision rights, deadlines, and exit terms. Review and revise it quarterly.",
        "Apply the 70% rule: when you have 70% of the information, set a 48-hour deadline and decide. Only extend if materially new data appears.",
        "Practice a clean no: “I can’t take this on. Here’s a resource or timeline that could work.” Use it at least twice a week.",
        "Delegate 20% of your workload: list five tasks you shouldn’t do; hand off two this week with clear outcomes and check-ins on the calendar.",
        "Protect your energy like policy: two daily 90-minute no-meeting blocks, one device-free evening weekly, and book your preventive health checks now.",
      ],
    },
    天同: {
      paragraphs: [
        "Under this 10-year tide, your softness is both refuge and trap. You read rooms and feel moods before words form; you prefer smoothing edges to sharp confrontations. When tempers flare, you pour tea, change the subject, and tell yourself you'll handle it later. You call yourself easygoing, yet the more you cushion others, the heavier your own cushion feels. With Tian Tong in 大命, your magnetism is gentle; people seek your calm. But the inbox, the bills, and the body hold the weight of every delayed decision.",
        "Your true gift is designing comfort that heals: kind teams, welcoming homes, humane processes. Roles that blend care and structure bloom for you - hospitality, counseling, HR, wellness, design, community work. Done consciously, your tenderness becomes a stable climate others thrive in. Done passively, comfort turns to drift: hours dissolve into scrolling, favors multiply, money leaks through small treats. Anxiety shows up as aches, sighs, and late nights. The choice is not harder or softer - it is intentional comfort over numbing comfort.",
        "This decade rewards soft leadership with firm edges. Say smaller yeses, earlier noes, and make decisions on time. Rituals protect your sensitivity; boundaries honor it. If you claim your pace and priorities, your serenity will scale. If you keep waiting, someone else's urgency will script your days. Choose now: discipline that preserves ease, or ease that erodes direction.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Block 90 minutes each morning for one avoidance task; phone off, door closed, finish before noon.",
        "Write and use a boundary script: I'm not available for X. I can do Y by Z.",
        "Set a weekly caretaking cap (two hours). Track it; after that, request reciprocity or decline.",
        "Swap numbing with nurturing: no screens after 9 pm; replace with bath, stretch, or ten-minute tidy.",
        "Create a comfort budget and a 48-hour rule for non-essentials; automate savings on payday.",
        "Host a monthly gentle gathering (tea, walk, co-work) to connect without draining yourself.",
      ],
    },
    武曲: {
      paragraphs: [
        "You carry yourself like a quiet commander: eyes on the numbers, hands on the levers, heart hidden under well-forged armor. You prefer clean lines, firm timelines, and decisions that actually stick. People say you’re blunt; you hear it as honest. Yet at night the ledger glows, profit, loss, loyalty, fatigue, and you wonder if the strength that keeps everything steady is also what keeps you standing alone. You can cut fast, negotiate hard, and endure storms, but you long for softness that doesn’t collapse the structure you’ve built.",
        "This decade asks you to run your life like an elite unit. Inventory everything. Strip the decorative, keep the essential. Convert effort into ownership, cashflow, and systems that work when you’re asleep. Name your standards and enforce them without drama. But beware: a blade held too tightly becomes a wall. Unchecked austerity breeds isolation, and a win-at-all-costs stance can drain the very warmth you fight to protect. Make the cut, then make the call that reconnects. Without that balance, you may win many battles, and quietly lose the campaign. Take this seriously; seek counsel before your armor becomes your cage.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a 10-year operating plan: target reserves, monthly cashflow floor, and clear exit criteria for projects.",
        "Set hard rules for money: auto-save first, cap on speculative bets, and a strict stop-loss you never override.",
        "Renegotiate terms wherever you contribute value, comp, equity, scope, using numbers, not apologies.",
        "Schedule a monthly “cut or commit” review: cancel one drag, deepen one high-return habit or relationship.",
        "Practice warm authority: deliver decisions in one sentence, add one sentence of context and care.",
        "Build redundancy: document processes, train a second, and ensure critical work can run without you for two weeks.",
      ],
    },
    天梁: {
      paragraphs: [
        "You’ve spent years being the steady beam, the one who notices the hairline cracks before anyone else, who tightens the bolts while others sleep. You carry promises like heirlooms, and people come to you when the weather turns. Yet the push-pull is real: part of you wants to rescue, part of you aches for a life not measured by other people’s emergencies. You crave fairness, but you’re tired of holding the scales. You give sound counsel, then feel the quiet sting when they treat your wisdom like free air.",
        "This decade asks you to shift from rescuer to steward. Your strength isn’t in mopping up leaks; it’s in building the kind of roof that doesn’t leak. Expect to be invited into roles that require trust, policy-setter, mediator, mentor, guardian of standards. Your authority rises not from volume, but from the calm proof of integrity over time. It will be tempting to play hero; instead, choose your cases. Say no to dramas that refuse repair. Make fewer commitments, but make them binding. Slow-burn recognition finds you through structure, documentation, and measured words. When you hold your boundaries, your presence becomes medicine instead of a bandage.",
        "Watch for the shadow of moral fatigue: the sermon that slips out when you’re depleted, the martyr pose that sneaks in when you feel unseen. Your body will broadcast the truth before your mouth does, especially sleep, digestion, and tension across the shoulders. Keep rituals that quiet the courtroom in your head. This cycle can make you an anchor others can trust, as long as you also become the safe harbor for yourself.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Audit your obligations: list every role and promise; choose three you will exit within 90 days and communicate the end date in writing.",
        "Set “counsel hours”: two fixed weekly blocks for advice and approvals; outside those windows, defer responses to protect deep work and rest.",
        "Write a five-rule code of ethics for decisions; run hires, partnerships, and major purchases through it before you say yes.",
        "Turn favors into agreements: for any repeated help, draft a one-page scope, fee (or clear exchange), timeline, and success criteria.",
        "Speak boundaries in plain language: one sentence, no apologies, “I can help with X by Friday; I’m not available for Y.”",
        "Install a 24-hour delay on corrective actions: no firing emails, policy changes, or confrontations until you’ve slept and reread your notes.",
      ],
    },
    太阳: {
      paragraphs: [
        "You’ve spent years being the reliable light: people look to you, and the room quietly organizes around your presence. Inside, there’s a tug-of-war, the wish to be seen for who you are, not just what you do, against the fear of becoming a prisoner of the spotlight. Mornings begin with clean purpose; by evening you can feel hollow from carrying everyone’s worries. Praise lands but doesn’t fill; what you crave is honest respect and space to lead with heart. When you dim yourself to keep the peace, resentment whispers; when you blaze too bright, guilt follows. This is Tai Yang’s paradox: to warm without burning, to stand forward without performing.",
        "This decade places Tai Yang in your 大命, your public face becomes the weather. The invitation is simple and demanding: lead by principle, not applause. Your steadiness, not your sacrifice, is what grows things. Choose the causes, teams, and rooms where your light is welcomed and reflected, not drained. Build a rhythm that protects your core hours and your body; infrastructure is the quiet hero behind charisma. Say yes to roles that let you set direction and mentor; say no to rescue missions and endless “quick favors.” Let others hold their own shadows; you are a sun, not a sponge. Step into visibility on your terms, the world needs your warmth, and you need your boundaries to keep it.",
        "Claim this decade as your true noon: clear, generous, and sustainable. Lead in daylight, rest without apology, and let your radiance become a climate others can thrive in.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Name your North Star: write 3 non-negotiable values; decline work that breaks two of them.",
        "Guard core hours: block 90 minutes each morning for deep work, phone off, door closed.",
        "Schedule visibility: set two weekly slots for outreach/speaking; protect them like client meetings.",
        "Say needs plainly: use one sentence with request, boundary, and deadline, no hints or long backstory.",
        "Delegate by the 70% rule: list tasks others can do 70% as well; hand them off within 14 days.",
        "Debrief cleanly: after wins/losses, do a 15-minute review, facts, lesson, next step; ignore comment sections.",
      ],
    },
    七杀: {
      paragraphs: [
        "You move like a blade that refuses to dull. Stagnation makes your skin itch; when the room hesitates, you cut through the haze, take the hit, and accept the blame if it gets things moving. People call it ruthless; you know it as survival and clean honesty. There's a private tug-of-war: the part that wants to flip the table and start fresh, and the part that still loves what the table once held. You sense rot early, see the line others won't cross, and carry the quiet loneliness of the one who chooses. You guard your heart behind competence, you pack escape routes into every plan, and at 2 a.m. you rehearse endings so you can begin again without apology.",
        "With Qi Sha in your Da Ming  for this decade, life keeps handing you thresholds: restructures, relocations, separations, first-in-command moments no one else will touch. Crisis will be your proving ground and your classroom. Done well, you'll carve a new authority - lean, respected, unmistakably yours. Done hurried, you risk scorched earth: estranged allies, legal tangles, a body running hot until it breaks. The medicine isn't softness; it's precision. Swap rage for cadence, compulsion for campaign, solo for disciplined allies. A blade is safest when it knows its sheath and its code. Sharpen your purpose - or the decade will sharpen you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a three-sentence mission for this decade; read it before major decisions.",
        "Set rules of engagement: no irreversible choices at night; draft angry messages, send after 24 hours.",
        "Appoint a council of three who can veto rash moves; call one before quitting or confronting.",
        "Work in 90-day campaigns with clear metrics; finish each with a blunt after-action review.",
        "Put everything in writing - scopes, fees, timelines; schedule a weekly admin hour; consult a lawyer annually.",
        "Train like a professional: strength, mobility, sleep; book deload weeks and biannual health checks.",
      ],
    },
    天机: {
      paragraphs: [
        "You move through life like a quiet engineer of possibilities: sensing patterns, plotting routes, adjusting dials. Inside, two forces wrestle ,  the craving for a reliable map, and the thrill of a back road. You can read rooms quickly, see the angles, and design plan B, C, and D before anyone names plan A. But the same mind that protects you also keeps you awake, scrolling invisible tabs, second-guessing choices you already made. You’ve pivoted roles or interests more than once, not because you’re flaky, but because your curiosity refuses to live in a small box. Still, the weight of too many options can make even simple steps feel heavy.",
        "This decade rewrites your operating system. Your gift is not loud charisma; it’s precise questions, elegant frameworks, and timely adjustments. When you treat life as a series of experiments instead of a verdict, momentum returns. You are most powerful as the strategist who also builds a minimal version and learns in public. If you choose focus, your influence compounds quietly through documents, processes, and people you’ve helped think clearly. The risk is slipping into rumor-collecting, over-analysis, or moving pieces in secret to feel safe. Keep your integrity spotless and your feedback loops short.",
        "Decisions are the doorway here. Perfect certainty won’t arrive; windows will open and close while you calculate. Anchor to a few non-negotiable values, set timeboxes, and then move. Make your plans prototypes, commit for a season long enough to test (18-24 months), and let data, not anxiety, tell you when to pivot. If you don’t name your north and move, the decade will move you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page personal operating manual: top 3 values, 3 priorities, a “no” list; review monthly.",
        "Run two-track planning: 1 core path with an 18-month commitment, plus 1 small experiment each quarter.",
        "Use a 70% rule: once you have enough info, set a 48-hour timer and decide with a witness.",
        "Build a thinking council of 3 people; schedule a 45-minute monthly check-in to pressure-test assumptions.",
        "Protect sleep: screens off 90 minutes before bed; brain-dump worries; aim for a consistent wake time.",
        "Communicate directly: say what you want in clear sentences; add action, owner, and deadline to emails.",
      ],
    },
    左辅: {
      paragraphs: [
        "You’re the quiet hinge that makes the door swing. In rooms where others talk big, you notice what’s missing, stitch people together, and turn chaos into a plan. You’re the person with the spare charger, the backup plan, the calm checklist when fires start. And yet there’s that tug: you love being the dependable second, but you also ache to shape the direction, not just tidy it. You feel seen when things work, and strangely invisible when the thanks fade and your own needs wait at the very end.",
        'This decade asks you to claim the power of assistance as authorship. With Zuo Du in Da Ming, your gift is building trust, systems, and alliances that actually hold. People will seek your guidance because you make complex things simple and keep promises. The shadow is over-responsibility: saying yes to "just one more" until resentment leans in, micromanaging because you care too much, softening your voice when it’s time to state terms. The lesson is sharp and kind: help strategically, not sacrificially; document your value; and let your steadiness be visible, not hidden.',
        'If you choose visibility with grace, this cycle elevates you from helper to shaper. Your reliability becomes recognized leadership, and you’ll be invited into the rooms where decisions are made. If you keep hiding behind "no worries, I got it," you risk burnout and being passed over for the very roles you already perform. Step forward, warmly, clearly, and let the record show what you build.',
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "State your terms out loud: write three non-negotiables (workload limits, response times, decision rights) and share them with your team or family.",
        "Convert repeat favors into a process: create a simple checklist, timeline, and scope so help has edges and a finish line.",
        "Ask for credit directly after big deliveries: send a recap email that lists outcomes, your contributions, and your recommendation for next steps.",
        'Set a weekly rescue limit: allow yourself two unplanned "saves" and redirect the rest with options or timelines instead of instant yeses.',
        "Build two-way alliances: identify one mentor and one capable deputy; meet biweekly to trade support and distribute responsibilities.",
        "Practice one decisive no each week: say no clearly, offer one alternative, and stop explaining after one sentence.",
      ],
    },
    右弼: {
      paragraphs: [
        "You are the quiet glue, the dependable right hand. You read the room fast, soften sharp edges, and stitch loose threads before anyone notices. People trust you with delicate conversations and messy handoffs. You say yes because you care, and because it keeps the peace. Yet under the calm is a familiar tug: you want to be valued for your vision, not just your helpfulness; to speak plainly without rehearsing how to keep everyone comfortable. Sometimes you swallow truth, then carry the weight alone. You wonder who would show up for you if you stopped smoothing everything.",
        "This decade puts your alliances on center stage. Right Assistant in the Life palace turns introductions into opportunities and goodwill into real leverage. Small favors compound into doors you could not have opened alone. But the same current can sweep you into over-functioning: everyone routes through you, deadlines slide onto your plate, and quiet resentment builds. The pivot is simple and brave: stop being the corridor; become the doorway. Choose the tables where your help advances your aims. Define your role, set limits, and ask for what you actually want, with receipts and timelines.",
        "When grace meets structure, your support becomes authority. You will not just calm storms; you will set the weather. Keep the kindness, drop the appeasing. Curate allies, name your non-negotiables, and let a few plates fall so the right ones can be carried well. Do this, and this decade graduates you from right hand to steady helm.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write three 24-month priorities; share them and ask each ally for one concrete help.",
        'Reply to new requests with, "Let me confirm and get back to you tomorrow," then decide.',
        "Turn every agreement into a short email with owner, deadline, and definition of done.",
        "Stop rescuing: offer two options and a deadline, then leave responsibility with them.",
        "Keep a reciprocity log; review monthly; prune one lopsided tie and deepen one balanced one.",
        "Choose one domain to lead this year and one commitment to end; announce both publicly.",
      ],
    },
    文昌: {
      paragraphs: [
        "You’ve spent years arranging life the way you arrange a sentence, moving pieces until meaning clicks. You hear subtext, catch typos in plans, and soothe chaos with a well-placed line. People come to you when their ideas are tangled, and you untie them quietly, even as your own voice waits in the margin. This decade, your words become a keycard. An email opens a door. A proposal shifts a room. The right question lands like a compass. You’re being asked to step from editor to author, from backstage whisper to clear, steady transmission.",
        "Your tension is familiar: research until flawless, or speak while the heart is still trembling. Correct to feel safe, or connect to feel seen. Wenchang in the Life Palace wants order and expression in equal measure. Build clean systems, calendars, checklists, a living knowledge base, so your mind can write, not just remember. Codify what you know into talks, guides, and repeatable methods. Say the simple, true sentence in meetings and let it stand. Partner with doers who move the plan forward while you keep the thinking crisp. Paperwork, contracts, and documentation are allies now; precision protects the future you.",
        "Beware the trap of polishing the draft until the moment passes. Pedantry, gossip, and endless “research” are just procrastination wearing glasses. Don’t correct to control. Protect your attention like an heirloom, fewer tabs, tighter scope, cleaner yeses. Claim authorship of your narrative, even if your hand shakes. In this cycle, your name travels farther than your footsteps; let your words go before you feel ready, and let the world answer back.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Publish one finished piece every week or two; set a hard deadline.",
        "Write a one-page brief before projects: problem, audience, outcome, deadline.",
        "Run a weekly review: capture notes, decide next actions, archive the rest.",
        "In meetings, state the decision in one sentence; assign owner and date.",
        "Turn knowledge into a product, a template, guide, or workshop, then pre-sell it.",
        "Confirm major agreements the same day with a clear, bullet-point email.",
      ],
    },
    文曲: {
      paragraphs: [
        "You’ve always known that words are not decoration for you, they’re steering wheels. People call you eloquent, but they don’t see the hours you spend sanding a sentence until it rings true. In this decade, your hidden tension sharpens: the diplomat who keeps the peace versus the honest heart that longs to say the exact, unvarnished thing. You sense that if you express it right, doors open; if you hedge or charm too much, the moment slips away. You’re done with vague. You want language that lands, builds, and frees.",
        "With Wen Qu  in your Decade Life palace, your presence turns luminous, muse, strategist, bridge-builder. Invitations come to write, present, teach, pitch, brand, mediate. Your taste refines the room; your voice shapes the terms. Yet charm without anchor becomes mist: people-pleasing, polite evasions, perfection that delays delivery, romances that blur agreements. The medicine here is simple and demanding, let your words become commitments. Speak to align action, not to avoid friction. Make beauty serve truth, and your influence becomes durable instead of decorative.",
        "This is a growth decade if you treat your voice as craft and currency. Publish, ship, and let feedback sculpt you. When you choose clarity over cleverness, you’ll see conversations turn into contracts, ideas into assets, relationships into clean collaborations. Your livelihood can be lit by what you articulate and finish. Step forward. The world is unusually ready to hear you when you speak plainly and stand by what you’ve written.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a weekly publishing cadence (newsletter, video, or thread) and ship on schedule, mood or not.",
        "Say what you actually want in plain words; confirm mutual understanding by having others repeat it back.",
        "Put every agreement in writing within 24 hours, scope, deadlines, fees, and change policy, then get explicit confirmation.",
        "Build a simple portfolio: three flagship pieces, three testimonials, and one clear offer; refresh it quarterly.",
        "Protect focus: daily 90-minute deep-work blocks, phone outside the room, and a single 2-hour social-media window weekly.",
        "Keep romance out of collaboration; if feelings arise, define roles and boundaries in writing, or step back cleanly.",
      ],
    },
  },
  大兄: {
    紫微: {
      paragraphs: [
        "You’ve long been the steady center of your sibling-and-friend orbit. People come to you for decisions, to settle bills, to calm storms. You want to be generous and noble, yet you’re tired of carrying what others drop. You sense dynamics before they erupt, smooth group chats, and remember every unreturned favor, even if you smile through it. Your heart loves protecting the pack; your spine wants respect and reciprocity. That push-pull ,  care versus control, harmony versus honesty ,  is the drumbeat beneath your relationships.",
        "With Zi Wei lighting your Da Xiong decade, leadership among peers becomes unavoidable. You’ll be asked to host, mediate, front the deposit, chair projects, arbitrate family logistics. Your presence steadies the room, and your words become the default decision. This is your training in dignified authority: less throne, more round table. Clear roles, clean money rules, and stated expectations will save you from resentment. Some companions will step up; others will drift when the favors stop. Let quality rise. Pruning is not loss ,  it’s design.",
        "Play this well and you’ll cultivate a loyal, high-caliber inner circle that multiplies your strength. Play it by pride, scorekeeping, or silent martyrdom, and you’ll invite palace politics you don’t need. Choose your kingdom with intention.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write terms for shared plans/money: who, what, by when, how much. Otherwise decline.",
        "Ask consent before advising: “Want ideas or just a listener?” Match your response accordingly.",
        "Replace rescuing with resourcing: share options, set a check-in date, let adults choose.",
        "No triangles: don’t carry messages; facilitate direct talks between the two people involved.",
        "Run a monthly 60-minute council: celebrate wins, assign owners, track decisions and expenses.",
        "Curate your inner circle: pick five, invest weekly; let peripheral ties fade without drama.",
      ],
    },
    破军: {
      paragraphs: [
        "You love hard and cut clean. In this decade, your bonds with siblings and peers feel like fault lines, steady until they rumble. You’re the one who names the elephant in the room, the friend who shows up when things are on fire, and the person who disappears to breathe once the flames are out. There’s pride in being the strong one, and a secret ache that no one fully carries you back. Po Jun in Da Xiong turns the spotlight on your social architecture: it breaks what’s stale, tests who’s real, and pushes you to rebuild a circle that is battle-worthy, not just familiar. Expect group chats to erupt, alliances to be forged in crisis, and loyalties to be measured by actions, not titles.",
        "This is not punishment, it’s a pruning. Some ties will end because the path demands it. Others will deepen because you both choose it again after the test. Your power is in directing the demolition: clear boundaries, clean exits, brave conversations, and practical structures that prevent resentment. Lead without domination; protect without martyrdom. When you handle endings with dignity and write the rules of engagement early, you trade drama for respect and loneliness for a chosen family that stands when the ground shakes. Ignore the call, and the decade can harden into feuds, scorch-earth exits, and a heroic solitude that costs too much. Shape the break, or the break shapes you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Audit your circle quarterly: list names and mark + (gives), - (drains), = (neutral). Adjust contact and access accordingly.",
        "Use the 24-hour rule before cutting someone off. Draft the message, remove blame language, and send only after cooling.",
        "Move money and favors to writing. Use a shared document with amounts, deadlines, and what happens if plans change.",
        "Host a monthly ‘truth hour’ with siblings/closest friends: one tough topic, 45 minutes, no interruptions, end with next steps.",
        "Join action-based groups (mutual aid, crisis response, martial arts, startup labs) to meet allies who thrive under pressure.",
        "If you must exit a group: state the reason in three sentences, return shared resources, say private goodbyes, then mute drama.",
      ],
    },
    天府: {
      paragraphs: [
        "You are the table everyone gathers around. Somehow, you have the spare charger, the right contact, the calm plan when others spin. People exhale around you. Truth: you like being the anchor, but your back aches. You want to give freely, yet you’re tired of being the bank, the calendar, and the therapist. You crave peers who can carry weight too, but you hesitate to name what you need, afraid generosity will look smaller if it has edges.",
        "With Tian Fu lighting the Da Xiong palace this decade, friendships, siblings, and teams become your vault. Resources, money, access, steadiness, flow through you. Invitations arrive because others trust your reliability. The blessing is real: doors open through alliances, not solo pushes. The risk is subtler: you start running everyone’s logistics, buffering conflict, keeping unspoken ledgers. Circles feel loyal but stagnant. Safety turns into control. If you don’t redesign how you relate, the abundance you steward begins to feel like a drain.",
        "Choose curation over accommodation. Fewer, deeper bonds. Clear roles. Reciprocal agreements. Ask as boldly as you give. When your boundaries are firm, your warmth compounds instead of leaking. This decade can make you the quiet architect of a powerful network, one where your stability nourishes everyone, including you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Define roles at project start: decisions, money, timelines, exit terms, written and shared.",
        "Set a weekly helper cap (hours or cash). When it’s hit, pause or defer.",
        "Make clear asks: “Can you lead X and deliver by Friday?” No soft hints.",
        "Replace loans to friends with structure: written agreement, timeline, or a polite no.",
        "Join one new peer forum outside your usual lane; attend monthly and contribute.",
        "Do a quarterly audit of top contacts; plan one mutual-upgrade action per person.",
      ],
    },
    廉贞: {
      paragraphs: [
        "This decade pulls you into the role you both want and resist: the standard-bearer among peers. You crave clean loyalty, clear lines, and grown-up agreements, and you can smell flakiness from across the room. People feel your gravity. They gather when something serious needs fixing, but they also watch their words around you. Inside, you toggle between warmth and watchfulness: part of you wants effortless camaraderie; another part keeps testing if others are sturdy enough to stand beside you. With Lian Zhen here, you’re the reformer in the friend circle, the one who sets boundaries, names the problem, and turns chaos into a code.",
        "In lived moments this looks like drafting the team compact when everyone else says “we’ll figure it out,” mediating a flare-up and then quietly keeping receipts, or choosing three reliable allies over ten noisy acquaintances. You’re magnetic to capable, ambitious people, and polarizing to the sloppy or evasive. Betrayals cut deep, so you cut clean. You might build an inner council, rotate roles, and insist on real accountability. The risk: becoming the warden instead of the captain, policing more than inspiring. The opportunity: channel your authority into a banner larger than ego, shared standards that make everyone braver and sharper.",
        "This cycle can crown you as a respected hub with a loyal cadre, or harden you into a lone sheriff no one calls. Lead with structure and steadiness, not suspicion. Choose your battles, state your terms, and let the wrong people opt out early. Do this well, and your circle becomes a fortress with open gates.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a one-page working agreement for every group project: roles, deadlines, decision rules, exit terms.",
        "Map your top five allies; write one line of mutual value for each; schedule quarterly one-on-ones.",
        "Use a 24-hour pause before issuing ultimatums or cutting ties; run the decision by a neutral peer.",
        "Host a monthly roundtable or salon; set a clear theme, timebox contributions, and assign rotating facilitation.",
        "For every correction you deliver, give one specific affirmation; follow meetings with a two-sentence gratitude note.",
        "Red-team key plans: invite a trusted skeptic to poke holes, and fix the top three weaknesses before launch.",
      ],
    },
    太阴: {
      paragraphs: [
        "You’ve long been the soft light in your circle, the one who notices pauses on the phone, the friend who remembers birthdays and carries unspoken weight. You prefer to soothe rather than demand, to patch cracks with patience. Yet the same tenderness makes you swallow words when someone takes too much, and you retreat into quiet when you crave care. You count fairness in your head, promising you won’t keep score, then you do. Intimacy wars with self-protection; loyalty wars with the need to rest.",
        "This decade spotlights siblings, close friends, and chosen family. Your influence grows not by volume but by steadiness; people will seek you as a harbor. Doors open through referrals, sisterhoods, and community spaces, especially where women or moonlike leaders hold the room. But moonlight blurs lines: favors become emotional debts, private confidences slide into triangles, and help turns into unpaid labor. The lesson is not to harden, but to name the container. When you speak plainly, support becomes cleaner, and deeper.",
        "Take this as a loving warning: if you keep hinting, you’ll be adored for your warmth and overlooked for your limits. If you keep rescuing, you’ll grow quiet resentment that curdles the bond you’re trying to save. Choose clarity while the ties can still be reshaped. Your care is a gift; without boundaries, it becomes a tax. Step out of the fog now, so the next ten years build a circle that feeds you back.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you need in one sentence: 'I need X by Y to feel supported.'",
        "Set a monthly cap for favors (time/money). Write terms before lending anything.",
        "Before mediating, ask both parties for consent; refuse secret triangles and side chats.",
        "Schedule quarterly one-on-ones with key siblings/friends; share updates and ask for reciprocity.",
        "Join a women-led or values-aligned group; attend monthly; offer one concrete skill.",
        "When hurt, name it within 48 hours; if repeated twice, pause contact for 30 days.",
      ],
    },
    贪狼: {
      paragraphs: [
        "You’ve always been magnetic in your circles, siblings, classmates, colleagues, the after-hours crowd. With Tan Lang lodged in your Da Xiong decade, the room leans toward you: invitations multiply, DMs buzz, someone always wants a favor, an intro, a taste of your momentum. You love the pack and the thrill of mixing people, yet you hate feeling owned. Nights of laughter and secrets can turn into mornings of obligations, tabs to settle, loyalties to balance, whispers to outrun. Alliances feel fluid, flirtation seeps into teamwork, and your name travels faster than facts. This isn’t your imagination; the decade amplifies desire, charisma, and the risks that come with them, jealousy, triangles, and debts (emotional and financial) hiding inside “we’re like family.”",
        "The path isn’t isolation; it’s curation. Depth over dazzle, structure over vibes. Treat your social field like a garden: prune often, water what feeds you, fence what needs protection. Put a price on your time, clarity on your agreements, and air in your boundaries. Sibling drama stops when you refuse the referee role. Pleasure isn’t the problem, the lack of edges is. Choose the table, write the house rules, and let desire fuel craft and collaboration instead of chaos. If you drift on charm alone, others will use you as a bridge and burn both ends; but when you lead with discernment, the very network that once drained you becomes your launchpad.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Do a quarterly circle audit: top 12 people; mark +/0/- energy; reallocate time accordingly.",
        "Set a 24-hour rule for favors; say yes only with clear scope, deadline, and written confirmation.",
        "Keep money clean: no unsecured loans to friends or siblings; offer a small gift or a referral instead.",
        "End triangles: if someone vents about a third person, loop them in or exit the chat.",
        "Host on your terms: one monthly gathering with a purpose, start/stop times, and capped invitations.",
        "Expand wisely: join one new community outside your usual type; observe for 3 meetings before committing.",
      ],
    },
    天同: {
      paragraphs: [
        "You’re the soft chair everyone sinks into, the calm sibling, the gentle friend, the one who smooths the room with a smile and a cup of tea. You want closeness without drama, loyalty without chains. Yet the kindness you give so easily can leave you quietly tired, holding other people’s storms while pretending your own skies are clear. You keep the peace, but the cost is subtle: you adjust, absorb, and then wonder why your needs feel like an afterthought.",
        "This decade spotlights your circle, siblings, friends, teammates, and how you weave safety between people. Your gift is comfort; your power is tone-setting. When you draw clear edges, your softness becomes leadership, not a sponge. The right allies will feel like an exhale: steady, reciprocal, unhurried. The wrong ones will be sweet at first and heavy later. Choose slowly. Ask for proof, not promises. Let your warmth remain, but let your yes be earned.",
        "Expect invitations to collaborate, mediate, and host. Accept fewer, better ones. A gentle heart with firm boundaries can build a community that truly protects you back. Ignore the lines, and you’ll drift into roles you never agreed to, resentments you never voiced, and debts that never end. This is a kind season, but it demands choices. Pick your harbors, or you’ll float on other people’s tides.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a weekly “helping hours” cap (e.g., 3 hours). When it’s reached, say: “I can’t take more on this week, here are two options,” and stick to it.",
        "Before any group project, write a one-page pact: purpose, roles, deadlines, decision rules, and exit terms. If everyone won’t sign, don’t start.",
        "Test reciprocity early: request a small, specific favor. If they dodge twice, downgrade them to “friendly, not trusted” and stop over-investing.",
        "Use a “no loans, only gifts” rule with friends/siblings. Only give what you can part with; confirm the amount and expectations in a short message.",
        "Prune monthly: leave three draining chats or groups; add one new circle (class, club, volunteer) that matches who you’re becoming.",
        "After gatherings, rate your energy +1/0/−1. Book more time with +1 people; create distance from −1 within 30 days (less availability, fewer favors).",
      ],
    },
    巨门: {
      paragraphs: [
        "You hear the seam split in a conversation ,  the off note, the half-truth. You don’t try to stir waters, yet your mouth refuses to decorate what feels wrong. In this decade that instinct heats around siblings, close friends, teammates ,  your equals. You pull people into kitchens and side chats, ask the question no one else will. Intimacy blooms fast: secrets, late-night calls, the sense you’re the only one holding the whole messy truth. Then the recoil: someone says you’re “too much,” group threads knot into subtext, a joke lands like a blade. One week you’re the confidant; the next, the defendant. You carry both roles ,  bridge and wedge ,  and it’s exhausting. Beneath it is fierce loyalty: you’d rather risk friction than live in a lie, even while fearing you’ll be branded the troublemaker for trying to keep the house honest.",
        "This cycle asks you to refine the edge, not blunt it. Your questions become lanterns when aimed at repair, not victory. Expect circles to reshuffle: some long ties loosen so steadier, cleaner alliances can form. Define how you do closeness ,  plain words, clear deals, receipts over rumors. Choose battlegrounds: private talks before public call-outs, agreements before assumptions, pauses before paragraphs. Refuse triangles; don’t carry messages for other people’s wars. Be alert with money and favors among peers ,  if it can’t be a gift, make it a contract. When you practice this clarity, you become the sibling/friend trusted in a crisis ,  the one who names the problem and steadies the room. If you don’t, the same gift splits your network into camps and whispers. The way you speak now decides who stands with you at the end of the decade.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Start tough talks with, “Can I share what I’m noticing?” then mirror their words before critique.",
        "Convert group decisions to writing within 24 hours: who owns what, by when, and where it’s tracked.",
        "No triangulation: if someone complains about a third person, move to a three-way call within 48 hours or decline the topic.",
        "Set a late-night rule: draft the message, sleep on it, send or delete in the morning.",
        "Money and favors: only lend what you can gift; otherwise write terms (amount, date, consequence) before sending.",
        "Curate your circle: choose three peers for monthly check-ins; practice direct asks and honest no’s.",
      ],
    },
    天相: {
      paragraphs: [
        "You’ve long been the steady hand in a shifting circle, peacemaker, bridge-builder, the one people call when they need fairness without flames. In this decade, that role sharpens. You crave harmony, yet you bristle at being taken for granted. You want to belong, but not at the price of your silence. There’s a private ledger you keep, who shows up, who only takes, and you’re tired of pretending it doesn’t exist.",
        "This cycle draws you into alliances, siblings’ stories, teams, boards, and peer networks where your name opens doors, and your boundaries keep them from swinging off the hinges. You’ll be asked to mediate, sponsor, co-sign, to lend your credibility and your calm. Done well, you become the trusted center who shapes agreements that actually hold. Done carelessly, you drift into polite resentment, triangulated dramas, and a reputation for reliability without reciprocation. The turning point is simple but brave: speak plainly, define roles, and make reciprocity non-negotiable.",
        "When you choose your alliances with courage, your influence compounds and your relationships become clean, generous, and steady. If you don’t, your kind heart frays. Decide what kind of ally you will be. This decade rewards clarity and punishes vagueness, let your yes be solid, your no be gracious, and your worth be unmistakable.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Map your circle this week: list top 12 peers/siblings/collaborators; mark who consistently gives, who only takes; choose 3 to deepen with and 3 to step back from.",
        "Before any collaboration, send a one-page memo: purpose, roles, decision rights, timelines, what support you will and won’t provide, and the exit terms. Get written agreement before starting.",
        "Say what you actually want in plain words: make one clear request per message, include a deadline, and specify what you need in return.",
        "Install a 24-hour pause before rescuing anyone. After the pause, ask: “What outcome do you want me to help create?” Offer one defined action with an end date instead of open-ended help.",
        "Diversify your alliances: join one cross-discipline group this quarter; attend three events; after each, follow up with three people within 48 hours and propose a concrete next step.",
        "Run a weekly 10-minute audit of favors and time: tag each commitment +, −, or neutral; drop one low-return obligation per month and reallocate that time to a high-value relationship or rest.",
      ],
    },
    武曲: {
      paragraphs: [
        "You’re the one who shows up when others stall: the sibling, colleague, or friend who carries the heavy box, negotiates the bill, fixes the mess. Under 武曲’s metal spine, you equate love with reliability and respect over sweetness. You speak straight, set high bars, and expect adults to act like adults. But the same blade that protects can cut: you absorb costs, lend without contracts, then resent the foggy gratitude. You rarely ask for help because you’d rather be the wall than lean on one. Loyalty matters, earned through sweat, not stories. People come to you in crisis; they don’t always stay when things are calm. So you build trust through doing, not talking, yet wonder why few truly stand shoulder to shoulder.",
        "In this decade, Wu Qu sits in 大兄: your arena is siblings, peers, partners-in-arms. The curriculum is forging a core crew through clarity, duty, and proof. You will sort companions by performance under pressure, not promises. Money, favors, and shared work become the crucible; vague ties will snap. Done well, you become the captain who builds an unshakable unit with clean rules and fierce mutual respect. Done poorly, you turn every room into a drill yard and end up alone with perfect standards. Choose structure over suspicion, contracts over guesswork, fairness over fury. This is a decisive cycle, use your strength to build alliances, not walls.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Map your circle into A/B/C tiers by reliability; invest 80% of your time with A-tier; set monthly work sessions.",
        "Put every loan, split bill, or shared purchase into writing (amount, due date, exit terms), even with siblings.",
        "State needs in five plain sentences; no sarcasm or hints in texts; confirm by asking, “Can you repeat the plan?”",
        "Before cutting someone off, wait 24 hours; deliver one fact-based talk with a boundary and a specific next step.",
        "Start one joint project to test teamwork (budget, roles, deadlines); run a weekly 30-minute stand-up with metrics.",
        "Practice receiving: request one concrete favor per week; accept help without apology; thank plainly to seal reciprocity.",
      ],
    },
    天梁: {
      paragraphs: [
        "You’re the one people call when the night feels too long. In a group, you quietly become the grown-up, the porch light that never burns out. You can’t help sensing where things are unfair or fraying, and your instinct is to shelter, mediate, make it right. Yet there’s a tug inside: protecting others gives you meaning, but you’re tired of being assigned the role of “responsible one.” You want companions, not dependents; equals, not projects. Some days you’re judge and shelter in the same breath; other days you lock the door and go silent to refill. It’s a strange mix, steady warmth and guarded distance, born from caring more than most and paying the bill for it.",
        "This decade asks you to architect your circle with intention. Tian LIang here draws older, steadier allies, and people seeking refuge. Your strength is calm authority: you de-escalate, you bring fairness, people listen when you speak plainly. Your lesson is boundary as structure. Shift from rescuer to steward: set terms, invite reciprocity, and measure loyalty by consistent action, not stories. Choose fewer, sturdier bonds. Put agreements on paper. Ask directly for what you need. Your fairness will build trust; your limits will keep it. If you stay in automatic saving mode, you become everyone’s insurance policy but no one’s equal, and fatigue turns into quiet bitterness. Let this be the decade you gather an honest council, and close the gate to those who only come for the roof, not the beams.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Run a 90-day friendship audit: list top 12 contacts; tag +/− energy; schedule three recalibration talks.",
        "Adopt a “no silent rescues” rule: ask what, by when, who else; state your limit and needed reciprocity.",
        "Hold a weekly council hour with two peers/mentors; exchange one concrete ask; record commitments in a shared note.",
        "For any group task, define roles, deadlines, and exit criteria in writing; reassign after two missed commitments.",
        "Use a 24-hour pause before money, housing, or emergency favors; cap amounts and document agreements.",
      ],
    },
    太阳: {
      paragraphs: [
        "People orbit you because you make rooms brighter. In groups, family threads, or team chats, you’re the steady signal: you clarify, coordinate, and calm storms. Yet there’s a private tug-of-war, part of you loves being the dependable one, while another part aches to be met, not managed. You want to lift others without being their power source; to be respected, not merely relied upon. With Tai Yang in Da Xiong, this decades spotlights peer relationships and sibling bonds: on  your light gathers people, opportunities, and rivalries alike. Warmth draws closeness, but also overdependence. Leadership brings respect, and sometimes envy. You can end up overfunctioning, then feeling invisible, the one who keeps the group alive while carrying quiet resentment.",
        "This decade asks for a shift: from rescuer to builder, from constant availability to clear architecture. Your sunlight is most powerful when angled through structure, roles, rhythms, and boundaries that protect both care and energy. Choose who gets your direct rays and who stands in the glow of your systems. Speak plainly about limits and expectations. Turn recurring crises into repeatable processes. Heal old sibling patterns by practicing adult fairness: no silent tally-keeping, no martyrdom. If you do, your circles become true alliances where your presence is appreciated and reciprocated. If you don’t, others will keep drafting you into their emergencies until your light flickers, proof that even a sun needs its own orbit.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set “office hours” for favors; redirect requests outside those windows without guilt.",
        "Pick your top 3-5 allies; schedule monthly one-on-ones and track mutual wins.",
        "Use a boundary script: “I can do X by Y; I cannot do Z.”",
        "Before rescuing, wait 24 hours; if still needed, offer a plan with roles and an end date.",
        "Host a quarterly gathering with a clear theme, agenda, and timebox; invite beyond your usual type.",
        "Audit group chats monthly; leave two draining threads and mute the rest for a week.",
      ],
    },
    七杀: {
      paragraphs: [
        "You carry the instinct to command and to cut. In friends/siblings this decade, you’re the one who tests loyalty and raises the standard. You crave a small, unbreakable unit that moves with you, yet you can’t tolerate hesitation or half-truths. You’ll call things as they are, prize competence over comfort, and trim connections that drain focus. Beneath the steel sits a tired softness: you want someone you can lean on without explaining. That tug, tribe vs lone-wolf, drives these years.",
        "Daily life shows it: a chat flares, your message lands like a blade; some step closer, others ghost. A sibling crisis hits; you take point, organize, pay the cost quietly. You magnetize intense peers, and equal egos. You become fixer, enforcer, protector, the one who steps into the fire first. The upside is real: fewer, stronger bonds and a crew that moves mountains. The risk, if unmanaged, is scorch marks where bridges used to be.",
        "This cycle can forge an elite pack, or leave you victorious and isolated. Power games surface; unspoken deals snap under stress. The medicine is structure, timing, and clean exits. Lead with clarity, not heat; test trust in increments, not ultimatums. Make room for loyalty to grow by allowing imperfection. Do this, and your blade becomes a shield for the right people; ignore it, and you’ll win arguments but face empty rooms.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Map your circle into three tiers (inner, working, social). Decide now what each tier gets: access, favors, money, secrets.",
        "Before cutting someone off or sending a blast message, wait 24 hours. Rewrite it twice, once blunt, once kind, then choose.",
        "For any friend/sibling collaboration, write a one-page agreement: roles, money flow, decision rights, deadlines, and a clean exit clause.",
        "Schedule quarterly 1:1s with your top three allies. Ask: needs, boundaries, what might break us. Confirm next steps in writing.",
        "Handle conflict privately first using fact-impact-request. No group-chat crossfire. If trust wobbles, run a 10% test before recommitting.",
      ],
    },
    天机: {
      paragraphs: [
        "You’ve always been the quiet barometer of your circles, the one who feels atmosphere changes first. In this decade, the realm of siblings, peers, and teammates lights up, and your mind becomes a switching station of stories and signals. You read subtext, connect dots, and often end up the strategist or mediator. Yet the more you see, the more you carry: mental ledgers of who gave, who took, who might tilt the balance. You want to help, to fine-tune the system, to keep everyone moving, but you also bristle at being taken for granted. You drift between closeness and caution, wondering when to speak and when to let silence do the work.",
        "With Tian Ji here, intelligence is your gift and your trap. Information can build clean alliances or sticky webs. This decade asks for an upgrade from clever maneuvering to transparent structure. Expect turnover: some old ties thin out; new collaborators appear in learning spaces, communities of practice, and cross-disciplinary projects. Test bonds with small missions before big commitments. Name roles, decisions, and boundaries aloud. When you lead, convene with agendas and exit rules. When you follow, get clarity before you pour effort. Your network becomes a living machine, keep it well-oiled with honesty, and it will move you far.",
        "The warning is plain: play chess with people’s hearts and you’ll lose queens, trust, time, and peace. Overthinking plus gossip equals crisis. If you don’t choose your circle, the noisiest will choose you. Walk this decade with straight lines: fewer whispers, more agreements. Your mind is sharp; let your relating be clean.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Before giving advice, ask: “Do you want a listener, ideas, or a fix?” Then stick to the role they choose.",
        "Address issues directly: speak to the person within 48 hours or drop it; no third-party venting.",
        "For any collaboration with friends, write a one-page agreement: goals, timeline, decision rights, and exit terms.",
        "Each quarter, meet three people outside your usual circle; join or start a small mastermind that meets monthly.",
        "Set a hard capacity: no more than two help-favors per week; schedule them and say no to the rest.",
        "Use a 24-hour pause before public call-outs or big group messages; when you want something, ask in one clear sentence, no hints.",
      ],
    },
    左辅: {
      paragraphs: [
        "People lean on you without needing to be asked. You’re the steady chair at the edge of the room, the one who remembers birthdays, threads the group chat, smooths the awkward silence. You make alliances feel safe. Yet some nights you wonder why the helpers don’t get helped, why your name is called only when something needs fixing. You want to be needed, yes, but also to be seen as an equal, not a utility. You prefer the side stage over the spotlight, but your presence sets the rhythm. The quiet tug-of-war lives inside you: keep carrying the circle, or put some weight down and risk disappointing those who have come to rely on your strength.",
        "This decade calls your people to you, not more people, but better ones. The theme is counsel, councils, and the power of well-chosen company. You are graduating from helpful hand to keystone, from fixer to strategist. Choose seats at tables where your judgment is prized and your time respected. Name your boundaries before others test them. With siblings, peers, and collaborators, your authority grows when your yes is clean and your no is kind. The right friends will match your steadiness, bring their own tools, and meet you on level ground. Stand upright and the right ones step closer; build the table, don’t carry every chair.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page “How to work with me” and share it with collaborators and friends.",
        "Before saying yes to a favor, wait 12 hours and ask: urgency, capacity, reciprocity.",
        "Set a monthly Ask Day: request two concrete helps you actually need, by date.",
        "Keep a reciprocity ledger; thank doers, and downgrade chronic takers without drama.",
        "Turn venting into action: end rants with one next step, one owner, one deadline.",
        "For sibling or peer conflicts, propose a decision-maker, a deadline, and an exit clause.",
      ],
    },
    右弼: {
      paragraphs: [
        "You’ve long been the quiet hinge that keeps doors from slamming. In group chats, family dinners, and team huddles, you sense tension early and step in before anyone names it. You smooth edges, fill awkward silences, translate between personalities. People thank you privately, then forget who made the gathering possible. You want closeness, but you also want rest. You crave being included, yet you dread being the default fixer. You say yes out of loyalty, then lie awake rehearsing the words you didn’t say. When you finally need help, your ask comes out as a hint, and you end up doing it yourself anyway.",
        "This decade, 右弼驻守Da Xiong turns acquaintances into an ecosystem. Helpers appear when you ask cleanly; doors open when you define the room. Your gift isn’t to cushion everyone’s fall, it’s to convene the right people, set the tone, and make cooperation feel easy. When you own that role, friendships become reciprocal instead of dependent. You stop auditioning for belonging and start choosing standards: clear agreements, fair rotations, honest timelines. With the right circle, your diplomacy scales; you influence outcomes without over-functioning. Being supportive no longer means being invisible.",
        "A gentle warning: rescuing creates dependency, and triangulating breeds quiet resentment. If you keep patching the same leaks, money, time, emotional labor, you’ll drain your reserves and teach others not to stand up. Choose quality over quantity. Prune kindly so healthier branches can grow. Say a clean yes or a clean no. Claim your chair at the table, and watch the brothers, sisters, and peers who truly value you step forward.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you want in plain words: “I need X by Y. Can you commit, yes or no?”",
        "Only mediate with consent from both sides and a joint call; otherwise, step out.",
        "Build a 4-6 person peer board; meet monthly for 60 minutes with a rotating agenda.",
        "Run an energy audit after hangouts: rate −2 to +2 and prune consistent negatives.",
        "Set a lending policy: no unsecured loans or open-ended favors; write terms or decline.",
        "Institute role rotation for events/projects; create a checklist and handover after each cycle.",
      ],
    },
    文曲: {
      paragraphs: [
        "You are the friend who can turn strangers into allies with a few careful sentences. Rooms loosen when you arrive; people tell you secrets they meant to keep. You hear the note behind the words, and you use your polish to smooth rough edges, often at your own expense. In this decade, you’ll feel the tug to be everyone’s bridge: introducing, translating, making peace. It flatters you and drains you. After the party, you replay messages, wondering what you promised, who you accidentally encouraged, whether your kindness sounded like consent. Your circle grows clever, cultured, and magnetic, yet you can feel like the host who never sits down to eat. Lines blur: friendship becomes collaboration, collaboration becomes obligation. You want to be chosen for your truth, not just your charm.",
        "Wen Qu in the Friends palace sharpens the power of language and networks. A single DM can unlock a room, or start a rumor that eats the room. Invitations multiply, as do comparisons and subtle rivalries. The way through is precise speech and clean boundaries: fewer people, deeper trust, clear asks. When you write what is real instead of what is pleasing, your circle becomes an orchestra; when you trade in flattery, you’re trapped in a hall of mirrors. Choose. If you don’t, indecision will choose for you, and it will spend your trust on your behalf.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Put every agreement in writing within 24 hours: a summary email with dates, deliverables, money.",
        "Refuse triangulation: if someone complains about a third party, pause and redirect them to speak directly.",
        "Use a capacity check before saying yes: look at your calendar, sleep on it, reply the next day.",
        "Host a monthly small-format salon (4-6 people) with a theme and one clear ask.",
        "When mixing friendship and money, use invoices or contracts; pay promptly; don’t keep silent ledgers.",
        "Say the want out loud: “I’m asking for X by Y date because Z,” then stop talking.",
      ],
    },
    文昌: {
      paragraphs: [
        "You’ve long been the one who finds the right words when everyone else tangles them. In family chats and group threads, your fingers hover, crafting the sentence that will calm tempers, clarify steps, save the day. You notice small misreads that become big fractures; you hear what wasn’t said and try to fill the gaps. But there’s a rub: being the explainer is heavy. You crave appreciation yet resent being taken for granted. You want harmony, but you’re tired of carrying it. You draft messages you never send, replay conversations in your head, and wonder if you’re helping or just managing others’ discomfort.",
        "This decade puts a highlighter on siblings, peers, and your wider circles. Doors open through conversations, referrals, co-writing, teaching, presenting. Your clarity can become currency. The gift here is elegant communication, turning confusion into clean lines. The risk is subtle: triangulation and gossip dressed up as “updating,” over-editing other people’s lives, and losing hours to careful wording while decisions wait. You’re meant to be a bridge, not a buffer; a scribe of agreements, not the emotional landfill for every group.",
        "Lean into the gift with a spine. Treat clarity as love, boundaries as respect. When you choose clean language and cleaner roles, relationships with siblings and peers mature, and your influence becomes unmistakable. This is a decade to be known for precise, humane words that move things forward, without sacrificing yourself in the process.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Use one channel per topic; name the thread and keep decisions there.",
        "After tough conversations, send a 3-line recap: decision, owner, deadline.",
        "Before mediating, get consent from both sides and set a 20-minute limit.",
        "Replace secondhand stories with direct contact: “Let’s loop them in now.”",
        "Pause 24 hours before sending any corrective message written in irritation.",
        "Build a monthly peer board of 3-5 trusted people; rotate agenda and capture notes.",
      ],
    },
  },
  大夫: {
    紫微: {
      paragraphs: [
        "You carry a quiet crown into every bond. You want a partner or ally you can respect, someone substantial enough to share the weight, not just a warm body beside your throne. So you plan the trip, tidy the numbers, hold the room together, and smile like it’s easy. Inside, the push-pull hums: “If I don’t lead, things wobble… but I’m tired of proving I deserve loyalty.” You crave to be chosen without audition, met with steadiness, not flattery. And yet your standards, so beautifully high, can harden into ceremony: the perfect answer, the right timing, the elegant gesture, or nothing. You sense the risk: ruling alone is safe, but lonely. The truth? Your dignity wants partnership, not attendants.",
        "This decade invites you to practice sovereign partnership. Zi Wei in Da Fu asks you to shape bonds like a statesperson: clear accords, calm timelines, respectful power-sharing. You’ll draw ambitious people, elder mentors, or status allies, worthy, if your pride doesn’t turn guidance into control. Your task is soft power: set the frame, then let others contribute their way. Choose respect over rescue, influence over interference, counsel over command. Structure the container so love and alliance can breathe, rituals, check-ins, decision lines, then step back. The reward is an equal standing beside you, not beneath you. Lead with warmth, and the right hands will reach for yours.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write 3 non-negotiables and 3 flex points for partnership; share them without speeches.",
        "Hold a weekly 30-minute “state of us” meeting: wins, friction, money, next week; one promise each.",
        "Ask for needs in one sentence starting with “I need …”; no hints, tests, or puzzles.",
        "Before correcting or optimizing someone’s method, wait 24 hours; if still needed, ask permission first.",
        "Map power-sharing: who decides what, spending limits, response times; document it and revisit quarterly.",
        "Host a quarterly small dinner or salon (6-8 people); follow up in 48 hours with one clear offer and one clear ask.",
      ],
    },
    天府: {
      paragraphs: [
        "You carry the keys, the passwords, the emergency cash. People come to you because you make chaos sit down and behave. You like being the steady bank, generous, discreet, in control, yet a quiet ache grows when stability turns into obligation. You crave orderly rooms, healthy ledgers, loyal circles; you also want to be looked after for once. The push-pull? You keep saying “I’ve got it” while part of you wonders who has you. Tian Fu in the Daifu seat makes you the household’s treasurer and the ward’s elder: protector, allocator, the one who decides what is safe enough.",
        "This decade asks you to move from caretaker to steward of systems. Not more errands, better containers. Your calm, conservative eye can build institutions that outlast your mood and the market. Yet comfort can calcify. The shadow here is hoarding control, cushioning everyone until they forget how to stand, hiding inside procedures when a clean yes/no would serve. The medicine is dignified boundaries and generous structure: you don’t rescue; you design. Think like a doctor-official: diagnose patterns, write protocols, train hands, and release outcomes.",
        "If you keep patching what needs rebuilding, resentment will sour your kindness and your body will signal the bill. Let this be your alarm: update the vault, or become trapped guarding it. Choose legacy over control and you’ll carry less while protecting more.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page operating manual for your world; delegate 20% of recurring tasks.",
        "Before fixing anything, wait 48 hours and design a repeatable process that survives you.",
        "Set a weekly 'no-rescue' block: coach with questions instead of taking work back.",
        "Quarterly, drop two low-impact obligations; redirect that time to training or rest.",
        "State boundaries in cash-and-time terms: 'I can fund this; I won’t run it.'",
        "Build a bench: mentor two successors, document access, and test a 30-day you-away drill.",
      ],
    },
    破军: {
      paragraphs: [
        "You’ve carried your body like a battlefield, charging hard, patching yourself up, then charging again. You run on adrenaline until something snaps: the clenched jaw at midnight, the skipped meals, the sudden vow to start over tomorrow. You’re proud of your ability to burn bridges with bad habits, but sometimes you torch the bridge you still need. With Po Jun in Da Fu for this decade, your body becomes a blunt truth-teller. Expect sharp endings and beginnings in health: routines dropped overnight, treatments switched decisively, dramatic breakthroughs after clean cuts. There may be brushes with surgery, scars earned for the right reasons, or allergies and intolerances that force a reset. This isn’t subtle energy. It wants you to cut what corrodes and rebuild on bedrock.",
        "This cycle isn’t punishment; it’s precision. Po Jun is the blade, dangerous when reckless, healing when aimed. The risks are clear: overtraining disguised as discipline, crash cleanses that wreck your gut, stimulants to bulldoze fatigue, risky speed when angry or numb. Accidents happen when you multitask a moving body. The tension is simple and serious: if you don’t choose the cut, the cut chooses you. Decide what ends, and you decide what begins.",
        "Turn this decade into surgery, not wreckage. Build short, intense pushes with planned recovery. Track the basics (sleep, pain, energy, digestion) and adjust quickly. Keep food simple, sleep sacred, and boundaries sharp around screens, alcohol, and work. Partner with professionals you trust, ask direct questions, and prepare for procedures with care. Done this way, you’ll feel lighter, cleaner, and steadier, fortified by scars that tell the story of wise decisions.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Get baseline labs (CBC, CMP, lipids, A1C, thyroid, ferritin) and repeat yearly.",
        "Train in 6-week cycles; schedule deloads; stop when form breaks; no max testing when stressed.",
        "Set non-negotiables: sleep window, alcohol cap, caffeine cutoff, phone off 60 minutes before bed.",
        "If a procedure is suggested, get a second opinion within 72 hours and preplan recovery logistics.",
        "Use a surge protocol: brisk 10-minute walk + 4-7-8 breathing; no driving/texting; delay big decisions 24 hours.",
        "Do a 60-day food reset: cut ultra-processed foods and added sugar; hydrate; prioritize protein and bitter greens.",
      ],
    },
    廉贞: {
      paragraphs: [
        "You want a bond that can handle truth and heat. With Lian Zhen in Da Fu this decade, you enter rooms like a negotiator: reading power lines, testing promises, rewriting rules. You are captivating and relentless. You crave loyalty yet hate feeling owned; you swing between wanting to merge and needing a locked door. When things feel shaky, you tighten standards, ask harder questions, sometimes even set quiet tests, for proof that the other is worthy. Beneath it all is a steady wish: to be met by an equal who won’t flinch when you show both your full force and your tender parts.",
        "This cycle asks you to turn edge into stewardship, not surveillance. You are a reformer in relationships: meant to upgrade the contract, clean the rot, and protect what matters. Do it in daylight. Name the deal, the price, and the timelines. If suspicion becomes your religion, the court empties; you win arguments and lose allies. Use courage to propose structure, roles, rights, exits. Some ties will end; let endings be elegant: clear, brief, kind. Choose partners who like accountability. Power used cleanly becomes safety; power used to punish breeds quiet revenge. Keep waging little wars, and you’ll win the castle but lose the home.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page partnership charter: what you need, what you offer, dealbreakers, and a review date; revisit every 3 months.",
        "Say what you actually want in plain words, no tests, no hints; start requests with “I need X by Y because Z.”",
        "Before issuing ultimatums or cutting someone off, wait 24 hours; discuss only after both are calm and fed.",
        "Set a conflict protocol: a time-out word, a 20-minute break, then return with one concrete proposal each.",
        "Stop triangulation: if you’re upset, speak to the person directly; limit outside venting to one trusted confidant.",
        "If an ending must happen, set a clear end-date, settle money/logistics within a week, and no backchannel contact after.",
      ],
    },
    太阴: {
      paragraphs: [
        "You are the one people seek in the quiet hours, the lamplight friend, the steady pulse in a room of frayed nerves. You notice what isn’t said, patch leaks no one else sees, and keep the peace by carrying more than your share. Yet inside, a tide pulls two ways: the instinct to soothe, and the bone-deep wish to be seen and spared. You crave soft spaces, order, and safety; you also ache to be taken seriously, not just appreciated. You’d rather do it yourself than watch things fall apart, but the price is a private exhaustion, a moon-bright loneliness. You absorb others’ storms and then lie awake, rehearsing how to ask for what you really need. You’re loyal, discreet, the confidante and the fixer; but your kindness gets mistaken for capacity. When praise comes, it warms; when entitlement follows, it stings.",
        "This decade, Tao Yin in Da Fu matures your medicine into stature. Care becomes craft, and craft becomes structure: policies, protocols, and quiet authority that prevent fires before they start. Your soft power can shape teams, budgets, and well-being; nights and behind-the-scenes work are unusually fertile. Homes, clinics, finance, counseling, design, logistics, any field that shelters others can become your harbor. But there’s a cost to being everyone’s safe place: blurred lines, stalled ambitions, and resentment disguised as calm. The lesson is not to harden, but to steward. Name the terms of your labor, monetize the value of your steadiness, and train others instead of rescuing them. If you don’t set the tide, someone else will. Choose your waters, and let the rest drift away.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you actually want in plain words; include your limits and the consequence if crossed.",
        "Before accepting a caretaking task, pause 24 hours; confirm time, energy, and payment or exchange.",
        "Set a night-friendly rhythm: do deep work after dusk, enforce a midnight cutoff, and a phone-free wind-down.",
        "Turn intuition into systems: document your best practices, delegate one routine task monthly, audit quarterly.",
        "Tie care to value: set a clear fee or workload cap, and renegotiate using data, not apology.",
      ],
    },
    贪狼: {
      paragraphs: [
        "You’ve always felt the pull to heal and the pull to indulge, both at once. In you, Tan Lang is not just desire; it’s the talent to find the door, charm the gatekeeper, and get someone the remedy they crave. In the Da Fu seat, you become the one people text at midnight for a fix, an appointment, an introduction, a soothing word, and part of you loves the power and intimacy of being needed. Yet the same appetite that reads others so well also hunts for your own quick relief: another late night, another upgrade, another “just this once.” You move through corridors where secrets are traded softly, balancing care with temptation, results with rush. It’s intoxicating, and it works, until your body and boundaries start to whisper back.",
        "This decade turns up your magnetism with experts, healers, and institutions. You’ll broker deals between desire and remedy, diagnose patterns fast, and persuade doors to open. Used cleanly, that’s medicine: you humanize systems, soothe with beauty, and make reforms real. The traps are subtle. Overpromising miracles. Letting gratitude become favors. Mixing flirtation into care. Numbing with sugar, screens, or stimulants because recovery feels slower than conquest. You may accumulate status symbols, certificates, contacts, exclusive access, yet feel oddly un-rested. Tan Lang thrives on sensation; without rhythm and ethics, it will spend your credit, health, money, trust, faster than you can earn it.",
        "Your edge is choice, not charm. If you set dosage, pace, and price, your appetites become compass instead of captor. If you don’t, medicine turns to poison and reputation frays where no one can see. Treat this as a training arc: build rituals, name limits, and make pleasure honest. Do it now, while doors are still opening. The right structure won’t cage you, it will let your hunger heal the world without hollowing you out.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Define three non-negotiable boundaries for help: no after-hours texts; no loans; no flirty exchanges with clients/patients.",
        "Before saying yes, run the “relief or result?” test; wait 48 hours on big asks.",
        "Schedule office hours for advice; price sessions or cap at two favors per week.",
        "Do a 30-day reset each quarter: no alcohol, no late-night screens, lights out by 11, morning sunlight daily.",
        "Learn one regulated modality that blends care and structure (e.g., somatics with certification); commit to 100 hours of supervised practice.",
        "Install friction on impulses: delete payment autofill, unfollow three temptations, and use a 72-hour rule for purchases over $200.",
      ],
    },
    巨门: {
      paragraphs: [
        "In this decade, your mouth is both lamp and scalpel. People come to you like patients after midnight, carrying tangled stories, half-truths, and aches they cannot name. You hear the grit beneath the gloss. You can taste what’s off before tests return: the unsaid, the misaligned, the thing that needs cutting out. Yet you also know the cost, how a single blunt sentence can nick trust, how your own body tightens when you swallow words to keep the peace. You oscillate between speaking the hard cure and letting silence take the case, between nourishing others and forgetting to feed yourself. Suspicious of easy promises, loyal to evidence, you crave clarity that cleans the air, and then feel the sting of how sharp you had to be to get it.",
        "Ju Men in Da Fu asks you to refine your instrument: make your words medicinal, your ethics unambiguous, your boundaries clean. Let your skepticism become discernment, not cynicism. Build procedures that protect both you and those you serve: transparent fees, notes that capture context, pauses that cool the heat of debate. Tend the body that carries your voice, throat, jaw, gut, so counsel doesn’t curdle into acid. If you rush, argue, or overextend, this decade turns litigious and inflamed: complaints, misquotes, reflux, sleepless parsing of conversations. But if you slow the cut, test your conclusions, and practice clean endings, you step into the respect reserved for those whose words heal without wounding.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "State your conclusion first in one plain sentence, then add nuance; avoid hedging or long preambles that invite confusion.",
        "Install a 24-hour rule before sending critical emails, reports, or resignation notes; review once with a trusted peer for tone and evidence.",
        "Set clear availability: define office hours, no after-hours advice by text, and use templated consent/summary notes after each consult.",
        "Keep a 30-day log of food, sleep, conflict triggers, and symptoms; remove one clear trigger and add one buffer (walk after meals, phone-free hour).",
        "Before debating, ask three questions that could disprove your view; if one stands, revise the claim or say, “I need more data, let’s test.”",
        "When you must decline a client/case, do it cleanly: one-sentence reason, one referral option, and a firm end date, no lingering back-and-forth.",
      ],
    },
    天同: {
      paragraphs: [
        "Your gift is to soften hard edges. People confide in you in hallways, ask for “just a minute,” and somehow you are the one who stays late, fixes small messes, and keeps the room gentle. Yet you feel the tug-of-war inside: you want to be kind, but not consumed; helpful, but not invisible. You avoid conflict because harmony is your oxygen, then carry quiet resentment when others mistake your softness for endless availability. Plans you promised yourself drift to the back burner while you tend everyone else’s flames.",
        "This decade asks you to evolve from comforter to calm professional, the warm hand that also sets the standard. Tian Tong’s sweetness becomes steadiness when paired with structure: triage before you volunteer, name the plan out loud, write simple protocols that stop chaos from landing on your desk. Empathy doesn’t mean taking over; it means making sure care continues without you absorbing every burden. Some will test your boundaries, banking on your gentle nature. That is your training ground. Each time you hold a clear line kindly, you teach people how to treat you and you conserve the tenderness that makes you exceptional.",
        "Expect chances to mentor, redesign a workflow, run a service, or become the trusted counselor whose clarity heals as much as your compassion. If you lean into systems and straight talk, doors open and your energy returns. If you drift into pleasing and postponing, exhaustion and bitterness stalk the edges. Choose to be the warm professional: fewer apologies, more procedures that protect good care. Keep the heart soft and the schedule sharp, done this way, this decade restores your faith in work and in yourself.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write and rehearse a boundary script: “Here’s what I can do today; here’s what I cannot. Let’s schedule the rest for [time].” Use it every time someone adds a “quick favor.”",
        "Set a hard cap on extras: allow a maximum of two unplanned favors per week. Track them. After that, decline politely with your script, no explanations beyond one sentence.",
        "Install a weekly “rounds and resets” block (90 minutes) to close loops: reply, file notes, update trackers. Also schedule two 10-minute quiet breaks daily (no phone) to reset your nervous system.",
        "Adopt a decision rule: if options are similar, choose the one that simplifies follow-up for you. For non-critical choices, impose a 24-hour deadline to prevent drift.",
        "Delegate two recurring tasks this month. Write a one-page SOP for each, hand it off, and hold a 15-minute weekly check-in to support without taking it back.",
        "When resentment sparks, address it within 72 hours using “facts-impact-request”: state what happened, how it affected care or time, and the specific change you need.",
      ],
    },
    天相: {
      paragraphs: [
        "You’ve long been the steady hand, the one others trust in messy moments. You sense the currents, weigh every angle, speak with calm authority, and somehow end up responsible for keeping the peace. Underneath, a tug-of-war: the urge to support versus the ache to be seen and protected yourself. You hold high standards yet swallow irritation to avoid conflict; you crave fairness yet fear the fallout of drawing a hard line. People mistake your grace for endless capacity, and your patience for consent. You know that isn’t true.",
        "These ten years awaken your Tian Xiang nature in the Da Fu realm: partnership, duty, and public trust. You are called to be arbiter and architect, less rescuer, more rule-setter. The path opens when your kindness is backed by boundaries, when favors become agreements, and when you decide instead of circling options indefinitely. If you keep smoothing everything, you’ll carry blame without real power; if you codify expectations and act on them, your influence becomes undeniable. The choice is binary now: govern your commitments, or be governed by them. Move first.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write your five non-negotiables for partnerships; share them and revisit quarterly.",
        "Use a 72-hour decision window for big choices; decide, document, and inform stakeholders.",
        "Convert recurring help into clear agreements: scope, timelines, compensation, and exit clauses.",
        "Schedule monthly governance check-ins with key partners; track money, workload, and boundaries.",
        "Practice a three-sentence no for out-of-scope requests; offer one alternative, not rescue.",
        "Keep a risk and responsibility log; when stakes rise, escalate early and in writing.",
      ],
    },
    武曲: {
      paragraphs: [
        "You’ve spent years being the quiet backbone, the one who closes the spreadsheet, signs the form, keeps the lights on. With Wu Qu in your bones, your tenderness wears armor: you show love by carrying weight, counting every dollar, standing guard at the gate. People rely on your competence, and it’s both pride and burden. You want control because you care; you keep your circle tight because shortcuts are expensive. Yet part of you wonders who holds you when you’re the holder of all. You mistrust grand speeches; you trust numbers, signatures, and results.",
        "This decade, the Da Fu palace pulls you into the world of officials, experts, and institutional corridors. Gatekeepers learn your name; advisors seek your clarity; decisions get routed through you. You are asked to translate vision into structure ,  budgets, contracts, protocols, care plans. Your steel is needed, but it only shines when tempered with humanity. The growth edge is alliance: moving from lone enforcer to respected steward. Choose patrons and professionals wisely. Your judgment can elevate a household or fortify a business for the long haul.",
        "The reward is lasting authority; the hazard is turning every bond into a transaction or cutting too clean, too fast. What you sign, and what you sever, will echo for years. Keep the blade sharp, but sheathe it until you’ve seen the full board. If you build with patience and clean lines, this cycle becomes your dynasty; if you act in secrecy or hurry, it becomes a cold fortress. Seek counsel before the decisive strokes ,  not because you’re unsure, but because you’re building something that must outlive your mood.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Assemble a council: accountant, lawyer, physician, mentor. Hold quarterly 60-minute reviews with agendas.",
        "Convert promises to paper: send 24-hour recap emails; set deadlines; attach draft contracts for signature.",
        "Set a capital rule: any spend/commit/termination above [amount] = 24-hour hold + one outside opinion.",
        "Use 'steel then silk': state number/decision first, then brief context and care.",
        "Win gatekeepers: weekly check-ins with assistants/admins; confirm next steps and give needed documents early.",
        "Protect the body: strength-train 3x/week; annual labs; pain >2 weeks? See a specialist, no delay.",
      ],
    },
    天梁: {
      paragraphs: [
        "You’ve long been the person who stands quietly between chaos and people, taking late calls, catching the missing form, translating rules without shaming. In this decade, the Da Fu palace lights up that caretaker-advocate in you. Tian Liang here makes you protective, principled, almost parental with teams, clients, patients, or community members. You feel where a system leaks and where a human needs warmth first. The tug is real: your heart wants to soothe; your mind insists on standards. You hold both, often at the cost of your own rest. Others rely on your steadiness, and you rarely ask who steadies you.",
        "This cycle wants you not just patching holes, but authoring the policy, setting the boundary, modeling the ethic. Your name will be called when fairness is needed; use that visibility to redesign flows, train others, and make compassion repeatable. The shadow here is martyrdom and moral rigidity. If you keep absorbing everyone’s crisis without changing the structure, fatigue turns to resentment, and your “protector” reputation flips into “obstructionist.” Treat this as a turning point: move from rescuer to architect, or the decade will drain you faster than you can heal it.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page scope for your role; share it. When requests fall outside it, say, “I can’t own this, but here are your options,” and point to the right channel.",
        "Hold a weekly triage hour with three columns: crisis today, fix the process, listen/support; route each request to one column and act accordingly.",
        "Limit rescue work to 20% of your week; block two 90-minute sessions to build checklists, templates, or training that prevent repeat problems.",
        "Create a referral map of five allies (legal, clinical, finance, mental health, community). Use warm handoffs and track outcomes in a simple log.",
        "Document key decisions in five sentences: issue, risk, decision, why, next step. Store them in a shared folder so you aren’t the bottleneck.",
        "Ask for mandate before responsibility: “If I’m accountable for X, I need Y authority and Z resources.” If refused, narrow your promise or exit the task.",
      ],
    },
    太阳: {
      paragraphs: [
        "You were built to stand where decisions are made, to bring light into rooms thick with jargon and closed doors. In this decade, your Sun steps into the dafu aisle: service, stewardship, the role of the competent grown-up. You feel the tug-of-war: wanting to quietly make systems work while also aching to be recognized as the one who fixed them. You are generous to a fault, answering every call, carrying other people’s burdens, and resenting that they expect you to. You want clean lines, fair rules, daylight deals, yet you fear becoming stern or bureaucratic.",
        "People seek you when they need an advocate, a translator between ordinary life and professionals: doctors, managers, officials. Your calendar fills with consultations, policy drafts, approvals. Your words start turning into procedures. When you are warm, others heal and stabilize; when you glare, they scramble. Nights deplete you; mornings return your clarity. Old authority figures (bosses, elders, father-echoes) re-enter your story, not to dominate you but to test how you carry your own authority without burning others.",
        "This cycle wants you to lead in daylight, not martyr yourself after hours. Build transparent standards, act on facts, and let your boundaries be as bright as your ideals. The more specific your asks, the faster doors open. Choose the causes where your light can sustain, not scorch. If you try to save everyone, Tai Yang goes dim; if you choose well and shine steadily, the whole corridor changes color.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Block the first 90 minutes of each morning for sunlight and deep work; stop late-night rescue missions.",
        "Before any meeting with institutions, write a one-page brief: goal, facts, the exact ask, and your no-go lines.",
        "Set weekly office hours for helping others; outside that window, say, I can help on Thursday at 3.",
        "When angered by unfairness, draft a concrete proposal within 48 hours (timeline, responsible owner, next step).",
        "Speak in plain words; replace abstractions with numbers, dates, names, and a clear yes or no.",
        "Publish a monthly what we changed note to make impact visible and attract allies, not just more requests.",
      ],
    },
    七杀: {
      paragraphs: [
        "You’re built for decisive moves and clean lines. Yet in matters of formal bonds ,  marriage, committed partnerships, alliances ,  you keep finding yourself both protector and executioner. You long for a counterpart who can stand shoulder to shoulder, but when respect slips or ambiguity creeps in, your finger hovers over the red switch. You test loyalty in quiet ways, you notice every crack, and you’d rather end it than let rot spread. People read you as intense because you are; underneath is a fierce wish to build something unbreakable, not merely pleasant.",
        "Over this decade, Qi Sha in Da Fu turns relationships into a forge. Expect upgrades: some ties will be trimmed, others reforged at higher standards. This is an opening for a braver love and cleaner contracts, if you bring discipline to your power. Your gift is swift clarity; your risk is collateral damage from impatient cuts. Lead with explicit terms, steady follow-through, and allow softness without surrendering backbone. Do that, and you attract equals who relish your strength. Ignore it, and you’ll win every argument but lose the war ,  ending up respected, alone, and tired.",
        "This cycle rewards courage paired with restraint. Think commander, not berserker: plan the campaign, choose your battles, and keep your word like steel. When the urge to dominate rises, redirect it into stewardship ,  protecting the bond, not controlling the person. The edge you carry is medicine when it cuts away decay, poison when it cuts the living. Learn the difference, and this decade will crown you with a partnership you respect.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write your non-negotiables and your offers; share them before commitment talks.",
        "Replace tests with requests: say I need X by Y because Z, and ask for a clear yes or no.",
        "Use a 72-hour rule before ending a bond; verify facts and consult one trusted outsider.",
        "Run a quarterly commitment audit of your top five relationships; schedule renegotiation meetings.",
        "Build a shared mission with your partner or ally: one project, weekly check-ins, clear roles.",
        "Put terms in writing (money, timelines, exit clauses); stop assuming loyalty equals clarity.",
      ],
    },
    天机: {
      paragraphs: [
        "This decade, your body feels like a dashboard you can’t stop reading. You notice micro-shifts, sleep running light, digestion temperamental, a headache that migrates then vanishes. You tweak food, timing, pillows, routines. You research at midnight, save protocols, begin three, finish one. Part of you loves the puzzle; part of you is tired of being your own case manager. You crave a clean answer, yet you change too many variables to see the pattern. The mind spins; the nervous system echoes it back.",
        "With Tian Ji in Da Fu, the medicine is not more panic or more hacks, it’s design. Treat yourself like a thoughtful experiment, not a crisis. Your sensitivity is an antenna, not an enemy; give it rhythm and it will reward you with steadier energy, clearer signals, and fewer flares. Choose guides who think in hypotheses and steps. Build feedback loops you can trust. If you keep guessing and switching, you’ll miss the signal, and exhaustion will collect its debt. The urgency now is to trade chaos for structure while your body is still quick to respond.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Pick one health focus per quarter (e.g., sleep efficiency). Run a 4-week trial, change one lever, and review results before adding anything else.",
        "Set a daily base: consistent wake time, protein-forward breakfast, 10-minute post-meal walk, hydration target, and screens off 60 minutes before bed.",
        "Choose a lead clinician. Bring a one-page timeline and specific questions. Ask for a stepwise plan and book a 12-week follow-up; seek a second opinion if no progress.",
        "Limit research. Choose two reliable sources, set a 20-minute timer, and turn each worry into one written question to ask a professional.",
        "Protect your neck/shoulders. Every hour: stand, roll shoulders, chin tucks, slow exhale. Adjust chair and screen to eye level this week.",
        "When anxiety spikes: do 4-4-6 breathing for two minutes, warm your hands, then take the smallest next action (book, prep, or step outside).",
      ],
    },
    左辅: {
      paragraphs: [
        "Your hidden truth: you are the steady pair of hands others lean on, the quiet fixer who makes messy situations orderly. People text you at strange hours because you know what to do. You notice what is off by a millimeter and correct it without applause. This gives you a healer's weight, the unofficial doctor of broken systems and tired hearts. Yet inside there is a rub: being indispensable but unnamed, caring for everyone while your own body whispers through tight shoulders, shallow sleep, and the thought, Who takes care of the carer?",
        "This decade pulls that trait into the open. The room needs your calm authority, not just your labor. Institutions, licenses, and standards become your bridge to influence; doors open when you bring method, checklists, and ethics. You may be asked to stabilize failing teams, inherit difficult cases, or advise leaders who finally listen when you speak plainly. Expect more audits and accountability. If you absorb chaos without boundaries, your system will protest with fatigue, gut tension, or migraines. But when you claim authorship of the process, your steadiness becomes the backbone others trust.",
        "The invitation is to step from helper into steward. Name your scope before you serve. Trade rescue for structure. Build frameworks that outlast you, and insist on the authority that matches your responsibility. Invest in one credential or affiliation that signals your standard to the world. With clear limits and rituals of recovery, your service will heal without hollowing you out. If you refuse this upgrade, you risk becoming the exhausted ghost behind everyone else's success.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Before saying yes, wait 6 hours; accept only with written scope and end date.",
        "Draft a one-page standard-of-care for your work; use it on every project.",
        "Ask for title, budget, or decision rights whenever responsibility increases.",
        "Reserve a weekly two-hour admin block for documentation, checklists, and follow-ups.",
        "Schedule quarterly health maintenance: labs, sleep review, bodywork; treat recovery as non-negotiable.",
      ],
    },
    右弼: {
      paragraphs: [
        "You’ve spent years being the steady right hand, the person leaders call when tempers flare, timelines slip, and nobody wants to say the hard thing. You read rooms like sheet music, catch what’s unsaid, and stitch people back together. The push-pull is real: you want to be recognized for your judgment, yet you bristle at self-promotion. You carry pride in being the calm fixer, but some nights you feel invisible, substituted in for courage others won’t show. You keep the ship moving, drafting the emails, smoothing the egos, taking the late calls. And while they sleep, you keep watch.",
        "With Zuo Fu in 大夫, this decade asks you to turn influence into mandate. Your gift is alliance, making the powerful work better together, but the trap is being everyone’s buffer. Here, sponsorship matters more than popularity; your counsel earns its price only when it’s tied to clear authority, ownership, and your name on the outcome. Expect doors to open through introductions and quiet endorsements; expect more crises that test your poise. Say yes to complex problems, but only with decision rights and a clean scope. Midway through the cycle, you’ll be asked to step from fixer to architect: not louder, just clearer, braver, more boundaried. Choose whose weight you carry. Choose how you’re measured. This is the decade you stop borrowing authority and claim it with steady hands.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "State terms upfront: role, decision rights, and credit before accepting a “rescue” project.",
        "Turn every vague favor into a written scope with deadlines and a single accountable owner.",
        "Use “no + path”: decline misaligned asks, then propose a focused alternative or handoff.",
        "Track wins monthly; share a one-page impact memo with your sponsor and keep receipts.",
        "Speak in the first 10 minutes of key meetings: name the decision and your recommendation.",
        "Before firefighting, ask three questions: Who owns it? What’s the deadline? What can I decide?",
      ],
    },
    文昌: {
      paragraphs: [
        "Quietly, you’ve become the person others call when words must be exact and consequences are real. Wenchang in the Da Fu palace turns your mind into a clean, bright clinic: instruments lined up, every sentence sterilized, every comma considered. You can hear the pulse of a room and translate it into policy, instructions, prescriptions of language. Yet the pull is double: the need to be precise versus the mess of human need; the urge to fix everything with a document, while sensing that some knots untie only in presence and courage. You feel the weight of signatures, the late-night revisions, the fear of a small error rippling wide. Beneath it all is a vow: let my words serve, not just impress.",
        "This decade asks you to step fully into trusted advisor and ethical scribe, shaping decisions, records, and remedies that actually help. Your talent sharpens systems, cleans up chaos, and gives people a way forward. The pitfalls are real: perfection that postpones action, hiding behind memos to avoid difficult conversations, becoming the perpetual fixer who absorbs everyone’s urgency. Choose contact over control. Write the order, then walk the ward; speak plainly to power; fold compassion into structure. Pair your clean logic with lived reality and you’ll carry influence without heaviness. When you do, your pen becomes a scalpel that heals, and your name quietly stands behind outcomes that spare others unnecessary pain.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Publish at 70% clarity: ship the first draft within 48 hours, then schedule two revisions.",
        "Keep a Decisions Log: date, stakeholders, options, rationale, expected result; review monthly.",
        "For every memo, add a one-sentence plain summary and three concrete next steps.",
        "Block weekly office hours (60 minutes) to decide live with stakeholders and cut email loops.",
        "Before accepting fixer requests, write scope, boundaries, and turnaround; get agreement in writing.",
        "Spend two hours weekly shadowing frontline work to test policies against real conditions.",
      ],
    },
    文曲: {
      paragraphs: [
        "You’ve always moved between lyric and law: the one who can tune a message until it sings, who reads a room before anyone speaks. People confide in you; leaders ask you to 'make it sound right'. Yet a quiet ache runs beneath the polish ,  the fear that your finesse dilutes your truth, that pleasing others steals your own line. You crave the dignity of being a principled counselor, not just a charming mouthpiece, but the habit of smoothing edges keeps your real stance half-buried.",
        "With Wen Qu seated in Da Fu this decade, corridors open where elegance equals access. Your pen, deck, or brief can unlock doors; dinners, panels, and memos become the places you shape outcomes. You’ll translate ambition into policy, contracts, or brand narratives. The price is spine. Charm without center curdles into manipulation; empathy without boundary invites misuse. Your power grows when you state plain facts, set terms, and let silence carry weight. Measure yourself by decisions made and results delivered, not the applause of a beautifully phrased maybe.",
        "The lure will be soft favors, private whispers, and blurred lines ,  especially where romance or prestige meets work. Choose daylight over intrigue. Fewer, cleaner commitments now protect the reputation you’ll live with later. If you ignore this, the decade ends shining on the surface and scorched underneath.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page code of conduct; keep it visible; use it to accept or refuse requests.",
        "After every key conversation, email a summary with decisions, owners, and deadlines within 24 hours.",
        'Replace hints with one clear sentence: "Here is what I can do, by when, on what terms."',
        "Schedule two weekly deep-work blocks to produce tangible output; no meetings, phone off, timer on, committed.",
        "Keep relationships bright-line: if attraction crosses professional lanes, formalize the relationship or step back completely.",
      ],
    },
  },
  大子: {
    紫微: {
      paragraphs: [
        "You carry a regal softness: the urge to lift others up while keeping your hand on the helm. With the young, the tender, and the things you create, you feel a tug-of-war, protect them, perfect them, yet let them breathe. You can be the late-night fixer of school projects or product drafts, the one who quietly rewrites a caption, rescues a deadline, makes it all shine. But beneath the polish is a heart that aches to be a warm harbor, not a storm. You want to be admired for your standards and loved for your care, and you suspect you can’t have both.",
        "This decade turns the lights toward your legacy: children, students, audiences, and the works you bring into the world. They will look to you with expectant eyes, and your authority will be felt, gentle, if you choose it. Your growth is in letting what you love show you who it is, while you provide the trellis it can climb. Romance may orbit talk of family, creative collaboration, or the future you’re building. Measure success not by how perfectly they mirror you, but by how much they grow, even past you. Say yes to being the wise steward: build the table, set the tone, and let your creations and your people take their seat.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Schedule one weekly hour of unedited creation with your child/team/self; no fixing or feedback until it ends.",
        "Write a 5-sentence family/creative charter (values, roles, conflict steps); post it and use it in heated moments.",
        "Use “Coach, don’t grab”: before taking over a task, ask 3 guiding questions and offer 1 clear choice.",
        "Name one legacy project to complete in 12 months; set monthly milestones and a public launch date now.",
        "State your desires early in dating or partnership (family, mentoring, co-creation) within the first three deep talks.",
        "Before disciplining, wait 20 minutes; deliver one boundary and one repair path, then follow up 24 hours later.",
      ],
    },
    破军: {
      paragraphs: [
        "You’ve lived with a quiet restlessness that looks like bravery from the outside and feels like pressure from the inside. When something stops growing, your hand twitches toward the breaker switch. In this decade, Po Jun sits in Da Zi ,  the midnight chamber where endings incubate beginnings. You will sense the old scaffolding loosening: titles that once fit itch, rooms you outgrew shrink around you. People might call you reckless; you’ll call it oxygen. The truth: you break things not to make noise, but to make space.",
        "Expect strong pulls toward decisive exits and radical redesigns: rebrand your work, move locations, pivot industries, reset a relationship dynamic. Crisis may find you, and you’ll be unusually capable in it ,  clear, fast, unsentimental. The cost is temptation toward scorched earth: cutting bonds that didn’t need to be severed, tossing assets you could have repurposed. Money can swing; politics intensify; younger people or projects under your care mirror your extremes ,  they thrive on your courage but bruise from your impatience.",
        "This is a builder’s decade disguised as demolition. If you swing the hammer without a blueprint, you’ll stand in impressive ruins with nowhere to sleep. Draw plans, pace the tear-down, and let your reinvention hold.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Make a Demolition vs. Foundation list: what ends now; what must be protected, reused, or delegated. Review monthly.",
        "Use a 72-hour rule for irreversible choices (quit, divorce, sell). Tell two advisors, write the plan, then act.",
        "Build a 9-12 month runway. Cap downside: set stop-loss thresholds per project and predefine your exit conditions.",
        "Prototype before burning bridges: run a 6-week pilot with clear success metrics and budget; decide go/kill on day 42.",
        "Practice clean exits: one meeting, one page handover, no blame, exact dates. Then block extended post-exit contact.",
        "Say boundaries out loud. “I’m no longer doing X. I will do Y until Z date.” Repeat, calmly, without footnotes.",
      ],
    },
    天府: {
      paragraphs: [
        "You carry people quietly: you stock the pantry, keep the lights on, remember birthdays, and make hard work look easy. You are generous and careful at once, counting coins so others can dream, building a safe room so they can be brave. Yet here’s the rub: you want to give freely but also guard what took years to earn; you long to be soft but feel responsible to stay firm. You crave appreciation, then wave it off with a nod, pretending you don’t need it. You listen, plan, and store, then sometimes feel heavy, as if the vault you keep for everyone is also a vault around your own heart.",
        "This decade asks you to become the steward, not the savior. What ripens now is legacy: children, protégés, projects and property that carry your name when you’re not in the room. Your gifts are structure, patience, and wise provisioning; your traps are overprotection, micromanaging, and buying peace with comforts that dull your edge. Build containers that teach responsibility, not dependence. Let others carry weight and earn their share of the story you’re writing together. Choose stewardship over control, and this will be the decade your quiet strength becomes an enduring legacy.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Run a quarterly stewardship meeting with those you support: set goals, assign responsibilities, and review promises made.",
        "Turn care into systems: automate transfers (education fund, debt reduction), finalize wills/guardianship, and calendar an annual review.",
        "When helping, state limits up front: “I fund X for three months; after that, you handle it.”",
        "Delegate real control: give a budget or project to a younger person, define the safety line, and don’t step in unless it’s crossed.",
        "Trade niceness for clarity: if resentment shows up, say what you need in plain words and set a deadline or boundary.",
        "Cut comfort that breeds inertia: cancel two low-value subscriptions; keep one premium comfort you truly enjoy, guilt-free.",
      ],
    },
    廉贞: {
      paragraphs: [
        "You have a judge’s spine and a lover’s heart. You read the room like a file, testing promises and watching hands more than words. Bright, stubborn souls orbit you, children, students, juniors, and creatives who crave your approval and your heat. You want legacy but fear chaos, swinging between crisp rules and impulsive rescue. This decade hands you a nursery and a workshop: the people you raise and the projects you birth. They mirror both your power and your temper. When a boundary is crossed, your blood rises and you move to correct. Yet under the armor you want laughter, trust, and work that breathes. The question is simple and hard: can you grow what you love without gripping so tightly it snaps?",
        "When you state clear laws and then play generously within them, your garden thrives. If you mix romance with mentorship, triangulate alliances, or micromanage from fear, expect gossip, burnout, and distance. Decide roles before roles decide you. Make agreements, deadlines, and consequences explicit; praise in public, correct in private, and keep receipts. Let them try and fail safely; intervene only when the stakes justify it. Your name is a brand this decade, one rumor moves faster than one truth. Guard late-night messages; temptation lives there. Choose which voice leads, the judge who keeps things clean or the lover who keeps them alive, and act accordingly. If you don’t, you may win every argument and still lose your people.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page charter for kids/teams/projects: roles, decisions, boundaries, conflict steps, and consequences. Share it and pin it up.",
        "Before punishing or firing, wait 24 hours. Separate facts from story. Choose the smallest consequence that teaches and protects.",
        "Don’t date or flirt with anyone you manage or fund. If lines blur, exit the authority role within one week.",
        "Move sensitive instructions to email. After meetings, send a 5-bullet recap within 12 hours to lock agreements and timelines.",
        "Run a weekly 90-minute play/brainstorm. No phones. Listen 70%. Approve one small experiment each time with a clear deadline.",
      ],
    },
    太阴: {
      paragraphs: [
        "You love in moonlight ways: quiet, steady, from the edges. This decade, bonds with children, lovers, mentees, and the creations you treat like offspring tug at your tides. You want to be the safe harbor and also to be seen, not just leaned on. You notice small things, fix problems at midnight, and hope someone names your care. Yet you hint instead of asking, then swallow the ache when they miss it. The push-pull between protecting and letting grow is the hidden weather of your heart.",
        "With Tai Yin lighting the Da Zi realm, soft power is your instrument. You become the patient gardener: a child braver, a project ripening, a romance deepening through small rituals. Results come from steady water and shade, not sudden spotlight. The traps: rescuing before they try, romanticizing potential, spending past your peace to “make it easier,” and sleepless overthinking that blurs your edges. The remedy is clarity. Boundaries aren’t walls; they’re trellises that help what you love climb toward its own light.",
        "Practice that clarity and this becomes a gentle flowering. A manuscript finishes because you claim two quiet nights; a teen returns because you listen without fixing; a romance steadies as you say yes and no with equal warmth. Your light soothes and sustains, use it to build a lineage of calm, craft, and care. When tides surge, step back, breathe, and speak plainly. This is an opening, take it.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you actually want in plain words, not hints.",
        "Schedule a weekly one-on-one “quiet hour” with your child/partner/mentee: no phones; each states one need and one appreciation.",
        "Use the 24-hour rescue rule: offer empathy today, solutions tomorrow; let them try first.",
        "Build a “moon fund”: auto-transfer 5-10% for dependents or creative projects; set written caps for support and stick to them.",
        "Lock your night routine: screens off at 10, write 3 lines in a journal, and note one clear ask for tomorrow; protect 7-8 hours of sleep.",
        "Take a private talent public monthly: publish, present, or perform; request direct feedback with two questions, “What worked?” and “What should I refine?”",
      ],
    },
    贪狼: {
      paragraphs: [
        "Everyone feels your magnetism before you speak. You walk into a crowded room and it’s as if the lights tilt toward you. In this decade, Tan Lang sits at 大子, the midnight gate where hunger wakes. You want more: more color, touch, velocity, influence. You reinvent your look, your rooms, your circles. Deals happen over laughter and late meals; attraction blurs with opportunity. Yet the same current that carries you forward can scatter you: half-finished projects, mixed signals, dopamine loops, “just one more” drink or chat or click. You crave to be both untamed and utterly in control. You promise yourself moderation, then the music rises.",
        "Here’s the truth: your desire is not the enemy; it’s a compass. But it must pull one cart, not ten. Choose a game worth winning and let your charm, appetite, and network feed that single fire. Convert attention into assets, skills, ownership, loyal alliances, not only memories. Build rituals that cap the night and begin the morning crisp. When you speak plainly about what you want, people line up to help; when you hedge, triangles and rumors breed. This decade can crown you as a connector-creator who dances and delivers. Or it can leave you lit but empty, busy but unbuilt, loved in public and lonely in private. The water is rising; steer now, before it chooses your path.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Name your top three desires in writing; if a request doesn’t serve them, say no.",
        "Set a weekly social budget: two intentional nights out, phone facedown, hard leave time.",
        "Use a 24-hour rule for big urges (love, deals, moves). Checklist: cost, worst case, exit.",
        "Pick one flagship project for 18 months; tie every new contact to a concrete milestone.",
        "Create a pleasure budget, money, drinks, screens, bedtime. Track daily; reset every Monday.",
        "Refuse triangles. If a connection requires secrecy or mixed signals, end it cleanly.",
      ],
    },
    巨门: {
      paragraphs: [
        "You live with a mouth full of truth and a heart that worries truth can break things. At night your mind lights up, threads of subtext, small inconsistencies, the tone behind the words. You sense what others are avoiding and feel compelled to name it, yet you’ve learned how quickly a sentence can become a blade. So you hover between saying it straight and swallowing it whole, between exposing the lie and protecting the peace. This is the secret: you are built to clarify, but the cost of clarity has scared you into second-guessing yourself.",
        "In this decade, conversations become the battlefield and the bridge. Whispers gain momentum; a casual remark decides a deal. People project their shadow onto you, asking you to speak for them, then resenting the echo. Contracts, negotiations, and public narratives weigh heavier; reputations move faster than facts. Your gift is precision: naming the real issue, translating mess into maps. Your risk is entanglement: getting pulled into disputes that are not yours, or using sharpness when tenderness would win. The more you chase rumors, the more they chase you.",
        "Treat your voice like a tool, not an impulse. When you use it to illuminate rather than to accuse, you become the trusted interpreter in stormy rooms. But if you let urgency or indignation steer you, this cycle can drain you with legal knots, broken alliances, and the slow erosion of credibility. Choose your battles, document your claims, speak less but mean more. The decade is listening, and it will remember what you say.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Replace hints with clear requests: state the action you want and a deadline; avoid sarcasm and coded language.",
        "Use a 24-hour send rule for heated emails or texts: draft at night, review in daylight, then decide to send or delete.",
        "Keep a rumor-to-fact log: record the source and evidence; act only when you have two independent confirmations.",
        "Resolve conflicts at the source: speak directly to the person involved, set a 10-minute agenda, and finish with one agreed next step.",
        "Protect your reputation online: no posts after 10 p.m.; channel late-night energy into private notes or research; review your digital footprint monthly.",
        "Practice contract hygiene: avoid verbal agreements; write scope, price, and deadlines; have a neutral third party review before you sign.",
      ],
    },
    天同: {
      paragraphs: [
        "You carry a soft center that wants everyone to be okay, even when you’re the one fraying. You read rooms, absorb moods, smooth edges, and tell yourself it’s easier to give in than to risk a ripple. Comfort is your refuge, warm food, familiar routes, known faces, and yet the more you cushion others, the less room you leave for your own heartbeat. You’ve smiled through tiredness, postponed decisions to keep peace, and felt the quiet ache of being the reliable one no one checks on.",
        "This decade asks you to nurture beginnings, your inner child, tender plans, and the early shoots of love, family, or creative work. The doors that open for you will come through kindness, hospitality, and steady care. But softness without edges becomes a net that catches every stray obligation. If you don’t define what’s yours to hold, you’ll end up holding everything. Your body wants gentler rhythms; your spirit wants clearer lines. Feelings are valid guides here, yet they need structure so they don’t turn into detours.",
        "Your gift isn’t to harden; it’s to make your softness reliable. Build a soft life with firm bones: small, consistent choices that protect your time, health, and heart. Comfort that nourishes is sacred; comfort that numbs is a quiet thief. If you keep delaying decisions to keep peace, you’ll wake to a future shaped by everyone else’s plans. Choose now, kindly and clearly.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a weekly Decision Hour. List three pending choices; commit to one in writing.",
        "Use a kind-but-firm no: “I can’t take this on. I’m focusing on X.” Repeat once.",
        "Replace numbing comfort with nourishing rituals: evening walk, bath, stretch, lights off by 11.",
        "Schedule two “newness” dates monthly: a class, group, or event outside your usual circle.",
        "Before agreeing to help, pause 24 hours. If it drains you, offer a smaller alternative.",
        "Declutter one zone each week. Box items for 30 days; donate if you don’t reach for them.",
      ],
    },
    天相: {
      paragraphs: [
        "This decade puts your quiet authority in plain sight. People lean on you because you’re fair, composed, and unwilling to let chaos win. Yet inside there’s a tug: to protect versus to let them learn; to keep the peace versus to speak the hard truth; to be endlessly available versus to claim time for what you want to build. You’ve become the harbor for everyone’s small boats, and the tide keeps rising. You sense it: if you don’t name your standards and limits, kindness turns heavy and your calm begins to fray.",
        "The focus here is what you ‘birth’, children, students, juniors, or projects bearing your name. You’ll be the conductor: setting tempo, shaping values, making sure the ensemble sounds like you. Tian Xiang gives you the gift of systems and grace, but its trap is gentle indecision. When you delay the call to avoid disappointing someone, the cost compounds. Unspoken expectations breed subtle resentment. People read silence as consent. This decade rewards the version of you who moves from implied fairness to visible rules, from private endurance to transparent boundaries.",
        "Stand at the fork: you can craft a beautiful lineage, people and projects that carry your signature of steadiness, if you decide, delegate, and keep your word to yourself. Or you can drown in caretaking, applauded yet empty, the respected guardian who lost their own play. Clarity is compassion. Say the line. Hold the line. Otherwise, those you shelter will learn to stretch you until you disappear, and what should have been your legacy becomes only maintenance. Choose early, and choose in public.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Open meetings and family talks by stating the outcome you want, in one sentence.",
        "Use a 48-hour decision window: write two options, choose, and inform all stakeholders.",
        "Hold weekly office hours for juniors or kids; no ad-hoc rescuing outside that block.",
        "Use this refusal script: “I can do X by Y date; beyond that I can’t commit.”",
        "Publish 3-5 standards for quality and behavior; review them monthly with the group.",
        "Block two 90-minute sessions weekly for your creation or joy, and protect them.",
      ],
    },
    武曲: {
      paragraphs: [
        "You’ve long carried the weight without asking for applause. In this decade, your spine hardens into a beam and your hands count what must be counted: hours, invoices, promises. You want warmth, yet your instinct is to build scaffolds, plans, budgets, contracts, so closeness won’t break anything fragile. You test loyalty by watching who shows up on time, who keeps their word. Children in this cycle are both literal and symbolic: the people you mentor, the teams you lead, the projects and assets you midwife into the world. You become the gatekeeper and the provider, the one who locks the door and stays until the work is certified done.",
        "Because of this, care can turn into control if you’re not careful. You translate love as provision, tenderness as schedules. Others might call you strict; you call it safety. Competence will be richly rewarded now: assets can solidify, contracts can stabilize, long-term returns can mature, if the structure is sound. But the pitfalls are sharp: isolation, fights over control, words clipped so short they sever. Impatience with immaturity can make you cut ties too fast. Remember, closeness grows from building together, not only paying for it. Your authority is most persuasive when it is quiet, steady, and fair.",
        "The invitation is to craft a legacy people want to belong to. Let the numbers serve the names. Use money, rules, and accountability to create room for play and trust, not distance. If you harden, you may win the ledger and lose the room; if you keep your standards and soften your delivery, you become unbreakable. Decide now which story you’ll tell ten years from today: a fortress perfectly engineered yet empty, or a strong house humming with life.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Hold a weekly legacy block: 90 minutes to review assets, name a successor, and teach one person a system.",
        "When giving corrections, start with context and intent; name two specifics they did well and one to fix by a date; write it, do not vent.",
        "Set a no-surprise-money rule: every spend above a set amount gets a 24-hour pause and a written purpose and expected outcome.",
        "Replace overcontrol with design: document one standard operating procedure each week, delegate it, and measure outcomes only on Mondays.",
        "Schedule non-transactional time with children, partners, or teams: two hours weekly with phones off; ask three open questions; give advice only if requested.",
        "Build the boring moat: dollar-cost average into low-cost funds or core assets monthly; automate, then ignore hype.",
      ],
    },
    天梁: {
      paragraphs: [
        "You carry the elder’s heartbeat even when you wish you didn’t. You’re the one who scans the room for what might break, who keeps the promise quietly while others improvise. You yearn for lightness, fun, romance, creative play, yet your mind keeps reaching for the safety rail. People lean on your calm and your fairness; they call you when it matters. You like being that person, until you don’t, until the late-night worry and the unspoken resentment arrive. The push-pull is real: you want to protect, but you also want to be seen as more than a dependable fix.",
        "This decade draws in the young, the unformed, the projects that want parenting. Teaching, mentoring, and legacy-building rise to the front. Your steadiness can turn scattered ideas into something that lasts, and late-bloom success favors your patient pace. But the exam you must pass is boundaries. Your wise counsel lands best when invited. Overprotection breeds helplessness; unsolicited advice breeds distance. Let people wobble. Let your creations meet the world. Guard your energy like it’s a scarce resource, because it is. The more structure you set, the more freedom you’ll actually feel.",
        "A warning: if you keep rescuing by reflex, you’ll train others to make you their emergency exit and yourself their exhaustion. Generosity without limits becomes a leash. Choose to be the elder who asks sharp questions, not the martyr who carries every bag. Define your terms now, or this cycle will drain the brightness you’re meant to pass on.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a weekly “rescue budget” of hours and money; once spent, say no without apology.",
        "Before advising, ask: “Do you want listening or solutions?” Only give advice after a clear yes.",
        "Create one scalable structure, office hours, family check-ins, or SOPs, so support doesn’t depend on constant availability.",
        "Let natural consequences teach: offer two choices with outcomes, then hold the line calmly.",
        "Protect your vessel: quarterly health checkups, one screen-free recovery day weekly, and a non-negotiable bedtime alarm.",
        "Build a legacy archive: document processes, record teachings, or write letters; ship one piece every month.",
      ],
    },
    太阳: {
      paragraphs: [
        "You are the one who keeps the lights on, even when no one notices. You carry warmth into rooms, settle nerves, point to the next step. Yet at night a doubt stirs: who holds the light for you? This decade feels like a sun at midnight, still radiant, but hidden, working through shadows. The pull is real: you want to step forward and be seen, then flinch at the cost. You want to help everyone, while a quiet voice asks you to help yourself first.",
        "People lean on your clarity. They call, and you answer; you organize the chaos; you pick up the slack. Then, when the spotlight finds you, you over-explain, polish at 1 a.m., and carry problems that aren’t yours because it seems faster. Your body keeps the score: tight jaw, shallow breath, eyes tired from screens and expectation. Relationships turn lopsided, you’re dependable, not always met. The power is there, but constant output dulls it, like a floodlight dimmed by too many switches.",
        "This cycle rewards disciplined radiance: fewer beams, brighter reach. Aim your light; don’t spill it. Name what you need without apology, and build rituals that refill you before you serve. Choose work that scales your impact, not work that proves your worth. Ignore this and burnout will wear competence as a mask. Honor it and your presence becomes unmistakable, quiet, warm, decisive, the kind of light people navigate by.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Protect your mornings: 15 minutes sunlight, 90 minutes deep work, no meetings before 10 a.m. two days a week.",
        'Make requests in one sentence: "I need X by Y because Z." Send it without softening. Follow up once, then escalate.',
        "Choose two flagship projects for the year. Write a one-page success spec. Decline extras using a saved response.",
        "Keep an energy ledger: weekly list of +/-. Remove three drains this month. Automate or delegate one recurring task weekly.",
        "Close your day on purpose: 30-minute shutdown, tomorrow’s Top 3, devices out of bedroom, lights out by 11 p.m.",
      ],
    },
    七杀: {
      paragraphs: [
        "When Qi Sha steers this decade through 大子, you feel like a commander pacing the nursery, one hand on the sword, one over a small heartbeat. You can smell what’s failing and want to cut it clean: bad habits, stale roles, loyalties that keep the young or your “creations” small. Yet you also hear the soft tug: protect, teach, build a sturdier haven. The inner swing is real, decisive, almost ruthless clarity by day, then a quiet ache at night wondering if your edge is too much for the people who look to you, or for the projects you call your children. You crave order and momentum, but you don’t want to become the storm that scares away what you love.",
        "In practice, crises will find you and you’ll be good at them. You’ll be asked to prune a family system, reset rules, or steward a bold new legacy. People will read your certainty as safety, until your words land like steel. Silence can cut too; withdrawing when disappointed teaches fear instead of strength. This decade wants you to be protector and sculptor: choose what survives, and teach it how to stand. Measure twice before you slice once. If you rush, you may win every argument and lose the room; if you temper the blade with warmth, you’ll raise braver kids, steadier teams, and work that lasts. The warning is simple: force alone will give you compliance, not loyalty. Earn the latter.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Schedule a weekly 30-minute 1:1 with each child or mentee, phones off, just listen and reflect back.",
        "Before issuing a hard rule or ultimatum, wait 24 hours; write it, sleep on it, then edit for clarity and care.",
        "Draft a family or team charter: 3 values, decision rules, and consequences; share it and enforce it consistently.",
        "Channel your edge into a legacy project (book, business, scholarship): define scope, budget, and a 12-month milestone.",
        "Set nightly “no-knife hours” (e.g., 8-10 pm): no critiques; only care, stories, repairs, and gratitude.",
        "Form a council of three (an elder, a peer, a professional) to review high-impact moves quarterly; honor their red flags.",
      ],
    },
    天机: {
      paragraphs: [
        "Your mind is a humming engine, catching faint signals others miss. You tweak plans at midnight, reroute in the morning, and keep three backup paths in your pocket, just in case. People may call it indecision; you know it as care: you’re guarding options, protecting time, optimizing angles. Under this decade’s Tian Ji tide, information multiplies, doors crack open, mentors appear, and new tools keep calling your name. You’re brilliant at seeing how the pieces could fit, how a small adjustment could save miles down the road. The drag is that momentum leaks through a hundred bright possibilities, and the fear of the “wrong path” keeps you moving in circles when you could be moving ahead.",
        "What you want, deep down, is one clean design to live by: a system that steadies your day, a mission that makes all choices simpler. Yet every week another opening appears and your heart races, what if this is the smarter route? Relationships and teams feel your quick pivots; they admire your foresight but crave your anchor. This decade asks you to choose a worthy question and devote your curiosity to it. Let your flexibility serve commitment, not replace it. You will make mistakes. The map will change. But the only true risk here is never planting a flag. If you don’t claim a direction, this bright, fast decade can dissolve into tabs open, courses half-finished, and trust half-built. Choose, before the current chooses for you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Hold a Weekly Decision Hour: name your top 3 priorities and kill one nonessential task or project.",
        "Work in 90-day sprints: set one theme and one measurable deliverable; allow only one mid-sprint adjustment.",
        "Set an information diet: for every new source you add, archive two; timebox research and convert notes into next actions.",
        "Speak plainly with partners and teams: state timelines, success metrics, and exit criteria before starting.",
        "Use the 72-hour pivot rule: write why you want to change; sleep on it; if reasons strengthen, move decisively.",
        "Pick one home base tool for tasks and calendar; no app-switching for 60 days, then review what actually worked.",
      ],
    },
    右弼: {
      paragraphs: [
        "You’re the quiet pivot, the one who stitches torn edges and keeps the room calm. With Zuo Fu guiding your decade in the realm of children and creations, you’re pulled to support the young, the fragile, the almost-ready. You soothe, you organize, you draft the message everyone else is afraid to send. Yet a private ache grows: why must you carry it all? You want to be appreciated without becoming indispensable; to love without being used. You promise yourself to step back, then step in anyway because you can’t watch things fall apart. That push-pull is real, and it’s the exact edge this cycle asks you to master.",
        "You Bi is the right-hand star: velvet-glove authority, elegant fixes, trusted alliances. In 子宮, it spotlights children, mentees, students, and the projects you birth. Expect doors to open through younger networks, education paths, community programs, and collaborations where you play mentor or mediator. Paperwork, permissions, and formal agreements tend to go your way when you speak softly and clearly. Your gift now is turning chaos into cadence, routines, calendars, shared expectations. The trap is over-accommodating: rescuing too fast, spending to buy peace, keeping secrets to “keep harmony.” That’s not harmony; that’s erosion. Boundaries are the backbone your kindness needs.",
        "Own the role of guide, not savior. Teach them to carry weight, and your care becomes legacy. Say less sugar, more truth. Choose one or two creations to champion fully, and let the rest mature without you. Do this, and your steadiness becomes architecture, a home where love is felt and responsibility is shared.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a one-page charter: roles, decision rules, spending limits; review and adjust quarterly.",
        'When asked to fix something, ask "What have you tried?" Act only after two options are offered.',
        "Hold weekly 30-minute 1:1s with each child/mentee; listen first, then mirror their key point.",
        'Replace hints with plain requests: "I can help twice a week, not daily."',
        "Set a monthly budget for dependents/projects; track it; wait 48 hours before extras.",
        "Move delicate issues from side chats to shared channels to prevent triangulation.",
      ],
    },
    左辅: {
      paragraphs: [
        "You are the one people call when a plan needs a spine. You hear the wobble in a room and quietly set bolts, make a list, draw a path. With Zuo Fu in Da Zi this decade, that urge to steady and uplift becomes the main tide. It feels good to be needed, and tiring to be needed first. You want clear roles, fair exchange, lasting results, yet you keep patching in silence and watch credit drift. The hidden truth: your gift isn’t only fixing. It’s framing what matters and choosing where your help belongs.",
        "Da Zi points to beginnings, children and protégés, and the projects you ‘raise.’ You’ll be invited to mentor, organize, or inherit a mess and make it breathable. The tension: architect or tireless assistant. When you claim design authority, scope, timelines, standards, your support stops being invisible. When you teach the process instead of rescuing the person, your load lightens and their growth holds.",
        "Let this be a decade of quiet elevation. Build frameworks that carry your name. Make reliability visible through boundaries and teachable systems. Do that, and the steady hand becomes the recognized leader.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Define your role in writing before you start: deliverables, decisions, and what you’re not doing. Get written agreement.",
        "Turn recurring favors into systems: one-page checklist or template in a shared folder; train one person monthly to own it.",
        "Hold a weekly 60-90 minute review: list all asks, cut or delegate 10%, and block buffers around critical work.",
        "Before saying yes, ask: “What outcome am I accountable for?” and “What resources/budget do I control?” Pause until both are clear.",
        "Secure visible credit up front: specify how your name appears on docs, agendas, and releases; keep a contributions log.",
        "Replace rescuing with teaching: fix it once, document steps, and require the owner to run the playbook next time.",
      ],
    },
    文昌: {
      paragraphs: [
        "You think in sentences. Your love wants to be useful, to explain, to tidy chaos with the right word. Yet the people and projects that feel like your “children” don’t grow on grammar alone. You’re caught between guiding and grading, wanting to nurture, then hearing your own tone turn corrective. Nights stretch long while you rewrite a message, refine a lesson plan, perfect a proposal, quietly worrying that one clumsy phrase could bruise a tender heart or derail a fragile beginning. Beneath it is a simple longing: to be heard clearly, to raise what you care for well, without losing warmth to precision.",
        "This decade sharpens your mind and opens a classroom everywhere: in your home, your team, your studio. The gift is lucidity, systems that soothe, words that land, paperwork that finally lines up. Children, students, mentees, and fledgling ideas all respond when you speak plainly and teach with patience. But there’s a fine line: when clarity hardens into control, curiosity dies. When you rescue with advice too soon, you steal someone’s chance to discover. Your words can become a bridge or a clipboard. The difference is whether you’re listening for their world, or just arranging yours.",
        "Lean into the teacher who invites, not indicts. Let your intellect be a lamp, not a spotlight that blinds. Turn your care into rituals that protect play: short drafts, gentle check-ins, steady rhythms. Let imperfect things breathe. If you do, this becomes a decade of legacy, the season you give language to love and watch it ripple through the lives you touch. If you don’t, the distance will whisper back in silence. Choose the bridge.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Before big talks, write three lines: what I want, what they need, possible compromise.",
        "Hold a weekly 45-minute “no fixing” session, only curiosity questions, no advice.",
        "Set a 70% rule: ship drafts, proposals, or art on a monthly deadline without extra edits.",
        "Batch all school, admin, and contract tasks every Tuesday for 20 minutes with a checklist.",
        "Mentor one younger person or group; protect a two-hour window weekly and end on time.",
        "When upset, wait 24 hours before sending corrections; choose a call or face-to-face.",
      ],
    },
    文曲: {
      paragraphs: [
        "You carry a quiet lyricism that people feel before they notice. Your mind arranges feelings like verses, your charm slips in sideways, and your care runs deep, especially for the young, the tender, and the not-yet-formed. In this decade, themes of children and creations ask for your voice: a child who needs your calm attention, a student who blooms under your encouragement, a project that feels like your own offspring. You long to protect, polish, and present beauty to the world. Yet you also feel the undertow: the wish to disappear before you’re fully seen, to perfect instead of release, to love the potential more than the reality standing in front of you.",
        "You’ll notice you become a magnet for beginnings. Younger people, fledgling teams, early drafts, new loves, each looks at you as if you can translate their unsaid. You can. Your words lift rooms and soften conflicts. But when the tide of emotion rises, you may blur signals: offering warmth you don’t intend to sustain, promising support you can’t deliver, holding a standard so high that nothing passes. Romantic swirl may knot itself inside caretaking roles; nights of heartfelt messages followed by mornings of distance. The line between artistry and escapism, between guidance and rescuing, will define the outcomes of this period.",
        "This is a decade to refine your voice into legacy. Tenderness becomes power when paired with structure. If you choose clean boundaries, simple rituals, and the courage to ship drafts before they’re perfect, love and art will grow in real time. If you drift, you may end with half-finished lullabies and dependencies that drain you. The door to a gentler, truer future is open, walk through it intentionally.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a weekly “creation hour” and publish one small piece every week (a post, a sketch, a song demo). No polishing after 60 minutes.",
        "Define a clear boundary sentence for younger people or mentees: “Here’s what I can offer and for how long.” Say it early; repeat it when lines blur.",
        "Use the third-meeting rule in romance: by the third date or deep chat, state your intention plainly (exploration, commitment, friendship).",
        "Create a ‘definition of done’ for each project or parenting task (e.g., “homework checked, emotions named, bedtime story read”). Stop when it’s met.",
        "When emotions spike at night, delay major decisions and messages until the next afternoon. Draft, sleep, then send.",
        "Schedule one 1:1 listening ritual per week with the child/student/team member: 15 minutes, no advice, just reflect back what you hear.",
      ],
    },
  },
  大财: {
    紫微: {
      paragraphs: [
        "You’re tired of playing small with money. You want sovereignty, not scraps ,  to be the person who sets the standard, not the one who gets handed terms. Yet there’s a tug-of-war inside: the urge to make a grand move versus the fear of overreaching; the love of quality and legacy versus the temptation to soothe anxiety with status buys. You sense that wealth, for you, isn’t about the rush. It’s about order, dignity, and being able to say, “This is mine, and it’s built to last.”",
        "In this decade, money responds to authority. Projects expand when you take the head seat, negotiate directly, and turn vague hopes into clear structures. Your regal taste can attract better partners and premium opportunities ,  as long as “face” doesn’t become your most expensive habit. You see long arcs others miss: equity over fees, ownership over applause, recurring revenue over one-time wins. Your trap is perfection or pride ,  waiting too long for the flawless plan, or committing to a spectacle that drains cash while feeding image. People will orbit you; keep a court, not a crowd.",
        "Treat this era like a coronation of your financial life: write the laws, build the treasury, and choose stewardship over show. Create calm systems that outlive mood swings, protect your cash flow, and make generosity sustainable. Do this, and the decade compounds into quiet power and peace. Chase applause instead, and the empire may look grand while bleeding quietly from within.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a 10-year capital memo: set fixed percentages for reserves, core operations, growth bets, and generosity; review quarterly and follow it like policy.",
        "Run a weekly money dashboard: cash in/out, runway, debt ratio, and top 3 risks; make one decision each week based on the numbers, not mood.",
        "Negotiate from ownership: ask for equity, profit share, or board rights; if control terms are weak, politely walk away.",
        "Install ‘Face Guardrails’: any purchase meant to impress triggers a 48-hour pause and a second approval from a trusted advisor.",
        "Form a three-person privy council (legal, finance, industry): meet monthly, predefine veto powers, and minute every major decision.",
        "Convert entourage to contracts: clear roles, deliverables, and sunset clauses; if value isn’t proven in 90 days, end the cost.",
      ],
    },
    破军: {
      paragraphs: [
        "Money, for you, never sits still. You grow a stream, then feel the itch to tear it down and start fresh. Stability tastes like dust; movement tastes like life. You’ve felt the stomach-drop right before a bold transfer, the rush when a risky call pays, and the hollow quiet when it doesn’t. Part of you wants a fortress; part of you wants a clean slate and a match. Underneath it all is a fierce honesty: you don’t want to patch leaks, you want to rebuild the whole ship so it actually flies.",
        "This decade asks you to become both demolisher and chief architect of your wealth. Po Jun in Da Cai favors creative destruction, ending stale income models and birthing stronger ones, but it punishes impulse. Your edge is decisive action paired with strict limits. Treat cash as oxygen, not a trophy. Make changes through contained experiments, not grand gambles. Negotiate hard, exit faster, and refuse to rescue sunk costs. If you avoid structure, volatility will tax your sleep, your relationships, and your self-trust. If you build clear rules and buffers, what feels chaotic becomes momentum. The blade will swing, decide whether it is in your hand or at your neck.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Build a 12-month essentials buffer in a separate account; never risk it on ventures or investments.",
        "Cap downside: limit any single bet to 5-10% of liquid funds; pre-write exit price and exit date.",
        "Turn big pivots into 30-60 day sprints with one success metric; decide beforehand to scale, tweak, or quit.",
        "Each month, kill one low-margin offer or client; replace it with a higher-margin product, price, or channel.",
        "Protect partnerships: require written roles, equity, vesting, buy-sell terms, and add a 48-hour cooling-off before signing.",
        "Hold a weekly money council: review cash-in/cash-out, top three drivers, and commit one concrete action before Friday.",
      ],
    },
    天府: {
      paragraphs: [
        "You carry the calm of a vault. People hand you keys, bills, and half-formed dreams because you remember every number and you don’t flinch. Yet inside, there’s a tug: protect what you’ve built versus step into larger plays. You want certainty, but your eyes keep drifting to assets that promise steady yield, to enterprises that feel solid under the hands. In this decade, Tian Fu in Da Cai crowns you steward, not gambler. Your gift isn’t luck; it’s structure. When you design the container, money settles, multiplies, and stays loyal.",
        "Expect bigger budgets to manage, property or equity opportunities, and roles where others trust you with the purse. You’ll be asked to consolidate, clean up messy accounts, and make the grown-up call. Measured moves beat flashy bets. The danger isn’t recklessness but inertia: letting cash sleep, saying yes to every relative, or locking too much into beautiful, illiquid trophies. Treat generosity as a policy, not an impulse. Turn your sensibility into systems: rules for lending, rhythms for rebalancing, and a clear floor for liquidity.",
        "Your wealth grows when you circulate it with intention, not when you become everyone’s lifeboat. Define your terms now or others will define you by their needs. This cycle can make you keeper of lasting resources, or leave you rich on paper and strained at heart. Set the boundaries before the requests arrive.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page Money Constitution: purpose, risk band, liquidity floor (12 months), and giving cap; review quarterly.",
        "Automate cashflow: each payday move 20% to investments and 5% to an opportunity fund; keep a 12-month buffer.",
        "Rebalance annually: sell winners back to targets; cut holdings that lag their index four quarters; replace, don’t accumulate.",
        "Set rules for family/friend money: never exceed 10% of liquid net worth; use signed agreements with dates and terms.",
        "Keep cash working: move idle balances to 3-6 month T-bills or a high-yield money market; target cash drag under 10%.",
        "Before any deal, run the 3-check filter: worst-case loss, weekly hours to manage, and a clean exit within 24 months; if any answer is fuzzy, walk away.",
      ],
    },
    廉贞: {
      paragraphs: [
        "In this decade, your money story is charged. Lian Zhen in Da Cai makes you restless with average; you want to rewrite rules, to win not just income but influence. You feel the tug between clean integrity and thrilling shortcuts; between patient structures and dramatic turnarounds. You’re magnetic in negotiations; rooms tilt toward you when stakes rise; yet after the adrenaline quiets, you worry whether you promised too much or stepped into grey zones. You can spot where value leaks, prices mis-set, processes corrupt, partnerships stale, and you itch to reform them, to cut through politics and make it work. At times you spend to signal power, to test doors; then you pull back, counting costs, vowing to be sharper next round.",
        "This cycle can make you very rich through reforming broken systems, leading rebrands, performance-based deals, or turning around chaotic teams. But it also attracts rivals, audits, and temptations: side payments, leverage games, tax 'optimizations' that look clever until they aren’t. Money here is not just cashflow; it’s stage, seduction, control. Choose to be architect, not arsonist. Build transparent agreements, measurable risks, and a reputation that compounds. If you chase fast heat over clean gain, cash may spike but stability and trust will crater. Take this as a sharp blessing: the market will reward your courage and clarity, or bill you, with interest, for every shadow.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a 1-page Money Code: 5 rules for deals (ethics, risk caps, documentation, taxes, conflicts). Keep it visible.",
        "Set risk limits: For any deal/trade, risk max 2% of liquid net worth; define exits before entering.",
        "Institute a 'clean hands' hour monthly: reconcile invoices, tax filings, and contract changes; get written legal/accounting opinions on gray areas.",
        "Insert a 48-hour cooling-off for flashy offers: list ego/power benefits vs cashflow/fit; proceed only if cashflow wins.",
        "Turn reform into revenue: pick one broken process you can fix; launch a 90-day paid pilot with clear KPIs and milestone-based payouts.",
        "Guard reputation capital: no cash under the table; summarize every agreement by email and require signatures; walk away if it can’t stand daylight.",
      ],
    },
    太阴: {
      paragraphs: [
        "You measure wealth in how soft life feels: the calm kitchen, the bills paid before anyone asks, the way you can give and still have enough. Yet money moves through you like tide, generous one moment, quietly anxious the next. You are the person who picks up the tab to keep the peace, then lies awake recalculating. You underquote because you want to be chosen, then resent the hours you give away. Privacy is your armor; you’d rather handle finances quietly than negotiate in the open. You crave to be cared for, but you also want control; you hoard for safety, then late-night comfort purchases blur the edges. This is the push-pull of Tai Yin in the wealth seat.",
        "This decade asks you to turn lunar sensitivity into steady accumulation. Your money grows best in calm routines and moonlit niches, homes, rentals, hospitality, design, wellness, advisory, feminine markets, remote or evening work. Compound consistency will do more than any single bold play. But the same tenderness that makes you trusted can drain you: family tides, partner expenses, temporary favors, and soft-spoken invoices that never firm up. If you keep soothing others with your wallet while avoiding firm words, you’ll build comfort for everyone but yourself. Let your softness choose rituals; let your boundaries choose numbers. Because if you stay silent, others will set your price, and the tide will pull out when you most need it.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Speak your price in one sentence, then stop talking. Practice daily until it feels natural.",
        "Automate safety: within 24 hours of payday, transfer 15% to a high-yield account until you hit 6 months of expenses.",
        "Create a comfort budget (5-10% of income) for small luxuries; spend from it guilt-free and nowhere else.",
        "Put every deal in writing, scope, timeline, payment dates. No more we’ll sort it later.",
        "Cap family/partner support at a fixed monthly amount; when it’s used, say, That’s my limit this month.",
        "Choose one lunar-aligned asset (rental/real-estate fund, dividend index fund, boutique hosting or care service) and invest a set amount every month, regardless of mood.",
      ],
    },
    贪狼: {
      paragraphs: [
        "You crave more ,  not just money, but the pulse that comes with it. You notice chances others miss, feel the room tilt toward you when you want something. Big numbers flicker like city lights: alluring, near, almost yours. Yet there's a tug: the thrill of chasing versus the peace of keeping. You promise yourself restraint, then a new opening winks and you're back in the dance. Money, for you, is taste, freedom, proof ,  and a magnet for attention. Some nights you plan three moves ahead; other nights you wonder if desire is running you.",
        "With 贪狼驻Da Cai this decade, the tide answers appetite and charisma. Opportunities arrive through people, scenes, and trends: partnerships, nightlife and entertainment, beauty and luxury, social media, high-turnover real estate, affiliate or referral plays. When you move, doors open fast ,  so do tabs, favors, and entanglements. Profit grows by packaging allure into repeatable offers; risk grows when pleasure bleeds into business. Overleverage, subscriptions you don't use, cross-guarantees for friends, and 'just this once' bets can flip a feast into famine.",
        "Desire isn't the enemy; undirected desire is. Build a container sturdy enough to hold your hunger, and it will mint cash instead of chaos. If you don't set limits, the market, a bank, or a lover will set them for you ,  on harsher terms. Choose your edges now.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Cap risk: any single speculative trade ≤ 2% of net worth; total high-risk exposure ≤ 10%.",
        "Operate a two-account cashflow: paycheck/inflows land in Account A; twice monthly sweep to B for expenses, investments, and a 30% tax reserve.",
        "No handshake deals: write terms in plain language and get signatures before sending goods, intros, or deposits.",
        "Install a night-guard: after 10 p.m., wait 24 hours before transfers or purchases over $500.",
        "Monthly desire audit: list top 5 wants; fund only the best 1-2; park the rest for 90 days.",
        "Keep love and money clean: if dating in your network, use invoices, separate accounts, and clear boundaries on favors and equity.",
      ],
    },
    巨门: {
      paragraphs: [
        "Across this decade, Ju Men in the Da Cai palace puts your voice at the cash register. You feel torn: part of you wants to tell the whole truth in sharp, clean lines; another part imagines the backlash, so you cloak your terms in polite fog. You crave bigger numbers yet dissect every clause until the joy drains out. You sense profit hiding in the gray, but you also taste the cost of ambiguity. You are the person who can talk a locked door open, and the same mouth can slam it shut.",
        "Money arrives through explanation, negotiation, analysis, reviews, anything that needs a discerning tongue. You’ll see deals swing on a single sentence, fees shaved by a “quick favor,” and invoices warped by rumors you didn’t start. Nights may find you rerunning conversations, wishing you’d said it plainer. And when you do state your value in exact words, the room goes quiet and people pay. Yet the traps here are precise: vague scopes, hidden fees, friendly handshakes that mutate into disputes, the audit you keep meaning to prepare for.",
        "This decade rewards daylight and punishes fog. Your words are both currency and shield, use them cleanly, document them, and let numbers confirm them. Expect tests: a sharp review, a contract dispute, an audit letter. Meet them with receipts, timelines, and calm sentences, not stories. If you stay crisp and leave a paper trail, Ju Men turns shadow into strategy; if you hedge and hope, the bill arrives with interest and your name attached. Choose daylight now, before pressure chooses for you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Put every agreement in writing with a five-line plain-language summary at the top; both parties initial that summary before work starts.",
        "Build a no-ambiguity price sheet: three packages with scope, deliverables, timelines, late fees, and boundaries on “quick favors”; send it before any call and reference it during negotiations.",
        "Auto-transfer 30-35% of every payment the day it arrives into a separate tax/obligation account; touch it only for taxes and compliance costs.",
        "For heated emails or messages, use the 24-hour rule and a read-aloud test: sleep on it, then remove hedges and sarcasm; ask one precise question or state one clear ask.",
        "Launch one voice-based channel (newsletter, podcast, webinar) to turn expertise into leads; track conversion weekly and drop any channel that stays under 5% conversion after 90 days.",
        "Schedule a monthly audit day: reconcile accounts, chase invoices overdue by 15+ days with a firm reminder including late fees, and cancel one subscription or tool that didn’t earn its keep.",
      ],
    },
    天相: {
      paragraphs: [
        "You crave order around money the way a gardener craves a well-trimmed hedge: neat, fair, and quietly impressive. People sense your steadiness and make you the treasurer, the negotiator, the one who reads the fine print. Inside, though, you wrestle with a softer pull: the wish to be generous, respected, and conflict-free. You don’t like to squeeze anyone, yet you dislike being taken for granted. So you alternate between gracious concessions and sudden hard lines, and the delay between knowing and deciding often costs you most, time, fees, and sometimes pride.",
        "This decade asks you to be the minister of value, not the peacekeeper who pays the price. With Tian Xiang in the wealth seat, money comes through governance: contracts, retainers, advisory roles, stewardship of resources, and reputation that opens doors. Think compounding, not windfalls; elegant systems over flashy bets. Your name becomes currency, keep it clean with clear terms, documented scope, and measured grace. The pitfalls here are indecision dressed as diplomacy and discounts disguised as kindness. If you don’t set the terms, others will set them around you. Watch prestige spending that buys image but starves reserves. Attend to legality and compliance; this is a cycle where proper structure multiplies safety and profit.",
        "Say yes to your authority. When you stand as the fair judge of value, money sticks and relationships stay intact. Build alliances, choose durable agreements, and let your standards, not your moods, decide. Your wealth, this decade, is the quiet surplus of well-run promises.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page Money Charter: rate floors, payment terms (deposits, late fees), refund policy, and your hard no’s. Share it before any negotiation.",
        "Move from hourly to retainers or packages. Define scope, revision limits, and milestones in writing, and get signatures before work begins.",
        "Use a Deal Triage Checklist: verify decision-maker authority, map payment schedule, add exit/kill fees, confirm deliverables, and sleep on big yeses for 24 hours.",
        "Block a quarterly Governance Day: reconcile accounts, rebalance investments to a target mix, review insurance and compliance, audit subscriptions, and refresh contracts with your lawyer/bookkeeper.",
        "Cap status spending at a fixed percentage of income and route it to a separate Prestige budget. Track it weekly so image never raids savings.",
        "Build your alliance: retain an accountant, an attorney, and an ops or project manager. Hold a 60-minute monthly review with a set agenda and action items.",
      ],
    },
    天同: {
      paragraphs: [
        "You want money to feel like a soft shelter, not a contest. You work to keep others comfortable, smoothing edges, saying yes, and only later notice your own pocket is the one giving. You crave security and simple pleasures, good meals, time off, gentle beauty, yet you hesitate to charge fully or set limits, worried it will break the peace. When stress rises, you soothe yourself with small treats or generous gifts, then promise to be stricter next month. This is the loop: give, soften, refill, repeat, warm-hearted, but slightly leaky.",
        "With Tian Tong in Da Cai this decade, wealth grows where you nourish. Money responds to your calm presence in roles that host, heal, support, teach, or tend to details with kindness. Think client care, hospitality, wellness, education, community management, places where someone exhales because of you. The risk isn’t lack of luck; it’s drift. Emotional spending, rescuing others, fuzzy pricing, and passive-income fantasies without structure can stall momentum. Your best move is gentle discipline: small automatic systems, clear rates, soft but firm boundaries. When you protect your softness, resources gather; generosity becomes sustainable.",
        "Let comfort be designed, not improvised. Make ease your strategy, and money will feel peaceful, abundant, and under your care. Start now, tiny, consistent steps, before today’s small leaks harden into tomorrow’s regret. This decade wants your kindness to pay you back.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Create a Comfort budget line (10-15%); pre-load a card and spend from it only.",
        "Set day-of-pay automations: savings/investments 20%, giving 5%, joy fund 10%.",
        "Write your minimum rate and a two-sentence script; practice saying it aloud.",
        "Use a 24-hour rule on loans; cap help money monthly; gift, don’t chase repayment.",
        "Schedule a weekly 20-minute money tea: reconcile, cancel one leak, choose one revenue action.",
        "Build an emergency cushion to three months, then six; treat it as untouchable.",
      ],
    },
    武曲: {
      paragraphs: [
        "You’ve always been the one who makes money behave. When others daydream, you open spreadsheets. There’s a quiet steel in you: earn it straight, keep it clean, know where every dollar sleeps. Yet under that control is a heartbeat that fears waste and weakness; you stash, you negotiate hard, you cut the fat, and sometimes the joy. You want security so badly it can feel like a fight, even with yourself: the urge to build versus the wish to breathe.",
        "This decade drops you into the arena of Grand Wealth. Wu Qu wakes like a seasoned CFO and a builder. It’s not about flashy wins; it’s about constructing assets that pay you while you sleep: cash-flow businesses, real property, systems, contracts, machines. You’ll find power in rules, dashboards, covenants. Money will respond to your discipline, if you keep your blade sharp but your ego quiet. Beware the chill of isolation and the itch to prove you’re right through reckless bets dressed as “opportunity.”",
        "Let this be the decade of sovereignty, not scarcity. Build structures that hold, then let your shoulders loosen. Choose work you can master, deals you can measure, partners you can trust. Patience is the multiplier here; steady steps compound into independence. Make the numbers carry the weight so your heart can stay human.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a 10-year money map: target net worth, asset mix, yearly cash-flow milestones.",
        "Build a 9-12 month operating buffer in a separate account; never raid it for wants.",
        "Automate monthly investments into 2-3 vehicles you fully understand; stop chasing tips.",
        "Use a deal filter: minimum 15% expected IRR or 2:1 reward-to-risk; if not, pass.",
        "Hold a Friday 45-minute finance review: reconcile, cut one expense, choose one bold move.",
        "Set money boundaries with family: define what you gift, what you lend, and what you decline in writing.",
      ],
    },
    天梁: {
      paragraphs: [
        "You spot the crack before the wall gives way. In this decade, money comes wrapped in responsibility: guardianship, signatures, quiet authority. People hand you the keys because order settles around you. You prefer steady inflows, clean rules, a name that outlasts trends. Yet under the calm is a rub: “help” often turns into a private tax you pay; promises become invoices on your heart and wallet. You want to be generous without being used, prudent without turning cold. That’s the hidden tension of Tian Liang in the big-wealth seat: the caretaker who must learn that care needs fences, or it leaks.",
        "Prosperity grows through trust-based work: advisory retainers, risk management, healthcare, legal/insurance, compliance, public service, stabilization roles. You’re paid to prevent loss and codify order. Compounding favors your patience; policies, checklists, and long horizons are your tools. The traps are classic: soft-hearted loans to family, co-signs, noble causes without budgets, and dragging failing projects out of duty. This decade doesn’t reward flashy bets; it crowns the builder of fortresses, cash flows independent of moods, contracts that price your wisdom, a clear protocol for no. Take this seriously: if you try to be everyone’s roof, the beams that hold your house will strain.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a strict “giving and rescue” budget (5-10% of annual income). When it’s used, the answer is: not this year.",
        "Refuse all unsecured loans and co-signs. If you must help, give a small, no-strings gift from the giving budget.",
        "Turn favors into paid structure: write a scope, fee, and timeline before offering advice or hands-on help.",
        "Automate a 24-month runway: separate accounts for emergency, taxes, and long-term investments; fund them on payday.",
        "Use a due-diligence checklist for every deal: 3-5 year cash flow, downside scenario, exit plan, written responsibilities.",
        "Hold a quarterly Wealth Council (you + one trusted pro): review contracts, cut leaky costs, renegotiate retainers, and shift excess into safer yield when markets run hot.",
      ],
    },
    太阳: {
      paragraphs: [
        "You carry a sun in your wallet. When you shine, money warms and moves. People gather around your clarity, your straight talk, your way of making the path visible. Yet the same heart that lights others also pays their bills, lends too easily, says yes to one more call. Inside there is a seesaw: pride in being the provider versus the quiet fatigue of always being on. Some months feel like high noon - deals fast, generous tips, reputation booming. Other months dim like late afternoon - you wonder where the light went and whether you gave away too much to keep everyone comfortable. You want prosperity that matches your effort without dimming your kindness.",
        "This decade asks you to treat attention as an asset and generosity as a strategy, not a leak. Your wealth grows when your work is visible, teachable, and repeatable; it thins when it hides in favors and improvisation. Build income that does not require constant glow - systems, pricing that respects daylight, assets that keep earning after the meeting ends. Lead openly, but put the meter on the lamp. This is a growth cycle if you choose stage over shadow, structure over scrambling. Stand tall, charge fairly, and let your light fund your future, not just today’s applause.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Publish weekly in one public channel; teach one concrete insight; end with one clear offer.",
        "Guard your solar hours: reserve your highest-energy 3-hour block for revenue work only.",
        "Price and scope in writing: tiered packages, nonrefundable deposit upfront, clear deliverables and boundaries.",
        "Automate money buckets on payday: 10% investments, 5% giving, 15% taxes, build a 6-month reserve.",
        'Cap generosity: no more than 2 pro bono slots per month; use the line, "I have a waitlist."',
        "Use a 72-hour rule for big spends (set your threshold): wait, then calculate break-even and payback date before buying.",
      ],
    },
    七杀: {
      paragraphs: [
        "You have a fighter’s pulse when it comes to money. When an opening appears, your body leans forward before the mind finishes the sentence. You’d rather take a clean shot and live with the consequence than watch someone else claim what you saw first. The pattern you know too well: a surge of earnings, then a hard reset; bold deals that make you feel alive, followed by nights scrolling numbers, pretending you’re not tracking every fluctuation. You want independence so badly you can taste metal, yet the fear of being trapped by bills or partners can send you into drastic moves.",
        "This decade sharpens that edge. Opportunities arrive like skirmishes: short, intense, decisive. You win when you strike fast and exit on schedule, not when you try to prove a point. Money responds to your courage, then punishes your stubbornness. Expect multiple streams that spike and dip rather than one smooth salary. The real skill here is command and withdrawal: read the terrain, define the mission, secure the gain, pull back to count and repair. Build rules that hold even when adrenaline is loud. When structure partners with your daring, your results compound instead of scatter.",
        "You’ll be tempted to go it alone, but power scales through tight alliances and tighter terms. Choose a few ruthless professionals, accountant, lawyer, operations lead, then listen to them. Cash is oxygen; keep tanks full and mobility high. Negotiate hard, pay fast, and keep your word. Resist the performance of wealth; let your balance sheet, not your feed, do the talking. If you keep swinging to feel alive, the market will eventually swing back. Courage is your gift; restraint is your shield. Without the shield, power becomes exposure, and exposure invites a hit you can’t absorb.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set hard position limits: never risk more than a fixed % of liquid net worth on a single deal; write the number and keep it visible.",
        "Define exit rules before entering, price, date, or condition that triggers the sell/stop; automate orders or authorize a trusted operator to execute.",
        "Hold 12 months of core expenses in cash equivalents; top it up before starting any new speculative play.",
        "Run a weekly 60-minute war-room: review pipeline, cash in/out, top three risks; close one invoice or cut one drag each session.",
        "Use contracts, not goodwill: clear scope, milestones, payment terms, and late penalties; insist on partial upfronts.",
        "Build two non-correlated income streams this year, one active, one semi-passive, and block recurring calendar time to maintain each.",
      ],
    },
    天机: {
      paragraphs: [
        "In this decade, your money moves with your mind. You’re the one who spots inefficiencies, strings systems together, and profits not from force but from timing, angles, and clever tweaks. You wake with ideas, new funnels, pricing switches, partnerships that unlock distribution. Yet the same mind that finds openings also questions everything. Stability calls; novelty seduces. You crave a dependable base while your fingers itch to optimize, pivot, try “just one more tool.” This is the push-pull of Tian Ji in 大财: fortune through intelligence, volatility through overthinking.",
        "You’ve lived the rhythm: a burst of wins when a plan clicks, then a scatter of half-built experiments. Tabs of spreadsheets, dashboards, alerts; the thrill of outsmarting a market followed by the grind of maintaining it. Friends see you as resourceful; you see the hidden gaps, fees nibbling, subscriptions stacking, deals that should have been tighter. At night you connect patterns, sensing windows open and shut faster than others notice, worried that choosing one lane means losing all the rest.",
        "This cycle will reward a strategist who builds a reliable engine and tests at the edges, not a tinkerer who rebuilds the car each lap. Treat money as an algorithm: design rules once, refine on a schedule, and let compounding do its slow magic. Without rules, small leaks will quietly sink big ships. Build the scaffolding now, or the decade will keep you sprinting while your accounts stand still.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-sentence money thesis; say no to anything that doesn’t serve it for 90 days.",
        "Use a 70/20/10 split of effort and capital: 70% proven engine, 20% optimization, 10% experiments; review monthly.",
        "Create a pre-commit checklist (edge, downside, time-to-cash, control); enforce a 24-hour cooling-off on new deals or trades.",
        "Lock in baseline income: retainers, subscriptions, or payment plans that cover essentials before you scale experiments.",
        "Automate cash flow: three accounts (operating/tax/reserves), weekly auto-transfers; cap tool spend; audit subscriptions quarterly.",
        "Document your playbook; template proposals, delivery, invoicing; hire a 5-10 hr/week ops assistant once baseline is met.",
      ],
    },
    右弼: {
      paragraphs: [
        "You’re the quiet connector who makes money move by making people feel seen. Deals soften when you enter the room, introductions blossom into opportunities, and you hold the web so others can shine. Yet inside, there’s a tug: you crave prosperity that feels gracious and human, but you’re tired of discounting, waiting to be paid, or being the helpful bridge while others walk across with heavier pockets. You hate confrontations about money, then resent the heaviness that follows your polite yes.",
        "This decade spotlights relational wealth. Benefactors, loyal clients, and joint ventures line up when you attach clear value to your support. Your kindness is a currency, only if it has a price and a boundary. Think curated alliances, elegant service, and revenue shared on written terms. Let goodwill become a system: standard offers, clean contracts, prompt collections, warm follow-ups. Choose partners whose integrity matches yours, and your soft power turns into steady cash flow. The invitation is simple and brave: speak plainly about value, accept only fair exchanges, and let your grace be strategy. Do this, and the decade compounds quietly in your favor.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Publish a one-page offer menu with three clear tiers, fixed scope, and payment terms (deposit required; no work before funds clear).",
        "Set a monthly “pro bono/favor” cap and track it. When it’s used up, offer a paid slot or a future waitlist date.",
        "Stop unsecured lending and guarantees. If you choose to help, treat the amount as a gift and keep it small.",
        "Turn collaborations into contracts: define roles, revenue split, milestones, and an exit clause before any work starts.",
        "Replace hints with direct asks: send concise proposals within 24 hours of interest, listing price, deliverables, and start date.",
        "Schedule a weekly pipeline hour: contact five warm allies and two new connectors with a specific offer or referral request.",
      ],
    },
    左辅: {
      paragraphs: [
        "You’ve long been the quiet backbone in money matters, the one who makes scattered numbers sit up straight. People hand you their tangled budgets and breathe easier after your calm call, yet a small ache follows: why does the treasurer go home last and paid least? You crave solvency and order, but hesitate to ask in full for what your steadiness is worth. You want to build reserves, yet you end up rescuing others, promising it’s fine while your own plans wait. Inside, there’s a push-pull: the pride of being reliable against the fatigue of being perpetually on call.",
        "This decade turns that reliability into capital. Zuo Fu in Da Cai favors ledgers, evidence, and alliances: wealth that grows from clear systems, written terms, repeatable services, and relationships with professionals who respect boundaries. When scope is defined, deposits taken, and a paper trail kept, money stops slipping through the cracks and starts compounding. Your gift is not flashy risk; it’s building the rails, cash-flow maps, calendars, reconciliations, so value can move cleanly. Negotiation becomes an act of care; agreements protect your heart as much as your wallet.",
        "Say no to messy rescues dressed as opportunities. Decline family loans without terms. Price your steadiness like the asset it is, and let systems speak for you when your voice wavers. If you keep saving everyone, you’ll end this decade tidy, respected, and strangely empty-handed. Choose instead to step from helper to partner. Put numbers to your boundaries, and let consistency earn interest on your behalf. The harvest is patient but certain when you honor your structure.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Publish a rate card with minimums; send before work; require 30-50% deposits on every project.",
        "Create a four-account flow: Income, Taxes (set 30%), Operations, Profit; automate transfers twice monthly.",
        "Hold a monthly close: reconcile accounts, build a 90-day cash forecast, cancel one low-ROI expense immediately.",
        "Use written scopes for all favors, even family: deliverables, timeline, payment terms, and late fees.",
        "Book quarterly meetings with your accountant or financial planner; set one leverage move each quarter and execute.",
        "Cap unpaid help at two hours per week; beyond that, convert to paid or decline after a 24-hour pause.",
      ],
    },
    文昌: {
      paragraphs: [
        "Your mind catalogs numbers and narratives at the same time: you see budgets as stories, invoices as punctuation marks. You polish spreadsheets until they gleam, then hesitate to press send on the proposal that could change everything. You crave clean lines, clear pricing, tidy ledgers, elegant systems, yet your curiosity keeps opening new tabs, courses, and ideas. Negotiation feels safer by email than in a crowded room; you’d rather craft a perfect paragraph than make a messy ask. You know your expertise is valuable, but you still understate it, hoping the right clients will just see it. The push-pull is real: gather more information, or draw a bold line and charge for the clarity you create.",
        "With Wen Chang  in 大财, the decade rewards intellect turned into income and order turned into scale. Doors open through proposals, teaching, documentation, and thoughtful contracts. Money grows when your knowledge becomes products, retainers, and repeatable systems, not when you endlessly rename files. Keep the grace of your words, but marry them to decisive launches, floor pricing, and crisp scopes. If you procrastinate by perfecting, the leak is silent but costly; if you ship, even imperfectly, refinement can follow. This is an invitation to be paid for thinking and clarity. When you say the number out loud, automate the flows, and publish the work, wealth stops hiding and starts compounding.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a pricing floor: calculate your true hourly equivalent, add profit, and refuse work below it, politely, in writing, every time.",
        "Block a weekly Ship Hour: send a proposal, publish a paid offer, or launch a micro-product. No edits after the timer ends.",
        "Install contract hygiene: deposit upfront, clear scope and change fees, payment dates on calendar reminders, and a standard kill-fee clause.",
        "Build one flagship knowledge asset: a guide, course, or toolkit. Three 90-minute sessions weekly, fixed launch date, pre-sell to validate.",
        "Automate money ops: split income on arrival into tax, profit, and operating buckets; reconcile weekly with a single live dashboard.",
        "Replace overthinking with rules: 70% clarity = decide; timebox research to two hours; iterate after feedback, not before.",
      ],
    },
    文曲: {
      paragraphs: [
        "You want to be paid for your mind, your taste, your way with words. Money arrives when you speak or write with feeling; it drifts when you hesitate, polishing the same paragraph or redesigning the deck. You crave security yet resist being boxed in, torn between the careful steward and the romantic who believes the right phrase can solve everything. You overinvest in books, courses, beautiful tools; you undercharge for the thing only you can do. When clients praise your sensitivity, you say yes too quickly, then wonder why the numbers don’t match the admiration. Underneath is this truth: income reflects your ability to give your gifts a simple home and a clear price.",
        "It sounds like deals born over coffee and trust, scope written on napkins, invoices sent late because you’re still “making it perfect.” You know audiences would pay for your frameworks, but you keep customizing, rewriting, drifting. This decade wants translation: turn nuance into assets, courses, retainers, royalties, licensing; let story invite, let structure hold. Pair your lyrical talent with a small, boring system that never forgets to bill, follows up without emotion, and protects your time. When you stop selling hours and start selling outcomes, your art stops leaking and starts compounding.",
        "The promise here is elegant prosperity: fewer offers, deeper mastery, money that repeats because value repeats. You do not need to shout; you need to ship, name, and nail your lane. Stewardship is not the death of romance, it is the frame that keeps the painting safe. Choose discipline as devotion, and let your words mint lasting wealth.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Ship weekly on Tuesdays before noon; 90-minute block; publish at 80% done, no “final polishing.”",
        "Productize your work into three named packages with fixed scope; no custom projects unless +40% premium.",
        "Price by outcomes, not hours; set a floor rate; build one new case study and two testimonials each quarter.",
        "Contracts first: 50% upfront, 30% midpoint, 20% delivery; scope in writing; invoice same day; auto-remind; 2%/month late fee.",
        "Capture and compound IP: record every talk; transcribe within 72 hours; turn into a newsletter and one flagship guide per quarter; add licensing terms.",
        "Run money like a studio: separate account; allocate 30% taxes, 10% reserves; Friday finance date to review leads→proposals→wins; cancel two low-ROI subscriptions.",
      ],
    },
  },
  大疾: {
    紫微: {
      paragraphs: [
        "You wear composure like a crown, issuing orders to days that would buckle anyone else. Yet the body has started negotiating in whispers: a tight chest at 2 a.m., jaw clenched on the commute, energy that looks impressive to others but feels like credit you haven’t repaid. You keep a brave face, because leaders don’t falter, until leadership becomes an armor that pinches. In this decade, your strength and your strain share one root: the instinct to take charge. You want to command your health the way you command a room, but willpower can’t outvote biology. The deeper truth: your body doesn’t need a ruler; it needs a wise sovereign who listens before decreeing.",
        "This cycle asks you to be the CEO of your wellbeing, not the hero of last-minute rescues. The ‘big health’ arena becomes your throne room: build an inner council, set clear policies, audit stress, and enforce rest with the same gravity you give deadlines. If you honor the cadence, sleep, mobility, blood pressure, breath, your vitality ascends and your presence softens into authority without edge. If you brush off the signals, the body will stage a coup: forced downtime, fog, snap decisions you regret. The crown will feel lighter if you let others carry parts of it. Ignore the summons and the lesson arrives louder. Heed it now, and you lead longer, cleaner, and with a heart that stays open.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Schedule a full baseline: lipids, A1c, thyroid, ferritin, vitamin D, and a home blood pressure log for 30 days.",
        "Assemble an inner health council: primary care, physical therapist, and nutrition pro; book recurring check-ins now, not after a crisis.",
        "Block two non-negotiable recovery windows weekly (no screens, no work) and protect them like revenue meetings.",
        "Cap caffeine by noon; swap one high-intensity session for strength + mobility three times a week with a deload week every 6-8 weeks.",
        "Create a simple health dashboard (sleep hours, steps, BP, mood); review every Sunday for 15 minutes and adjust one behavior.",
        "Before any major medical or workload decision, sleep on it 24 hours; if symptoms persist beyond two weeks, escalate and get a second opinion.",
      ],
    },
    破军: {
      paragraphs: [
        "You carry a warrior’s instinct in your body: when something feels stuck, you want to break it open and start anew. In this decade your health is the battleground and the forge. You run hot, push past signals, then crash, promising yourself you’ll be smarter next time. You call it stamina; your body calls it negotiation under duress. Pain becomes proof you’re alive, and extremes feel cleaner than moderation. You go all in ,  fasting hard then feasting, training until something tweaks, living on caffeine and sharp edges ,  because slow, quiet tweaks feel like surrender. Scars, old injuries, gut flares, stubborn tension in jaw, neck, or lower back: these are the maps of how you’ve fought.",
        "Po Jun in the health seat wants demolition with a blueprint. The invitation is fierce compassion: cleanly end what corrodes you, and replace it with systems that can take a hit. Choose decisive interventions early ,  screening, imaging, a surgery you’ve delayed, dental work, physical therapy ,  before a crisis makes the choice for you. Build strength and mobility as armor, not punishment. Replace stimulants with structure: protein at breakfast, water and electrolytes, sunlight in the morning, a hard lights-out. Your body is asking for sovereignty through boundaries: workload caps, tech curfews, time to downshift after 8 p.m. Craft a crisis plan now ,  doctor, therapist, two friends on speed dial ,  so urgency doesn’t rule you later. This decade rewards clean cuts and steady rebuilding; it punishes bravado and half-measures. Choose the cut before it chooses you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Book baseline labs: CBC, CMP, lipids, A1c, thyroid, vitamin D; repeat every 12 months.",
        "If pain or a symptom persists beyond 7 days or returns 3 times, get imaging or a specialist referral.",
        "Cap caffeine at 200 mg before noon; skip energy drinks; drink 2-3 liters of water with electrolytes daily.",
        "Train 3 days/week: compound lifts plus mobility; 1 day/week zone-2 cardio; deload every 6 weeks.",
        "Set hard boundaries: no work messages after 8:30 p.m.; phone out of bedroom; lights out by 11 p.m.",
        "Make decisions cleanly: schedule the deferred procedure or therapy within 30 days; cancel the draining commitment.",
      ],
    },
    天府: {
      paragraphs: [
        "You are the quiet vault everyone trusts. In a crisis you tidy the mess, pay the unseen costs, and keep the lights on. Outwardly steady, inwardly you stash worries like coins, little by little the body holds the weight of promises you never cashed. Comfort becomes a cushion: a late snack, extra scrolling, another responsibility you didn’t want but took because you could. You crave ease yet sign up for duty. You want softness yet armor up. With Tian Fu sitting in the Health palace for this decade, your system prefers stability and storage, of resources, of schedules, of feelings. That gift turns heavy when you store what should move. You don’t break; you sediment.",
        "This cycle asks you to become a kind treasurer of your vitality: build reserves without hoarding, offer support without self-depletion, choose consistent, boring rhythms over heroic sprints. Your body responds best to regularity, sleep that repeats, meals that don’t argue, movement that happens even when unimpressive. Boundaries are medicine disguised as manners. Paperwork, finances, and space clearing lighten the mind more than you expect. When you treat energy like capital, budgeted, buffered, and re-invested, your steadiness turns magnetic rather than heavy. People still lean on you, but you’ll have shelves instead of shoulders.",
        "Here’s the rub: if you keep cushioning feelings with indulgence or filling silence with work, the ledger won’t balance. The body will collect interest, and the cost shows up when it’s least convenient. Take the hint while it’s gentle. Reorganize now, or be reorganized later.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Lock in annual health check-ups, pick a recurring month and book next year’s before you leave the clinic.",
        "Protect sleep: fixed lights-out and wake times at least 5 nights/week; charge your phone outside the bedroom.",
        "Move daily, schedule a 25-minute brisk walk after lunch or dinner; treat it like a meeting you can’t skip.",
        "Run a comfort audit: track snacks, scrolling, and spending for 7 days; replace one daily numbing habit with a calming one (tea, stretch, call a friend).",
        "Practice clean boundaries: say, “I can’t take that on right now,” once a week; delegate one task or drop it entirely.",
        "Build reserves: set an automatic transfer to a buffer fund each payday and keep two 30-minute buffer blocks in your calendar each day.",
      ],
    },
    廉贞: {
      paragraphs: [
        "You’ve been the one who keeps moving even when the body throws sparks. Some days you wake sharp; others, drained or irritable, skin flares, tightness in the chest or temples, sleep that looks like sleep but doesn’t restore. You bargain: another coffee, one more late night, you’ll make up for it tomorrow. Then the crackdown, detox plans, strict routines, hard workouts, until the pendulum swings back. Under it is a fierce need to stay in control, pressed against a body that refuses to be ruled by force. The more heat you carry, anger swallowed, deadlines stacked, pleasure used as numbing, the louder the signals. And yes, little cuts and procedures seem to anchor the timelines of this decade, as if your body signs contracts in scars.",
        "This ten-year cycle asks for a different kind of power: not speed, but governance. With Lian Zhen in Da Ji,set clear rules and boundaries. If you prune toxins, cool the system, and build strength methodically, your vitality becomes steel, steady, not spiking. Ignore it, and pressure will gather until the body halts negotiations on its terms. Choose craft over chaos. Design a body that can hold your ambition without burning you from the inside out.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Book a full checkup: CBC, lipids, liver enzymes, fasting glucose/A1C, ferritin, thyroid; repeat annually.",
        "Lock a sleep window (e.g., 10:30-6:30). Screens off 60 minutes prior. Dark, cool room. Protect it.",
        "Do strength 3x/week and zone-2 cardio 2x/week. Pain over two weeks? Stop guessing, see a clinician and rehab.",
        "30-day reset: no alcohol or late-night eating; halve ultra-processed foods; 30-40g fiber; 2L water daily.",
        "Practice heat release: 10-minute evening walk, longer exhales, write the unsent anger letter; set one firm no weekly.",
        "Reduce load on liver/skin: limit fragrance-heavy products and new supplements; discuss omega-3/probiotics with your provider.",
      ],
    },
    太阴: {
      paragraphs: [
        "You look steady to others, but inside you move like tides. Nights pull you open, ideas flow, compassion swells, and yet the morning leaves a quiet ache: puffy eyes, foggy focus, small pains that don’t justify a doctor visit but refuse to leave. You keep showing up, turning down your needs so others feel safe. The hidden truth is lunar: your system is sensitive to light, stress, and unspoken feelings. When you override your rhythms, your body answers with subtle alarms, bloating, headaches, mood dips, erratic energy.",
        "This decade places health where emotions pool. Sleep gets bargained away. Cravings rise late. Water lingers in ankles and face after long days; the chest feels tight when you swallow resentment; warmth helps, cold and damp sap strength. If you menstruate, cycles may swing or pain spikes when you push too hard. If you don’t, moods still move in phases, and strain shows through skin, eyes, and digestion. You want to retreat and reset, yet you fear slowing means failing. You nurse everyone and then wonder why you’re empty.",
        "Tai Yin asks you to mother yourself first. Moonlight heals when protected; it harms when exposed too long. Honor your cycle and you’ll feel the shift, steadier hormones, clearer skin and eyes, calmer nerves, deeper sleep, kinder boundaries. Ignore it, and the whispers harden into diagnoses, the occasional crash becomes a pattern. The window is now: choose softness as strategy, or your body will choose it for you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Protect sleep: fixed window 10:30 pm-6:30 am; 90-minute digital sunset; morning light before screens.",
        "Schedule labs: thyroid panel (TSH, free T4/T3), ferritin, vitamin D, fasting glucose; track fatigue, sleep, and cycle/mood for 4 weeks; bring notes to a clinician.",
        "Rehydrate smarter: 2 liters water daily; add a pinch of salt or electrolytes once a day; stop caffeine after 2 pm; alcohol no more than two evenings a week.",
        "Move like water: 30-45 minutes daily walk, swim, or Pilates; stop at pleasant warmth, not exhaustion; stretch hips and chest for 5 minutes before bed.",
        "Eat to steady the tide: warm, regular meals; protein each time; cooked greens; a light soup at night; no heavy meals within 3 hours of sleep.",
        "Set caring boundaries: decline late-night favors; cap caretaking hours on your calendar; ask one person each week for help; say “I need rest” without apology.",
      ],
    },
    贪狼: {
      paragraphs: [
        "You crave the spark that makes life feel turned up to eleven, late conversations, rich food, a thrill that says yes before the body can vote. Then comes the quiet bill: wired at 2 a.m., heavy at 7, skin that erupts after a “harmless” binge, a gut that flips when you rush meals, a heart that sprints when the inbox does. You can charm a room and outrun fatigue with adrenaline, yet your body has started to bargain, one more high, one more dip. You know this push-pull: appetites promise aliveness; recovery steals your mornings.",
        "With 贪狼守大疾, your health is tied to desire, reward, and rhythm. You’re not fragile, you’re responsive. Channel it and you purify through sweat, dance, breath, and art; choose intimacy with discernment and your hormones settle; create ritual and cravings lose their teeth. Ignore it and the shadow grows: dopamine loops, performative nights, stimulants by day, alcohol by night; the liver heats, the gut protests, the skin signals, sleep fragments. Small neglect becomes long shadow. Your body is asking you to lead, not be led, by what feels good in the moment.",
        "This decade isn’t about puritan rules; it’s about sovereignty. Set a tempo your blood can trust. If you choose your rituals, pleasure deepens and repairs; if you don’t, your body will set limits for you, with headaches, labs you don’t like, and a mood that frays at the edges. Take this as a clear warning and a generous invitation: claim the stage before your health writes the script.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a hard lights-out time five nights a week; protect one late night only.",
        "Cap alcohol at two drinks, three nights max per week; log it in your calendar.",
        "Lift weights 2-3 times weekly and sweat 20 minutes; walk 8,000-10,000 steps daily.",
        "Run labs now and in six months: liver enzymes, lipids, fasting insulin, A1C, thyroid, sex hormones.",
        "Do a 10-day reset each quarter: no alcohol, added sugar, or fried foods; track sleep and skin changes.",
        "Replace two late outings per week with early dinners or daytime meetups; leave by a set time without debate.",
      ],
    },
    巨门: {
      paragraphs: [
        "This decade, your body is a courtroom and your symptoms are witnesses that won’t stop talking. The throat tightens after certain conversations, the stomach knots when you swallow a truth, sleep splinters when your mind replays arguments that never found daylight. You are sharp, observant, and a little haunted by the feeling that something important is hiding in the shadows. You research at 1 a.m., oscillate between calm and flare-ups, and tell yourself you can power through, while your body asks to be heard, not out-thought.",
        "With Ju Men in Da Ji, the mouth, voice, and digestion become the stage where your inner debates show up as physical echoes. Unsaid words tend to ferment in the gut; sharp words can burn the throat; too many opinions become a noise that spikes stress. Yet this star also gives you a gift: the ability to trace threads others miss. When you speak plainly, simplify inputs, and track cause and effect, your system steadies. What you need is not more theories, but cleaner signals, clearer routines, fewer contradictory voices, and honest sentences that unclench the body.",
        "If you keep trying to win with willpower alone, the symptoms may grow cleverer than your logic. Let this be the decade you turn your investigative mind into care: choose one guiding plan, quiet the late-night debates, and treat your body as a conversation partner, not an opponent. If you keep swallowing your truths, the body will keep speaking louder. Do not let silence become a symptom.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Keep a 30-day body log linking food, conversations, sleep, and symptoms; review each Sunday to circle the top two triggers.",
        "Say the thing directly: set time boundaries like “No heavy talks after 9 pm,” or “I need a pause,” to protect sleep and digestion.",
        "Consolidate care: pick one primary clinician, create a one-page health timeline, and bring it to every appointment.",
        "Limit input noise: choose two reliable health sources; mute argumentative chats and unfollow doom-scroll feeds for 60 days.",
        "Set a nightly shutdown: 10-minute worry-on-paper timer, phone out of the bedroom, lights out by 11 pm, same time daily.",
        "Eat for calm: finish dinner 3 hours before bed, avoid debates while eating, chew thoroughly, and take a 10-minute walk after meals.",
      ],
    },
    天同: {
      paragraphs: [
        "You crave a life that feels soft on the skin and kind to the nerves. You are the one who brings warmth, snacks, gentle words, and a calm corner when storms hit. Yet inside, there is a tug-of-war: the body begging for naps and warm soups while the mind whispers you should be tougher, faster, busier. You self-soothe with sweetness, screens, and late nights that feel merciful in the moment but leave a quiet heaviness ,  bloat after rich meals, fog in the morning, a swollen edge after too much salt or sitting, tension that unravels briefly with comfort and then returns. You know rest is medicine, but you fear becoming too comfortable to move.",
        "This decade asks for a wise redefinition of comfort. With Tian Tong in the Health palace, healing comes not from force but from steadiness, tenderness with a spine. Your body responds to rhythm: consistent sleep and mealtimes, warm and simple foods, low-gentle movement, boundaries that protect downtime. Think comfort that heals versus comfort that numbs. The small neglects ,  skipping water, grazing at midnight, postponing checkups ,  can quietly grow. But small mercies offered daily become repair. Let softness lead, and then add structure. When you let rest be intentional and pleasure be clean, your mood evens, digestion steadies, and energy lifts. This is not a sprint; it is a season of choosing tender discipline. Walk it, and by the end of this cycle you feel lighter, clearer, and safely at home in your own body.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a fixed sleep window for 90 days; lights dim one hour before, phone parked outside the bedroom.",
        "Eat on a simple rhythm: three real meals, minimal grazing, warm dishes; stop food two hours before bed.",
        "Before comfort snacking, pause 90 seconds for a body scan and drink a mug of warm water; then decide.",
        "Book preventive care now and put reminders in your calendar: annual physical, dental, eyesight, basic labs.",
        "Walk 20-30 minutes daily, ideally after a meal; add 5 minutes of gentle stretching before sleep.",
        "Protect rest with a clear no: decline late requests and schedule weekly time by water or a bath for decompression.",
      ],
    },
    天相: {
      paragraphs: [
        "You’re the composed one who keeps the room civil, the quiet stabilizer. Yet your body knows the price of holding everyone’s balance. The shoulders that harden when a meeting runs long, the knot in your gut when you agree to something you didn’t want, the shallow sleep after playing mediator again. With Tian Xiang in the Health palace this decade, the hidden truth surfaces: you absorb chaos so others can breathe, then tell yourself you’re fine. Calm on the outside; inside, a meticulous judge tallying every small overreach ,  and it tallies in your nerves, digestion, and breath. This cycle spotlights not ‘illness’ as fate, but maintenance as sovereignty: how well you govern the borders of your time, your rest, your inputs.",
        "Tian Xiang thrives on clean processes and fair rules. Give yourself structure and you recover; drift into pleasing and leaks appear. Your lesson now is deceptively simple: consistent, boring protections beat dramatic fixes. Notice the tells when you cross your line, repair quickly, and let your rituals do the heavy lifting. Ignore them, and small frictions calcify into patterns that color the decade. Choose the dignified kind of care ,  the kind that prevents the storm instead of mopping after it. If you keep smoothing life for others while skipping your own reset, the bill will arrive with interest. Don’t wait.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Block two weekly “no-serve” hours; no favors, no screens. Walk, stretch, nap, or read slowly.",
        "Keep a nightly body ledger: rate energy, mood, and stress 1-5; note the trigger; review Sundays.",
        "Practice one clean refusal per week: “No, not this week.” No apology. No explanation.",
        "Pre-book maintenance: annual physical, dental, vision, and one therapy consult. Put dates on the calendar now.",
        "Install a shutdown ritual: write tomorrow’s top three, warm shower, lights low, screens off 60 minutes.",
        "After any big push or travel, schedule recovery equal to 10% of the time spent. Protect it.",
      ],
    },
    天梁: {
      paragraphs: [
        "You’re the reliable shelter, the one who holds the sky when others can’t. On the outside you’re composed; inside, your body keeps whispering: that stubborn fatigue, the tight chest that loosens only after a deep sigh, the gut that protests when you power through one more task. You promise yourself rest after the next crisis, then another arrives and you make yourself useful again. The push and pull is real: your heart wants to protect everyone, while your body asks to be protected by you.",
        "With Tian LIang in the Health palace this decade, there is blessing in durability, longevity born from steadiness, not luck. This star doesn’t usually bring dramatic breakdowns, but it does mark “old issues that linger” when neglected: digestion, skin flare-ups, blood sugar creep, tension that hardens into joints and sleep that grows shallow. The cure is not heroic; it’s rituals, boundaries, and seasoned guidance. Let elders, mentors, and trustworthy clinicians become your canopy while you become a devoted steward of your routines. If you keep playing invincible, small problems lengthen into long shadows. Your body is negotiating with you now, answer, or it will close the deal without your consent.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Book baseline screenings this quarter: CBC, CMP, HbA1c, fasting lipids, TSH and Free T4, vitamin D, liver/kidney function, hs-CRP, and age-appropriate cancer screenings. Keep results in one folder and set 12-month reminders.",
        "Set a strict sleep window: devices off by 9:30 pm, lights out by 10:30 pm for 90 days. Use a wind-down alarm and a paper book beside the bed.",
        "Eat on a schedule: three meals, 12-hour overnight fast; half the plate vegetables and 20-30 g protein per meal. Track triggers for two weeks (alcohol, late spice, dairy) and remove the top two.",
        "Walk 30 minutes in morning light five days a week to reset circadian rhythm; add two strength sessions weekly to protect joints and bones.",
        "Delegate two recurring caregiving tasks this month. When asked for more, reply with a boundary: “I can help Saturday 10-12,” and schedule a one-hour recovery window after any crisis.",
        "Create a flare plan: list early signs (migraine aura, gut cramps, rash), first-line steps (hydration, meds, heat/ice), and who to call. Store it in your phone and share it with one trusted person. Seek a second opinion before any invasive procedure, ask: What if we wait 3 months? Noninvasive options? Absolute risk reduction?",
      ],
    },
    武曲: {
      paragraphs: [
        "In this decade, your toughness becomes both shield and trap. You hold pain like a secret, finish the shift, hit the target, deal with the body later. Later rarely comes. You call it discipline; your body hears siege. The joint you “walk off,” the tight chest you breathe past, the dryness you blame on weather, quiet receipts of over-control. You want clean lines, measurable progress, a body that obeys. Yet at 2 a.m., the pulse ticks louder, sleep thins, recovery feels delayed, not broken, just slower, and the margin is shrinking. You don’t want sympathy. You want a plan that respects your seriousness without asking you to become soft or vague.",
        "Wu Qu in Da Ji asks you to run health like a maintained asset: fortify the frame (bones, teeth, joints), protect metal organs (lungs, skin), and keep the invisible ledgers honest (pressure, lipids, glucose). Build strength with structure and leave room for repair, and you become harder to break and faster to heal. Grind without audits, and problems arrive quietly, then all at once. The choice is stark: schedule maintenance, or your body will schedule it for you, on its terms, at the worst time. Take the helm now. Precision, routine, and small, unskippable rituals will do more than heroics. Ignore the whisper, and the shout will be costly.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Book an annual full-systems check: basic bloodwork (complete blood count, metabolic panel), cholesterol, A1c, thyroid, and blood pressure; add a bone-density scan if 40+ or family risk. Put the dates in your calendar today.",
        "Strength-train 3 days/week with progressive loads; stop 2 reps before failure, go lighter every 4th week, take 2 rest days, and protect 7-8 hours of sleep nightly.",
        "Set floors, not ceilings: 8,000 steps/day and 2 minutes of mobility each working hour. If pain lasts longer than 14 days, book a physiotherapist instead of pushing through.",
        "Guard lungs and skin: 5 minutes of nasal-breathing walks daily, humidify dry rooms, apply SPF each morning, moisturize after showers, and cut caffeine after 2 p.m.",
        "Eat for repair: 1.6-2.0 g protein per kg body weight, fish or omega-3s 2-3 times/week, 2 to 3 liters of water with electrolytes; keep weekdays alcohol-free.",
        "Lower the armor weekly: ask for help on one small task, and write the worry sitting in your chest; choose one concrete action and do it within 24 hours.",
      ],
    },
    七杀: {
      paragraphs: [
        "You wear pain like armor, moving fast and tight, telling yourself you’ll fix it later. When stress spikes, you clamp down, push harder, and the body answers with sharp, decisive signals: a stabbing headache, a tendon that suddenly talks, a gut that goes on strike. You don’t like being at the mercy of symptoms, so you outpace them ,  caffeine, late nights, heroic effort ,  and for a while it works. Then comes the crash you didn’t schedule. Underneath is heat: anger stored in muscle, vigilance in your jaw, sleep that starts late and never sinks deep. You distrust fragility, so you keep marching. But the Health palace this decade is a battlefield, and force without strategy only creates new scars.",
        "This cycle wants you in command, not in combat. Your body responds brilliantly to clear orders: measured intensity, strict boundaries, quick decisions followed by full recovery. Expect decisive chapters ,  a procedure, a rehab, a dramatic reset ,  that go well when you plan them and poorly when you wing them. The rule is containment: surge, then stand down; precision fuel, then rest; no bravado with red flags. If you lead, your system forges resilience: clean power, cleaner labs, steady sleep. If you ignore, acute becomes chronic, and a preventable nick becomes a rupture. The body will win the argument eventually; better to sign the treaty now than be dragged to it by inflammation, pressure, or pain.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set standing checkups: quarterly vitals; semiannual labs (CBC, lipids, A1c, liver enzymes); annual dental/skin/eye.",
        "Train like a commander: 3 strength + 2 low-impact cardio weekly; deload week every 8-10; 10-minute warm-up.",
        "Use a pain protocol: pain >4/10 or tingling/swelling >48h? Stop, modify, and book assessment within 72h.",
        "Lock sleep/caffeine: max 250 mg caffeine before noon; lights out 23:00 five nights; phone outside bedroom; mouthguard if clenching.",
        "Reduce inflammation: protein each meal; double vegetables; omega-3 2 g/day if cleared; alcohol ≤3/week; 2-3 L water.",
        "Before any procedure, get a second opinion; write a recovery plan, supports, and time off; 24-hour cool-off on big decisions.",
      ],
    },
    太阳: {
      paragraphs: [
        "You’ve learned to be the daylight for others: reliable, warm, available. Yet your body knows the cost. You keep the smile, but the temples throb, eyes sting, sleep runs hot and shallow. You power through colds, meetings, family needs, promising yourself you’ll rest later. You want to give more, but you secretly crave a room with the lights off. This decade pulls you between shining brightly and burning clean. The tension is simple and brutal: will you keep proving you can carry the load, or start tending the engine that carries you?",
        "Tai Yang in the health seat asks for rhythm, not heroics. Suns rise, peak, and set; they don’t hold noon forever. When you pace your effort, your warmth steadies, patience returns, and your vision sharpens. If you ignore the whispers, heat becomes inflammation, irritability, and fractured sleep, and the people you protect will feel the flicker. This is a decisive ten years: design your energy, or be designed by duty. Don’t wait for a blackout to notice the grid; choose habits that make your light sustainable and your influence kinder.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Anchor your circadian rhythm: 10-15 minutes of morning sunlight; no bright screens 60-90 minutes before bed; keep sleep/wake times steady; cool bedroom.",
        "Protect your eyes: follow the 20-20-20 rule each hour; schedule an annual eye exam; lower screen brightness; read on paper or e-ink at night.",
        "Train your heart, not your ego: 150-180 minutes of zone-2 cardio weekly, plus two strength sessions; finish workdays with 5 minutes of slow nasal breathing.",
        "Tame stimulants and heat: caffeine curfew at 2 p.m.; alcohol no more than two nights a week; hydrate 2-3 liters with electrolytes; pile on protein and bitter greens.",
        "Track what you lead: quarterly labs (blood pressure, lipids, A1c or fasting insulin, ALT/AST, thyroid, hs-CRP); if morning pulse rises 5+ beats for 3 days, deload a week.",
        "Put borders on the rescuer reflex: say “I’ll confirm tomorrow” before agreeing; block two rest evenings weekly; delegate one recurring task; choose three priorities each week.",
      ],
    },
    天机: {
      paragraphs: [
        "You live in a body that thinks. Under Tian Ji in the health palace, your nerves hum like a switchboard: brilliant, busy, changeable. Some days you’re sharp and fluid; other days a fog rolls in, sleep thins, the gut tightens, pains migrate like rumors. You track, tweak, and try to outsmart it, new supplements, new routines, new data, yet the more you chase certainty, the more it sidesteps you. This decade makes your body the messenger, not a machine to hack. The push-pull is real: control versus trust, optimization versus rest.",
        "Your gift is adaptability and keen observation. Small adjustments help you quickly, better light in the morning, steadier meals, a calmer evening, and your whole system steadies. But scattered tinkering frays you. The mind sprints; the body, built for seasons, asks for rhythm. Think of wind through trees: movement is natural; a storm is not. Choose fewer variables, longer time horizons, and honest baselines. Let steadiness, not novelty, be the experiment.",
        "Heed the warning: if you keep pushing through with clever fixes but no anchor, you risk burning the fuse, insomnia that sticks, anxiety that sets a hook, symptoms that change shape faster than a diagnosis can catch them. Don’t wait for a crisis to prove you’re serious. This is the decade to pace your brilliance, to measure, to rest on purpose. If you ignore the subtle signals now, they will speak louder later.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Lock a sleep rhythm: fixed wake time, screens off 90 minutes before bed, 10 minutes of morning light daily.",
        "Change one variable per month only; track a simple baseline before and after.",
        "Train steady: 3 strength sessions weekly plus 2 zone-2 walks; if sleep or HRV dips, reduce intensity for 7 days.",
        "Eat on rhythm: protein-rich breakfast within 90 minutes of waking; no caffeine after 11 a.m.; alcohol max two nights weekly.",
        "Install a daily stress offload: 20-minute worry window and 5 minutes of slow breathing twice a day.",
        "Get proactive care: quarterly check-ins, labs (CBC, CMP, ferritin, B12, vitamin D, thyroid panel, fasting insulin, lipids, hs-CRP), and a second opinion if symptoms persist beyond two weeks.",
      ],
    },
    左辅: {
      paragraphs: [
        "With Zuo Fu in your Da Ji decade, you’re the quiet fixer who keeps everyone else standing while your own body carries the unspoken load. You push through tight shoulders and shallow breaths, tell yourself it’s just a busy week, and serve one more person before you rest. Symptoms here don’t always roar; they whisper, spikes of fatigue, a buzzing mind at 2 a.m., little inflammations that ebb and return. The truth is tender: you function best when aided. Your body doesn’t need heroics; it needs steady, trustworthy support.",
        "This decade rewards structure, allies, and early intervention. Zuo Fu brings helpers, protocols, and checklists, the kind that catch issues before they become stories. When you let others assist and you follow simple routines, recovery becomes consistent rather than accidental. Think team medicine: a grounded primary doctor, one body practitioner for mechanics, one mind practitioner for stress patterns. Think small, repeated actions that compound. Soft discipline. Honest boundaries. The more you systematize care, the more energy returns to you.",
        "The warning is gentle but real: if you keep muscling through alone, the body will eventually schedule a pause you didn’t choose. The uplift is just as strong: if you let support in and ritualize recovery, this decade can be your rebuild, clearer mornings, steadier moods, a nervous system that doesn’t live on the edge. Choose assistance over stoicism; make healing a team sport, and your body will meet you halfway.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Book baseline labs this month: CBC, CMP, lipids, HbA1c, thyroid panel, ferritin, vitamin D/B12; set 6-month reminders.",
        "Assemble a care trio: primary doctor, one body practitioner (PT/chiro/osteopath), and one mind practitioner (therapist/coach). Save their contacts and follow-up cadence.",
        "Run a 2×2 weekly routine: two 30-40 min strength sessions and two 15-20 min mobility/breath sessions. Put them on your calendar like meetings.",
        "Track daily energy and stress (1-10). If either stays ≤5 for two days, reduce commitments by 20% for the next week.",
        "Set one boundary each week: decline an extra caretaking task. Use this script: “I want to help, but I’m protecting recovery. I can do X by Friday, not Y.”",
        "Create a recovery architecture: wind down at 9:30 p.m., screens off, caffeine cut by 2 p.m., alcohol ≤2 nights/week. Commit to a 30-day trial.",
      ],
    },
    文昌: {
      paragraphs: [
        "You know the body keeps notes on every thought. In this decade, your mind races to tidy life with research, routines, and perfect explanations, yet the shoulders stiffen, breath turns shallow, and the gut comments whenever a deadline nears. You search symptoms at midnight, promise to start a protocol tomorrow, then rewrite it the next day. You crave clean clarity but get caught in endless footnotes, smart, diligent, and a little wired. The secret tug: if you can name it, you can fix it; if you can’t, you stay awake. Wenchang in the Health palace spotlights the nervous system, throat, eyes, and digestion, places where overthinking quietly lands.",
        "The gift here is real: language organizes healing. When you track patterns, ask precise questions, and choose one simple plan, your system calms. But Wenchang also tempts “paper health”, beautiful spreadsheets, poor follow-through. This decade favors small, repeatable acts over grand redesigns. Protect sleep like a project, give your voice and breath daily attention, and let boundaries lower your inflammation. Appoint one clinician to steer, and bring tidy notes to every visit. If you keep thinking instead of practicing, whispers become habits; write a simpler script, then live it.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Keep a 2-minute daily body log: sleep, stress (1-10), meals, symptoms. Review weekly for obvious triggers.",
        "Set cutoffs: last coffee by 2 p.m.; screens off 60 minutes before bed; target 7.5 hours, five nights weekly.",
        "Block a 15-minute worry window daily; outside it, park concerns on paper and return only at that time.",
        "Do a 5-minute breath/voice drill twice daily: inhale 4, exhale 6, or hum slowly for five rounds.",
        "Hold a monthly health admin hour: file labs, update meds, list questions. Choose one primary clinician to coordinate.",
        "Write two one-line boundary scripts; use one each week to decline extra work or late-night chats.",
      ],
    },
    右弼: {
      paragraphs: [
        "You’ve spent years softening sharp edges for others, the quiet fixer who keeps the room calm. On the surface you look composed; underneath, your body tallies every swallowed “no.” In this decade, You Bi in Da Ji amplifies your helper’s heart and shows its price. When you’re seen and supported, your shoulders loosen and symptoms ease. When you smooth things over and hide your needs, your body tightens, whispers, then insists. The gift here: Zuo Fu brings kind hands, clinicians who listen, friends who check in, routines that cradle you, if you’ll let them.",
        "You might notice the pattern: a headache after you mediate, a tight chest the moment you agree to “just one more thing,” digestion that rebels in crowded weeks, sleep that thins when you’re carrying everyone’s feelings. Appointments go better now; people will take you seriously. Yet your habit is to be the “easy patient,” to minimize pain, to delay tests so no one has to fuss. The body speaks in tension, shallow rest, and odd flares. This decade sends helpers your way; your work is to accept help without explaining or apologizing.",
        "This is a growth cycle if you practice honest receiving and firm, simple boundaries. Otherwise, your kindness turns to erosion. The medicine is not heroic pushes; it’s clear requests and steady maintenance. Say what hurts, book what matters, and let others assist. If you don’t choose the boundary, your body will choose it for you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "At every appointment, state symptoms in plain numbers and examples; bring a written list and one key question.",
        "Today, schedule your annual physical, dental, eye exam, and one age/family-risk screening; put reminders on repeat.",
        "If a diagnosis stays vague after two visits or symptoms persist, request a second opinion, no apology, just clarity.",
        "Build a support bench: primary doctor, therapist or bodyworker, and one gentle movement class; save contacts in your phone.",
        "After heavy social or caretaking weeks, block 72 hours for recovery: decline new favors, sleep early, hydrate, eat simple, take light walks.",
        "Use this boundary script: “I can’t take this on; I’m prioritizing my health this month.” Repeat once if pressed, then end the call. Track one daily metric (sleep hours or energy 1-10); if it dips two days in a row, cut commitments by 20% and add a rest block.",
      ],
    },
    文曲: {
      paragraphs: [
        "You look composed, eloquent even when silent, but your body keeps the draft no one else reads. Feelings you edit out show up as tight jaws, fluttering heartbeats, a throat that closes when you swallow opinions. Sleep slips away on nights ideas pour in. Tests come back “normal,” yet you know something hums off-key, skin prickles after hard conversations, stomach wrenches before you must perform, energy swells then vanishes like a tide you can’t schedule.",
        "This decade pulls you between polish and pulse: the urge to perfect, and the body’s plea for warmth, water, and rest. You barter sleep for one more paragraph, soften edges with sweets or a drink, and scroll to numb the noise, then your neck seizes, eyes burn, mood thins. Wen Qu in the Health palace turns your system into a sensitive instrument; when you don’t speak plainly, it speaks for you. Yet the same sensitivity can heal you: rhythm over rush, truth over tactful silence, craft applied not just to work but to recovery. The more direct your voice, the fewer the mysterious twinges; the kinder your routine, the steadier your brilliance.",
        "Take the warning seriously: if you romanticize the grind, your body will write the consequences in brain fog, palpitations, and a gut that refuses compromise. This star was given to refine you, not to ruin you. Choose steadiness now, seek guidance, tune your days, let your words move before symptoms do, because the next stanza can be either your best work or your blood pressure reading.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a hard “lights down” routine: screens off 90 minutes before bed, no caffeine after 2 p.m., and be in bed by 11 p.m. at least 5 nights a week.",
        "Hydrate like it’s a job: 2 liters daily, start with warm water on waking, and favor warm meals/soups over cold snacks to steady digestion.",
        "Say one uncomfortable truth each day in plain words (to a person or on paper). Notice how your throat, jaw, and chest feel afterward.",
        "Protect your creative highs without sacrificing recovery: use a 45-60 minute timer at night; stop at the bell, leave a note for tomorrow, and close the laptop.",
        "Move gently, daily: 30 minutes of walking, swimming, or slow dancing; finish with 5 minutes of box breathing (4-4-4-4) and neck/shoulder stretches.",
        "Audit your chemistry: limit alcohol and added sugar to two evenings per week; book labs with a clinician (thyroid panel, ferritin/iron, vitamin D, A1C) and track energy/sleep for 30 days.",
      ],
    },
  },
  大迁: {
    紫微: {
      paragraphs: [
        "You’ve noticed how rooms subtly organize around you, the way conversations turn when you speak, the way crises feel smaller when you start naming the next step. Yet there’s a push-pull inside: you want to step into a larger arena, but you’re tired of carrying the whole arena on your shoulders. With Zi Wei in Da Qian this decade, the outside world treats you like a sovereign in transit: airports, boardrooms, unfamiliar neighborhoods, each one asks you to take the seat at the head of the table, even when you’d rather be unseen and at ease.",
        "You’ll be invited to bigger stages and farther distances. New cities will test your poise; strangers will become allies because you model calm. People will assume you know the map. Often, you do. But some nights the crown feels heavy: decisions stack, sleep thins, and you wonder if being the reliable one is a trap. The risk here isn’t failure, it’s isolation and rigidity. If you clutch too hard, the environment resists; if you perform an image, the right support won’t find you. What steadies you is not more effort, but cleaner agreements, portable systems, and a circle that tells you the truth.",
        "Take this as a coronation by movement, not a test of endurance. Make your throne portable: rituals that travel, boundaries that hold, language that asks for what you need. Lead with plain words, negotiate support, and let competence be matched with warmth. When you stand in that combination, the decade opens doors on time, and the weight you carry turns into gravity that draws the right people and places to you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-sentence charter: “For this decade, I lead X by doing Y.” Put it on your phone lock screen and use it to filter invites.",
        "Choose three non-negotiables you travel with (sleep window, movement, deep-work block). Block them in your calendar before accepting meetings.",
        "Build a portable war room: one notebook, a clean cloud folder, and a map of 20 key allies across cities; review and update every Friday.",
        "After each arrival or major meeting, run a 15-minute debrief: what worked, what to hand off, who to follow up. Send two decisive messages within 24 hours.",
        "Before accepting a bigger title, negotiate support in writing (assistant hours, budget, decision rights). If it’s not granted, narrow scope or pass.",
        "Host a quarterly salon in any new city: invite five thoughtful people, ask one brave question, and make one specific ask that moves your mission.",
      ],
    },
    破军: {
      paragraphs: [
        "You feel the horizon tugging at your bones. Rooms shrink fast; plans go stale the moment they’re agreed. Part of you craves a clean slate, the click of a suitcase, the sharp air of a new city, while another part worries you’re burning bridges faster than you can build them. People may call you restless, but the truth is clearer: you are allergic to dead ends. When the air stops moving, you move it. This decade amplifies that drumbeat. The outer world becomes a testing ground where closures arrive abruptly and openings appear just as suddenly, daring you to choose the door before it disappears.",
        "Po Jun in the movement realm tears up brittle maps. Expect relocations, industry pivots, border crossings, radical networks. The difference between liberation and chaos is intention. If you break with purpose, you claim territory. If you break in reaction, you scatter power. Your magnetism grows in unfamiliar places, with renegades, founders, immigrants, and outliers who speak fluent risk. Deals and alliances can spark hot and end fast, so keep endings clean and paperwork cleaner. Speed is your ally until it isn’t: accidents happen when you rush, drive angry, or decide at midnight. Your edge is real; so is the cost of swinging it without aim.",
        "Read this as a conqueror’s cycle, not a runaway’s. The world is offering you bigger ground if you’ll pick your arena, set your rules, and resource your moves. If you don’t, the changes will still come, only messier, with pieces of you left in every station. Choose your war. Fund it. Finish what you start.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Build a 9-12 month runway; keep a separate relocation fund you don’t touch.",
        "Choose your next city or industry with a written scorecard; commit to the top pick.",
        "Use a 72-hour rule before resigning, breaking up, or moving; sleep, confirm, then act.",
        "Close chapters cleanly: return items, settle debts, send one clear goodbye, archive documents.",
        "Travel like a pro: avoid night driving, duplicate IDs, insure gear, back up devices weekly.",
        "Join two builder/nomad communities; show up weekly and ask for one concrete collaboration.",
      ],
    },
    天府: {
      paragraphs: [
        "You’ve learned to be the steady one while the ground moves. Airports, new offices, packed boxes, a calendar stitched with meetings in places you don’t yet know the shortcuts for, and still you become the person who finds housing, makes the budget work, calms the team, locks the cabinet at night. Outwardly unflappable, inwardly you’re constantly running forecasts: What if this city isn’t it? What if I invest and have to uproot again? You crave a safe base, yet invitations keep arriving to carry bigger keys and manage larger rooms. Part of you wants to stay put; another part knows your influence grows when you bring order to unsettled spaces.",
        "With Tian Fu in the Da Qian palace, this decade asks you to be the vault on wheels, moving not for novelty, but to extend your stewardship. The external world will test and reward your ability to stabilize systems: cross-border mandates, platform-scale operations, assets that need a keeper. Doors open when you travel with terms, not with hope. Your presence turns temporary places into governed terrain; your name becomes the guarantee that things will be accounted for. Say yes where scale matches your standards, and insist on resources that let you build properly. Travel light in possessions, heavy in frameworks.",
        "Here’s the warning: if you cling to old routines or agree to “just help for now,” you’ll become the pack mule of other people’s chaos. Don’t trade loyalty for vague promises. Audit what you carry, set your price, and choose where to plant your flag. Otherwise, the decade will pass with you holding everyone else’s bags and none of the ownership.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Choose one home base and one frontier market; map an 18-month calendar with clear entry and exit checkpoints.",
        "Negotiate every move in writing, relocation budget, housing, KPIs, decision rights, and an exit clause, before you say yes.",
        "Run a quarterly inventory of projects, subscriptions, and roles; cut at least 20% that no longer compounds your goals.",
        "Build a 90-day landing playbook (stakeholder map, cashflow snapshot, vendor list, SOPs) and apply it to each new team or site.",
        "Convert caretaking into assets: ask for title upgrades, equity/revenue share, or a retainer tied to stabilization milestones.",
        "Set travel boundaries: cap days on the road, book two recovery days post-trip, and refuse extra tasks unless they’re resourced or paid.",
      ],
    },
    廉贞: {
      paragraphs: [
        "You’ve felt it for a while: rooms tilt when you walk in. You read the currents under people’s smiles, sense where the levers are, and want to reshape the rules instead of asking to play. Yet there’s a tug-of-war inside, craving reinvention while fearing the fallout of being too bold, wanting clean principles but drawn to charged arenas where influence, desire, and politics knot together. With 廉贞行于大迁, the world becomes your proving ground: new cities, new tables, new titles that say “lead” and “decide,” even when your heart whispers “be careful.”",
        "This decade pushes you onto roads where reputation is currency. You’ll be offered roles that require negotiation, crisis handling, and the courage to draw lines in public. Allies will appear in institutions and networks, not just friendships; the right handshake can open three doors, the wrong fight can shadow your name for years. You’ll notice temptations, fast alliances, intoxicating attention, shortcuts dressed as opportunity. Your edge is strategy and stamina; your trap is battling on too many fronts or letting heat override judgment.",
        "Choose your battlefields and write your code, or others will write it for you. Build quiet alliances, set exit clauses, and move in 90-day arcs so momentum compounds without chaos. Reinvent when it’s strategic, not as an escape. Keep receipts, keep your word, and keep your fire for fights that bend the future, not just the moment. Power will meet you in the open, just remember: if you don’t define your stance, the loudest rumor will.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a one-page operating code (non-negotiables, deal terms, personal boundaries) and review it on the first of every month.",
        "Before accepting any role or partnership, run a 24-hour due-diligence checklist: beneficiaries, worst-case scenario, exit terms, and reputational risk.",
        "Work in 90-day campaigns: pick one arena (city, industry, platform), set two measurable outcomes, review at days 30/60/90, then scale or exit cleanly.",
        "Make requests in three sentences: the goal, what you offer, and the boundary. No hints, no essays.",
        "Impose a 48-hour cool-off before sending confrontational emails or posts: draft it, sleep, show a neutral peer, then decide.",
        "Maintain a power map quarterly: list 10 stakeholders, schedule two value-first touches per month, and confirm every verbal agreement by email within 12 hours.",
      ],
    },
    太阴: {
      paragraphs: [
        "You’re the tide and the harbor at once, drawn to move, yearning to nest. In new places you read the room before anyone speaks, sensing undercurrents through a glance or tone. Crowds can feel loud in your body, yet distance gives you a clear, silver-edged voice. Night pulls your ideas to the surface; your gentleness becomes focus, your intuition a map. You want to be supportive, but when the noise swells you slip away, protecting the quiet that keeps you whole.",
        "This decade asks you to let environment become strategy. Moves, trial stays, shifting work zones, these are not detours but the route. Opportunities gather where the atmosphere is calm: near water, in soft-lit studios, in teams that value care and craft. Backstage roles, remote setups, research, design, wellness, hospitality, spaces where empathy pays, bring steady gains and trusted allies (often women or gentle mentors). The shadow: drifting without decisions, saying yes to spare feelings, carrying other people’s weather and calling it your own.",
        "Treat every relocation as a deliberate re-nesting. Choose places that regulate your nervous system and your life will scale with less friction. Set tender but firm boundaries, honor your evening rhythm, and make thoughtful, testable moves. Done this way, your influence spreads quietly and lastingly, through rooms you curate, networks you soothe, and homes that hold your best work. Your moonlight isn’t for hiding; it’s for guiding the path ahead.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Before any move or job change, do a 2-3 week trial stay; track sleep quality, noise, and how fast you recover after a long day.",
        "Audit your home/work zone quarterly: remove 30% of visual clutter, add warm dimmable lighting, and one water element (fountain, view, or sound).",
        "Use a nighttime boundary: after 8 p.m., reply the next morning unless urgent; say, “I need time to consider, I'll respond tomorrow.”",
        "Schedule deep work during your high-focus window (e.g., 9-11 p.m.) twice weekly, and set a hard stop with a wind-down routine.",
        "Build soft-power networks: join a women-led or calm creative community and host a monthly 4-6 person salon to deepen trust.",
        "Protect decisions: for leases, contracts, or partnerships, require a 24-hour cool-off and one outside opinion before you sign.",
      ],
    },
    贪狼: {
      paragraphs: [
        "You crave the new street, the unfamiliar room, the eyes that haven’t learned you yet. In motion you feel most alive, shapeshifting to meet the moment; your charm opens doors before you knock. Yet the thrill fades fast. After the party, a quiet hunger returns, part wanderlust, part fear of being trapped. You want to taste everything without losing yourself, to go farther and still know where home is.",
        "This decade puts Tan Lang in your Migration palace, and the world tilts toward you. Invitations, travel, cross-border projects, late nights that blur into early flights, your environment amplifies appetite. Quick alliances form, sparks fly, and opportunity multiplies; so do distractions, leaks of time and money, and the risk of being talked about for the wrong reasons. If you curate your stage and write your own rules, the same current becomes power: partnerships, sales, entertainment, community building, product evangelism, arenas where breadth, charisma, and curiosity compound.",
        "Choose your riverbanks early. Boundaries won’t cage you; they channel your flow. Without them, you drift into other people’s plots. With them, you migrate, deliberately, into a larger, freer version of yourself. Move with pleasure, not compulsion.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say yes only if it serves one of your 3 priorities; otherwise, decline politely.",
        "Run a 90-day city test before relocating: live your normal routine, cost it, rate energy and network.",
        "Turn charm into pipeline: target 10 warm intros weekly; follow up within 48 hours with value.",
        "Protect reputation: keep DMs screenshot-safe; no venting/flirting on work channels; set boundaries on first meeting.",
        "Set guardrails: max 2 late nights per week; schedule recovery blocks and workouts before you fill the calendar.",
        "Insist on written terms, roles, money, exit, before collaborations; sleep on risky decisions for 24 hours.",
      ],
    },
    巨门: {
      paragraphs: [
        "You know the strange ache of being both the whisper and the whistle. In rooms and cities you enter, you catch the subtext before the sentence ends. You want clean truth, yet your words can land like a blade; afterward you replay the conversation, wondering if you cut too deep or not deep enough. You move, desks, districts, even countries, not just to escape, but to chase a clearer signal. People read you as “intense” or “difficult,” yet they call when a deal smells off or a story has holes. You are the one who sees what others hide.",
        "With Ju Men lighting up your Da Qian decade, the outside world becomes an arena of questions, contracts, interviews, crossings. Your voice is your vehicle. Used well, it wins negotiations, attracts thoughtful allies, and carves a niche in media, law, research, cuisine, or night-shift work. Used carelessly, it stirs rumor, midnight arguments, travel snafus, and enemies made by accident. The task is not to be softer, it is to be cleaner. Let your mouth be a lantern, not a knife; choose rooms where debate is welcomed and the rules are written.",
        "Here’s the edge: if you don’t set terms, the rumor mill will set them for you. Relocation won’t solve messy boundaries; clarity will. The road is listening. This decade rewards you for precise speech, documented agreements, and courageous yet courteous confrontation, and it punishes vague hints, backchannels, and late-night texting wars. Move with intention, speak in daylight, and make structure your shelter.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you actually want in plain words. Start requests with “I want… by…” and end with “Does that work for you?”",
        "Before replying to provocation, wait 24 hours; then call or meet instead of texting.",
        "After every meeting, send a 3-line recap: what was decided, by whom, by when. Ask for written confirmation.",
        "Pick environments with clear rules: join teams that publish decisions, record meetings, and discourage gossip.",
        "Travel discipline: daytime arrivals, backup IDs and contracts in the cloud, and no major decisions after 10 p.m. local time.",
        "Run a monthly reputation audit: search your name, review public posts, correct errors calmly, and log incidents for patterns.",
      ],
    },
    天相: {
      paragraphs: [
        "In this decade of great movement, you carry the poise of Tian Xiang into lobbies, border gates, interviews, and new rooms where no one knows your history. You read the air quickly, speak with measured grace, and people relax around you. Yet there’s a quiet tug: the urge to maintain harmony versus the ache to claim a direction that is undeniably yours. You crave a steady base, but you come alive in motion. You want to be respected, yet you’re tired of managing everyone’s expectations. Your gift is dignified balance; your trap is becoming the hinge on which others swing, while your own door stays closed.",
        "Da Qian makes your reputation grow away from home. Opportunities arrive when you step into unfamiliar places, new teams, cross-border projects, roles that ask you to arbitrate, coordinate, or represent. Mentors and patrons appear when you act as the bridge, not the background. But beware the velvet cage of politeness. Waiting for the perfect arrangement becomes its own delay. The decade asks for firm terms: choose where you’ll be seen, what you will take on, and how you’ll be compensated. Decision is not aggression; for 天相, decision is protection, of time, of standards, of the quiet center you need to lead well.",
        "Establish a corridor of movement instead of wandering: select the few cities, arenas, or networks where your fairness and presence compound. Build rituals around arrival and departure, clear agendas, clean exits, names remembered, follow-ups closed. Let your image be simple and true rather than endlessly curated. When you hold your line, your influence multiplies; when you soften it to please, you drift. This cycle can lift you into trusted authority in wider circles, if you claim the seat and speak plainly. Otherwise, you’ll leave with applause but no imprint. Choose your stage, and step forward.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Pick two cities or domains to be your movement corridor; invest 60% of your travel, events, and networking there.",
        "Set a decision rule: if an offer is 70% aligned with your values and increases visibility or authority, say yes within 48 hours; otherwise decline.",
        "Prepare a boundary phrase bank (three lines for time, scope, and fees) and use them verbatim in emails and meetings.",
        "Host or facilitate one gathering per month (roundtable, salon, online forum) to become the bridge where allies find each other.",
        "Quarterly, update relocation logistics: documents, backups, travel insurance, emergency contacts, and a ready go-bag.",
        "Keep a patron ledger of 12 people; each month, deliver one concrete value to one person (intro, resource, brief, or public credit).",
      ],
    },
    天同: {
      paragraphs: [
        "You crave soft landings. You’re the one who brings calm into a room, the traveler who turns a spare couch into a sanctuary and a new city into something familiar within a week. This decade invites you to float on gentle currents, introductions come easily, doors open with a smile, and helpful people appear right on cue. Yet there’s a tug: the comfort you love can dull your edge. You say yes to others’ routes, you linger in roles that feel safe, and your own itinerary stays penciled in the margins.",
        "With Tian Tong guiding your movement, the outside world is kind. Short trips spark lucky breaks; hospitality, wellness, and community spaces become your natural stage. When you move with intention, you don’t force doors, they swing open. The risk is not stormy weather but drowsy seas: over-accommodating, over-indulging, letting days drift because nothing hurts enough to push you. If you don’t set boundaries, you end up carrying everyone’s bags and still missing your train. Clarity becomes your lighthouse: name what steadies you, and the world will meet you there.",
        "Claim your pace and ask for what you need, and this decade turns into a sanctuary-road, relationships cushioning your risks, environments that nourish you. Drift, and you’ll collect pleasant memories but lose momentum. Let kindness be your strategy, not your sedative. Choose routes on purpose, so the ease you’re given becomes a foundation for real movement, not a lullaby that puts your future to sleep.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Define soft-landing criteria: list 5 non-negotiables for any move and decline options that miss two or more.",
        "Use a decision cadence: 72 hours to research, decide by day 4; if reasons are mainly people-pleasing, it’s a no.",
        "Build a 9-month cushion: automate weekly transfers into an emergency and relocation fund to buy calm choices.",
        "Run a 30-day arrival ritual: schedule five coffees, ask each person for one intro, track fits in a simple sheet.",
        "Practice boundary scripts twice weekly: “I can do X, not Y,” and “I’ll confirm by [date].” Keep it consistent.",
        "Anchor your energy: daily 20-minute walk, Sunday 30-minute life-admin block, strict bedtime alarm in every place.",
      ],
    },
    武曲: {
      paragraphs: [
        "You’ve always been the one who tightens bolts and carries weight. With Wu Qu stationed in your Da Qian decade, the spotlight shifts from home base to roads, borders, and markets. For the next ten years the world tests your backbone. You’ll feel restless on familiar streets, caught between protecting what you’ve built and stepping toward bigger stakes. You crave control, yet new maps demand decisions with incomplete information. The quiet pride of self-reliance tangles with the ache for reliable allies. You want clean lines, clear numbers, the right to call the shots - while fate nudges you onto platforms you don’t fully control.",
        "The upside is real: authority travels. In new cities, companies, or industries, your discipline reads as credibility. You’ll restructure chaos, cut waste, negotiate fair terms, and build lean systems that pay steadily. But the blade has two edges. Under pressure you may turn curt, guard information, or make solo moves that spook partners. Relocations stress loyalties; quick wins tempt you to torch slow bridges. Contracts, logistics, and constant motion can grind down patience, and your body will carry the miles unless you treat it like gear to be maintained. The risk is winning the deal and losing the network that keeps deals coming.",
        "Let your steel learn to hinge. Keep your standards; expand your methods. Power that listens multiplies; power that bulldozes travels alone. Move decisively, but add patience at junctions - border crossings, first hires, first negotiations. If you force every turn, you may claim territory and come home to a cold campfire. Don’t let success go silent.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Choose your next city or market and commit to an 18-month foothold.",
        "Keep a 90-day runway - cash, contacts, housing - segregated and untouchable.",
        "Put every deal in writing: scope, milestones, payment schedule, late penalties, exit.",
        "Run a weekly pipeline ritual: 5 new intros, 2 follow-ups, 1 direct ask.",
        "Before a hard cutoff, sleep on it 24 hours and send a clean exit.",
        "Protect the chassis: fixed sleep window, strength train 3x/week, no travel on recovery days.",
      ],
    },
    天梁: {
      paragraphs: [
        "You carry the old beam inside you, the part that notices cracks in people and places and quietly braces them with your own spine. You don’t chase shiny roads; you make them safe. Yet, this decade keeps tugging your suitcase: the urge to cross a border, change cities, step into rooms where no one knows your history. The tension is real, who looks after the house if the roof-beam walks? And still, every time you venture out, strangers sense your steadiness and hand you the keys to rooms no one else can hold together. Travel becomes a corridor of responsibility, and you, reluctantly and beautifully, become the calm in other people’s storms.",
        "In the Big Migration cycle, expansion comes when your movement has purpose. You’ll be invited to steward teams, repair shaky structures, mediate conflicts, and design systems that last. The gift: benefactors and elders open doors when they see your reliability. The trap: martyrdom, carrying everyone’s bags until your own journey stalls. Choose moves for legacy, not escape. Put expectations in writing. Anchor your body with routine so your presence stays clean and strong. Let your care be a lighthouse, not a leash. Say yes to the road, but on your terms; the world is ready for the shelter you build.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write your move criteria: pick 3 non-negotiables (mission, stability, mentorship). If an offer misses any, decline.",
        "Do a 10-day scouting trip per target city: meet 5 locals in your field, ask pay/politics/pitfalls, take notes the same day.",
        "Before you 'rescue' a team, put it in writing: scope, time limits, budget, exit clause, and who has final say.",
        'Use a boundary script: "I can help with X by Y. After that, you’ll need A or B." Repeat it verbatim without apologizing.',
        "Anchor your body on the move: same sleep window, 2 strength sessions weekly, hydration target, and a travel health kit.",
        "Create a 90-day landing plan for any move: housing secured, legal/medical docs sorted, local clinic registered, one community group joined.",
      ],
    },
    太阳: {
      paragraphs: [
        "You can feel it: the world keeps pulling you onto bigger roads and brighter rooms. Your name lands on travel itineraries, agendas, doorways that swing open just as you’re thinking of leaving. You want to lead and be seen, to warm people by your presence, and then, in the same breath, you want to disappear and refill the well. You radiate clarity for others, yet your own direction can blur when every corridor lights up at once. Applause feels good, but the constant performing leaves a thin ache behind your ribs; you’re Tai Yangrise everyone waits for, even on days you wish for cloud cover.",
        "This decade asks you to become a moving sun with rhythm: travel with purpose, show up where your light is received, and rest before you burn. Your external world will test your leadership, visibility, and stamina, new cities, new teams, new stages. The lesson is not to say yes to every spotlight, but to choose angles and hours that keep your glow steady. Curate your environments, define your role before you step on the floor, and let structure, not adrenaline, carry your influence. When you do, opportunities gather fast: doors open, younger voices look to you, and authority sits naturally on your shoulders. Resist the savior reflex and the urge to fight every shadow. Your power is clean, directional, and timely. Walk toward the horizon with intention, the places that truly need your daylight are already looking for you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Test a new city or market for 30 days via a short sublet; track daily energy, leads, and costs in a simple spreadsheet; decide stay/leave by data, not mood.",
        "Set office hours twice a week for requests and favors; outside those windows, reply with a scheduling link or a clear no.",
        "Block 90-minute spotlight sessions for visible work (presentations, outreach), followed by 20 minutes fully offline; protect this cadence in your calendar.",
        "Before accepting any leadership role, write a three-sentence scope and a stop-date; only proceed once both are agreed in writing.",
        "Publish one useful public update each week (newsletter, video, or thread) teaching something you learned on the road; keep it short and consistent.",
        "When conflict flares, step into natural light and walk for 10 minutes before replying; respond with one clear request and one boundary, nothing more.",
      ],
    },
    七杀: {
      paragraphs: [
        "You know the feeling: rooms go stale fast, paths flatten under your feet, and a part of you starts packing before your mouth admits it. Others call you unpredictable; what they don’t see is your precise radar for endings. You sense when a cycle has no more to give, and your hand moves to cut the ties clean. Yet inside there’s a tug, between the thrill of fresh air and the duty to finish well, between fierce independence and the quiet ache to belong. You hover at the threshold, keyed up, watching for the door that asks for courage rather than escape.",
        "With Qi Sha in the Da Qian for this decade, the world treats you like a proving ground. Openings come through hard assignments, new cities, high-pressure teams, and negotiations where steel must show. You will meet worthy allies and equally sharp rivals; authority will test your stance; travel and transitions amplify gains and also risks, especially if you rush or drive angry. Unchanneled, your boldness can scorch your bridges; channeled, it becomes a blade that solves what dithering never could. Your medicine is strategy, pacing, and clean lines: clear objectives, rules of engagement, routes home. Build muscle and calm in the same season; let your edge cut problems, not people.",
        "This is not a quiet decade; it’s a campaign. Step in as your own commander, choose the battleground, define victory, and walk away from skirmishes that don’t pay. Do that, and you will carve territory and respect that sticks. Drift on impulse, and you may win dramatic battles while losing the war that matters. Choose.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Name the mission of every move in one sentence; write it down.",
        "Build a 90-day campaign plan for each city or role; set exit criteria.",
        "Before quitting or cutting ties, wait 48 hours and get one outside opinion.",
        "Say what you actually want in plain words; no hints, no tests.",
        "In each new place, secure three anchors within two weeks: workspace, ally/mentor, and legal/medical support.",
        "Keep a go-kit: ID copies, emergency cash, key contacts, and insurance; review quarterly.",
      ],
    },
    天机: {
      paragraphs: [
        "You’ve felt it for a while: the room grows small the moment you understand it. Your mind opens new tabs, tracing routes, backup routes, and secret side streets, while your heart asks, “But where will I belong?” With Tian Ji in Da Qian this decade, you read environments like weather, subtle shifts, unspoken rules, the quickest path through a crowded station. Restlessness isn’t impatience; it’s your instrument tuning. Yet the push-pull is real: the thrill of possibility versus the fear of scattering yourself across too many places, people, roles.",
        "This cycle favors motion-as-mastery. You are the strategist, the consultant of your own migrations. New cities, hybrid teams, changing platforms: these are not disruptions but data. Your gift is pattern recognition, seeing how connections form before others do. But the shadow is decision fatigue and perpetual beta. If you don’t choose your terrain, the terrain will choose you; you’ll end up living in transit lounges, saying yes to every detour, mistaking busy movement for meaningful momentum.",
        "Frame this decade as a series of deliberate expeditions. When you design your routes, and install simple anchors, your mobility becomes magnetic. You’re not flaky; you’re iterative. Choose three commitments to carry everywhere, keep your body’s rhythms steady, and make environments audition for you. Then watch how doors open far from your origin story: mentors in new languages, partnerships born on trains, work that travels as well as you do. Lean into curiosity, steer with boundaries, and let the map expand because you decided the compass.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Use a 3-box rule for moves: Stay (90 days), Test (2 weeks), Commit (12 months).",
        "Before relocating, spend two consecutive weekdays on-site to feel real pace and logistics.",
        "Run quarterly terrain scans: list people/places that energize or drain; double down or exit.",
        "Create a travel protocol: fixed sleep window, morning sunlight, hydration, core exercises, backups, insurance.",
        "Cap active work streams at three; everything else goes to a parking lot for 90 days.",
        "Keep a single hub doc with goals, key contacts, and next steps; review every Monday.",
      ],
    },
    左辅: {
      paragraphs: [
        "You’ve long been the reliable hinge that makes other people’s doors swing. Plans open when you arrive; chaos settles under your lists. Yet your feet itch, the suitcase waits by the door. You suspect your real stage isn’t the room you maintain, but the roads between rooms. With Zuo Fu lodged in Da Qian this decade, you become the bridge, stitching teams, cultures, and timelines across distance. Benefactors appear in transit lounges and on late-night calls. Your steady coordination becomes a passport: people trust you with keys, not just tasks. The world widens when you step beyond your usual orbit.",
        "But there’s the tug: you’re praised, then placed behind the curtain. You say yes because you care, and because opportunity rides in other people’s vehicles. Loyalty pulls back; growth waves from the highway. You’ve launched departures for others while delaying your own leap. This cycle asks you to keep your gift and change the terms. Zuo Fu shines in orchestration, not martyrdom. Boundaries aren’t walls; they are rails that let a train move fast and safe. Let support turn reciprocal: clear roles, written terms, time you pay yourself. Travel isn’t escape; it’s placement.",
        "Move with intent and doors unlock in sequence. Mentors appear to sponsor, not consume. The clearer your lanes, prices, and time, the kinder the road. You’ll still be the hinge, but now your itinerary leads to rooms where you sit at the table. Pack light, speak plainly, and choose where, when, and for whom you open the way.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Choose two hubs or industries; schedule one on-the-ground week per half-year; book six meetings eight weeks ahead.",
        'Write a one-page "How I help": scope, "not my lane," hours, fees or fair exchange; share it before you say yes.',
        "For every favor, name the return and deadline; track asks in a spreadsheet; follow up once, then release.",
        "Turn ad-hoc help into assets: templates, checklists, intro scripts, a 15-minute link; share the system, not your weekend.",
        'Protect energy on the road: office hours, "I can do A by Tuesday; B is outside scope," one rest day after each trip.',
      ],
    },
    右弼: {
      paragraphs: [
        "You’ve always been the quiet conductor, the smile that untangles tension, the hand that guides others across. This decade in the Migration palace sets you in motion: new cities, new rooms, new circles. Everywhere you go, doors crack open because someone vouches for you, and you’re brilliant at making strangers feel like longtime allies. Yet there’s a tug: you crave your own stage while habit keeps you in the wings, nodding, smoothing, letting others go first. You sense that your future lives in introductions and travel, but you worry that asking outright will break the harmony you work so hard to keep.",
        "You’ll notice the signs: messages pinging with “Can you help?”, last-minute requests, invitations that hinge on your presence to keep the project glued together. Your natural diplomacy attracts collaborators and patrons; the best opportunities will arrive through recommendations, not applications. Still, the trap is subtle. If you don’t name what you want, you become everyone’s lubricant and no one’s priority. Saying yes to keep peace will scatter your energy across other people’s timelines. The skill of this decade is elegant assertion, warm voice, clear edges. When you make specific asks, allies feel relieved: they finally know how to carry you forward.",
        "Treat mobility as a strategy, not an escape. Go where your allies compound your effort; leave where your gifts are consumed without return. This is a soft-power rise if you give your kindness a spine. Ignore it, and you’ll be exhausted, well-liked, and strangely invisible by decade’s end.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "State your ask in every key meeting: “I’m seeking X by Y date, can you introduce me to A/B?”",
        "Use a 70/30 rule: protect 70% of your week for your agenda; cap favors at 30%.",
        "Keep a monthly top-12 ally map; schedule recurring check-ins with one concrete give and one clear ask.",
        "Replace vague yeses: reply within 24 hours with “Yes, if…,” or “No, but here’s an alternative.”",
        "After any event or trip, send a 5-line recap with next steps and one direct request within 48 hours.",
      ],
    },
    文昌: {
      paragraphs: [
        "You feel the horizon tugging at you, new cities, new rooms, new audiences, and yet your finger hesitates above the send button. This decade, your vehicle is language: bios, proposals, emails, captions, documents that move you further than tickets alone. You crave the clean click of a plan, the right phrasing that opens a door, the sense that your words will land where you intend. Some days you watch flight maps and refresh job boards with twelve tabs open, promising yourself you’ll craft the perfect message tomorrow. Other days you hear your own voice in a room and feel the world rearrange itself around a sentence. The longing is simple: be read clearly, be received kindly, be paid fairly. The fear is equally simple: say the wrong thing, be misunderstood, drown in admin. Wen Chang in Da Qian asks you to travel by thought as much as by train.",
        "So treat your language like logistics. Build routes: templates, checklists, calendars, a tidy folder for every project. Your safest travel insurance is a precise email, a clean contract, a filename that makes sense six months from now. Publish in small, steady packets; repetition will build a trail others can follow to you. Expect the temptations of this transit, overediting, gossip, scattered scheduling, and decline them with structure. Confirm details, annotate decisions, keep receipts of agreements. Let curiosity choose new territories, let precision protect you when you get there. If you make your words portable and consistent, the world becomes easier to cross: strangers become readers, readers become allies, allies become opportunities. Keep moving, not frantically but rhythmically. Choose “sent” over “perfect.” Name where you’re going and why. With Wen Chang  lighting the road signs, the horizon that once teased you will finally come closer.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write and ship 200 words before noon on weekdays.",
        "Build a reusable travel/launch checklist (ID, visas, backups, chargers, files).",
        "Cap edits at two rounds; send the draft by a fixed deadline.",
        "Confirm all logistics 48 hours before: times, venues, currencies, contacts.",
        "Get terms in writing before collaborating; email a one-paragraph summary.",
        "Leave buffer days between trips; no calls the first morning after arrival.",
      ],
    },
    文曲: {
      paragraphs: [
        "You move like a poem through changing rooms. With Wen Qu  in 大迁, the world mirrors you back in glances, conversations, and sudden invitations. You’re at home on thresholds, stations, lobbies, galleries, where stories begin. People confide in you; you catch the undertones in a room and translate them into warmth. Yet underneath the polish, there’s a tug: you long for elegant structure but dread feeling caged. You hint at what you want, hoping others will read your nuance, then feel unseen when they don’t. New cities intoxicate you; logistics feel like sand. Decisions blur into maybe.",
        "This decade turns motion into your medium. Your taste, words, and diplomacy open doors, collaborations, speaking, teaching, creative deals across borders. If you choose with intention, your environment will amplify your refined voice, and travel becomes a stage rather than an escape. Small anchors will turn wandering into a tour: a clear compass, a quarterly release, a weekly admin ritual. But charm without a spine scatters into pretty starts and corridor romances that drain focus. The test is simple, not easy: say what you want in plain language, make commitments that match it, and let places audition for you. Guard attention like a rare instrument; carry less, finish more.",
        "If you don’t pick a north star, other people’s plans will. Let beauty lead, but let structure drive. This road is generous, if you travel it on purpose.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a 12-word decade compass; decline any offer that does not match it.",
        "Ship one public piece per quarter: article, talk, show, or product.",
        "Negotiate in plain words: fee, scope, deadline; then get it in writing.",
        "Before any move or trip, check purpose, full budget with 30 percent buffer, and local support.",
        "Block a weekly 60-minute admin hour for contracts, visas, royalties, and backups.",
        "In new cities, join one professional group within 30 days; cap social nights to two until settled.",
      ],
    },
  },
  大友: {
    紫微: {
      paragraphs: [
        "You’ve always carried yourself like the calm center of a crowded room, steady, composed, the one others orbit when their own compasses shake. This decade makes that truth impossible to hide. Invitations multiply. People speak your name a little softer, as if asking permission. You like being the host, the one who decides the tone, but you also ache for peers who meet your gaze without needing you to hold the ceiling up. The push-pull is real: you want to lead with grace and still be seen for your humanity, not just your usefulness.",
        "With Zi Wei in your Friends palace, a court is forming around you, whether you design it or not. Your presence stabilizes rooms; your approval redistributes power. That draws elegance and flattery, but not always loyalty. If you don’t set the terms, others will script your role and invoice your energy. This decade asks you to govern with warmth and boundaries: curate carefully, test lightly, reward publicly, and write things down. The danger here isn’t dramatic betrayal; it’s slow erosion, applause that keeps you busy, promises that stay foggy, a crowd that feels close while leaving you alone when it counts. Choose deliberately, or you’ll preside over smiles with thin support.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write your Inner Circle Standards: list 3 non-negotiables (e.g., honesty under pressure) and 3 red flags (e.g., vague timelines). Check this before saying yes to any new collaboration or invite.",
        "Use the small-ask test: before you grant a big favor, request one clear, modest task with a deadline. Let their follow-through decide your next step.",
        "Keep an 8-week reciprocity log: note who shows up unprompted and who only pings when they need something. Adjust access based on patterns, not charisma.",
        "Install a public-credit ritual: in every meeting or group email, name at least two contributors by name and deed. It builds loyalty and reveals free-riders.",
        "Set access boundaries: create two weekly time blocks for introductions and favors. Outside those windows, reply with a polite no + alternative (“I’m at capacity, try X or circle back next month”).",
        "Insist on one-page memos for any deal, intro with stakes, or joint project: roles, deliverables, timeline, exit terms. No more handshake agreements.",
      ],
    },
    破军: {
      paragraphs: [
        "You carry a quiet vow: if a bond turns stale or false, you’ll tear it down rather than pretend. You’re drawn to intense people, the ones with scorch marks and big ideas, and just as quickly you’ll cut ties when you sense drift, disrespect, or dead weight. You don’t do small talk; you do turning points. Again and again, you end up as the one who names the hard truth in a group, the catalyst who forces a reckoning. It’s lonely sometimes, being the person who won’t look away, but you’d rather be alone than diluted.",
        "This decade turns your social world into a controlled burn. Old companions fade, not from malice but misalignment. New allies arrive from the edges: founders, first responders, reformers, the ones who can hold heat. Your task is to choose by mission, not nostalgia. A few uncompromising partnerships will carry you farther than a crowded room of maybe’s. Your gift now is precision: set terms, set tempo, set the tone for clean conflict and clean exits. Let change do its work without drama. You don’t need a crowd, you need a crew.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write your mission for the next three years in one sentence; use it as a filter for who you keep, pause, or invite.",
        "Before quitting, blocking, or firing someone, wait 24 hours; list three outcomes you want and one clean next step.",
        "Put money and favors on paper: no loans without terms, cap monthly “help hours,” and redirect overflow to referrals.",
        "Each quarter, join one new room outside your usual scene; schedule three 20-minute check-ins with weak ties every month.",
        "Practice conflict hygiene: describe the behavior and impact, make one clear request, offer one path to repair with a deadline.",
        "Protect your energy with a weekly no-drama day; silence notifications, move your body, and journal the triggers you will no longer negotiate.",
      ],
    },
    廉贞: {
      paragraphs: [
        "You crave clean lines in messy rooms. In friendships, you’re the quiet reformer who cannot ignore mixed motives, vague promises, or loyalty tested only in sunshine. This decade brings you into rooms where alliances are currency, group chats that hum at midnight, favors tallied in invisible ink, introductions that come with unspoken bills. Your instinct is to set standards, to make the unspoken spoken. You’ll feel the pull to audit your circle: Who stands when it’s inconvenient? Who wants your fire but not your truth? Beneath it all is a steady drumbeat: if we’re connected, let it be real, accountable, and brave.",
        "Your magnetism draws strong, complicated people, leaders, strivers, and those who love the glow but dodge the grind. You may become the hub for projects, cause-driven campaigns, and side ventures that braid money with friendship. The temptation is to enforce control when things blur, or to swing from rescuing to cutting off. You want belonging without politics, yet you sense the politics in belonging. When trust is thin, you test; when tests fail, you scorch. This cycle asks you to master the art of adult alliance: clear terms, clean exits, and loyalty proven by behavior, not performance. Otherwise, fatigue and resentment will outpace your generous will.",
        "Let your sword prune, not slash. Build a circle that runs on purpose, not drama, and make your rules visible: how you lend, how you introduce, how you say no. Choose your battles like a strategist, not a firefighter. If you ignore these boundaries, the cost is steep, reputation bruises, tangled debts, and bridges burned just when you need them most. Hold the line now, or pay interest later.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write two non-negotiables for friendship; say them out loud early.",
        "Map your circle: allies, neutrals, drains. Reallocate time accordingly.",
        "Keep money clean: lend only what you can gift; put terms in writing.",
        "Confront directly, not by triangulation; choose one channel and one ask.",
        "Before severing ties, wait 24 hours and draft the calm exit message.",
        "Curate a power circle: monthly small dinners, clear purpose, follow-ups in 48 hours.",
      ],
    },
    天府: {
      paragraphs: [
        "You’ve always been the steady table everyone puts their elbows on. In any room, you end up the host, the treasurer, the quiet center who remembers birthdays, picks up the bill, and keeps the plans from falling apart. A part of you loves this, it proves your reliability and earns you a seat in many circles. Another part aches from the weight. You see who texts only when they need something. You sense that loyalty should be a two-way street, yet you often pay the toll alone. You want grown-up friendships: dependable, mutually resourced, not just warm words over empty follow-through. You read the room fast and quietly cover gaps, rides, fees, introductions, before anyone names them. Yet when it’s your turn to ask, your throat tightens; you’d rather solve it alone than risk seeming needy. Pride keeps you composed; a softer hope wants someone to meet you with the same steadiness you give.",
        "In this decade, Tian Fu sits in the Friends palace and asks you to turn generosity into governance. Your social world becomes your treasury: what you store is trust, introductions, and shared capacity. You will attract both real partners and polished takers. The difference will not reveal itself unless you set terms. Clarify roles, prices, and timelines. Decide who gets access to your time, your know-how, your network, and on what basis. Host, yes, but with structure: agendas, contributions, and clear outcomes. Budget your social energy like money, with caps and reserves. Expect fewer dazzling acquaintances and more durable alliances that cut across age, status, and industry. When you curate the room with standards instead of vibes, you’ll feel a calm click: fewer people, stronger ties, more compounding returns.",
        "Let this be the decade you build an inner council rather than a crowd. Boundaries won’t make you colder; they’ll make belonging warmer because everyone knows the rules. If you hesitate, the old pattern returns, you become the group’s convenience store, open late and underpaid. Choose differently. Say fewer yeses, better yeses, and watch your circle become both fortress and launchpad. This is how your favor economy becomes an enterprise of trust: the first year you prune, the second you systemize, the third you harvest.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Adopt a clear money boundary: never loan more than you can afford to gift; for anything larger, use a simple written contract with a due date and consequences. Do not co-sign or guarantee debts.",
        "Build a Council of Five: choose five steady allies; schedule a monthly 90-minute check-in to share top goals, metrics, and concrete asks. Rotate who gets the spotlight.",
        "Create office hours: one pro-bono slot per week or two per month; beyond that, send your rate card or decline politely. Use a script so saying no is easy.",
        "Vet partnerships like investments: ask for two years of P&L or tangible track record and three references; run a reputation check; wait 48 hours before agreeing.",
        "Track reciprocity: keep a simple spreadsheet of favors given/received. If someone hits three unreturned asks, pause further help until balance improves.",
        "Expand beyond the comfort circle: join one industry association or mastermind outside your usual tribe within 60 days, attend three meetings, and make two specific asks at each.",
      ],
    },
    太阴: {
      paragraphs: [
        "You are the moon in your circle ,  the quiet light people navigate by. You sense the unsaid, answer late-night messages, and hold space until others soften. Then the tide turns: after pouring yourself out, you retreat, hungry for silence and someone who notices you without asking. You crave a sanctuary of equals, yet you often become the caretaker by default. Opportunities drift to you through introductions and whispers, but along with them come favors, blurred lines, and the weight of secrets that aren’t yours.",
        "In this decade, Tai Yin in Da You matures your soft power. The right people listen when you speak softly; women, artists, healers, and thoughtful strivers will orbit closer. Moonlight gives visibility, but it also dissolves edges ,  generosity mistaken for endless availability, friendships muddled with money, kindness stretched into obligation. Your task is to curate, not collect. Choose a circle that refills your well as you refill theirs; keep your finances, time, and emotional energy traceable. When you do, your network becomes a calm harbor that compounds returns ,  emotional, creative, financial. If you drift, the tide of other people’s needs will erode your hours, trust, and savings grain by grain. Guard your glow. Aim it with intention.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set “friend office hours”: two evenings a month for deep catch-ups; no midnight triage.",
        "Before saying yes, write the exact ask and your limit in one sentence each; share both.",
        "Keep money clean: cap friend loans at a fixed amount and use a simple written agreement.",
        "Build a core circle: pick three reciprocal allies and book a recurring 60-minute check-in.",
        "Exit gossip loops: say, “I care about them ,  let’s talk solutions,” or end the call.",
        "Protect solitude: one device-free night weekly for journaling, planning, and early sleep.",
      ],
    },
    巨门: {
      paragraphs: [
        "Your hidden truth: you don’t just hear words, you taste their edges. In rooms of friends and allies, your radar locks onto the subtext, the thing no one will say. You want clean honesty, yet your clarity can slice; people call you bold one moment and “too much” the next. You carry confidences like stones in your pockets, replaying conversations at night, wondering which phrase turned the tide. You test loyalty with questions, then retreat when others fumble the truth. You crave a circle that respects directness, not a crowd addicted to whispers.",
        "This decade pulls you to the center of networks. Ju Men in Da You makes you the hinge: your words can convene a room or split it. You’re asked to be spokesperson, mediator, the one who names the elephant and sets the rules. Used well, your voice becomes a channel for justice and precision; used loosely, it hooks you into triangles, rumor storms, and avoidable disputes. Choose: architect a culture of clear speech and firm boundaries, or be drafted into everyone else’s unfinished conversations. The more you align your alliances to your values, the more your influence grows. Ignore it, and the cost is trust, time, and possibly contracts. Speak with purpose, not impulse; let people meet your truth in daylight.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "State agreements in writing after key talks; send a short recap within 24 hours.",
        "Adopt a no-triangulation rule: address issues directly with the person involved.",
        "Before responding to rumors, verify with the source and wait 24 hours.",
        "Curate your circle: name three allies to invest in weekly, and three draining ties to phase out.",
        "Run small gatherings with ground rules (time limit, one mic, no side chatter).",
        "Practice clarity reps: ask, “What did you hear me say?” and correct misreads on the spot.",
      ],
    },
    贪狼: {
      paragraphs: [
        "You’re at your best when a room hums and you’re the switch, sparking introductions, reading currents, turning charm into openings. This decade wakes that appetite: new circles pull you in, friendships double as backstage passes, and the thrill of options keeps your calendar bright. Yet beneath the buzz lives a quiet ache: Which of these connections are true? Where does delight end and debt begin? You sense how easily attention becomes obligation, favors become leverage, flirtation becomes a knot. Some nights you leave glowing; others you feel scattered, carrying stories and secrets that don’t belong to you.",
        "With Tan Lang in the Da You palace, your social gravity surges. Doors open because your name travels well, but so do rumors. The gift here is access, artistry, and negotiated wins; the risk is overpromising, money tangled with friends, and reputation burn from triangles you never meant to enter. This is the decade where appetite must learn aim. Choose your affiliations by values, not thrill. Keep your generosity clean and your boundaries cleaner. If you don’t name the game, someone else will, on terms that cost you more than you planned.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a money-with-friends code: no unsecured loans over a set amount, written agreements for collabs, split bills immediately, no IOUs.",
        "Curate influence monthly: list your top 10 contacts, promote the steady three, downgrade the dramatic three, and use a clean exit script: “This no longer fits, wishing you well.”",
        "State intentions upfront: “I’m here to explore X. My timeline is Y. Budget is Z.” Avoid vague maybes and unclear boundaries.",
        "Use the 24-hour rule for invitations that mix romance, status, or money; decide after sleep, not after cocktails.",
        "Replace some mingling with making: choose one craft or project, deliver weekly, and let results do the networking for you.",
        "Install a social detox: one evening offline each week; journal who expands or shrinks you, then edit next week’s calendar to match.",
      ],
    },
    天同: {
      paragraphs: [
        "You’ve always wanted to be the soft place people land, and they can feel it. In group chats you’re the one who remembers birthdays, diffuses sparks with a joke, and notices when someone goes quiet. Yet beneath your easy smile is a tug-of-war: a heart that loves to belong versus a backbone that bristles when you become everyone’s emotional concierge. You crave harmony, so you say yes; then later you carry the bill, the logistics, the late-night stories, and a little hidden resentment. You’d rather offer tea than make a scene, but you ache for friendships where care flows both directions and promises are clear.",
        "With Tian Tong lighting the Friends palace this decade, your social world expands like a warm kitchen: doors open, circles overlap, gentle benefactors appear, and invitations carry work and play in the same basket. Your empathy will magnetize collaborations, travel, and chance introductions that soften the road ahead. The risk is not drama but drift, vague roles, fuzzy money, favors that stretch into obligations. Treat your kindness like architecture, not a leak. Choose who sits closest, name the container, and let soft edges rest on firm lines. When you pair tenderness with structure, you’ll gather a community that nourishes you back, and the opportunities arriving through friends will be steady, clean, and joyful.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Pause 24 hours before saying yes to favors or roles; reply after sleep.",
        "For any collaboration, draft a one-page brief: goals, tasks, deadlines, and the decision-maker; share it before starting.",
        "Money boundary: no loans to friends without written terms; set a monthly help/gift budget and stick to it.",
        "Run a reciprocity audit for 8 weeks: track asks vs offers with your top 10 contacts; reduce access for chronic takers.",
        "Host sustainably: two open-home nights per month with clear start/end times and a potluck sign-up.",
        "Use clean scripts: “I can’t take this on; here are two options,” and “I can listen for 15 minutes, then I need to stop.”",
      ],
    },
    天相: {
      paragraphs: [
        "You’ve long been the calm center in a noisy circle, the friend people call to make sense of tangled alliances, the colleague who writes the fair email everyone else signs. You read rooms like ledgers, tallying motives and debts, and your word carries weight because you keep it. Yet there’s a tug inside: you want harmony, but you’re tired of carrying it alone. You want to be recognized as the architect, not the polite glue. This decade brings you the same old requests, “Can you talk to them for me?”, but also a rising desire to set terms, to curate your circle rather than absorb it.",
        "With Tian Xiang in Da You for this ten-year span, your name becomes a door. Allies, patrons, and gatekeepers notice you not for flash, but for impeccable balance. The gift is influence through trust; the test is boundaries. Flatterers and soft users will drift close, smelling your steadiness. Say yes without structure and you’ll drown in obligations you never agreed to. Formalize the goodwill. Turn favors into frameworks, introductions into alliances, and support into clear roles. When you draw lines, your serenity returns, and your network condenses into a council that actually moves things. Play rescuer and you’ll be everyone’s buffer; play steward and you’ll be quietly powerful. Choose now, before the requests multiply and your name gets spent by other people’s urgency.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Map your circle into A/B/C tiers; allocate time 60/30/10 and stick to it.",
        "Set a weekly two-hour “office hours” block for favors; outside it, defer.",
        "Write a 12-word no-script; practice it aloud and use it without apology.",
        "Only mediate with all parties present and a written decision deadline.",
        "After every agreement, send a recap with owners, dates, and escalation steps.",
        "Quarterly, request reputation feedback from three peers; act on one item within a week.",
      ],
    },
    武曲: {
      paragraphs: [
        "You enter rooms as the one who steadies the table. In this decade, your circle looks like a ledger: who contributes, who withdraws. With Wu Qu in the Friends realm, your eye for reliability sharpens; you crave allies built like bridges, quiet, load-bearing, tested. Flakiness triggers the itch to prune. You’d rather be respected than adored, yet part of you longs to be held without proving worth. The push-pull: needing a team yet distrusting crowds; offering backbone and expecting the same; wanting simple loyalty while others trade in vibes and vague promises.",
        "Expect to act as treasurer, fixer, and gatekeeper. Money, favors, and shared responsibility become the truth serum of relationships. A late payment or broken promise may harden you; don’t let it turn you to stone. This cycle favors clear terms, lean crews, and co-building with competent peers, contracts over handshakes, roles over assumptions. Your gift here is discernment: a small cadre who move mountains because each knows their weight. The hazard is isolation by over-pruning, mistaking stoicism for strength. Keep your steel, but show your pulse, or you’ll win deals and go home to an echoing victory. Consider this a red light: balance firmness with warmth now, or cross the bridge alone.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Before any project, trip, or investment, email a one-page brief: scope, deadlines, money, exit terms. Get written “yes.”",
        "Set money rules: never lend over 10% of monthly income; use shared expense apps; sign contracts for anything business-like.",
        "Build three rings: 5 core allies, 10 project partners, the rest acquaintances. Review and reshuffle quarterly by delivery.",
        "Use a 72-hour rule: when let down, cool off, state facts and one clear request. If dodged twice, cut cleanly.",
        "Schedule connection: two no-agenda coffees monthly; once a week share one real worry with a trusted person; ask for help early.",
        "Track network ROI and care: each quarter add 3 competent contacts and offer 3 useful assists; measure outcomes, not chatter.",
      ],
    },
    天梁: {
      paragraphs: [
        "You are the quiet beam in every room ,  a shelter people sense before they see. Friends circle your table, strewing their worries like coats, certain you’ll hold them till morning. You notice what’s fraying, step in before it snaps, pay the bill no one mentions. It’s love, and it’s a weight. Under the steady smile lives a tired question: who protects the protector? You crave fewer, truer bonds, yet your porch light stays on. You are respected, consulted, leaned on ,  and sometimes unseen except for what you give.",
        "With Tian LIang sailing through Da You this decade, your alliances mature. Circles thin, roots deepen. You shift from helpful friend to trusted elder whose standards set the weather. Doors open into associations, professional guilds, civic spaces where your steadiness matters. The blessing: real patrons, long-horizon projects, protection when storms rise. The shadow: martyrdom disguised as kindness, groups that never grow, perpetual emergencies that eat your years. This cycle rewards boundaries and formal stewardship; it punishes vague availability. Name who gets your light, when it’s on, and what it costs. Do this, and your care becomes a legacy people uphold with you. Refuse it, and you’ll stand as a lighthouse with no keeper, flickering just when someone finally needs you most.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "List your inner circle of five; give them 80 percent of your social energy and monthly one-to-one time.",
        "Set support office hours twice a month, 90-minute windows; outside them, reply with a schedule link or next-available time.",
        "Use a reciprocity rule: any favor over 30 minutes needs a clear exchange; for money, write terms or decline.",
        "Run a quarterly network audit: exit one draining chat or committee; join one high-integrity board or mentorship with a defined time cap.",
        "Mediate with structure: 10 minutes each to speak, reflect back, write three agreements, set a check-in; if no buy-in, disengage.",
      ],
    },
    七杀: {
      paragraphs: [
        "You move through friendships like a field commander: scanning for capability, sniffing out weakness. When the project is bleeding, you step in, take the hard call, and carry the weight others avoid. You attract intense, high-velocity people, brilliant, flawed, hungry. Deals happen fast, tempers flare faster. Underneath, a quieter push-pull: you want comrades you don’t have to police, yet you keep a hand on the eject lever. You long for a tribe, but your standards are edged steel. People feel your gravity and your judgment; you feel their admiration and their resistance.",
        "This decade asks you to treat your social world as a mission, not a crowd. Don’t collect contacts; shape a compact unit where trust is earned by action and boundaries are named out loud. Calibrate your force: not softer, just cleaner. Make expectations explicit; make exits swift and respectful. Watch the shadow: bored or slighted, you can scorch good ground out of pride or fatigue. Wield your edge with purpose and your network will move as one and multiply your reach. If you don’t, you’ll win arguments and lose allies, loudly.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page 'how to work with me' and share with collaborators: response times, decision rights, money rules, off-limits.",
        "Run a 30-day circle audit: list your top 15 contacts, tag mission-critical/nourishing/draining, schedule one upgrade conversation and one clean exit weekly.",
        "Replace tests with asks: state the outcome, owner, deadline, and budget in one clear message.",
        "Form a 3-5 person strike team; meet biweekly; set a shared metric; review commitments aloud.",
        "Use the 24-hour rule before cutting someone off; if you still choose to end it, send a two-sentence closure, return obligations, and disengage.",
        "Once a month, enter a room outside your industry; ask two real questions and offer one concrete help within 48 hours.",
      ],
    },
    太阳: {
      paragraphs: [
        "You naturally draw people together. When you enter, it’s like switching on a light, people naturally orbit you; resources, opportunities, and lists of introductions somehow end up in your hands. You love to light others up, yet late at night you often feel drained: you agree to too many favors, reluctant to say no; you want to be the person who “makes it happen,” yet worry about being used. You see potential in everyone, but when the lights dim you also ask: on the days I’m not shining, who will stay?",
        "This decade, Tai Yang lands in Da You, inviting you to upgrade from a “warm-hearted helper” to a “clear-eyed power plant.” Your light needs tighter focus: shine on the people and work that are truly worthy, rather than scattering it at random. Be a steward, not a firefighting squad; a curator, not a free resource library. Practice generosity with boundaries: rules first, commitments have a price, reciprocity is visible. When you bundle discernment with warmth, your circle will evolve from a network of favors into an ecosystem of mutual achievement. If you still light up on impulse, you’ll be led by flattery, busier yet emptier. Save your light for those who reflect it, you’ll see a bigger stage and reclaim long-lost ease.",
        "Remember: a real sun doesn’t have to hang high at all times; it rises and sets on schedule. Light with rhythm warms without burning. Align your calendar, circle, and vision, and you’ll find that connections are no longer consumables but power stations; you’ll no longer be merely watched, but trusted and accompanied."
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "List 12 key relationships and label them as Anchors / Peers / Bridges; set a monthly outreach plan for each category.",
        "Establish a “2-hour rule”: for any request that takes more than 2 hours, the mutual benefits must be written out; otherwise politely decline and offer two alternative forms of help.",
        "Host a small 6-8 person salon/dinner each quarter: set a theme, facilitate mutual recommendations on site, and send an integrated follow-up email to enable connections.",
        "Block two weekly “office hours” for guidance and introductions; route other requests through a booking link to avoid scattered drain.",
        "Confirm all collaborations with a one-pager: goals, scope, timeline, attribution, and exit conditions, stored in a shared document.",
        "Before major endorsements or introductions, do a “10-minute review”: check track record and reputation, ask three people who know them, then consult your own gut; if the signals are mixed, offer advice rather than an endorsement."
      ],
    },
    
    天机: {
      paragraphs: [
        "You read people quickly, their motives, their blind spots, the currents between friends. In every room you become the quiet strategist, the person others message when they need perspective. Yet with so many circles, DMs, and side projects, your energy scatters. You crave a table of true peers but keep rotating between helper, connector, and ghost; you oscillate between wanting to belong and needing to disappear to think. It’s thrilling to be the one who “knows,” but the notifications never stop.",
        "This decade asks you to design your allies on purpose. Tian Ji in the Friends palace turns your network into the engine of your fate: ideas travel along relationships. Your gift isn’t volume, it’s pattern recognition and timing. Choose the few whose values match your own, and build repeatable rhythms with them. Map who you trust, what you’re building together, and the pace each relationship can carry. Become the lighthouse, not the weathervane: steady signals, fewer broadcasts, stronger bonds.",
        "The risk is becoming everyone’s switchboard, endlessly advising, rarely advancing your own mission. Clever talk can seduce you into postponing real work; charming collaborators can borrow your mind while giving little back. If you don’t curate, this decade dissolves into errands and side quests. Draw lines. Make fewer, deeper bets. Decide which table is yours to build, and invite the right ones to sit there, or you’ll find yourself on the menu.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Audit your circle: list 20 names; mark + (energizes) or - (drains); act within a week.",
        "Set limits: no more than two ongoing “help” threads at a time; refer the rest.",
        "Move from talk to build: within 14 days of a great conversation, propose a specific pilot.",
        "Use a one-page deal memo before collaborating: goals, roles, timeline, money, exit.",
        "Schedule depth: two recurring 1:1s each month with people you want as long-term allies.",
        "Pause before joining new groups: wait 48 hours; if purpose isn’t clear in one sentence, decline.",
      ],
    },
    左辅: {
      paragraphs: [
        "You’ve always been the steady friend who quietly makes things work: the person who remembers the detail, nudges the email, stitches two strangers into a good conversation. You feel people’s needs before they say them, and you like the gentle power of being useful. Still, there’s a tug: you give and give, then wonder who is holding the net for you. Loyalty pulls one way, tiredness another. With Zuo Fu in Da You, this decade pivots on alliances, introductions open the doors money can’t, trust becomes your currency, and your competence earns you a seat before you arrive. The gift is real support and elevated standing; the cost is attention, curation, and the courage to make clean asks instead of hinting. Your name will move through circles as “the reliable one”, let it, but on terms that protect your energy.",
        "You’ll find yourself mediating, drafting the shared spreadsheet, setting the tempo when others stall. Coffees, voice notes, and late-night problem-solving will braid a network that can carry you far. The trap is rescuing messy people and smoothing lopsided deals until you become the unpaid manager of everyone’s crisis. The remedy isn’t harder edges; it’s clearer structure: standards for who gets access, agreements in writing, timelines and reciprocation you can point to. Choose companions who reciprocate without being asked twice. When goodwill becomes measurable, intros that happen, deadlines met, fees paid, your help scales, and help flows back. If you curate the room and insist on clean exchanges, this can be a quiet coronation as connector-in-chief: influence without noise, support without depletion.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Define three non-negotiables for collaborators (e.g., punctual, responsive, keeps promises). Decline if two are missing.",
        "Keep a simple “favors ledger”: who you helped, date, what was promised back. Schedule follow-ups on the spot.",
        "Turn warm sentiments into concrete asks within 48 hours (“Introduce me to X by Friday?”).",
        "Before stepping into a rescue, ask: “Will I own the outcome?” If yes, price it or decline politely.",
        "Host a quarterly small-circle dinner of 6; seat people intentionally and state the goal in the invite.",
        "After any agreement, send a one-paragraph recap with deadlines and owners the same day.",
      ],
    },
    右弼: {
      paragraphs: [
        "You’ve always been the steady right hand ,  the bridge who smooths edges, ties loose threads, and remembers who needs to meet whom. People lean on you because you read rooms like weather, sensing the gust before the door slams. Yet under the pleasant nods, you crave someone who sees you first, not just the help you give. With Zuo Fu in 大友, the decade amplifies networks: opportunities arrive through whispers, warm referrals, and timely allies. But the same currents can pull you under. You take on extra calls, patch friendships, and carry “just one more favor” like an invisible backpack. You’re popular; the question is whether you are resourced.",
        "The tension lives between harmony and honesty, between being indispensable and being invisible. Your genius is orchestration ,  the quiet connector who makes others shine ,  but now your name needs to be on the marquee of your own life. When you ask cleanly, doors open; when you hint, you get more hinting back. This decade rewards curation: fewer companions, clearer agreements, faster closes. Vet intentions. Require reciprocity. Let your yes be precise, your no be kind and swift. The right circle will lift you higher than solo effort ever could.",
        "This is a builder’s window; waste it on appeasement and you’ll miss the introduction that changes everything. Choose your council on purpose or be drafted into someone else’s storyline. The stakes are your time, your reputation, and your momentum. Let your kindness have edges. Ask for the connection. Name the price. Make the promise mutual. That’s how the helper becomes the one whose path is cleared.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        'Map your top 12 contacts; note "What I give"/"What I need"; schedule two specific asks this month.',
        'Set a monthly favor budget of hours; once spent, say: "I’m at capacity, next opening is next month."',
        'Replace hints with plain asks: "I want an intro to [name/role] about [goal]. Can you connect us this week?"',
        "Host a curated gathering every 6-8 weeks: 4-6 people, one theme; track intros and results in a shared doc.",
        "Before mediating, require both parties present, 30-minute cap, clear outcome; if not accepted, decline without apology.",
        "Join one new community outside your lane; attend two events per quarter; have three meaningful conversations each time.",
      ],
    },
    文昌: {
      paragraphs: [
        "This decade, Wen Chang  sits in 大友, and your social world turns into a study lined with drafts. You’re the friend people text for a quick read, the colleague who can turn noise into a paragraph that lands. You love the pulse of being useful, yet you hate how your words can trap you in everyone’s plans. You type, delete, retype. You want belonging and accuracy at once. In group threads you become the translator; in meetings your notes quietly become the plan. The secret ache: who edits your heart while you edit everyone else’s?",
        "When you speak with intention, rooms align. This period attracts thinkers, makers, curators, the ones who build with ideas. Used well, it’s a decade of co-authoring, co-founding, convening salons, turning acquaintances into a working constellation. Your influence grows not by volume but by precision. Yet the pitfalls are clear: becoming the eternal secretary, smoothing conflicts that aren’t yours, mistaking gossip for context, and circling in analysis instead of committing. Generosity without structure will blur boundaries; cleverness without courage will keep you admired and strangely lonely.",
        "Build social architecture: roles, rules, rhythms. Choose fewer, brighter alliances. Put agreements in ink, not vibes. Ask for what you actually want, support, budget, credit, then give the same. Your pen is a key when it opens doors, and a lock when it avoids truth. If you don’t design your circle, the decade will design you; if you dare clarity, this network becomes your craft’s amplifier. Choose now, before the tide of other people’s needs becomes your map.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Host a monthly 90-minute circle; rotate facilitator and note-taker; publish a one-page decisions log.",
        "Before joining any collab, write a one-page brief: scope, timeline, money, roles, and an exit clause.",
        "Replace hints with asks: 'I need X by Y because Z.' Then confirm in writing.",
        "Wait 12-24 hours before sending heated replies; draft privately, send the calm, specific version.",
        "Block two hours weekly for network craft: thank-yous, introductions, and publishing one clear idea.",
        "Quarterly, review your top 12 contacts; invest in five who reciprocate; let two drift kindly.",
      ],
    },
    文曲: {
      paragraphs: [
        "You feel the room before you enter it, choosing words like notes so the mood lands just right. Friends confide in you because your presence softens edges; you can translate feelings into sentences everyone understands. Still, you often leave conversations with a slight ache, so much of you remains unsaid. You want to be known for your mind, your taste, your quiet brilliance, yet you worry that plain truth might disturb the harmony you work so hard to hold. So you refine, hint, smooth, and carry more of others’ stories than your own.",
        "This decade lights up your circle. Invitations, collaborations, whispered recommendations, your name travels on the lips of people who admire your style. Expect doors to open through friends-of-friends, salons, group chats, and late-night calls about projects that sound like love letters. But Wen Qu in the Friends palace draws a thin line between charm and entanglement. Flattery can blur contracts. Gossip can draft you into triangles that drain your time and heart. Money might mix with friendship; a “quick favor” can become a quiet obligation. Your gift is magnetism; your safety is clarity. Make your melody audible and binding: terms before warmth, boundaries before bonding. If you don’t choose your circle and set your language now, the decade will choose for you, through delays, leaks of energy, and stories told without your consent.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Speak needs and limits in first-person plain language: “I want X by Y date,” or “I’m not available for that,” no hints or soft hedges.",
        "Draft a one-page collaboration brief before you say yes: goals, roles, timeline, money, and exit terms. Share it and get agreement in writing.",
        "Run a quarterly friendship audit: mark contacts as + (energizing), - (draining), or = (neutral). Prioritize three pluses and reduce two drains this quarter.",
        "Protect solitude: block one evening each week for your craft (writing, music, study). Phone on Do Not Disturb; produce one tangible output.",
        "If conversation shifts to gossip, redirect to facts and next steps, or excuse yourself. Treat every message as quotable, assume screenshots exist.",
        "When mixing money and friendship, invoice formally and take 30-50% upfront. No work starts without written scope and a deposit.",
      ],
    },
  },
  大官: {
    紫微: {
      paragraphs: [
        "You carry the quiet weight of command, even when no title is pinned to you. In meetings, the room tilts toward your voice; people wait for your verdict, then judge you by it. You want the helm, yet dread the misstep that could cost trust. You crave respect, but refuse to demand it. Responsibility excites you and exhausts you in the same breath. You hold standards like stone, and chaos grates on your nerves. The crown here is invisible but heavy; you’ve been rehearsing authority for years, and this decade asks you to wear it in public.",
        "Work becomes a stage of institutions: policies, budgets, gates you must open for others. Your decisions ripple beyond projects into reputations and livelihoods. The Zi Wei current makes you a center of gravity; people orbit, seeking direction, and sometimes leverage. The test is not just skill but legitimacy: fairness seen, criteria stated, process respected. Build structures that outlast mood and crisis. Delegate early and precisely; the empire grows by stewarding, not hoarding. Replace the need to prove with the duty to protect. Lead like a lighthouse, steady beam, wide reach, no shouting, reliable in storms.",
        "Carried well, this cycle enthrones you; carried poorly, it magnifies every crack. Choose statesmanship over ego. Keep a long horizon, make others safer under your watch, and doors you once knocked on will open from the inside.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a 10-year mandate: three institutional outcomes. Share it on one clear page with your team.",
        "Appoint a personal council of three who can disagree with you; hold a monthly 45-minute candor review.",
        "Publish decision criteria before promotions or allocations; log reasons afterward; recuse when conflicts exist.",
        "Delegate with guardrails: define roles (RACI), budget thresholds, 30-60-90 day check-ins; cap approvals to three tiers.",
        "Practice reputation hygiene: address rumors within 48 hours, keep a one-page narrative, never vent downward, use a peer.",
        "Run crisis tabletop drills twice a year; pre-draft statements, map an escalation tree, and complete media coaching.",
      ],
    },
    破军: {
      paragraphs: [
        "You feel the old ladder buckling beneath you, yet you’re the one holding a hammer. In this decade, work exposes what’s rotten and summons your urge to dismantle and rebuild. You spot inefficiency in seconds, sense power vacuums, and move toward the fire while others step back. At the same time, the paycheck, title, and people who trust you tug you to stay polite, stay put. The inner friction lives between “break it open” and “don’t blow it up.” Colleagues may label you intense, yet they call you when a hard cut, a turnaround, or a decisive yes/no is needed.",
        "Po Jun in the Career palace brings sharp pivots: restructures, mergers, crisis mandates, or a leap into building your own thing. Days may swing from midnight fixes to morning approvals; you design new systems from ashes and carry the blame when politics flare. The lesson isn’t recklessness; it’s clean endings and bold restarts. Your gift is to strip what’s dead and reallocate life fast, but only when the container is strong: clear scope, firm timelines, and a runway that lets you act without panic.",
        "Handled well, you become the architect of necessary change; mishandled, you turn into a roaming wrecking ball, scattering momentum across dramatic exits. This decade rewards courage with containment, contracts, cash, allies, and exit criteria. Without them, one misfire can cost years and reputation. Choose which walls to break, and which to lean on, before the hammer swings.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "State your disruption in one line: problem, desired outcome, deadline. Share it.",
        "Build a 9-12 month cash buffer before resignations or aggressive bets.",
        "Run 90-day pilots; commit fully only after validated traction and fit.",
        "Define kill criteria: metrics and dates that trigger an orderly stop.",
        "After meetings, send a written recap: scope, owners, timelines, decisions.",
      ],
    },
    廉贞: {
      paragraphs: [
        "You walk into a room and your eyes go straight to the loose bolts ,  the policy nobody follows, the handshakes that feel like traps. You can't unsee it. Part of you wants to tear down the rotten beams and rebuild from bedrock; another part wants the corner office that proves you won. You carry a hard-won code: fair, exacting, allergic to hypocrisy. You test leaders to see if they deserve your effort. In crises you're strangely calm, stepping in where others hedge. Then, late at night, jaw tight, you rewrite the plan line by line and wonder why you're the one who always has to clean the mess. You crave authority yet resist playing the game; you want impact without selling your edge. This is the Lian Zhen knot ,  reformer’s fire inside a career that keeps offering you matches.",
        "This decade pulls you to the table where decisions cut and budgets bleed. The job is not to swing harder; it’s to cut cleaner. Your gift is turning gray zones into procedures, renegotiating boundaries, and rebuilding structures so they hold under pressure. But the shadow follows: scorched-earth emails, righteous sarcasm, battles chosen to prove a point. Visibility rises; so does scrutiny. Win by codifying your values into processes, building unlikely alliances, and letting evidence do the talking. Choose two hills, not ten. Guard reputation like capital, pace your push, and stage reforms in phases. Use power as a tool, not a mood. Move with precision, or the fire you light will circle back to your door.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page mandate (scope, timeline, non-negotiables) and share it within 30 days.",
        "Limit yourself to two strategic battles per quarter; calendar them; decline side fights calmly.",
        "Keep a dated evidence folder: data, approvals, and recap emails after key conversations.",
        "Meet two cross-department skeptics monthly; ask for objections early; adopt one feasible change.",
        "Wait 24 hours before sending hard emails; read aloud; remove blame; offer two options and a deadline.",
      ],
    },
    天府: {
      paragraphs: [
        "People come to you with the keys, the codes, the decisions that could make or break a quarter. You did not chase the spotlight; you became the vault - the person who keeps the house standing. You see the moving parts, the budgets behind the promises, the risk hiding in shiny pitches. You love order and the long game, yet part of you aches at being seen as the stopper. You're torn: protect what is already built or back the leap that could change the map. You hold the line because someone must, but you wonder who holds you. In rooms thick with politics, you sense every undercurrent, calculate quietly, and take responsibility others avoid. And still, a whisper: do not let prudence turn into paralysis.",
        "This decade asks you to move from careful caretaker to visible architect. Tian Fu in the Career seat favors stewardship, but not hiding; it wants structure that outlasts you, rules that make fairness scalable, reserves that can be deployed swiftly when the moment arrives. Your power is quiet, contractual, infrastructural - make it unmistakable. Write the rules of engagement, build alliances across silos, and modernize the tools so your judgment moves at the speed of events. Permit courage inside clear bounds: a portfolio of small, disciplined bets atop a fortress of cash flow. Define what you will say no to and what you will accelerate without further debate. If you do not claim this authority, you will turn into the gate you guard; if you do, you become the house itself - stable, generous, and impossible to ignore.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a one-page mandate: mission, three priorities, two hard no's. Share it and update quarterly.",
        "Set a 72-hour rule for approvals; decide, request one missing item, or escalate by the deadline.",
        "Build a cross-department budget council: 30-minute biweekly syncs to trade resources, unblock projects, and align roadmaps.",
        "Automate reporting: deploy a live dashboard; aim to cut manual status work by 20% within 90 days.",
        "Set aside 10% for pilot initiatives with pre-set success metrics and stop criteria; review results monthly.",
        "Train a deputy; document the top five processes, then take a 10-day unplugged break to test resilience.",
      ],
    },
    太阴: {
      paragraphs: [
        "You’ve long been the quiet fulcrum at work, the one who senses shifts before others notice, who steadies the team when deadlines turn choppy. You want authority without the circus, results without the megaphone. Part of you craves visibility; another part resists the glare and slips back into the shadows where you solve problems in peace. This decade draws you toward leadership by care: policies, standards, finances, operations, customer experience. It asks you to turn intuition into structure and to stop paying for harmony with your own invisibility.",
        "In real life, that means you’ll be the person who makes complex things simple, who writes the runbook everyone secretly uses, who notices the typo in the contract that saves the quarter. People bring you their chaos because you are moonlight: gentle, thorough, exacting. The risk is quiet overwork and louder colleagues taking the credit. Expect late hours, cross-time-zone coordination, and emotionally loaded asks. Your power grows when you make deliverables tangible and measurable, and when compassion comes with a boundary, care as a policy, not a leak.",
        "This cycle favors steady stewardship roles, finance ops, risk, compliance, knowledge systems, hospitality and healthcare operations, housing, logistics, anything that nourishes people or moves resources. Lead by clarity: clear standards, clear handoffs, clear prices. Let your rhythm guide the pace, reflect, decide, then announce. If you keep working in the dark, others will write the story for you. Name your contribution, set the terms, and the door opens to influence that lasts.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Publish your work boundaries: office hours, response times, and escalation paths; enforce them for two weeks straight.",
        "Make invisible labor visible: send a weekly 5-bullet update with metrics, risks, and decisions to stakeholders.",
        "Write scope before you help: define deliverables, timelines, and trade-offs; ask for the title or compensation that matches.",
        "Install a triage checklist for ad-hoc requests; if it’s not urgent or yours, redirect with a templated response.",
        "Run a monthly lunar cadence: New Moon set 1-3 priorities; First Quarter lock decisions; Full Moon demo results; Last Quarter archive and review.",
        "Build allies: schedule a monthly 30-minute check-in with cross-functional peers and one senior woman sponsor.",
      ],
    },
    巨门: {
      paragraphs: [
        "You carry a sharp, sensing mouth into the halls of power. In this decade, you spot the gaps others gloss over, the offhand claim that won’t stand, the policy nobody has truly read, the risk humming behind a cheerful slide. Part of you aches to name it cleanly; another part measures the room, knowing one sentence can shift careers. You become the person they pull aside in corridors and late-night calls: “Does this hold?” “What are we missing?” Your words steady crises, but they also attract shadows, rumor, defensiveness, misplaced blame. You crave respect for clear thinking, yet you are tired of being labeled “difficult” for saying what everyone is whispering.",
        "Ju Men in Career asks you to turn scrutiny into service. Make your craft precision: choose the forum, time your statement, and pair critique with a workable path. Document decisions; build alliances before you need them; let questions open doors where accusations slam them. Seek work that rewards careful speech, negotiation, counsel, compliance, research, policy, audit, crisis communications, so your gift is a mandate, not a problem. Expect pushback; expect to be tested. What matters is not winning every argument but moving the whole ship. If you speak clean, keep receipts, and stand with steady allies, you become the clarifier leaders rely on. If you vent, freelance, or fight alone, the same mouth that saves you can trap you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Put every key agreement in a dated summary email within 24 hours.",
        "In tense meetings, ask three clarifying questions before stating your position.",
        "Draft hard messages, sleep on them, then cut 30% of heat before sending.",
        "Build a three-person advisory circle outside your chain of command; consult before escalations.",
        "Choose roles/projects where ambiguity is high: audits, negotiations, policy, crisis comms.",
        "Keep a reputation ledger: monthly promises made, kept, slipped; repair publicly and quickly.",
      ],
    },
    贪狼: {
      paragraphs: [
        "You feel the hum of the hunt in your career now: not just a title, but a stage, an opening where your presence tilts the room. Doors crack when you lean; people talk, deals warm, ideas flock to your name. You can read desire in a glance and stitch strangers into a plan by lunch. Yet the same appetite won’t let you rest. One role can’t hold you; side paths sparkle; you run three tracks at once and promise more than the calendar can serve. You want the freedom to reinvent without losing altitude, to be both rainmaker and artist, to taste the rush and still be respected in the morning.",
        "With Tan Lang lighting your career palace this decade, charisma, negotiation, and reinvention pay. Fields that reward packaging, community, and bold pivots, branding, entertainment, growth, real estate, hospitality, politics, open when you show up fully. Networks become assets, a side play can become the main business, and your story becomes currency. The shadow is real: shortcuts dressed as smart moves, pleasure braided into power, gossip as tax, promises outpacing delivery. This cycle will hand you leverage if you bind appetite to structure. Without it, the spotlight burns fast and receipts pile up. Take this as a clean warning: the win is not the loud “yes,” but a name that stays bankable after the music drops.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Pick one flagship outcome per year; post it visibly; decline work that dilutes it.",
        "Run three checks before any deal: compliance, margin math, reputation risk; walk if one fails.",
        "Keep pleasure and power apart: no alcohol in negotiations; never date clients or reports.",
        "Block a weekly 3-hour deep work session; phone outside; ship one concrete deliverable.",
        "Convert every verbal promise to email within 24 hours, with numbers, owners, deadlines.",
        "Form a small council, operator, ethics hawk, finance brain, and review big moves monthly.",
      ],
    },
    天同: {
      paragraphs: [
        "You’ve always been the one who softens sharp edges at work: the person people seek when tempers flare, briefs are messy, or a client needs reassurance. You calm rooms, translate between teams, and quietly stitch frayed timelines back together. Yet beneath your steady smile lives a tug-of-war, part of you craves a gentler pace and harmony, while another part resents being overlooked, under-credited, or taken for granted. This decade places Tian Tong in your career seat, amplifying your gift for care, diplomacy, and humane leadership. It also spotlights a risk: becoming the office sofa, comfortable for everyone, but invisible furniture in your own story.",
        "Your power is not in dramatic takeovers; it’s in designing environments where good work flows. You read the room, preempt conflict, and salvage vague ideas into practical steps. But projects drift when you wait for universal consensus, and “I can help” quietly turns into “I own it all.” The growth path here is soft authority with hard structure, clear scopes, tidy rituals, measurable outcomes, so your kindness becomes a system instead of an open tab people charge to. When you pair empathy with boundaries, your presence stops being a cushion and becomes a backbone.",
        "Here’s the knife-edge: comfort can blur your direction. If you don’t set terms, others will. If you don’t claim credits, they dissolve. This cycle favors roles where care scales, operations lead, project/program management, service design, HR business partner, customer success head, if you step in with defined lanes and clear metrics. Turn what you naturally do for people into frameworks the whole org can use. Otherwise, the decade may end with you beloved but stalled, carrying loads you never chose. Choose now, or the choice will be made for you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page job contract with yourself: name your 3 core outcomes and 3 non-negotiables; review weekly and decline tasks that don’t trade off against them.",
        "Decide within 48 hours when you have 70% clarity; if you need more info, request it in writing with a deadline instead of waiting passively.",
        "Start a 30-minute weekly stakeholder roundup: surface risks, confirm owners, and lock next steps in a shared doc before the meeting ends.",
        "Before any cross-team task, send a roles-and-metrics email that states scope, boundaries, success measures, and what you won’t be doing.",
        "Practice one hard sentence daily: “I can’t take this without dropping X, what should I pause?” or “This isn’t priority this sprint; confirm if you want me to reallocate.”",
        "Track and report soft-power KPIs monthly (conflict time-to-resolution, onboarding satisfaction, renewal save rates) so your invisible work becomes visible leverage.",
      ],
    },
    天相: {
      paragraphs: [
        "You’ve long been the calm in stormy rooms: the one people trust to weigh, mediate, and bring order. You carry standards like quiet armor, yet you also carry everyone’s expectations. Part of you loves being the steady steward; another part aches to call the shot and be seen for it. You read the politics, smooth edges, collect input, then hesitate at the last inch, worrying about fairness and fallout. You’re praised as reasonable, but that praise can feel like a velvet cage: always responsible, rarely credited, blamed when others drift. You stay late to close loops others opened, write the policy no one read, hold the line so the brand, the team, the deal stays intact.",
        "This decade moves you from custodian to arbiter. Your gift isn’t endless consensus; it’s just rule, clean process, and humane authority. The work calls for governance, not appeasement: write the standards, cut ambiguity, and decide on time. When you claim the chair, your diplomacy becomes force, not softness: people relax because someone is finally accountable. If you keep smoothing, you’ll carry all the risk while fading from sight. Step into the light: name what you own, set deadlines for input, then rule with care. Fair, not soft. Clear, not cold. This is your upgrade, earned, grounded, and timely.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Publish your decision charter: what you own, who you consult, and how you veto. Keep it one page.",
        "Set decision dates and stick to them: input closes 48 hours prior; decide on schedule.",
        "Replace hints with direct asks: “I want X by Friday.” No softeners, no trailing question marks.",
        "Present two options with risks and your recommendation; stop seeking unanimous approval.",
        "Trade maintenance for impact: each week retire one low-value task and delegate or drop it.",
        "Secure mandate before extra work: if accountable, get written authority; if not, decline gracefully.",
      ],
    },
    武曲: {
      paragraphs: [
        "You don’t chase spotlights; you tighten bolts. In rooms where others perform, you run a quiet ledger in your head, costs, risks, margins, who delivers and who drains. You want clean lines, fair rules, measurable wins. Yet there’s a tug: you despise politics but know influence is capital; you crave control but carry the weight of everyone’s outcomes; you want to be respected for results, not charm, yet you’re asked to inspire, not just execute. You’ve learned that certainty comes from numbers and nerve, and still you worry that if you loosen your grip, waste and chaos will flood back in.",
        "This decade places the keys in your hand: steward resources, set standards, prune what’s bloated, and build systems that outlast you. You will be asked to say no more than yes, to negotiate from facts not favors, and to make decisions that keep the whole machine solvent and sane. Your power rises when you codify: clear budgets, decision rights, timelines, escalation paths. But steel can turn cold. If you cut without context, you’ll keep the numbers and lose the people. If you harden into austerity, you’ll become the lonely guardian of a perfect plan no one wants to follow. Let your firmness carry a human pulse, or the victories will feel empty.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Build a weekly scoreboard of five metrics that truly matter; review every Monday for 30 minutes and shift your focus accordingly.",
        "Make one direct ask each week (budget, headcount, decision) in a single clear sentence; send it and follow up within 48 hours.",
        "Use a 24-hour rule for irreversible cuts or terminations: gather one dissenting view, sleep on it, then confirm or revise.",
        "Delegate with clarity: for each project, name the owner, budget, deadline, and success metric; set check-ins, then step back unless red flags appear.",
        "Protect a 10-15% capacity or cash buffer; label it explicitly in plans and defend it in every meeting.",
        "Invest in two relationships: a senior sponsor (monthly 30 minutes) and a junior you champion (biweekly 30 minutes) to keep influence flowing up and loyalty growing down.",
      ],
    },
    天梁: {
      paragraphs: [
        "People find you when the lights flicker. You’re the porch light at work, the one who listens, stabilizes, and makes the fair call while others panic. You see where rules fail real people, and you quietly stitch things back together at 11 p.m., again. Yet there’s a tug-of-war inside: the guardian who can’t ignore a crisis vs. the leader who longs to prevent the crisis in the first place. You dislike politics but refuse to compromise ethics. You soothe with patience, then carry everyone’s weight in silence. And you’re tired of being thanked without being empowered.",
        "This decade asks you to evolve from rescuer to architect. Tian Liang in the Career palace matures into the judge who builds shelters that don’t collapse, systems, policies, culture. Your compassion remains your edge, but it needs a backbone and a budget. Move from late-night patches to daytime frameworks; from personal heroics to institutional protection. Claim visible authority for the very fairness you’ve been enacting offstage. If you don’t, your steadiness becomes an invisible cushion others sink into, while louder voices redraw the map. Honor your ethic by taking the chair where decisions are made, or you’ll keep mopping a floor you were meant to redesign.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-sentence mandate for your role (what you will protect and deliver) and say it in every key meeting for 90 days.",
        "Audit your last 10 crises; pick the top 3 patterns; design simple SOPs with owners and deadlines; get them approved within 60 days.",
        "Convert hidden labor into formal power: request title, budget, and decision rights with a 1-page impact brief and three measurable outcomes.",
        "Set boundaries that scale: offer weekly office hours for help, and route non-urgent requests there; say no to ad-hoc rescues outside that window.",
        "Decide faster and publicly: use a written rubric (must-have criteria) and announce decisions within 24 hours, including the why.",
        "Build a bench: choose two successors, delegate 20% of your workload in 90 days, and meet biweekly to coach them toward owning outcomes.",
      ],
    },
    七杀: {
      paragraphs: [
        "You’ve never been built for maintenance. When rooms drift into polite delay, your pulse climbs, you see the weak link, hear the clock, feel the blade in your hand. You’re the one who volunteers for the fire, who gets strangely calm at 11 p.m. when everyone else is fraying. Yet there’s a tug-of-war inside: you want the authority to act, but hierarchy chafes; you crave the win, yet tire of politics; you respect power, but can’t stand dithering wrapped as consensus.",
        "This decade puts you on the frontline. Expect crisis roles, turnarounds, zero-to-one builds, mandates to cut, merge, rewire. Your genius is decisive action under pressure and rallying people around a clear objective. Done right, you will carve new lanes, deliver what others only workshop, and earn the kind of respect that isn’t spoken, just granted. But Qi Sha cuts both ways: scorched-earth exits, public clashes, compliance landmines, enemies with long memories. The work is to select the right battles, secure cover before you strike, and make your force precise, not constant.",
        "You are not a caretaker; you are a campaign captain. Lead like one. Draw tight maps, move fast, leave clean lines behind you. This decade will reward courage and clarity, but it will punish impulsive warfare. If you don’t choose your battlefield and your rules, someone else will choose them for you, and the price will be your reputation, not just your job.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Pick two arenas where you will be measured (e.g., turnaround, new market entry) and decline projects outside them for the next 18 months.",
        "Install a 72-hour rule for resignations, ultimatums, and ‘nuclear’ emails; run the draft by one trusted peer before sending.",
        "Secure mandate in writing before accepting a role: scope, budget, authority limits, success metrics, and exit triggers if conditions change.",
        "Form a three-person war council (sponsor with clout, operator who knows the guts, truth-teller with no stake) and meet monthly for pre-mortems.",
        "Use a one-page decision brief for every major move: objective, options, risks, owner, timeline; loop legal/compliance when breaking norms.",
        "Practice clean conflict: state the standard, specify the remedy, set a deadline; no sarcasm, no public venting, and keep a written trail.",
      ],
    },
    太阳: {
      paragraphs: [
        "You carry the feeling that work is where your light must prove itself. You enter a room and it tilts toward you, people ask, what do we do? Instinct says step up, fix it, keep the orbit steady. Yet you resent how often others warm their hands at your fire without learning to make their own. You want a role big enough for your convictions, but the spotlight tightens your chest, what if they see the flaws? This is the pulse of the decade: hunger for impact, fear of exposure; generosity that keeps edging toward exhaustion.",
        "With Tai Yang in 大官, the path is unmistakable: lead in public. Your value rises when you set direction, not when you grip every task. Decisions made in daylight become policy; your calendar becomes a stage. The real job is to give light with boundaries, clear hours, clear standards, clear handoffs. The danger is martyrdom: late-night rescues, perfection that burns both ends, micromanaging born from care. The reward is authority built on clarity and steadiness, not heroic sprints.",
        "Your bond with authority shifts too. The supervisor who dismissed you, the father-voice demanding flawless, let them become teachers you outgrow. Be the leader you once needed: steady, transparent, human. Build systems that shine without you. Let your leadership feel like morning sun, warm enough to wake, not harsh enough to blind. This is an opening: choose visibility on your terms, and let others rise beside you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Block a 90-minute morning window for decisions and strategy; push reactive work to afternoons.",
        "For each project, write a single-sentence north star and share it with all stakeholders.",
        "Delegate by outcome: define done, deadline, guardrails; have them mirror the plan back to you.",
        "Hold two weekly office-hour blocks; outside them, protect deep work and say not now.",
        "Drop one low-impact meeting per week; replace it with team coaching or documentation everyone can use.",
      ],
    },
    天机: {
      paragraphs: [
        "Your mind is a switchboard of moving parts. You read rooms, anticipate dominoes, connect people, processes, and outcomes. In your career, this shows up as thoughtful pivots, projects rescued at the last minute, and quiet wins no one else could have engineered. Yet there is a tug-of-war: you want the impact of authority but dislike the bluntness of command; you crave certainty but your curiosity keeps opening new doors. So you orbit the center, trusted as the strategist behind the curtain, wondering when the curtain will lift.",
        "This decade, your gift is strategy that becomes structure. The work is to pick arenas where thinking turns into repeatable systems: product roadmaps, policy design, data workflows, change management. Build sequences, not just ideas. Speak in timelines, metrics, and owner names. Ask for scope that lets you test, learn, and ship. Influence still matters, but accountability becomes your edge; you become the person who can both see the maze and walk it. Expect multiple role shifts, but let them spiral upward around one core theme you’re willing to master.",
        "Here is the danger: endless analysis, sideways moves, and palace politics will dilute you. If you keep rearranging the chessboard without finishing games, someone more decisive will inherit your plans. Choose constraints, publish them, and let them bind you to delivery. Power accrues to those who close loops. Step into judicious visibility now, or risk being the most indispensable ghost in the building.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Use a 72-hour rule: gather facts 24h, seek dissent 24h, decide and announce by 72h.",
        "Pick one domain to own for 18 months; publish a roadmap and review cadence.",
        "Run two-month experiments with success metrics; present results; kill or scale without drama.",
        'In meetings, replace hints with clarity: "My recommendation is X because Y; decide by Z."',
        "Map stakeholders quarterly; brief each with a one-pager; document agreements and next steps.",
        "Before resigning or pivoting, wait 48 hours, write the trade-offs, consult one mentor, then decide.",
      ],
    },
    左辅: {
      paragraphs: [
        "You have a quiet gift for making order breathe. People hand you tangled threads, and somehow a workable plan appears on the table with checklists, owners, and deadlines. You are the steady hinge of many doors: the one who sees what’s missing, patches the gaps, and keeps the promise when others get distracted. Yet there’s a tug-of-war inside you. You want clean lines, fair process, and real results ,  but you’re tired of carrying what wasn’t yours, of being praised as indispensable while still sidelined when decisions are made. You dislike the spotlight, but you dislike being invisible even more.",
        "With Zuo Fu moving through your Career palace this decade, stewardship becomes your power. This isn’t about loud charisma; it’s about the influence of reliability, accurate judgment, and calm coordination. Older authorities may hand you the keys; mentors appear when you show your system, not just your effort. The invitation is to formalize what you already do: turn fixes into standards, favors into mandates, helpfulness into role and budget. If you don’t frame your contribution, someone else will fold it back into “help.” Boundaries are strategy here. Document agreements. Measure outcomes. Build alliances that outlast a single project. Your path is from helper to builder of institutions ,  the trusted second who quietly shapes the whole stage. Say yes to being seen: this decade rewards clarity, structure, and the courage to ask for proper authority before you lift a finger.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page playbook for your team: roles, decision rights, and meeting rhythm.",
        "Before accepting a rescue task, ask outcome, authority, and resources; confirm the agreement by email.",
        "Hold weekly one-on-ones with key partners; capture decisions and send a clear recap with next steps.",
        "Block two deep-work windows weekly; treat them as immovable meetings and guard them fiercely.",
        "Keep an impact log with dates, metrics, and names; use it to negotiate scope, title, and budget quarterly.",
        "If credit is misattributed, address it within 48 hours: state facts, loop stakeholders, and propose a better process.",
      ],
    },
    右弼: {
      paragraphs: [
        "This decade casts you as the steady hand everyone reaches for when things wobble. You read rooms quickly, translate egos, and make chaos behave. People loop you in because calls go smoother when you’re there, decks get sharper after you touch them, deals land when you broker the middle. Yet there’s a tug in your chest: you want the work to shine without noise, but you’re tired of walking offstage while others take the bow. You’re generous by instinct and diplomatic by craft, but the cost of being endlessly helpful is quiet resentment and late-night second-guessing, am I respected, or just convenient?",
        "This is a relationship-powered rise, if you pair grace with boundaries and receipts. The right allies appear, sponsors who appreciate your tact, teams that need your coordination, clients who trust your word. Step from helper to co-author by making your influence visible and negotiable. Say yes to roles that put you near the table (chief-of-staff energy, program lead, client success, partnerships), and say no to fuzzy “can you just” asks. Your calm doesn’t have to be quiet; it can be directive. When you set clear lines, people treat you like the standard. Use your diplomacy to move budgets, finalize decisions, and shape culture. Let this be the decade you’re not simply the glue, you’re the joinery that decides the structure.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Send a weekly “Decisions and Outcomes” note naming what moved forward, your role, and one metric; cc stakeholders who benefit.",
        "Before rescuing any project, secure a written scope, decision rights, and a visible title; no title/authority, no takeover.",
        "Book a monthly 30-minute sponsor check-in with a simple cadence: three wins, one risk, one clear ask.",
        "Use a boundary script: “I can advise for 30 minutes; execution needs a project code, timeline, and owner.” Say it verbatim until it sticks.",
        "In meetings, state your position once, plainly, then ask: “Who decides and by when?” Capture the owner and date in writing before you leave.",
        "Keep a live favor ledger; for every two cross-team favors, request something tangible, budget, headcount, or stage time to present your work.",
      ],
    },
    文昌: {
      paragraphs: [
        "You’ve long known how a single well-placed sentence can turn a meeting. You’re the one who trims, tunes, and names the thing precisely; the one people seek for the right words when stakes are high. Yet there’s a tug-of-war inside you: stay the discreet editor behind the curtain, or step to the microphone and be accountable for the call? You want rigor, clean logic, and orderly systems, while reality arrives messy, rushed, and political. You’re respected for your drafts and frameworks, but you hunger to be recognized for the decisions those drafts enable.",
        "With Wen Chang  in Da Guan this decade, your craft becomes your ladder. Strategy, policy, analysis, communications, research, product specs, the room will ask for clarity, and your clarity can lead. The risk is getting trapped in endless polishing and polite hedging, becoming indispensable to process but invisible to outcomes. This is a growth cycle if you let your words move decisions, not just document them. Choose authorship over anonymity. Speak plainly, stand behind recommendations, and set a cadence that ships. When you do, your name travels with results, and your quiet precision becomes a public strength.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Block a weekly 90-minute “ship window” to publish one memo, Loom, or deck that drives a decision.",
        "Replace 30-slide updates with a one-page decision memo; open meetings by reading it and ask for a clear yes/no.",
        "Cap polish at 80%: set a 45-minute timer, send the draft, and request two specific critiques instead of vague feedback.",
        "Speak in decisions: start with “I recommend…” followed by three concrete reasons and the trade-off you accept.",
        "Build public credibility: post one concise LinkedIn lesson per week for 10 weeks tied to your domain results.",
        "Protect your reputation: never forward gossip; move sensitive topics to scheduled 1:1s with documented next steps.",
      ],
    },
    文曲: {
      paragraphs: [
        "You’ve always been the one who can make messy ideas sing. In this decade, Wen Qu  lights up your career, asking you to lead with words, taste, and finely tuned perception. The tug-of-war is real: you want admiration for elegance, yet respect for results. You polish until it gleams, then worry nothing truly moved. You read a room in seconds, adjust your tone, and later wonder if you softened the truth. The spotlight tempts you to be pleasing; your conscience asks you to be precise.",
        "Work becomes narrative power: strategy decks, policy memos, brand stories, investor notes, syllabi. People will bring you problems and say, “Make this land.” You’ll hear the office politics like a soundtrack, subtext, loyalties, fault lines, before others catch the beat. The risks: taking on invisible emotional labor, becoming the ‘presentation person’ without real ownership, letting applause dictate your mood, or getting pulled into gossip that burns your credibility just when you’re nearing the table where decisions are made.",
        "Your edge is not ornament, it’s navigation. Anchor your art to standards and measures; speak plainer, ship steadier. Claim rooms by naming the decision, tradeoffs, and next step. Turn taste into repeatable systems so your craft scales beyond you. Choose mentors who reward clarity over charm. When you tie your elegance to outcomes, your voice stops decorating power and starts directing it. This decade opens if you protect your time, tell the unvarnished truth kindly, and show your work on schedule.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Ship on a cadence: every 2 weeks publish one memo/prototype and track a single KPI.",
        "Pre-meeting spine: write your one-sentence point and three numbers; open with it and ask for a decision.",
        "Say no cleanly: “I can deliver A by Friday or B next week, what matters more?”",
        "Convert taste to system: build a 10-point quality checklist; share it and delegate using it.",
        "Guard reputation: no gossip on Slack; praise in public, critique 1:1; never forward screenshots.",
      ],
    },
  },
  大田: {
    紫微: {
      paragraphs: [
        "For this decade, you crave a domain that answers to you. You’re tired of negotiating your life around other people’s walls, rules, and leases. You find yourself reading floor plans like love letters, noticing where the light falls at 4 p.m., imagining how a door moved two feet could change the whole feeling. Part of you wants a home that looks like authority, impressive, curated, worthy of your name. Another part whispers for sanctuary, quiet mornings, sturdy bones, keys that only you hold. You feel the pull of legacy: family expectations, old properties, the idea that land can carry your story forward. Yet responsibility weighs heavy: mortgages, repairs, relatives with opinions. You want sovereignty without becoming a jailer to yourself or others.",
        "With Zi Wei seated in 大田, your power grows through stewardship. This is a cycle to consolidate, title things properly, choose a location that serves your future, and build routines that keep the home, and those within it, steady. Your presence can turn chaos into order, but beware the glitter trap: prestige renovations that don’t fix the leaks, or micromanaging loved ones until warmth leaves the room. Invest in foundations, not just finishes; clarity, not control. When you lead with calm authority and humble maintenance, the walls become allies, and assets quietly multiply. The window is open now: make the decisive moves that anchor you, before momentum drifts to “someday.”",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write and post a Home Charter: five clear house rules (money, noise, guests, chores, privacy). Review and adjust every quarter.",
        "Set a 10-year property plan: buy, consolidate, or exit. Cap total housing costs at 30% of net income and auto-transfer savings monthly for the down payment or repairs.",
        "Before any upgrade, split a list into Structural vs Show. Commit to a 70/30 spend in favor of structure (roof, plumbing, insulation, wiring) and always get two quotes.",
        "Fix titles and inheritance now: confirm deeds, create a will or trust, document any family loans/gifts in writing, and tell one trusted person where these papers live.",
        "Do field checks for any property: zoning, flood/fire maps, noise at different hours, commute time, resale comps, HOA rules/fees. Walk the block day and night and talk to neighbors.",
        "If sharing or landlording, use written agreements, screen with income/references, keep a 3-month repair reserve per unit, respond within 24 hours, and sleep on any eviction decision for one day.",
      ],
    },
    天府: {
      paragraphs: [
        "This decade turns you into the quiet treasurer of bricks, soil, and sanctuary. You crave the feeling of full cupboards and a door that locks, proof that you can shelter the people you love. Yet you also hear a restless hum: expand or protect? Host generously or keep the house still so you can breathe? You can sense the weight of keys, deeds, and inherited expectations; even the furniture seems to hold stories that make it harder to let go. Still, you know your gift: order, provision, and the calm confidence that comes from owning your ground.",
        "The season favors steady builders. Property, land, and long-lived assets respond to your patience, not to rush. What wants to happen now is consolidation with intelligent growth: clean titles, clear agreements, and cash flow that means the house feeds you back. Your danger is softness, saying yes to every request, overextending for appearances, or hoarding “just in case” until your space can’t breathe. Let money and home have containers and rules. With simple boundaries and honest math, your sanctuary becomes a living treasury: it nourishes many without draining you. That is the sweet glow of 天府, quiet abundance that lasts.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Define “enough” in numbers: set a net-worth target, a monthly cash-flow goal, and a 12-18 month cash buffer; write them where you can see them.",
        "Cap real-estate exposure: no more than X% of your net worth in property; stress-test every purchase for a 2% rate rise and 6 months vacancy.",
        "Do a quarterly home audit: fix one safety repair, one efficiency upgrade, and one comfort improvement; update insurance and photo-inventory annually.",
        "Use written agreements with family or friends around housing, loans, or co-ownership; set start/end dates, interest or rent, and exit clauses.",
        "Declutter on a schedule: one room per month; sell or donate anything unused for 12 months; convert “dead” items into cash or clear space.",
        "Get your foundation legal: will, beneficiaries, property titles, and ownership structure reviewed by a professional; keep copies in a fireproof box.",
      ],
    },
    廉贞: {
      paragraphs: [
        "You crave a home that answers to your will, orderly, intentional, unmistakably yours, yet the urge to rearrange, upgrade, or move never quite sleeps. One week you sketch floor plans at midnight; the next you’re scrolling listings, sensing power in every doorway and deed. You argue about a single drawer because it symbolizes territory. You listen to the hum of the fridge like a vow: this space will not shrink me. You want both fortress and stage, privacy and proof, to build a domain that mirrors your grit and magnetism.",
        "Lian Zhen ignites reform: you can turn bare rooms into engines, rentals into leverage, houses into strategies. Negotiation sharpens; people feel your presence at the table. Yet its heat can burn, permits delayed, neighbors bristling, rules tested, money leaking from the places no one photographs. Control can become a cage; secrets loved behind locked doors can rot the beams. The more you push without structure, the more your space pushes back. Moves repeat a pattern, repairs expose an argument, and the house tells a truth you tried to avoid.",
        "This decade asks you to rule your territory by clear rules, on paper, in budgets, through boundaries you actually enforce. When your power is channeled, your home becomes a citadel that feeds your courage; when it isn’t, every decision cuts like a blade that swings both ways. Sign nothing you haven’t stress-tested. Put the boundaries in ink. Otherwise, you’ll rebuild the same lesson at a higher cost.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page home mission: non-negotiables, budget, why you’re staying or moving.",
        "Before signing any lease, loan, or contractor deal: 24-hour cool-off and lawyer review.",
        "Use a checklist for permits, inspections, title search, and HOA/strata rules; file everything.",
        "Build a repairs war chest covering 3-6 months of costs; stress-test rates +2%.",
        "Set house rules in writing with partners/roommates; review quarterly; use a cohab agreement.",
        "For renovations, get three bids, phase the project, cap change orders, and never pay upfront.",
      ],
    },
    破军: {
      paragraphs: [
        "You’ve always wanted a solid base, yet your roots itch. Nights scrolling listings, shifting furniture at midnight to see if a new layout could quiet the restlessness. The old home feels too tight; drawers heavy with history; family voices say stay put, but another part of you longs to clear rooms, shave debt, and cut keys to a door that matches who you’re becoming. You can smell fresh drywall, hear the echo of an empty room where you’ll decide what stays. Yet there’s fear: mortgages, surprise repairs, fights about inheritance, a wrong street that traps you.",
        "Po Jun in the Property sphere marks a decade of demolition-and-redesign. Expect addresses to change, walls to move, rooms to earn their keep. You’ll favor sturdy bones, industrial edges, flexible spaces, co-living or micro-leases when it buys freedom. Treat home and assets as a living project, not a shrine. Build mobility and liquidity; document agreements; choose function over nostalgia. Done well, you’ll break the family blueprint and assemble a lean, resilient base that actually supports your life. Drift or rush, and costs, disputes, and maintenance monsters will outrun you. Move with a plan, or the tide will move you.",
        "This decade asks you to become the builder of your own shelter story. Strip what’s dead, keep what’s alive, and let light in. A leaner home can be warmer if it’s aligned. Anchor simple rituals: quiet mornings, tools in their place, bills on autopilot, so change doesn’t fray you. Let rooms carry revenue when needed, and joy when not. Choose autonomy over approval; love family, but don’t inherit their floor plan. You don’t need the perfect house; you need a base that moves with you. Start with one decisive change this month and let momentum do the heavy lift.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Map your next 10 years: review dates for leases or mortgages, decision gates, max leverage, cash buffer.",
        "Test neighborhoods via 3-6 month rentals before committing to buy or long leases.",
        "For any renovation, set scope, budget, 20% contingency, and a stop-loss point to walk away.",
        "Reduce weight: sell or donate 25-30% of possessions in 90 days to speed moves.",
        "Use a strict property checklist: drainage, structure, wiring, noise, HOA or strata reserves; reject on two fails.",
        "Keep family or co-investor money clean: written agreements, roles, repayment schedule, and a clear exit clause.",
      ],
    },
    太阴: {
      paragraphs: [
        "With Tai Yin lighting your Da Tian decade, you’re pulled toward sanctuary. You can feel a room’s mood before anyone speaks; a quiet corner can cool your storms, and a cluttered shelf can stir them. Late at night you scroll listings or imagine renovations, heart softened by moonlit photos, mind alert to leaks, neighbors, inheritance knots. You want soft beauty and dependable shelter, yet fear being trapped by walls or family expectations (especially maternal lines). You soothe others’ homes before tending your own, then wonder why your foundations still creak. When your space supports you, your gentleness becomes strength; when it doesn’t, your thoughts turn tidal.",
        "This placement favors slow, luminous accumulation: thoughtful upgrades, modest rentals, and spaces that earn their keep through calm reliability. Value here hides in light, airflow, soundproofing, plumbing, and paperwork, titles, easements, HOA minutes, not just paint and pillows. The pitfall is lunar illusion: idealizing a perfect nest while stacking sentimental boxes and postponing fixes. Watch moisture and money seepage; negotiate before you decorate. Co-ownership can nourish if boundaries are written; otherwise, guilt taxes your peace. Decide by daylight: night ideas are poetic but impractical. Measure the feelings you seek, quiet, safety, beauty, and price them honestly.",
        "Treat home as a living system, measurable, maintainable, and moonlit, and you build quiet wealth and truer refuge. Drift on feeling alone, and clutter, leaks, and family fog will swallow your margins. Choose the tide that carries you, not the whirlpool that keeps you circling.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Use a two-visit rule for any property: morning and evening; checklist light, noise, damp, title, fees; wait 24 hours before offers.",
        "Create a 12-month maintenance calendar: gutters, roof, caulking, leak checks, HVAC filters, dehumidifiers; set recurring reminders.",
        "Run the numbers: only proceed if rent or savings covers mortgage/fees with a 20% buffer; build a six-month property reserve before closing.",
        "Declutter quarterly: release 20 items; cap sentimental storage to one labeled box per room.",
        "If involving family, sign a co-ownership agreement detailing roles, cost splits, decision process, and exit terms before any money moves.",
        "Set a moon-mind boundary: no property decisions after 9 p.m.; park worries in a morning action list; use blackout curtains to protect sleep.",
      ],
    },
    贪狼: {
      paragraphs: [
        "You want a home that is both stage and sanctuary: a place where lights come on, friends pour in, ideas flow, and then, somehow, a hush returns so you can breathe. Your eye drifts to bigger rooms, better views, richer textures; you can feel the pull of a new address like a song you can’t stop humming. You upgrade when you’re inspired, rearrange at midnight, and chase the spark of spaces that promise a new version of you. Yet after the buzz, you crave a door that truly closes, bills that don’t whisper at 2 a.m., and a table that holds only what matters.",
        "With Tan Lang lodged in Da Tian this decade, magnetism gathers at your threshold: guests, deals, and opportunities to turn square footage into cash flow. You can host communities, flip layouts, or rent out corners of your life and make it look effortless. But indulgence is a quiet landlord, every velvet cushion and weekend party demands its fee. Without firm lines, your home becomes a carousel of repairs, overstaying visitors, and impulsive upgrades that bruise your finances. Let your desire curate, not consume. If you don’t set rules and numbers now, lovely chaos turns into expensive chaos, fast.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a monthly “home fund” (at least 10% of income) and spend upgrades only from it.",
        "Use a 30-day cooling-off rule for purchases over a set amount; no exceptions, even on sale.",
        "Write house rules: guest limits, quiet hours, no sleepovers beyond two nights, post and enforce them.",
        "If monetizing space, pick one model and run numbers; aim for 8%+ gross yield or don’t proceed.",
        "Do a quarterly reset: remove 30 items, deep-clean, and fix three nagging issues within seven days.",
        "Before moving, test the neighborhood via a one-week stay; choose where your daily life is within 20 minutes.",
      ],
    },
    巨门: {
      paragraphs: [
        "You’ve longed for a home base that hushes the world, yet you hear everything, the drip in the wall at 2 a.m., the neighbor’s bass line, the silence after a tense family chat about land or legacy. Your tongue can open doors and also slice through thin peace; you negotiate well, then lie awake replaying every clause. You want clean lines, clear borders, honest contracts, no surprises, yet you sense the undercurrents in deeds, rumors, and pipes. You carry a measuring tape in your glove box and a knot in your stomach when a signature comes with someone’s smile.",
        "This decade turns your attention to ground, walls, and the air between them. Ju Men here stirs talk around property, acreage, and the rules of living together, neighbors, zoning, inheritance, rent. The shadow side is moisture, mold, leaks of both water and words; the gift is precision. Let your sharp speech become exact agreements, not lingering arguments. Make documents, inspections, and maintenance the voice that defends you. Treat sound and water as first priorities: what you quiet and what you drain will calm your mind. If you honor boundaries, legal lines, house rules, budgets, this cycle can grow real wealth and a sanctuary that actually rests you.",
        "But take the warning seriously: if you let grievances simmer or trust hearsay over records, disputes will multiply, fees, fixes, sleepless nights. Choose clarity early. Walk the land after rain. Put every promise on paper. Repair before resentment. This is the decade where whispers can become storms, or where your steadiness turns a house, a field, a room into a strong, quiet center.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Before buying or renting, visit three times (day, night, weekend). Run taps, flush toilets, listen for noise, test cell/Wi-Fi, and note smells after 10 minutes.",
        "Put boundaries in writing: order a boundary survey, mark corners, record easements, and sign fence/parking agreements. No handshake deals.",
        "Do due diligence: full title search, zoning and flood maps, HOA bylaws, and soil/drainage tests. Walk the property right after heavy rain.",
        "Create a repairs-first fund. Auto-transfer monthly and fix water, ventilation, and sound issues within 30 days. Keep dated photos and receipts.",
        "For tenants or family arrangements, set house rules, quiet hours, kitchen and trash routines, guest limits, and use a simple written agreement. Do quarterly walkthroughs with a checklist.",
        "When conflict sparks, use a three-sentence script: state the issue, state what you want, set a deadline. Avoid late-night texts; sleep 24 hours before escalating to legal action.",
      ],
    },
    天同: {
      paragraphs: [
        "You have a soft spot for places that feel like a hug. In this decade, your attention keeps returning to home, land, and the spaces you keep. You soothe others and smooth the edges of rooms; you can sense when a corner wants a lamp or a friend needs a couch to sleep on. Yet underneath that kindness is a tug-of-war: craving a gentle, beautiful life, while postponing the hard choices, lease vs. mortgage, renovating vs. moving, boundaries with family. You keep peace by paying with your own quiet. The urge to nest deepens, and with it, calls from relatives, neighbors, or tenants who want your steadiness.",
        "You find yourself scrolling listings at midnight, rearranging furniture to feel “right,” and buying small comforts that add up. You patch leaks and feelings with the same towel. Weeks pass in pleasant busyness, hosting, tending, making soup, while the big decision sits in the hallway like an unopened box. Money seeps through decor splurges and “temporary” fixes; compromises at home grow fuzzy; your name ends up on bills you didn’t mean to own.",
        "This cycle blesses warmth, community, and sanctuary, but it punishes drift. If you cushion every discomfort, you could wake a decade later in a pretty room without equity, clear agreements, or breathing space. Choose structure that protects softness: timelines, budgets, inspections, and simple, honest no’s.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a three-line home purpose and post it. Use it to decide what enters, what leaves, and where money goes.",
        "Make a 90-day housing call: stay, renovate, or move. Set dates, book an agent/inspector, and cap decor spending monthly.",
        "Adopt a 24-hour rule for home purchases over $200. Track them; if comfort is the only reason, delay or downgrade.",
        "Create a maintenance calendar. Do quarterly walk-throughs and auto-transfer 10% of housing costs into a repair/upgrade fund.",
        "Draft a household agreement: quiet hours, chore split, guest policy, money responsibilities. For family stays, set length and contribution.",
        "Build property literacy: take one weekend class, run a rent-vs-buy sheet with real numbers, insist on inspections/HOA review, and keep six months of housing expenses in cash.",
      ],
    },
    天相: {
      paragraphs: [
        "You’ve long been the quiet custodian of space, straightening frames, keeping the passwords, paying the bills on time, making sure the roof holds when storms roll in. You want a home that feels dignified, harmonious, and genuinely yours, yet you often find yourself mediating between relatives, contractors, and rules you didn’t write. You delay a move or renovation because you want it done right, then end up handling everyone’s expectations anyway. People trust your judgment, but their reliance makes your boundaries blurry. You keep the peace, collect the receipts, and wonder when the house will finally feel like it’s taking care of you too.",
        "With Tian Xiang in the Property decade, you are meant to become the steward, not just the caretaker. This energy rewards order, fairness, documentation, and principled negotiation. Homes, land, leases, and family assets can stabilize and grow under your calm governance, if decisions are made by written agreements instead of goodwill alone. The pitfalls are bureaucracy and over-deliberation: letting perfect plans stall necessary fixes, pleasing relatives past reason, or trusting a handshake where a clause should be. Choose quality, structure, and clear roles; they are your protection and your profit.",
        "Step into the trustee’s chair. When you put systems and boundaries in place, your home stops draining you and starts compounding serenity and value. This decade can turn your space into a sanctuary and an asset, refined, reliable, and unmistakably yours.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page Home Charter: purpose, non-negotiables, roles, and cost-sharing; share it with everyone who lives or benefits there.",
        "Build a property command system: a binder or cloud folder with title, insurance, permits, warranties, contractor contacts, and a 12-month maintenance calendar with reminders.",
        "Before any purchase, sale, or lease, run a pre-sign checklist: comps, inspection, HOA/strata bylaws, zoning, exit clauses, and financing contingencies; if any fail, walk away.",
        "Set a capital-reserve autopay: transfer 1-2% of property value per year into a dedicated repair/upgrade account, and don’t touch it for anything else.",
        "Choose one structural upgrade that increases calm and value (e.g., soundproofing, storage systems, plumbing main) and complete it within six months.",
        "For shared or inherited property, replace verbal promises with a simple written MOU covering ownership percentages, costs, usage rules, and exit terms, signed by all parties.",
      ],
    },
    武曲: {
      paragraphs: [
        "You’ve always felt safer when things click into place: the drawer that closes cleanly, the spreadsheet that balances, the front door that locks with a satisfying weight. In this decade, your backbone stiffens whenever the home gets messy or money leaks through little cracks. You want a house that holds its own and a portfolio that doesn’t wobble when the wind rises. At the same time, you worry that being too strict will make the rooms feel cold, or that debt could shackle the freedom you’re building. So you toggle between purging and providing, between drawing hard lines and trying to be soft. Family may call you exacting; secretly, they lean on your steady hands. You’re the one who fixes the hinge, reads the fine print, and makes sure the lights stay on.",
        "This is a decade of foundations, literal and legal. The energy pushes you to consolidate assets, repair what’s tired, and trade convenience for durability. It favors deeds recorded properly, budgets that bite, and a home arranged to support real work, real rest, and real cashflow. Expect opportunities around property, leases, renovations, or turning space into income; also expect tests: paperwork tangles, neighbor boundaries, and the temptation to build a fortress so tight there’s no room for warmth. Your strength now is sober judgment and patient construction. Speak plainly, choose materials that last, and let your rules protect, not punish. If you commit to clear structures and humane boundaries, this decade can turn brick and soil into quiet power, and a home that makes you braver, not harder.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Cap total housing cost (mortgage/rent, taxes, HOA, insurance) at <= 30% of net income.",
        "Build a 6-9 month property reserve in a separate high-yield account; automate weekly transfers.",
        "Before any buy/sell, complete title search, full inspection, and a 24-hour cooling-off period.",
        "Sequence renovations: safety (electrical, gas, plumbing) -> envelope (roof, waterproofing) -> function -> aesthetics.",
        "Hold a 30-minute monthly “house ledger” review: cashflow, repairs, leases, and next three actions.",
        "If co-owning or helping family, use written contracts with timelines, contributions, and exit clauses.",
      ],
    },
    天梁: {
      paragraphs: [
        "You know what it is to be the last light left on. Your key ring is heavy, your hands remember every switch and hidden latch. You patch leaks, soothe family flare-ups, wrangle bills, and keep the roof steady when others sleep. You want a home that holds everyone safe, yet some days you crave a door that closes just for you. You are the keeper of roots and records, the one who repairs before replacing, who carries more keys than rest. The pull is real: honor the old walls, or move toward a simpler, truer space? Loyal to the shelter that raised you, you give even when the house asks for more than you can spare.",
        "With Tian Liang presiding over the Property palace this decade, life steers you toward foundations: titles and leases, renovations and roommates, land lines and inheritance. You are called to mediate, stabilize, and make the home both refuge and responsibility. Older buildings, elder relatives, and long agreements orbit you. Progress is steady, never flashy; protection grows through structure, clear contracts, healthy boundaries, and routine maintenance. This is an excellent cycle to restore, legalize, and consolidate: purchase something solid, refinance wisely, or turn a house into sanctuary through patient fixing rather than impulsive flights. The house will mirror your choices: neglect breeds damp; clarity dries it out.",
        "Your gift is shelter; your risk is martyrdom. If you keep saying yes to every need, your own room disappears. This decade asks you to be a compassionate steward, not a live-in savior. Choose what you will maintain, and let the rest go. Walls remember indecision, make them remember your standards. Act while the paint is still wet.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Do a home and paperwork audit this month: list repairs, permits, taxes, titles; set dates and a realistic budget.",
        "Put co-living agreements in writing: chores, quiet hours, shared costs, guest rules; review together every quarter.",
        "If inheritance or co-ownership is involved, hire a mediator now; document percentages, buyout terms, and timelines.",
        "Before buying or renovating, pay for an independent inspection focusing on roof, moisture, wiring, and drainage; negotiate or walk away.",
        "Declutter by commitment, not sentiment: one room per month; donate anything you keep only “out of duty.”",
        "Protect your sanctuary: designate one space that is yours alone; spend 20 minutes daily to maintain it, non-negotiable.",
      ],
    },
    太阳: {
      paragraphs: [
        "You’ve been carrying the house like a small sun ,  warming everyone, paying attention to the loose tiles, the noisy pipe, the deed that no one else reads. You want rooms that breathe, a garden that grows, a base that feels honest and bright. Yet there’s a tug: you’re proud to provide, but tired of being the only one who knows where the spare keys are, who answers when family asks for “just one more favor.” Sometimes you wonder if a bigger place or a new address will finally prove you’ve made it ,  and then you question whether you’re building a home or performing one.",
        "This decade with Tai Yang in Da Tian switches on the lights in every corner of land, home, and legacy. Moves, renovations, or acquisitions are favored, but the real work is stewardship: clear titles, clear boundaries, clear purpose. Your leadership can tidy chaos ,  tenants settle, contractors respect the schedule, relatives stop circling when you set the rules. The same light also exposes cracks: vanity projects, inherited resentments, spending to impress rather than to serve. Keep the ego out of the floor plan, and let the space serve life. When you do, the house becomes a power source: mornings feel crisp, finances steadier, and your warmth feeds you back.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a 10-year property plan with three milestones: debt payoff target, one upgrade (e.g., rental unit or insulation), and a move/acquisition date.",
        "Visit any potential home or land twice before committing (7-9 a.m. and 4-6 p.m.) to judge light, noise, neighbors, and traffic.",
        "Ring-fence a renovation fund; cap total spend at 15% of annual household income and add a 20% contingency before approving any work.",
        "Run a 30-minute pre-mortem before signing deeds or contracts: list five plausible failure points (permits, cost overruns, vacancy, drainage, neighbor disputes) and your countermeasures.",
        "Formalize the paperwork now: title search, insurance review, beneficiary designations, and a simple will; store copies in two places and share access with one trusted person.",
        "Hold a monthly “house day” for maintenance and clutter; assign one task per household member and use this script for boundaries: “I can do X or Y this month; I can’t take on Z.”",
      ],
    },
    七杀: {
      paragraphs: [
        "You feel place like a campaign, rooms are positions, hallways are supply lines, the front door a gate you guard with instinct. A restless part of you wants to move, to strip what’s bulky, to swap softness for steel and clean lines. You browse maps at midnight, eyeing fixer-uppers, raw land, the industrial corner no one else dares. There’s the pull between building a fortress and charging the next hill: the thrill of decisive change versus the whisper, “Will this uproot what keeps us steady?” You cut through fluff with agents and contractors, and that clarity wins bidding wars, but it can also scorch bridges and leave you carrying the whole load.",
        "This decade puts territory, home, and assets at the center of your power. Qi Sha sharpens your will to claim ground: consolidating holdings, trading up with purpose, turning chaos into a clean, efficient base. Distressed properties, under-used spaces, and relocations linked to ambition favor you, if you run them like operations, not impulses. The risks are classic 七杀: over-leverage, skipping inspections, verbal deals that unravel, boundary disputes that explode. Permits, easements, heritage rules, and title quirks matter more than charm. Your household needs a clear chain of command and defined zones; otherwise tension multiplies and the home becomes a battlefield instead of a barracks.",
        "March with a map, not a mood. Choose the hill you’ll hold, the few moves that actually upgrade your life, and build there with discipline. If you chase the adrenaline of demolition, you’ll live in perpetual transition; if you plant your flag with strategy, this decade turns your courage into shelter and your grit into value that lasts.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set hard criteria before shopping: location, budget ceiling, must-haves, deal-breakers. Use a 72-hour rule before signing anything above your comfort line.",
        "Never skip due diligence: full structural and pest inspections, title search for liens/easements, permit history, and at least two walkthroughs at different times of day.",
        "Cap leverage and build a buffer: fix your rate where possible and keep 6-12 months of mortgage, taxes, and repair money in a separate reserve account.",
        "Put agreements in writing: correct names on title/trust, clear ownership percentages, buyout clauses, and household cost splits, even with family.",
        "Treat renovations like missions: verify licenses/insurance, pay by milestones, require permits before work, and add a 20% contingency to time and budget.",
        "Run a quarterly “fortress day”: declutter, repair one structural item, and reset room roles (work/rest/storage) to reduce friction and keep the base sharp.",
      ],
    },
    左辅: {
      paragraphs: [
        "You’ve always been the steady pair of hands at home, the one who notices the loose hinge before it squeals, who files the papers no one else remembers exist. You crave a calm base, a place where drawers close softly and the ground under your feet feels earned. Yet there’s a tug: the more you care, the more you see, and the more you see, the harder it is to rest. You want to support everyone, but you don’t want to be the only one holding the roof up.",
        "This decade asks you to turn that instinct into architecture. With Zuo Fu in the domain of land and home, small, careful moves compound into security: clear titles, clean closets, watertight plans, respectful ties with neighbors and professionals. Helpers appear, mentors, reliable contractors, wise elders, if you let them in. The trap is perfectionism masquerading as prudence: waiting for the “best time,” fussing over details that delay the decision that actually protects you. Put your faith in systems over spur-of-the-moment fixes; invest in infrastructure, not just pretty corners. What you organize will grow; what you clarify will hold.",
        "When you step from caretaker to coordinator, the house becomes both sanctuary and asset. Your order liberates time, your boundaries protect your warmth, and the ground you tend begins to return its weight in peace.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Run a quarterly home audit: maintenance list, insurance coverage, mortgage terms, and emergency fund. Book repairs on the spot, not “someday.”",
        "Use a 72-hour rule for renovations or big purchases. Get three quotes and set a not-to-exceed budget of a fixed percentage of your annual income.",
        "Create a home operations file (digital and paper): deeds, warranties, manuals, contractor contacts, inspection logs. Give access to one trusted person.",
        "If family property is involved, schedule a meeting with relatives and an estate lawyer within 90 days to confirm title, roles, and costs. Write and share minutes.",
        "Strengthen your street: introduce yourself to two neighbors, swap numbers, and start a simple tool-share or watch chat to build mutual support.",
        "Delegate anything that needs a ladder, electricity, or more than two hours. Your job is coordination; protect one no-fix day each week to actually live in your home.",
      ],
    },
    天机: {
      paragraphs: [
        "You live with a floor plan in your head and a compass in your pocket. You crave the feeling of “this space fits me” yet your mind keeps detecting better angles, smarter layouts, quieter streets. One week you’re measuring sunlight in the kitchen; the next you’re bookmarking zoning maps at midnight. You’re not fickle, you’re attuned. Home, land, parking, even storage nooks become puzzles to solve, ways to protect freedom without losing belonging. You want roots that can be repositioned, a nest that can rotate to follow opportunity.",
        "With Tian Ji in Da Tian for this decade, property becomes your thinking instrument. Gains come less from brute leverage and more from timing, information, and clever use: sub-letting, mixed-use corners, layout tweaks that lift rent or quality of life. Small, smart changes compound. The trap is scattered upgrades, endless “just one more” improvements, analysis spirals, or paperwork blind spots that turn fluidity into leakage. If you give your curiosity rails, budgets, checklists, decision windows, you convert motion into equity. If you don’t, the house becomes a beautiful distraction. Angle your restlessness toward design, data, and disciplined moves, the home will start paying you back in both peace and value.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set an annual capex limit and one major change per 12 months; wait 30 days before any renovation over $2,000.",
        "Run a due-diligence checklist before buying/selling/renting: sun, noise, plumbing, HOA/bylaws, permit history, rental rules, parking; speak to three neighbors.",
        "Create a home “lab zone” for experiments; all other ideas go to a quarterly review queue.",
        "Model cash flow: taxes, insurance, HOA, 1-2% maintenance, vacancy; proceed only if DSCR ≥ 1.2 and you hold six months of expenses in cash.",
        "Build an information edge: subscribe to planning notices, school boundary updates, and permit feeds; attend one landlord/DIY meetup each month.",
        "Hold a 30-minute monthly “space meeting” with co-dwellers to align needs, budgets, timelines; document decisions and next steps.",
      ],
    },
    文昌: {
      paragraphs: [
        "You crave a home that thinks the way you do: clear lines, good light, a desk that invites sentences to land. You save floor plans like poems, compare neighborhoods by libraries and noise maps, and notice how a room changes with the hour. You can spend weeks arranging shelves so your mind feels orderly, then hesitate at the contract because one clause feels vague. Part of you longs for quiet study and tidy corners; another part wants a space that breathes with warmth, plants, and people. You are building not just a house, but a mental habitat where focus and tenderness can coexist.",
        "This decade asks you to edit your life through your walls. Wen Chang  sharpens your eye for structure, paperwork, and the precise words that secure deeds, leases, and boundaries. Done well, research and clear agreements lift your property luck: the right agent, the helpful neighbor, the work-from-home setup that actually works. The traps are subtle: perfection delaying decisions, over-spending on clever organizers, letting experts’ opinions drown your own priorities, retreating so deeply into your haven that connection thins. Choose your non-negotiables, commit to timelines, and translate feelings into clauses. When you name what home must do for your mind, doors open and keys appear.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write your top three home non-negotiables and filter every listing and decision through them.",
        "Visit candidate homes three times (morning, afternoon, night) to test light, noise, and flow.",
        "Set a renovation or setup budget with 10% contingency and freeze design choices at week four.",
        "Create a home handbook, deeds, warranties, photos of serial numbers, emergency contacts, and review quarterly.",
        "Run a weekly 45-minute reset: clear desk, file papers, 1-in-1-out for books and decor.",
        "Before signing any contract, read it aloud, sleep on it 24 hours, then get a professional review.",
      ],
    },
    右弼: {
      paragraphs: [
        "You want a home that feels like a gentle harbor: lights just right, cupboards organized, everyone fed and calm. With Zuo Fu energy, you instinctively smooth edges, mediating disputes with landlords, pacifying relatives about inheritance, fixing small things before anyone notices. You carry spare keys and other people’s worries, walking the rooms at night to make sure everything settles. Yet there’s a tug: you long to claim your space and grow its value, but you keep making room for others, another compromise on the lease, another delay on the sale, another “temporary” guest. You scroll listings at midnight, second-guessing the one that felt right, telling yourself you’ll decide after the next bill, the next holiday. You’re the quiet steward of the house, but your needs get parked in the hallway.",
        "This decade turns up helpful hands and open doors around property, land, and the feeling of belonging. Neighbors introduce the right contractor; an elder offers sensible terms; a broker actually listens. Deals get better the moment you ask in plain words. Your goodwill is capital here, households harmonize under your care, and assets appreciate when you create trust. If family property is involved, your diplomacy can untangle knots, but only when you refuse emotional IOUs and convert favors into clear splits, timelines, and signatures. Because goodwill without structure leaks: small repairs balloon, shared bills blur, and boundaries soften until your sanctuary feels rented by everyone else. Paperwork, timelines, and titles are your allies.",
        "Choose to be the owner of your space, legally, financially, and energetically, or the house will choose for you. Delay turns roots into ropes; clarity turns them into anchors.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page Home Charter (purpose of the space, budget caps, guest rules, quiet hours) and get every co-resident/owner to read and sign it.",
        "Put every property agreement in writing, titles, loans, co-ownership splits, family contributions. After verbal talks, send a recap email the same day.",
        "Before any repair over $500, get two quotes and enforce a 24-hour cooling period before approving.",
        "Set a 90-day decision window for buy/sell/renovate choices. If undecided on day 91, default to the option that reduces complexity and recurring costs.",
        "Meet a mortgage broker and a property lawyer within 30 days to map financing, taxes, and exit scenarios; ask three “what if” questions for each plan.",
        "Join your building committee or neighborhood association for 6 months to build goodwill and local intel that saves money and time later.",
      ],
    },
    文曲: {
      paragraphs: [
        "You’re the kind of person who can feel when a room is holding its breath. Lamps, books, a bowl of water by the window, you arrange them like sentences, listening for the line that finally lands. Home is not a backdrop for you; it’s a living conversation, a diary written in fabrics and light. You crave a sanctuary that tunes your mind and softens your edges, yet the same sensitivity keeps you restless, moving the couch at midnight, scrolling listings, wondering if a different street would let you think and love more clearly. You attach to places the way others attach to people, then second-guess the attachment when the mood shifts. It’s tender, it’s beautiful, and it can exhaust you when the space never quite sings back the way you heard it in your head.",
        "With Wen Qu  walking into Da Tian for this decade, the house becomes your instrument and stage. Doors open through words, music, teaching, consulting, hosting small gatherings, work that can live from your living room. But charm can blur edges: lovely photos hide damp walls, friendly landlords forget promises, roommates drift past boundaries, and expenses seep like a slow leak. Nostalgia makes you keep objects, while ambiguity makes you agree to terms you never really meant. This is a cycle rich in inspiration if you anchor it, and slippery if you don’t. Beauty is not the same as clarity. Treat the home as a contract with your future self: if you name it honestly and protect it firmly, it will hold you. If you don’t, it will keep singing you away from your own plans.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a three-line home purpose statement (feel, support, protect) and post it visibly.",
        "Before signing any lease or loan, read it aloud, mark vague phrases, get a second reader.",
        "Visit any prospective home three times, weekday night, weekend noon, after rain; test drains and water pressure.",
        "If cohabiting, draft a one-page agreement on chores, quiet hours, guests, shared costs, and exits.",
        "Say what you actually want in plain words to family/housemates; no hints or guilt bargains.",
        "When tempted to move from mood, wait 30 days while improving one room you already have.",
      ],
    },
  },
  大福: {
    紫微: {
      paragraphs: [
        "You carry a quiet crown. People lean toward your steadiness, and you rarely let the mask slip. Inside, there’s a tug: the wish to be generous, noble, above the noise, and the ache to be held without having to earn it. You curate peace with high standards: fewer voices, better rooms, conversations that go deeper than small talk. Yet the more you hold space for everyone, the more you wonder who is holding space for you.",
        "This decade asks you to rule from within. With Zi Wei in 大福, your happiness becomes your realm, not your performance. The soul wants dignified ease, rituals that refill you, friendships that meet you, work that serves a legacy you actually care about. If you don’t choose your pleasures and boundaries on purpose, you’ll drift into polished exhaustion: respected by many, nourished by little. The temptation is to over-give, to delay joy until the next milestone, to mistake admiration for intimacy.",
        "Let your standards serve your serenity, not your image. When you choose fewer, truer commitments, your presence deepens and blessings gather. Claim sovereign ease; ask directly; delegate without guilt. Treat happiness as daily governance, not a prize you must win. If you heed this, leadership becomes warmth instead of weight. If you resist, the crown grows heavier, and the throne gets lonelier.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Block two “off-duty” windows weekly; no caretaking or planning, only simple joy.",
        "State needs plainly: “I want X,” “I need Y by Friday,” “Please handle Z.”",
        "Delegate one recurring task each week for eight weeks, and do not take it back.",
        "Host a monthly “inner court” with 3-5 allies; share real needs and accept help.",
        "Set an “enough line” for money, status, and commitments; stop adding once it’s met.",
        "Wait 72 hours before rescuing or funding someone; check if it nourishes you or feeds image.",
      ],
    },
    破军: {
      paragraphs: [
        "On the surface you can laugh, deliver, keep the room running. Inside, a tectonic plate is shifting. You feel the sudden urge to walk out of rooms you built, to empty drawers, to say, 'I am done,' and mean it. Relief floods you after deleting, then guilt taps your shoulder. You are torn between loyalty and oxygen, between being reliable and being alive. The nights are the loudest: what once soothed you now scratches. Your hidden truth: you want to live without pretending, even if it means breaking what no longer fits.",
        "This decade asks for soul renovation, not polite adjustments. In the palace of deep fortune, joy will not come from cushioning discomfort; it comes from smashing tired patterns and rebuilding cleaner lines. Old comforts may start to feel like cages; old beliefs, like clothes two sizes too small. Expect waves: detachment, then emptiness, then a lean clarity. The danger is scorched-earth freedom that burns good bridges too. The medicine is surgical: precise endings, honest closure, and disciplined routines that hold you steady while your meaning rearranges.",
        "If you wield your blade with kindness, you become someone you can trust. You do not abandon your life; you choose it. Endings clear air; simple daily anchors grow a quiet, muscular peace. Refuse the work and you will chase newness and wake hollow. Accept it and you will wake lighter, grounded, unmistakably you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "End three things this quarter - one habit, one relationship pattern, one belief. Set a date, tell someone, mark a small closure ritual.",
        "Use a 24-hour cool-off before resignations, breakups, or public posts. Write your reasons, sleep, decide in the morning.",
        "Keep a Vital Few of 5: sleep, movement, deep work, connection, nature. Track 5 days per week for 90 days.",
        "When emptiness hits, run the 3M protocol: move 10 minutes, make a protein-heavy meal, meet or message a human for 10 minutes.",
        "Create a two-person truth circle. Before drastic cuts, present your case; they ask: what pain am I avoiding, what value am I protecting, what repair is possible.",
      ],
    },
    天府: {
      paragraphs: [
        "You’ve always been the calm pantry in a stormy house, the one with extra chairs, extra time, and extra steadiness. People breathe easier around you, and you secretly like being the keeper of comfort. Yet inside there’s a tug: the wish to be held as deeply as you hold others, the urge to savor life more fully without feeling guilty. You weigh beauty against prudence, generosity against self-protection. You crave simple joys, good meals, warm rooms, loyal company, while guarding them like a quiet vault. Others think you’re endlessly resourced; you know the cost of being the rock.",
        "This decade invites you to turn comfort into craft. Not indulgence, stewardship. Build systems that keep your peace stocked, not just your shelves. Curate people who reciprocate care. Spend on what truly nourishes and say no to what only pads insecurity. Your patience, taste, and practical wisdom can compound into a serene kind of wealth: time that isn’t rushed, spaces that soothe, relationships that don’t leak. Beware the velvet trap of over-cushioning, too much protection becomes isolation, and caretaking without boundaries becomes quiet resentment. When you treat your life as a well-run sanctuary, luck finds the door and keeps returning.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Audit your weekly commitments; cut one draining obligation and replace it with true rest.",
        "Create a “future ease fund”: auto-transfer a fixed amount for savings, training, or tools.",
        "Practice one clean boundary per week: a plain no, with a brief alternative if you want.",
        "Schedule a weekly Order Hour to clear bills, clutter, and inbox so peace is maintained, not chased.",
        "Host intentionally: set a start/end time, make it potluck, and leave cleanup shared, not yours alone.",
        "Before rescuing someone, pause 24 hours; ask if help is needed, requested, and sustainable for you.",
      ],
    },
    太阴: {
      paragraphs: [
        "You look calm on the surface, but inside the water never stops moving. You sense everyone’s temperature the moment you walk in; you give quietly, remember everything, and then lie awake replaying the scenes you couldn’t fix. You want a softer life, beauty, privacy, a home that holds you, yet you judge yourself for needing it. You crave retreat but hate feeling left out, save diligently then spend at night on small comforts, speak in hints yet wish someone would read you perfectly.",
        "This decade puts the Moon in your House of Happiness: your inner weather becomes the fate-maker. When you rest well and name your needs, luck feels effortless; when you soak in unspoken feelings, time slides away. Your intuition sharpens, creative tenderness ripens, and behind-the-scenes work or income can grow, care, design, writing, property, remote roles. But the same currents can turn into riptides: late-night spirals, quiet resentments, emotional eating or spending, becoming everyone’s harbor while never docking yourself. The medicine is rhythm, naming, and boundaries, the gentle discipline that lets water be powerful without flooding.",
        "Hear this as a loving warning: if you keep hinting, hoarding feelings, and soothing others first, the joy you’re owed will thin into obligation. Don’t let the tide decide your decade. Choose light, choose ritual, choose plain words now, before the moon pulls you further from your own shore.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you actually want in plain words; remove hints and softenings.",
        "No decisions or purchases after 9 p.m.; put them on a “Moon list” to review at noon.",
        "Set a weekly home reset: 30-minute tidy, 20-minute plan, lights dim, one playlist you repeat.",
        "Before agreeing to help, ask: “Do I have the energy?” If yes, say, “I can do X by Y,” not everything.",
        "Create one behind-the-scenes income block: three 90-minute focused sessions weekly, then hard stop for sleep.",
        "Cap comfort spending with a monthly sanctuary budget; anything extra waits 24 hours and a morning review.",
      ],
    },
    廉贞: {
      paragraphs: [
        "This decade, joy is a crucible. With Lian Zhen in 大福, your inner room runs hot. You hunger for vivid living, truer love, sharper art, causes with teeth. Outwardly composed, you scan every scene for intensity. You swing between clean discipline and private rebellion: one day you set exacting codes; the next you test the lock. You’re not reckless, you’re hunting honest desire, the kind you can defend in daylight. You’ll overhaul tastes and rituals, swap circles, and feel drawn to taboo topics, politics, power-play. Mood tides rise fast; ritual turns them from chaos into fuel. When bored, you’re tempted to kick the table just to feel.",
        "The gift is redesign: a decade to rebuild your inner temple and turn charisma into craftsmanship and service. The risk is secrecy. Left covert, desire breeds triangles, doom-scroll dopamine, and late-night bargains with your boundaries, jealousy, control, reputational heat. Choose oaths early and shape your environment so keeping them is easy. Name the pleasures you’ll pursue openly, and the ones you won’t touch, even alone. Otherwise the shine that lifts you becomes a cage. Take it seriously; get counsel before the stakes climb.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a Desire Contract: 3 green-light pleasures weekly, 5 red-light triggers with time/budget/location rules. Post it where you decide.",
        "Time-box intensity: two 90-minute deep-work blocks and one daylight sweat daily; park your phone in another room.",
        "Use the 24-hour rule before cuts or confessions; then send one clear message, settle money/items, and close channels the same day.",
        "Swap secret thrills for public stakes: join a performance, competition, or advocacy track with weekly deliverables and a visible scoreboard.",
        "Build a night firewall: mute ex/flirt threads after 9 p.m., delete doom/delivery apps, cap at one drink, and end with bath plus paper book.",
      ],
    },
    巨门: {
      paragraphs: [
        "Your hidden truth: you hear what others don’t say. The room’s subtext hooks you, and your mind starts stitching patterns at 2 a.m. You crave peace yet poke at it with questions, needing the whole truth before you can rest. Words are your shield and your blade, when you’re hurt, the tongue gets sharp; when you care, you analyze to keep loved ones safe. You find comfort in late-night kitchens, quiet corners, long reads, and conversations that go three layers deeper than small talk. Yet the same gift can turn on you, rumination swells, suspicion grows, and a stray comment can live in your head rent-free.",
        "This decade places your baseline happiness in the realm of voice, boundaries, and mental hygiene. With Ju Men in 大福, fortune comes when your speech is clean and your inputs are curated. You’ll meet opportunities through teaching, negotiating, coaching, food, or content, places where words and appetite meet craft. But if your voice muddies, gossip, vague hints, indirect jabs, storms brew: insomnia, strained ties, needless disputes. Your task is to distinguish intuition from anxiety, to ask instead of assume, to rest the mind so it stops making ghosts. Build silence as a habit, precision as a style, and hospitality as your vibe. This is a decade to turn rumor into wisdom and late-night thoughts into a clear voice that feeds you, spiritually and, quite possibly, materially.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Use the clean ask: “Would you be willing to X by Y?” Say what you want in one sentence, no hints.",
        "Set a 9 p.m. cutoff for screens and news. Put your phone outside the bedroom and keep a notepad to park worries until morning.",
        "Block a weekly 90-minute silence window, no conversations, no media. Walk, cook, or sit; let your mind settle before you decide anything important.",
        "Before confronting someone, write two columns: Facts vs. Stories. Send only facts plus a clear request. Sleep on it for 24 hours if heated.",
        "Turn your voice into a craft: teach a mini-class, host a Q&A, start a modest podcast, or run a tasting/workshop. Commit to one public offering each quarter.",
        "Exit gossip loops fast. If a comment triggers you, ask within 24 hours: “When you said X, did you mean Y?” Clarify before you catastrophize.",
      ],
    },
    贪狼: {
      paragraphs: [
        "You move through this decade like a magnet in a marketplace: eyes on you, aromas everywhere. Tan Lang in Da Fu stirs your appetite for life, new scenes, faces, flavors, and the soft promise of ‘more.’ You crave the spark of the chase and the comfort of being adored, yet long for a calm center that doesn’t evaporate after the party. Nights run late, connections come easy, and the next thrill is always within reach. But between songs and smiles, a quiet question rises: which pleasures actually feed me, and which just distract me from the deeper hunger?",
        "This energy can be gold when you choose depth over drift. 贪狼’s charm becomes presence; curiosity becomes craft. You can turn desire into art, hospitality, negotiation, and social leadership, curating rooms, weaving people, creating experiences that leave everyone brighter. Intimacy grows when you tell the truth about what you want. The shadow, though, is sticky: triangles and secret chats, spending to impress, and addictive loops, scrolls, drinks, beds, that steal your mornings and blur your sense of self. If you float from high to high, this decade risks leaving you socially rich but spiritually underfed.",
        "Invitations will not stop; your power lies in deliberate desire. Ritualize joy so pleasure is chosen, not escaped. Protect your mornings, regulate your nervous system, and let beauty coexist with discipline. Keep curiosity, but keep a keel. Choose the pleasures that make you clearer the next day. Ignore this, and charm curdles into drama you didn’t mean to create.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Make a weekly “Desire List.” Pick three that truly matter; schedule them; decline the rest.",
        "Set a dopamine budget: two nights out/week, one drink per hour, phone off after 11.",
        "Commit to a 90-day mastery project (dance, language, sales, DJ set). Practice 30 minutes daily; post progress weekly.",
        "Before intimacy or deals, ask: what do I want, what do they want, what will this cost? Sleep on it 24 hours.",
        "Create a “play” fund: allocate 10-15% for fun; never borrow for pleasure; cancel any unused subscription after two months.",
        "Guard your nervous system: morning sunlight walk, 4-7-8 breathing before bed, one weekly digital sabbath; no gossip, speak directly.",
      ],
    },
    天同: {
      paragraphs: [
        "You want life soft, safe, unhurried. People come to you to exhale; your presence smooths sharp edges. Yet the price of harmony can be your own appetite. You say “I’m easy” when you know what you’d prefer. You cushion others, postpone yourself, and later wonder why you feel invisible. With Tian Tong lighting your Fortune palace this decade, the universe hands you permission to rest, recover, and savor again, more laughter at the table, more art, baths, lingering conversations. This is a cycle of comfort-as-healing, of forgiving old bruises, of letting your body lead the way back to peace. Your softness is not a flaw; it’s a skill. But it needs shape.",
        "Left on autopilot, that same softness slides into drift: people-pleasing, sugar and scrolls instead of choices, promises delayed until opportunities fade. Resentment grows quietly where you bite your tongue. Choose conscious comfort instead. When you set gentle boundaries and speak plainly, your gifts bloom, home becomes a sanctuary, work becomes humane and steady, relationships feel warm and honest rather than polite and tense. This decade can be a long exhale that also moves you forward. The door to joy is open, but you must walk through it on purpose, ask for what you want, design it into your days, and protect it.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "When someone says “Anything is fine?”, give one clear preference within 10 seconds (place, time, budget).",
        "Use a clean-no script twice a week: “Thanks for thinking of me. I’m not available for this.”",
        "Set a monthly comfort budget; automate 10% savings first; remove saved cards from shopping apps.",
        "Pick three 90-day outcomes; block three 90-minute focus sessions weekly; finish one meaningful task before noon.",
        "Swap numbing for soothing: at the urge to scroll or snack, take a 12-minute walk; set a 15-minute timer before deciding.",
        "Address resentment within 48 hours: “When X happened, I felt Y. Next time, can we try Z?”",
      ],
    },
    天相: {
      paragraphs: [
        "You’ve long been the calm in other people’s weather. You sense the room, soften sharp edges, and arrange the little details so harmony has a place to land. People trust you because you’re fair, composed, elegant in heart and habit. But the cost is quiet: you edit your wants, you mediate one more dispute, you host one more gathering because it “should” be done nicely. You crave a life that feels curated, not performed; companionship that’s loyal, not needy. Yet you hesitate to ask plainly, worried the balance will tip or someone will feel dismissed. You keep the peace, but sometimes you keep yourself at the door.",
        "This decade asks you to steward your inner court with authority. Tian Xiang here wants standards, not stress: fewer, deeper bonds; clearer rules for access to your time; beauty used as nourishment, not as armor. Your composure is a currency, spend it where it compounds. Create rituals that refill you and structures that make generosity sustainable. Choose the causes, clients, and companions worthy of your refinement, and let the rest exit gracefully. When you name what you want without embroidery, you’ll find people relieved to meet you there. The result isn’t coldness; it’s clarity that makes warmth safe.",
        "Watch the old habits: diplomacy that slides into people-pleasing, overthinking that delays the right no, resentment that hides behind a polished smile. Social spending can become a leak; sleeplessness arrives when unspoken boundaries pile up. The remedy is not louder effort, but cleaner lines and kinder truth. Give yourself the dignity of choice. Your life becomes tranquil not by chance, but by design, and when you design it, the right support and serendipity arrive on schedule.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you actually want in one clear sentence; stop hinting or softening the ask.",
        "Set two weekly “support hours” for others’ needs; outside them, reply next day without apology.",
        "Before agreeing, say: “I’ll confirm by tomorrow.” Check time, money, and energy, then answer decisively.",
        "Curate your inner circle: choose five key people; book monthly one-on-one time and release lukewarm ties kindly.",
        "Create a nightly 30-minute decompression ritual (no screens): bath, stretch, journal; track mood each week.",
        "Use a grace budget: allocate a fixed monthly amount for quality experiences; delay prestige purchases 48 hours.",
      ],
    },
    武曲: {
      paragraphs: [
        "You've learned to keep the peace by keeping watch. Your inner room is tidy, counted, and locked, because when life grows loud, you steady yourself with numbers, plans, and proof. You prize competence, and you carry more than you say; affection comes as reliability, not flourish. Yet there is a tug: a craving for quiet ease and unguarded laughter, matched by a reflex to tighten, to check the ledger again, to make sure nothing leaks. You don't hoard joy, but you often delay it until it's deserved.",
        "With Wu Qu seated in Da Fu for this decade, the curriculum is stark and generous: build a sanctuary that protects you and also lets you breathe. Strengthen routines that truly soothe. Repair the inner vault by pruning false obligations, sealing financial drips, and choosing sturdy friendships. Let discipline become the hinge that opens pleasure, not the lock that denies it. Wealth here means rested nerves, clean boundaries, and resources that move toward what matters.",
        "The danger is armoring so well that warmth can't find you. If every exchange must balance, tenderness will feel like debt and you'll pay it with silence. Do the work, yes, but do not mistake numbness for peace. Open the door a finger-width, and let life in.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Define your 'enough' and write stop-rules: weekly hours, savings target, and a shutdown time.",
        "Set a recurring 'unstructured joy' block (90 minutes, weekly). Phone off, no metrics.",
        "Automate stability: paycheck-day transfers to savings/investments; cancel two unused subscriptions today.",
        "Use plain asks: one sentence, one need, one time frame. Practice with a trusted friend.",
        "Before you cut ties or budgets, apply a 24-hour hold and get one outside read.",
        "Schedule two low-stakes connections weekly (walk, coffee, voice note) to keep bonds warm.",
      ],
    },
    太阳: {
      paragraphs: [
        "Some part of you can’t help trying to be Tai Yang in every room. You spot the heaviness, bring warmth, crack a joke, make a plan, name what others won’t. When people dim, you lift them; when a path is foggy, you demand clarity. Yet the same light that feeds others can leave you hollow. You swing from blazing days, organizing, fixing, shining, to quiet nights wondering who shines for you. You want your energy to matter, not just be “nice.” You crave a stage that is also a sanctuary: visible enough to make impact, safe enough to rest.",
        "This decade places your Sun in the house of inner fortune; it asks you to source glow from within, then share it by choice, not compulsion. Your joy swells when you lead by purpose, not rescue. Boundaries become sacred technology: fewer, clearer commitments make your light steadier. Choosing the right audiences, people who reciprocate, teams that honor daylight and downtime, turns effort into ease. Rest stops being an apology and becomes fuel; receiving praise or help is no longer awkward but a way to keep the fire clean.",
        "Think of it as moving from a flickering lamp to noon sky. You are no longer hustling for brightness; you are defining the climate. When you honor your values, your presence organizes the room without you overreaching. This is an opening: align your light, and both happiness and results grow larger.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write your mission in one sentence and use it as a filter; if a request doesn’t serve it, say no or propose a smaller version.",
        "Set weekly “office hours” for helping others (e.g., Tue/Thu 5-6 pm). Outside that window, redirect or schedule later.",
        'Replace vague offers with specific ones: say, "I can do X by Friday" or "I can’t do that, but I can introduce you to Y."',
        "Create a visibility budget: cap yourself at two public commitments per week and pre-schedule one recovery block after each.",
        "Install a daily 30-minute solar ritual, walk outside without your phone, stretch by a window, or sit in quiet light, to reset your mood.",
        'Practice direct receiving once a week: ask for what you need in plain words ("I need acknowledgement on X" or "Can you take this task?").',
      ],
    },
    七杀: {
      paragraphs: [
        "You look calm on the surface, but inside there is a commander pacing the map room. Peace feels nice for a day, then it starts to itch. You stir the waters just to see what is true. You want clean lines, clear calls, results over stories. You test people, not to be cruel, but to know who will stand next to you when it matters. At night your mind sharpens, planning exits, upgrades, and quiet coups. You carry private vows: do not settle, do not slack, do not lie to yourself. And yet a part of you longs for ease, but when it arrives, you suspect it.",
        "In this decade, Qi Sha sits in 大福, the inner chamber of joy and meaning. Your happiness will not come from comfort; it will come from competence, precision, and earned self-respect. Life will ask you to cut what is noisy, to draw hard boundaries, to take decisive, sometimes solitary steps. Relationships recalibrate: you feel closest to those with spine, schedule, and truth. Restlessness becomes a compass pointing toward a worthy challenge. The risk: without a mission, your blade turns inward, picking fights, burning bridges, and mistaking speed for strength.",
        "Build an inner barracks: disciplined mornings, clean fuel, focused work, and real recovery. Choose one hard path to master and let lesser options die without ceremony. Speak plainly. Trade adrenaline spikes for deep practice. Train your body so your mind can unclench. Let silence be your authority. If you do not choose a worthy fight, petty battles will choose you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Run a 90-day cut-and-commit: pick one mission and cancel two low-value commitments today.",
        "Before quitting or cutting someone off, wait 24 hours and write one tactical alternative.",
        "Train skill-based strength 4x per week (boxing, climbing, kettlebells). Schedule sessions before 10 a.m.",
        "State asks in one sentence: 'I want X by Y because Z.' Remove hedging words from messages.",
        "Form a council of three (mentor, peer, truth-teller). Send a monthly one-page update with decisions and risks.",
        "Night shutdown (45 min): screens off, stretch, hot shower, one page After Action Review (win, fix, drop).",
      ],
    },
    天梁: {
      paragraphs: [
        "All your life you’ve been the quiet shelter others drift toward when the weather turns. You hear what people can’t yet say, hold their worry in your palms, and somehow become the steady table everyone leans on. Still, there’s a private ache: the weight feels holy and heavy at the same time. Part of you longs to close the door, sleep through the night, laugh without measuring the cost. Another part can’t ignore the tug of conscience, the elder inside who insists, If not me, who? You manage crises gracefully and then feel oddly alone afterward. You resent being needed, then feel guilty for wanting out. Underneath it all is a simple wish: to help without disappearing, to be trusted without being trapped.",
        "This decade with Tian LIang in Da Fu ripens that wish. Your blessing isn’t in carrying more; it’s in carrying right. Wisdom becomes lighter when you trade rescuing for mentoring, fixing for guiding. Boundaries stop being walls and start being architecture: they shape where people meet you, not whether they can. Choose causes with a clear end date; create containers for compassion so it doesn’t spill everywhere. As you do, the right allies, patrons, and sincere students find you, and quiet luck gathers around health, rest, and meaning. Beware the martyr-judge habit, when you tighten into righteousness, isolation and fatigue creep in through the shoulders, sleep, and stomach. Let solitude be a well, not a punishment. Lean into practices that renew you, and measure your worth by clarity, not by exhaustion. Say yes to being a shelter with windows and doors, light gets in, and you can step out.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set office hours for listening: two evenings weekly, max 45 minutes per person.",
        "Before helping, ask: What outcome do you want, and what have you already tried?",
        "Use a one-line no: I can’t take this on; here is one resource or next step.",
        "Schedule a weekly joy block (90 minutes) with no usefulness allowed; protect it.",
        "Create a help budget: support at most two people deeply at a time; track names.",
        "Do a Friday body check (shoulders, jaw, sleep, digestion); if tense, cut commitments by 20% next week.",
      ],
    },
    左辅: {
      paragraphs: [
        "You’re the quiet anchor who notices the missing chair before anyone sits down. In this decade, your happiness is tied to being the steady helper: smoothing conflicts, stitching people and plans together, keeping promises even when you’re tired. You love the feeling of being needed, yet you also long to be seen beyond your usefulness. You anticipate needs, offer rides, fix timelines, hold confidences; later, you lie awake wondering who holds you. Order calms you, lists, calendars, tidy cupboards, yet your heart gets cluttered with unspoken yeses. Part of you wants to stay backstage; another part wants a seat at the table with your name on it. That push-pull is the core of these years.",
        "This cycle brings allies and gentle power. Mentors appear, recommendations open doors, and rooms soften when you enter because people trust you. Your lesson is reciprocity. Shift from automatic yes to chosen yes. Let help move both directions. State your limits early; design small rituals that restore you so you don’t numb out later. Name your price, time, money, energy, before you give it. Keep your kindness, add structure, and your support becomes an architecture that lifts everyone, including you. Lean into convening and stewardship; step forward when your voice clarifies. If you ignore this, resentment will hollow your joy. If you practice discernment, you’ll feel spacious, cherished, and quietly brave.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a weekly helping budget: cap hours, and block two non-negotiable rest windows.",
        "Before saying yes, name the exchange: “I’ll do X if Y is done by Friday.”",
        "Build a three-person personal council; schedule quarterly 45-minute check-ins with agendas.",
        "Host one small gathering monthly to connect five people; next month, let someone host you.",
        "Replace hints with one-sentence asks; speak the need plainly, then pause and let it land.",
      ],
    },
    右弼: {
      paragraphs: [
        "You’ve long been the soft force that steadies the room: the one who notices who’s tired, who needs checking in, when a small kindness will keep the whole thing from cracking. You want a life that feels warm, unhurried, beautifully simple, yet you keep saying yes because you can sense what people need before they ask. Inside there’s a tug: the peacekeeper who smooths everything over, and the quiet soul who longs to be met, not managed. In this decade, the world is unusually ready to help you back. But help only finds you when you let yourself be seen, needs included.",
        "Think of all the times you arranged the ride, picked the cake, drafted the message no one else knew how to write. Your gift is relational intelligence, gentle, precise, disarming. The shadow is unspoken resentment, built from carrying what others could have carried themselves. This cycle invites an upgrade: turn care into clean agreements, generosity into rhythm, kindness into structure. Your voice doesn’t need to get louder; your boundaries need to get firmer. Then your natural grace stops leaking energy and starts compounding it.",
        "When you practice receiving, your luck multiplies through people, introductions, referrals, doors opening with a smile. A single honest ask could move a mountain that effort couldn’t budge. But if you keep rescuing, bitterness will grow quietly, and joy will feel like work. Choose mutuality. Curate your circle. Let support be a standard, not a surprise. These years can feel like an exhale, steady, golden, deeply human, if you allow others to lift you too.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you actually want in plain words; no hints, no martyrdom.",
        "Create a weekly help budget (e.g., 3 hours). When it’s spent, you say no.",
        "Use a 24-hour pause before accepting any new role, committee, or favor.",
        "Keep an energy ledger: note who/what nourishes or drains; reallocate time monthly.",
        "Ask for two introductions each month; offer two in return to keep goodwill circulating.",
        "Practice the gracious no: “I can’t this week. Next Tuesday 3-5 pm works.”",
      ],
    },
    天机: {
      paragraphs: [
        "You've always lived with a quick, whispering mind - the gears rarely stop. You read subtle cues, trace patterns others miss, and before a room finishes speaking you've already mapped three outcomes. Yet the same brilliance can turn on you: chasing one more angle, delaying the leap, lying awake negotiating with possibilities. You crave quiet but open another tab. You want companionship but disappear to think. Your notes are rich with ideas, while your body forgets to breathe. This is the push-pull: the gift of sight paired with the ache of never quite arriving. Underneath it all, you're hunting not for noise or novelty but for the right key - the question that unlocks a steadier kind of joy.",
        'This decade puts the strategist in the house of happiness. Your fulfillment won\'t come from "more," but from elegant systems, honest inquiry, and rituals that give your mind a rhythm. The risk is getting clever about everything except your own peace - endless optimizing, thin joy, exhaustion dressed as productivity. But aligned, Tian Ji becomes navigation: study that feeds your spirit, guidance offered to others, quieter confidence born from practice rather than perfection. Choose fewer, deeper threads; apprentice yourself to wisdom, not stimulation. When you give your thinking a home - set times, clear themes, real rest - the overanalysis turns into foresight and your heart finally has room to feel. Begin now, before your brilliant engine burns on every possibility; this is the decade to craft a life that thinks clearly and enjoys deeply.',
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Choose one theme per quarter; run a 30-day learning sprint: 25 minutes daily, weekly share-out.",
        "Apply the 72-hour test: if an idea excites you, build a tiny version within 3 days or drop it.",
        'Set "worry windows": two 20-minute slots. Outside them, capture thoughts on one list and return to living.',
        "Protect sleep: no caffeine after 2 p.m.; screens off one hour before bed; 10 slow breaths under the covers.",
        "Before big choices, convene your council - one mentor, one peer, one skeptic; 30-minute calls; decide within 48 hours.",
      ],
    },
    文曲: {
      paragraphs: [
        "You carry a refined ear for feelings and phrasing. You read rooms through tone, silence, the curl of a sentence. You want what is true and beautiful, yet you often polish the truth until it feels safe, then resent that no one really sees you. On bright days your words open hearts and doors; on tender days praise seduces you off course, or a stray comment haunts you for hours. You crave intimate, intelligent company, but hide behind charm, hinting and curating, hoping someone will decode you. And when the world feels too loud, you retreat into music, stories, or shopping for “the right” piece, small luxuries to soothe a vast ache.",
        "This decade, with Wen Qu in Da Fu, your joy, protection, and income of spirit come from honest expression, cultured craft, and conversations that lift the room. Beauty becomes medicine when you make it, not just consume it. The risks: drifting on moods, delaying hard choices, letting triangles and gossip tangle you, and leaking money through aesthetic impulse. The invitation: treat each day like a studio; turn feelings into form, affection into clear agreements, attention into blessing. If you claim your voice and curate what you let in, this can be the decade your inner elegance becomes a steady, generous light.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Block a daily 45-minute “art hour”; phone outside the room, timer on.",
        "Publish one imperfect piece each month; ask one friend for blunt feedback.",
        "Speak plainly: “I want X by Y because Z.” No hints, no tests.",
        "Set collaboration terms in writing: scope, dates, money, credit, exit conditions.",
        "Institute a 48-hour rule on nonessential purchases; log each in a single sheet.",
        "If talk drifts to gossip, redirect to goals or excuse yourself within one minute.",
      ],
    },
    文昌: {
      paragraphs: [
        "You know happiness lives in the texture of your thoughts and the music of your words. You edit feelings into sentences, you soothe others with good counsel, and yet your own heart stays a half-step behind, waiting for you to turn toward it. Some nights your mind becomes a library after closing, neat aisles glowing, while a restless caretaker paces with a key that won’t quite fit. You long to be understood without overdressing the truth. You crave quiet, but fill the silence with research, notes, clever messages that circle what you really mean.",
        "This decade hands you a pen and a table where connection is the curriculum. Wen Chang  in the realm of 福 asks you to let language become medicine, not makeup; to build inner peace by shaping the conversations you keep, the books you share, the small rituals that calm your chest. You will be sought as a translator of feelings, a gentle organizer of circles, a maker of meaning. Blessings gather when you speak plainly, study steadily, and let insight travel from page to body. Beware the trap of commentary replacing contact, of gossip disguised as warmth, of perfection that delays joy. Choose candor over cleverness; when your mind finds a home in honest expression, your heart will finally rest.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Schedule a daily 20-minute mind and heart check: write three feelings, one body sensation, and one simple need.",
        "Say what you actually want in plain words; replace a polished paragraph with one clear sentence and send it.",
        "Block two 90-minute deep-reading sessions weekly; phone in another room; take handwritten notes; share one takeaway with a friend.",
        "Form a small circle of 3-5 people for monthly conversation; pick one theme; everyone speaks five minutes without interruption.",
        "Before saying yes, ask yourself: Is this nourishing or draining? Keep a weekly energy ledger and drop one draining obligation each month.",
        "Turn insights into motion within 48 hours: after any idea or discussion, take one visible step and ship work at 80 percent done.",
      ],
    },
  },
  大父: {
    紫微: {
      paragraphs: [
        "You’ve been the steady one in rooms with elders: reading the temperature, smoothing edges, carrying the family standard. You want their respect like oxygen, yet bristle at the subtle tug of duty. You perform competence because you can, then quietly resent that it’s expected. Underneath is a softer fear: if you stop earning approval, will the doors stay open? The weight of the surname, the title, the role, both badge and chain, sits right on your sternum.",
        "With Zi Wei activating the Da Fu realm this decade, authority becomes your classroom. Parents, mentors, and gatekeepers are less obstacles and more mirrors. Protocol, timing, and tone determine which keys you receive. You’re being trained in statesmanship: how to ask without groveling, disagree without contempt, and accept guidance without surrendering self. Practical matters, agreements, endorsements, inheritances, institutional rules, will surface, inviting you to prove you can steward not just your talent, but a legacy.",
        "Your power ripens when dignity meets humility. If you honor the chain of wisdom while holding your line, the elder world adopts you as its own. This is not appeasement; it’s strategic alignment. Become the bridge that makes progress possible. When you speak plainly, keep records, and lead with service, rooms of seniority open quietly and completely. Wear the crown lightly, not timidly, claim it by honoring the ones who taught you how.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Schedule a quarterly elders/mentors council: 60 minutes. Listen first 15, ask for explicit expectations, and confirm decisions in writing within 24 hours.",
        "Use the clear ask rule: say what you need in one sentence (“I’m asking for X by Y because Z”). No hints, no hedging.",
        "In any conflict with an older authority, wait 24 hours. Draft two replies, ego and service. Send the service one, with one sentence of respect.",
        "Learn the rules you’ll be judged by: policies, wills, contracts, family agreements. Create a one-page summary and share it to prevent misunderstandings.",
        "Build a legacy project: interview an elder, digitize photos and documents, and present the story. Make continuity your value proposition, not just innovation.",
      ],
    },
    破军: {
      paragraphs: [
        "You love your people, yet their rules feel like a tight collar. You’ve been the reliable one, the fixer who arrives when the call comes, but inside you’ve longed to smash the script that keeps you small. Po Jun in Da Fu brings a decade of dismantling the old house of authority: the tone that makes you twelve again, the unspoken debts, the duty that erases your name. Expect flashpoints around care, inheritance, and who decides what is “right.” Your anger is not a flaw here; it’s a crowbar. Still, turning elders into villains would be too easy. This is about tearing out rotten beams while preserving the beams that still hold. You’re not burning your lineage; you’re rebuilding the doorway so you can walk through it as yourself.",
        "Day to day, it looks like saying fewer clever hints and more plain words. It looks like choosing one boundary and holding it, even if the room goes quiet. It looks like planning before the crisis, documenting before the argument, and letting silence land where persuasion used to live. Respect does not mean obedience, and love does not require self-abandonment. Honor the stories worth keeping; close the doors that cut your breath short. If you avoid this work, the conflict won’t disappear, it will harden into a cold war that drains the next ten years. Papers will need signatures, health will turn suddenly, and delay will feed chaos. Move now, with steadiness, or the storm will choose for you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Script one clear boundary and practice it: “I won’t discuss X. If it continues, I’ll end the call.” Use it consistently for 90 days.",
        "Create a 12-month eldercare plan: contacts, medications, budget, who does what, and an emergency protocol. Share it in writing with all stakeholders.",
        "Use the 24-hour rule for criticism. Do not react same-day. Reply later with one sentence stating your request or limit.",
        "For money/property issues, hire a neutral mediator or attorney. List assets, debts, and expectations. Put every agreement in writing before action.",
        "Start a legacy project: record three hours of family stories. Ask five core questions. Keep one tradition intentionally; retire one that harms.",
        "If contact is unsafe or draining, switch to low-contact: email only, scheduled check-ins, third-party locations. Document incidents and inform allies.",
      ],
    },
    天府: {
      paragraphs: [
        "You’ve long been the one who quietly takes the keys, locks the doors, and keeps the light on. In this decade, Tian Fu sits in the Da Fu palace: you become the vault and the head of the table, even if no one crowns you. Elders look to you for calm arithmetic, paperwork, hospital forms, property calls, family politics. You crave harmony and want everyone fed and safe, yet you feel the weight settling into your shoulders. Part of you longs for soft comfort; another part knows you were built to steward the legacy rather than be swallowed by it.",
        "This is a season of consolidation and quiet power, and its trap is obligation disguised as love. Because you’re reliable, people will ask you to bankroll, to mediate, to ‘just handle it.’ You can amass trust, assets, and influence if you set terms; or drown in errands and unspoken resentment if you don’t. The work is to govern with a ledger, not with guilt: clear boundaries, simple systems, and soft but immovable decisions. Do this and the family line steadies around you; avoid it and your kindness becomes the hole in the bucket.",
        "Set your rules early, or the decade will set them for you. Choose stewardship, not servitude.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page list of what you will and won’t handle for family; share it by month’s end.",
        "Create a complete elder inventory: accounts, policies, contacts, medications, and wishes; schedule two 90-minute sessions to document it.",
        "Set a hard cap for family financial help and a 48-hour cooling-off before any loan; require a written plan and payback terms.",
        "Run family meetings like projects: agenda, timebox, decision owner, and actions with deadlines in a shared note.",
        "Form an elder advisory circle: pick two mentors, book quarterly calls, and ask for one concrete introduction each quarter.",
        "Protect your time and body: block two no-go hours daily for rest; take one weekly respite; reply to surprise requests with, “I’ll decide tomorrow.”",
      ],
    },
    廉贞: {
      paragraphs: [
        "You want order and respect, and you also want freedom to act. Around elders and authority, you become both the enforcer and the rebel, the one who can lay down rules, and the one who questions why those rules exist at all. In this decade, the stage is the Da Fu: fathers, grandfathers, bosses, the weight of tradition and the machinery of institutions. Lian Zhen sharpens your sight and your standards; you spot the weak joins in a family system, the unspoken debts in a workplace, the hypocrisy in a promise. You may find yourself restructuring duties, pushing for clarity in inheritances or policies, becoming the person who says, “We either do this right, or we don’t do it.” Underneath, the ache is simple: you long for a clear nod of respect, without having to beg for it.",
        "This is the season to write your own law and deliver it with calm authority. Lead with principle instead of grievance and elders can become allies; lead with punishment and doors will harden shut. Expect tests: boundary breaches, moral gray zones, last-minute demands disguised as loyalty. Your edge is clean strategy, not drama, steady conversations, written agreements, measured consequences. Choose the reformer’s oath: protect what’s worthy, change what’s brittle, refuse what’s corrupt. Do that, and the lineage may grumble but it will respect you. Ignore it, and the decade risks freezing into cold wars and polite silence, technically right, emotionally homeless.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page “How to work with me” (principles, boundaries, response times, decision rights) and share it with key elders or bosses.",
        "Turn complaints into requests: state exactly what you need, by when, and what happens if it doesn’t happen.",
        "Before any high-stakes conversation, define three desired outcomes and two non-negotiables; bring notes and stick to them.",
        "If emotions spike (jaw tight, heat in chest), pause and reschedule within 24-48 hours instead of pushing through.",
        "Audit inherited obligations: choose three to keep, two to renegotiate, and one to exit within the next 90 days, put dates on the calendar.",
        "Create an external council of elders: recruit two mentors outside the family line and book quarterly check-ins for perspective and accountability.",
      ],
    },
    太阴: {
      paragraphs: [
        "You carry moonlight into the halls of the elders. In the Grandfather sphere, you’re the quiet link to older men, grandfather, father-figures, senior bosses, the one who remembers dates, smooths tempers, tracks the bills, and keeps the family story intact. You want to be dutiful and kind, yet you feel the ache of being the dependable one while no one asks how you’re really doing. You soothe by habit, but your heart wants clean lines and honest words.",
        "This decade ripens your role from helper to steward. Papers, property, traditions, and decisions drift toward you, especially when others stall or bicker. The Tai Yin rhythm gives night clarity, plans flow when the world is quiet, but daylight can pull you into people-pleasing and silence. You’ll face the tug between keeping peace and naming terms, between rescuing and requiring adults to act like adults. Inheritance, authority, or care duties may shift suddenly; your gift is to become the calm strategist rather than the invisible caretaker.",
        "The moon does not shout; it illuminates. Let your softness have edges. Put light on the paperwork, speak exact needs, and build structures that outlast moods. If you keep swallowing words, resentment and quiet financial leaks will follow. Step into the adult seat: organize, delegate, and decide on timelines. Done this way, the family grows safer, and you finally feel lighter, not lonelier.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Schedule a one-day “legacy audit”: gather IDs, wills, deeds, medical directives, and account lists; scan to a shared folder with clear file names and access for all stakeholders.",
        "When an elder asks for help, reply with three options and a boundary: “I can do X Friday, Y next week, or we hire Z. Choose one.”",
        "Create a care rota with siblings/cousins: assign tasks, funds, and backups; put it on a shared calendar and review on the first Sunday each month.",
        "Before giving financial support, apply a 24-hour pause and write the numbers: exact amount, duration, and impact on your savings; agree only with a simple written plan.",
        "Record legacy monthly: one hour to capture stories by voice or video, label photos with dates/names, and store them in the same shared folder to reduce future disputes.",
        "Use “no triangulation”: address conflict directly with the person; if unresolved after two attempts, bring in a neutral mediator (social worker, eldercare counselor, or attorney).",
      ],
    },
    巨门: {
      paragraphs: [
        "You carry the family courtroom in your chest. With elders, mentors, and officials, your words can cut fog or stir storms. You notice the holes in explanations, the clause that’s missing, the promise that sounds soft. You crave their blessing yet choke on “that’s how it’s always been.” Late at night you rewrite texts so they’re precise, then worry you’re too sharp, or not sharp enough. This decade puts you at the table where stories become signatures: hospital forms, property talk, school decisions, work references. You are asked to translate emotion into agreements, whispers into timelines, and you feel both honored and cornered by the role.",
        "The tug is real: defend the truth, or keep the peace. Under 巨门, unspoken things fester; spoken carelessly, they cut. Expect tests around inheritance, titles, medical choices, or the family myth that never fit. Yet your gift is turning complaint into clarity, meeting minutes, written confirmations, clean boundaries. This cycle rewards plain words and exact paperwork; it punishes vague hints, sarcasm, and “we’ll see.” If you let resentment steer your mouth, you’ll win arguments and lose allies. If you leave documents loose, you’ll pay tuition to chaos. Take counsel early, put terms in ink, and aim your voice at outcomes, not victories.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you want in one sentence. One topic per message, and end with two clear options.",
        "For any family decision, write a one-page brief: issue, options, costs, deadlines. Circulate and get written yes/no.",
        "Scan IDs, wills, titles, and medical directives into a shared folder. Set quarterly calendar reminders to review.",
        "Before confrontations, wait 24 hours. Then use a 10-minute timer: facts, impact, request, no character analysis.",
        "Bring a neutral pro for property or health matters (lawyer, accountant, social worker). Don’t arbitrate alone.",
        "Create a personal help policy: what you’ll do, won’t do, and might do. Set time/money caps and stick to them.",
      ],
    },
    天同: {
      paragraphs: [
        "You’ve spent years being the gentle buffer, reading rooms, softening blows, keeping peace. With Tian Tong lighting up your Da Fu decade, that instinct turns toward elders, bosses, and the systems that raised you. You’re the good child in the meeting room: agreeable, accommodating, soothing tensions before they spark. It feels kind, and it often is. Yet under the warm kitchen light of duty, a quiet heaviness grows: whose approval are you still chasing? You crave comfort and closeness, but the cost is swallowing your own stance, postponing your needs, letting “it’s fine” replace your voice. You mediate for everyone and end the day unheld yourself; you carry family standards at work and workplace standards back home, until harmony starts to feel like a tight collar.",
        "This decade isn’t asking you to become hard; it’s asking you to become clear. Reparent yourself: be the kind elder who sets fair rules and keeps promises. Boundaries, written agreements, qualifications, these aren’t cold; they’re blankets that keep warmth from leaking out. Speak directly with parents and superiors, clean up paperwork, and formalize your skills so respect is not negotiated each time. Simplify loyalties: what you keep, you keep by choice. When you do, your softness turns powerful, people trust you because you tell the truth gently and you follow through. But hear the warning: if you keep nodding along, the decade will let others script your path with their deadlines, their fears, their comfort. Your care deserves structure, or it will be consumed by those who need you most and understand you least.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Say what you actually want in plain words, not hints; deliver one-sentence asks in meetings.",
        "Use a 24-hour pause before agreeing to favors or rescue roles; reply after you’ve slept on it.",
        "Put agreements in writing: send a recap email with decisions, dates, and owners within 24 hours.",
        "Schedule a monthly check-in with a parent or mentor: bring an agenda, updates, one request, one boundary.",
        "Earn one credential that matches your next step; pick the exam or course and book the date this week.",
        "Run a No-Rescue Week each month: let others hold their consequences; offer guidance, not fixes.",
      ],
    },
    贪狼: {
      paragraphs: [
        "With Tan Lang lighting up your Da Fu decade, your charm and deal-making land right where rules, lineage, and authority live. You crave to be seen by elders and gatekeepers, while an equally strong urge pushes you to edit the script and bend the curfew. You read rooms fast, smooth jagged moods with humor, and secure favors others can’t. Yet behind the polish sits a private tug-of-war: how much of you is performing for approval, and how much is your true stance? Masks swap depending on who’s across the table; you walk away praised, but not quite known.",
        "You’ll feel it in small moments. A parent’s 'tiny help' balloons. A senior hints at obligations no one said aloud. You agree in the moment to keep the peace, then simmer later. At work you braid consensus, but your boundaries quietly thin. This decade invites you to become the diplomat with a spine: warm, artful, and unmistakably clear. When you name the deal, set the edges, and keep receipts, relationships actually relax, because people finally know where you stand.",
        "Here’s the caution: if you keep buying harmony with charm and vague promises, trust will fray. Triangles, secrets, and side agreements will tangle until you feel owned by favors. Choose clarity over charisma now. Clean yeses and clean nos will protect love better than another clever workaround. Take the grown seat at the table, or the table will script your decade for you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Hold a 90-minute sit-down with each key elder/authority. Ask: expectations, red lines, disagreement process. Email a summary within 24 hours.",
        "End triangulation. When A complains about B, say: 'Please tell B directly; I won’t relay messages.' Then do not carry it.",
        "Write every favor like a mini contract: scope, hours, deadline, and an exit clause. No document, no commitment.",
        "Use a 48-hour buffer for big asks. Reply: 'Let me confirm by [date].' Check calendar, energy, and motives before agreeing.",
        "Move negotiations from late-night/social settings to daylight, time-limited meetings. Less alcohol, more notes and follow-ups.",
        "Choose one mentor outside the family. Monthly check-ins for boundary coaching; practice direct requests and refusals.",
      ],
    },
    天相: {
      paragraphs: [
        "You’re the one who keeps the elders’ world from tilting. People trust your calm judgment, your way of reading the room, of smoothing frayed feelings before they split the family. Yet beneath that grace lives a private tug-of-war: the urge to be fair to everyone versus the ache to be free of always being “the responsible one.” You honor tradition, but you also want a say in how things are done. You want respect, not just reliance. This decade spotlights that tension, inviting you to lead with poise while refusing the quiet martyrdom that’s long felt inevitable.",
        "You know the rhythm: the late-night call for advice, the forms to file, the careful words that avert a blowup at dinner. You hold all the threads, and somehow the tapestry looks whole. But who holds you? Fear of seeming unfilial has made you swallow needs that now press at the edges of your patience. This cycle asks you to become the judge of your time, write the rules, don’t just enforce them. When you set clear protocols, everyone relaxes and respect deepens. When you delay, small problems ferment into crises. Step forward as steward, not servant. Build the order you wish existed, or exhaustion will build it for you.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Run a monthly 60-minute family council: agenda, roles, deadlines, and a recap email within 24 hours.",
        "Create a boundary script and use it verbatim: “I can do Tuesdays and Saturdays 10-1. For other times, we’ll hire help.”",
        "Build a document hub: IDs, wills, insurance, medication lists, contacts. One cloud folder + one physical binder; review quarterly.",
        "Pause 24 hours before accepting new tasks. Reply in writing with options, limits, and a clear timeline.",
        "If siblings push back, bring in a neutral third party (social worker/mediator) within two weeks, don’t let disputes linger.",
        "Set a care budget and split contributions; automate transfers. If funding falls short, scale tasks to fit the budget rather than your body.",
      ],
    },
    武曲: {
      paragraphs: [
        "You’re the one who gets the late-night call when decisions must be made and bills must be settled. Keys, signatures, passwords, hospital forms, somehow they all find your hands. You carry the family’s steel spine, even when your own shoulders ache. Inside, there’s the tug-of-war: pride in your competence, and the quiet hunger to be held rather than to hold everything together. You keep your voice calm, your face steady, but you notice the burnt edges, resentment creeping in when others vanish, tenderness shrinking behind duty. You don’t want to be the iron gate. You want to be the one who protects without losing the warmth that made you say yes in the first place.",
        "With Wu Qu in the Da Fu palace, this decade is an apprenticeship in guardianship. Expect sober choices around elders, property, and the threads that stitch a lineage together. You may become treasurer, advocate, and executor all at once, the person who turns chaos into ledgers and plans. Money, paperwork, and logistics can become your love language, yet the test is to lead without hardening. Fairness will be challenged by family myths and old pecking orders. Your authority will stick only if it’s paired with transparent rules and steady follow-through. Done well, you’ll consolidate what truly matters: clear wishes, clean records, a home handled with dignity, and memories captured before time goes quiet.",
        "This path can bless or bruise. If you clamp down, you’ll get the result but lose the room; if you soften too much, you’ll be used up. Choose grounded structure plus consistent tenderness. Let your firmness protect the soft things, stories, rituals, the elder’s sense of worth. Move now, not later; time taxes delay with confusion and conflict. This decade wants you to build a backbone the next generation can lean on. Take the mantle, but refuse the armor that seals you off.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Within 90 days, get elders’ wishes in writing: advance directives, updated will, and durable power of attorney; book the lawyer and doctor appointments yourself.",
        "Create a shared care ledger (simple spreadsheet): track expenses, hours, and decisions; reimburse monthly so money friction doesn’t rot relationships.",
        "Run a 45-minute family council every month with a fixed agenda and minutes; assign roles and deadlines so you’re not the only pillar.",
        "Use warm authority: send plans in plain words and a deadline, “Here’s what happens unless I hear a better option by Friday 5 pm.”",
        "Protect softness on purpose: schedule one weekly hour with the elder for stories only; record audio, digitize photos, and label names for a living archive.",
        "Before any irreversible move (selling a home, ending care with a provider), wait 72 hours, get one neutral opinion, and write down your top three reasons.",
      ],
    },
    天梁: {
      paragraphs: [
        "You’ve been the umbrella others stand under when the weather turns. People call you when something breaks, when a signature is needed, when an old promise must be honored. You carry the family’s unsaid agreements as if they were written in your bones. Part of you loves being the steady elder before your time; part of you resents how the role swallows your hours and softens your voice into a lecture. You prefer clean rules, sturdy solutions, and doors that lock. But your heart wants to be recognized not just for service, also for wisdom freely chosen, not duty assumed.",
        "This decade ties you to elders, estates, and institutions: hospitals, insurance, deeds, and the quiet rooms where decisions are made. True power arrives through clear paperwork, fair boundaries, and structured care. You’ll be asked to mediate, to fix, to fund, often. Say yes only where protection is real and shared. The risk is martyrdom: rescuing beyond contract, preaching instead of guiding, delaying repairs (legal or literal) until a leak becomes a flood. Handle the documents, formalize the help, and protect your health first. Otherwise, the role will define you more than you define it. If you keep carrying every load, your roof will buckle.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a one-page family protocol: decisions, money caps, and non-negotiable boundaries.",
        "Within 90 days, organize wills, medical directives, POA, deeds, and insurance; test one claim call.",
        "Use the 24-hour rule before agreeing to help; ask: Is it mine? Is it written? What ends if I say yes?",
        "Schedule a monthly elder check-in; track tasks, costs, and deadlines in a shared sheet.",
        "Mentor with limits: one mentee per quarter, defined goals, a start and end date.",
        "Prioritize structural maintenance: roof, plumbing, electrical; biannual inspections; a reserve equal to three months’ expenses.",
      ],
    },
    太阳: {
      paragraphs: [
        "You’ve been standing in the doorway between duty and self-direction, the family’s torch in one hand and your own map in the other. With Tai Yang in the Parents/Elders palace, this decade puts you under the gaze of those who raised, taught, and judged you, asked to be upright, generous, and visibly responsible. You want genuine respect yet ache to rewrite dated rules; you love lighting the way yet resent being treated like an endless power source. Pride and pressure braid together.",
        "Daily, it looks like this: your phone pings with can you host, mediate, explain? At work, bosses rely on your clarity; at home, relatives look to you to set the tone. You speak plainly, people defer, and then you go quiet, tired, replaying an elder’s voice in your head. You overfunction to prevent disappointment, polish decisions for applause, and postpone your own needs until the room is settled. The light is bright, but your batteries run low.",
        "This cycle doesn’t ask you to dim; it asks you to become your own elder. Lead by principle, not people-pleasing. Set simple boundaries, choose mentors who challenge you without belittling you, and let sunlight be rhythmic, focused work, clean handoffs, real rest. When you honor your limits, your warmth stops burning and starts ripening things. Elders turn into allies, lineage becomes a platform not a prison. Step to the head of the table with steady eyes, and let approval come from Tai Yang inside.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Write a one-page 'standards and limits' memo; share it with family and bosses.",
        "Before accepting any new duty, pause 12 hours and ask: does this serve my values?",
        "Set a monthly 45-minute check-in with a mentor; bring three questions and one decision.",
        "Delegate one recurring family task within 30 days; teach it once, then step back.",
        "Pick one visible project this year that you lead end-to-end; document outcomes.",
        "When an elder criticizes, ask for specifics, request an alternative, and confirm next steps in writing.",
      ],
    },
    七杀: {
      paragraphs: [
        "You carry a quiet vow: I will not repeat what hurt me, and I will not abandon those who raised me. In rooms with parents, elders, or authority, your chest tightens and your spine straightens. If chaos starts, you move, fast. You make the call no one wants to make, sign the form, confront the doctor, shut down the drama. You want respect, not permission; loyalty, not control. Yet the more you save the day, the more they treat you like a soldier on call. This decade sharpens that edge. You’ll be asked to cut knots: outdated rules, tangled finances, unspoken resentments. You are the blade that protects the tree, not the axe that fells it; used well, you clear what chokes the roots so love can breathe.",
        "But Qi Sha tests motive and restraint. Pride can harden into distance; a hot sentence can become a ten-year silence. Authority issues may replay through bosses or in-laws. You’ll be building boundaries, care plans, and new lines of respect, as well as choosing which traditions you keep and which you retire. Find mentors you can trust outside your family line; let wisdom soften your strike. Make every decisive act traceable, fair, and calm. The mission is to protect the lineage without losing yourself. Warning: if you confuse control with care, you’ll win battles and lose a home to return to.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a one-page decision brief before major family choices: purpose, options, costs/risks, deadline, owner. Share it.",
        "Use the 2-2-2 rule in hard talks: two facts, two feelings, two clear requests. No insults, no history lessons.",
        "Build a caregiving plan: roles, hours, budget, respite days, emergency contacts. Put it in a shared calendar and document.",
        "Centralize elders’ essentials in one folder (physical + cloud): IDs, meds list, doctors, insurance, wills, passwords. Review quarterly.",
        "Choose one independent elder/mentor for this decade. Meet monthly; bring three questions and one update.",
        "When anger spikes, wait 24 hours before final messages. Send drafts to a neutral friend or coach first.",
      ],
    },
    天机: {
      paragraphs: [
        "You are the one elders call when the form makes no sense or the doctor speaks too fast. You notice micro-shifts in a parent’s tone, read the room, and map the next three steps before anyone asks. Yet advice that lands on you as control makes your shoulders rise; you want a blessing, not a leash. This decade, Tian Ji in the Da Fu palace pulls you to the engine room of family and authority: documents, institutions, stories, and the quiet politics of respect. You translate feelings into plans, and plans back into care. The tug inside is real: craving guidance while guarding your independence; collecting data while postponing the decision that only you can make.",
        "This cycle ripens you as a strategist with a soft heart and firm edges. The path is not heroic rescuing; it is simple systems, plain speech, and consent-based advice. Let the past offer patterns, not prisons. Choose mentors beyond the bloodline, and set clean limits with the ones you serve. Beware the Tian Ji trap of triangling, overexplaining, or thinking one more spreadsheet can fix a person. When you honor elders without surrendering your steering wheel, the machine hums. Try to control every lever, and burnout plus resentment will follow. Step into counsel, not control. Make the map simple, then keep walking.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Schedule a 90-minute admin block on the first Saturday each month to handle parents' insurance, appointments, and legal paperwork; track it in a shared checklist.",
        "Before giving advice to an elder, ask: Do you want options or just a listener? If options, offer no more than two, with one next step.",
        "Create a family info hub (contacts, medications, allergies, legal docs) in a secure cloud folder; share access; run a 10-minute where-is-it drill every quarter.",
        "Use the three-times rule: if a task repeats three times, write a simple procedure; if not, stop optimizing and move on.",
        "Cap family problem-solving to 2 hours per week; when time is up, park new issues in a note and revisit at the next block; no midnight texting.",
        "Choose one outside mentor and one skill or certification; commit to 12 weeks; schedule a 15-minute weekly review to convert advice into action.",
      ],
    },
    左辅: {
      paragraphs: [
        "You’ve often been the steady pair of hands everyone relies on, the one who remembers appointments, finds the folder no one else can find, and keeps the tone calm when voices rise. Around elders and authority figures, you slide naturally into the role of trusted second-in-command, present, perceptive, and disarmingly practical. Yet beneath that competence lives a tug-of-war: the desire to be dutiful without disappearing, to honor the past without being chained to it. You sense what people need before they ask, but you also feel the slow creep of obligation nibbling at your time, energy, and private dreams.",
        "This decade places you at the bridge between generations. With Zuo Fu in 大父, your gift is to bring order to family systems and to translate old wisdom into workable plans. You’re not here to dominate the room, you’re here to make the room work: clearer roles, cleaner processes, kinder boundaries. Expect more calls during tax season, more hospital corridors, and more chances to convene siblings or stakeholders. Help will appear when you ask directly, and alliances will strengthen when agreements are written. The trap is over-helping in silence; the power is helping with structure.",
        "Choose structure over sacrifice. Put names, dates, budgets, and boundaries in writing while everyone is calm. If you don’t, you risk resentment and confusion that take root quietly. If you do, your quiet competence becomes recognized authority, and the legacy you protect will include your time and dignity, not just their stories.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft a one-page “family operating agreement” that lists decisions to make, who does what, and how costs are split.",
        "Schedule 90-day elder-care check-ins (medical, legal, financial). Use a shared agenda and folder so everyone sees the same facts.",
        "Have healthcare directives, durable power of attorney, and will/trust reviewed by a professional. Set a deadline and keep it.",
        "Cap your weekly support hours. Share your availability like office hours, and set a rotation; if someone skips, rebalance contributions.",
        "Speak in plain words during hard talks. Ask each person to restate the decision, then send a written summary within 24 hours.",
        "Record your elder’s stories, 30 minutes monthly. Label files by date, back them up, and note names/places to preserve context.",
      ],
    },
    右弼: {
      paragraphs: [
        "You know how to slip into the helpful seat without being asked. You’re the one elders call first, the one who translates doctors, fixes siblings’ misunderstandings, and remembers the dates no one else tracks. Part of you warms at being needed; another part burns at being presumed. You want to honor where you come from without becoming trapped by it. When you try to draw a line, guilt nips at your heels; when you say yes again, resentment whispers. You long for elder allies, not just elder duties ,  for blessings, not just burdens.",
        "With Zuo Fu in 大父, this decade awakens the diplomat-steward in you. Your gift is making relationships breathable and plans workable. Used well, you become the bridge between generations: gathering stories, shaping clear agreements, turning scattered goodwill into steady structures. Used poorly, you over-function, absorb chaos, and keep old patterns alive. The invitation is to graduate from “rescuer” to “coordinator” ,  to offer calm leadership with firm edges. Let loyalty be chosen, not extracted; let care be shared, not assumed.",
        "If you set rhythm and roles, this cycle uplifts you with surprising support from elders and mentors; doors open through trust and referrals. If you drift, the same love turns heavy. Choose your stance early and keep choosing. Your lineage is asking you to steer, not to surrender.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Set a weekly cap for elder care/admin hours and put it on your calendar.",
        "Schedule three “legacy talks” with key elders; record audio, then summarize and share.",
        "Create a checklist to update wills, powers of attorney, and health directives; assign owners and deadlines.",
        "Write a one-page care agreement with siblings/relatives detailing who handles money, transport, visits, and reviews.",
        "Build a mentor circle: meet quarterly with two non-family elders; bring questions and take notes.",
        "End triangulation: move family disputes to group messages; respond after 24 hours with what you can and cannot do.",
      ],
    },
    文昌: {
      paragraphs: [
        "You’ve long been the one who keeps the elders’ world stitched together with words, translating intentions, softening tempers, turning messy history into clean sentences. Your mind reaches for order when others reach for blame. Yet inside, a tug: respect the old ways or say what you truly see? Be the dutiful grandchild or the honest editor of the family script? You crave the nod of approval, yet your chest tightens when you swallow a truth to keep the peace.",
        "This decade asks you to become the bridge and the scribe, without losing yourself in the task. You’ll find yourself drafting letters, condensing medical updates, organizing photos, and capturing stories that would otherwise disappear. Your careful language can steady a room, but it can also hide the hard lines that need drawing. Wen Chang  in Da Fu wants you to archive what matters and revise what no longer does: to turn inherited habits into conscious choices, to put agreements in writing, and to name the unspoken with kindness and precision.",
        "Take heart: your words can reshape the family’s future, not just preserve its past. When you summarize clearly, set boundaries cleanly, and document faithfully, you protect everyone, including yourself. This is a decade for certifications, research, and putting your name on work that lasts: family histories, legal arrangements, teachings that endure. Let your clarity be a lantern. Choose to be the author, not only the copyist.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Hold “office hours” for family admin: one set block each week, with a clear end time.",
        "Record one 30-minute audio with an elder every week; label, date, and back it up twice.",
        "Create a shared folder for wills, directives, and key contacts; review with a professional annually.",
        "In family talks, state the decision, next steps, and who owns what, in three sentences, then send a summary.",
        "Use an 80% rule: ship drafts within 48 hours; perfection waits, clarity doesn’t.",
        "Before agreeing to a favor, ask “Is this mine to do?” Wait 12 hours before replying.",
      ],
    },
    文曲: {
      paragraphs: [
        "This decade, your silver tongue becomes the family’s olive branch. You translate prickly emails into peace, pick the right words at hospital desks and bureaucratic windows, craft birthday toasts and difficult updates. Elders, bosses, and gatekeepers warm to your grace; mentors appear when you articulate their legacy better than they can. Yet a quiet ache travels with you: are you truly heard, or just useful? Wen Qu’s artistry longs to be adored, while the Elders realm asks you to be appropriate. You sense every sigh and subtext, adjust yourself to keep harmony, and later wonder where your own sentence went.",
        "You may find yourself curating archives, digitizing photos, managing approvals, smoothing feuds over dinners. Praise melts you; a sharp critique sends you spiraling into edits and explanations. You idealize the parent you wished for, write around the wound rather than through it, become the spokesperson for a family or department that resists change. Institutions reward your polish with certificates or titles, but the cost is hidden: you postpone blunt truths, trade clarity for elegance, and carry invisible emotional labor others barely acknowledge.",
        "If you keep polishing the surface, the foundation will crack in silence. This decade favors brave, beautiful honesty: words that draw boundaries, requests that are specific, records that protect you. Be the bridge, but set a load limit; honor the past, but stop auditioning for its approval. Use your pen to close loops, not to cover leaks. Otherwise you become the beloved bandage that never lets the wound breathe.",
      ],
      action_points_title: "Action points for this decade.",
      action_points: [
        "Draft and share a one-page elder-care plan: tasks, hours, money, decision-makers, review dates.",
        "In hard conversations, use three lines: what I’ll do; what I won’t; what I propose.",
        "Build a living family/mentor file: contacts, medications, legal docs, passwords, meeting notes, update monthly.",
        "When criticized, wait 24 hours; reply with one clarifying question and one firm boundary.",
        "Choose credentials by writing “Why me, why this, why now” in 100 words. If it flatters authority more than you, decline.",
      ],
    },
  },
};
