import React, { useMemo } from 'react'
import { ResumeData } from '@/store/resume.store'
import { formatMonthYear } from '@/lib/date'

interface Props {
    data: ResumeData
}

export default React.forwardRef<HTMLDivElement, Props>(function AICustomTemplate({ data }, ref) {
    const schema = data.aiTemplateSchema

    const processedHtml = useMemo(() => {
        if (!schema || !schema.html) return ''
        let html = schema.html

        // Helper to safely format dates
        const fd = (d: string) => d ? formatMonthYear(d, data.resumeLanguage as 'en' | 'th') : ''

        // 1. Process Experience List
        const expRegex = /<!-- EXPERIENCE_START -->([\s\S]*?)<!-- EXPERIENCE_END -->/g;
        html = html.replace(expRegex, (match, blueprint) => {
            if (!data.experience || data.experience.length === 0) return '';
            return data.experience.map(exp => {
                let itemHtml = blueprint;
                itemHtml = itemHtml.replace(/\{\{EXP_POSITION\}\}/g, exp.position || '');
                itemHtml = itemHtml.replace(/\{\{EXP_COMPANY\}\}/g, exp.company || '');
                itemHtml = itemHtml.replace(/\{\{EXP_START_DATE\}\}/g, fd(exp.startDate));
                itemHtml = itemHtml.replace(/\{\{EXP_END_DATE\}\}/g, fd(exp.endDate));
                itemHtml = itemHtml.replace(/\{\{EXP_DESCRIPTION\}\}/g, exp.description || '');
                return itemHtml;
            }).join('\n');
        });

        // 2. Process Education List
        const eduRegex = /<!-- EDUCATION_START -->([\s\S]*?)<!-- EDUCATION_END -->/g;
        html = html.replace(eduRegex, (match, blueprint) => {
            if (!data.education || data.education.length === 0) return '';
            return data.education.map(edu => {
                let itemHtml = blueprint;
                itemHtml = itemHtml.replace(/\{\{EDU_DEGREE\}\}/g, edu.degree || '');
                itemHtml = itemHtml.replace(/\{\{EDU_FIELD\}\}/g, edu.fieldOfStudy || '');
                itemHtml = itemHtml.replace(/\{\{EDU_SCHOOL\}\}/g, edu.school || '');
                itemHtml = itemHtml.replace(/\{\{EDU_START_DATE\}\}/g, fd(edu.startDate));
                itemHtml = itemHtml.replace(/\{\{EDU_END_DATE\}\}/g, fd(edu.endDate));
                return itemHtml;
            }).join('\n');
        });

        // 3. Process Skills List
        const skillsRegex = /<!-- SKILLS_START -->([\s\S]*?)<!-- SKILLS_END -->/g;
        html = html.replace(skillsRegex, (match, blueprint) => {
            if (!data.skills || data.skills.length === 0) return '';
            return data.skills.map(skill => {
                let itemHtml = blueprint;
                itemHtml = itemHtml.replace(/\{\{SKILL_NAME\}\}/g, skill || '');
                return itemHtml;
            }).join('\n');
        });

        // 4. Process Singular Fields
        html = html.replace(/\{\{NAME\}\}/g, data.name || '');
        html = html.replace(/\{\{SURNAME\}\}/g, data.surname || '');
        html = html.replace(/\{\{JOB_TITLE\}\}/g, data.jobTitle || '');
        html = html.replace(/\{\{PHONE\}\}/g, data.phone || '');
        html = html.replace(/\{\{EMAIL\}\}/g, data.email || '');
        html = html.replace(/\{\{ADDRESS\}\}/g, data.address || '');
        html = html.replace(/\{\{SOCIAL_LINK\}\}/g, data.socialLink || '');
        html = html.replace(/\{\{SUMMARY\}\}/g, data.summary || '');

        return html;
    }, [schema?.html, data])

    if (!schema || !schema.html) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                AI Template Not Found
            </div>
        )
    }

    return (
        <div
            ref={ref}
            className="w-full min-h-full bg-white relative"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
    )
})
