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
                itemHtml = itemHtml.replace(/\{\{EDU_FIELD\}\}/g, edu.faculty || '');
                itemHtml = itemHtml.replace(/\{\{EDU_SCHOOL\}\}/g, edu.school || '');
                itemHtml = itemHtml.replace(/\{\{EDU_START_DATE\}\}/g, fd(edu.startDate));
                itemHtml = itemHtml.replace(/\{\{EDU_END_DATE\}\}/g, fd(edu.endDate));
                return itemHtml;
            }).join('\n');
        });

        // 3. Process Skills List
        const displaySkills = [
            ...(data.skills || []),
            ...(data.hardSkills || []),
            ...(data.softSkills || [])
        ].filter(Boolean);

        const skillsRegex = /<!-- SKILLS_START -->([\s\S]*?)<!-- SKILLS_END -->/g;
        html = html.replace(skillsRegex, (match, blueprint) => {
            if (displaySkills.length === 0) return '';
            return displaySkills.map(skill => {
                let itemHtml = blueprint;
                itemHtml = itemHtml.replace(/\{\{SKILL_NAME\}\}/g, skill || '');
                return itemHtml;
            }).join('\n');
        });

        // 3a. Process Hard Skills List
        const hardSkillsRegex = /<!-- HARDSKILLS_START -->([\s\S]*?)<!-- HARDSKILLS_END -->/g;
        html = html.replace(hardSkillsRegex, (match, blueprint) => {
            if (!data.hardSkills || data.hardSkills.length === 0) return '';
            return data.hardSkills.map(skill => {
                let itemHtml = blueprint;
                itemHtml = itemHtml.replace(/\{\{HARDSKILL_NAME\}\}/g, skill || '');
                return itemHtml;
            }).join('\n');
        });

        // 3b. Process Soft Skills List
        const softSkillsRegex = /<!-- SOFTSKILLS_START -->([\s\S]*?)<!-- SOFTSKILLS_END -->/g;
        html = html.replace(softSkillsRegex, (match, blueprint) => {
            if (!data.softSkills || data.softSkills.length === 0) return '';
            return data.softSkills.map(skill => {
                let itemHtml = blueprint;
                itemHtml = itemHtml.replace(/\{\{SOFTSKILL_NAME\}\}/g, skill || '');
                return itemHtml;
            }).join('\n');
        });

        // 4. Process Languages List
        const langRegex = /<!-- LANGUAGES_START -->([\s\S]*?)<!-- LANGUAGES_END -->/g;
        html = html.replace(langRegex, (match, blueprint) => {
            if (!data.languages || data.languages.length === 0) return '';
            return data.languages.map(lang => {
                let itemHtml = blueprint;
                itemHtml = itemHtml.replace(/\{\{LANG_NAME\}\}/g, lang.language || '');
                itemHtml = itemHtml.replace(/\{\{LANG_LEVEL\}\}/g, lang.level || '');
                return itemHtml;
            }).join('\n');
        });

        // 5. Process Certifications List
        const certRegex = /<!-- CERTS_START -->([\s\S]*?)<!-- CERTS_END -->/g;
        html = html.replace(certRegex, (match, blueprint) => {
            if (!data.certifications || data.certifications.length === 0) return '';
            return data.certifications.map(cert => {
                let itemHtml = blueprint;
                itemHtml = itemHtml.replace(/\{\{CERT_NAME\}\}/g, cert.name || '');
                itemHtml = itemHtml.replace(/\{\{CERT_YEAR\}\}/g, cert.year || '');
                return itemHtml;
            }).join('\n');
        });

        // 6. Process Singular Fields
        html = html.replace(/\{\{NAME\}\}/g, data.name || '');
        html = html.replace(/\{\{SURNAME\}\}/g, data.surname || '');
        html = html.replace(/\{\{JOB_TITLE\}\}/g, data.jobTitle || '');
        html = html.replace(/\{\{PHONE\}\}/g, data.phone || '');
        html = html.replace(/\{\{EMAIL\}\}/g, data.email || '');
        html = html.replace(/\{\{ADDRESS\}\}/g, data.address || '');

        const linkedin = data.socialLinks?.find(s => s.platform === 'LinkedIn')?.url || '';
        const defaultPortfolio = data.socialLinks?.find(s => s.platform !== 'LinkedIn')?.url || '';

        html = html.replace(/\{\{SOCIAL_LINK\}\}/g, linkedin);
        html = html.replace(/\{\{PORTFOLIO_LINK\}\}/g, defaultPortfolio);
        html = html.replace(/\{\{SUMMARY\}\}/g, data.summary || '');

        // 8. Process Profile Image
        const profileImageFallback = `
            <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <span style="font-size: clamp(1rem, 50%, 4rem); font-weight: bold; opacity: 0.5;">${(data.name?.charAt(0) || '').toUpperCase()}</span>
            </div>
        `;
        const profileImageHtml = data.profileImage
            ? `<img src="${data.profileImage}" style="width: 100%; height: 100%; max-width: 180px; max-height: 180px; aspect-ratio: 1/1; object-fit: cover; border-radius: 50%;" class="mx-auto" alt="Profile" />`
            : profileImageFallback;
        html = html.replace(/\{\{PROFILE_IMAGE\}\}/g, profileImageHtml);

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
