'use client'
import { generateSummary } from '@/lib/ai'
import { useResumeStore } from '@/store/resume.store'
import ResumePreview from '@/components/ResumePreview'
import { analyzeATS } from '@/lib/api'
import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useRef } from 'react'


export default function ResumeCreatePage() {
  const previewRef = useRef<HTMLDivElement>(null)

const exportPDF = async () => {
  if (!previewRef.current) return

  const canvas = await html2canvas(previewRef.current, {
    scale: 2, // คมขึ้น
    useCORS: true
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = (canvas.height * pageWidth) / canvas.width

  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)
  pdf.save('resume.pdf')
}

  const { step, data, next, back, update } = useResumeStore()
  const [atsResult, setAtsResult] = useState<{
    score: number
    matchedKeywords: string[]
  } | null>(null)
  const generateAISummary = async () => {
  const result = await generateSummary({
    name: data.name,
    experience: data.experience,
    education: data.education,
    skills: data.skills,
    jobStyle: 'private'
  })

  update('summary', result.summary)
}

  const analyzeResume = async () => {
    const resumeText = `
      Name: ${data.name}
      Email: ${data.email}
      Experience: ${data.experience}
      Education: ${data.education}
      Skills: ${data.skills}
      Summary: ${data.summary}
    `

    const jobKeywords = data.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const result = await analyzeATS({
      resumeText,
      jobKeywords
    })

    setAtsResult(result)
  }

  return (
    <main className="grid grid-cols-2 gap-6 p-8">
      {/* LEFT: FORM */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          Create Resume (Step {step}/5)
        </h1>

        {step === 1 && (
          <>
            <input
              className="border p-2 w-full"
              placeholder="Full Name"
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
            />
            <input
              className="border p-2 w-full"
              placeholder="Email"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </>
        )}

        {step === 2 && (
          <textarea
            className="border p-2 w-full"
            placeholder="Work Experience"
            value={data.experience}
            onChange={(e) => update('experience', e.target.value)}
          />
        )}

        {step === 3 && (
          <textarea
            className="border p-2 w-full"
            placeholder="Education"
            value={data.education}
            onChange={(e) => update('education', e.target.value)}
          />
        )}

        {step === 4 && (
          <textarea
            className="border p-2 w-full"
            placeholder="Skills (comma separated)"
            value={data.skills}
            onChange={(e) => update('skills', e.target.value)}
          />
        )}

        {step === 5 && (
  <>
    <textarea
      className="border p-2 w-full"
      placeholder="Summary"
      value={data.summary}
      onChange={(e) => update('summary', e.target.value)}
    />

    <button
      onClick={generateAISummary}
      className="bg-purple-600 text-white px-4 py-2 mt-2"
    >
      Generate Summary with AI
    </button>
  </>
)}

        {/* BUTTONS */}
        <div className="flex gap-2 pt-4">
          {step > 1 && (
            <button
              onClick={back}
              className="border px-4 py-2"
            >
              Back
            </button>
          )}

          {step < 5 && (
            <button
              onClick={next}
              className="bg-black text-white px-4 py-2"
            >
              Next
            </button>
          )}

          {step === 5 && (
            <button
              onClick={analyzeResume}
              className="bg-blue-600 text-white px-4 py-2"
            >
              Analyze with ATS
            </button>
          )}
        </div>

        {/* ATS RESULT */}
        {atsResult && (
          <div className="mt-6 border p-4 bg-gray-50">
            <h2 className="font-bold text-lg">
              ATS Analysis Result
            </h2>
            <p>
              <strong>Score:</strong> {atsResult.score}%
            </p>
            <p>
              <strong>Matched Keywords:</strong>{' '}
              {atsResult.matchedKeywords.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* RIGHT: PREVIEW */}
      <ResumePreview ref={previewRef} />
      <button
  onClick={exportPDF}
  className="col-span-2 bg-green-600 text-white px-4 py-2 mt-4"
>
  Download Resume as PDF
</button> 
    </main>
  )
}
