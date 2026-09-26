// VoltSage Pilot Feedback Form — question bank, branching logic and
// validation helpers. Structure follows "VoltSage Pilot Feedback Form —
// Question Flow & Branching Logic" exactly: Section 1 is always shown,
// Section 1's Q1 (role) determines whether Section 2A / 2B / 2C is shown,
// Sections 3–6 are always shown, Section 7 is shown only for Professional
// Users, Section 8 only for End Users, and Sections 9–10 close every path.

export type RoleValue =
  | 'installer'
  | 'manufacturer'
  | 'distributor'
  | 'engineer'
  | 'farmer'
  | 'residential'
  | 'sme'
  | 'ngo'
  | 'other'

export type RoleGroup = 'professional' | 'enduser' | 'other'

export const ROLE_OPTIONS: { value: RoleValue; label: string }[] = [
  { value: 'installer', label: 'Solar installer / EPC' },
  { value: 'manufacturer', label: 'Solar equipment manufacturer' },
  { value: 'distributor', label: 'Solar equipment distributor / supplier' },
  { value: 'engineer', label: 'Engineer / energy consultant' },
  { value: 'farmer', label: 'Farmer / agricultural business' },
  { value: 'residential', label: 'Residential customer' },
  { value: 'sme', label: 'Small / medium business' },
  { value: 'ngo', label: 'NGO / development organisation' },
  { value: 'other', label: 'Other' },
]

export const ROLE_GROUP: Record<RoleValue, RoleGroup> = {
  installer: 'professional',
  manufacturer: 'professional',
  distributor: 'professional',
  engineer: 'professional',
  ngo: 'professional',
  farmer: 'enduser',
  residential: 'enduser',
  sme: 'enduser',
  other: 'other',
}

export const ROLE_LABEL: Record<RoleValue, string> = Object.fromEntries(
  ROLE_OPTIONS.map(o => [o.value, o.label])
) as Record<RoleValue, string>

export type QuestionType = 'single' | 'multi' | 'scale' | 'matrix' | 'short' | 'long' | 'yesno'

interface QuestionCommon {
  id: string
  ref: string
  prompt: string
  required: boolean
  helper?: string
}

export interface ChoiceQuestion extends QuestionCommon {
  type: 'single' | 'multi'
  options: string[]
  max?: number
  /** Last option is "Other" — reveal a free-text field when it's selected. */
  allowOther?: boolean
}

export interface ScaleQuestion extends QuestionCommon {
  type: 'scale'
  minLabel: string
  maxLabel: string
}

export interface MatrixQuestion extends QuestionCommon {
  type: 'matrix'
  rows: string[]
  columns: string[]
}

export interface TextQuestion extends QuestionCommon {
  type: 'short' | 'long'
  placeholder?: string
  maxLength?: number
}

export interface YesNoQuestion extends QuestionCommon {
  type: 'yesno'
}

export type Question = ChoiceQuestion | ScaleQuestion | MatrixQuestion | TextQuestion | YesNoQuestion

export interface FeedbackSection {
  id: string
  ref: string
  title: string
  description?: string
  questions: Question[]
}

