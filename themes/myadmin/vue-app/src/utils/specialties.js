// Liste des spécialités médicales
export const specialties = [
  { id: 1, label: "Allergologie", value: "allergologie" },
  { id: 2, label: "Anesthésie-réanimation", value: "anesthesie-reanimation" },
  { id: 3, label: "Cardiologie", value: "cardiologie" },
  { id: 4, label: "Chirurgie générale", value: "chirurgie-generale" },
  { id: 5, label: "Chirurgie orthopédique", value: "chirurgie-orthopedique" },
  { id: 6, label: "Chirurgie plastique", value: "chirurgie-plastique" },
  { id: 7, label: "Dermatologie", value: "dermatologie" },
  { id: 8, label: "Endocrinologie", value: "endocrinologie" },
  { id: 9, label: "Gastro-entérologie", value: "gastro-enterologie" },
  { id: 10, label: "Gériatrie", value: "geriatrie" },
  { id: 11, label: "Gynécologie", value: "gynecologie" },
  { id: 12, label: "Hématologie", value: "hematologie" },
  { id: 13, label: "Infectiologie", value: "infectiologie" },
  { id: 14, label: "Médecine générale", value: "medecine-generale" },
  { id: 15, label: "Médecine interne", value: "medecine-interne" },
  { id: 16, label: "Néphrologie", value: "nephrologie" },
  { id: 17, label: "Neurologie", value: "neurologie" },
  { id: 18, label: "Oncologie", value: "oncologie" },
  { id: 19, label: "Ophtalmologie", value: "ophtalmologie" },
  { id: 20, label: "Oto-rhino-laryngologie (ORL)", value: "orl" },
  { id: 21, label: "Pédiatrie", value: "pediatrie" },
  { id: 22, label: "Pneumologie", value: "pneumologie" },
  { id: 23, label: "Psychiatrie", value: "psychiatrie" },
  { id: 24, label: "Radiologie", value: "radiologie" },
  { id: 25, label: "Rhumatologie", value: "rhumatologie" },
  { id: 26, label: "Urologie", value: "urologie" },
];

// Fonction pour obtenir le label d'une spécialité à partir de son ID
export const getSpecialtyLabel = (specialtyId) => {
  if (!specialtyId || specialtyId === "_none" || specialtyId === "") return "";
  const specialty = specialties.find((s) => s.id == specialtyId);
  return specialty ? specialty.label : "";
};

// Fonction pour obtenir l'ID d'une spécialité à partir de son label
export const getSpecialtyId = (label) => {
  if (!label) return "";
  const specialty = specialties.find((s) => s.label === label);
  return specialty ? specialty.id : "";
};

// Fonction pour obtenir la valeur d'une spécialité à partir de son ID
export const getSpecialtyValue = (specialtyId) => {
  if (!specialtyId || specialtyId === "_none") return "";
  const specialty = specialties.find((s) => s.id == specialtyId);
  return specialty ? specialty.value : "";
};

// Fonction pour obtenir la liste complète des spécialités
export const getAllSpecialties = () => {
  return [...specialties];
};

// Fonction pour formater les médecins avec leur spécialité
export const formatDoctorsWithSpecialties = (doctors) => {
  if (!doctors || !Array.isArray(doctors)) return [];

  return doctors.map((doctor) => ({
    ...doctor,
    specialtyLabel: getSpecialtyLabel(doctor.field_specialite),
    specialtyValue: getSpecialtyValue(doctor.field_specialite),
    displayName: `${doctor.name} - ${getSpecialtyLabel(doctor.field_specialite) || "Spécialité non définie"}`,
  }));
};
