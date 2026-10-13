import { Patient, ExaminationHistory, AiFinding, PendingReview, ScheduleItem, UserProfile } from '../types';

export const currentUser: UserProfile = {
  name: 'Médico',
  title: 'Médico',
  email: 'dr.smith@hospital.org',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsUC1nPDm1e8UQab2AzrtXsqkQTueq0YaW26HhBfvfTIAtUSjRSy45DAum9Y1NK8as2Ca6pq9jYeICxlwSLpCLsX_AXhrwek5rmHR0ROKKMkXx2WQLUpyXDjnTt4gv-YO6erarHHYH1577EZFpp2e8HAD7j289wl9M1q8fasZihq04wFiaZXH78wTvMTUupwW0TS7AsFAuDvgliMNudMC7_cJtBcLRMaJNOSTkGO2qDq2OzjQpC6VK',
  role: 'doctor',
  license: 'Demonstração TCC'
};

export const mockPatients: Patient[] = [
  {
    id: 'PT-88492',
    mrn: '#MRN-45A',
    name: 'John Doe',
    gender: 'Masculino',
    dob: '1965-12-04',
    age: 58,
    bloodType: 'O Positive',
    allergies: ['Penicillin'],
    height: '180 cm',
    weight: '82 kg',
    primaryCare: 'Dr. A. Chen',
    activeConditions: ['Hypertension', 'Type 2 Diabetes'],
    lastVisit: '2023-10-24',
    status: 'Ativo',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAHNyShMqjMBnkexvXc_KtibbBcE1LvdD-HLjkXDhaI5Pj_T7KuLh8yUtOITmyvelE2hk-EMk07U9VjgyfRlZ_3V3erlNhYkc93cR_rLzCE1B_tjDFG-G68d19G-CU_4gAR4shedOVpfCdF-DfyxkRkbLs1RquLeP7KwVOVQBa9smPaHhBBJc7WkEKZmwNxXXiDwSdPRyZ9TE3NDx6Fw5W-LXyvkorb_VEeJUTvjr2md3Qf3zVNeZW',
    examCount: 4
  },
  {
    id: 'PT-99421',
    mrn: '#MRN-88C',
    name: 'Robert Chen',
    gender: 'Masculino',
    dob: '1978-06-15',
    age: 45,
    bloodType: 'A Positive',
    allergies: ['Sulfa drugs'],
    height: '175 cm',
    weight: '76 kg',
    primaryCare: 'Dr. S. Williams',
    activeConditions: ['Asthma', 'Mild Dyspnea'],
    lastVisit: '2023-10-12',
    status: 'Em revisão',
    examCount: 3
  },
  {
    id: 'PT-9103',
    mrn: '#MRN-19B',
    name: 'Mary Smith',
    gender: 'Feminino',
    dob: '1945-11-03',
    age: 78,
    bloodType: 'B Positive',
    allergies: ['None known'],
    height: '162 cm',
    weight: '64 kg',
    primaryCare: 'Dr. E. Smith',
    activeConditions: ['Osteoarthritis', 'Cardiomegaly Monitor'],
    lastVisit: '2023-11-02',
    status: 'Ativo',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW8Fz502zg0L1C4xuUt7-iaKTbnqvNtrtKW2kAmVr-3HZ2D33VQ7-TmjDM9SfSMAGIwuNf8bHRgZyaHjQS5UAoSCThRONj4-3SNgwyzq0fpYbe5PXYb3eM7zJj7bwXuxArKTRTJ40_on6M6-Cf_fh5qNTrIy62Hi7_L5daF8OugUFCdFoX9ZrpEcNW0scJSJyl4X_wV1NvlpJcT_YnL-M5-dlgtlJ4AziQQuvdtmAooLne_f4jRdCo',
    examCount: 12
  },
  {
    id: 'PT-88312',
    mrn: '#MRN-33D',
    name: 'Sarah Jenkins',
    gender: 'Feminino',
    dob: '1989-02-14',
    age: 35,
    bloodType: 'O Negative',
    allergies: ['Latex'],
    height: '168 cm',
    weight: '59 kg',
    primaryCare: 'Dr. A. Chen',
    activeConditions: ['Migraine with Aura'],
    lastVisit: '2023-10-24',
    status: 'Estável',
    examCount: 2
  },
  {
    id: 'PT-77109',
    mrn: '#MRN-92E',
    name: 'Marcus Davis',
    gender: 'Masculino',
    dob: '1958-09-20',
    age: 65,
    bloodType: 'AB Positive',
    allergies: ['Aspirin'],
    height: '183 cm',
    weight: '89 kg',
    primaryCare: 'Dr. S. Williams',
    activeConditions: ['COPD', 'Post-Op Observation'],
    lastVisit: 'Today',
    status: 'Em tratamento',
    examCount: 7
  },
  {
    id: 'PT-2214',
    mrn: '#MRN-04F',
    name: 'Alice Johnson',
    gender: 'Feminino',
    dob: '1992-03-22',
    age: 32,
    bloodType: 'A Negative',
    allergies: ['Iodine Contrast'],
    height: '170 cm',
    weight: '62 kg',
    primaryCare: 'Dr. E. Smith',
    activeConditions: ['None'],
    lastVisit: '2022-08-15',
    status: 'Inativo',
    examCount: 1
  }
];

