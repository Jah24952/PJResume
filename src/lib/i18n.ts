type DictionaryType = Record<string, Record<'th' | 'en', string>>

export const UI_DICT: DictionaryType = {
    // Navigation
    'nav.back.dashboard': { th: 'กลับไปหน้าโปรไฟล์', en: 'Back to Dashboard' },
    'nav.download.pdf': { th: 'ดาวน์โหลด PDF', en: 'Download PDF' },
    'nav.change.template': { th: 'เปลี่ยนเทมเพลต', en: 'Change Template' },
    'nav.save': { th: 'บันทึกข้อมูล', en: 'Save Data' },
    'nav.saving': { th: 'กำลังบันทึก...', en: 'Saving...' },

    // Sections
    'section.contact': { th: 'ข้อมูลการติดต่อ', en: 'Contact Info' },
    'section.experience': { th: 'ประสบการณ์', en: 'Experience' },
    'section.education': { th: 'การศึกษา', en: 'Education' },
    'section.skills': { th: 'ทักษะ', en: 'Skills' },
    'section.languages': { th: 'ภาษา', en: 'Languages' },
    'section.summary': { th: 'สรุป', en: 'Summary' },
    'section.certifications': { th: 'การรับรองและหลักสูตร', en: 'Certifications' },

    // Fields Contact
    'field.firstName': { th: 'ชื่อจริง', en: 'First Name' },
    'field.lastName': { th: 'นามสกุล', en: 'Last Name' },
    'field.jobTitle': { th: 'อาชีพ/ตำแหน่งที่สนใจ', en: 'Job Title' },
    'field.address': { th: 'ที่อยู่', en: 'Address' },
    'field.phone': { th: 'เบอร์โทรศัพท์', en: 'Phone' },
    'field.email': { th: 'อีเมล', en: 'Email' },
    'field.nationality': { th: 'สัญชาติ', en: 'Nationality' },
    'field.birthDate': { th: 'วันเกิด', en: 'Birth Date' },
    'field.socialLink': { th: 'ลิงค์โซเชียล', en: 'Social Link' },

    // Actions
    'action.add': { th: 'เพิ่ม', en: 'Add' },
    'action.add.experience': { th: '+ เพิ่มประสบการณ์', en: '+ Add Experience' },
    'action.add.education': { th: '+ เพิ่มการศึกษา', en: '+ Add Education' },
    'action.add.language': { th: '+ เพิ่มภาษา', en: '+ Add Language' },
    'action.add.certification': { th: '+ เพิ่มการรับรอง', en: '+ Add Certification' },
    'action.remove': { th: 'ลบ', en: 'Remove' },
    'action.translate': { th: 'แปลประโยค', en: 'Translate' },
    'action.rewrite': { th: 'ปรับปรุงคำ', en: 'Rewrite' },

    // Placeholders
    'placeholder.summary': { th: 'เขียนสรุปเกี่ยวกับตัวคุณ...', en: 'Write a professional summary...' },
}

export function t(key: string, lang: 'th' | 'en' = 'en'): string {
    if (!UI_DICT[key]) return key
    return UI_DICT[key][lang] || UI_DICT[key]['en']
}
