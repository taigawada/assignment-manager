export interface CyclePeriod {
  weekIndex: number;
  dayOfWeekIndex: number;
}

export interface AssignedClass {
  id: number;
  name: string;
}

export interface Assignment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "draft";
  releaseDate: Date | null;
  assignedClasses: AssignedClass[];
  title: string;
  description: string;
  deadline: Date;
  submittionMethod: string | null;
  otherSubmittionMethod: string;
  isRepeat: boolean;
  submitOnHoliday: boolean;
  cyclePeriod: CyclePeriod[];
}

export interface NullableAssignment {
  id?: number;
  serial?: number;
  status?: "active" | "draft";
  assignedClasses?: AssignedClass[];
  title?: string;
  description?: string;
  deadline?: Date;
  submittionMethod?: string;
  isRepeat?: boolean;
  submitOnHoliday?: boolean;
  cyclePeriod?: CyclePeriod[];
}
