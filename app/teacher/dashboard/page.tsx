import Link from 'next/link';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { mockClasses } from '@/lib/mockData';

export default function TeacherDashboard() {
  return (
    <Layout role="teacher">
      <div className="space-y-8">
        {/* Header with Illustration */}
        <div className="mb-8 relative">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600">Monitor your classes and student progress</p>
            </div>
            {/* Teacher illustration */}
            <div className="hidden lg:block opacity-10">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="35" r="20" fill="currentColor" className="text-gray-900"/>
                <path d="M30 80C30 65 42 55 60 55C78 55 90 65 90 80V95H30V80Z" fill="currentColor" className="text-gray-900"/>
                <rect x="20" y="100" width="80" height="15" rx="2" fill="currentColor" className="text-gray-900" opacity="0.6"/>
                <path d="M40 100L45 85L55 85L60 100" stroke="currentColor" className="text-gray-900" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Active Classes</div>
            <div className="text-3xl font-bold text-gray-900">{mockClasses.length}</div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Total Students</div>
            <div className="text-3xl font-bold text-gray-900">
              {mockClasses.reduce((sum, c) => sum + c.studentCount, 0)}
            </div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Active Today</div>
            <div className="text-3xl font-bold text-gray-900">
              {mockClasses.reduce((sum, c) => sum + c.activeStudents, 0)}
            </div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Avg. Progress</div>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(mockClasses.reduce((sum, c) => sum + c.averageProgress, 0) / mockClasses.length)}%
            </div>
          </Card>
        </div>

        {/* Classes List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Classes</h2>
          <div className="grid grid-cols-1 gap-4">
            {mockClasses.map((classItem, index) => (
              <Link key={classItem.id} href={`/teacher/classes/${classItem.id}`}>
                <Card hover decorative className="cursor-pointer border border-gray-200 hover:border-ios-blue hover:shadow-lg relative overflow-hidden">
                  {/* Class number decoration */}
                  <div className="absolute -right-6 -top-6 text-8xl font-bold opacity-[0.03] text-gray-900">
                    {index + 1}
                  </div>
                  <div className="flex items-start justify-between relative">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{classItem.name}</h3>
                        <Badge variant="default" className="bg-gray-100 text-gray-700">{classItem.studentCount} students</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Active Students</div>
                          <div className="text-2xl font-semibold text-gray-900">{classItem.activeStudents}<span className="text-gray-400">/{classItem.studentCount}</span></div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Average Progress</div>
                          <div className="text-2xl font-semibold text-gray-900">{classItem.averageProgress}%</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Recent Activity</div>
                          <div className="text-base font-medium text-gray-900">{classItem.recentActivity}</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${classItem.averageProgress}%`, backgroundColor: '#007AFF' }}
                          />
                        </div>
                      </div>

                      {/* Weak Topics */}
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Areas Needing Attention</div>
                        <div className="flex flex-wrap gap-2">
                          {classItem.weakTopics.map((topic, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-gray-200 bg-white">
              <div>
                <h3 className="font-semibold text-sm mb-2 text-gray-900">Most Improved Topic</h3>
                <p className="text-gray-600 text-sm">Trigonometry shows 15% improvement across all classes this week</p>
              </div>
            </Card>
            
            <Card className="border border-gray-200 bg-white">
              <div>
                <h3 className="font-semibold text-sm mb-2 text-gray-900">Needs Attention</h3>
                <p className="text-gray-600 text-sm">8 students haven't logged in for more than 3 days</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

