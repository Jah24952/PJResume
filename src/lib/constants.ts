
export const TEMPLATES = [
    {
        id: 1,
        name: 'Modern Blue',
        style: 'modern',
        color: '#437393',
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Modern'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['เทคโนโลยี / IT / ดิจิทัล', 'อุตสาหกรรม / วิศวกรรม', 'ธุรกิจ / การจัดการ / องค์กร', 'การตลาด / การขาย / สื่อสาร']
        }
    },
    {
        id: 2,
        name: 'Classic Elegance',
        style: 'classic',
        color: '#333333',
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Professional', 'Simple'],
            color: ['B&W'],
            level: ['Senior', 'Manager'],
            career: ['ธุรกิจ / การจัดการ / องค์กร', 'การเงิน / บัญชี / วิเคราะห์', 'ทรัพยากรบุคคล / องค์กร', 'ราชการ / รัฐวิสาหกิจ']
        }
    },
    {
        id: 3,
        name: 'Creative Teal',
        style: 'creative',
        color: '#2dd4bf',
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['จบใหม่ / นักศึกษา'],
            style: ['Creative'],
            color: ['Color'],
            level: ['Entry Level'],
            career: ['ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'การตลาด / การขาย / สื่อสาร', 'เทคโนโลยี / IT / ดิจิทัล']
        }
    },
    {
        id: 4,
        name: 'Professional Gray',
        style: 'professional',
        color: '#94a3b8',
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Professional'],
            color: ['B&W'],
            level: ['Manager', 'Senior'],
            career: ['ธุรกิจ / การจัดการ / องค์กร', 'การเงิน / บัญชี / วิเคราะห์', 'ราชการ / รัฐวิสาหกิจ', 'ทรัพยากรบุคคล / องค์กร']
        }
    },
    {
        id: 5,
        name: 'Modern Orange',
        style: 'modern',
        color: '#f97316',
        categories: {
            language: ['ภาษาไทย'],
            type: ['จบใหม่ / นักศึกษา'],
            style: ['Modern', 'Creative'],
            color: ['Color'],
            level: ['Entry Level'],
            career: ['การตลาด / การขาย / สื่อสาร', 'ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 6,
        name: 'Creative Purple',
        style: 'creative',
        color: '#a855f7',
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Creative'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'การศึกษา / วิชาการ', 'เทคโนโลยี / IT / ดิจิทัล']
        }
    },
    {
        id: 7,
        name: 'Classic Minimal',
        style: 'classic',
        color: '#000000',
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['คนมีประสบการณ์', 'จบใหม่ / นักศึกษา'],
            style: ['Simple', 'Professional'],
            color: ['B&W'],
            level: ['Entry Level', 'Senior', 'Manager'],
            career: ['ราชการ / รัฐวิสาหกิจ', 'การศึกษา / วิชาการ', 'อุตสาหกรรม / วิศวกรรม', 'ทรัพยากรบุคคล / องค์กร']
        }
    },
    {
        id: 8,
        name: 'Professional Blue',
        style: 'professional',
        color: '#3b82f6',
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Professional', 'Modern'],
            color: ['Color'],
            level: ['Senior', 'Manager'],
            career: ['เทคโนโลยี / IT / ดิจิทัล', 'อุตสาหกรรม / วิศวกรรม', 'ธุรกิจ / การจัดการ / องค์กร', 'การเงิน / บัญชี / วิเคราะห์']
        }
    },
    /* --- NEW CAREER SPECIFIC TEMPLATES --- */
    {
        id: 9,
        name: 'Tech Lead',
        style: 'modern',
        color: '#334155', // Slate 700
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Modern'],
            color: ['B&W'],
            level: ['Senior', 'Manager'],
            career: ['เทคโนโลยี / IT / ดิจิทัล', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 10,
        name: 'UX Designer',
        style: 'creative',
        color: '#ec4899', // Pink 500
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Creative'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'เทคโนโลยี / IT / ดิจิทัล']
        }
    },
    {
        id: 11,
        name: 'Marketing Pro',
        style: 'modern',
        color: '#ef4444', // Red 500
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Modern', 'Creative'],
            color: ['Color'],
            level: ['Senior'],
            career: ['การตลาด / การขาย / สื่อสาร', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 12,
        name: 'Finance Analyst',
        style: 'professional',
        color: '#10b981', // Emerald 500
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Professional'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['การเงิน / บัญชี / วิเคราะห์', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 13,
        name: 'HR Manager',
        style: 'professional',
        color: '#7e22ce', // Purple 700
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Professional'],
            color: ['Color'],
            level: ['Manager'],
            career: ['ทรัพยากรบุคคล / องค์กร', 'ธุรกิจ / การจัดการ / องค์กร', 'ราชการ / รัฐวิสาหกิจ']
        }
    },
    {
        id: 14,
        name: 'Academic Scholar',
        style: 'classic',
        color: '#991b1b', // Red 800
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['คนมีประสบการณ์'],
            style: ['Simple', 'Professional'],
            color: ['Color'],
            level: ['Senior'],
            career: ['การศึกษา / วิชาการ', 'ราชการ / รัฐวิสาหกิจ']
        }
    },
    {
        id: 15,
        name: 'Industrial Engineer',
        style: 'modern',
        color: '#64748b', // Slate 500
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Modern'],
            color: ['B&W'],
            level: ['Entry Level', 'Senior'],
            career: ['อุตสาหกรรม / วิศวกรรม', 'เทคโนโลยี / IT / ดิจิทัล']
        }
    },
    {
        id: 16,
        name: 'Government Officer',
        style: 'classic',
        color: '#4b5563', // Gray 600
        categories: {
            language: ['ภาษาไทย'],
            type: ['คนมีประสบการณ์'],
            style: ['Simple', 'Professional'],
            color: ['B&W'],
            level: ['Senior', 'Manager'],
            career: ['ราชการ / รัฐวิสาหกิจ', 'ทรัพยากรบุคคล / องค์กร', 'การศึกษา / วิชาการ']
        }
    },
    {
        id: 17,
        name: 'Business Startup',
        style: 'modern',
        color: '#8b5cf6', // Violet 500
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Modern', 'Creative'],
            color: ['Color'],
            level: ['Senior', 'Manager'],
            career: ['ธุรกิจ / การจัดการ / องค์กร', 'เทคโนโลยี / IT / ดิจิทัล', 'การตลาด / การขาย / สื่อสาร']
        }
    },
    /* --- USER CUSTOM REQUESTS --- */
    {
        id: 18,
        name: 'Wanida (Sales)',
        style: 'soft-block',
        color: '#fb923c', // Orange
        categories: {
            language: ['ภาษาไทย'],
            type: ['คนมีประสบการณ์', 'จบใหม่ / นักศึกษา'],
            style: ['Modern', 'Creative'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['การตลาด / การขาย / สื่อสาร', 'ธุรกิจ / การจัดการ / องค์กร', 'การบริการ / ท่องเที่ยว']
        }
    },
    {
        id: 19,
        name: 'Claudia (Creative)',
        style: 'creative-curve',
        color: '#a855f7', // Purple
        categories: {
            language: ['ภาษาอังกฤษ', 'ภาษาไทย'],
            type: ['จบใหม่ / นักศึกษา', 'คนมีประสบการณ์'],
            style: ['Creative', 'Modern'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['ออกแบบ / สร้างสรรค์ / UX/UI / สื่อ', 'การตลาด / การขาย / สื่อสาร']
        }
    },
    {
        id: 20,
        name: 'Connor (Tech)',
        style: 'tech-dark',
        color: '#000000', // Black
        categories: {
            language: ['ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์', 'จบใหม่ / นักศึกษา'],
            style: ['Modern', 'Professional'],
            color: ['B&W'],
            level: ['Senior', 'Manager', 'Entry Level'],
            career: ['เทคโนโลยี / IT / ดิจิทัล', 'อุตสาหกรรม / วิศวกรรม']
        }
    },
    {
        id: 21,
        name: 'Olivia (Engineer)',
        style: 'modern-curve',
        color: '#f97316', // Orange Red
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์'],
            style: ['Modern', 'Professional'],
            color: ['Color'],
            level: ['Senior', 'Manager'],
            career: ['อุตสาหกรรม / วิศวกรรม', 'ธุรกิจ / การจัดการ / องค์กร']
        }
    },
    {
        id: 22,
        name: 'Olivia (Healthcare)',
        style: 'professional-box',
        color: '#3b82f6', // Blue
        categories: {
            language: ['ภาษาไทย', 'ภาษาอังกฤษ'],
            type: ['คนมีประสบการณ์', 'จบใหม่ / นักศึกษา'],
            style: ['Professional', 'Simple'],
            color: ['Color'],
            level: ['Entry Level', 'Senior'],
            career: ['การแพทย์ / สุขภาพ', 'ราชการ / รัฐวิสาหกิจ', 'ทรัพยากรบุคคล / องค์กร']
        }
    },
] as const
