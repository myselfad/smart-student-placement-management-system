import { EligibilityEngine, ProfileSnapshot, DriveCriteria } from './eligibility.engine';

describe('EligibilityEngine', () => {
  const baseProfile: ProfileSnapshot = {
    cgpa: 8.0,
    backlogCount: 0,
    branch: 'CSE',
    graduationYear: 2024,
    skills: ['JavaScript', 'TypeScript', 'React'],
  };

  const baseCriteria: DriveCriteria = {
    minCgpa: 7.0,
    maxBacklogs: 2,
    allowedBranches: ['CSE', 'IT'],
    allowedGraduationYears: [2024],
  };

  it('should evaluate eligible when all criteria meet', () => {
    const result = EligibilityEngine.evaluate(baseProfile, baseCriteria);
    expect(result.isEligible).toBe(true);
    expect(result.criteria.every(c => c.isMet)).toBe(true);
  });

  it('should fail when CGPA is too low', () => {
    const profile = { ...baseProfile, cgpa: 6.5 };
    const result = EligibilityEngine.evaluate(profile, baseCriteria);
    
    expect(result.isEligible).toBe(false);
    const cgpaCheck = result.criteria.find(c => c.type === 'MIN_CGPA');
    expect(cgpaCheck?.isMet).toBe(false);
  });

  it('should fail when backlogs exceed limit', () => {
    const profile = { ...baseProfile, backlogCount: 3 };
    const result = EligibilityEngine.evaluate(profile, baseCriteria);
    
    expect(result.isEligible).toBe(false);
    const backlogCheck = result.criteria.find(c => c.type === 'MAX_BACKLOGS');
    expect(backlogCheck?.isMet).toBe(false);
  });

  it('should fail when branch is not allowed', () => {
    const profile = { ...baseProfile, branch: 'ECE' };
    const result = EligibilityEngine.evaluate(profile, baseCriteria);
    
    expect(result.isEligible).toBe(false);
    const branchCheck = result.criteria.find(c => c.type === 'ALLOWED_BRANCHES');
    expect(branchCheck?.isMet).toBe(false);
  });

  it('should fail when batch is not allowed', () => {
    const profile = { ...baseProfile, graduationYear: 2025 };
    const result = EligibilityEngine.evaluate(profile, baseCriteria);
    
    expect(result.isEligible).toBe(false);
    const batchCheck = result.criteria.find(c => c.type === 'GRADUATION_YEAR');
    expect(batchCheck?.isMet).toBe(false);
  });
});
