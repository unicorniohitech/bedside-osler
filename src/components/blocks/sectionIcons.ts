import {
  Activity,
  ClipboardList,
  FileText,
  FlaskConical,
  History,
  Pill,
  User,
  type LucideIcon,
} from 'lucide-react'

export const SECTION_ICONS: Record<string, LucideIcon> = {
  subjective: User,
  identification: User,
  vitals: Activity,
  physical_exam: ClipboardList,
  complementary: FlaskConical,
  plan: Pill,
  history: History,
  discharge: FileText,
}
