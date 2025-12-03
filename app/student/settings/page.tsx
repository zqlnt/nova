'use client';

import { useState } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { mockStudent } from '@/lib/mockData';

export default function StudentSettings() {
  const [ageGroup, setAgeGroup] = useState(mockStudent.ageGroup);
  const [yearGroup, setYearGroup] = useState(mockStudent.yearGroup);
  const [interests, setInterests] = useState(mockStudent.interests);

  const handleSave = () => {
    alert('Settings saved! (This is a placeholder - no actual save functionality yet)');
  };

  return (
    <Layout role="student">
      <div className="space-y-8 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Settings
          </h1>
          <p className="text-gray-600">Personalize your learning experience</p>
        </div>

        {/* Profile Section */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Profile</h2>
          
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
                Name
              </label>
              <input
                type="text"
                defaultValue={mockStudent.name}
                className="w-full glass-card rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
              />
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Group
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full glass-card rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
              >
                <option value="11-12">11-12 years</option>
                <option value="13-14">13-14 years</option>
                <option value="14-15">14-15 years</option>
                <option value="15-16">15-16 years</option>
                <option value="16-17">16-17 years</option>
                <option value="17-18">17-18 years</option>
              </select>
            </div>

            {/* Year Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Group
              </label>
              <select
                value={yearGroup}
                onChange={(e) => setYearGroup(e.target.value)}
                className="w-full glass-card rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ios-blue transition-all"
              >
                <option value="Year 7">Year 7</option>
                <option value="Year 8">Year 8</option>
                <option value="Year 9">Year 9</option>
                <option value="Year 10">Year 10</option>
                <option value="Year 11">Year 11</option>
                <option value="Year 12">Year 12</option>
                <option value="Year 13">Year 13</option>
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests & Learning Goals
              </label>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={4}
                placeholder="Tell Nova about your interests and what you'd like to learn..."
                className="w-full glass-card rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                This helps Nova personalize your learning experience
              </p>
            </div>
          </div>
        </Card>

        {/* Learning Preferences */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Learning Preferences</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <div>
                <div className="font-medium">Daily Learning Reminders</div>
                <div className="text-sm text-gray-600">Get notified to keep your streak going</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              <div>
                <div className="font-medium">Weekly Progress Reports</div>
                <div className="text-sm text-gray-600">Receive a summary of your learning progress</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded" />
              <div>
                <div className="font-medium">Challenge Mode</div>
                <div className="text-sm text-gray-600">Enable harder questions to push your limits</div>
              </div>
            </label>
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

