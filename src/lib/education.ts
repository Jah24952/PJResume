export const UNIVERSITIES = [
    "จุฬาลงกรณ์มหาวิทยาลัย", "มหาวิทยาลัยธรรมศาสตร์", "มหาวิทยาลัยเกษตรศาสตร์", "มหาวิทยาลัยมหิดล",
    "มหาวิทยาลัยเชียงใหม่", "มหาวิทยาลัยพะเยา", "มหาวิทยาลัยพายัพ", "มหาวิทยาลัยขอนแก่น",
    "มหาวิทยาลัยสงขลานครินทร์", "มหาวิทยาลัยศิลปากร", "มหาวิทยาลัยศรีนครินทรวิโรฒ",
    "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี", "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ",
    "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง", "มหาวิทยาลัยบูรพา", "มหาวิทยาลัยนเรศวร",
    "มหาวิทยาลัยรังสิต", "มหาวิทยาลัยกรุงเทพ", "มหาวิทยาลัยศรีปทุม", "มหาวิทยาลัยหอการค้าไทย",
    "มหาวิทยาลัยอัสสัมชัญ (ABAC)",
    "Harvard University", "Massachusetts Institute of Technology (MIT)", "Stanford University",
    "Harrisburg University", "University of California, Berkeley", "University of Oxford",
    "University of Cambridge", "Imperial College London", "National University of Singapore (NUS)",
    "Tokyo Institute of Technology", "Chiang Mai University", "Chiang Rai Rajabhat University"
]

