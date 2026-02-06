'use client'

import { useResumeStore } from '@/store/resume.store'
import { forwardRef } from 'react'

const ResumePreview = forwardRef<HTMLDivElement>((_, ref) => {
  const { data } = useResumeStore()

  return (
    <div
      ref={ref}
      className="border p-6 text-sm space-y-4"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000'
      }}
    >
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
          {data.name || 'Your Names'}
        </h2>
        <p>{data.email || 'email@example.com'}</p>
      </div>

      <div>
        <h3 style={{ fontWeight: '600' }}>Summary</h3>
        <p>{data.summary || '—'}</p>
      </div>

      <div>
        <h3 style={{ fontWeight: '600' }}>Experience</h3>
        <p>{data.experience || '—'}</p>
      </div>

      <div>
        <h3 style={{ fontWeight: '600' }}>Education</h3>
        <p>{data.education || '—'}</p>
      </div>

      <div>
        <h3 style={{ fontWeight: '600' }}>Skills</h3>
        <p>{data.skills || '—'}</p>
      </div>
    </div>
  )
})

ResumePreview.displayName = 'ResumePreview'
export default ResumePreview
