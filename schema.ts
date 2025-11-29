import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "parent", "teacher"]).default("parent").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Students table - stores information about children enrolled in the school
 */
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  parentId: int("parentId").notNull(), // References users.id
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  dateOfBirth: timestamp("dateOfBirth").notNull(),
  enrollmentDate: timestamp("enrollmentDate").defaultNow().notNull(),
  currentProgram: mysqlEnum("currentProgram", [
    "kindergarten",
    "starters",
    "movers",
    "flyers",
    "ielts"
  ]).notNull(),
  photoUrl: text("photoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Progress records - tracks student assessments and achievements
 */
export const progressRecords = mysqlTable("progressRecords", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(), // References students.id
  recordDate: timestamp("recordDate").defaultNow().notNull(),
  category: mysqlEnum("category", [
    "english_listening",
    "english_speaking",
    "english_reading",
    "english_writing",
    "science_critical_thinking",
    "science_prediction",
    "science_data_collection",
    "presentation_skills",
    "overall_assessment"
  ]).notNull(),
  score: int("score"), // Score out of 100
  notes: text("notes"),
  teacherName: varchar("teacherName", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProgressRecord = typeof progressRecords.$inferSelect;
export type InsertProgressRecord = typeof progressRecords.$inferInsert;

/**
 * Attendance records - tracks student attendance
 */
export const attendanceRecords = mysqlTable("attendanceRecords", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(), // References students.id
  attendanceDate: timestamp("attendanceDate").notNull(),
  status: mysqlEnum("status", ["present", "absent", "late", "excused"]).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendanceRecord = typeof attendanceRecords.$inferInsert;

/**
 * Milestones - tracks significant achievements and learning milestones
 */
export const milestones = mysqlTable("milestones", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(), // References students.id
  milestoneDate: timestamp("milestoneDate").defaultNow().notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", [
    "english",
    "science",
    "presentation",
    "social",
    "other"
  ]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

/**
 * Messages - parent-teacher communication
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(), // References users.id
  recipientId: int("recipientId").notNull(), // References users.id (teacher/admin)
  studentId: int("studentId"), // Optional: which student the message is about
  subject: varchar("subject", { length: 200 }).notNull(),
  content: text("content").notNull(),
  isRead: int("isRead").default(0).notNull(), // 0 = unread, 1 = read
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Teachers table - tracks teacher information and class assignments
 */
export const teachers = mysqlTable("teachers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // References users.id
  specialization: varchar("specialization", { length: 100 }), // e.g., "English", "Science"
  yearsOfExperience: int("yearsOfExperience"),
  bio: text("bio"),
  classesAssigned: text("classesAssigned"), // JSON array of class names
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = typeof teachers.$inferInsert;

/**
 * Class assignments - tracks which students are in which classes taught by which teachers
 */
export const classAssignments = mysqlTable("classAssignments", {
  id: int("id").autoincrement().primaryKey(),
  teacherId: int("teacherId").notNull(), // References teachers.id
  studentId: int("studentId").notNull(), // References students.id
  className: varchar("className", { length: 100 }).notNull(), // e.g., "Starters A", "Science 101"
  assignmentDate: timestamp("assignmentDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClassAssignment = typeof classAssignments.$inferSelect;
export type InsertClassAssignment = typeof classAssignments.$inferInsert;

/**
 * Message templates - pre-written messages for teachers to send to parents
 */
export const messageTemplates = mysqlTable("messageTemplates", {
  id: int("id").autoincrement().primaryKey(),
  teacherId: int("teacherId").notNull(), // References teachers.id
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Homework Reminder", "Parent-Teacher Meeting"
  subject: varchar("subject", { length: 200 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }), // e.g., "homework", "event", "general"
  isDefault: int("isDefault").default(0).notNull(), // System-provided templates (0 = false, 1 = true)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type InsertMessageTemplate = typeof messageTemplates.$inferInsert;
