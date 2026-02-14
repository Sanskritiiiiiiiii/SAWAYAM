import React from 'react';
import { Badge } from './ui/badge';
import { CheckCircle2 } from 'lucide-react';

const AVAILABLE_SKILLS = [
  'Cleaning', 'Cooking', 'Delivery', 'Beauty Services',
  'Tutoring', 'Caregiving', 'Gardening', 'Pet Care',
  'Laundry', 'Driving', 'Tailoring', 'Painting'
];

export const SkillsSelector = ({ selectedSkills, onSkillsChange }) => {
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-[#1C1917]">Your Skills</label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_SKILLS.map((skill) => {
          const isSelected = selectedSkills.includes(skill);
          return (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-[#EA580C] text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
              data-testid={`skill-${skill.toLowerCase().replace(' ', '-')}`}
            >
              {skill}
              {isSelected && <CheckCircle2 className="inline-block ml-2 h-4 w-4" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const VerificationBadges = ({ verifications }) => {
  const badges = [
    { key: 'phone_verified', label: 'Phone Verified', icon: '📱' },
    { key: 'id_verified', label: 'ID Verified', icon: '🆔' },
    { key: 'reference_verified', label: 'Reference Checked', icon: '✅' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(({ key, label, icon }) =>
        verifications[key] && (
          <Badge key={key} className="bg-teal-100 text-teal-700 border-teal-200" data-testid={`badge-${key}`}>
            <span className="mr-1">{icon}</span>
            {label}
          </Badge>
        )
      )}
    </div>
  );
};

export const SkillBadges = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <Badge key={skill} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          {skill}
        </Badge>
      ))}
    </div>
  );
};