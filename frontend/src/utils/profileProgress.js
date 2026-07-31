const profileFields = [
  { key: "first_name", label: "your first name", weight: 10 },
  { key: "last_name", label: "your last name", weight: 10 },
  { key: "bio", label: "a short introduction", weight: 20 },
  { key: "skills", label: "your skills", weight: 20 },
  { key: "university", label: "your university or school", weight: 15 },
  { key: "graduation_year", label: "your graduation year", weight: 10 },
  { key: "resume_url", label: "a portfolio or résumé link", weight: 15 },
];

const hasValue = (value) => (
  value != null
  && (typeof value !== "string" || value.trim().length > 0)
);

export function getProfileProgress(profile = {}) {
  const completedFields = profileFields.filter(({ key }) => hasValue(profile[key]));
  const score = completedFields.reduce((total, field) => total + field.weight, 0);
  const nextField = profileFields.find(({ key }) => !hasValue(profile[key]));

  return {
    score,
    completed: completedFields.length,
    total: profileFields.length,
    isComplete: completedFields.length === profileFields.length,
    nextLabel: nextField?.label || null,
  };
}
