import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  students: router({
    // Get all students for current parent
    myStudents: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "admin") {
        return await db.getAllStudents();
      }
      return await db.getStudentsByParentId(ctx.user.id);
    }),

    // Get single student by ID (must be parent's child or admin)
    getById: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ ctx, input }) => {
        const student = await db.getStudentById(input.studentId);
        if (!student) {
          throw new Error("Student not found");
        }
        
        // Check authorization
        if (ctx.user.role !== "admin" && student.parentId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        
        return student;
      }),

    // Create new student (parent only)
    create: protectedProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        dateOfBirth: z.date(),
        currentProgram: z.enum(["kindergarten", "starters", "movers", "flyers", "ielts"]),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "parent" && ctx.user.role !== "admin") {
          throw new Error("Only parents can create student records");
        }
        
        const parentId = ctx.user.role === "admin" ? ctx.user.id : ctx.user.id;
        const student = await db.createStudent({
          parentId,
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: input.dateOfBirth,
          currentProgram: input.currentProgram,
        });
        
        return student;
      }),
  }),

  progress: router({
    // Get progress for a student
    getByStudentId: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ ctx, input }) => {
        // Verify authorization
        const student = await db.getStudentById(input.studentId);
        if (!student) {
          throw new Error("Student not found");
        }
        if (ctx.user.role !== "admin" && student.parentId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        
        return await db.getProgressByStudentId(input.studentId);
      }),

    // Create progress record (admin/teacher only)
    create: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        category: z.enum([
          "english_listening",
          "english_speaking",
          "english_reading",
          "english_writing",
          "science_critical_thinking",
          "science_prediction",
          "science_data_collection",
          "presentation_skills",
          "overall_assessment"
        ]),
        score: z.number().min(0).max(100),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "teacher") {
          throw new Error("Only admins and teachers can create progress records");
        }
        
        await db.createProgressRecord({
          studentId: input.studentId,
          category: input.category,
          score: input.score,
          notes: input.notes,
          teacherName: ctx.user.name || "Unknown",
          recordDate: new Date(),
        });
        
        return { success: true };
      }),
  }),

  attendance: router({
    // Get attendance for a student
    getByStudentId: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ ctx, input }) => {
        // Verify authorization
        const student = await db.getStudentById(input.studentId);
        if (!student) {
          throw new Error("Student not found");
        }
        if (ctx.user.role !== "admin" && student.parentId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        
        return await db.getAttendanceByStudentId(input.studentId);
      }),

    // Record attendance (admin/teacher only)
    record: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        status: z.enum(["present", "absent", "late", "excused"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "teacher") {
          throw new Error("Only admins and teachers can record attendance");
        }
        
        await db.createAttendanceRecord({
          studentId: input.studentId,
          status: input.status,
          notes: input.notes,
          attendanceDate: new Date(),
        });
        
        return { success: true };
      }),
  }),

  messages: router({
    // Get messages for current user
    getMyMessages: protectedProcedure.query(async ({ ctx }) => {
      return await db.getMessagesByUserId(ctx.user.id);
    }),

    // Send message
    send: protectedProcedure
      .input(z.object({
        recipientId: z.number(),
        studentId: z.number().optional(),
        subject: z.string().min(1),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const message = await db.createMessage({
          senderId: ctx.user.id,
          recipientId: input.recipientId,
          studentId: input.studentId,
          subject: input.subject,
          content: input.content,
        });
        
        return message;
      }),

    // Mark message as read
    markAsRead: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markMessageAsRead(input.messageId);
        return { success: true };
      }),

    // Get list of teachers (admins) for messaging
    getTeachers: protectedProcedure.query(async () => {
      return await db.getAdminUsers();
    }),
  }),

  milestones: router({
    // Get milestones for a student
    getByStudentId: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ ctx, input }) => {
        // Verify authorization
        const student = await db.getStudentById(input.studentId);
        if (!student) {
          throw new Error("Student not found");
        }
        if (ctx.user.role !== "admin" && student.parentId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        
        return await db.getMilestonesByStudentId(input.studentId);
      }),

    // Create milestone (admin only)
    create: protectedProcedure
      .input(z.object({
        studentId: z.number(),
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.enum(["english", "science", "presentation", "social", "other"]),
        milestoneDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Only administrators can create milestones");
        }
        
        await db.createMilestone(input);
        return { success: true };
      }),
  }),

  teacher: router({
    // Get teacher profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await db.getTeacherByUserId(ctx.user.id);
    }),

    // Get classes taught by this teacher
    getClasses: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      const teacher = await db.getTeacherByUserId(ctx.user.id);
      if (!teacher) {
        throw new Error("Teacher profile not found");
      }
      return await db.getTeacherClasses(teacher.id);
    }),

    // Get students in a specific class
    getClassStudents: protectedProcedure
      .input(z.object({ className: z.string() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        const teacher = await db.getTeacherByUserId(ctx.user.id);
        if (!teacher) {
          throw new Error("Teacher profile not found");
        }
        return await db.getStudentsInClass(teacher.id, input.className);
      }),

    // Get student progress records
    getStudentProgress: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await db.getProgressByStudentId(input.studentId);
      }),

    // Get student attendance records
    getStudentAttendance: protectedProcedure
      .input(z.object({ studentId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await db.getAttendanceByStudentId(input.studentId);
      }),

    // Get messages from parents
    getMessages: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await db.getMessagesByUserId(ctx.user.id);
    }),

    // Mark message as read
    markMessageAsRead: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        await db.markMessageAsRead(input.messageId);
        return { success: true };
      }),

    // Send bulk message to all parents in a class
    sendBulkMessage: protectedProcedure
      .input(z.object({
        className: z.string().min(1),
        subject: z.string().min(1),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const teacher = await db.getTeacherByUserId(ctx.user.id);
        if (!teacher) {
          throw new Error("Teacher profile not found");
        }

        const parents = await db.getParentsInClass(teacher.id, input.className);
        if (parents.length === 0) {
          return { success: true, messagesSent: 0, message: "No parents found in this class" };
        }

        const messageCount = await db.createBulkMessages(
          ctx.user.id,
          parents.map(p => p.id),
          input.subject,
          input.content
        );

        return {
          success: true,
          messagesSent: messageCount,
          message: `Message sent to ${messageCount} parent(s)`,
        };
      }),
  }),

  templates: router({
    // Get all templates for current teacher
    getMyTemplates: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const teacher = await db.getTeacherByUserId(ctx.user.id);
      if (!teacher) return [];

      return await db.getTeacherTemplates(teacher.id);
    }),

    // Get default system templates
    getDefaults: publicProcedure.query(async () => {
      return await db.getDefaultTemplates();
    }),

    // Create a new template
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        subject: z.string().min(1),
        content: z.string().min(1),
        category: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const teacher = await db.getTeacherByUserId(ctx.user.id);
        if (!teacher) {
          throw new Error("Teacher profile not found");
        }

        const template = await db.createMessageTemplate({
          teacherId: teacher.id,
          name: input.name,
          subject: input.subject,
          content: input.content,
          category: input.category,
        });

        return template || { error: "Failed to create template" };
      }),

    // Update a template
    update: protectedProcedure
      .input(z.object({
        templateId: z.number(),
        name: z.string().optional(),
        subject: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const template = await db.getMessageTemplateById(input.templateId);
        if (!template) {
          throw new Error("Template not found");
        }

        const teacher = await db.getTeacherByUserId(ctx.user.id);
        if (!teacher || template.teacherId !== teacher.id) {
          throw new Error("Unauthorized");
        }

        const updated = await db.updateMessageTemplate(input.templateId, {
          name: input.name,
          subject: input.subject,
          content: input.content,
          category: input.category,
        });

        return updated || { error: "Failed to update template" };
      }),

    // Delete a template
    delete: protectedProcedure
      .input(z.object({ templateId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "teacher" && ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const template = await db.getMessageTemplateById(input.templateId);
        if (!template) {
          throw new Error("Template not found");
        }

        const teacher = await db.getTeacherByUserId(ctx.user.id);
        if (!teacher || template.teacherId !== teacher.id) {
          throw new Error("Unauthorized");
        }

        await db.deleteMessageTemplate(input.templateId);
        return { success: true };
      }),

    // Get a single template by ID
    getById: protectedProcedure
      .input(z.object({ templateId: z.number() }))
      .query(async ({ ctx, input }) => {
        const template = await db.getMessageTemplateById(input.templateId);
        if (!template) {
          throw new Error("Template not found");
        }

        // Allow access if it's the teacher's template or if it's a default template
        if (template.isDefault === 1) {
          return template;
        }

        const teacher = await db.getTeacherByUserId(ctx.user.id);
        if (!teacher || template.teacherId !== teacher.id) {
          throw new Error("Unauthorized");
        }

        return template;
      }),
  }),
});

export type AppRouter = typeof appRouter;
