/**
 * Constants for Zi Wei Dou Shu chart analysis
 * Maps stars and their transformations to specific analytical content
 */

/**
 * Interface for analysis content structure
 */
export interface AnalysisContent {
  mainText: string;
  positivePoints: string[];
  cautionPoints: string[];
}

/**
 * Interface for career analysis structure
 */
export interface CareerAnalysis {
  suitableCareers: string[];
  financialOutlook: string;
}

/**
 * Interface for relationship analysis structure
 */
export interface RelationshipAnalysis {
  relationshipStyle: string[];
  compatibleSigns: string[];
}

/**
 * Interface for health analysis structure
 */
export interface HealthAnalysis {
  strengths: string[];
  areasOfAttention: string[];
}

/**
 * Interface for life purpose analysis structure
 */
export interface LifePurposeAnalysis {
  naturalTalents: string[];
  lifeLessons: string[];
}

/**
 * Complete analysis structure for a star with transformation
 */
export interface StarAnalysis {
  career: {
    content: AnalysisContent;
    details: CareerAnalysis;
  };
  relationships: {
    content: AnalysisContent;
    details: RelationshipAnalysis;
  };
  health: {
    content: AnalysisContent;
    details: HealthAnalysis;
  };
  lifePurpose: {
    content: AnalysisContent;
    details: LifePurposeAnalysis;
  };
}

/**
 * Maps each major star and its transformation to specific analysis text
 */
