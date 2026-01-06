/**
 * Zodiac Profiles - Personality and Interaction Guidance
 * 
 * Comprehensive personality profiles for all 12 Chinese zodiac animals.
 * Used to help users understand and connect with their nobleman.
 */

export interface ZodiacInsights {
  /** Zodiac animal name (English) */
  zodiac: string;
  
  /** Chinese character */
  zodiacChinese: string;
  
  /** Element association */
  element: string;
  
  /** Core personality traits (3-4 keywords) */
  coreTraits: string[];
  
  /** How to recognize them in real life */
  recognitionSigns: string[];
  
  /** What motivates and drives them */
  motivations: string[];
  
  /** Best ways to approach and connect */
  approachStrategies: string[];
  
  /** Red flags or challenges to watch for */
  watchOuts: string[];
  
  /** Detailed personality analysis */
  personality: {
    strengths: string[];
    weaknesses: string[];
    communicationStyle: string;
    trustBuilding: string[];
  };
}

/**
 * Complete zodiac profiles for all 12 animals
 */
export const ZODIAC_PROFILES: Record<string, ZodiacInsights> = {
  "Rat": {
    zodiac: "Rat",
    zodiacChinese: "鼠",
    element: "Water",
    coreTraits: ["Intelligent", "Adaptable", "Quick-Witted", "Resourceful"],
    recognitionSigns: [
      "Sharp observers who notice details others miss",
      "Often work in finance, research, or strategic planning roles",
      "Quick talkers with clever solutions to problems",
      "Natural networkers who seem to know everyone"
    ],
    motivations: [
      "Financial security and wealth accumulation",
      "Intellectual stimulation and continuous learning",
      "Building social connections and influence",
      "Efficiency and optimization in all areas"
    ],
    approachStrategies: [
      "Share valuable information or opportunities first",
      "Respect their intelligence - come well-prepared",
      "Build trust through consistent small interactions",
      "Show appreciation for their insights and advice"
    ],
    watchOuts: [
      "Can be overly cautious with major commitments",
      "May prioritize self-interest before helping others",
      "Sometimes calculating or manipulative in approach",
      "Need to see clear personal benefit before investing time"
    ],
    personality: {
      strengths: [
        "Exceptional problem-solving and analytical abilities",
        "Strong survival instincts and practical wisdom",
        "Excellent at reading situations and people's intentions",
        "Highly adaptable to changing circumstances"
      ],
      weaknesses: [
        "Can be overly suspicious and slow to trust",
        "May hoard resources, information, or opportunities",
        "Sometimes too focused on material gains",
        "Difficulty committing fully to relationships"
      ],
      communicationStyle: "Direct and efficient. Rats appreciate brevity and clear value. Skip lengthy small talk and get to the point with concrete benefits. They respond well to logical arguments backed by data.",
      trustBuilding: [
        "Demonstrate reliability through consistent follow-through",
        "Share useful information or valuable connections freely",
        "Respect their boundaries and analytical nature",
        "Show long-term thinking rather than just immediate needs"
      ]
    }
  },

  "Ox": {
    zodiac: "Ox",
    zodiacChinese: "牛",
    element: "Earth",
    coreTraits: ["Reliable", "Diligent", "Patient", "Methodical"],
    recognitionSigns: [
      "Steady workers who show up consistently and deliver",
      "Often in agriculture, construction, accounting, or administration",
      "Practical dressers who prioritize function over fashion",
      "Speak slowly and deliberately, weighing their words"
    ],
    motivations: [
      "Stability and security in all life areas",
      "Recognition for hard work and dedication",
      "Building something lasting and tangible",
      "Maintaining traditions and proven methods"
    ],
    approachStrategies: [
      "Show respect for their experience and work ethic",
      "Be patient - they need time to warm up and trust",
      "Demonstrate commitment through consistent actions",
      "Value their advice on practical, long-term matters"
    ],
    watchOuts: [
      "Can be extremely stubborn once they've decided",
      "Resist change and new methods intensely",
      "May be judgmental of those who don't work as hard",
      "Slow to forgive mistakes or broken promises"
    ],
    personality: {
      strengths: [
        "Unmatched reliability and follow-through on commitments",
        "Strong work ethic and ability to persevere through difficulties",
        "Practical wisdom gained from real-world experience",
        "Calm and patient under pressure or chaos"
      ],
      weaknesses: [
        "Can be inflexible and resistant to innovation",
        "May miss opportunities by moving too slowly",
        "Sometimes lack spontaneity or sense of fun",
        "Can hold grudges for extended periods"
      ],
      communicationStyle: "Straightforward and no-nonsense. Oxen prefer concrete facts over theories. They value honesty and directness, even if the truth is uncomfortable. Avoid over-promising or exaggerating.",
      trustBuilding: [
        "Demonstrate your work ethic through consistent effort",
        "Keep every promise, no matter how small",
        "Show respect for traditional values and proven methods",
        "Give them time - trust builds slowly but deeply"
      ]
    }
  },

  "Tiger": {
    zodiac: "Tiger",
    zodiacChinese: "虎",
    element: "Wood",
    coreTraits: ["Courageous", "Confident", "Charismatic", "Independent"],
    recognitionSigns: [
      "Natural leaders who command attention when entering a room",
      "Often in sports, military, entrepreneurship, or performance arts",
      "Bold fashion choices and strong physical presence",
      "Speak with authority and conviction about their beliefs"
    ],
    motivations: [
      "Challenges and adventures that test their abilities",
      "Recognition and respect from peers and community",
      "Freedom and autonomy to pursue their vision",
      "Making a significant impact or leaving a legacy"
    ],
    approachStrategies: [
      "Show confidence and directness - they respect strength",
      "Present exciting challenges or meaningful opportunities",
      "Give them space to lead or contribute their ideas",
      "Acknowledge their achievements genuinely and publicly"
    ],
    watchOuts: [
      "Can be impulsive and take unnecessary risks",
      "May resist authority, collaboration, or compromise",
      "Sometimes overly competitive and dominating",
      "Need to be the hero - can overshadow others"
    ],
    personality: {
      strengths: [
        "Natural leadership ability and magnetic charisma",
        "Courage to tackle difficult challenges others avoid",
        "Strong sense of justice and fairness in dealings",
        "Inspiring and motivational presence for others"
      ],
      weaknesses: [
        "Can be stubborn and inflexible once committed",
        "May act impulsively before thinking things through",
        "Too proud to ask for help when struggling",
        "Difficulty with routine tasks or mundane details"
      ],
      communicationStyle: "Bold and direct. Tigers appreciate straightforward, confident communication. Don't be passive, overly diplomatic, or tentative. Match their energy and speak with conviction.",
      trustBuilding: [
        "Show courage and authenticity in your interactions",
        "Respect their independence and expertise publicly",
        "Challenge them constructively to show you're an equal",
        "Be fiercely loyal and stand by your commitments"
      ]
    }
  },

  "Rabbit": {
    zodiac: "Rabbit",
    zodiacChinese: "兔",
    element: "Wood",
    coreTraits: ["Gentle", "Diplomatic", "Artistic", "Cautious"],
    recognitionSigns: [
      "Soft-spoken peacemakers who avoid confrontation",
      "Often in art, design, counseling, or hospitality roles",
      "Elegant appearance and refined taste in surroundings",
      "Listen more than they speak, observing carefully"
    ],
    motivations: [
      "Harmony and peaceful relationships in all areas",
      "Beauty, comfort, and aesthetic pleasure",
      "Security and avoiding risk or conflict",
      "Creating pleasant experiences for others"
    ],
    approachStrategies: [
      "Create a calm, comfortable environment for interactions",
      "Be gentle and patient - avoid aggression or pressure",
      "Show appreciation for their artistic or empathetic nature",
      "Build trust slowly through kindness and consideration"
    ],
    watchOuts: [
      "Can be overly cautious and miss opportunities",
      "May avoid necessary confrontations or difficult truths",
      "Sometimes too sensitive to criticism",
      "Tendency to withdraw when feeling threatened"
    ],
    personality: {
      strengths: [
        "Exceptional empathy and emotional intelligence",
        "Natural diplomacy in resolving conflicts peacefully",
        "Refined aesthetic sense and attention to beauty",
        "Ability to create comfortable, harmonious environments"
      ],
      weaknesses: [
        "Can be indecisive and struggle with choices",
        "May be too conflict-averse to stand up for themselves",
        "Sometimes overly sensitive or easily hurt",
        "Tendency to worry excessively about potential problems"
      ],
      communicationStyle: "Gentle and indirect. Rabbits prefer subtle hints over blunt statements. Use softer language and give them time to process. Harsh criticism or aggressive tones will cause them to retreat.",
      trustBuilding: [
        "Create a safe, non-threatening environment consistently",
        "Show genuine kindness without expecting immediate returns",
        "Respect their need for personal space and boundaries",
        "Be patient and let the relationship develop naturally"
      ]
    }
  },

  "Dragon": {
    zodiac: "Dragon",
    zodiacChinese: "龍",
    element: "Earth",
    coreTraits: ["Ambitious", "Powerful", "Charismatic", "Visionary"],
    recognitionSigns: [
      "Magnetic personalities who naturally attract followers",
      "Often in executive leadership, entertainment, or innovation",
      "Dramatic and confident in their style and presentation",
      "Big-picture thinkers who inspire others with their vision"
    ],
    motivations: [
      "Achieving greatness and leaving a lasting legacy",
      "Recognition and admiration from society",
      "Pursuing grand visions and ambitious goals",
      "Power and influence to shape their world"
    ],
    approachStrategies: [
      "Show genuine admiration for their achievements",
      "Present big, exciting visions that inspire them",
      "Give them the spotlight and center stage",
      "Match their energy and enthusiasm authentically"
    ],
    watchOuts: [
      "Can be arrogant and dismissive of others",
      "May expect special treatment or privileges",
      "Sometimes unrealistic about limitations or challenges",
      "Tendency to dominate conversations and decisions"
    ],
    personality: {
      strengths: [
        "Natural charisma that draws people and opportunities",
        "Bold vision and ability to inspire others to follow",
        "Confidence to pursue ambitious goals fearlessly",
        "Generous and protective of those in their circle"
      ],
      weaknesses: [
        "Can be egotistical and need constant validation",
        "May overlook practical details in pursuit of vision",
        "Sometimes impatient with slower or cautious people",
        "Difficulty accepting criticism or admitting mistakes"
      ],
      communicationStyle: "Grand and inspiring. Dragons appreciate enthusiasm and big ideas. They respond well to flattery and admiration. Keep up with their energy and don't dampen their enthusiasm with excessive caution.",
      trustBuilding: [
        "Show loyalty and support their ambitious goals publicly",
        "Acknowledge their achievements and unique qualities",
        "Be confident and capable - they respect competence",
        "Give them attention and recognition regularly"
      ]
    }
  },

  "Snake": {
    zodiac: "Snake",
    zodiacChinese: "蛇",
    element: "Fire",
    coreTraits: ["Wise", "Intuitive", "Mysterious", "Analytical"],
    recognitionSigns: [
      "Quiet observers who reveal little about themselves",
      "Often in research, psychology, philosophy, or finance",
      "Elegant and sophisticated in appearance and manner",
      "Speak rarely but with deep insight when they do"
    ],
    motivations: [
      "Deep understanding and wisdom about life",
      "Privacy and control over their personal space",
      "Quality over quantity in all relationships",
      "Uncovering hidden truths and mysteries"
    ],
    approachStrategies: [
      "Respect their need for privacy and personal space",
      "Engage in deep, meaningful conversations",
      "Be patient - they evaluate people carefully over time",
      "Show your intelligence and depth of thinking"
    ],
    watchOuts: [
      "Can be secretive and withhold important information",
      "May be jealous or possessive in relationships",
      "Sometimes manipulative in pursuit of their goals",
      "Tendency to hold grudges and seek subtle revenge"
    ],
    personality: {
      strengths: [
        "Exceptional intuition and ability to read people",
        "Deep wisdom and philosophical understanding",
        "Strategic thinking and long-term planning ability",
        "Intense focus and determination when committed"
      ],
      weaknesses: [
        "Can be overly secretive and distrustful",
        "May be vindictive when hurt or betrayed",
        "Sometimes too introspective and isolated",
        "Difficulty forgiving and moving past grudges"
      ],
      communicationStyle: "Subtle and layered. Snakes communicate in hints and read between lines. They appreciate depth and dislike superficiality. Be authentic - they can detect insincerity instantly.",
      trustBuilding: [
        "Prove your trustworthiness through actions over time",
        "Respect their privacy and don't pry into their affairs",
        "Show depth of character and intellectual capability",
        "Be patient - they open up very slowly and selectively"
      ]
    }
  },

  "Horse": {
    zodiac: "Horse",
    zodiacChinese: "馬",
    element: "Fire",
    coreTraits: ["Energetic", "Independent", "Adventurous", "Optimistic"],
    recognitionSigns: [
      "Active people always on the move with busy schedules",
      "Often in travel, sales, event planning, or athletics",
      "Casual, comfortable style that allows freedom of movement",
      "Speak quickly and enthusiastically about their interests"
    ],
    motivations: [
      "Freedom and independence in lifestyle choices",
      "New experiences and adventures to explore",
      "Variety and avoiding monotony or routine",
      "Social interaction and meeting new people"
    ],
    approachStrategies: [
      "Keep pace with their energy and enthusiasm",
      "Suggest spontaneous plans or new experiences",
      "Give them freedom - don't try to tie them down",
      "Be direct and honest in all communications"
    ],
    watchOuts: [
      "Can be commitment-phobic in relationships",
      "May be unreliable or change plans frequently",
      "Sometimes lack follow-through on promises",
      "Tendency to be impulsive and impatient"
    ],
    personality: {
      strengths: [
        "Boundless energy and enthusiasm for life",
        "Optimistic outlook that inspires others",
        "Adaptability and openness to new experiences",
        "Honest and straightforward in their dealings"
      ],
      weaknesses: [
        "Can be restless and unable to settle down",
        "May lack patience for details or long-term projects",
        "Sometimes tactless and speak without thinking",
        "Difficulty maintaining focus on one goal"
      ],
      communicationStyle: "Fast-paced and direct. Horses appreciate brevity and honesty. Get to the point quickly and don't try to control or restrict them. They value authenticity and dislike manipulation.",
      trustBuilding: [
        "Give them space and freedom without demands",
        "Be spontaneous and adventurous alongside them",
        "Accept their independent nature without judgment",
        "Show reliability when it matters most to them"
      ]
    }
  },

  "Goat": {
    zodiac: "Goat",
    zodiacChinese: "羊",
    element: "Earth",
    coreTraits: ["Creative", "Gentle", "Compassionate", "Artistic"],
    recognitionSigns: [
      "Kind souls who prioritize others' feelings and comfort",
      "Often in arts, crafts, charity work, or healing professions",
      "Soft, flowing style with attention to aesthetic details",
      "Speak kindly and avoid harsh words or confrontation"
    ],
    motivations: [
      "Creating beauty and harmony in their environment",
      "Helping others and making a positive difference",
      "Security and being cared for by others",
      "Expressing themselves through creative outlets"
    ],
    approachStrategies: [
      "Show genuine care and emotional support",
      "Appreciate their creative talents and sensitivity",
      "Provide reassurance and stability in the relationship",
      "Create warm, comfortable spaces for interaction"
    ],
    watchOuts: [
      "Can be overly dependent on others for support",
      "May be pessimistic and worry excessively",
      "Sometimes passive-aggressive when upset",
      "Tendency to play the victim in conflicts"
    ],
    personality: {
      strengths: [
        "Deep compassion and empathy for others' suffering",
        "Natural artistic talent and creative expression",
        "Gentle nature that creates peaceful environments",
        "Ability to appreciate beauty in everyday moments"
      ],
      weaknesses: [
        "Can be overly dependent and need constant reassurance",
        "May avoid responsibility or difficult decisions",
        "Sometimes manipulative through guilt or tears",
        "Tendency toward self-pity and complaining"
      ],
      communicationStyle: "Soft and emotional. Goats need reassurance and emotional validation. They respond poorly to criticism and need gentle encouragement. Use kind words and show empathy for their feelings.",
      trustBuilding: [
        "Provide consistent emotional support and reassurance",
        "Show appreciation for their creative and caring nature",
        "Be patient with their need for security and comfort",
        "Protect them from harsh realities when possible"
      ]
    }
  },

  "Monkey": {
    zodiac: "Monkey",
    zodiacChinese: "猴",
    element: "Metal",
    coreTraits: ["Clever", "Playful", "Curious", "Versatile"],
    recognitionSigns: [
      "Quick-witted entertainers who make others laugh",
      "Often in entertainment, tech, marketing, or innovation",
      "Trendy style that shows their playful personality",
      "Speak with humor and constantly make jokes or puns"
    ],
    motivations: [
      "Solving puzzles and tackling interesting challenges",
      "Entertainment and keeping life fun and exciting",
      "Learning new skills and gaining knowledge",
      "Social recognition and being seen as clever"
    ],
    approachStrategies: [
      "Keep interactions fun, light, and entertaining",
      "Challenge their intellect with puzzles or problems",
      "Appreciate their humor and wit genuinely",
      "Give them variety and avoid boring routines"
    ],
    watchOuts: [
      "Can be manipulative and deceptive when it suits them",
      "May not take important matters seriously enough",
      "Sometimes unreliable and change plans last minute",
      "Tendency to use humor to avoid emotional depth"
    ],
    personality: {
      strengths: [
        "Exceptional intelligence and quick learning ability",
        "Creative problem-solving and innovative thinking",
        "Adaptability to new situations and challenges",
        "Entertaining personality that attracts others"
      ],
      weaknesses: [
        "Can be dishonest and bend rules frequently",
        "May lack depth in relationships or commitments",
        "Sometimes too scattered to finish projects",
        "Difficulty being serious when situation requires it"
      ],
      communicationStyle: "Playful and witty. Monkeys appreciate humor and cleverness. They respond well to banter and intellectual sparring. Keep things light but engage their mind. They bore easily with routine conversation.",
      trustBuilding: [
        "Keep them entertained and intellectually stimulated",
        "Don't take everything they say too seriously",
        "Match their playful energy while setting boundaries",
        "Show you can keep up with their quick thinking"
      ]
    }
  },

  "Rooster": {
    zodiac: "Rooster",
    zodiacChinese: "雞",
    element: "Metal",
    coreTraits: ["Organized", "Confident", "Honest", "Perfectionist"],
    recognitionSigns: [
      "Immaculately dressed with attention to every detail",
      "Often in management, quality control, teaching, or military",
      "Direct speakers who offer unsolicited advice frequently",
      "Early risers who are punctual and organized"
    ],
    motivations: [
      "Excellence and perfection in all endeavors",
      "Being recognized as competent and capable",
      "Order, efficiency, and proper procedures",
      "Helping others improve through honest feedback"
    ],
    approachStrategies: [
      "Be punctual and well-prepared for meetings",
      "Appreciate their high standards and attention to detail",
      "Accept their advice graciously even if unsolicited",
      "Show your own competence and organization"
    ],
    watchOuts: [
      "Can be overly critical and judgmental of others",
      "May be bossy and dominate with their opinions",
      "Sometimes inflexible about the 'right' way to do things",
      "Tendency to be boastful about their achievements"
    ],
    personality: {
      strengths: [
        "Exceptional organizational and planning abilities",
        "High standards that ensure quality results",
        "Honest and direct communication style",
        "Confidence and self-assurance in their abilities"
      ],
      weaknesses: [
        "Can be overly critical and hard to please",
        "May lack tact when delivering honest feedback",
        "Sometimes arrogant about their knowledge",
        "Difficulty relaxing or accepting imperfection"
      ],
      communicationStyle: "Direct and precise. Roosters value accuracy and detail. They appreciate structured conversations with clear points. Be prepared for blunt honesty and don't take criticism personally.",
      trustBuilding: [
        "Demonstrate competence and attention to detail",
        "Be punctual and keep your commitments precisely",
        "Accept their feedback as trying to help you improve",
        "Show respect for their expertise and high standards"
      ]
    }
  },

  "Dog": {
    zodiac: "Dog",
    zodiacChinese: "狗",
    element: "Earth",
    coreTraits: ["Loyal", "Honest", "Protective", "Responsible"],
    recognitionSigns: [
      "Dependable friends who show up when you need them",
      "Often in security, law, social work, or community service",
      "Practical, functional style without unnecessary flash",
      "Speak with sincerity and expect the same in return"
    ],
    motivations: [
      "Protecting and caring for loved ones",
      "Justice and fairness in society",
      "Building trustworthy, lasting relationships",
      "Serving a cause greater than themselves"
    ],
    approachStrategies: [
      "Be honest and straightforward at all times",
      "Show loyalty and commitment to the relationship",
      "Demonstrate your values through consistent actions",
      "Respect their protective instincts toward others"
    ],
    watchOuts: [
      "Can be overly suspicious of new people or ideas",
      "May be pessimistic and focus on worst-case scenarios",
      "Sometimes self-righteous about their moral standards",
      "Tendency to worry excessively about others"
    ],
    personality: {
      strengths: [
        "Unwavering loyalty to friends and family",
        "Strong sense of justice and moral integrity",
        "Reliable and responsible in all commitments",
        "Protective nature that makes others feel safe"
      ],
      weaknesses: [
        "Can be cynical and distrustful of strangers",
        "May be overly anxious and pessimistic",
        "Sometimes stubborn in their moral positions",
        "Difficulty forgiving betrayal or dishonesty"
      ],
      communicationStyle: "Honest and direct. Dogs value sincerity above all else. They can detect dishonesty and will withdraw if they sense it. Speak from the heart and show your true intentions clearly.",
      trustBuilding: [
        "Be completely honest even when it's uncomfortable",
        "Show loyalty through actions during difficult times",
        "Respect their values and moral standards",
        "Give them time - they test people thoroughly before trusting"
      ]
    }
  },

  "Pig": {
    zodiac: "Pig",
    zodiacChinese: "豬",
    element: "Water",
    coreTraits: ["Generous", "Compassionate", "Optimistic", "Sincere"],
    recognitionSigns: [
      "Warm, welcoming people who make others feel comfortable",
      "Often in hospitality, food service, healthcare, or charity",
      "Comfortable, relaxed style that prioritizes ease",
      "Speak kindly and see the best in everyone"
    ],
    motivations: [
      "Enjoying life's pleasures and comfort",
      "Helping others and spreading kindness",
      "Building genuine, authentic relationships",
      "Creating abundance and sharing it generously"
    ],
    approachStrategies: [
      "Be genuine and authentic in your interactions",
      "Share meals or comfortable experiences together",
      "Show appreciation for their generosity and kindness",
      "Be honest - they value sincerity highly"
    ],
    watchOuts: [
      "Can be too trusting and easily taken advantage of",
      "May overindulge in food, drink, or spending",
      "Sometimes naive about others' negative intentions",
      "Tendency to avoid confrontation even when necessary"
    ],
    personality: {
      strengths: [
        "Genuine kindness and generosity toward others",
        "Optimistic outlook that lifts spirits",
        "Honest and sincere in all their dealings",
        "Ability to enjoy life and appreciate simple pleasures"
      ],
      weaknesses: [
        "Can be gullible and trust the wrong people",
        "May lack discipline in managing resources",
        "Sometimes lazy or avoid difficult work",
        "Tendency to be taken advantage of by others"
      ],
      communicationStyle: "Warm and genuine. Pigs appreciate heartfelt, sincere conversations. They respond well to kindness and honesty. Avoid pretense or manipulation - they value authenticity above all.",
      trustBuilding: [
        "Be honest and sincere from the very beginning",
        "Show genuine care for their wellbeing",
        "Share generously and reciprocate their kindness",
        "Protect them from those who might exploit their trust"
      ]
    }
  }
};

/**
 * Get zodiac profile by English name
 * @param zodiacName - English zodiac name (e.g., "Tiger", "Dragon")
 * @returns ZodiacInsights or null if not found
 */
export function getZodiacProfile(zodiacName: string): ZodiacInsights | null {
  return ZODIAC_PROFILES[zodiacName] || null;
}

/**
 * Get all available zodiac names
 * @returns Array of all zodiac animal names
 */
export function getAllZodiacNames(): string[] {
  return Object.keys(ZODIAC_PROFILES);
}

