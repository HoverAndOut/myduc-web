import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  students,
  progressRecords,
  attendanceRecords,
  milestones,
  Student,
  InsertStudent,
  ProgressRecord,
  InsertProgressRecord,
  AttendanceRecord,
  InsertAttendanceRecord,
  Milestone,
  InsertMilestone
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    } else {
      values.role = 'parent';
      updateSet.role = 'parent';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Student management functions
export async function getStudentsByParentId(parentId: number): Promise<Student[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(students)
    .where(eq(students.parentId, parentId))
    .orderBy(desc(students.createdAt));

  return result;
}

export async function getStudentById(studentId: number): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createStudent(student: InsertStudent): Promise<Student> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(students).values(student);
  const insertedId = Number(result[0].insertId);
  
  const created = await getStudentById(insertedId);
  if (!created) throw new Error("Failed to retrieve created student");
  
  return created;
}

// Progress tracking functions
export async function getProgressByStudentId(studentId: number): Promise<ProgressRecord[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(progressRecords)
    .where(eq(progressRecords.studentId, studentId))
    .orderBy(desc(progressRecords.recordDate));

  return result;
}

export async function createProgressRecord(record: InsertProgressRecord): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(progressRecords).values(record);
}

// Attendance functions
export async function getAttendanceByStudentId(studentId: number): Promise<AttendanceRecord[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(attendanceRecords)
    .where(eq(attendanceRecords.studentId, studentId))
    .orderBy(desc(attendanceRecords.attendanceDate));

  return result;
}

export async function createAttendanceRecord(record: InsertAttendanceRecord): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(attendanceRecords).values(record);
}

// Milestone functions
export async function getMilestonesByStudentId(studentId: number): Promise<Milestone[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(milestones)
    .where(eq(milestones.studentId, studentId))
    .orderBy(desc(milestones.milestoneDate));

  return result;
}

export async function createMilestone(milestone: InsertMilestone): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(milestones).values(milestone);
}

// Get all students (admin only)
export async function getAllStudents(): Promise<Student[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(students)
    .orderBy(desc(students.createdAt));

  return result;
}
