import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { mockStudent } from '@/lib/mockData';

export default function StudentDashboard() {
  return (
    <Layout role="student">
      <div className="space-y-8">
        {/* Welcome Section with Photo */}
        <div className="border border-gray-200 bg-white rounded-2xl mb-8 relative overflow-hidden">
          {/* Background Photo with Fade */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200&h=400&fit=crop&q=80" 
              alt="Educational toys"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay - extended more to the right, transparent on far right */}
            <div className="absolute inset-0 bg-gradient-to-r from-white from-10% via-white/90 via-40% via-white/60 via-60% to-transparent"></div>
          </div>
          
          <div className="relative z-10 p-8 min-h-[240px]">
            {/* Text constrained to left side only */}
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold mb-3 text-gray-900">
                Welcome back, {mockStudent.name}! 
              </h1>
              <p className="text-gray-600 mb-2">
                You're making great progress!
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                You've completed <span className="font-semibold text-gray-900">{mockStudent.stats.lessonsCompleted} lessons</span> and 
                maintained a <span className="font-semibold text-gray-900">{mockStudent.stats.streakDays}-day streak</span>.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Keep up the excellent work!
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  Top Performer
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-green-50 text-green-700 font-medium">
                  {mockStudent.stats.averageScore}% Average Score
                </span>
              </div>
            </div>
            {/* Right side left empty for clear image visibility */}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="text-center border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="mb-1 sm:mb-2 text-gray-400">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{mockStudent.stats.lessonsCompleted}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Lessons Completed</div>
            </div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-gray-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{mockStudent.stats.streakDays}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Day Streak</div>
            </div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="mb-1 sm:mb-2 text-gray-400">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{mockStudent.stats.totalPoints}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Total Points</div>
            </div>
          </Card>
          <Card className="text-center border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="mb-1 sm:mb-2 text-gray-400">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{mockStudent.stats.averageScore}%</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Average Score</div>
            </div>
          </Card>
        </div>

        {/* Continue Lesson Card */}
        <Card hover decorative className="bg-gradient-to-br from-blue-50/30 to-transparent border border-ios-blue/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge variant="info" className="mb-3">{mockStudent.currentLesson.subject}</Badge>
              <h2 className="text-2xl font-bold mb-2">{mockStudent.currentLesson.title}</h2>
              <p className="text-gray-600 mb-4">Next up: {mockStudent.currentLesson.nextUp}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">{mockStudent.currentLesson.progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${mockStudent.currentLesson.progress}%`, backgroundColor: '#007AFF' }}
                  />
                </div>
              </div>
              
              <Button>Continue Lesson →</Button>
            </div>
          </div>
        </Card>

        {/* Weak Areas Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Areas to Improve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockStudent.weakAreas.map((area, index) => (
              <Card key={index} hover className="relative overflow-hidden">
                {/* Mini book icon decoration */}
                <div className="absolute -right-4 -top-4 opacity-5">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900">
                    <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                  </svg>
                </div>
                <div className="flex items-start justify-between mb-3 relative">
                  <div>
                    <h3 className="font-semibold text-lg">{area.topic}</h3>
                    <p className="text-sm text-gray-600">{area.subject}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Understanding</span>
                    <span className="font-semibold">{area.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${area.progress}%`,
                        backgroundColor: area.progress < 50 ? '#EF4444' : area.progress < 75 ? '#F59E0B' : '#10B981'
                      }}
                    />
                  </div>
                </div>
                
                <Button variant="secondary" size="sm" className="w-full">
                  Practice Now
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card hover decorative className="cursor-pointer border border-gray-200 hover:border-ios-blue hover:shadow-md relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="relative">
                <h3 className="font-semibold text-base mb-1 text-gray-900">Ask Nova Anything</h3>
                <p className="text-sm text-gray-600">Get instant help with any topic</p>
              </div>
            </Card>
            
            <Card hover decorative className="cursor-pointer border border-gray-200 hover:border-ios-blue hover:shadow-md relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="relative">
                <h3 className="font-semibold text-base mb-1 text-gray-900">Practice Quiz</h3>
                <p className="text-sm text-gray-600">Test your knowledge</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