// ---------------------------------------------------------------------------
// SECTION 1 — ABOUT THE RESPONDENT (all respondents)
// ---------------------------------------------------------------------------
export const SECTION_1: FeedbackSection = {
  id: 'respondent',
  ref: 'Section 1',
  title: 'About you',
  questions: [
    {
      id: 'role', ref: 'Q1', type: 'single', required: true,
      prompt: 'What best describes your role?',
      options: ROLE_OPTIONS.map(o => o.label),
    },
    {
      id: 'orgName', ref: 'Q2', type: 'short', required: true,
      prompt: 'What is your organisation/business?',
    },
    {
      id: 'roleTitle', ref: 'Q3', type: 'short', required: true,
      prompt: 'What is your role within the organisation?',
    },
    {
      id: 'projectsPerMonth', ref: 'Q4', type: 'single', required: true,
      prompt: 'Approximately how many solar/energy projects do you assess or work with per month?',
      options: ['0–5', '6–10', '11–25', '26–50', 'More than 50', 'Not applicable'],
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 2A — PROFESSIONAL USER
// ---------------------------------------------------------------------------
export const SECTION_2A: FeedbackSection = {
  id: 'professionalUser',
  ref: 'Section 2A',
  title: 'Your current process',
  questions: [
    {
      id: 'assessMethod', ref: 'Q5', type: 'multi', required: true, max: 5,
      prompt: 'How do you currently assess a customer\u2019s energy requirements?',
      helper: 'Select up to 5.',
      allowOther: true,
      options: [
        'Spreadsheet', 'Paper/manual calculations', 'Existing solar sizing software',
        'Manufacturer sizing software', 'Calculator/basic estimates', 'In-house software',
        'Site assessment', 'Customer interview/questionnaire', 'Other',
      ],
    },
    {
      id: 'assessTime', ref: 'Q6', type: 'single', required: true,
      prompt: 'Approximately how long does a typical initial assessment take?',
      options: ['Less than 15 minutes', '15\u201330 minutes', '30\u201360 minutes', '1\u20132 hours', 'More than 2 hours', 'Highly variable'],
    },
    {
      id: 'assessChallenges', ref: 'Q7', type: 'multi', required: true, max: 3,
      prompt: 'What are the biggest challenges with your current assessment process?',
      helper: 'Select up to 3.',
      allowOther: true,
      options: [
        'Takes too long', 'Difficult to collect accurate client information',
        'Customers don\u2019t know appliance/equipment ratings', 'Difficult to establish usage patterns',
        'Risk of undersizing', 'Risk of oversizing', 'Calculations are inconsistent',
        'Too dependent on technical personnel', 'Difficult to assess remote customers',
        'Difficult to explain results to customers', 'Difficult to document assessments',
        'Difficult to compare scenarios', 'Other',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 2B — END USER
// ---------------------------------------------------------------------------
export const SECTION_2B: FeedbackSection = {
  id: 'endUser',
  ref: 'Section 2B',
  title: 'Before you used VoltSage',
  questions: [
    {
      id: 'sizeConfidenceBefore', ref: 'Q5', type: 'scale', required: true,
      prompt: 'Before using VoltSage, how confident were you that you knew what size solar system you needed?',
      minLabel: 'Not confident at all', maxLabel: 'Very confident',
    },
    {
      id: 'sizingPlan', ref: 'Q6', type: 'single', required: true,
      prompt: 'How were you planning to determine the size of your solar system?',
      allowOther: true,
      options: [
        'Installer recommendation', 'Preconfigured solar package', 'My own calculations',
        'Previous system experience', 'Manufacturer recommendation', 'I wasn\u2019t sure', 'Other',
      ],
    },
    {
      id: 'sizingConcerns', ref: 'Q7', type: 'multi', required: false,
      prompt: 'What concerns did you have about choosing the wrong system size?',
      allowOther: true,
      options: [
        'System may be too small', 'System may be unnecessarily expensive',
        'Battery may not last long enough', 'Inverter may not handle my loads',
        'Solar panels may not produce enough energy', 'I wasn\u2019t sure what I needed',
        'I had no particular concern', 'Other',
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 2C — OTHER USER
// ---------------------------------------------------------------------------
export const SECTION_2C: FeedbackSection = {
  id: 'otherUser',
  ref: 'Section 2C',
  title: 'Your involvement',
  questions: [
    {
      id: 'otherInvolvement', ref: 'Q5', type: 'long', required: true,
      prompt: 'Briefly describe your involvement with solar or energy projects.',
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 3 — VOLTSAGE PILOT EXPERIENCE (all respondents)
// ---------------------------------------------------------------------------
export const SECTION_3: FeedbackSection = {
  id: 'pilotExperience',
  ref: 'Section 3',
  title: 'Your VoltSage pilot experience',
  questions: [
    {
      id: 'toolsUsed', ref: 'Q8', type: 'multi', required: true,
      prompt: 'Which VoltSage tools did you use?',
      options: [
        'Residential & Small Commercial Solar Sizing Tool', 'Agricultural Solar Sizing Tool',
        'Battery Runtime Calculator', 'DC Cable Sizing Tool',
      ],
    },
    {
      id: 'easeOfUse', ref: 'Q9', type: 'scale', required: true,
      prompt: 'How easy was VoltSage to use?',
      minLabel: 'Very difficult', maxLabel: 'Very easy',
    },
    {
      id: 'clarity', ref: 'Q10', type: 'scale', required: true,
      prompt: 'How clear were the questions and information requested by VoltSage?',
      minLabel: 'Very unclear', maxLabel: 'Very clear',
    },
    {
      id: 'reflectRequirements', ref: 'Q11', type: 'scale', required: true,
      prompt: 'How well did VoltSage reflect the energy requirements of the project you assessed?',
      minLabel: 'Not at all', maxLabel: 'Very well',
    },
    {
      id: 'confidenceResults', ref: 'Q12', type: 'scale', required: true,
      prompt: 'How confident are you in the results produced by VoltSage?',
      minLabel: 'Not confident', maxLabel: 'Very confident',
    },
    {
      id: 'confidenceImprovement', ref: 'Q13', type: 'long', required: false,
      prompt: 'What would increase your confidence in VoltSage\u2019s results?',
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 4 — VALUE CREATED (all respondents)
// ---------------------------------------------------------------------------
export const SECTION_4: FeedbackSection = {
  id: 'valueCreated',
  ref: 'Section 4',
  title: 'Value created',
  questions: [
    {
      id: 'comparison', ref: 'Q14', type: 'matrix', required: true,
      prompt: 'Compared with your previous assessment process, how did VoltSage perform?',
      rows: [
        'Speed of assessment', 'Ease of data collection', 'Consistency of calculations',
        'Understanding of energy demand', 'Preliminary system sizing', 'Understanding battery requirements',
        'Understanding PV requirements', 'Understanding inverter requirements', 'Ability to explain results',
        'Documentation/reporting', 'Overall assessment experience',
      ],
      columns: ['Much worse', 'Worse', 'No significant difference', 'Better', 'Much better', 'Not applicable'],
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 5 — WORKFLOW FIT (all respondents)
// ---------------------------------------------------------------------------
export const SECTION_5: FeedbackSection = {
  id: 'workflowFit',
  ref: 'Section 5',
  title: 'Workflow fit',
  questions: [
    {
      id: 'workflowFit', ref: 'Q15', type: 'multi', required: true,
      prompt: 'Where could VoltSage fit into your current workflow?',
      allowOther: true,
      options: [
        'Initial customer enquiry', 'Customer energy assessment', 'Preliminary system sizing',
        'Sales consultation', 'Quotation preparation', 'Technical review', 'Site assessment',
        'System design', 'Customer education', 'Project documentation', 'Post-installation verification', 'Other',
      ],
    },
    {
      id: 'valuableOutput', ref: 'Q16', type: 'single', required: true,
      prompt: 'Which VoltSage output would be most valuable to you?',
      allowOther: true,
      options: [
        'Daily energy demand', 'Peak demand', 'Minimum inverter requirement', 'Battery requirement',
        'PV array requirement', 'Load/appliance schedule', 'Detailed technical report',
        'Client-friendly report', 'Cable sizing', 'Scenario comparison', 'Other',
      ],
    },
    {
      id: 'timeReduction', ref: 'Q17', type: 'single', required: true,
      prompt: 'Could VoltSage reduce the amount of time your team spends on preliminary assessments?',
      options: ['Yes, significantly', 'Yes, somewhat', 'Possibly', 'No', 'Not applicable'],
    },
    {
      id: 'scaleCapacity', ref: 'Q18', type: 'single', required: true,
      prompt: 'Could VoltSage allow your organisation to handle more assessments without proportionally increasing technical workload?',
      options: ['Yes', 'Possibly', 'No', 'Not sure', 'Not applicable'],
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 6 — ADOPTION (all respondents)
// ---------------------------------------------------------------------------
export const SECTION_6: FeedbackSection = {
  id: 'adoption',
  ref: 'Section 6',
  title: 'Adoption',
  questions: [
    {
      id: 'usefulness', ref: 'Q19', type: 'scale', required: true,
      prompt: 'Based on your experience, how useful would VoltSage be to you or your organisation?',
      minLabel: 'Not useful', maxLabel: 'Extremely useful',
    },
    {
      id: 'wouldAdopt', ref: 'Q20', type: 'single', required: true,
      prompt: 'Would you consider incorporating VoltSage into your normal workflow?',
      options: ['Yes', 'Possibly', 'Not at this stage', 'No'],
    },
    {
      id: 'adoptionBlockers', ref: 'Q21', type: 'long', required: false,
      prompt: 'What would need to change or be added before you would use VoltSage regularly?',
    },
    {
      id: 'topImprovement', ref: 'Q22', type: 'long', required: true,
      prompt: 'What is the ONE thing you would most like VoltSage to improve?',
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 7 — COMMERCIALIZATION (Professional User only)
// ---------------------------------------------------------------------------
export const SECTION_7: FeedbackSection = {
  id: 'commercialization',
  ref: 'Section 7',
  title: 'Commercialization',
  description: 'Shown to professional respondents (installers, manufacturers, distributors, engineers/consultants and NGOs).',
  questions: [
    {
      id: 'pricingModel', ref: 'Q23', type: 'single', required: true,
      prompt: 'Which pricing model would make the most sense for your organisation?',
      options: [
        'Monthly subscription', 'Annual subscription', 'Pay per assessment', 'Pay per user',
        'Company / enterprise licence', 'Included as part of another service', 'Not sure',
      ],
    },
    {
      id: 'priceRange', ref: 'Q24', type: 'single', required: true,
      prompt: 'What would you consider a reasonable monthly price for a professional VoltSage subscription?',
      options: [
        'Less than US$25', 'US$25\u201350', 'US$50\u2013100', 'US$100\u2013250', 'US$250\u2013500',
        'More than US$500', 'I would need more information before estimating',
      ],
    },
    {
      id: 'worthPaying', ref: 'Q25', type: 'long', required: false,
      prompt: 'What would make VoltSage worth paying for?',
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 8 — END USER VALUE (Farmer, Residential Customer or SME only)
// ---------------------------------------------------------------------------
export const SECTION_8: FeedbackSection = {
  id: 'endUserValue',
  ref: 'Section 8',
  title: 'What you got out of it',
  description: 'Shown to farmers, residential customers and small/medium businesses.',
  questions: [
    {
      id: 'confidenceAfter', ref: 'Q23', type: 'scale', required: true,
      prompt: 'After using VoltSage, how confident are you that you understand the size of system you need?',
      minLabel: 'Not confident', maxLabel: 'Very confident',
    },
    {
      id: 'helpedUnderstand', ref: 'Q24', type: 'single', required: true,
      prompt: 'Did VoltSage help you understand why a particular system size may be appropriate for your needs?',
      options: ['Yes, significantly', 'Yes, somewhat', 'Not really', 'No'],
    },
    {
      id: 'mostUsefulLearning', ref: 'Q25', type: 'long', required: true,
      prompt: 'What was the most useful thing you learned from the assessment?',
    },
    {
      id: 'choosePreconfigured', ref: 'Q26', type: 'single', required: true,
      prompt: 'After using VoltSage, would you be more likely to choose a solar system based on your actual energy requirements rather than simply selecting a preconfigured package?',
      options: ['Definitely', 'Probably', 'Maybe', 'Probably not', 'No'],
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 9 — PRODUCT-MARKET SIGNAL (all respondents)
// ---------------------------------------------------------------------------
export const SECTION_9: FeedbackSection = {
  id: 'productMarket',
  ref: 'Section 9',
  title: 'Product-market signal',
  questions: [
    {
      id: 'whatMiss', ref: 'Q27', type: 'long', required: true,
      prompt: 'If VoltSage disappeared tomorrow, what would you miss about it?',
    },
    {
      id: 'wouldRecommend', ref: 'Q28', type: 'single', required: true,
      prompt: 'Would you recommend VoltSage to someone who needs to assess a solar system?',
      options: ['Definitely', 'Probably', 'Maybe', 'Probably not', 'Definitely not'],
    },
    {
      id: 'followUpInterest', ref: 'Q29', type: 'single', required: true,
      prompt: 'Would you be interested in discussing how VoltSage could be integrated into your organisation\u2019s workflow?',
      options: ['Yes \u2014 please contact me', 'Maybe \u2014 I\u2019d like more information', 'Not at this stage', 'No'],
    },
    {
      id: 'anythingElse', ref: 'Q30', type: 'long', required: false,
      prompt: 'Is there anything else you would like us to know?',
    },
  ],
}

// ---------------------------------------------------------------------------
// SECTION 10 — FOLLOW-UP (all respondents)
// ---------------------------------------------------------------------------
export const SECTION_10: FeedbackSection = {
  id: 'followUp',
  ref: 'Section 10',
  title: 'Follow-up',
  questions: [
    { id: 'name', ref: 'Q31', type: 'short', required: true, prompt: 'Name' },
    { id: 'organisation', ref: 'Q32', type: 'short', required: true, prompt: 'Organisation' },
    { id: 'contactInfo', ref: 'Q33', type: 'short', required: false, prompt: 'Email / Phone' },
    { id: 'okFollowUp', ref: 'Q34', type: 'yesno', required: true, prompt: 'May the VoltSage team contact you for a short follow-up discussion?' },
  ],
}

export const ALL_SECTIONS_BY_ID: Record<string, FeedbackSection> = {
  [SECTION_1.id]: SECTION_1,
  [SECTION_2A.id]: SECTION_2A,
  [SECTION_2B.id]: SECTION_2B,
  [SECTION_2C.id]: SECTION_2C,
  [SECTION_3.id]: SECTION_3,
  [SECTION_4.id]: SECTION_4,
  [SECTION_5.id]: SECTION_5,
  [SECTION_6.id]: SECTION_6,
  [SECTION_7.id]: SECTION_7,
  [SECTION_8.id]: SECTION_8,
  [SECTION_9.id]: SECTION_9,
  [SECTION_10.id]: SECTION_10,
}

/**
 * Builds the ordered list of sections a respondent walks through, per the
 * ROLE BASED BRANCHING box in the flow chart. Section 1 is always first;
 * once a role is chosen the rest of the path is fully determined.
 */
export function getSections(role: RoleValue | ''): FeedbackSection[] {
  const sections: FeedbackSection[] = [SECTION_1]
  if (!role) return sections
  const group = ROLE_GROUP[role]

  if (group === 'professional') sections.push(SECTION_2A)
  else if (group === 'enduser') sections.push(SECTION_2B)
  else sections.push(SECTION_2C)

  sections.push(SECTION_3, SECTION_4, SECTION_5, SECTION_6)

  if (group === 'professional') sections.push(SECTION_7)
  else if (group === 'enduser') sections.push(SECTION_8)

  sections.push(SECTION_9, SECTION_10)
  return sections
}

/**
 * Every question across every branch, flattened once. Section 2A/2B/2C and
 * 7/8 are mutually-exclusive paths but use distinct field ids, so this list
 * has no collisions — it's used to build a canonical, fixed-column record
 * for storage (unanswered/skipped-branch fields come through as null).
 */
export const ALL_QUESTIONS: Question[] = [
  ...SECTION_1.questions,
  ...SECTION_2A.questions,
  ...SECTION_2B.questions,
  ...SECTION_2C.questions,
  ...SECTION_3.questions,
  ...SECTION_4.questions,
  ...SECTION_5.questions,
  ...SECTION_6.questions,
  ...SECTION_7.questions,
  ...SECTION_8.questions,
  ...SECTION_9.questions,
  ...SECTION_10.questions,
]

export type Answers = Record<string, any>

export function isAnswered(q: Question, value: any): boolean {
  switch (q.type) {
    case 'single':
    case 'yesno':
      return typeof value === 'string' && value.trim().length > 0
    case 'multi':
      return Array.isArray(value) && value.length > 0
    case 'scale':
      return typeof value === 'number' && value >= 1 && value <= 5
    case 'matrix': {
      if (!value || typeof value !== 'object') return false
      return q.rows.every(r => typeof value[r] === 'string' && value[r].length > 0)
    }
    case 'short':
    case 'long':
      return typeof value === 'string' && value.trim().length > 0
    default:
      return false
  }
}

/** Returns the ids of required questions in a section that are still unanswered. */
export function sectionMissing(section: FeedbackSection, answers: Answers): string[] {
  return section.questions
    .filter(q => q.required && !isAnswered(q, answers[q.id]))
    .map(q => q.id)
}

export function sectionIsValid(section: FeedbackSection, answers: Answers): boolean {
  return sectionMissing(section, answers).length === 0
}
