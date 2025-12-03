import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { mockClasses, mockClassStudents } from '@/lib/mockData';

export default function ClassDetail({ params }: { params: { classId: string } }) {
  const classData = mockClasses.find(c => c.id === params.classId) || mockClasses[0];

  return (
    <Layout role="teacher">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 relative">
          {/* Decorative element */}
          <div className="absolute -right-10 -top-10 opacity-5 hidden lg:block">
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
              <circle cx="75" cy="75" r="70" stroke="currentColor" className="text-gray-900" strokeWidth="3"/>
              <path d="M75 20V130M20 75H130" stroke="currentColor" className="text-gray-900" strokeWidth="2" opacity="0.5"/>
              <circle cx="75" cy="75" r="40" fill="currentColor" className="text-gray-900" opacity="0.2"/>
            </svg>
          </div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {classData.name}
              </h1>
              <Badge variant="default" className="bg-gray-100 text-gray-700">{classData.studentCount} students</Badge>
            </div>
            <p className="text-gray-600">{classData.recentActivity}</p>
          </div>
          <Button variant="secondary">
            Export Report
          </Button>
        </div>

        {/* Class Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Average Progress</div>
            <div className="text-3xl font-bold text-gray-900">{classData.averageProgress}%</div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Active Students</div>
            <div className="text-3xl font-bold text-gray-900">{classData.activeStudents}</div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Areas to Focus</div>
            <div className="text-3xl font-bold text-gray-900">{classData.weakTopics.length}</div>
          </Card>
        </div>

        {/* Common Weak Topics */}
        <Card className="border border-gray-200 bg-white mb-8">
          <h3 className="font-semibold text-base mb-3 text-gray-900">Areas Needing Attention</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {classData.weakTopics.map((topic, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                {topic}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            These topics show lower understanding across multiple students
          </p>
        </Card>

        {/* Students Table */}
        <Card className="border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Student Progress</h2>
          
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Progress</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Lessons</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Last Active</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Weak Areas</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockClassStudents.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm p-1.5">
                          <Image 
                            src="https://i.imghippo.com/files/tyq3865Jxs.png" 
                            alt="Nova" 
                            width={32} 
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold mb-1">{student.overallProgress}%</span>
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ width: `${student.overallProgress}%`, backgroundColor: '#007AFF' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {student.lessonsCompleted}
                    </td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600">
                      {student.lastActive}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {student.weakAreas.map((area, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            {area}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Link href={`/teacher/students/${student.id}`}>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

