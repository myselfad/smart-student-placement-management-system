export interface EligibilityCriterionResult {
  type: string;
  requiredValue: any;
  studentValue: any;
  isMet: boolean;
  message: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  criteria: EligibilityCriterionResult[];
}

export interface ProfileSnapshot {
  cgpa?: number | null;
  branch?: string | null;
  backlogCount?: number | null;
  graduationYear?: number | null;
  skills?: string[];
}

export interface DriveCriteria {
  minCgpa?: number | null;
  allowedBranches?: string[];
  maxBacklogs?: number | null;
  allowedGraduationYears?: number[];
  requiredSkills?: string[];
}

export class EligibilityEngine {
  static evaluate(profile: ProfileSnapshot, criteria: DriveCriteria | null): EligibilityResult {
    if (!criteria) {
      return { isEligible: true, criteria: [] };
    }

    const results: EligibilityCriterionResult[] = [];

    // CGPA Rule
    if (criteria.minCgpa !== null && criteria.minCgpa !== undefined) {
      const studentCgpa = profile.cgpa ?? 0;
      const isMet = studentCgpa >= criteria.minCgpa;
      results.push({
        type: "MIN_CGPA",
        requiredValue: criteria.minCgpa,
        studentValue: profile.cgpa,
        isMet,
        message: isMet 
          ? `✓ CGPA requirement satisfied — required ≥ ${criteria.minCgpa}, yours is ${studentCgpa}`
          : `✕ Minimum CGPA: ${criteria.minCgpa} — Your CGPA: ${profile.cgpa == null ? 'Not provided' : studentCgpa}`
      });
    }

    // Branch Rule
    if (criteria.allowedBranches && criteria.allowedBranches.length > 0) {
      const studentBranch = profile.branch;
      const isMet = !!studentBranch && criteria.allowedBranches.includes(studentBranch);
      results.push({
        type: "ALLOWED_BRANCHES",
        requiredValue: criteria.allowedBranches,
        studentValue: studentBranch,
        isMet,
        message: isMet
          ? `✓ Branch requirement satisfied — ${studentBranch} is allowed`
          : `✕ Allowed Branches: ${criteria.allowedBranches.join(", ")} — Your Branch: ${studentBranch || 'Not provided'}`
      });
    }

    // Backlogs Rule
    if (criteria.maxBacklogs !== null && criteria.maxBacklogs !== undefined) {
      const studentBacklogs = profile.backlogCount ?? 0;
      const isMet = studentBacklogs <= criteria.maxBacklogs;
      results.push({
        type: "MAX_BACKLOGS",
        requiredValue: criteria.maxBacklogs,
        studentValue: profile.backlogCount,
        isMet,
        message: isMet
          ? `✓ Backlog requirement satisfied — required ≤ ${criteria.maxBacklogs}, yours is ${studentBacklogs}`
          : `✕ Maximum Backlogs: ${criteria.maxBacklogs} — Your Backlogs: ${profile.backlogCount == null ? 'Not provided' : studentBacklogs}`
      });
    }

    // Graduation Year Rule
    if (criteria.allowedGraduationYears && criteria.allowedGraduationYears.length > 0) {
      const studentYear = profile.graduationYear;
      const isMet = !!studentYear && criteria.allowedGraduationYears.includes(studentYear);
      results.push({
        type: "GRADUATION_YEAR",
        requiredValue: criteria.allowedGraduationYears,
        studentValue: studentYear,
        isMet,
        message: isMet
          ? `✓ Graduation year satisfied — ${studentYear} is allowed`
          : `✕ Allowed Graduation Years: ${criteria.allowedGraduationYears.join(", ")} — Your Year: ${studentYear || 'Not provided'}`
      });
    }

    // Skills Rule
    if (criteria.requiredSkills && criteria.requiredSkills.length > 0) {
      const studentSkills = profile.skills || [];
      const missingSkills = criteria.requiredSkills.filter(s => !studentSkills.includes(s));
      const isMet = missingSkills.length === 0;
      
      results.push({
        type: "REQUIRED_SKILLS",
        requiredValue: criteria.requiredSkills,
        studentValue: studentSkills,
        isMet,
        message: isMet
          ? `✓ Required skills satisfied`
          : `✕ Missing Required Skills: ${missingSkills.join(", ")}`
      });
    }

    const isEligible = results.every(r => r.isMet);
    
    // Check if any critical profile field is completely missing making it unable to evaluate properly
    if (!isEligible) {
      for (const res of results) {
        if (!res.isMet && res.studentValue == null) {
          res.message = `Unable to evaluate — complete your profile for ${res.type}`;
        }
      }
    }

    return {
      isEligible,
      criteria: results
    };
  }
}
