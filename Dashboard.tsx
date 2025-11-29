import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  TrendingUp, 
  Award,
  BookOpen,
  Microscope,
  MessageSquare
} from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  
  const { data: students, isLoading } = trpc.students.myStudents.useQuery();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-lg mb-4">Please log in to access the parent dashboard</p>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-primary">Parent Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name?.charAt(0).toUpperCase() || "P"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your children's information...</p>
          </div>
        ) : !students || students.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-4">No Students Enrolled</h2>
              <p className="text-muted-foreground mb-6">
                You don't have any children enrolled yet. Please contact the school administration to add your child's information.
              </p>
              <Button onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StudentCard({ student }: { student: any }) {
  const { data: progress } = trpc.progress.getByStudentId.useQuery({ studentId: student.id });
  const { data: attendance } = trpc.attendance.getByStudentId.useQuery({ studentId: student.id });
  const { data: milestones } = trpc.milestones.getByStudentId.useQuery({ studentId: student.id });

  const programLabels: Record<string, string> = {
    kindergarten: "Kindergarten",
    starters: "Pre A1 Starters",
    movers: "A1 Movers",
    flyers: "A2 Flyers",
    ielts: "IELTS"
  };

  const attendanceStats = attendance ? {
    present: attendance.filter(a => a.status === "present").length,
    absent: attendance.filter(a => a.status === "absent").length,
    late: attendance.filter(a => a.status === "late").length,
    total: attendance.length
  } : null;

  const attendanceRate = attendanceStats 
    ? Math.round((attendanceStats.present / attendanceStats.total) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              {student.photoUrl && <AvatarImage src={student.photoUrl} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {student.firstName} {student.lastName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {programLabels[student.currentProgram]}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <Calendar className="w-4 h-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="milestones">
              <Award className="w-4 h-4 mr-2" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4 mt-6">
            {!progress || progress.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No progress records yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progress.slice(0, 5).map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {record.category.includes("english") && (
                              <BookOpen className="w-4 h-4 text-primary" />
                            )}
                            {record.category.includes("science") && (
                              <Microscope className="w-4 h-4 text-secondary" />
                            )}
                            {record.category.includes("presentation") && (
                              <MessageSquare className="w-4 h-4 text-accent" />
                            )}
                            <h4 className="font-semibold capitalize">
                              {record.category.replace(/_/g, " ")}
                            </h4>
                          </div>
                          {record.notes && (
                            <p className="text-sm text-muted-foreground">{record.notes}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{new Date(record.recordDate).toLocaleDateString()}</span>
                            {record.teacherName && <span>Teacher: {record.teacherName}</span>}
                          </div>
                        </div>
                        {record.score !== null && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{record.score}</div>
                            <div className="text-xs text-muted-foreground">out of 100</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            {!attendanceStats ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No attendance records yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">{attendanceStats.present}</div>
                      <div className="text-sm text-muted-foreground">Present</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-red-600">{attendanceStats.absent}</div>
                      <div className="text-sm text-muted-foreground">Absent</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-yellow-600">{attendanceStats.late}</div>
                      <div className="text-sm text-muted-foreground">Late</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-primary">{attendanceRate}%</div>
                      <div className="text-sm text-muted-foreground">Attendance Rate</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Recent Attendance</h4>
                  {attendance?.slice(0, 10).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">
                        {new Date(record.attendanceDate).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <Badge 
                        variant={
                          record.status === "present" ? "default" :
                          record.status === "absent" ? "destructive" :
                          record.status === "late" ? "secondary" :
                          "outline"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="milestones" className="mt-6">
            {!milestones || milestones.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No milestones recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <Card key={milestone.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{milestone.title}</h4>
                            <Badge variant="outline">{milestone.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {milestone.description}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(milestone.milestoneDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <MessagesTab studentId={student.id} studentName={`${student.firstName} ${student.lastName}`} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function MessagesTab({ studentId, studentName }: { studentId: number; studentName: string }) {
  const [showCompose, setShowCompose] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  
  const { data: messages, refetch } = trpc.messages.getMyMessages.useQuery();
  const { data: teachers } = trpc.messages.getTeachers.useQuery();
  const sendMessage = trpc.messages.send.useMutation({
    onSuccess: () => {
      refetch();
      setShowCompose(false);
      setSubject("");
      setContent("");
    },
  });
  const markAsRead = trpc.messages.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const studentMessages = messages?.filter(
    (m: any) => !m.studentId || m.studentId === studentId
  ) || [];

  const handleSend = () => {
    if (!subject.trim() || !content.trim()) return;
    
    const selectedTeacher = teachers?.[0];
    if (!selectedTeacher) return;
    
    sendMessage.mutate({
      recipientId: selectedTeacher.id,
      studentId,
      subject,
      content,
    });
  };

  if (showCompose) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">New Message to Teacher</h3>
          <Button variant="outline" onClick={() => setShowCompose(false)}>
            Cancel
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">About Student</label>
              <div className="p-2 bg-muted rounded">{studentName}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter subject..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded min-h-[150px]"
                placeholder="Type your message here..."
              />
            </div>
            
            <Button 
              onClick={handleSend} 
              disabled={sendMessage.isPending || !subject.trim() || !content.trim()}
              className="w-full"
            >
              {sendMessage.isPending ? "Sending..." : "Send Message"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Messages</h3>
        <Button onClick={() => setShowCompose(true)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      {studentMessages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No messages yet</p>
          <p className="text-sm mt-2">Click "New Message" to contact your child's teacher</p>
        </div>
      ) : (
        <div className="space-y-3">
          {studentMessages.map((message: any) => (
            <Card key={message.id} className={message.isRead === 0 ? "border-primary" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{message.subject}</h4>
                      {message.isRead === 0 && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.isRead === 0 && message.recipientId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => markAsRead.mutate({ messageId: message.id })}
                  >
                    Mark as Read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
