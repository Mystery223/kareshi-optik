export type ExamHistoryRecord = {
  id: string;
  customerId: string;
  appointmentId: string | null;
  optometristId: string | null;
  examDate: string;
  reSphere: string | null;
  reCylinder: string | null;
  reAxis: number | null;
  reAdd: string | null;
  leSphere: string | null;
  leCylinder: string | null;
  leAxis: number | null;
  leAdd: string | null;
  pd: string | null;
  notes: string | null;
  nextExamDate: string | null;
  createdAt: Date;
};