export const FOUR_TRANSFORMATIONS_ANALYSIS: Record<string, Record<"祿" | "權" | "科" | "忌", StarAnalysis>> = {
  "紫微": {
    "祿": {
      career: {
        content: {
          mainText: "紫微化禄在事业宫位，象征着稳定且有权威的职业发展道路。您可能在管理、领导或政府相关领域有出色表现，财富积累稳健而持久。",
          positivePoints: ["领导能力强", "职业发展稳定", "财富积累可靠"],
          cautionPoints: ["需警惕权力欲过强", "可能过于保守"]
        },
        details: {
          suitableCareers: ["高级管理", "政府部门", "教育领导"],
          financialOutlook: "稳定增长，具有长期财富积累潜力"
        }
      },
      relationships: {
        content: {
          mainText: "紫微化禄影响人际关系，使您在人际互动中带有天然的威严与权威感。家庭中往往扮演决策者角色，但需注意倾听他人意见。",
          positivePoints: ["人际关系稳定", "受人尊敬", "家庭关系和谐"],
          cautionPoints: ["可能过于主导", "需学习妥协"]
        },
        details: {
          relationshipStyle: ["忠诚", "负责", "稳重"],
          compatibleSigns: ["巨门", "贪狼", "太阴"]
        }
      },
      health: {
        content: {
          mainText: "紫微化禄对健康有积极影响，体质较为稳定，但需注意因过度工作带来的压力问题。注重休息和平衡饮食对维持健康至关重要。",
          positivePoints: ["体质强健", "恢复能力强", "生命力旺盛"],
          cautionPoints: ["压力管理需加强", "可能忽视休息"]
        },
        details: {
          strengths: ["心脏功能良好", "免疫系统强健"],
          areasOfAttention: ["压力管理", "头部健康"]
        }
      },
      lifePurpose: {
        content: {
          mainText: "紫微化禄的人往往有明确的人生目标和使命感，适合在需要领导力的领域发挥才能。您的人生目标可能与建立某种长久的制度或体系相关。",
          positivePoints: ["目标明确", "意志坚定", "有使命感"],
          cautionPoints: ["可能过于固执", "需培养灵活性"]
        },
        details: {
          naturalTalents: ["领导能力", "决策能力", "组织管理"],
          lifeLessons: ["学会授权", "培养同理心", "平衡工作与生活"]
        }
      }
    },
    "權": {
      career: {
        content: {
          mainText: "紫微化权展现出强大的事业发展潜力，特别是在权力和决策领域。您可能在政治、管理或具有权威性的职位上表现出色，但需警惕权力欲过强。",
          positivePoints: ["权威性强", "决策果断", "有领导魅力"],
          cautionPoints: ["可能过于专制", "需注意权力平衡"]
        },
        details: {
          suitableCareers: ["行政管理", "政治领域", "企业高管"],
          financialOutlook: "通过权力位置获得财富增长"
        }
      },
      relationships: {
        content: {
          mainText: "紫微化权在人际关系中展现出权威和主导性。您在关系中往往处于领导地位，但需要学习倾听和妥协，以维持健康的人际互动。",
          positivePoints: ["关系中掌握主导", "能提供方向", "保护家人"],
          cautionPoints: ["可能过于控制", "需学习倾听"]
        },
        details: {
          relationshipStyle: ["主导", "保护", "坚定"],
          compatibleSigns: ["天同", "天梁", "武曲"]
        }
      },
      health: {
        content: {
          mainText: "紫微化权的人健康状况通常稳定，但特别需要注意心理健康和压力管理。权力欲望可能导致过度紧张和高血压风险。",
          positivePoints: ["生命力强", "恢复能力佳", "意志力强"],
          cautionPoints: ["易有高压症状", "情绪管理重要"]
        },
        details: {
          strengths: ["体质强健", "抗压能力强"],
          areasOfAttention: ["心血管系统", "压力导致的健康问题"]
        }
      },
      lifePurpose: {
        content: {
          mainText: "紫微化权的人生目标往往与获得权威地位和发挥领导才能相关。您可能追求在某个领域建立权威，或通过影响力改变社会某些方面。",
          positivePoints: ["追求卓越", "有领导抱负", "改革精神"],
          cautionPoints: ["可能过于野心勃勃", "需平衡个人与公共利益"]
        },
        details: {
          naturalTalents: ["战略思维", "权威领导", "改革创新"],
          lifeLessons: ["谦逊", "分享权力", "服务他人"]
        }
      }
    },
    "科": {
      career: {
        content: {
          mainText: "紫微化科显示出在学术、研究或需要专业知识的领域的卓越表现。您可能在科学、教育或需要精确分析的职业中取得成就，财务稳健但不奢侈。",
          positivePoints: ["学术才能", "分析能力强", "专业知识丰富"],
          cautionPoints: ["可能过于理论化", "实用性需加强"]
        },
        details: {
          suitableCareers: ["研究", "教育", "专业顾问"],
          financialOutlook: "通过专业知识获得稳定收入"
        }
      },
      relationships: {
        content: {
          mainText: "紫微化科的人在人际关系中表现理性、客观，重视思想交流。家庭关系中可能偏向理性分析而非情感表达，需要平衡理性与感性。",
          positivePoints: ["理性交流", "知识分享", "忠诚可靠"],
          cautionPoints: ["情感表达不足", "可能显得疏远"]
        },
        details: {
          relationshipStyle: ["理性", "忠诚", "稳定"],
          compatibleSigns: ["文曲", "文昌", "左辅"]
        }
      },
      health: {
        content: {
          mainText: "紫微化科对健康的影响主要表现在理性管理健康方面的优势。您可能对健康知识有浓厚兴趣，并能科学地规划养生方案，但需警惕过度思虑。",
          positivePoints: ["健康知识丰富", "理性管理健康", "生活有规律"],
          cautionPoints: ["可能过度分析", "心理压力需释放"]
        },
        details: {
          strengths: ["免疫系统", "神经系统"],
          areasOfAttention: ["精神压力", "过度思虑导致的失眠"]
        }
      },
      lifePurpose: {
        content: {
          mainText: "紫微化科的人生目标往往与知识追求、学术成就或专业卓越相关。您可能致力于某个领域的研究或教育工作，通过知识传播实现人生价值。",
          positivePoints: ["追求真理", "学术精神", "专业追求"],
          cautionPoints: ["可能缺乏实际应用", "需加强社交面"]
        },
        details: {
          naturalTalents: ["分析能力", "学习能力", "科研才能"],
          lifeLessons: ["将知识应用于实践", "平衡理性与感性", "知识共享"]
        }
      }
    },
    "忌": {
      career: {
        content: {
          mainText: "紫微化忌在事业方面可能带来一定的挑战和阻碍，特别是在权力结构中的冲突。您可能面临职场政治或权威挑战，需要谨慎处理人际关系。",
          positivePoints: ["克服困难能力强", "危机处理能力好", "逆境中成长"],
          cautionPoints: ["职场关系复杂", "可能遭遇权力斗争"]
        },
        details: {
          suitableCareers: ["独立工作", "创业", "咨询顾问"],
          financialOutlook: "波动较大，需谨慎理财"
        }
      },
      relationships: {
        content: {
          mainText: "紫微化忌在人际关系中可能带来复杂性和挑战。您可能在人际交往中感到一定压力，特别是与权威人物的关系，家庭关系中可能需要处理冲突。",
          positivePoints: ["深度关系", "理解人性", "处理复杂关系有经验"],
          cautionPoints: ["人际冲突较多", "可能情绪化"]
        },
        details: {
          relationshipStyle: ["复杂", "敏感", "深度"],
          compatibleSigns: ["太阳", "天机", "巨门"]
        }
      },
      health: {
        content: {
          mainText: "紫微化忌对健康可能带来一些挑战，需要特别关注压力引起的问题。情绪波动可能影响身体健康，建议加强心理调适和压力管理。",
          positivePoints: ["意志力强", "恢复能力佳", "对健康问题敏感"],
          cautionPoints: ["压力较大", "情绪波动影响健康"]
        },
        details: {
          strengths: ["意志力", "危机应对能力"],
          areasOfAttention: ["心理健康", "情绪相关疾病"]
        }
      },
      lifePurpose: {
        content: {
          mainText: "紫微化忌的人生道路可能充满挑战，但这些挑战往往成为重要的成长契机。您的人生目标可能与克服困难、追求内在成长或帮助他人度过难关相关。",
          positivePoints: ["深刻的人生理解", "哲学思考", "内在成长"],
          cautionPoints: ["人生道路曲折", "需要坚韧意志"]
        },
        details: {
          naturalTalents: ["危机处理", "心理洞察", "自我反思"],
          lifeLessons: ["接受挑战", "转化困难为成长", "内在平和"]
        }
      }
    }
  },
  "天机": {
    "祿": {
      career: {
        content: {
          mainText: "天机化禄展现出在创新、策略和分析领域的才能。您适合从事需要快速思考和创新的工作，财务上有稳定增长的潜力，特别是通过智力工作。",
          positivePoints: ["思维敏捷", "创新能力强", "策略规划出色"],
          cautionPoints: ["可能过于理论", "需加强执行力"]
        },
        details: {
          suitableCareers: ["技术", "金融分析", "战略规划"],
          financialOutlook: "稳定且有创新性增长"
        }
      },
      relationships: {
        content: {
          mainText: "天机化禄影响人际关系，使您在交往中展现出智慧和机智。沟通能力强，但可能偏向理性而非情感，家庭关系需要更多情感投入。",
          positivePoints: ["沟通清晰", "思想交流深入", "解决问题能力强"],
          cautionPoints: ["可能缺乏情感表达", "过于分析化"]
        },
        details: {
          relationshipStyle: ["理智", "善于沟通", "灵活"],
          compatibleSigns: ["紫微", "太阴", "天同"]
        }
      },
      health: {
        content: {
          mainText: "天机化禄对健康的影响表现为理性管理健康的能力，但精神压力可能较大。需要特别关注神经系统健康，平衡工作与休息。",
          positivePoints: ["健康管理理性", "对身体信号敏感", "适应能力强"],
          cautionPoints: ["精神压力大", "可能失眠"]
        },
        details: {
          strengths: ["神经系统灵敏", "适应环境能力强"],
          areasOfAttention: ["神经紧张", "睡眠质量"]
        }
      },
      lifePurpose: {
        content: {
          mainText: "天机化禄的人生目标往往与智慧追求、知识创新或思想传播相关。您可能在信息、通讯或教育领域找到满足感，追求思想自由和创新。",
          positivePoints: ["思想创新", "追求知识", "分析能力强"],
          cautionPoints: ["可能过于理想化", "需加强实践"]
        },
        details: {
          naturalTalents: ["分析能力", "创新思维", "沟通表达"],
          lifeLessons: ["平衡思考与行动", "情感发展", "实践智慧"]
        }
      }
    },
    "權": {
      career: {
        content: {
          mainText: "天机化权在事业上展现出在决策、战略规划和信息控制方面的才能。您可能在需要快速决策和战略思维的领域表现出色，但需警惕信息垄断倾向。",
          positivePoints: ["决策能力强", "战略眼光好", "信息处理能力出色"],
          cautionPoints: ["可能独断", "需更多听取意见"]
        },
        details: {
          suitableCareers: ["战略规划", "信息技术", "咨询顾问"],
          financialOutlook: "通过信息和决策优势获得财富"
        }
      },
      relationships: {
        content: {
          mainText: "天机化权在人际关系中表现为主导性的思想和意见领袖角色。您在关系中可能扮演决策者和思想引导者，但需要培养倾听的能力。",
          positivePoints: ["思想领导力", "关系中有主见", "决策清晰"],
          cautionPoints: ["可能忽略他人感受", "需要更多包容"]
        },
        details: {
          relationshipStyle: ["主导思想", "理性", "直接"],
          compatibleSigns: ["武曲", "贪狼", "破军"]
        }
      },
      health: {
        content: {
          mainText: "天机化权对健康的影响主要在于心理和神经系统。精神压力可能较大，需要特别关注精神健康和放松技巧，避免过度紧张导致的问题。",
          positivePoints: ["精神集中力强", "适应压力能力好", "自我调节能力"],
          cautionPoints: ["神经紧张风险高", "需要放松技巧"]
        },
        details: {
          strengths: ["精神专注力", "意志力"],
          areasOfAttention: ["神经系统", "过度思考导致的问题"]
        }
      },
      lifePurpose: {
        content: {
          mainText: "天机化权的人生目标往往与思想影响力、决策权或信息控制相关。您可能追求在思想、技术或策略领域建立权威地位，影响他人决策。",
          positivePoints: ["思想影响力", "战略规划能力", "领导思维"],
          cautionPoints: ["可能过于执着于控制", "需要开放思想"]
        },
        details: {
          naturalTalents: ["战略思考", "信息分析", "决策能力"],
          lifeLessons: ["聆听多元观点", "分享知识", "思想开放"]
        }
      }
    },
    "科": {
      career: {
        content: {
          mainText: "天机化科在事业上展现出学术研究、科技创新和分析领域的才能。您适合从事需要精确分析和创新思维的工作，财务上稳定增长。",
          positivePoints: ["研究能力强", "创新思维", "分析精确"],
          cautionPoints: ["可能过于学术化", "实用性需加强"]
        },
        details: {
          suitableCareers: ["研究", "技术开发", "数据分析"],
          financialOutlook: "通过专业知识和创新获得稳定收入"
        }
      },
      relationships: {
        content: {
          mainText: "天机化科在人际关系中表现为理性、客观，注重思想交流。您的关系可能建立在共同的知识兴趣和思想交流基础上，情感表达可能需要加强。",
          positivePoints: ["思想交流深入", "理性沟通", "问题解决能力强"],
          cautionPoints: ["情感表达不足", "可能显得疏远"]
        },
        details: {
          relationshipStyle: ["理性", "思想为重", "知识共享"],
          compatibleSigns: ["文曲", "文昌", "左辅"]
        }
      },
      health: {
        content: {
          mainText: "天机化科对健康的影响主要表现在理性规划健康方面。您可能有系统化管理健康的能力，但需要注意过度思考带来的精神压力。",
          positivePoints: ["健康管理系统化", "预防意识强", "适应能力好"],
          cautionPoints: ["精神压力", "过度分析"]
        },
        details: {
          strengths: ["神经系统", "自我调节能力"],
          areasOfAttention: ["精神压力", "过度思考导致的问题"]
        }
      },
      lifePurpose: {
        content: {
          mainText: "天机化科的人生目标往往与知识追求、学术成就或技术创新相关。您可能致力于某个领域的研究或技术发展，通过创新和知识传播实现人生价值。",
          positivePoints: ["追求真知", "创新精神", "学术热情"],
          cautionPoints: ["可能过于理论化", "需平衡知识与应用"]
        },
        details: {
          naturalTalents: ["研究能力", "创新思维", "系统分析"],
          lifeLessons: ["知识实际应用", "平衡理论与实践", "思想分享"]
        }
      }
    },
    "忌": {
      career: {
        content: {
          mainText: "天机化忌在事业上可能带来决策困难、信息混乱或计划变动的挑战。您可能面临信息过载或决策障碍，需要培养灵活应对变化的能力。",
          positivePoints: ["应变能力", "多角度思考", "危机处理能力"],
          cautionPoints: ["决策困难", "计划易变", "信息混乱"]
        },
        details: {
          suitableCareers: ["风险管理", "危机处理", "变革管理"],
          financialOutlook: "波动较大，需加强风险管理"
        }
      },
      relationships: {
        content: {
          mainText: "天机化忌在人际关系中可能带来沟通障碍、误解或关系变动。您的人际关系可能较为复杂，需要特别注意沟通清晰度和避免过度分析。",
          positivePoints: ["理解复杂关系", "洞察力强", "适应变化"],
          cautionPoints: ["沟通障碍", "可能多疑", "关系不稳定"]
        },
        details: {
          relationshipStyle: ["复杂", "变化多", "分析型"],
          compatibleSigns: ["天梁", "太阳", "紫微"]
        }
      },
      health: {
        content: {
          mainText: "天机化忌对健康的影响主要表现在神经系统和精神健康方面。您可能面临压力、焦虑或睡眠问题，需要特别关注心理健康和放松技巧。",
          positivePoints: ["对健康问题敏感", "自我调节意识", "适应能力"],
          cautionPoints: ["神经紧张", "思虑过度", "睡眠质量差"]
        },
        details: {
          strengths: ["对健康问题的敏感度", "自我调整能力"],
          areasOfAttention: ["神经系统", "睡眠质量", "精神健康"]
        }
      },
      lifePurpose: {
        content: {
          mainText: "天机化忌的人生道路可能充满变化和思想上的挑战。您的人生目标可能与克服思维障碍、探索未知领域或帮助他人解决复杂问题相关。",
          positivePoints: ["思想深度", "面对挑战的能力", "创造性思维"],
          cautionPoints: ["人生方向变化多", "需要坚定信念"],
          
        },
        details: {
          naturalTalents: ["复杂问题处理", "适应变化", "深度思考"],
          lifeLessons: ["保持方向感", "减少过度思考", "接受不确定性"]
        }
      }
    }
  },
"天同": {
  "祿": {
    career: {
      content: {
        mainText: "天同化禄象征职场中的人际融洽与合作顺利。您在和谐的环境中更能发挥所长，适合参与团队合作与公共服务领域。",
        positivePoints: ["人际关系佳", "合作能力强", "职场气氛良好"],
        cautionPoints: ["依赖团队", "需增强独立性"]
      },
      details: {
        suitableCareers: ["人力资源", "社会服务", "教育培训"],
        financialOutlook: "收入稳定，财富积累缓慢但稳健"
      }
    },
    relationships: {
      content: {
        mainText: "天同化禄在人际关系中带来温和、包容的特质。您容易与人建立深厚情感，家庭和恋爱关系中多有温馨与体贴。",
        positivePoints: ["温柔体贴", "感情稳定", "家庭幸福"],
        cautionPoints: ["可能过于依赖", "需要界限感"]
      },
      details: {
        relationshipStyle: ["温柔", "体贴", "亲和"],
        compatibleSigns: ["太阴", "天机", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "天同化禄有助于身心平衡，通常健康状况较好。但需注意因情绪波动引发的心理问题，适度运动和情绪管理有助于健康提升。",
        positivePoints: ["身心和谐", "恢复力好", "抗病力强"],
        cautionPoints: ["情绪影响健康", "需避免忧虑过度"]
      },
      details: {
        strengths: ["免疫系统", "新陈代谢良好"],
        areasOfAttention: ["情绪稳定", "内分泌系统"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天同化禄象征一种平和与关怀的人生使命。您追求人际和谐与心灵安定，适合在服务型或助人型领域找到人生价值。",
        positivePoints: ["心地善良", "助人为乐", "追求和谐"],
        cautionPoints: ["理想主义", "现实感需加强"]
      },
      details: {
        naturalTalents: ["同理心", "照顾他人", "创造和谐氛围"],
        lifeLessons: ["保持界限感", "增强现实应对力", "平衡给予与自我"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "天同化权可能使您在看似温和的外表下展现出强烈的控制欲和主导意识。您适合从事需协调人际又能主导方向的职业，例如项目管理或公共行政。",
        positivePoints: ["擅长协调", "隐性领导力强", "工作氛围好"],
        cautionPoints: ["可能掩盖真实想法", "需明确表达立场"]
      },
      details: {
        suitableCareers: ["项目管理", "非营利组织", "行政协调"],
        financialOutlook: "通过合作与组织能力实现财富积累"
      }
    },
    relationships: {
      content: {
        mainText: "天同化权在人际关系中表现为情感主导和暗中影响力。您擅长以温和方式主导关系，需避免操控他人情绪。",
        positivePoints: ["情感掌控力强", "擅长安抚他人", "关系稳定"],
        cautionPoints: ["情绪依赖", "需注意尊重他人自由"]
      },
      details: {
        relationshipStyle: ["温和主导", "情绪稳定", "包容"],
        compatibleSigns: ["太阴", "天梁", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "天同化权可能带来情绪压抑引起的慢性健康问题。建议通过释放压力、规律作息和情绪管理来维护健康。",
        positivePoints: ["恢复力强", "内在调节力佳"],
        cautionPoints: ["情绪压抑", "需防止慢性疲劳"]
      },
      details: {
        strengths: ["恢复速度快", "抗压能力"],
        areasOfAttention: ["肝脏功能", "慢性压力"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天同化权的人生目标在于以温和方式掌控环境并促进和谐发展。适合成为组织的隐性推动者或情感领袖。",
        positivePoints: ["推动和谐", "情绪智商高", "稳定影响力"],
        cautionPoints: ["过于软性管理", "需培养明确目标感"]
      },
      details: {
        naturalTalents: ["协调人心", "稳定情绪", "团体整合能力"],
        lifeLessons: ["表达真实意图", "勇于承担主导责任", "信任他人能力"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "天同化科使您在职场中展现温文儒雅与知识型人格，适合教育、文化或心理相关职业，强调人文关怀与智力贡献。",
        positivePoints: ["适应力强", "知识丰富", "气质温和"],
        cautionPoints: ["行动力稍弱", "容易优柔寡断"]
      },
      details: {
        suitableCareers: ["心理咨询", "教育培训", "文化创作"],
        financialOutlook: "收入稳定，依赖知识技能积累"
      }
    },
    relationships: {
      content: {
        mainText: "天同化科在关系中展现出温和的理性与理解力，擅长以理性角度处理情感问题，适合建立安稳而持久的伴侣关系。",
        positivePoints: ["沟通柔和", "情感稳定", "理解力强"],
        cautionPoints: ["过于理性", "缺乏激情"]
      },
      details: {
        relationshipStyle: ["理解型", "平和", "重情重义"],
        compatibleSigns: ["文昌", "太阴", "天机"]
      }
    },
    health: {
      content: {
        mainText: "天同化科有利于身体与心理的整体协调，您较擅长通过生活规律和知识管理健康，但需注意避免忧思过重。",
        positivePoints: ["健康意识强", "生活规律", "情绪稳定"],
        cautionPoints: ["易有心理压力", "忧虑体质"]
      },
      details: {
        strengths: ["内分泌系统", "心理弹性"],
        areasOfAttention: ["神经系统", "消化系统"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天同化科象征以关怀与智慧推动社会温和改变。您可能在人文、心理、教育领域找到价值感。",
        positivePoints: ["智慧与慈悲兼具", "学习与传播", "鼓舞他人"],
        cautionPoints: ["不够果断", "现实感不足"]
      },
      details: {
        naturalTalents: ["心理分析", "教育指导", "文化表达"],
        lifeLessons: ["增强果断力", "兼顾现实与理想", "情感与知识平衡"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "天同化忌在职场上可能引发情绪困扰或合作关系失衡。适合从事较为独立的工作，避免依赖他人或被动等待。",
        positivePoints: ["情感细腻", "察觉他人需求"],
        cautionPoints: ["依赖性强", "情绪影响判断"]
      },
      details: {
        suitableCareers: ["独立创作", "心理辅导", "自由职业"],
        financialOutlook: "收入波动大，受情绪状态影响明显"
      }
    },
    relationships: {
      content: {
        mainText: "天同化忌在关系中带来情绪敏感、依赖性高的特质。容易因情绪波动导致亲密关系紧张，需建立健康的依附模式。",
        positivePoints: ["情感深刻", "重视关系"],
        cautionPoints: ["情绪依赖", "自我感不足"]
      },
      details: {
        relationshipStyle: ["情绪化", "依赖型", "深度连接"],
        compatibleSigns: ["太阴", "天机", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "天同化忌易带来因压抑情绪或过度敏感而导致的身心问题。建议进行心理调适与情绪释放练习。",
        positivePoints: ["敏感察觉身体反应", "恢复速度快"],
        cautionPoints: ["心理问题累积", "内分泌失调"]
      },
      details: {
        strengths: ["感知力", "调节能力"],
        areasOfAttention: ["情绪平衡", "压力相关疾病"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天同化忌代表通过情感挑战与内在困惑，走向自我理解与成长。您的使命在于学习如何照顾自己情绪，并建立健康界限。",
        positivePoints: ["深度同理心", "情绪成长"],
        cautionPoints: ["过度牺牲", "情绪捆绑关系"]
      },
      details: {
        naturalTalents: ["情感理解", "深度共鸣", "照顾他人"],
        lifeLessons: ["照顾自己", "建立边界", "放下依附"]
      }
    }
  }
},
"天梁": {
  "祿": {
    career: {
      content: {
        mainText: "天梁化禄象征智慧与责任感并重的职业路径，您在需要判断力、道德感及服务精神的领域中表现尤为突出。",
        positivePoints: ["判断清晰", "责任心强", "适合公众事务"],
        cautionPoints: ["过于理想主义", "容易担责过多"]
      },
      details: {
        suitableCareers: ["司法", "教育", "社会服务"],
        financialOutlook: "凭借正直与能力获得稳定收入"
      }
    },
    relationships: {
      content: {
        mainText: "天梁化禄在关系中展现成熟可靠的一面，您在家庭中常是倾听者与决策者，亲密关系以稳定与信任为基础。",
        positivePoints: ["成熟稳重", "值得信赖", "家庭观念强"],
        cautionPoints: ["可能显得严肃", "不易表达情感"]
      },
      details: {
        relationshipStyle: ["理智型", "责任型", "稳定"],
        compatibleSigns: ["紫微", "天同", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "天梁化禄有助于形成良好的生活习惯和健康观念，但需避免为他人操心过度而影响自身健康。",
        positivePoints: ["健康意识强", "生活规律", "耐力佳"],
        cautionPoints: ["压力易累积", "需注意慢性疲劳"]
      },
      details: {
        strengths: ["免疫系统强", "恢复能力佳"],
        areasOfAttention: ["神经系统", "肠胃消化"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天梁化禄体现助人为乐与正义精神，您的人生使命可能在于引导他人、传授智慧或承担社会责任。",
        positivePoints: ["正义感强", "助人精神", "智者角色"],
        cautionPoints: ["易陷过度牺牲", "需平衡自我与他人"]
      },
      details: {
        naturalTalents: ["判断力", "道德责任感", "智性表达"],
        lifeLessons: ["自我照顾", "拒绝内疚感", "适度承担"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "天梁化权赋予您极强的道德领导力和判断影响力，您在职场上不仅是决策者，也是道义标准的制定者。",
        positivePoints: ["道义感强", "公正果断", "能服众"],
        cautionPoints: ["可能显得固执", "对错误难以宽容"]
      },
      details: {
        suitableCareers: ["司法官员", "政府顾问", "伦理管理"],
        financialOutlook: "因正直与权威赢得收入与尊重"
      }
    },
    relationships: {
      content: {
        mainText: "天梁化权使您在关系中具有引导与教育性质，您追求高质量的人际关系，但需避免过度批判或教导他人。",
        positivePoints: ["富有责任感", "能为对方带来成长", "关系稳定"],
        cautionPoints: ["批评性强", "情感表达有限"]
      },
      details: {
        relationshipStyle: ["引导型", "成熟", "严谨"],
        compatibleSigns: ["武曲", "天机", "太阴"]
      }
    },
    health: {
      content: {
        mainText: "天梁化权可能因长期责任感重而累积压力，容易引发消化系统与神经系统相关疾病，需学会放松。",
        positivePoints: ["耐力佳", "健康理念清晰"],
        cautionPoints: ["压力难释放", "需避免过度操劳"]
      },
      details: {
        strengths: ["体力", "责任推动健康管理"],
        areasOfAttention: ["胃肠道", "神经疲劳"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天梁化权意味着用智慧与公正影响他人和社会。您的人生目标往往是成为引领者、道义楷模或制度建设者。",
        positivePoints: ["愿意承担责任", "信念坚定", "以身作则"],
        cautionPoints: ["可能自我要求过高", "较难接受失败"]
      },
      details: {
        naturalTalents: ["道德权威", "组织管理", "教育引导"],
        lifeLessons: ["自我接纳", "适度宽容", "放下控制欲"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "天梁化科擅长调和、教育与传播智慧，您适合成为教师、心理专家或顾问，专注于知识与伦理传承。",
        positivePoints: ["智慧沉稳", "道德影响力", "教育能力强"],
        cautionPoints: ["较为保守", "需增强创新意识"]
      },
      details: {
        suitableCareers: ["教育", "心理辅导", "伦理顾问"],
        financialOutlook: "收入平稳，适合长期发展"
      }
    },
    relationships: {
      content: {
        mainText: "天梁化科带来清晰的人际边界和理性表达情感的能力。您在关系中倾向提供指导与支持，但需避免情感疏离。",
        positivePoints: ["理性清晰", "稳定信任", "给予支持"],
        cautionPoints: ["表达不够热情", "易显得疏远"]
      },
      details: {
        relationshipStyle: ["指导型", "理性", "尊重感强"],
        compatibleSigns: ["文曲", "天同", "紫微"]
      }
    },
    health: {
      content: {
        mainText: "天梁化科具备良好的健康认知与自律能力。适合系统性养生，但精神层面的焦虑需管理得当。",
        positivePoints: ["自律性强", "健康理念好"],
        cautionPoints: ["精神紧张", "易有心理压力"]
      },
      details: {
        strengths: ["免疫系统", "思维逻辑与节制"],
        areasOfAttention: ["焦虑", "神经系统"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天梁化科代表传递智慧与守护伦理价值。您的人生使命是帮助他人建立正确观念，引导他们走向平衡与成熟。",
        positivePoints: ["道德感强", "教育者角色", "人生阅历深"],
        cautionPoints: ["可能教条主义", "需尊重差异"]
      },
      details: {
        naturalTalents: ["教育能力", "智慧传承", "伦理判断"],
        lifeLessons: ["包容不同观念", "保持开放心态", "用智慧服务他人"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "天梁化忌可能导致您在职场中背负过多责任或陷入道义冲突。需注意自我设限与过度理想化造成的职场瓶颈。",
        positivePoints: ["责任感强", "公正意识"],
        cautionPoints: ["自我要求过高", "理想与现实冲突"]
      },
      details: {
        suitableCareers: ["伦理顾问", "教育工作", "社会组织"],
        financialOutlook: "进展缓慢，易因理想冲突而波动"
      }
    },
    relationships: {
      content: {
        mainText: "天梁化忌可能让您在人际关系中过度保护或担责，引发误解或孤立感。建议学会信任他人，适度放下控制。",
        positivePoints: ["可靠稳重", "善于分析关系问题"],
        cautionPoints: ["孤立感强", "过度担心他人"]
      },
      details: {
        relationshipStyle: ["责任型", "保护型", "理性"],
        compatibleSigns: ["天同", "天机", "太阴"]
      }
    },
    health: {
      content: {
        mainText: "天梁化忌影响健康多表现为慢性压力或道义焦虑。需调整自我要求，增强休息与放松能力。",
        positivePoints: ["耐力佳", "健康知识强"],
        cautionPoints: ["慢性疲劳", "心理负担重"]
      },
      details: {
        strengths: ["节制力", "健康管理知识"],
        areasOfAttention: ["肠胃系统", "心理负担"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天梁化忌代表经由责任与挫折领悟真正的智慧。您的人生目标可能涉及帮助他人通过苦难或建立真实的价值观。",
        positivePoints: ["人生感悟深", "引导他人成长"],
        cautionPoints: ["容易自我牺牲", "信任问题"],
      },
      details: {
        naturalTalents: ["指导他人", "深度反思", "忍耐力"],
        lifeLessons: ["放下救世心态", "学会放松", "建立平衡人生观"]
      }
    }
  }
},
"天相": {
  "祿": {
    career: {
      content: {
        mainText: "天相化禄在职场上展现出良好的人缘与协调能力，适合担任协作、调解与行政管理的角色，是团队中不可或缺的润滑剂。",
        positivePoints: ["协调能力强", "受欢迎", "适合团队合作"],
        cautionPoints: ["缺乏独立主见", "过度迎合他人"]
      },
      details: {
        suitableCareers: ["行政管理", "人力资源", "公共关系"],
        financialOutlook: "稳定收入，适合靠人脉与合作创造财富"
      }
    },
    relationships: {
      content: {
        mainText: "天相化禄在关系中表现为亲切、善解人意，擅长处理矛盾和维持和谐气氛，适合建立稳定、平等的伴侣关系。",
        positivePoints: ["善于沟通", "关系和谐", "重视公平"],
        cautionPoints: ["容易妥协过头", "缺乏界限感"]
      },
      details: {
        relationshipStyle: ["和谐型", "合作型", "有亲和力"],
        compatibleSigns: ["天梁", "太阴", "文曲"]
      }
    },
    health: {
      content: {
        mainText: "天相化禄有助于形成良好的生活节律与身体平衡状态，但需注意因过于配合他人而忽略自身需求。",
        positivePoints: ["生活规律", "身体调和", "恢复力强"],
        cautionPoints: ["忽视自我需求", "压力积压"]
      },
      details: {
        strengths: ["免疫系统", "身体平衡性"],
        areasOfAttention: ["肠胃功能", "压力相关疾病"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天相化禄的人生目标多与协作、服务他人及维护社会公正相关，您在平衡冲突、建立共识方面具备独特天赋。",
        positivePoints: ["重视公平", "追求平衡", "乐于助人"],
        cautionPoints: ["目标不够明确", "需培养主见"]
      },
      details: {
        naturalTalents: ["调解能力", "合作精神", "组织协调"],
        lifeLessons: ["坚持自我立场", "学会设定界限", "明确人生方向"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "天相化权赋予您行政与协调上的权力，擅长在多方关系中做出裁决，适合担任决策支持者或高层幕僚角色。",
        positivePoints: ["权威稳重", "判断平衡", "组织力强"],
        cautionPoints: ["优柔寡断", "难以坚持立场"]
      },
      details: {
        suitableCareers: ["高层行政", "策略顾问", "协调专员"],
        financialOutlook: "靠管理与协调能力赢得收入与地位"
      }
    },
    relationships: {
      content: {
        mainText: "天相化权在关系中表现为内敛而有主导力，您在亲密关系中常扮演顾问或仲裁角色，但需避免控制欲带来的压迫感。",
        positivePoints: ["理智主导", "善于引导他人", "公平公正"],
        cautionPoints: ["过于理性", "不易表达情感"]
      },
      details: {
        relationshipStyle: ["理性型", "引导型", "支持性强"],
        compatibleSigns: ["天机", "武曲", "太阴"]
      }
    },
    health: {
      content: {
        mainText: "天相化权带来良好的自律能力，有助于健康维护。适合系统性养生，但精神压力下容易出现循环系统或内分泌失调。",
        positivePoints: ["有健康自律性", "调节能力佳"],
        cautionPoints: ["压力相关疾病", "循环系统需关注"]
      },
      details: {
        strengths: ["心肺功能", "健康执行力"],
        areasOfAttention: ["血压", "压力相关疾病"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天相化权的人生目标倾向于在社会结构中扮演平衡与协调的重要角色，擅长在对立中寻求共识与秩序。",
        positivePoints: ["社会影响力", "调和冲突", "谋求公正"],
        cautionPoints: ["优柔寡断", "缺乏主见"]
      },
      details: {
        naturalTalents: ["平衡判断", "权力中枢协调", "关系修复力"],
        lifeLessons: ["坚定立场", "避免犹豫拖延", "学会决断"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "天相化科擅长在专业领域中以优雅与协调的方式达成目标，特别适合制度设计、法律、公关等需要平衡与审慎判断的职业。",
        positivePoints: ["专业性强", "注重细节", "善于平衡"],
        cautionPoints: ["效率稍低", "过度依赖程序"]
      },
      details: {
        suitableCareers: ["法务", "审计", "制度顾问"],
        financialOutlook: "凭专业稳定收入，节奏平缓"
      }
    },
    relationships: {
      content: {
        mainText: "天相化科在关系中表现出优雅理智的气质，重视相互理解和尊重，是值得信赖的伴侣，但可能缺乏激情与直接表达。",
        positivePoints: ["注重沟通", "关系稳固", "尊重对方"],
        cautionPoints: ["表达保守", "情感温度低"]
      },
      details: {
        relationshipStyle: ["理性型", "尊重型", "平等互助"],
        compatibleSigns: ["文昌", "天梁", "太阴"]
      }
    },
    health: {
      content: {
        mainText: "天相化科对健康的态度理性谨慎，擅长通过规律作息与分析管理身体，但需注意对身体状况过于担忧。",
        positivePoints: ["养生意识好", "计划性强"],
        cautionPoints: ["疑病倾向", "过于谨慎"]
      },
      details: {
        strengths: ["免疫系统", "身体调节能力"],
        areasOfAttention: ["神经系统", "肠胃道"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天相化科的人生目标在于透过制度与规范推动社会平衡，您擅长制定规则并维持和谐，是和平建设者的典范。",
        positivePoints: ["注重规则", "制度建设能力强", "平衡思维"],
        cautionPoints: ["缺乏突破性", "易陷繁文缛节"]
      },
      details: {
        naturalTalents: ["制度化思维", "法律与秩序感", "规则设计"],
        lifeLessons: ["放宽规范限制", "接纳多元可能", "勇于创新"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "天相化忌在职场上可能面临过度依赖他人意见、难以决断的问题，建议建立明确立场，避免陷入“老好人”困境。",
        positivePoints: ["善于协调", "关系处理能力佳"],
        cautionPoints: ["缺乏主见", "优柔寡断"]
      },
      details: {
        suitableCareers: ["协助型职务", "中层管理", "后勤协调"],
        financialOutlook: "收入受他人影响大，起伏较多"
      }
    },
    relationships: {
      content: {
        mainText: "天相化忌容易在关系中过于迁就他人，导致内在压抑和情绪消耗。建立自我价值感并设立清晰界限是关键。",
        positivePoints: ["愿意付出", "维系关系努力"],
        cautionPoints: ["情感压抑", "自我否定"]
      },
      details: {
        relationshipStyle: ["迁就型", "配合型", "低自我需求"],
        compatibleSigns: ["天同", "太阴", "文曲"]
      }
    },
    health: {
      content: {
        mainText: "天相化忌可能因长期压抑自我情绪与需求而影响健康，常见于焦虑、消化不良等问题。",
        positivePoints: ["适应力佳", "注意健康"],
        cautionPoints: ["心理压抑", "脾胃功能弱"]
      },
      details: {
        strengths: ["免疫系统", "心理敏感度高"],
        areasOfAttention: ["脾胃", "神经系统", "情绪压抑"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天相化忌的人生目标可能在于学会从他人期待中解放出来，建立真实的自我价值体系。",
        positivePoints: ["学习成长", "理解人性"],
        cautionPoints: ["受他人影响大", "难以拒绝"]
      },
      details: {
        naturalTalents: ["人际洞察", "协商能力", "心理共鸣"],
        lifeLessons: ["建立自我界限", "勇敢表达立场", "活出本心"]
      }
    }
  }
},
"太阴": {
  "祿": {
    career: {
      content: {
        mainText: "太阴化禄象征安定与细腻的财富积累方式，适合在金融、收藏、服务业等细致领域发展，擅长理财与稳健经营。",
        positivePoints: ["理财能力强", "适合长期积累", "工作细致稳重"],
        cautionPoints: ["较保守", "变通能力需提升"]
      },
      details: {
        suitableCareers: ["金融理财", "艺术收藏", "服务行业"],
        financialOutlook: "稳步增长，适合长期积累"
      }
    },
    relationships: {
      content: {
        mainText: "太阴化禄在情感关系中带来温柔体贴的特质，重视家庭与安全感，适合建立稳定、深情的伴侣关系。",
        positivePoints: ["温柔体贴", "情感细腻", "重视家庭"],
        cautionPoints: ["依赖情绪", "容易多愁善感"]
      },
      details: {
        relationshipStyle: ["体贴型", "温和", "照顾他人"],
        compatibleSigns: ["天同", "天机", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "太阴化禄有助于身体循环与内分泌平衡，但需注意情绪波动带来的生理反应，保持情绪稳定至关重要。",
        positivePoints: ["身体协调性好", "康复力强"],
        cautionPoints: ["易受情绪影响", "需重视心理健康"]
      },
      details: {
        strengths: ["内分泌系统", "循环系统"],
        areasOfAttention: ["消化系统", "情绪波动"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "太阴化禄象征内在的安定追求与关怀精神，您的人生目标往往与保护、滋养他人及营造安全感有关。",
        positivePoints: ["富有同情心", "注重情感支持", "致力于建立安稳生活"],
        cautionPoints: ["情绪牵绊", "害怕变化"]
      },
      details: {
        naturalTalents: ["照顾他人", "营造安定环境", "感受力强"],
        lifeLessons: ["学会情绪独立", "勇敢面对改变", "平衡给予与自我"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "太阴化权在职场中展现出柔中带刚的领导力，适合担任幕后规划、组织协调或资源整合的职务。",
        positivePoints: ["擅长规划", "控制力细腻", "有战略眼光"],
        cautionPoints: ["控制欲潜藏", "不易接受批评"]
      },
      details: {
        suitableCareers: ["行政管理", "资源整合", "家庭事业经营"],
        financialOutlook: "通过稳健管理获得长期利益"
      }
    },
    relationships: {
      content: {
        mainText: "太阴化权在关系中展现出保护与主导欲，常照顾他人情绪但也可能形成情感上的依附关系或隐性控制。",
        positivePoints: ["情感投入深", "有责任感", "安全感强"],
        cautionPoints: ["情绪掌控欲强", "难以放手"]
      },
      details: {
        relationshipStyle: ["保护型", "照顾型", "有安全感"],
        compatibleSigns: ["紫微", "天相", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "太阴化权可能因责任感重而积压压力，容易影响内分泌或女性健康，需重视休息与内在调节。",
        positivePoints: ["健康管理意识强", "恢复力好"],
        cautionPoints: ["内压较大", "容易积郁"]
      },
      details: {
        strengths: ["恢复速度快", "调节力强"],
        areasOfAttention: ["内分泌系统", "子宫或乳腺健康（女性）"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "太阴化权的人生目标往往在于通过稳定环境与情感支持来影响他人，是家庭、团队中坚实的支柱。",
        positivePoints: ["默默奉献", "稳定力量", "保护他人"],
        cautionPoints: ["不易表达需求", "情绪压抑"]
      },
      details: {
        naturalTalents: ["家庭守护", "情绪理解", "安全建设"],
        lifeLessons: ["释放情绪压力", "平衡控制与放手", "表达真实感受"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "太阴化科代表智慧与细腻兼具，适合学术研究、心理辅导、艺术设计等需要情感与美感结合的职业。",
        positivePoints: ["学术能力佳", "敏感细致", "艺术品味好"],
        cautionPoints: ["容易钻牛角尖", "较难面对批评"]
      },
      details: {
        suitableCareers: ["心理咨询", "艺术创作", "教育"],
        financialOutlook: "稳定发展，擅长通过专业知识获利"
      }
    },
    relationships: {
      content: {
        mainText: "太阴化科在关系中强调精神交流与感情的深度理解，感性与理性交织，使您在关系中更关注内在情感。",
        positivePoints: ["理解力强", "情感深刻", "内在联系紧密"],
        cautionPoints: ["可能过于敏感", "易沉溺于幻想"]
      },
      details: {
        relationshipStyle: ["感性理性并重", "重心灵交流", "善解人意"],
        compatibleSigns: ["天同", "文曲", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "太阴化科有助于内分泌与心理系统稳定，但精神层面的敏感可能引发睡眠问题或焦虑症状。",
        positivePoints: ["身体调节性强", "关注细节健康"],
        cautionPoints: ["易失眠", "需避免思虑过度"]
      },
      details: {
        strengths: ["内分泌平衡", "免疫力稳定"],
        areasOfAttention: ["心理健康", "睡眠质量"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "太阴化科象征通过感知与智慧影响他人，您可能在人文、艺术或教育中找到深层次的满足与人生价值。",
        positivePoints: ["感知敏锐", "心灵深刻", "具有安抚力"],
        cautionPoints: ["情绪波动", "自我保护过强"]
      },
      details: {
        naturalTalents: ["艺术表达", "心理观察", "温柔智慧"],
        lifeLessons: ["开放内心", "接纳现实", "适度表达情感"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "太阴化忌在职场上可能导致过度敏感或逃避压力，需避免被情绪干扰决策，建议设定清晰目标并坚定前行。",
        positivePoints: ["情绪洞察强", "适应环境快"],
        cautionPoints: ["情绪化决策", "抗压力弱"]
      },
      details: {
        suitableCareers: ["自由职业", "心理咨询", "艺术创作"],
        financialOutlook: "收入波动大，受情绪影响强"
      }
    },
    relationships: {
      content: {
        mainText: "太阴化忌在关系中带来极强的情感依赖与不安全感，需注意建立独立的情感世界，避免情绪捆绑他人。",
        positivePoints: ["感情深刻", "重视陪伴"],
        cautionPoints: ["容易多疑", "缺乏安全感"]
      },
      details: {
        relationshipStyle: ["依赖型", "情绪化", "敏感"],
        compatibleSigns: ["天同", "天相", "巨门"]
      }
    },
    health: {
      content: {
        mainText: "太阴化忌影响健康多表现在情绪相关症状，如内分泌失调、易怒、失眠等，需关注心理调适。",
        positivePoints: ["敏锐察觉身体变化", "恢复快"],
        cautionPoints: ["情绪不稳", "内分泌紊乱"]
      },
      details: {
        strengths: ["对健康问题反应快", "调整能力"],
        areasOfAttention: ["睡眠质量", "情绪引发的疾病"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "太阴化忌代表通过内在波动与情绪挑战，成长为能够给予他人情感支持与智慧引导的人。",
        positivePoints: ["深刻情感体验", "感同身受"],
        cautionPoints: ["容易内耗", "逃避现实"]
      },
      details: {
        naturalTalents: ["深层情感共鸣", "照顾力", "创造力"],
        lifeLessons: ["走出情绪困境", "面对现实", "建立内在安全感"]
      }
    }
  }
},
"太阳": {
  "祿": {
    career: {
      content: {
        mainText: "太阳化禄象征事业上的积极与光明，适合从事公开、外向、具有领导性或传播性质的工作，能在公众面前展现才华。",
        positivePoints: ["领导能力强", "公众形象佳", "具表现力"],
        cautionPoints: ["容易过度曝光", "需防虚荣"]
      },
      details: {
        suitableCareers: ["传媒", "政治", "教育演说"],
        financialOutlook: "收入依靠表现与人气，具成长潜力"
      }
    },
    relationships: {
      content: {
        mainText: "太阳化禄带来外向、热情的情感表达，您在关系中主动给予，注重伴侣的认同与尊重。",
        positivePoints: ["热情大方", "愿意付出", "充满阳光"],
        cautionPoints: ["有时过度主导", "需尊重他人节奏"]
      },
      details: {
        relationshipStyle: ["主动型", "表达直接", "正能量强"],
        compatibleSigns: ["紫微", "天同", "天相"]
      }
    },
    health: {
      content: {
        mainText: "太阳化禄有利于阳气充足与循环系统良好，活力旺盛，但需注意因过度劳累导致的消耗。",
        positivePoints: ["精力充沛", "免疫力强"],
        cautionPoints: ["易消耗体力", "需注意过劳"]
      },
      details: {
        strengths: ["循环系统", "心脏功能"],
        areasOfAttention: ["心血管健康", "热症体质"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "太阳化禄的人生使命在于启发他人、带来正能量，常扮演带领者、导师或推动者的角色。",
        positivePoints: ["光明正大", "有使命感", "乐观积极"],
        cautionPoints: ["自我中心", "目标需务实"]
      },
      details: {
        naturalTalents: ["鼓舞他人", "领导才能", "公众表达"],
        lifeLessons: ["平衡个人与团队", "尊重多元声音", "稳定内在热情"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "太阳化权在职场中象征强大的主导力与执行力，您在权力结构中如鱼得水，适合掌握核心资源或担任关键领导岗位。",
        positivePoints: ["权威形象", "果断行动", "执行力强"],
        cautionPoints: ["控制欲强", "易与上级或下属冲突"]
      },
      details: {
        suitableCareers: ["政府高层", "企业领导", "军警单位"],
        financialOutlook: "通过权力平台获取可观财富"
      }
    },
    relationships: {
      content: {
        mainText: "太阳化权使您在关系中具有强烈主导性和保护欲，喜欢照顾对方，也期望获得尊敬与服从。",
        positivePoints: ["保护意识强", "主导而不失温暖"],
        cautionPoints: ["有支配倾向", "需倾听他人需求"]
      },
      details: {
        relationshipStyle: ["主导型", "负责型", "给予型"],
        compatibleSigns: ["太阴", "武曲", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "太阳化权可能带来体力与阳性能量过旺问题，如高血压、热性疾病等。需适当调节节奏与情绪。",
        positivePoints: ["行动力强", "阳性能量旺盛"],
        cautionPoints: ["阳热体质", "需防火气过旺"]
      },
      details: {
        strengths: ["心肺功能", "新陈代谢旺盛"],
        areasOfAttention: ["血压", "肝火旺盛"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "太阳化权象征带领大众、承担社会责任的使命，您天生具备影响他人和建立秩序的能力。",
        positivePoints: ["领导天赋", "责任感强", "富有影响力"],
        cautionPoints: ["可能专断", "过度承担他人责任"]
      },
      details: {
        naturalTalents: ["公众魅力", "掌控场面", "制度建立"],
        lifeLessons: ["谦逊领导", "授权信任", "控制欲放下"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "太阳化科适合从事传播知识、分享理念或引导大众的职业，擅长以理性表达与道德感影响他人。",
        positivePoints: ["表达力强", "教育传播能力", "注重道义"],
        cautionPoints: ["理想化倾向", "需避免说教"]
      },
      details: {
        suitableCareers: ["教育", "媒体传播", "演说培训"],
        financialOutlook: "稳定增长，取决于口碑与影响力"
      }
    },
    relationships: {
      content: {
        mainText: "太阳化科在关系中展现出正直与诚恳，重视沟通与理念一致，适合以友情为基础发展亲密关系。",
        positivePoints: ["开朗诚实", "重视交流", "道义感强"],
        cautionPoints: ["表达太理性", "热情易转冷淡"]
      },
      details: {
        relationshipStyle: ["朋友式伴侣", "理性沟通", "尊重型"],
        compatibleSigns: ["文昌", "太阴", "天机"]
      }
    },
    health: {
      content: {
        mainText: "太阳化科有助于形成良好的作息与健康观念，适合以理性方式维持身体平衡，但需防止工作热情过度。",
        positivePoints: ["生活有规律", "健康知识佳"],
        cautionPoints: ["体力透支", "需避免强迫症倾向"]
      },
      details: {
        strengths: ["身体恢复力", "理性健康观"],
        areasOfAttention: ["热症", "眼部疲劳"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "太阳化科象征以知识与理性光明照耀他人，您适合成为启发他人思想的引导者。",
        positivePoints: ["启发他人", "思想正向", "表达有力"],
        cautionPoints: ["理想化", "追求完美"]
      },
      details: {
        naturalTalents: ["演讲表达", "教育引导", "道德传播"],
        lifeLessons: ["平衡理想与现实", "容许他人不同", "温柔表达"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "太阳化忌可能带来职场压力、名誉受损或自我期待过高等问题，需避免过度自我表现与冲动决策。",
        positivePoints: ["对事业有热情", "渴望成就"],
        cautionPoints: ["容易名过其实", "过度关注他人评价"]
      },
      details: {
        suitableCareers: ["创作型工作", "自由职业", "辅助型职位"],
        financialOutlook: "波动大，易受外部舆论影响"
      }
    },
    relationships: {
      content: {
        mainText: "太阳化忌在关系中可能带来自我为中心或忽视他人需求的问题，需建立真正的共鸣与理解。",
        positivePoints: ["主动付出", "热情洋溢"],
        cautionPoints: ["忽略他人感受", "情绪起伏大"]
      },
      details: {
        relationshipStyle: ["外向型", "主导性强", "需学习平等关系"],
        compatibleSigns: ["太阴", "天同", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "太阳化忌易引发心火旺盛、情绪激烈等问题，特别需注意心血管系统与头部相关症状。",
        positivePoints: ["活动力强", "抵抗力佳"],
        cautionPoints: ["怒气积压", "火气内伤"]
      },
      details: {
        strengths: ["基础代谢强", "体温调节好"],
        areasOfAttention: ["头痛", "高血压", "眼压"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "太阳化忌的人生旅程可能经历自我认同危机，通过真实面对内心与他人互动，才能实现真正的光芒释放。",
        positivePoints: ["有领导潜力", "愿意奋斗"],
        cautionPoints: ["易陷入自我迷失", "难以接受失败"]
      },
      details: {
        naturalTalents: ["表达力", "影响力", "情感鼓舞"],
        lifeLessons: ["学会谦逊", "修炼内在力量", "真实地面对自己"]
      }
    }
  }
},
"武曲": {
  "祿": {
    career: {
      content: {
        mainText: "武曲化禄代表通过努力与务实积累财富，您适合务实型、纪律性强的行业，擅长以稳定步伐实现事业与财务成长。",
        positivePoints: ["理财能力强", "踏实可靠", "勤奋耐劳"],
        cautionPoints: ["思维保守", "过于注重物质"]
      },
      details: {
        suitableCareers: ["金融", "会计", "军警", "工程技术"],
        financialOutlook: "收入稳定，适合长期积累型理财"
      }
    },
    relationships: {
      content: {
        mainText: "武曲化禄的人在情感关系中表现为实际与稳定，重视责任与承诺，但在表达情感方面可能稍显拘谨。",
        positivePoints: ["忠诚专一", "责任感强", "值得信赖"],
        cautionPoints: ["不够浪漫", "情感表达不足"]
      },
      details: {
        relationshipStyle: ["稳重型", "务实型", "保护者"],
        compatibleSigns: ["太阴", "天相", "天机"]
      }
    },
    health: {
      content: {
        mainText: "武曲化禄有利于强化体质与行动力，健康状况稳定，但需注意因过劳导致的肌肉与关节问题。",
        positivePoints: ["体力充沛", "健康基础良好"],
        cautionPoints: ["过劳体质", "需注意运动方式"]
      },
      details: {
        strengths: ["肌肉系统", "骨骼发达"],
        areasOfAttention: ["腰背健康", "过度运动造成的损伤"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "武曲化禄象征通过务实、坚持实现稳定人生目标，您的人生价值来自脚踏实地的累积与守成。",
        positivePoints: ["目标明确", "耐心强", "结果导向"],
        cautionPoints: ["缺乏弹性", "过度执着于物质成就"]
      },
      details: {
        naturalTalents: ["组织执行", "稳健财务管理", "纪律行动"],
        lifeLessons: ["平衡物质与精神", "释放控制欲", "适应变化"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "武曲化权带来强烈的执行力与领导欲，适合担任决策者、项目管理者，擅长掌控资源与推动计划。",
        positivePoints: ["果断有力", "执行能力强", "管理能力佳"],
        cautionPoints: ["控制欲强", "易与上司或同事冲突"]
      },
      details: {
        suitableCareers: ["高层管理", "军警", "营运总监"],
        financialOutlook: "靠权力位置与决策影响力创造收入"
      }
    },
    relationships: {
      content: {
        mainText: "武曲化权在感情中展现出主导与保护欲，喜欢掌控关系的节奏，适合与能理解其强势性格的对象相处。",
        positivePoints: ["责任感强", "保护力强", "直接果断"],
        cautionPoints: ["情感表达不足", "强势易压迫"]
      },
      details: {
        relationshipStyle: ["主导型", "可靠型", "行动导向"],
        compatibleSigns: ["太阳", "天梁", "贪狼"]
      }
    },
    health: {
      content: {
        mainText: "武曲化权有助于体能提升与精神意志力，但因压力过大易引发头痛、血压波动等状况。",
        positivePoints: ["意志坚定", "恢复力强"],
        cautionPoints: ["情绪紧绷", "压力型体质"]
      },
      details: {
        strengths: ["肌肉力量", "骨骼系统"],
        areasOfAttention: ["血压", "情绪压力"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "武曲化权象征以纪律与行动力在现实中建立成就，您倾向追求影响力与地位，通过执行来证明价值。",
        positivePoints: ["行动派", "责任强", "事业导向"],
        cautionPoints: ["太注重控制", "容易忽略情感层面"]
      },
      details: {
        naturalTalents: ["战略执行", "带领能力", "稳健掌控"],
        lifeLessons: ["包容差异", "柔软表达", "平衡理性与情感"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "武曲化科表现出精确分析与财务能力，适合专业技术、系统运营与研究性职务，强调结构与逻辑性。",
        positivePoints: ["分析能力强", "技术思维", "逻辑缜密"],
        cautionPoints: ["过于拘泥细节", "创新力较弱"]
      },
      details: {
        suitableCareers: ["财务顾问", "工程分析", "数据管理"],
        financialOutlook: "以专业技术与严谨规划达成稳定财务状况"
      }
    },
    relationships: {
      content: {
        mainText: "武曲化科在关系中较为理智，重视责任与实际，但感情表达偏保守，适合长期稳固型关系。",
        positivePoints: ["踏实可靠", "值得托付", "重视承诺"],
        cautionPoints: ["情感表达较少", "不够浪漫"]
      },
      details: {
        relationshipStyle: ["理性型", "责任型", "低调稳定"],
        compatibleSigns: ["天相", "太阴", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "武曲化科有助于建立健康习惯与自我管理，适合通过系统性锻炼维持健康，但需避免过度劳累。",
        positivePoints: ["作息稳定", "抗压能力强"],
        cautionPoints: ["过度工作", "对健康问题反应慢"]
      },
      details: {
        strengths: ["体力", "习惯性健康维持"],
        areasOfAttention: ["关节疲劳", "慢性劳损"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "武曲化科的人生目标常围绕结构建设、实际贡献与务实成功，您追求成就但以稳健理性方式前进。",
        positivePoints: ["组织能力佳", "踏实追梦", "长期布局"],
        cautionPoints: ["目标固定化", "缺乏灵活性"]
      },
      details: {
        naturalTalents: ["制度建立", "系统思维", "长期规划"],
        lifeLessons: ["面对变化", "增加弹性", "激发创造力"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "武曲化忌容易带来财务焦虑、计划受阻或执着于细节，建议培养弹性应变与放下过度控制。",
        positivePoints: ["执行力强", "重视结果"],
        cautionPoints: ["财务压力大", "过度谨慎"]
      },
      details: {
        suitableCareers: ["自由接案", "辅助技术岗位", "幕后财务支持"],
        financialOutlook: "波动明显，需加强风险管理"
      }
    },
    relationships: {
      content: {
        mainText: "武曲化忌在关系中可能因沟通方式直接、过于实际而缺乏温度，易产生误解或情感疏离。",
        positivePoints: ["实在可信", "重视承诺"],
        cautionPoints: ["不解风情", "表达冷淡"]
      },
      details: {
        relationshipStyle: ["沉稳型", "不善言辞", "实用导向"],
        compatibleSigns: ["太阴", "天梁", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "武曲化忌可能引发肌肉紧张、压力过大等慢性健康问题，需注意身体放松与休息安排。",
        positivePoints: ["恢复速度快", "对健康自律"],
        cautionPoints: ["容易劳损", "压力型体质"]
      },
      details: {
        strengths: ["肌肉发达", "体质强健"],
        areasOfAttention: ["下背部", "关节劳损"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "武曲化忌意味着需从控制、务实与焦虑中解放，学习信任人生的流动并放下对成果的执念。",
        positivePoints: ["努力奋斗", "脚踏实地"],
        cautionPoints: ["过度坚持己见", "难以放松"],
      },
      details: {
        naturalTalents: ["强执行力", "规则意识", "实际操作力"],
        lifeLessons: ["学会放手", "信任过程", "释放焦虑"]
      }
    }
  }
},
"廉贞": {
  "祿": {
    career: {
      content: {
        mainText: "廉贞化禄象征谋略与决断力并重，适合从事需要判断力、策略性强的职业，如管理、策略、政治等。",
        positivePoints: ["判断果断", "战略眼光", "能独当一面"],
        cautionPoints: ["目标导向强", "可能忽略团队意见"]
      },
      details: {
        suitableCareers: ["战略顾问", "政治工作", "商业策划"],
        financialOutlook: "擅长策略性赚钱，收入具弹性"
      }
    },
    relationships: {
      content: {
        mainText: "廉贞化禄的人在感情中具吸引力，兼具感性与理性，懂得掌控节奏，适合建立互动性强的伴侣关系。",
        positivePoints: ["富有魅力", "互动感强", "情感主导"],
        cautionPoints: ["控制欲潜藏", "情绪波动"]
      },
      details: {
        relationshipStyle: ["主动型", "理性感性兼具", "有神秘感"],
        compatibleSigns: ["贪狼", "武曲", "天机"]
      }
    },
    health: {
      content: {
        mainText: "廉贞化禄带来良好的身体动能与心理调节力，但需注意心火过旺、作息不规律引发的内在失衡。",
        positivePoints: ["体质强健", "恢复快"],
        cautionPoints: ["易烦躁", "需重视生活节律"]
      },
      details: {
        strengths: ["神经系统", "内分泌系统"],
        areasOfAttention: ["火气过盛", "内分泌紊乱"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "廉贞化禄的人生目标多与掌握资源、推动变革相关。您追求掌控力并愿意承担变化带来的挑战。",
        positivePoints: ["目标明确", "变革驱动力强", "坚韧执着"],
        cautionPoints: ["执念深", "可能过度控制"]
      },
      details: {
        naturalTalents: ["战略执行", "突破困局", "情绪领导力"],
        lifeLessons: ["释放执念", "接受变化中的失控", "放下权力焦虑"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "廉贞化权展现出强烈的主导性与改革倾向，您在职场中勇于承担变革任务，擅长处理权力与秩序的矛盾。",
        positivePoints: ["主导力强", "不畏挑战", "富有改革精神"],
        cautionPoints: ["权力意识强", "可能过于强势"]
      },
      details: {
        suitableCareers: ["制度改革者", "公安司法", "组织重构顾问"],
        financialOutlook: "以掌控与重建系统方式带来资源"
      }
    },
    relationships: {
      content: {
        mainText: "廉贞化权使您在情感中追求自主与主导，同时带有一定神秘与挑战特质，适合与能承受强烈个性的人相处。",
        positivePoints: ["有个性", "情感主导", "影响力强"],
        cautionPoints: ["情绪控制力需加强", "不易妥协"]
      },
      details: {
        relationshipStyle: ["个性型", "强烈互动", "深情带挑战"],
        compatibleSigns: ["太阳", "破军", "天相"]
      }
    },
    health: {
      content: {
        mainText: "廉贞化权带来旺盛的生命力与高度压力应对能力，但容易因压抑或过度强硬导致内在失衡。",
        positivePoints: ["精力旺盛", "抗压强"],
        cautionPoints: ["神经紧张", "内火上升"]
      },
      details: {
        strengths: ["代谢力", "抵抗力"],
        areasOfAttention: ["肝火旺", "自律神经"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "廉贞化权象征通过重构、破旧立新实现人生价值，您的人生目标是改变不合理结构、建立新秩序。",
        positivePoints: ["使命感强", "愿承担变革"],
        cautionPoints: ["激进倾向", "过于理想主义"]
      },
      details: {
        naturalTalents: ["改革动力", "结构调整", "制度冲击力"],
        lifeLessons: ["稳定推进", "尊重既有结构", "不被野心绑架"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "廉贞化科适合制度研究、政策执行、分析性强的工作，强调结构与秩序，是制度型知识工作者。",
        positivePoints: ["分析力强", "系统性佳", "懂得规矩"],
        cautionPoints: ["行动缓慢", "不够灵活"]
      },
      details: {
        suitableCareers: ["法律顾问", "制度设计", "资料审查"],
        financialOutlook: "稳定成长，适合长期规划型收入"
      }
    },
    relationships: {
      content: {
        mainText: "廉贞化科在关系中偏理智且较为防御，倾向建立清晰边界的关系模式，对情感表达显得克制。",
        positivePoints: ["边界清楚", "尊重他人", "思路清晰"],
        cautionPoints: ["情感冷静", "不够亲密"]
      },
      details: {
        relationshipStyle: ["规则型", "自律型", "重结构"],
        compatibleSigns: ["文昌", "天梁", "天机"]
      }
    },
    health: {
      content: {
        mainText: "廉贞化科有助于调理身体、维持系统健康，但易因精神紧绷、生活不协调而影响健康状态。",
        positivePoints: ["调理力强", "节律性佳"],
        cautionPoints: ["易神经紧张", "需避免压抑性疾病"]
      },
      details: {
        strengths: ["内脏调节", "思维控制健康"],
        areasOfAttention: ["神经系统", "消化系统"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "廉贞化科的人生目标围绕规则、秩序、理性发展，您通过结构建设与精细管理实现人生影响力。",
        positivePoints: ["规则导向", "重视制度", "慎思明辨"],
        cautionPoints: ["可能死板", "缺乏感性调和"]
      },
      details: {
        naturalTalents: ["制度规划", "分析判断", "合理架构"],
        lifeLessons: ["融合情感", "注重人性", "适度弹性"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "廉贞化忌在职场中可能带来权力争夺、制度压抑或决策受阻，需避免过度控制与追求完美。",
        positivePoints: ["重视原则", "强烈责任感"],
        cautionPoints: ["制度束缚", "被动抗争"]
      },
      details: {
        suitableCareers: ["辅助管理", "制度审查", "保守型岗位"],
        financialOutlook: "收入不稳，常因体制或纠纷受限"
      }
    },
    relationships: {
      content: {
        mainText: "廉贞化忌在关系中可能表现为压抑、不信任或控制欲高，需学习放下执念、尊重他人意愿。",
        positivePoints: ["重承诺", "情感专一"],
        cautionPoints: ["防卫心强", "情绪抑制严重"]
      },
      details: {
        relationshipStyle: ["防御型", "控制型", "难以亲密"],
        compatibleSigns: ["太阴", "武曲", "天同"]
      }
    },
    health: {
      content: {
        mainText: "廉贞化忌容易因压力与情绪压抑引发内火过盛，需关注肝胆系统与睡眠状态。",
        positivePoints: ["健康意识高", "应对力强"],
        cautionPoints: ["易内热", "情绪压抑导致躯体反应"]
      },
      details: {
        strengths: ["内脏代谢", "自我调节意识"],
        areasOfAttention: ["肝胆系统", "消化系统", "睡眠障碍"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "廉贞化忌象征通过掌控与放下的矛盾成长，您的人生功课在于面对制度、欲望与人性的冲突。",
        positivePoints: ["深度自省", "具突破力"],
        cautionPoints: ["自我束缚", "难以释放压力"]
      },
      details: {
        naturalTalents: ["深入问题核心", "制度分析", "自我调整"],
        lifeLessons: ["放下控制", "释放压抑情绪", "柔软应对外界"]
      }
    }
  }
},
"贪狼": {
  "祿": {
    career: {
      content: {
        mainText: "贪狼化禄代表魅力与创意并重，您在职场中擅长展现个人特色，适合从事艺术、娱乐、营销等需要创意与人际互动的工作。",
        positivePoints: ["魅力强", "创意丰富", "表达能力好"],
        cautionPoints: ["容易浮躁", "目标分散"]
      },
      details: {
        suitableCareers: ["艺术创作", "广告公关", "娱乐产业"],
        financialOutlook: "靠人脉与魅力获利，收入具波动性"
      }
    },
    relationships: {
      content: {
        mainText: "贪狼化禄在感情上极具吸引力，情感丰富、表达直接，常带来浪漫的恋爱体验，但需注意情感专一度。",
        positivePoints: ["情感热烈", "表达能力强", "魅力十足"],
        cautionPoints: ["多情倾向", "需培养责任感"]
      },
      details: {
        relationshipStyle: ["浪漫型", "互动型", "多变而热情"],
        compatibleSigns: ["廉贞", "紫微", "天机"]
      }
    },
    health: {
      content: {
        mainText: "贪狼化禄象征旺盛的生命力与探索欲，健康状态良好，但需注意纵欲过度或饮食失调所带来的问题。",
        positivePoints: ["活力强", "适应力好"],
        cautionPoints: ["生活作息不稳", "易纵情享乐"]
      },
      details: {
        strengths: ["代谢系统", "内分泌平衡"],
        areasOfAttention: ["肝胆功能", "饮食控制"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "贪狼化禄的人生目标与享受人生、探索多元经验有关，您天生适合走一条不拘一格的人生路线。",
        positivePoints: ["好奇心强", "多才多艺", "人际魅力大"],
        cautionPoints: ["方向感不足", "容易沉溺欲望"]
      },
      details: {
        naturalTalents: ["创意整合", "社交沟通", "跨界发展"],
        lifeLessons: ["聚焦目标", "管理欲望", "平衡内在与外在"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "贪狼化权使您在职场上展现强烈的主见与表现欲，适合担任需要说服、引导、娱乐或炒热气氛的工作角色。",
        positivePoints: ["影响力强", "带动气氛", "表达欲强"],
        cautionPoints: ["个性张扬", "情绪起伏大"]
      },
      details: {
        suitableCareers: ["主持人", "营销主管", "演艺人员"],
        financialOutlook: "以表现力与人气换取财富，具爆发性收入"
      }
    },
    relationships: {
      content: {
        mainText: "贪狼化权在感情上表现为强势与主动，擅长吸引他人目光，但可能在关系中显得过于主导与占有欲强。",
        positivePoints: ["魅力外放", "情感投入", "主动追求"],
        cautionPoints: ["占有欲强", "情绪主导"]
      },
      details: {
        relationshipStyle: ["主导型", "激情型", "占有性强"],
        compatibleSigns: ["太阳", "廉贞", "天同"]
      }
    },
    health: {
      content: {
        mainText: "贪狼化权带来极强的精力与行动力，但也容易因生活过度活跃而忽略身体平衡，需注意情绪与饮食管理。",
        positivePoints: ["行动迅速", "抗压力强"],
        cautionPoints: ["火气旺盛", "内分泌波动"]
      },
      details: {
        strengths: ["活力旺盛", "应变能力强"],
        areasOfAttention: ["情绪波动", "消化与内分泌系统"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "贪狼化权的人生目标常围绕舞台、表现、自我实现而展开，您适合透过影响力带动他人改变与突破。",
        positivePoints: ["充满动力", "表达欲强", "乐于挑战"],
        cautionPoints: ["成瘾倾向", "目标分裂"]
      },
      details: {
        naturalTalents: ["表演表达", "说服能力", "自我塑造"],
        lifeLessons: ["控制欲望", "设定清晰目标", "稳定内在状态"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "贪狼化科象征艺术性与审美兼具，适合从事设计、创意、心理辅导等强调人性理解与艺术表现的工作。",
        positivePoints: ["艺术美感", "表现力强", "人性洞察好"],
        cautionPoints: ["专注度不高", "理想与现实落差"]
      },
      details: {
        suitableCareers: ["艺术设计", "心理咨询", "文化创作"],
        financialOutlook: "收入依赖才华发挥，需稳定发展"
      }
    },
    relationships: {
      content: {
        mainText: "贪狼化科在感情中倾向理想主义，重视精神交流与美感氛围，关系中常追求浪漫与独特性。",
        positivePoints: ["懂得浪漫", "情感深刻", "富艺术气息"],
        cautionPoints: ["幻想成分重", "现实适应较弱"]
      },
      details: {
        relationshipStyle: ["浪漫型", "理想型", "感性表达"],
        compatibleSigns: ["太阴", "文昌", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "贪狼化科有助于平衡精神与身体状态，适合透过艺术、音乐、瑜伽等方式调理情绪与健康。",
        positivePoints: ["情绪平衡力强", "身心协调佳"],
        cautionPoints: ["易感体质", "神经系统敏感"]
      },
      details: {
        strengths: ["心理调节", "身体柔韧性"],
        areasOfAttention: ["神经系统", "免疫系统"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "贪狼化科的人生目标多围绕美学、创意、人性探索展开，您擅长将抽象感受具体化，转化为动人表达。",
        positivePoints: ["艺术性强", "情感细腻", "感染力高"],
        cautionPoints: ["情绪化", "缺乏方向感"]
      },
      details: {
        naturalTalents: ["美感创造", "心理表达", "灵性觉知"],
        lifeLessons: ["实践创意", "整合多元兴趣", "确立人生重心"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "贪狼化忌容易在职场中表现浮动不安、情绪导向或人际失衡，需建立清晰目标与情绪稳定系统。",
        positivePoints: ["思维灵活", "表现欲强"],
        cautionPoints: ["目标模糊", "易沉溺享乐"]
      },
      details: {
        suitableCareers: ["自由创作", "短期项目", "辅助性工作"],
        financialOutlook: "收入不稳定，受人际与情绪影响大"
      }
    },
    relationships: {
      content: {
        mainText: "贪狼化忌带来多情与迷惘的情感模式，可能因渴望被爱而形成情感依赖或三角关系问题。",
        positivePoints: ["重视感受", "情感丰富"],
        cautionPoints: ["情绪波动", "情感困扰多"]
      },
      details: {
        relationshipStyle: ["多情型", "感性导向", "易受诱惑"],
        compatibleSigns: ["太阴", "天同", "廉贞"]
      }
    },
    health: {
      content: {
        mainText: "贪狼化忌可能因生活节奏混乱、作息不定导致身体虚弱或内分泌失调，需重视生活规律。",
        positivePoints: ["恢复力快", "适应力强"],
        cautionPoints: ["免疫力波动", "容易神经敏感"]
      },
      details: {
        strengths: ["应变能力", "心理弹性"],
        areasOfAttention: ["内分泌系统", "精神疲劳"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "贪狼化忌象征透过情感混乱、自我迷惘找到真实的自我，您的人生道路可能充满迷惘与探索。",
        positivePoints: ["体验丰富", "情感深刻"],
        cautionPoints: ["失去方向", "欲望难控"]
      },
      details: {
        naturalTalents: ["体验式学习", "人性观察", "感情领悟力"],
        lifeLessons: ["专注自我成长", "节制欲望", "确立人生核心价值"]
      }
    }
  }
},
"巨门": {
  "祿": {
    career: {
      content: {
        mainText: "巨门化禄象征口才与表达力转化为事业与财富资源，适合从事沟通、说服、传播等语言相关领域的工作。",
        positivePoints: ["口才佳", "分析力强", "擅长沟通"],
        cautionPoints: ["话多易失焦", "过于理性"]
      },
      details: {
        suitableCareers: ["教育培训", "公关传播", "法律顾问"],
        financialOutlook: "收入依赖口才与知识积累，成长空间大"
      }
    },
    relationships: {
      content: {
        mainText: "巨门化禄在关系中表现为善于倾听与表达，喜欢理性探讨，情感表达带有知识性与逻辑性。",
        positivePoints: ["沟通顺畅", "有思想深度", "擅长辩论与协商"],
        cautionPoints: ["情感不够直接", "容易陷入争辩"]
      },
      details: {
        relationshipStyle: ["知识型", "理性表达", "喜欢对话"],
        compatibleSigns: ["天机", "文昌", "太阴"]
      }
    },
    health: {
      content: {
        mainText: "巨门化禄有助于神经与语言系统良好运作，健康管理偏理性，但需避免因思虑过多造成疲劳。",
        positivePoints: ["思维清晰", "语言协调性好"],
        cautionPoints: ["易思虑过度", "头部紧张"]
      },
      details: {
        strengths: ["神经系统", "语言中枢"],
        areasOfAttention: ["头痛", "失眠", "神经性疲劳"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "巨门化禄象征透过表达、探讨、理解建构人生意义，您的人生目标与知识分享和思想引导密切相关。",
        positivePoints: ["知识传播者", "沟通桥梁", "逻辑建构力"],
        cautionPoints: ["过于理性", "难以融入情感层次"]
      },
      details: {
        naturalTalents: ["表达能力", "逻辑推理", "语言组织"],
        lifeLessons: ["平衡理性与感性", "包容不同观点", "聆听多于争辩"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "巨门化权展现强大的语言权威与逻辑掌控力，适合担任政策说明、法务谈判、公众表达等职位。",
        positivePoints: ["逻辑清晰", "语言有力", "说服力强"],
        cautionPoints: ["言词犀利", "易树敌"],
      },
      details: {
        suitableCareers: ["律师", "辩论专家", "政务发言人"],
        financialOutlook: "靠口才与判断建立权威，进财迅速"
      }
    },
    relationships: {
      content: {
        mainText: "巨门化权在关系中偏向主导沟通、分析问题，擅长指出核心矛盾，但可能显得批判性过强。",
        positivePoints: ["善于分析", "直言不讳", "愿意沟通"],
        cautionPoints: ["批评太多", "情感表达欠缺"]
      },
      details: {
        relationshipStyle: ["分析型", "理性主导", "辩证风格"],
        compatibleSigns: ["廉贞", "天梁", "紫微"]
      }
    },
    health: {
      content: {
        mainText: "巨门化权可能带来语言系统过度使用、思虑压力大等问题，需注意失眠、咽喉与神经方面症状。",
        positivePoints: ["表达能力强", "逻辑处理好"],
        cautionPoints: ["神经紧张", "咽喉发炎"]
      },
      details: {
        strengths: ["脑部运转快", "反应灵敏"],
        areasOfAttention: ["喉咙", "神经系统", "睡眠"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "巨门化权象征透过语言掌控环境，您的人生任务在于用知识与逻辑赢得尊重与影响力。",
        positivePoints: ["有说服力", "擅长逻辑", "具影响力"],
        cautionPoints: ["偏执争辩", "控制倾向强"]
      },
      details: {
        naturalTalents: ["谈判协调", "公开演说", "思想领袖力"],
        lifeLessons: ["学会包容", "尊重感受", "听比说更重要"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "巨门化科展现出理性逻辑与知识整合能力，适合研究分析、语言教学、制度评估等专业领域。",
        positivePoints: ["分析能力强", "文字逻辑好", "擅长研究"],
        cautionPoints: ["过于批判", "沟通略显距离感"]
      },
      details: {
        suitableCareers: ["研究员", "教师", "政策评估顾问"],
        financialOutlook: "靠知识与分析力获得稳定收入"
      }
    },
    relationships: {
      content: {
        mainText: "巨门化科在感情中追求理性、思想层次的交流，容易与对方就理念深入对话，但在情绪表达上可能较冷静。",
        positivePoints: ["理性对谈", "知识共享", "沟通通透"],
        cautionPoints: ["不易展露情感", "偏向思辨"]
      },
      details: {
        relationshipStyle: ["理智型", "对谈型", "互相学习"],
        compatibleSigns: ["文曲", "太阴", "天机"]
      }
    },
    health: {
      content: {
        mainText: "巨门化科有助于健康管理逻辑化、理性化，但易因思维过度活跃导致焦虑、失眠或神经疲劳。",
        positivePoints: ["注重规律", "重视健康知识"],
        cautionPoints: ["神经亢奋", "失眠倾向"]
      },
      details: {
        strengths: ["脑部系统", "神经协调"],
        areasOfAttention: ["焦虑", "头部压力"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "巨门化科的人生使命在于通过语言与逻辑整合知识、引导他人理解世界，您是思想传播者与桥梁。",
        positivePoints: ["思想清晰", "传播能力佳", "表达有力"],
        cautionPoints: ["倾向分析而非体验", "语言易冷漠"]
      },
      details: {
        naturalTalents: ["逻辑分析", "语言表达", "结构思维"],
        lifeLessons: ["活在当下", "发展情感连结", "减少批评增加理解"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "巨门化忌可能造成沟通误解、职场口舌是非或表达偏差，需避免言多伤人或因言失职。",
        positivePoints: ["关注细节", "观察敏锐"],
        cautionPoints: ["口舌是非多", "沟通易误解"]
      },
      details: {
        suitableCareers: ["幕后工作", "分析岗位", "文书编辑"],
        financialOutlook: "财务进展受人际与口才影响大"
      }
    },
    relationships: {
      content: {
        mainText: "巨门化忌在关系中易因误会、争辩或言语误伤造成隔阂，需学习温和表达与情绪沟通。",
        positivePoints: ["注重沟通", "善于讨论"],
        cautionPoints: ["话多误事", "情绪沟通不足"]
      },
      details: {
        relationshipStyle: ["辩论型", "解释型", "理性过重"],
        compatibleSigns: ["太阴", "天相", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "巨门化忌容易出现因神经紧张、言语系统负担过重引发的慢性疾病，如失眠、咽喉不适等。",
        positivePoints: ["健康意识高", "注重表达"],
        cautionPoints: ["神经焦虑", "咽喉反复不适"]
      },
      details: {
        strengths: ["语言感知", "思维敏捷"],
        areasOfAttention: ["神经疲劳", "咽炎", "失眠"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "巨门化忌象征通过误解与误会学习真实沟通，您的人生功课在于练习更有同理心地表达自我。",
        positivePoints: ["反思深刻", "学习力强"],
        cautionPoints: ["口是心非", "沟通阻碍"]
      },
      details: {
        naturalTalents: ["语言结构", "深度思考", "逻辑辨析"],
        lifeLessons: ["换位思考", "表达同理心", "多聆听少反驳"]
      }
    }
  }
},
"天府": {
  "祿": {
    career: {
      content: {
        mainText: "天府化禄象征稳健、可靠的财富管理能力，适合从事行政、财务、管理等注重制度与资源运用的领域。",
        positivePoints: ["理财有道", "管理能力强", "重视实际"],
        cautionPoints: ["保守倾向", "创新力略弱"]
      },
      details: {
        suitableCareers: ["财务管理", "政府机构", "不动产投资"],
        financialOutlook: "财富稳健增长，适合长期保值性投资"
      }
    },
    relationships: {
      content: {
        mainText: "天府化禄在关系中展现稳定与包容的特质，擅长营造安全感，注重承诺与照顾，是家庭中的核心力量。",
        positivePoints: ["稳定可靠", "包容力强", "乐于照顾"],
        cautionPoints: ["表达不够直接", "容易压抑需求"]
      },
      details: {
        relationshipStyle: ["照顾型", "务实型", "稳重温和"],
        compatibleSigns: ["太阴", "天相", "紫微"]
      }
    },
    health: {
      content: {
        mainText: "天府化禄体质稳定，恢复力强，健康管理上偏重保守和养生理念，适合中庸调养方式。",
        positivePoints: ["健康平稳", "恢复快", "适应力强"],
        cautionPoints: ["缺乏运动", "容易发福"]
      },
      details: {
        strengths: ["消化系统", "内分泌平衡"],
        areasOfAttention: ["体重管理", "饮食控制"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天府化禄象征积累与守成的人生哲学，您的使命往往在于守护财富、资源与制度，稳定他人生活。",
        positivePoints: ["稳重守信", "擅长资源整合", "理性务实"],
        cautionPoints: ["缺乏冒险精神", "保守影响成长"]
      },
      details: {
        naturalTalents: ["理财", "组织管理", "制度建设"],
        lifeLessons: ["提升适应变化的能力", "放下对安全的执着", "学习创新"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "天府化权使您在体制或资源管理中展现强势领导力，适合掌管组织、掌握预算资源与战略性调配。",
        positivePoints: ["掌控力强", "制度意识好", "擅长资源整合"],
        cautionPoints: ["控制欲强", "保守官僚作风"]
      },
      details: {
        suitableCareers: ["企业高层", "政府预算主管", "系统规划师"],
        financialOutlook: "掌控资源带来财富集中，财运厚实"
      }
    },
    relationships: {
      content: {
        mainText: "天府化权在关系中有责任感与保护性，但容易主导一切、掌握关系的走向，需注意尊重对方意见。",
        positivePoints: ["负责任", "稳定感强", "包容周全"],
        cautionPoints: ["主控倾向", "情感表达保守"]
      },
      details: {
        relationshipStyle: ["守护型", "权威型", "稳定依靠"],
        compatibleSigns: ["武曲", "天梁", "太阴"]
      }
    },
    health: {
      content: {
        mainText: "天府化权体质稳定，但易因压力或责任心重带来内在紧张，需注意心血管系统与饮食问题。",
        positivePoints: ["耐力佳", "抗压能力强"],
        cautionPoints: ["慢性疲劳", "血压问题"]
      },
      details: {
        strengths: ["稳定体质", "恢复强"],
        areasOfAttention: ["高血压", "肠胃消化"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天府化权象征透过守护与组织权力完成使命，您的人生任务是成为稳定秩序与调配资源的中坚角色。",
        positivePoints: ["责任心强", "擅长整合", "权威十足"],
        cautionPoints: ["官僚倾向", "封闭性强"]
      },
      details: {
        naturalTalents: ["体制调度", "资源管控", "统筹安排"],
        lifeLessons: ["开放接受不同声音", "转化控制为合作", "柔软掌权"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "天府化科重视规范与秩序，适合从事行政、制度研究、财务分析等需要精细与逻辑的岗位。",
        positivePoints: ["制度意识强", "分析能力佳", "适合长线发展"],
        cautionPoints: ["略缺弹性", "反应速度慢"]
      },
      details: {
        suitableCareers: ["行政管理", "制度顾问", "财务规划师"],
        financialOutlook: "以制度化运作达成长线财富目标"
      }
    },
    relationships: {
      content: {
        mainText: "天府化科在感情中表现稳重理性，善于分析与调节关系结构，但不易主动表达情感。",
        positivePoints: ["稳定可靠", "责任感强", "处理关系逻辑清晰"],
        cautionPoints: ["情感流动不足", "理性压过感性"]
      },
      details: {
        relationshipStyle: ["规范型", "中性平稳型", "理智责任型"],
        compatibleSigns: ["天梁", "文昌", "太阴"]
      }
    },
    health: {
      content: {
        mainText: "天府化科有助于形成良好生活规律，健康稳定但偏静态，建议增加身体活动。",
        positivePoints: ["规律作息", "健康管理佳"],
        cautionPoints: ["活动力不足", "新陈代谢偏慢"]
      },
      details: {
        strengths: ["调理系统", "肠胃吸收"],
        areasOfAttention: ["肥胖", "代谢问题"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天府化科象征制度建设与管理智慧，您的人生使命在于用理性建立秩序，成为群体稳定力量。",
        positivePoints: ["守序精神", "组织条理", "良好判断力"],
        cautionPoints: ["墨守成规", "缺乏弹性思维"]
      },
      details: {
        naturalTalents: ["行政思维", "制度设计", "逻辑管理"],
        lifeLessons: ["接受变化", "融入人性弹性", "以柔制刚"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "天府化忌容易陷入过度保守、资源停滞或体制僵化，需避免因害怕风险错失发展机会。",
        positivePoints: ["有稳定意识", "能守住基础"],
        cautionPoints: ["缺乏变通", "抗压力不足"]
      },
      details: {
        suitableCareers: ["保守型企业", "辅助行政", "稳定型岗位"],
        financialOutlook: "发展缓慢，宜提升适应力"
      }
    },
    relationships: {
      content: {
        mainText: "天府化忌在人际关系中容易因过度付出或期望控制局面而造成误解，情感上常压抑真实感受。",
        positivePoints: ["愿意承担", "稳定守信"],
        cautionPoints: ["不易表达情绪", "控制关系进度"]
      },
      details: {
        relationshipStyle: ["照顾型", "沉稳型", "不善言辞"],
        compatibleSigns: ["太阴", "天相", "巨门"]
      }
    },
    health: {
      content: {
        mainText: "天府化忌可能因情绪压抑、运动不足而导致慢性疾病，特别需注意消化系统与内分泌平衡。",
        positivePoints: ["生活节奏稳定", "健康意识佳"],
        cautionPoints: ["过度静态", "食欲控制弱"]
      },
      details: {
        strengths: ["身体稳定", "不易波动"],
        areasOfAttention: ["肥胖", "脾胃虚弱"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "天府化忌象征透过守成与停滞学习转化，您的使命在于放下对控制与安逸的执念，迈向新形态的稳定。",
        positivePoints: ["责任心重", "稳重踏实"],
        cautionPoints: ["固守旧模式", "恐惧变动"]
      },
      details: {
        naturalTalents: ["资源整合", "稳定管理", "制度思维"],
        lifeLessons: ["面对改变", "跨出舒适区", "放下安全感依赖"]
      }
    }
  }
},
"破军": {
  "祿": {
    career: {
      content: {
        mainText: "破军化禄代表变革中带来机会，您适合从事充满挑战、需要不断创新与突破的行业，靠勇气与冒险精神累积财富。",
        positivePoints: ["敢于变革", "行动力强", "不怕挑战"],
        cautionPoints: ["波动较大", "易忽略风险"]
      },
      details: {
        suitableCareers: ["创业", "科技创新", "自由职业"],
        financialOutlook: "进财速度快但波动大，需强化持续性"
      }
    },
    relationships: {
      content: {
        mainText: "破军化禄在感情中表现热情与刺激，适合充满变化与新鲜感的关系，感情表达直接而浓烈。",
        positivePoints: ["激情四射", "追求新鲜", "敢于表达"],
        cautionPoints: ["关系不稳定", "容易冲动决定"]
      },
      details: {
        relationshipStyle: ["冒险型", "刺激导向", "主动追求"],
        compatibleSigns: ["贪狼", "太阳", "天机"]
      }
    },
    health: {
      content: {
        mainText: "破军化禄健康上体力充沛但容易因过度激烈或生活节奏混乱而引发问题，建议规律生活。",
        positivePoints: ["新陈代谢快", "精力旺盛"],
        cautionPoints: ["作息不定", "易有外伤或突发状况"]
      },
      details: {
        strengths: ["肌肉活性", "免疫适应力"],
        areasOfAttention: ["运动损伤", "过劳"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "破军化禄象征通过打破常规、迎接变化来找到人生价值，您的人生使命可能在于成为创新与转型的推动者。",
        positivePoints: ["善变革", "打破界限", "勇于实践"],
        cautionPoints: ["方向不一", "缺乏持久力"]
      },
      details: {
        naturalTalents: ["打破旧框架", "创新意识", "冒险精神"],
        lifeLessons: ["坚持到底", "善后管理", "策略思维"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "破军化权赋予您破旧立新的强大力量，在职场上擅长打破框架、重新组织结构，适合扮演改革者与先锋角色。",
        positivePoints: ["改革意识强", "独立性高", "行动迅速"],
        cautionPoints: ["过于急进", "人际协调较弱"]
      },
      details: {
        suitableCareers: ["变革顾问", "创业领导", "解构型创新者"],
        financialOutlook: "以主动权与变动博得机会，风险与回报并存"
      }
    },
    relationships: {
      content: {
        mainText: "破军化权在关系中充满主导性，渴望掌控节奏与互动方式，喜欢挑战型伴侣，但需注意控制欲。",
        positivePoints: ["主导性强", "热情直接", "敢于突破"],
        cautionPoints: ["情绪激烈", "不够温柔"]
      },
      details: {
        relationshipStyle: ["领导型", "挑战型", "强互动"],
        compatibleSigns: ["廉贞", "武曲", "贪狼"]
      }
    },
    health: {
      content: {
        mainText: "破军化权容易出现身体紧张与冲动行为造成的健康损害，特别需注意突发伤害与高压状态下的健康状况。",
        positivePoints: ["恢复快", "反应灵敏"],
        cautionPoints: ["突发状况", "情绪易爆"]
      },
      details: {
        strengths: ["神经应变", "体能反应"],
        areasOfAttention: ["高血压", "冲动造成的意外"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "破军化权的人生任务是主导破与立的进程，您天生适合在剧烈变动中寻求重组与重建。",
        positivePoints: ["强烈行动力", "打破限制", "激发改革"],
        cautionPoints: ["极端倾向", "易与他人冲突"]
      },
      details: {
        naturalTalents: ["先锋精神", "拆解能力", "重构世界观"],
        lifeLessons: ["平衡行动与人和", "稳定持续性", "控制破坏欲"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "破军化科在理性掌控下导入创新变革，您适合在研究性、技术性或结构重建领域深耕并建立新系统。",
        positivePoints: ["逻辑强", "破旧立新", "注重实证"],
        cautionPoints: ["思想跳跃快", "执行节奏不稳"]
      },
      details: {
        suitableCareers: ["技术开发", "研究分析", "系统重建"],
        financialOutlook: "需长期布局，有潜在突破机会"
      }
    },
    relationships: {
      content: {
        mainText: "破军化科在感情中表现独立冷静，重视心理层面的契合，对形式不拘，但不善处理情绪细节。",
        positivePoints: ["理性清晰", "追求平等", "思想先锋"],
        cautionPoints: ["距离感强", "不够浪漫"]
      },
      details: {
        relationshipStyle: ["平等型", "独立型", "思想互动"],
        compatibleSigns: ["文昌", "天机", "太阳"]
      }
    },
    health: {
      content: {
        mainText: "破军化科适合科学管理身体，通过自我观察调节健康，但因精神活跃也可能导致失眠与神经紧绷。",
        positivePoints: ["身体敏感", "调整能力佳"],
        cautionPoints: ["精神紧张", "睡眠问题"]
      },
      details: {
        strengths: ["新陈代谢", "调节系统"],
        areasOfAttention: ["神经系统", "压力症状"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "破军化科的人生任务是带来系统性创新，您以理性建构新的思维与结构，为社会带来潜在重组的契机。",
        positivePoints: ["逻辑变革者", "具创造思维", "知识型先锋"],
        cautionPoints: ["思维跳脱", "难与传统融合"]
      },
      details: {
        naturalTalents: ["创新系统构建", "信息整合", "突破常规思维"],
        lifeLessons: ["脚踏实地", "整合现实与理想", "深耕而非速成"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "破军化忌容易带来职业剧变、规划失败或决策反复的挑战，需学会稳定发展节奏与情绪管理。",
        positivePoints: ["创新冲动", "有打破僵局的潜力"],
        cautionPoints: ["难持久", "易自毁成功"]
      },
      details: {
        suitableCareers: ["短期项目", "创新辅助", "非典型职业"],
        financialOutlook: "波动大，需避免破财与冲动决策"
      }
    },
    relationships: {
      content: {
        mainText: "破军化忌在情感上易有剧烈起伏、突发变故或无法承诺的状态，建议学习情绪调节与关系维持。",
        positivePoints: ["感情热烈", "敢爱敢恨"],
        cautionPoints: ["极端变化", "易断裂关系"]
      },
      details: {
        relationshipStyle: ["激烈型", "强冲击感", "不稳定"],
        compatibleSigns: ["贪狼", "太阳", "武曲"]
      }
    },
    health: {
      content: {
        mainText: "破军化忌健康方面常见暴饮暴食、运动过度或生活节奏混乱引发的急性症状，需建立生活规律。",
        positivePoints: ["能量爆发强", "自我调整快"],
        cautionPoints: ["意外多", "睡眠紊乱"]
      },
      details: {
        strengths: ["短期恢复", "适应环境快"],
        areasOfAttention: ["头部外伤", "肝火旺盛", "心律不齐"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "破军化忌象征经历剧烈改变来完成自我重建，您的人生道路充满挑战与释放，需从毁灭中看见重生。",
        positivePoints: ["突破能力强", "勇于面对真相"],
        cautionPoints: ["自毁倾向", "缺乏持续动力"]
      },
      details: {
        naturalTalents: ["勇气", "应对混乱", "打破旧框架"],
        lifeLessons: ["稳定内心", "长期投入", "珍惜成果"]
      }
    }
  }
},
"七杀": {
  "祿": {
    career: {
      content: {
        mainText: "七杀化禄代表突破与独立带来事业发展，您适合从事自由度高、具挑战性与冒险精神的职业，靠果断行动获取成果。",
        positivePoints: ["勇于突破", "果决执行", "抗压性强"],
        cautionPoints: ["不喜受控", "规划不足"]
      },
      details: {
        suitableCareers: ["创业", "军警", "自由职业", "风险投资"],
        financialOutlook: "进财方式直接果断，具爆发性但不稳定"
      }
    },
    relationships: {
      content: {
        mainText: "七杀化禄在感情上充满保护欲和行动力，喜欢主导关系、主动出击，但需注意倾听与情绪柔和。",
        positivePoints: ["愿意承担", "行动力强", "直来直往"],
        cautionPoints: ["情绪波动大", "表达方式略显生硬"]
      },
      details: {
        relationshipStyle: ["主导型", "保护型", "直接型"],
        compatibleSigns: ["太阴", "天相", "破军"]
      }
    },
    health: {
      content: {
        mainText: "七杀化禄带来强大体能与恢复力，适合高强度活动，但易因过度拼搏而透支体力。",
        positivePoints: ["体质强壮", "恢复快", "免疫强"],
        cautionPoints: ["易过劳", "疏忽保养"]
      },
      details: {
        strengths: ["肌肉系统", "免疫力"],
        areasOfAttention: ["运动伤害", "肾气耗损"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "七杀化禄的人生目标是突破体制与限制，实现独立人生价值，适合走不寻常、靠自己打拼的路线。",
        positivePoints: ["独立意识强", "目标坚定", "抗风险能力好"],
        cautionPoints: ["难以合作", "情绪易激动"]
      },
      details: {
        naturalTalents: ["决策力", "执行力", "逆境成长"],
        lifeLessons: ["协作精神", "放下对抗", "情绪管理"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "七杀化权赋予您极强的执行与掌控能力，在职场中具领导气势但也容易引发权力冲突，适合开疆拓土式的角色。",
        positivePoints: ["执行力极强", "带动改革", "适合担任先锋"],
        cautionPoints: ["好胜心强", "难接受约束"]
      },
      details: {
        suitableCareers: ["军政高层", "战略顾问", "企业拓展"],
        financialOutlook: "以权威姿态整合资源，快速建立成就"
      }
    },
    relationships: {
      content: {
        mainText: "七杀化权在关系中主导性更强，倾向控制与主张立场，适合有强烈独立性格的伴侣。",
        positivePoints: ["保护意识重", "直率", "忠诚"],
        cautionPoints: ["支配欲强", "容易独断"],
      },
      details: {
        relationshipStyle: ["主导型", "强硬型", "不服输型"],
        compatibleSigns: ["武曲", "太阳", "天机"]
      }
    },
    health: {
      content: {
        mainText: "七杀化权可能带来过度消耗、压力相关问题，体力虽强但容易紧绷，需注意肝火与血压波动。",
        positivePoints: ["抗病力强", "爆发力佳"],
        cautionPoints: ["血压高", "肝气郁结"]
      },
      details: {
        strengths: ["体力集中", "精神高度专注"],
        areasOfAttention: ["高血压", "肌肉紧绷"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "七杀化权的人生任务在于推动变革、成为开创者，您适合打破现有规则，带领群体迈向新方向。",
        positivePoints: ["具破局能力", "领导风格强烈"],
        cautionPoints: ["容易孤军奋战", "情绪压抑"]
      },
      details: {
        naturalTalents: ["改革意志", "独立领导", "战斗精神"],
        lifeLessons: ["温和表达", "寻求支援", "协力达成目标"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "七杀化科代表将行动力与理性结合，适合技术开发、逻辑严谨的工作，也能在冷门或艰难领域中脱颖而出。",
        positivePoints: ["策略执行力强", "冷静分析", "行动计划有序"],
        cautionPoints: ["过于严肃", "亲和力不足"]
      },
      details: {
        suitableCareers: ["工程开发", "冷门研究", "灾害处理单位"],
        financialOutlook: "长期稳定发展，适合累积型财富管理"
      }
    },
    relationships: {
      content: {
        mainText: "七杀化科在感情中显得理智、克制，虽不轻易表露情感，但内心忠诚可靠，需耐心建立信任。",
        positivePoints: ["忠诚稳定", "保护意识强", "理性负责任"],
        cautionPoints: ["情感表达少", "防卫心重"]
      },
      details: {
        relationshipStyle: ["沉稳型", "理性型", "慢热型"],
        compatibleSigns: ["太阴", "天府", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "七杀化科重视身体纪律与锻炼计划，适合高强度运动调节，但精神紧绷时容易累积慢性疲劳。",
        positivePoints: ["身体管理意识佳", "意志力强"],
        cautionPoints: ["劳损型疲劳", "缺乏休息弹性"]
      },
      details: {
        strengths: ["肌肉耐力", "系统性调理"],
        areasOfAttention: ["慢性疲劳", "肩颈压力"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "七杀化科象征行动之中带有思考与原则，您的人生目标在于以规范化行动赢得认可，在艰难中证明实力。",
        positivePoints: ["有格局", "脚踏实地", "不畏艰难"],
        cautionPoints: ["思维过于黑白", "缺乏人情味"]
      },
      details: {
        naturalTalents: ["精确执行", "结构规划", "自律力量"],
        lifeLessons: ["平衡冷静与热情", "建立情感连结", "缓和刚强个性"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "七杀化忌可能造成职场反复、职业不稳、冲动辞职等问题，需学习长期投入与管理风险。",
        positivePoints: ["破局潜力大", "不怕挑战"],
        cautionPoints: ["职业反复", "冲动行为"]
      },
      details: {
        suitableCareers: ["短期项目", "自由接案", "辅助执行"],
        financialOutlook: "进财快也失财快，理财纪律需强化"
      }
    },
    relationships: {
      content: {
        mainText: "七杀化忌在关系中容易表现出不信任、情绪激烈或忽冷忽热的状态，需学会稳定情绪与信任经营。",
        positivePoints: ["情感真挚", "敢爱敢恨"],
        cautionPoints: ["冲突频繁", "情绪反差大"]
      },
      details: {
        relationshipStyle: ["强烈型", "情绪型", "直率型"],
        compatibleSigns: ["破军", "贪狼", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "七杀化忌易有突发性意外或自我伤害型行为，建议维持稳定作息、减少高风险活动。",
        positivePoints: ["意志力强", "短期恢复佳"],
        cautionPoints: ["高风险体质", "意外受伤概率高"]
      },
      details: {
        strengths: ["抗压急救力", "恢复弹性"],
        areasOfAttention: ["肾功能", "突发事故", "高血压"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "七杀化忌象征透过动荡与挑战找到真正自我，您需在剧烈的人生经验中学会稳定内心、重建信念。",
        positivePoints: ["成长快速", "能在压力中蜕变"],
        cautionPoints: ["自毁模式", "难稳定发展"]
      },
      details: {
        naturalTalents: ["生存韧性", "突破能力", "独行决断力"],
        lifeLessons: ["寻求支持", "稳定方向", "柔化刚强性格"]
      }
    }
  }
},
"文昌": {
  "祿": {
    career: {
      content: {
        mainText: "文昌化禄在事业上代表才华横溢、文笔出众，适合从事文字、教育、策划等领域，能凭借智慧与表达力赢得机会与财富。",
        positivePoints: ["思维敏捷", "文才出众", "学习能力强"],
        cautionPoints: ["过于理想化", "执行力需加强"]
      },
      details: {
        suitableCareers: ["作家", "教师", "顾问", "编辑策划"],
        financialOutlook: "通过才智与沟通能力稳步累积财富"
      }
    },
    relationships: {
      content: {
        mainText: "文昌化禄的人在关系中重视思想交流与共同兴趣，喜欢与志同道合的人建立深入联系，家庭气氛注重教育与文化氛围。",
        positivePoints: ["沟通顺畅", "志趣相投", "关系融洽"],
        cautionPoints: ["过于理性处理感情", "情感表达需加强"]
      },
      details: {
        relationshipStyle: ["理性沟通型", "兴趣相投型", "平和温暖型"],
        compatibleSigns: ["文曲", "天同", "紫微"]
      }
    },
    health: {
      content: {
        mainText: "文昌化禄有助于形成良好的生活作息与精神调节，但需要注意久坐与思虑过多引发的身体不适，适当锻炼身心更为理想。",
        positivePoints: ["健康管理理性", "预防意识强"],
        cautionPoints: ["久坐少动", "神经紧张"]
      },
      details: {
        strengths: ["神经系统", "免疫系统"],
        areasOfAttention: ["脊椎", "视力疲劳", "精神压力"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "文昌化禄的人生使命与知识传播、文化教育及思想启蒙有关，适合以文字或教学方式影响他人并提升社会文明。",
        positivePoints: ["善于传播知识", "启发他人", "思维清晰"],
        cautionPoints: ["容易理论化", "缺乏实际行动"]
      },
      details: {
        naturalTalents: ["文字表达", "教育指导", "知识整合"],
        lifeLessons: ["将理论落地实践", "保持情感连接", "鼓励自我行动力"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "文昌化权代表在事业上以才智掌握话语权和决策影响力，适合策划、行政、学术指导等领域，善于运用知识资源掌控局势。",
        positivePoints: ["才智领导", "表达有力", "策略思考佳"],
        cautionPoints: ["言辞过于尖锐", "容易争执"]
      },
      details: {
        suitableCareers: ["策划总监", "项目经理", "学术顾问"],
        financialOutlook: "通过知识决策获得事业与财富成长"
      }
    },
    relationships: {
      content: {
        mainText: "文昌化权在人际关系中展现较强的思想主导性，擅长引导讨论与决策，但需避免因意见过于坚持导致冲突。",
        positivePoints: ["思路清晰", "善于沟通主导", "能引导共识"],
        cautionPoints: ["表达过于强势", "需学会倾听"]
      },
      details: {
        relationshipStyle: ["理性引导型", "讨论型", "互动积极型"],
        compatibleSigns: ["文曲", "天梁", "紫微"]
      }
    },
    health: {
      content: {
        mainText: "文昌化权容易因脑力劳动与精神紧绷带来压力相关症状，需要平衡用脑与放松，注重休息与运动。",
        positivePoints: ["思维活跃", "精神集中"],
        cautionPoints: ["精神过劳", "焦虑失眠"]
      },
      details: {
        strengths: ["脑力", "神经系统灵活"],
        areasOfAttention: ["神经系统", "头部健康"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "文昌化权的人生目标在于以知识与智慧引导方向，善于整合信息并制定策略，有助于成为学术、策划或知识型领导者。",
        positivePoints: ["智慧主导", "策略布局", "知识影响力"],
        cautionPoints: ["容易固执己见", "忽略他人感受"]
      },
      details: {
        naturalTalents: ["战略策划", "知识运用", "表达与引导"],
        lifeLessons: ["学会包容", "平衡主导与协作", "谦逊表达"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "文昌化科展现出卓越的学术、教育与写作才能，适合从事研究、教育、文化创意等职业，以知识积累换取成就。",
        positivePoints: ["学术素养高", "表达清晰", "分析严谨"],
        cautionPoints: ["理论性过强", "实践应用需加强"]
      },
      details: {
        suitableCareers: ["学者", "文化顾问", "研究人员"],
        financialOutlook: "通过知识专业带来稳定收入"
      }
    },
    relationships: {
      content: {
        mainText: "文昌化科在关系中重视精神与思想交流，强调价值观一致性，倾向与文化修养高的人建立长久关系。",
        positivePoints: ["思想交流深入", "价值观契合", "理解力强"],
        cautionPoints: ["情感表达不足", "过于理性化"]
      },
      details: {
        relationshipStyle: ["学术型", "思想型", "价值共鸣型"],
        compatibleSigns: ["文曲", "天同", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "文昌化科有助于养成良好的健康管理与学习习惯，但需注意精神压力导致的失眠或神经紧张。",
        positivePoints: ["自律良好", "重视健康知识"],
        cautionPoints: ["精神紧张", "过度思虑"]
      },
      details: {
        strengths: ["系统规划能力", "健康自律性"],
        areasOfAttention: ["神经系统", "睡眠质量"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "文昌化科的人生使命是通过教育、传播知识、培养人才，实现自我价值，并影响社会文明进步。",
        positivePoints: ["启迪智慧", "知识传承", "文化推动"],
        cautionPoints: ["理论与实际脱节", "需增强亲和力"]
      },
      details: {
        naturalTalents: ["教学指导", "学术研究", "知识传播"],
        lifeLessons: ["知行合一", "提升实践力", "情感与理性平衡"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "文昌化忌可能导致事业上因过于理想化、文字沟通失误或思考过度而受阻，需避免纸上谈兵与优柔寡断。",
        positivePoints: ["学习能力好", "具备专业素养"],
        cautionPoints: ["理论脱离实际", "沟通障碍"]
      },
      details: {
        suitableCareers: ["需强调实作与沟通的工作，如市场研究、教育辅导"],
        financialOutlook: "收入波动大，易受认知与表达能力影响"
      }
    },
    relationships: {
      content: {
        mainText: "文昌化忌在人际关系中可能因表达误解、过度理性或自我怀疑而导致疏远，需加强情感沟通与包容心。",
        positivePoints: ["有思想深度", "注重价值交流"],
        cautionPoints: ["沟通障碍", "情感疏离"]
      },
      details: {
        relationshipStyle: ["理性型", "疏离型", "思辨型"],
        compatibleSigns: ["天机", "文曲", "紫微"]
      }
    },
    health: {
      content: {
        mainText: "文昌化忌影响健康主要在神经系统与压力管理上，思虑过多易导致焦虑、失眠与肠胃不适。",
        positivePoints: ["健康意识强", "重视自律"],
        cautionPoints: ["精神疲劳", "压力相关疾病"]
      },
      details: {
        strengths: ["身体敏感度高", "健康知识好"],
        areasOfAttention: ["精神压力", "胃肠功能"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "文昌化忌的人生课题在于学会将知识应用于实际，平衡理想与现实，避免陷入空谈与内耗之中。",
        positivePoints: ["追求知识", "重视精神成长"],
        cautionPoints: ["空谈理论", "理想化失衡"]
      },
      details: {
        naturalTalents: ["思考分析", "知识探索"],
        lifeLessons: ["脚踏实地", "情理结合", "落实行动"]
      }
    }
  }
},
"文曲": {
  "祿": {
    career: {
      content: {
        mainText: "文曲化禄在事业上象征艺术才华与人际魅力，适合从事艺术创作、媒体传播、文化娱乐等领域，凭借才情与人脉获得财富与机会。",
        positivePoints: ["艺术天赋", "沟通能力佳", "魅力十足"],
        cautionPoints: ["感性过重", "需注意实际执行力"]
      },
      details: {
        suitableCareers: ["艺术家", "媒体人", "文化创意", "公关活动策划"],
        financialOutlook: "通过艺术与人际关系稳步增财"
      }
    },
    relationships: {
      content: {
        mainText: "文曲化禄在人际关系中展现亲和与浪漫，重视情感共鸣与美感享受，适合建立温馨细腻的关系网络。",
        positivePoints: ["人缘极佳", "富有浪漫情调", "善于表达情感"],
        cautionPoints: ["过度依赖情绪", "情感起伏"]
      },
      details: {
        relationshipStyle: ["浪漫型", "感性型", "情感细腻型"],
        compatibleSigns: ["文昌", "太阴", "天同"]
      }
    },
    health: {
      content: {
        mainText: "文曲化禄有助于身心舒畅与气血流畅，但需注意因情绪波动或生活不规律导致的内分泌失衡问题。",
        positivePoints: ["恢复力好", "感知敏锐"],
        cautionPoints: ["情绪起伏", "内分泌失调"]
      },
      details: {
        strengths: ["循环系统", "新陈代谢良好"],
        areasOfAttention: ["情绪平衡", "内分泌健康"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "文曲化禄的人生使命在于以艺术、美感与情感连接他人，传递爱与美的能量，丰富人们的心灵世界。",
        positivePoints: ["美感敏锐", "情感表达丰富", "启发心灵"],
        cautionPoints: ["感性过盛", "理性思考需加强"]
      },
      details: {
        naturalTalents: ["艺术创作", "情感沟通", "美学表达"],
        lifeLessons: ["平衡感性与理性", "落实实际行动", "情绪自我管理"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "文曲化权展现出以艺术魅力、沟通能力掌控局势的特质，适合领导文化、创意或传播领域，擅长以柔克刚达成目标。",
        positivePoints: ["艺术领导力", "人际操控灵活", "创意丰富"],
        cautionPoints: ["感性操控", "情绪影响决策"]
      },
      details: {
        suitableCareers: ["文化总监", "公关负责人", "艺术策展人"],
        financialOutlook: "靠魅力与艺术执行力创造丰厚收入"
      }
    },
    relationships: {
      content: {
        mainText: "文曲化权在关系中展现情感主导力，擅长以情感拉近距离，但需避免无意操控他人情绪。",
        positivePoints: ["感性引导", "关系凝聚力强", "温柔主导"],
        cautionPoints: ["情绪操控倾向", "需尊重他人意愿"]
      },
      details: {
        relationshipStyle: ["温柔主导型", "情感互动型", "默契型"],
        compatibleSigns: ["文昌", "太阴", "天相"]
      }
    },
    health: {
      content: {
        mainText: "文曲化权需留意情绪管理对健康的影响，情绪压抑易引发慢性疾病，建议养成良好情绪释放习惯。",
        positivePoints: ["感知身体变化灵敏", "自我调整快"],
        cautionPoints: ["情绪积压", "慢性压力"]
      },
      details: {
        strengths: ["恢复力", "情绪调节能力"],
        areasOfAttention: ["心血管系统", "内分泌系统"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "文曲化权的人生目标是以艺术与情感的力量影响世界，通过美与爱创造积极变化。",
        positivePoints: ["以美启发", "情感领导力", "温柔而坚定"],
        cautionPoints: ["过度感性用事", "需要理智评估"]
      },
      details: {
        naturalTalents: ["艺术引导", "情感激励", "美学策划"],
        lifeLessons: ["理性补强感性", "情绪独立", "平衡影响力与尊重"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "文曲化科在事业上体现出艺术修养、文化深度与美学素养，适合从事艺术教育、文化推广、心理咨询等领域。",
        positivePoints: ["文化素养高", "美学敏感", "心理理解力强"],
        cautionPoints: ["过于理想主义", "执行力需加强"]
      },
      details: {
        suitableCareers: ["艺术教师", "文化编辑", "心理顾问"],
        financialOutlook: "以专业知识和审美积累稳定财富"
      }
    },
    relationships: {
      content: {
        mainText: "文曲化科的人在关系中重视精神与艺术层次的共鸣，适合以共同爱好、文化背景为基础的深度交流关系。",
        positivePoints: ["心灵交流", "文化契合", "理解力好"],
        cautionPoints: ["缺乏实际行动", "容易理想化对方"]
      },
      details: {
        relationshipStyle: ["精神共鸣型", "文化兴趣型", "细腻型"],
        compatibleSigns: ["文昌", "天梁", "天同"]
      }
    },
    health: {
      content: {
        mainText: "文曲化科有助于心理平衡与情绪细腻调节，但过度敏感易引发焦虑与失眠问题，需保持心灵稳定。",
        positivePoints: ["心理敏感", "情绪管理意识好"],
        cautionPoints: ["焦虑", "神经紧绷"]
      },
      details: {
        strengths: ["心理弹性", "自我调节力"],
        areasOfAttention: ["神经系统", "情绪相关健康"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "文曲化科的人生使命在于传播美感、启发心灵，以文化艺术的形式滋养社会与人心。",
        positivePoints: ["美感教化", "艺术传承", "心理启迪"],
        cautionPoints: ["理想主义", "缺乏实际行动力"]
      },
      details: {
        naturalTalents: ["艺术教育", "文化推广", "心理辅导"],
        lifeLessons: ["实际落实", "行动与梦想结合", "情感与理性兼顾"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "文曲化忌在事业上可能导致情绪化决策、创作瓶颈或人际混乱，需要理清情绪与实际目标的界限。",
        positivePoints: ["艺术潜能丰富", "感知细腻"],
        cautionPoints: ["情绪影响工作", "创作焦虑"]
      },
      details: {
        suitableCareers: ["自由创作", "辅助性文化工作"],
        financialOutlook: "收入波动大，情绪状态影响明显"
      }
    },
    relationships: {
      content: {
        mainText: "文曲化忌在关系中可能因情绪过敏、幻想过高而导致关系不稳定，需要学会实际面对与情绪疏导。",
        positivePoints: ["感情真挚", "细腻体贴"],
        cautionPoints: ["情绪依赖", "幻想破灭"]
      },
      details: {
        relationshipStyle: ["情绪化型", "幻想型", "敏感型"],
        compatibleSigns: ["文昌", "太阴", "天同"]
      }
    },
    health: {
      content: {
        mainText: "文曲化忌对健康影响主要表现在情绪相关疾病上，如焦虑症、抑郁倾向与失眠等，需学会情绪释放。",
        positivePoints: ["身体敏感度高", "感知细腻"],
        cautionPoints: ["精神压力", "情绪疾病"]
      },
      details: {
        strengths: ["情绪感知", "身体警觉性"],
        areasOfAttention: ["神经系统", "睡眠障碍"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "文曲化忌的人生课题在于学会在情绪起伏中保持内在稳定，用真实感受创造有温度的艺术与关系。",
        positivePoints: ["情感深刻", "艺术天赋高"],
        cautionPoints: ["情绪失控", "逃避现实"]
      },
      details: {
        naturalTalents: ["情感共鸣", "艺术感知"],
        lifeLessons: ["稳定情绪", "实际面对人生", "用艺术疗愈自我与他人"]
      }
    }
  }
},
"右弼": {
  "祿": {
    career: {
      content: {
        mainText: "右弼化禄在事业上代表良好的人缘与助力运，适合在团队合作、公共事务、行政管理等领域发展，易得贵人提携而事业顺遂。",
        positivePoints: ["人际关系佳", "贵人运旺", "合作顺利"],
        cautionPoints: ["依赖他人", "自主性较弱"]
      },
      details: {
        suitableCareers: ["行政管理", "公共关系", "协调组织"],
        financialOutlook: "靠人脉与合作关系累积财富"
      }
    },
    relationships: {
      content: {
        mainText: "右弼化禄在人际关系中展现温和亲切、助人为乐的特质，擅长维护和谐气氛，适合建立互助互信的深厚关系。",
        positivePoints: ["亲和力强", "善于助人", "关系稳定"],
        cautionPoints: ["过度付出", "界限感不足"]
      },
      details: {
        relationshipStyle: ["温暖型", "互助型", "亲密型"],
        compatibleSigns: ["左辅", "天同", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "右弼化禄有助于身心调和与免疫系统稳定，但需注意因过度配合他人而忽略自身需求，造成心理负担。",
        positivePoints: ["恢复力强", "身体协调好"],
        cautionPoints: ["情绪压抑", "过劳问题"]
      },
      details: {
        strengths: ["免疫力佳", "自我修复力强"],
        areasOfAttention: ["肩颈疲劳", "情绪压力"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "右弼化禄的人生使命在于扶助他人成长，与他人共同建立互信互助的理想环境，展现无私精神与团队精神。",
        positivePoints: ["助人精神", "团队协作佳", "凝聚力强"],
        cautionPoints: ["牺牲自我", "容易迷失个人目标"]
      },
      details: {
        naturalTalents: ["协调能力", "团队建设", "人际修复力"],
        lifeLessons: ["保持自我意识", "设定健康界限", "平衡付出与回收"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "右弼化权在事业上展现隐性领导力，擅长以协调与辅助方式掌控局势，适合在行政、后勤、策略支持等领域成为重要推手。",
        positivePoints: ["协调力强", "暗中掌控局势", "有组织力"],
        cautionPoints: ["权力运作隐晦", "责任归属不清"]
      },
      details: {
        suitableCareers: ["幕僚", "项目协调", "后勤管理"],
        financialOutlook: "通过策略性配合与支援达成财富增长"
      }
    },
    relationships: {
      content: {
        mainText: "右弼化权在人际关系中展现为隐性主导，通过默默付出与支持取得话语权，但需警惕过度干预他人选择。",
        positivePoints: ["柔性主导", "关系协调良好"],
        cautionPoints: ["容易操控他人", "难以放手"]
      },
      details: {
        relationshipStyle: ["柔性领导型", "支持型", "暗中引导型"],
        compatibleSigns: ["左辅", "天梁", "太阴"]
      }
    },
    health: {
      content: {
        mainText: "右弼化权需注意因长期隐性压力积累而产生的内在紧张，需学会主动排解压力，维护神经系统健康。",
        positivePoints: ["耐压能力好", "恢复速度快"],
        cautionPoints: ["慢性压力", "内在紧张"]
      },
      details: {
        strengths: ["恢复能力", "情绪调节能力"],
        areasOfAttention: ["神经系统", "肩颈僵硬"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "右弼化权的人生目标在于透过支持、整合与策略协助，成就团队或组织整体利益，同时发展自身影响力。",
        positivePoints: ["隐性领导", "支持型成就", "凝聚力强"],
        cautionPoints: ["自我价值感低", "过度依赖他人认可"]
      },
      details: {
        naturalTalents: ["整合能力", "组织支援", "策略布局"],
        lifeLessons: ["树立独立自我", "明确自身价值", "主动承担责任"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "右弼化科适合从事组织管理、教育培训、心理咨询等领域，通过辅助与整合才能提升组织效率与社会价值。",
        positivePoints: ["细致周全", "知识丰富", "善于辅导他人"],
        cautionPoints: ["过度配合", "缺乏突破性"]
      },
      details: {
        suitableCareers: ["教育辅导", "组织管理", "心理辅导"],
        financialOutlook: "以知识与服务累积稳定收入"
      }
    },
    relationships: {
      content: {
        mainText: "右弼化科在关系中重视理性沟通与协作，擅长以理解与支持促进关系稳定，但需防止过度理性压抑情感表达。",
        positivePoints: ["理性沟通", "互助合作", "稳定可靠"],
        cautionPoints: ["情感流动不足", "容易压抑自我"]
      },
      details: {
        relationshipStyle: ["支持型", "理性协作型", "教育型"],
        compatibleSigns: ["文昌", "左辅", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "右弼化科有助于养成规律生活和健康管理习惯，但精神压力长期积累时需注意神经性疾病风险。",
        positivePoints: ["健康自律好", "注重身心平衡"],
        cautionPoints: ["精神压力隐匿", "焦虑积压"]
      },
      details: {
        strengths: ["生活规律", "心理管理力"],
        areasOfAttention: ["神经系统", "焦虑症状"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "右弼化科的人生使命在于通过教育、辅导、组织协作贡献社会，用知识与智慧帮助他人成长。",
        positivePoints: ["教育贡献", "助人精神", "智慧传递"],
        cautionPoints: ["缺乏自我突破", "易被组织绑架"]
      },
      details: {
        naturalTalents: ["组织教育", "辅导支持", "知识整合"],
        lifeLessons: ["激发个人潜力", "超越辅助角色", "勇于独立表达"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "右弼化忌在事业上可能因过度依赖他人或缺乏独立主张而受阻，需培养自主性与明确个人定位。",
        positivePoints: ["愿意配合", "乐于服务"],
        cautionPoints: ["缺乏独立性", "随波逐流"]
      },
      details: {
        suitableCareers: ["支持性工作", "协作辅助岗位"],
        financialOutlook: "受环境与人际影响大，财富积累波动"
      }
    },
    relationships: {
      content: {
        mainText: "右弼化忌在人际关系中容易因过度迁就或忽视自我需求导致关系失衡，需学会设立清晰界限。",
        positivePoints: ["亲切温暖", "乐于助人"],
        cautionPoints: ["关系失衡", "容易自我牺牲"]
      },
      details: {
        relationshipStyle: ["配合型", "支持型", "低调型"],
        compatibleSigns: ["左辅", "天同", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "右弼化忌对健康影响表现在长期情绪压抑导致慢性压力与神经系统问题，建议重视自我表达与情绪释放。",
        positivePoints: ["身体适应力好", "恢复快"],
        cautionPoints: ["心理压抑", "慢性疲劳"]
      },
      details: {
        strengths: ["忍耐力强", "适应性好"],
        areasOfAttention: ["情绪压抑", "神经紧绷"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "右弼化忌的人生课题在于学习在助人之中不迷失自我，找到既能支持他人又能成就自己的平衡道路。",
        positivePoints: ["助人精神", "团队意识"],
        cautionPoints: ["自我价值感弱", "容易情绪消耗"]
      },
      details: {
        naturalTalents: ["辅佐才能", "协调力"],
        lifeLessons: ["确立个人目标", "坚持自我原则", "避免情绪依赖"]
      }
    }
  }
},
"左輔": {
  "祿": {
    career: {
      content: {
        mainText: "左辅化禄在事业上象征组织力强、人缘好，适合从事团队管理、辅助领导、行政协调等领域，能因可靠形象获得事业机会。",
        positivePoints: ["组织力强", "合作顺利", "受上级器重"],
        cautionPoints: ["依赖团队", "缺乏独立决策力"]
      },
      details: {
        suitableCareers: ["行政管理", "团队协调", "企业顾问"],
        financialOutlook: "通过组织与协作能力稳步积累财富"
      }
    },
    relationships: {
      content: {
        mainText: "左辅化禄在人际关系中表现为忠诚可靠、乐于助人，容易获得朋友与伴侣的信赖，适合建立稳固、持久的关系。",
        positivePoints: ["忠诚守信", "支持力强", "关系稳定"],
        cautionPoints: ["过于付出", "界限感需加强"]
      },
      details: {
        relationshipStyle: ["忠诚型", "支持型", "责任型"],
        compatibleSigns: ["右弼", "天梁", "天相"]
      }
    },
    health: {
      content: {
        mainText: "左辅化禄有助于形成规律健康的生活习惯，但需注意因过度工作或助人而忽略自身休息。",
        positivePoints: ["体力充沛", "自我调节能力强"],
        cautionPoints: ["工作过劳", "忽略自身需求"]
      },
      details: {
        strengths: ["身体耐力", "免疫系统"],
        areasOfAttention: ["肩颈酸痛", "肠胃负担"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "左辅化禄的人生目标是以辅佐与支持角色成就大局，在团队中发挥关键整合与辅助力量。",
        positivePoints: ["助人成就", "合作精神强", "责任心重"],
        cautionPoints: ["缺乏个人主张", "需建立个人价值感"]
      },
      details: {
        naturalTalents: ["团队整合", "助人协调", "稳定支持"],
        lifeLessons: ["坚持自我立场", "设定健康界限", "主动发展领导力"]
      }
    }
  },
  "權": {
    career: {
      content: {
        mainText: "左辅化权代表在组织体系内的实际影响力上升，擅长调配资源与推动计划，适合担任幕僚长、项目总协调等角色。",
        positivePoints: ["资源整合能力强", "执行力出色", "组织管理佳"],
        cautionPoints: ["权责界限模糊", "承担过多事务"]
      },
      details: {
        suitableCareers: ["项目总监", "行政高管", "资源管理"],
        financialOutlook: "通过管理与协调获得财富与地位"
      }
    },
    relationships: {
      content: {
        mainText: "左辅化权在人际关系中展现出隐性领导地位，以实际行动赢得他人尊敬，但需注意避免承担他人过多责任。",
        positivePoints: ["实际行动带动关系", "可靠领导"],
        cautionPoints: ["负担感强", "情感交流需加强"]
      },
      details: {
        relationshipStyle: ["实际型", "辅助型", "领导型"],
        compatibleSigns: ["右弼", "天梁", "紫微"]
      }
    },
    health: {
      content: {
        mainText: "左辅化权需注意因职责繁重导致的慢性疲劳问题，特别是肩背压力和消化系统健康。",
        positivePoints: ["行动力佳", "恢复能力好"],
        cautionPoints: ["过度操劳", "压力型疾病"]
      },
      details: {
        strengths: ["恢复力强", "压力适应能力好"],
        areasOfAttention: ["肩颈背部", "肠胃系统"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "左辅化权的人生目标是以幕后掌控与支持方式成就大局，适合在组织架构中发挥稳定推动力量。",
        positivePoints: ["掌控全局", "推进行动", "团队核心"],
        cautionPoints: ["过度隐性付出", "自我价值感隐匿"]
      },
      details: {
        naturalTalents: ["组织策划", "协调管理", "执行推动"],
        lifeLessons: ["强化自我主导", "平衡支持与自我实现", "界定清晰责任"]
      }
    }
  },
  "科": {
    career: {
      content: {
        mainText: "左辅化科擅长在系统化、标准化环境下提升组织效率，适合制度建设、流程优化、教育训练等工作。",
        positivePoints: ["制度观念强", "执行规范", "优化能力佳"],
        cautionPoints: ["过于程序化", "缺乏灵活应变"]
      },
      details: {
        suitableCareers: ["制度规划", "流程优化师", "教育培训"],
        financialOutlook: "以稳定专业服务换取长期收益"
      }
    },
    relationships: {
      content: {
        mainText: "左辅化科在关系中注重规则与责任，喜欢以规范与标准维护关系稳定，但情感流动性需加强。",
        positivePoints: ["责任感强", "关系稳固"],
        cautionPoints: ["表达拘谨", "情感流动不足"]
      },
      details: {
        relationshipStyle: ["制度型", "责任型", "稳重型"],
        compatibleSigns: ["右弼", "天同", "天梁"]
      }
    },
    health: {
      content: {
        mainText: "左辅化科有良好的自律性与健康习惯，但因心理压力可能带来神经系统与肠胃功能失调问题。",
        positivePoints: ["生活规律", "健康意识高"],
        cautionPoints: ["精神压力积压", "神经紧张"]
      },
      details: {
        strengths: ["免疫力佳", "身体协调性好"],
        areasOfAttention: ["神经系统", "消化系统"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "左辅化科的人生使命是以制度建设、规范推广、助人优化成长为目标，适合扮演规则制定者与执行者角色。",
        positivePoints: ["制度建设力", "秩序维护者"],
        cautionPoints: ["过度程序化", "缺乏弹性应变"]
      },
      details: {
        naturalTalents: ["规范制定", "程序优化", "教育培训"],
        lifeLessons: ["提升变通能力", "情感融入规范", "人性化管理"]
      }
    }
  },
  "忌": {
    career: {
      content: {
        mainText: "左辅化忌在事业上容易因过度拘泥规则或依赖团队支持而限制发展，需学会独立决策与灵活应变。",
        positivePoints: ["责任心重", "配合意识好"],
        cautionPoints: ["缺乏突破", "依赖组织"]
      },
      details: {
        suitableCareers: ["辅助型岗位", "行政支持"],
        financialOutlook: "收入起伏受制于组织环境变化"
      }
    },
    relationships: {
      content: {
        mainText: "左辅化忌在人际关系中过于强调责任与规范，导致情感交流受限，容易让关系僵化。",
        positivePoints: ["愿意承担责任", "关系稳重"],
        cautionPoints: ["感情表达不足", "过度强调规则"]
      },
      details: {
        relationshipStyle: ["责任型", "辅助型", "规范型"],
        compatibleSigns: ["右弼", "天相", "文昌"]
      }
    },
    health: {
      content: {
        mainText: "左辅化忌需注意长期压力累积导致的慢性疾病，尤其是消化系统与肩颈压力问题，需适度放松身心。",
        positivePoints: ["自律强", "身体耐力佳"],
        cautionPoints: ["精神压抑", "慢性疲劳"]
      },
      details: {
        strengths: ["耐力好", "自我要求高"],
        areasOfAttention: ["消化系统", "神经紧张"]
      }
    },
    lifePurpose: {
      content: {
        mainText: "左辅化忌的人生课题是学会在规则中保持灵活性与情感流动，避免陷入责任束缚而失去自我。",
        positivePoints: ["组织能力", "规范意识"],
        cautionPoints: ["缺乏弹性", "容易被责任压垮"]
      },
      details: {
        naturalTalents: ["组织规范", "责任担当"],
        lifeLessons: ["释放控制欲", "培养弹性思维", "情感与制度并行"]
      }
    }
  }
}
};

/**
 * Function to generate analysis text based on chart data and transformations
 * @param chartData - The calculated chart data
 * @returns Analysis text for different life aspects
 */
export function generateAnalysis(chartData: any) {
  // Log chart data for debugging
  console.log("Chart data for analysis:", chartData);
  
  // Create properly typed result objects
  const emptyAnalysisContent: AnalysisContent = {
    mainText: "",
    positivePoints: [],
    cautionPoints: []
  };
  
  const emptyCareerDetails: CareerAnalysis = {
    suitableCareers: [],
    financialOutlook: ""
  };
  
  const emptyRelationshipDetails: RelationshipAnalysis = {
    relationshipStyle: [],
    compatibleSigns: []
  };
  
  const emptyHealthDetails: HealthAnalysis = {
    strengths: [],
    areasOfAttention: []
  };
  
  const emptyLifePurposeDetails: LifePurposeAnalysis = {
    naturalTalents: [],
    lifeLessons: []
  };
  
  // Results object to store analysis with proper typing
  const results = {
    career: {
      content: { ...emptyAnalysisContent },
      details: { ...emptyCareerDetails }
    },
    relationships: {
      content: { ...emptyAnalysisContent },
      details: { ...emptyRelationshipDetails }
    },
    health: {
      content: { ...emptyAnalysisContent },
      details: { ...emptyHealthDetails }
    },
    lifePurpose: {
      content: { ...emptyAnalysisContent },
      details: { ...emptyLifePurposeDetails }
    }
  };
  
  // Get transformations directly from the chart data structure
  const transformations = chartData.transformations || {};
  
  console.log("Transformations for analysis:", transformations);
  
  // Process each of the four transformations
  if (transformations) {
    // Handle 化禄 (Prosperity)
    if (transformations.huaLu && FOUR_TRANSFORMATIONS_ANALYSIS[transformations.huaLu]) {
      console.log("Found huaLu transformation:", transformations.huaLu);
      const luAnalysis = FOUR_TRANSFORMATIONS_ANALYSIS[transformations.huaLu]["祿"];
      if (luAnalysis) {
        Object.assign(results.career, luAnalysis.career);
      }
    }
    
    // Handle 化权 (Power)
    if (transformations.huaQuan && FOUR_TRANSFORMATIONS_ANALYSIS[transformations.huaQuan]) {
      console.log("Found huaQuan transformation:", transformations.huaQuan);
      const quanAnalysis = FOUR_TRANSFORMATIONS_ANALYSIS[transformations.huaQuan]["權"];
      if (quanAnalysis) {
        Object.assign(results.lifePurpose, quanAnalysis.lifePurpose);
      }
    }
    
    // Handle 化科 (Academic/Skills)
    if (transformations.huaKe && FOUR_TRANSFORMATIONS_ANALYSIS[transformations.huaKe]) {
      console.log("Found huaKe transformation:", transformations.huaKe);
      const keAnalysis = FOUR_TRANSFORMATIONS_ANALYSIS[transformations.huaKe]["科"];
      if (keAnalysis) {
        Object.assign(results.health, keAnalysis.health);
      }
    }
    
    // Handle 化忌 (Obstacles)
    if (transformations.huaJi && FOUR_TRANSFORMATIONS_ANALYSIS[transformations.huaJi]) {
      console.log("Found huaJi transformation:", transformations.huaJi);
      const jiAnalysis = FOUR_TRANSFORMATIONS_ANALYSIS[transformations.huaJi]["忌"];
      if (jiAnalysis) {
        Object.assign(results.relationships, jiAnalysis.relationships);
      }
    }
  }
  
  // If we still don't have analysis, provide default data
  // Check career section
  if (!results.career.content.mainText) {
    results.career = {
      content: {
        mainText: "您的事业运势将取决于个人努力和时机把握。适合从事需要分析能力和创造力的工作，财务状况有望稳定发展。",
        positivePoints: ["分析能力", "创新思维", "适应能力"],
        cautionPoints: ["需要提高执行力", "避免优柔寡断"]
      },
      details: {
        suitableCareers: ["研究分析", "顾问咨询", "创意行业"],
        financialOutlook: "通过稳健努力获得稳定收入"
      }
    };
  }
  
  // Check relationships section
  if (!results.relationships.content.mainText) {
    results.relationships = {
      content: {
        mainText: "您的人际关系整体和谐，但需要注意沟通方式和情感表达。家庭关系中需要更多耐心和包容，伴侣关系需要共同成长。",
        positivePoints: ["忠诚可靠", "理性思考", "问题解决能力"],
        cautionPoints: ["情感表达可加强", "需要更多耐心"]
      },
      details: {
        relationshipStyle: ["稳定", "理性", "负责"],
        compatibleSigns: ["水相星座", "土相星座"]
      }
    };
  }
  
  // Check health section
  if (!results.health.content.mainText) {
    results.health = {
      content: {
        mainText: "您的整体健康状况良好，但需要注意压力管理和充分休息。建立健康的生活习惯和规律的运动对您尤为重要。",
        positivePoints: ["自愈能力强", "健康意识高", "适应能力好"],
        cautionPoints: ["压力管理需加强", "休息质量需提高"]
      },
      details: {
        strengths: ["免疫系统", "恢复能力"],
        areasOfAttention: ["神经系统", "消化系统"]
      }
    };
  }
  
  // Check life purpose section
  if (!results.lifePurpose.content.mainText) {
    results.lifePurpose = {
      content: {
        mainText: "您的人生目标可能与知识追求、帮助他人或创造价值相关。通过不断学习和成长，您能够在自己擅长的领域做出贡献。",
        positivePoints: ["自我驱动", "终身学习", "价值导向"],
        cautionPoints: ["需要明确方向", "避免过度分散精力"]
      },
      details: {
        naturalTalents: ["学习能力", "思考能力", "适应能力"],
        lifeLessons: ["专注与坚持", "平衡与和谐", "知行合一"]
      }
    };
  }
  
  console.log("Final analysis results:", results);
  return results;
} 