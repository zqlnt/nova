'use client';

import { useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function TeacherSettings() {
  const [name, setName] = useState('Prof. Smith');
  const [email, setEmail] = useState('prof.smith@school.edu');
  const [school, setSchool] = useState('Central High School');

  const handleSave = () => {
    alert('Settings saved! (This is a placeholder - no actual save functionality yet)');
  };

  return (
    <Layout role="teacher">
      <div className="space-y-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            Settings
          </h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Profile Information</h2>
          
          <div className="space-y-6">
            {/* Profile Picture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Picture
              </label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-md p-4">
                  <Image 
                    src="https://i.imghippo.com/files/tyq3865Jxs.png" 
                    alt="Nova" 
                    width={80} 
                    height={80}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Your profile avatar</p>
                  <Button variant="secondary" size="sm">Upload Photo</Button>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
              />
            </div>

            {/* School */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School/Institution
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
              >
                <option value="mathematics">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="history">History</option>
                <option value="languages">Languages</option>
                <option value="arts">Arts</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Notification Preferences</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <div>
                <div className="font-medium">Student Progress Alerts</div>
                <div className="text-sm text-gray-600">Get notified when students need attention</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <div>
                <div className="font-medium">Weekly Class Reports</div>
                <div className="text-sm text-gray-600">Receive weekly summaries of class performance</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded" />
              <div>
                <div className="font-medium">Nova Insights</div>
                <div className="text-sm text-gray-600">AI-generated teaching recommendations</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <div>
                <div className="font-medium">Student Activity Alerts</div>
                <div className="text-sm text-gray-600">Notify when students are inactive for 3+ days</div>
              </div>
            </label>
          </div>
        </Card>

        {/* Teaching Preferences */}
        <Card className="border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Teaching Preferences</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Class View
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
              >
                <option value="table">Table View</option>
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress Tracking Focus
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
              >
                <option value="overall">Overall Progress</option>
                <option value="weak-areas">Weak Areas</option>
                <option value="recent-activity">Recent Activity</option>
                <option value="engagement">Engagement Metrics</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4">
          <Button onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Layout>
  );
}