export const mockExaminations: ExaminationHistory[] = [
  {
    id: 'EX-99201',
    patientId: 'PT-88492',
    date: 'Today, 09:15 AM',
    time: '09:15',
    modality: 'Chest X-Ray',
    study: 'Chest PA & Lateral',
    accessionNumber: 'ACC-2023-992',
    referringPhysician: 'Dr. A. Chen',
    status: 'Analyzing',
    indication: 'Subtle left-sided pleuritic chest discomfort and low-grade pyrexia.',
    findingsSummary: 'MediScan AI is currently processing the latest radiographs. Expected completion in < 2 minutes.',
    confidenceScore: 0,
    confidenceType: 'Anomaly',
    urgent: false,
    originalImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOaMouTjrWgGuWDVKJBcrjVUOR7DzYnkZLlc6eFumUckS4ZIEZB0m4EPSH3atnEHMYCoaXRo22rwAlYNVXW5ExyO4RGOm0TSkEj9V3DwJ8dc5dR0EViEp-6d_pbkK6W_z4Gsep7ls7XOj4nQfzBprZKGcYBSFAdF6MVFj165XL30hx8wsG6V84iDO7jkuGDGhFig7E95lTtg9Mz9f6YJLoxsbk77F4cRFrir-r27pVPKDNX9jABRSm',
    aiOverlayImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL5HGNN64uG1h8aPOLs9vIkUL0tPGRsF6xwUmDG4uSVCrj2LthkZ_8d2Ofus0i20lx-wGY_CrULvj7pccXSgtEZRLKluzzakG9-UTll_fSY04p5ADt9Ti1ZoZVOdeeatyhOPdzfas67uOShBKFSBMb56kYQvDBHf8roHTUGGLpPOydHPHP6byVqZR5ffzO9GwD_pUGcO7cq6XYmSjZ47fck6yetOjYrNDtAg57HX1FXkGYmBhOukjj'
  },
  {
    id: 'EX-88201',
    patientId: 'PT-88492',
    date: 'Oct 12, 2023 • 14:30',
    time: '14:30',
    modality: 'CT Thorax',
    study: 'CT Thorax w/o Contrast',
    accessionNumber: 'ACC-2023-882',
    referringPhysician: 'Dr. A. Chen',
    status: 'Complete',
    indication: 'Persistent cough, mild dyspnea on exertion. Evaluate for underlying parenchymal disease.',
    findingsSummary: 'Mild dependent atelectasis in the posterior lower lobes bilaterally. No suspicious pulmonary nodules. No pleural effusion or pneumothorax. Mediastinal and hilar lymph nodes are within normal limits for size.',
    confidenceScore: 98,
    confidenceType: 'Normal Finding',
    urgent: false,
    originalImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOaMouTjrWgGuWDVKJBcrjVUOR7DzYnkZLlc6eFumUckS4ZIEZB0m4EPSH3atnEHMYCoaXRo22rwAlYNVXW5ExyO4RGOm0TSkEj9V3DwJ8dc5dR0EViEp-6d_pbkK6W_z4Gsep7ls7XOj4nQfzBprZKGcYBSFAdF6MVFj165XL30hx8wsG6V84iDO7jkuGDGhFig7E95lTtg9Mz9f6YJLoxsbk77F4cRFrir-r27pVPKDNX9jABRSm',
    aiOverlayImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL5HGNN64uG1h8aPOLs9vIkUL0tPGRsF6xwUmDG4uSVCrj2LthkZ_8d2Ofus0i20lx-wGY_CrULvj7pccXSgtEZRLKluzzakG9-UTll_fSY04p5ADt9Ti1ZoZVOdeeatyhOPdzfas67uOShBKFSBMb56kYQvDBHf8roHTUGGLpPOydHPHP6byVqZR5ffzO9GwD_pUGcO7cq6XYmSjZ47fck6yetOjYrNDtAg57HX1FXkGYmBhOukjj'
  },
  {
    id: 'EX-77102',
    patientId: 'PT-88492',
    date: 'Aug 05, 2022 • 09:15',
    time: '09:15',
    modality: 'Chest X-Ray',
    study: 'Chest X-Ray PA',
    accessionNumber: 'ACC-2022-771',
    referringPhysician: 'Dr. S. Williams',
    status: 'Complete',
    indication: 'Fever, productive cough x 4 days.',
    findingsSummary: 'Focal opacity in the right lower lobe, highly suspicious for early consolidation. Elevated risk of right lower lobe pneumonia. Follow-up recommended.',
    confidenceScore: 87,
    confidenceType: 'Pneumonia Risk',
    urgent: true,
    originalImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOaMouTjrWgGuWDVKJBcrjVUOR7DzYnkZLlc6eFumUckS4ZIEZB0m4EPSH3atnEHMYCoaXRo22rwAlYNVXW5ExyO4RGOm0TSkEj9V3DwJ8dc5dR0EViEp-6d_pbkK6W_z4Gsep7ls7XOj4nQfzBprZKGcYBSFAdF6MVFj165XL30hx8wsG6V84iDO7jkuGDGhFig7E95lTtg9Mz9f6YJLoxsbk77F4cRFrir-r27pVPKDNX9jABRSm',
    aiOverlayImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL5HGNN64uG1h8aPOLs9vIkUL0tPGRsF6xwUmDG4uSVCrj2LthkZ_8d2Ofus0i20lx-wGY_CrULvj7pccXSgtEZRLKluzzakG9-UTll_fSY04p5ADt9Ti1ZoZVOdeeatyhOPdzfas67uOShBKFSBMb56kYQvDBHf8roHTUGGLpPOydHPHP6byVqZR5ffzO9GwD_pUGcO7cq6XYmSjZ47fck6yetOjYrNDtAg57HX1FXkGYmBhOukjj'
  }
];

