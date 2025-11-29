/*
  # School Management System Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (text: 'parent', 'teacher', 'admin')
      - `name` (text)
      - `created_at` (timestamp)
    
    - `students`
      - `id` (uuid, primary key)
      - `name` (text)
      - `parent_id` (uuid, foreign key to users)
      - `grade` (text)
      - `class_name` (text)
      - `created_at` (timestamp)
    
    - `progress_records`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students)
      - `subject` (text)
      - `score` (integer)
      - `notes` (text)
      - `recorded_by` (uuid, foreign key to users)
      - `created_at` (timestamp)
    
    - `attendance_records`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students)
      - `date` (date)
      - `status` (text: 'present', 'absent', 'late')
      - `recorded_by` (uuid, foreign key to users)
      - `created_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, foreign key to users)
      - `recipient_id` (uuid, foreign key to users)
      - `student_id` (uuid, foreign key to students)
      - `subject` (text)
      - `content` (text)
      - `is_read` (boolean)
      - `created_at` (timestamp)
    
    - `milestones`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to students)
      - `title` (text)
      - `description` (text)
      - `achieved_date` (date)
      - `created_by` (uuid, foreign key to users)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Parents can view their own children's data
    - Teachers can view and manage their students
    - Admins have full access
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('parent', 'teacher', 'admin')),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES users(id) ON DELETE CASCADE,
  grade text NOT NULL,
  class_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  notes text DEFAULT '',
  recorded_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  recorded_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  achieved_date date NOT NULL,
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Parents can view their children"
  ON students FOR SELECT
  TO authenticated
  USING (
    parent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );

CREATE POLICY "Teachers can manage students"
  ON students FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );

CREATE POLICY "View progress records"
  ON progress_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = progress_records.student_id 
      AND (students.parent_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin')))
    )
  );

CREATE POLICY "Teachers can create progress records"
  ON progress_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );

CREATE POLICY "View attendance records"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = attendance_records.student_id 
      AND (students.parent_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin')))
    )
  );

CREATE POLICY "Teachers can create attendance records"
  ON attendance_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );

CREATE POLICY "View messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "View milestones"
  ON milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = milestones.student_id 
      AND (students.parent_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin')))
    )
  );

CREATE POLICY "Teachers can create milestones"
  ON milestones FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
  );
