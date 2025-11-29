import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { useAuth } from '@/lib/auth'
import { supabase, Student, ProgressRecord, AttendanceRecord, Message, Milestone } from '@/lib/supabase'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const [, setLocation] = useLocation()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [progress, setProgress] = useState<ProgressRecord[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [activeTab, setActiveTab] = useState<'progress' | 'attendance' | 'messages' | 'milestones'>('progress')
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/')
    }
  }, [user, loading, setLocation])

  useEffect(() => {
    if (user) {
      loadStudents()
      loadMessages()
    }
  }, [user])

  useEffect(() => {
    if (selectedStudent) {
      loadStudentData()
    }
  }, [selectedStudent])

  const loadStudents = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq(user.role === 'parent' ? 'parent_id' : 'parent_id', user.role === 'parent' ? user.id : undefined)
      .order('name')

    if (data && !error) {
      setStudents(data)
      if (data.length > 0 && !selectedStudent) {
        setSelectedStudent(data[0])
      }
    }
  }

  const loadStudentData = async () => {
    if (!selectedStudent) return
    setDataLoading(true)

    const [progressData, attendanceData, milestonesData] = await Promise.all([
      supabase
        .from('progress_records')
        .select('*')
        .eq('student_id', selectedStudent.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', selectedStudent.id)
        .order('date', { ascending: false }),
      supabase
        .from('milestones')
        .select('*')
        .eq('student_id', selectedStudent.id)
        .order('achieved_date', { ascending: false })
    ])

    if (progressData.data) setProgress(progressData.data)
    if (attendanceData.data) setAttendance(attendanceData.data)
    if (milestonesData.data) setMilestones(milestonesData.data)
    setDataLoading(false)
  }

  const loadMessages = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (data && !error) {
      setMessages(data)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setLocation('/')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.role === 'parent' ? 'Parent Dashboard' : 'Teacher Dashboard'}
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, {user.name}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {students.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Students Found</h2>
            <p className="text-gray-600">
              {user.role === 'parent'
                ? 'No students are currently linked to your account.'
                : 'You have no students assigned to your classes.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {user.role === 'parent' ? 'My Children' : 'Students'}
                </h3>
                <div className="space-y-2">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`w-full text-left px-4 py-3.5 rounded-lg transition-all ${
                        selectedStudent?.id === student.id
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className={`text-sm ${selectedStudent?.id === student.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {student.grade} - {student.class_name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-9">
              {selectedStudent && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-wrap gap-2 p-5">
                      <button
                        onClick={() => setActiveTab('progress')}
                        className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                          activeTab === 'progress'
                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                            : 'text-gray-600 hover:bg-white/50'
                        }`}
                      >
                        Progress
                      </button>
                      <button
                        onClick={() => setActiveTab('attendance')}
                        className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                          activeTab === 'attendance'
                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                            : 'text-gray-600 hover:bg-white/50'
                        }`}
                      >
                        Attendance
                      </button>
                      <button
                        onClick={() => setActiveTab('milestones')}
                        className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                          activeTab === 'milestones'
                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                            : 'text-gray-600 hover:bg-white/50'
                        }`}
                      >
                        Milestones
                      </button>
                      <button
                        onClick={() => setActiveTab('messages')}
                        className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                          activeTab === 'messages'
                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                            : 'text-gray-600 hover:bg-white/50'
                        }`}
                      >
                        Messages
                      </button>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    {dataLoading ? (
                      <div className="text-center py-8 text-gray-600">Loading...</div>
                    ) : (
                      <>
                        {activeTab === 'progress' && (
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                              Academic Progress
                            </h3>
                            {progress.length === 0 ? (
                              <p className="text-gray-500">No progress records yet.</p>
                            ) : (
                              <div className="space-y-3">
                                {progress.map((record) => (
                                  <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="font-medium text-gray-800">{record.subject}</div>
                                      <div className="text-2xl font-bold text-blue-600">{record.score}</div>
                                    </div>
                                    {record.notes && (
                                      <p className="text-gray-600 text-sm">{record.notes}</p>
                                    )}
                                    <p className="text-gray-400 text-xs mt-2">
                                      {new Date(record.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === 'attendance' && (
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                              Attendance Records
                            </h3>
                            {attendance.length === 0 ? (
                              <p className="text-gray-500">No attendance records yet.</p>
                            ) : (
                              <div className="space-y-2">
                                {attendance.map((record) => (
                                  <div key={record.id} className="flex justify-between items-center border border-gray-200 rounded-lg p-4">
                                    <span className="text-gray-800">
                                      {new Date(record.date).toLocaleDateString()}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                                      record.status === 'absent' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {record.status.toUpperCase()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === 'milestones' && (
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                              Milestones & Achievements
                            </h3>
                            {milestones.length === 0 ? (
                              <p className="text-gray-500">No milestones recorded yet.</p>
                            ) : (
                              <div className="space-y-3">
                                {milestones.map((milestone) => (
                                  <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="text-3xl">🏆</div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                                        <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                                        <p className="text-gray-400 text-xs mt-2">
                                          {new Date(milestone.achieved_date).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === 'messages' && (
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Messages</h3>
                            {messages.length === 0 ? (
                              <p className="text-gray-500">No messages yet.</p>
                            ) : (
                              <div className="space-y-3">
                                {messages.map((message) => (
                                  <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold text-gray-800">{message.subject}</h4>
                                      {!message.is_read && message.recipient_id === user.id && (
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                          NEW
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-600 text-sm">{message.content}</p>
                                    <p className="text-gray-400 text-xs mt-2">
                                      {new Date(message.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