export const mockAiFindings: AiFinding[] = [
  {
    id: 'f-1',
    name: 'Consolidation (Pneumonia)',
    probability: 88,
    description: 'Opacification noted in the left lower lobe, indicative of potential inflammatory process.',
    severity: 'high'
  },
  {
    id: 'f-2',
    name: 'Pleural Effusion',
    probability: 12,
    description: 'Low probability. Costophrenic angles appear generally clear without blunting.',
    severity: 'low'
  },
  {
    id: 'f-3',
    name: 'Cardiomegaly',
    probability: 5,
    description: 'Cardiac silhouette is within normal limits for adult male posture.',
    severity: 'low'
  }
];

export const mockPendingReviews: PendingReview[] = [
  {
    id: 'pr-1',
    patientId: 'PT-8821',
    patientName: 'Robert Chen',
    title: 'Critical Finding Detected',
    description: 'AI flagged potential anomaly in upper right lobe. Requires immediate radiologist review.',
    priority: 'Urgent',
    type: 'Chest X-Ray',
    timeAgo: '10 mins ago'
  },
  {
    id: 'pr-2',
    patientId: 'PT-1124',
    patientName: 'David Wright',
    title: 'Routine QA Check',
    description: 'Random sampling for AI accuracy verification in clinical cohort.',
    priority: 'Standard',
    type: 'Brain MRI',
    timeAgo: '45 mins ago'
  },
  {
    id: 'pr-3',
    patientId: 'PT-5562',
    patientName: 'Elena Rostova',
    title: 'Confidence Score Threshold',
    description: 'AI confidence score (72%) falls below auto-clearance threshold (80%).',
    priority: 'Standard',
    type: 'CT Abdomen',
    timeAgo: '1 hr ago'
  }
];

export const mockSchedule: ScheduleItem[] = [
  {
    id: 'sc-1',
    time: '08:30 AM',
    title: 'Initial Consult',
    patientName: 'M. Davis',
    status: 'completed',
    type: 'Consultation'
  },
  {
    id: 'sc-2',
    time: '10:00 AM (Now)',
    title: 'Ultrasound Scan',
    patientName: 'K. Lopez',
    status: 'in_progress',
    type: 'Radiography'
  },
  {
    id: 'sc-3',
    time: '11:15 AM',
    title: 'Follow-up Review',
    patientName: 'J. Smith',
    status: 'upcoming',
    type: 'AI Review'
  },
  {
    id: 'sc-4',
    time: '02:00 PM',
    title: 'CT Thorax Diagnostic',
    patientName: 'R. Chen',
    status: 'upcoming',
    type: 'Computed Tomography'
  }
];
