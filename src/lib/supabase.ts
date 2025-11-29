import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  role: 'parent' | 'teacher' | 'admin'
  name: string
  created_at: string
}

export type Student = {
  id: string
  name: string
  parent_id: string
  grade: string
  class_name: string
  created_at: string
}

export type ProgressRecord = {
  id: string
  student_id: string
  subject: string
  score: number
  notes: string
  recorded_by: string
  created_at: string
}

export type AttendanceRecord = {
  id: string
  student_id: string
  date: string
  status: 'present' | 'absent' | 'late'
  recorded_by: string
  created_at: string
}

export type Message = {
  id: string
  sender_id: string
  recipient_id: string
  student_id: string | null
  subject: string
  content: string
  is_read: boolean
  created_at: string
}

export type Milestone = {
  id: string
  student_id: string
  title: string
  description: string
  achieved_date: string
  created_by: string
  created_at: string
}
