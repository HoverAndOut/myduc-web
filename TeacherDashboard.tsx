import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [showMessageCompose, setShowMessageCompose] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [showBulkMessageForm, setShowBulkMessageForm] = useState(false);
  const [bulkMessageSubject, setBulkMessageSubject] = useState("");
  const [bulkMessageContent, setBulkMessageContent] = useState("");
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [templateCategory, setTemplateCategory] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  // Fetch teacher profile
  const { data: teacherProfile } = trpc.teacher.getProfile.useQuery();

  // Fetch classes taught by teacher
  const { data: classes } = trpc.teacher.getClasses.useQuery();

  // Fetch messages
  const { data: messages, refetch: refetchMessages } = trpc.teacher.getMessages.useQuery();

  // Fetch templates
  const { data: templates, refetch: refetchTemplates } = trpc.templates.getMyTemplates.useQuery();
  const { data: defaultTemplates } = trpc.templates.getDefaults.useQuery();

  // Fetch students in selected class
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);
  const { data: classStudents } = trpc.teacher.getClassStudents.useQuery(
    { className: selectedClassName || "" },
    { enabled: !!selectedClassName }
  );

  // Fetch student progress
  const { data: studentProgress } = trpc.teacher.getStudentProgress.useQuery(
    { studentId: selectedStudentId || 0 },
    { enabled: !!selectedStudentId }
  );

  // Fetch student attendance
  const { data: studentAttendance } = trpc.teacher.getStudentAttendance.useQuery(
    { studentId: selectedStudentId || 0 },
    { enabled: !!selectedStudentId }
  );

  // Mutations
  const markMessageAsRead = trpc.teacher.markMessageAsRead.useMutation({
    onSuccess: () => refetchMessages(),
  });

  const sendBulkMessage = trpc.teacher.sendBulkMessage.useMutation({
    onSuccess: () => {
      setShowBulkMessageForm(false);
      setBulkMessageSubject("");
      setBulkMessageContent("");
    },
  });

  const createTemplate = trpc.templates.create.useMutation({
    onSuccess: () => {
      setShowCreateTemplate(false);
      setTemplateName("");
      setTemplateSubject("");
      setTemplateContent("");
      setTemplateCategory("");
      refetchTemplates();
    },
  });

  const deleteTemplate = trpc.templates.delete.useMutation({
    onSuccess: () => {
      refetchTemplates();
    },
  });

  const applyTemplate = (template: any) => {
    setBulkMessageSubject(template.subject);
    setBulkMessageContent(template.content);
    setShowTemplateManager(false);
  };

  const unreadCount = messages?.filter((m: any) => m.isRead === 0).length || 0;

  const handleSendBulkMessage = () => {
    if (!selectedClassName || !bulkMessageSubject.trim() || !bulkMessageContent.trim()) {
      return;
    }

    sendBulkMessage.mutate({
      className: selectedClassName,
      subject: bulkMessageSubject,
      content: bulkMessageContent,
    });
  };

  const handleCreateTemplate = () => {
    if (!templateName.trim() || !templateSubject.trim() || !templateContent.trim()) {
      return;
    }

    createTemplate.mutate({
      name: templateName,
      subject: templateSubject,
      content: templateContent,
      category: templateCategory || undefined,
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Please log in to access the teacher dashboard.</p>
      </div>
    );
  }

  if (user.role !== "teacher" && user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">You do not have permission to access the teacher dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy-900 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">
            {user?.name && `Welcome, ${user.name}`}
            {teacherProfile?.specialization && ` - ${teacherProfile.specialization}`}
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="classes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="students">Student Records</TabsTrigger>
            <TabsTrigger value="messages">
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
              </CardHeader>
              <CardContent>
                {!classes || classes.length === 0 ? (
                  <p className="text-gray-600">No classes assigned yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {classes.map((classItem: any) => (
                      <Card
                        key={classItem.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => {
                          setSelectedClassName(classItem.className);
                        }}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{classItem.className}</h3>
                          <p className="text-sm text-gray-600">
                            {classItem.academicYear && `Academic Year: ${classItem.academicYear}`}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClassName(classItem.className);
                              }}
                            >
                              View Students
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedClassName(classItem.className);
                                setShowBulkMessageForm(true);
                              }}
                            >
                              Send Message
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedClassName && classStudents ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold">
                        Class: <span className="text-blue-600">{selectedClassName}</span>
                      </p>
                    </div>

                    {classStudents.length === 0 ? (
                      <p className="text-gray-600">No students in this class.</p>
                    ) : (
                      <div className="space-y-3">
                        {classStudents.map((item: any) => (
                          <Card
                            key={item.student.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedStudentId(item.student.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">
                                    {item.student.firstName} {item.student.lastName}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Program: {item.student.currentProgram}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStudentId(item.student.id);
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Select a class to view students.</p>
                )}

                {/* Student Details */}
                {selectedStudentId && (
                  <div className="mt-6 space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold">Student Details</h3>

                    {/* Progress Records */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Progress Records</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!studentProgress || studentProgress.length === 0 ? (
                          <p className="text-sm text-gray-600">No progress records yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {studentProgress.map((record: any) => (
                              <div
                                key={record.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <div>
                                  <p className="font-medium text-sm">{record.category}</p>
                                  <p className="text-xs text-gray-600">
                                    {new Date(record.recordDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{record.score}%</p>
                                  {record.notes && (
                                    <p className="text-xs text-gray-600">{record.notes}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Attendance Records */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Attendance Records</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {!studentAttendance || studentAttendance.length === 0 ? (
                          <p className="text-sm text-gray-600">No attendance records yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {studentAttendance.map((record: any) => (
                              <div
                                key={record.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <div>
                                  <p className="text-sm">
                                    {new Date(record.attendanceDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    record.status === "present"
                                      ? "default"
                                      : record.status === "absent"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {record.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Parent Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!messages || messages.length === 0 ? (
                  <p className="text-gray-600">No messages yet.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message: any) => (
                      <Card
                        key={message.id}
                        className={message.isRead === 0 ? "border-blue-500 bg-blue-50" : ""}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{message.subject}</h4>
                                {message.isRead === 0 && (
                                  <Badge variant="default" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                From: {message.senderName || "Parent"}
                              </p>
                            </div>
                            {message.isRead === 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markMessageAsRead.mutate({ messageId: message.id })}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{message.content}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bulk Message Form Modal */}
        {showBulkMessageForm && selectedClassName && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Send Message to All Parents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Class: {selectedClassName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Use Template</label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowTemplateManager(true)}
                  >
                    Select Template
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <Input
                    placeholder="Message subject"
                    value={bulkMessageSubject}
                    onChange={(e) => setBulkMessageSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <Textarea
                    placeholder="Type your message here..."
                    value={bulkMessageContent}
                    onChange={(e) => setBulkMessageContent(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowBulkMessageForm(false);
                      setBulkMessageSubject("");
                      setBulkMessageContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendBulkMessage}
                    disabled={sendBulkMessage.isPending}
                  >
                    {sendBulkMessage.isPending ? "Sending..." : "Send to All Parents"}
                  </Button>
                </div>
                {sendBulkMessage.isSuccess && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded text-sm text-green-800">
                    {sendBulkMessage.data?.message}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Template Manager Modal */}
        {showTemplateManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
              <CardHeader className="sticky top-0 bg-white border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Select or Create Template</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateManager(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowCreateTemplate(true);
                    setShowTemplateManager(false);
                  }}
                >
                  Create New Template
                </Button>

                {templates && templates.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">My Templates</h3>
                    <div className="space-y-2">
                      {templates.map((template: any) => (
                        <div
                          key={template.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => applyTemplate(template)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{template.name}</p>
                              <p className="text-sm text-gray-600">{template.subject}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTemplate.mutate({ templateId: template.id });
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {defaultTemplates && defaultTemplates.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">System Templates</h3>
                    <div className="space-y-2">
                      {defaultTemplates.map((template: any) => (
                        <div
                          key={template.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => applyTemplate(template)}
                        >
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-gray-600">{template.subject}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Template Modal */}
        {showCreateTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Create New Template</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateTemplate(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Template Name</label>
                  <Input
                    placeholder="e.g., Homework Reminder"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category (Optional)</label>
                  <Input
                    placeholder="e.g., homework, event, general"
                    value={templateCategory}
                    onChange={(e) => setTemplateCategory(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <Input
                    placeholder="Message subject"
                    value={templateSubject}
                    onChange={(e) => setTemplateSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    placeholder="Message content"
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateTemplate(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTemplate}
                    disabled={createTemplate.isPending}
                  >
                    {createTemplate.isPending ? "Creating..." : "Create Template"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
