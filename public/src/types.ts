export type ViewType = 
  | 'login'
  | 'admin_dashboard'
  | 'doctor_dashboard'
  | 'patient_records'
  | 'patient_detail'
  | 'imaging_queue'
  | 'ai_diagnostics'
  | 'reporting'
  | 'admin_console';

export type UserRole = 'doctor' | 'admin' | 'radiologist';

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  avatar: string;
  role: UserRole;
  license: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  dob: string;
  age: number;
  bloodType: string;
  allergies: string[];
  height: string;
  weight: string;
  primaryCare: string;
  activeConditions: string[];
  lastVisit: string;
  status: 'Ativo' | 'Inativo' | 'Em revisão' | 'Em tratamento' | 'Estável';
  avatar?: string;
  examCount: number;
}

export interface ExaminationHistory {
  id: string;
  patientId: string;
  date: string;
  time: string;
  modality: 'Chest X-Ray' | 'CT Thorax' | 'Brain MRI' | 'Knee MRI' | 'Ultrasound' | 'CT Abdomen';
  study: string;
  accessionNumber: string;
  referringPhysician: string;
  status: 'Analyzing' | 'Complete' | 'Pending Review' | 'Draft';
  indication: string;
  findingsSummary: string;
  confidenceScore: number;
  confidenceType: 'Normal Finding' | 'Pneumonia Risk' | 'Anomaly' | 'Urgent';
  urgent: boolean;
  originalImageUrl: string;
  aiOverlayImageUrl: string;
}

export interface AiFinding {
  id: string;
  name: string;
  probability: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PendingReview {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  priority: 'Urgent' | 'Standard';
  type: string;
  timeAgo: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  patientName: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  type: string;
}