export const FACULTY_MAJOR_MAP: Record<string, string[]> = {
    "วิศวกรรมศาสตร์ (Engineering)": [
        "วิศวกรรมคอมพิวเตอร์ (Computer Engineering)", "วิศวกรรมไฟฟ้า (Electrical)",
        "วิศวกรรมเครื่องกล (Mechanical)", "วิศวกรรมโยธา (Civil)",
        "วิศวกรรมอุตสาหการ (Industrial)", "วิศวกรรมเคมี (Chemical)",
        "วิศวกรรมชีวการแพทย์ (Biomedical)", "วิศวกรรมซอฟต์แวร์ (Software)", "อื่นๆ (Other)"
    ],
    "วิทยาศาสตร์ (Science)": [
        "วิทยาการคอมพิวเตอร์ (Computer Science)", "วิทยาศาสตร์ข้อมูล (Data Science)",
        "คณิตศาสตร์ (Mathematics)", "สถิติ (Statistics)", "เคมี (Chemistry)",
        "ชีววิทยา (Biology)", "ฟิสิกส์ (Physics)", "วิทยาศาสตร์สิ่งแวดล้อม (Environmental)", "อื่นๆ (Other)"
    ],
    "เทคโนโลยีสารสนเทศ (Information Technology)": [
        "เทคโนโลยีสารสนเทศ (IT)", "วิทยาการข้อมูลและการวิเคราะห์ (Data Analytics)",
        "เทคโนโลยีมัลติมีเดีย (Multimedia Tech)", "ความมั่นคงปลอดภัยทางไซเบอร์ (Cybersecurity)", "อื่นๆ (Other)"
    ],
    "บริหารธุรกิจ (Business/Commerce)": [
        "การตลาด (Marketing)", "การเงิน (Finance)", "บัญชี (Accounting)",
        "การจัดการ (Management)", "ธุรกิจระหว่างประเทศ (International Business)",
        "ระบบสารสนเทศเพื่อการจัดการ (MIS)", "การจัดการทรัพยากรมนุษย์ (HRM)", "อื่นๆ (Other)"
    ],
    "เศรษฐศาสตร์ (Economics)": [
        "เศรษฐศาสตร์ (Economics)", "เศรษฐศาสตร์ระหว่างประเทศ (International Economics)",
        "เศรษฐศาสตร์การเงิน (Financial Economics)", "อื่นๆ (Other)"
    ],
    "มนุษยศาสตร์ (Humanities)": [
        "ภาษาอังกฤษ (English)", "ภาษาไทย (Thai)", "ภาษาญี่ปุ่น (Japanese)",
        "ภาษาจีน (Chinese)", "ปรัชญา (Philosophy)", "อื่นๆ (Other)"
    ],
    "ศิลปศาสตร์ (Liberal Arts)": [
        "ภาษาศาสตร์ (Linguistics)", "วรรณคดี (Literature)", "จิตวิทยา (Psychology)", "อื่นๆ (Other)"
    ],
    "สังคมศาสตร์ (Social Sciences)": [
        "สังคมวิทยาและมานุษยวิทยา (Sociology and Anthropology)", "การพัฒนาสังคม (Social Development)", "อื่นๆ (Other)"
    ],
    "รัฐศาสตร์ (Political Science)": [
        "การเมืองการปกครอง (Government)", "ความสัมพันธ์ระหว่างประเทศ (International Relations)",
        "รัฐประศาสนศาสตร์ (Public Administration)", "อื่นๆ (Other)"
    ],
    "นิติศาสตร์ (Law)": [
        "กฎหมายธุรกิจ (Business Law)", "กฎหมายมหาชน (Public Law)",
        "กฎหมายระหว่างประเทศ (International Law)", "กฎหมายอาญา (Criminal Law)", "อื่นๆ (Other)"
    ],
    "นิเทศศาสตร์ (Communication Arts)": [
        "สื่อสารมวลชน (Mass Communication)", "วารสารศาสตร์ (Journalism)",
        "โฆษณา (Advertising)", "ประชาสัมพันธ์ (Public Relations)",
        "วิทยุและโทรทัศน์ (Radio & Television)", "ภาพยนตร์ (Film)", "อื่นๆ (Other)"
    ],
    "สถาปัตยกรรมศาสตร์ (Architecture)": [
        "สถาปัตยกรรม (Architecture)", "สถาปัตยกรรมภายใน (Interior Architecture)",
        "ภูมิสถาปัตยกรรม (Landscape Architecture)", "ออกแบบอุตสาหกรรม (Industrial Design)", "อื่นๆ (Other)"
    ],
    "แพทยศาสตร์ (Medicine)": [
        "แพทยศาสตร์ (Medicine)", "เวชศาสตร์ชุมชน (Community Medicine)", "อื่นๆ (Other)"
    ],
    "พยาบาลศาสตร์ (Nursing)": [
        "พยาบาลศาสตร์ (Nursing)", "การพยาบาลผู้ใหญ่และผู้สูงอายุ (Adult and Gerontological Nursing)", "อื่นๆ (Other)"
    ],
    "เภสัชศาสตร์ (Pharmacy)": [
        "เภสัชกรรมอุตสาหการ (Industrial Pharmacy)", "บริบาลเภสัชกรรม (Pharmaceutical Care)", "อื่นๆ (Other)"
    ],
    "สาธารณสุขศาสตร์ (Public Health)": [
        "อนามัยสิ่งแวดล้อม (Environmental Health)", "อาชีวอนามัยและความปลอดภัย (Occupational Health)",
        "สุขศึกษาและพฤติกรรมศาสตร์ (Health Education)", "อื่นๆ (Other)"
    ],
    "เกษตรศาสตร์ (Agriculture)": [
        "พืชไร่ (Agronomy)", "สัตวบาล (Animal Husbandry)",
        "เศรษฐศาสตร์การเกษตร (Agricultural Economics)", "กีฏวิทยา (Entomology)", "อื่นๆ (Other)"
    ],
    "ศึกษาศาสตร์ (Education)": [
        "การศึกษาปฐมวัย (Early Childhood Education)", "ประถมศึกษา (Elementary Education)",
        "การสอน (Teaching)", "บริหารการศึกษา (Educational Administration)", "อื่นๆ (Other)"
    ],
    "ครุศาสตร์ (Education/Teaching)": [
        "ภาษาอังกฤษ (Teaching English)", "ภาษาไทย (Teaching Thai)",
        "คณิตศาสตร์ (Teaching Math)", "วิทยาศาสตร์ (Teaching Science)", "อื่นๆ (Other)"
    ],
    "ศิลปกรรมศาสตร์ (Fine and Applied Arts)": [
        "ทัศนศิลป์ (Visual Arts)", "ดุริยางคศิลป์ (Music)",
        "นาฏศิลป์ (Performing Arts)", "การออกแบบนิทรรศการ (Exhibition Design)", "อื่นๆ (Other)"
    ],
    "อื่นๆ (Other)": ["อื่นๆ (Other)"]
}

export const FACULTIES = Object.keys(FACULTY_MAJOR_MAP)
