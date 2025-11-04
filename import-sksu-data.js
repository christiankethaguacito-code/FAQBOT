import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'sbo-faq.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

const sksuData = [
  {
    category: {
      name: 'University Profile & Identity',
      icon: '🎓',
      description: 'Vision, Mission, Core Values, Symbols, and History of SKSU',
      displayOrder: 1
    },
    questions: [
      {
        question: 'What is the vision of Sultan Kudarat State University (SKSU)?',
        answer: '"A leading University in advancing scholarly innovation, multi-cultural convergence, and responsive public service in a borderless Region."',
        displayOrder: 1
      },
      {
        question: 'What is the mission of Sultan Kudarat State University?',
        answer: '"The University shall primarily provide advanced instruction and professional training in science and technology, agriculture, fisheries, education and other relevant fields of study. It shall also undertake research and extension services, and provide progressive leadership in its areas of specialization."',
        displayOrder: 2
      },
      {
        question: 'What are the strategic goals of SKSU?',
        answer: '1. Deliver quality services to stakeholders to address current and future needs in instruction, research, extension, and production.\n2. Observe strict implementation of the laws as well as the policies and regulations of the University.\n3. Acquire with urgency state-of-the-art resources for its service areas.\n4. Bolster the relationship of the University with its local and international customers and partners.\n5. Leverage the qualifications and competence in personnel action and staffing.\n6. Evaluate the efficiency and responsiveness of the University systems and processes.',
        displayOrder: 3
      },
      {
        question: 'What are the core values of SKSU?',
        answer: 'Patriotism\nRespect\nIntegrity\nZeal\nExcellence in Public Service',
        displayOrder: 4
      },
      {
        question: 'What is the maxim of Sultan Kudarat State University?',
        answer: '"Generator of Solutions."',
        displayOrder: 5
      },
      {
        question: 'What does the SKSU seal symbolize?',
        answer: '"The seal of the University is not only a mark of its legal and public documents, communications, and publications, but more importantly, a symbol of the institution, thus clarity in its elements must be imposed. A seal does not only feature a distinctive object that would make identification clear and easy. More than that, it signifies the sentiments and aspirations that guide the institution and its constituents."',
        displayOrder: 6
      },
      {
        question: 'What does the SKSU logo represent?',
        answer: '"The logo of the Sultan Kudarat State University depicts the Ball Figure which symbolizes the Sultan Kudarat State University system as it rolls for its growth and development. The Imaginary Curve portrays the well-known Allah River that provides water coming from the Daguma Range to quench the thirst of the sun-parched and drought-stricken countryside. The Finger-like Projections in letters and M represent the five original campuses of the State University i.e., Tacurong, Isulan, Lutayan, Kalamansig and Palimbang. Letter V signifies the vision of the Sultan Kudarat State University. The Imaginary Straight Line across the ball, crossing the center area, connotes the central site and administrative center of the State University at EJC Montilla, Tacurong City where it serves the five campuses and the communities in the province, especially the towns where the five campuses are located. It symbolically underlines the SKSU Motto: \'Service to God and Country.\' The four irregular shapes with colors Green, Blue, Red, and Yellow represent the four-fold functions of SKSU namely: Instruction, Research, Extension, and Resource Generation."',
        displayOrder: 7
      },
      {
        question: 'What is the institutional mascot of SKSU and what does it signify?',
        answer: '"The Deer, a clever-toed, hoofed ruminant mammal of the family Cervidae, characteristically bearing branched deciduous antlers (horns) is the SKSU Institutional Mascot. In view of these attributes and peculiarities of the Deer, the SKSU Administration, Faculty, Facilitative Staff and students would like to be identified with this wonderful zoological creature, which they consider as the one which brings luck to them and the institution they represent."',
        displayOrder: 8
      },
      {
        question: 'What is the official color of Sultan Kudarat State University and what does it symbolize?',
        answer: '"The color of the University is Mint Green which symbolizes the verdant fields indicating healthy vegetation and, for the Institution, indicates sustained growth and development."',
        displayOrder: 9
      },
      {
        question: 'What does the acronym PRIZE stand for?',
        answer: 'P – Patriotism\nR – Respect\nI – Integrity\nZ – Zeal\nE – Excellence in Public Service',
        displayOrder: 10
      }
    ]
  },
  {
    category: {
      name: 'Academic Policies - General',
      icon: '📚',
      description: 'Academic year, class schedules, enrollment, registration, and student load policies',
      displayOrder: 2
    },
    questions: [
      {
        question: 'To what units do the academic policies of SKSU apply?',
        answer: '"The academic policies and guidelines herein prescribed shall primarily apply to the campuses and colleges of the University, including its extension, and special programs, if there is any. In the case of the Laboratory High School, the academic policies and guidelines governing thereof shall be those promulgated by the Department of Education (DepEd), other applicable rules and regulations adopted by the University, and as far as practicable, the provisions of this Manual."',
        displayOrder: 1
      },
      {
        question: 'How is the academic year divided at SKSU?',
        answer: '"The Academic Year shall be divided into two (2) semesters of at least eighteen (18) weeks in a semester and one (1) midyear of six (6) weeks respectively, having fifty-four (54) contact hours per three-unit course. In particular, the following details shall be observed:\na. Contact hours for the lecture is equivalent to one (1) hour per unit;\nb. Midyear session shall have the duration of six (6) weeks, and the course work is equivalent to a regular semester; and\nc. Crash course may be offered upon approval of the Academic Council."',
        displayOrder: 2
      },
      {
        question: 'When do classes start and who prepares the schedule?',
        answer: '"Classes start on the first day of the academic term. The schedule of classes shall be prepared by the Campus Class Scheduler who is assigned by the Campus Director in coordination with the Program Chairs, Student Records and Admission, and the Office of Instruction."',
        displayOrder: 3
      },
      {
        question: 'What is the standard class size at SKSU?',
        answer: '"The standard class size of the University is based on CHED policies, standards, and guidelines. For General Education courses the regular class size is forty (40) except for courses with a laboratory with maximum number of students of twenty five (25). In special cases and upon the approval of the Campus Director, a class size below the standard number may be opened. To guarantee the opening of a regular class for first year students during the first semester, there shall be at least twenty five (25) students enrolled in the subject."',
        displayOrder: 4
      },
      {
        question: 'When can classes be dismissed or suspended?',
        answer: '"Classes may be dismissed ten (10) minutes before the end of the schedule to give ample time to transfer from one room or building to another.\nA class is deemed dismissed fifteen (15) minutes after the time if the instructor/professor has not yet entered the classroom unless the faculty has informed the class of his/her delay.\nClasses shall be suspended automatically in case of sudden natural or man-made calamities.\nClasses may be suspended by a teacher due to valid reason with the approval of the Program Chair/Dean/Campus Director. The teacher shall provide assignments/activities to the students in his/her absence."',
        displayOrder: 5
      },
      {
        question: 'What is the policy on make-up classes?',
        answer: '"Make-up classes shall be held in lieu of class hours missed due to fortuitous events such as typhoons, earthquakes, other natural calamities, and other official intervening factors. Make-up classes may be conducted through online synchronous or asynchronous modality utilizing the E-leads and other online platforms, in addition to face-to-face modality. Provided however, that it shall not be in conflict with the other regular class schedules of the students. It must be duly recommended by the Program Chairperson and duly approved by the Dean."',
        displayOrder: 6
      },
      {
        question: 'What are the rules on classroom utilization?',
        answer: '"Classes shall be held in the assigned classroom. In case of change of classroom, proper notification shall be made by the concerned faculty to the students, Program Chairman, and Dean. Occupants of the classroom shall maintain its sanitation and orderliness. Classroom utilization shall be maximized."',
        displayOrder: 7
      },
      {
        question: 'What is required for medical examination before admission?',
        answer: '"All incoming freshmen and transferees must submit a Medical Examination Form (from the Health Services Division) duly signed by a private or government physician."',
        displayOrder: 8
      },
      {
        question: 'Can any student be denied admission due to race, gender, or beliefs?',
        answer: '"No student applicant shall be denied admission to the University for reasons of race, age, gender, socio-economic status, religion, political affiliation, conviction or ideology and physical disabilities."',
        displayOrder: 9
      },
      {
        question: 'What medical and health conditions can affect admission?',
        answer: '"As a prerequisite, every applicant for admission shall be required to pass thorough physical, medical and other examinations deemed necessary to be conducted by the government or private medical unit. A waiver of full disclosure of the enrollee\'s health status must be submitted to the Health Services Division. An enrollee may or may not be admitted to the University if found suffering from a communicable, contagious or infectious disease unless otherwise he/she is undergoing medical treatment upon presentation of a medical certificate of his/her attending physician and/or such exclusion is authorized by law."',
        displayOrder: 10
      },
      {
        question: 'Who are required to take the qualifying test?',
        answer: '"Incoming freshmen, transferees, and second coursers must take first the Qualifying Test. This is a standardized test that shall be administered to screen applicants."',
        displayOrder: 11
      },
      {
        question: 'What are the retention requirements for board and licensure programs?',
        answer: '"For board courses, qualifying examinations shall be conducted for students to proceed to higher year-level of the program. At the end of every semester, a student must obtain a General Point Average (GPA) of 2.50 or better. Otherwise, he/she shall be advised to shift course. In cases where a student failed in one (1) subject, he/she shall be issued a WARNING. Those who obtained two (2) or more failing grades in a semester shall be advised to SHIFT to a non-board program. Computation shall exclude the grades in the National Service Training Program (NSTP). The required GPA shall mean a rounded-off value at the nearest tenth place."',
        displayOrder: 12
      },
      {
        question: 'When is registration conducted and what rules apply?',
        answer: '"Registration of students shall only be conducted during the regular period as indicated in the University Academic Calendar through face-to-face or online. Rules on sequencing of subjects (pre-requisites) in the curriculum shall be observed and followed accordingly during enrolment. Enrolling in and attendance in a subject without passing its prerequisite shall earn no academic credit. Registration of a returning student shall be dependent on his/her previous scholastic standing."',
        displayOrder: 13
      },
      {
        question: 'What is the late registration policy?',
        answer: '"A late registration fee shall be charged per day to a student who enrolls after the regular registration period as provided for in the academic calendar but not to exceed five (5) school days. Late registration of students shall be allowed during the schedule of adding and dropping of subjects as provided for in the academic calendar."',
        displayOrder: 14
      },
      {
        question: 'What pledge must students sign upon admission?',
        answer: '"In consideration of my admission to the Sultan Kudarat State University and of the privileges of a student in this institution, I hereby promise and pledge to abide by and comply with all the rules and regulations and procedures of the university in which I am enrolled without prejudice. Refusal to take the pledge or violation of its terms shall be sufficient cause for summary dismissal."',
        displayOrder: 15
      },
      {
        question: 'What are the rules on cross-registration?',
        answer: '"Cross registration is only allowed within the campuses of the University. The student shall seek a written permission from the Program Chairman, duly noted by the College Dean/Campus Director and acknowledged by the Campus Registrar. Cross-registration should be done within the period of registration. Cross-registration shall be allowed in all curricular levels, provided that:\na. these subjects are not offered on the campus;\nb. must have the same course description, number of units; and\nc. must not be a major subject.\nThe total credit of students to cross-register shall not exceed six (6) units."',
        displayOrder: 16
      },
      {
        question: 'What are the rules on dropping, adding, or changing subjects?',
        answer: '"Dropping of subjects shall be allowed within two weeks after the start of classes. Dropping a subject shall be allowed on or before the Midterm Examination with justifiable reasons, but one has to pay the corresponding fees for the particular subject/s dropped. A student who unofficially dropped the subject shall be given a failing grade. Changing/adding of the subject(s) shall be allowed only for valid reasons and must be stated in writing to be recommended by the Program Chairman/Dean. Changing/adding of the subject(s) shall be made within two weeks after the start of classes with corresponding fees. Subjects changed/added without the approval of the University/Campus Registrar shall not be given credit."',
        displayOrder: 17
      },
      {
        question: 'What are the rules on shifting to another course?',
        answer: '"A student may shift to another course only once, provided that he/she has no failing grades and upon recommendation of the Program Chairperson and Dean/Director concerned. Shifting of courses shall only be allowed before the enrolment period. Any subsequent request for shifting must be approved by the Campus Director and University Registrar."',
        displayOrder: 18
      },
      {
        question: 'What is the residency requirement?',
        answer: '"An undergraduate student must finish the requirements of a course within a period of actual residence equivalent to a maximum of one and one-half times the normal length prescribed for the course; otherwise, the student shall not be allowed to re-enroll further in that program. During the occurrence of the state of national emergency, maximum residency shall be extended for three consecutive semesters only."',
        displayOrder: 19
      },
      {
        question: 'How is the student load computed?',
        answer: '"One unit of credit shall be at least 18 full hours of instruction per semester. Lecture class - 1 hour/unit. The undergraduate student\'s load for a semester shall be in accordance with the curricular program. During the midyear, a student may enroll the required nine (9) units. Graduating students shall be permitted to carry an overload of not more than six (6) units during the regular semester."',
        displayOrder: 20
      }
    ]
  },
  {
    category: {
      name: 'Academic Policies - Attendance & Exams',
      icon: '📝',
      description: 'Attendance requirements, examinations, grading system, and scholastic standing',
      displayOrder: 3
    },
    questions: [
      {
        question: 'What are the attendance requirements for students?',
        answer: '"Whenever a student has been absent for three (3) consecutive meetings, he/she shall seek an Admission Slip from the Program Chairman/the Dean, and it shall be given to the respective subject Instructor. Students who shall incur at least twenty per cent (20%) unexcused absences of the total number of contact hours shall be automatically dropped from the subject. Time lost by students\' late enrolment shall be considered as time lost in attendance."',
        displayOrder: 1
      },
      {
        question: 'What absences are considered excused?',
        answer: '"Absences due to the following reasons are considered excused:\n\n1. A student sent on official business by the university to attend athletic meets, conferences, and similar cases or who joined class field trips. Approved Travel Order and Itinerary of Travel or approved request of field trip should be attached to the application form for excused absences.\n2. A student who has been ill or/and confined for hospitalization provided a medical certificate shall be submitted to the Program Chairman/Dean to be excused from his/her classes shall be given the option and opportunity to comply with the requirements of the course."',
        displayOrder: 2
      },
      {
        question: 'What is the purpose of examinations?',
        answer: '"Examinations are integral components of instruction and shall be administered by the instructor/professor for the purpose of evaluating the students\' performance."',
        displayOrder: 3
      },
      {
        question: 'What are the general rules on the administration of examinations?',
        answer: '"Giving the examination ahead or later than the approved schedule shall need written permission from the Campus Director/Dean. No student shall be allowed to take the Final Examination unless he/she has settled the obligations from the college/campus. Two examination terms shall be given per semester: Midterm and Final Examinations. A special examination shall be given to a student who had an excused absence within ten days after the last day of the examination subject to the approval of the Program Chair and the Dean. A student shall take a special examination upon payment of the required fee per subject to the Cashier. Removal Examination shall be given to students whose rating in a particular course is conditional. It shall be administered within five (5) working days after the scheduled Final Examination. Checked examinations, assessments, assignments, and the likes shall be returned to the students for reference."',
        displayOrder: 4
      },
      {
        question: 'What are the allowable reasons for special examinations?',
        answer: '"A special examination shall be given to a student who had an excused absence within ten days after the last day of the examination subject to the approval of the Program Chair and the Dean."',
        displayOrder: 5
      },
      {
        question: 'When must grades be submitted by instructors?',
        answer: '"Report of grades shall be submitted not later than ten (10) working days after the scheduled Final Examination."',
        displayOrder: 6
      },
      {
        question: 'What is the official grading system of SKSU?',
        answer: '"The grading system shall be uniform using the numerical value in the multiple of 0.25 from 1.0 where 1.0 is the highest and 3.0 is the lowest passing grade.\n\n1.0 (99–100) = A+ Excellent\n1.25 (96–98) = A Very Good\n1.5 (93–95) = A– Very Good\n1.75 (90–92) = B+ Above Average\n2.0 (87–89) = B Above Average\n2.25 (84–86) = B– Average\n2.5 (81–83) = C+ Average\n2.75 (78–80) = C Passing\n3.0 (75–77) = C– Passing\n4.0 (71–74) = D Conditional\n5.0 (70 & Below) = F Failed\nINC = Incomplete\nDRP = Dropped"',
        displayOrder: 7
      },
      {
        question: 'What does a grade of INC mean?',
        answer: '"The grade of INC is given if a student is passing but fails to take the final examination or fails to complete all requirements for the course due to illness or other valid reasons. Completion of INC shall be the sole responsibility of the student. The student shall be given a completion period of one (1) year from the time of issuance of the grade to comply with the requirements."',
        displayOrder: 8
      },
      {
        question: 'What happens if the INC is not completed within one year?',
        answer: '"Failure to comply within one (1) year automatically converts the grade of INC to 5.0 (Failed)."',
        displayOrder: 9
      },
      {
        question: 'What does NG (No Grade) mean?',
        answer: '"In case of the state of national emergency, the grade of No Grade (NG) shall be applicable or as prescribed by the CHED. \'No Grade\' shall be completed within one year to commence on the semester the student has been enrolled."',
        displayOrder: 10
      },
      {
        question: 'What is the policy on dropping and repeating subjects?',
        answer: '"A student who officially dropped the subject on or before the midterm shall receive a DRP (Dropped) mark. A student who unofficially dropped the subject shall be given a failing grade of 5.0. A student may re-enroll in a failed subject but not more than twice."',
        displayOrder: 11
      },
      {
        question: 'What are the categories of scholastic standing?',
        answer: '1. **Good Standing** – A student who passes all enrolled subjects during the term.\n2. **On Probation** – A student who fails in one or two subjects but whose GPA is still satisfactory.\n3. **Dismissed** – A student who fails in three or more subjects during the term or has an unsatisfactory GPA.\n4. **Permanently Disqualified** – A student who has been dismissed twice for poor scholarship.',
        displayOrder: 12
      },
      {
        question: 'What are the rules on probation and readmission?',
        answer: '"A student placed on probation shall be required to meet with the Guidance Counselor for evaluation and counseling. He/she may be re-admitted the next semester on the condition that improvement in performance shall be observed. Failure to improve shall result in dismissal."',
        displayOrder: 13
      }
    ]
  },
  {
    category: {
      name: 'Graduation & Honors',
      icon: '🎓',
      description: 'Graduation requirements, Latin honors, thesis, internship, and competency enhancement',
      displayOrder: 4
    },
    questions: [
      {
        question: 'What are the requirements for graduation?',
        answer: '"Candidates for graduation must have satisfied all academic and other requirements prior to graduation. The Campus Evaluation Committee headed by the Campus Registrar shall assess, evaluate, and recommend candidates for graduation to the University Registrar who shall validate the evaluated records prior to presentation during the University Academic Council meeting."',
        displayOrder: 1
      },
      {
        question: 'What are the Latin honors granted by SKSU?',
        answer: '• **Summa Cum Laude** – GPA 1.00 to 1.25\n• **Magna Cum Laude** – GPA 1.26 to 1.50\n• **Cum Laude** – GPA 1.51 to 1.75',
        displayOrder: 2
      },
      {
        question: 'What are the conditions for receiving Latin honors?',
        answer: '"A candidate for graduation with honors must have completed at least seventy-five percent (75%) of the total units required for the course in the University, must not have repeated any subject, and must have no record of any grave violation of University rules and regulations."',
        displayOrder: 3
      },
      {
        question: 'Who certifies graduation and issues diplomas?',
        answer: '"The Board of Regents, upon recommendation of the University President, confers the academic degrees and issues diplomas to students who have satisfactorily completed all requirements for graduation."',
        displayOrder: 4
      },
      {
        question: 'What are the thesis or research requirements and fees?',
        answer: '"The Thesis/Research Fees shall be distributed as follows:\n\nAdviser: ₱1,000.00 (₱500 outline + ₱500 final)\nPanel 1: ₱500.00\nPanel 2: ₱500.00\nStatistician: ₱500.00\nCritic Reader: ₱500.00\nValidator: ₱500.00\nTotal: ₱3,250.00\n\nFifty percent (50%) of the payment will be collected during the outline defense and the other fifty percent (50%) during the final defense."',
        displayOrder: 5
      },
      {
        question: 'What are the policies on internship or OJT (On-the-Job Training)?',
        answer: '"Internship refers to the application of classroom learning to actual work. Internship policies and guidelines in the various programs of the University shall be in accordance with existing standards, policies, rules, and regulations. The internship shall be offered to students as required in the curriculum either during the first/second semester or summer of each academic year. Both parties shall observe strictly the guidelines stipulated in the Memorandum of Agreement. An intern who has not complied with the internship requirement shall not be recommended for graduation. All female OJTs/Interns shall be required to submit a Serum Pregnancy Test Result (SPTR) and Notarized Waiver, if found pregnant, prior to deployment to ensure safety and proper deployment."',
        displayOrder: 6
      },
      {
        question: 'What is the purpose of the Competency Enhancement Program (CEP)?',
        answer: '"The Competency Enhancement Program (CEP) primarily aims to enhance the knowledge, skills, and attitudes of students. It also centers on improving their self-confidence in taking the Board Examinations like LET, NLE, MLE, CPALE, CELE, etc. The CEP shall apply to all 4th-year students enrolled in Board curricular programs in any campus of the University."',
        displayOrder: 7
      },
      {
        question: 'How much is the CEP fee and how is it allocated?',
        answer: '"All students who shall undergo the program must pay a CEP Fee of ₱1,000.00 intended for the costs of review materials, modules, hand-outs, test papers, and honoraria of involved faculty-mentors and personnel. The allocation of the said collection shall be as follows:\n\n• 70% for honoraria\n• 20% for instructional materials and other program needs\n• 10% for College IGP Funds."',
        displayOrder: 8
      }
    ]
  },
  {
    category: {
      name: 'Student Services & Welfare',
      icon: '💙',
      description: 'Guidance, health services, library, scholarships, organizations, and student support',
      displayOrder: 5
    },
    questions: [
      {
        question: 'What are the objectives of the Guidance and Counseling Program of SKSU?',
        answer: '"The University shall provide guidance programs and counseling services to students, personnel, and other stakeholders by offering opportunities for total human growth and development. The Guidance and Counseling Program aims to assist the individual to understand himself / herself, discover and develop his / her potentialities, adjust to his / her environment, and plan for a meaningful life."',
        displayOrder: 1
      },
      {
        question: 'What services are included in the University\'s Guidance Program?',
        answer: '"The University shall offer the following services:\na. Orientation Service; b. Information Service; c. Counseling Service; d. Follow-up Service; e. Placement Service; f. Referral Service; g. Research and Evaluation Service; h. Testing Service; and i. Extension and Community Outreach Service."',
        displayOrder: 2
      },
      {
        question: 'What testing services are offered?',
        answer: '"Psychological Testing Service (PTS) refers to the administration, scoring and interpretation of psychological tests as basis for evaluation of aptitude, interest and personality of students. It includes:\na. SKSU Tertiary Placement Test; b. Employment Testing; c. Special Testing upon request by the Dean/Director; d. Evaluation and Validation of test results for research purposes."',
        displayOrder: 3
      },
      {
        question: 'What health services does SKSU provide for students?',
        answer: '"The University shall provide and maintain health facilities and services in terms of the following:\na. Medical and Dental Examination of University students shall be conducted once per semester;\nb. Medical and Dental Examination of High School students shall be conducted once a year;\nc. Clinic services during class days shall be observed as scheduled;\nd. Referral of cases to retainer Physician and Dentist for further medical and dental management;\ne. First aid and Emergency Treatment; and\nf. Free medicines for First aid treatment only."',
        displayOrder: 4
      },
      {
        question: 'What other health activities are offered by the University?',
        answer: '"Other Services include: a. Scheduled Medical-Dental Services; b. First aid during Sports Activities; c. Training of Red Cross Youth Council Volunteer Members; d. Routine Ocular Inspection of Campus Canteens; e. Symposium on Health Awareness; f. Blood Letting Program; and g. Regular Water Analysis."',
        displayOrder: 5
      },
      {
        question: 'What services does the University Library provide?',
        answer: '"The University shall provide library and consultation services to students in connection with their research needs. It shall offer the following services: Reference Services, Library Tours, Library Orientation / Instruction Program, Reserved Services, Circulation Services, New Acquisition Display, Photocopying Services, Technical Services, Acquisition Services, Indexing Services, Current Awareness Services, Information Services, Bibliographic Services, and E-Library Services."',
        displayOrder: 6
      },
      {
        question: 'What are the general rules and regulations in the use of the University Library?',
        answer: '"a. All students, visitors and outside users are required to log in / out.\nb. Idle conversations, laughter and unnecessary noise will disturb other library clienteles.\nc. Eating, smoking and sleeping are not allowed inside the library.\nd. Users should observe proper conduct and silence at all times.\ne. Books and magazines must be returned on or before the due date.\nf. The loss of a book must be reported immediately and shall be replaced with the same title or the latest edition and of the same author.\ng. All students must secure library clearance before final examinations."',
        displayOrder: 7
      },
      {
        question: 'What scholarships and financial grants are available to students?',
        answer: '"The University shall provide scholarship grants, financial assistance and grants-in-aid to students in accordance with existing laws, rules and regulations. These include:\na. Entrance Scholarship for valedictorians and salutatorians;\nb. Academic Scholarship for students who excel in their studies;\nc. Athletic Scholarship for outstanding athletes;\nd. Government and Private Scholarships as endorsed by CHED, LGUs, and private donors; and\ne. Grants-in-Aid for deserving students who need financial support."',
        displayOrder: 8
      },
      {
        question: 'What are the general requirements to qualify for a scholarship?',
        answer: '"The student must have a good moral character, must not have a record of misconduct or disciplinary action, must carry the required academic load and maintain the prescribed GPA set for each type of scholarship."',
        displayOrder: 9
      },
      {
        question: 'How are student organizations regulated at SKSU?',
        answer: '"There shall be a Committee on Student Organizations and Activities which shall coordinate and supervise University-wide student organizations in accordance with existing laws, rules, and regulations. All organizations must be recognized and accredited by the University through the Office of Student Affairs and Services (OSAS)."',
        displayOrder: 10
      },
      {
        question: 'Can student organizations raise funds?',
        answer: '"No student organization shall be allowed to conduct fund-raising activities without prior authorization or approval from the concerned authorities. The disbursement of funds collected shall be subject to existing laws, rules and regulations."',
        displayOrder: 11
      },
      {
        question: 'What documents are required for any organization activity?',
        answer: '"All student organization activities shall have an Activity / Project Design with required documents to be reviewed and checked by the Campus SBO Adviser, signed by the Campus Director / Dean, recommended by the OSAS to the OVPAA and approved by the Office of the President."',
        displayOrder: 12
      },
      {
        question: 'When are student elections held?',
        answer: '"The SBO Election shall be held during the third week of August of every year. The USG Election shall be conducted during the Annual Leadership Training Seminar and Workshop (WE LEAD). Department, class and club elections shall be scheduled two weeks after the start of classes of the first semester."',
        displayOrder: 13
      },
      {
        question: 'What is the University Student Government (USG)?',
        answer: '"There shall be a University Student Government that will serve as the highest governing body of the students with functions to represent the student body, promote student welfare, and coordinate activities among campus organizations."',
        displayOrder: 14
      },
      {
        question: 'What sports and socio-cultural services does the University offer?',
        answer: '"Every student of SKSU shall be entitled to use the University\'s athletic and socio-cultural facilities and equipment during the official time for free to develop his / her skills and talents. There shall be an In-charge for the Sports and Socio-cultural activities which shall formulate and implement the approved sports and socio-cultural policies."',
        displayOrder: 15
      },
      {
        question: 'What are the guidelines in granting sports and socio-cultural assistantships?',
        answer: '"The assistantship shall be for one academic year only. A regular member must pass all the subjects / units enrolled in. The participants shall be given due credit on their participation in the computation of grade in the Physical Education subject. Bonuses shall be granted for garnering gold, silver and bronze medals in competitions."',
        displayOrder: 16
      },
      {
        question: 'Does SKSU provide housing facilities for students?',
        answer: '"The University shall provide residence halls / dormitories for students where they are expected to reside, particularly for freshmen. Students not living in the University residence halls / dormitories shall be advised to reside in the homes or dormitories included in the duly accredited list of boarding houses as determined by the Office of the Director for Student Affairs."',
        displayOrder: 17
      },
      {
        question: 'What auxiliary services are provided by the University?',
        answer: '"The University, if possible, shall provide other auxiliary services to cater to the needs of the students like canteen or cafeteria, bookstore and supplies, recreational facilities, mails / telegrams / telephones, and lost-and-found services."',
        displayOrder: 18
      }
    ]
  },
  {
    category: {
      name: 'Student Conduct & Discipline',
      icon: '⚖️',
      description: 'Code of conduct, student rights, responsibilities, offenses, and disciplinary procedures',
      displayOrder: 6
    },
    questions: [
      {
        question: 'What is the basis of the Student Code of Conduct and Discipline?',
        answer: '"ARTICLE 21. CODE OF STUDENT CONDUCT AND DISCIPLINE — Every student of Sultan Kudarat State University shall at all times conduct himself / herself in accordance with the ideals of honesty, integrity, decency, morality and good order. He / She shall observe the laws of the land, the rules and regulations of the University, and the accepted customs and traditions of the Filipino people."',
        displayOrder: 1
      },
      {
        question: 'What fundamental rights are guaranteed to SKSU students?',
        answer: '1. Right to quality education;\n2. Right to organize / join organizations;\n3. Right to academic freedom within the bounds of the law;\n4. Right to due process in disciplinary cases;\n5. Right to free expression consistent with University policies;\n6. Right to access information and records pertaining to their academic status;\n7. Right to participate in University affairs through student representatives; and\n8. Right to security of person and property within the campus.',
        displayOrder: 2
      },
      {
        question: 'What are the duties and responsibilities of SKSU students?',
        answer: '"Students shall obey the laws of the land, the rules and regulations of the University, respect constituted authorities, preserve University property, uphold the honor and integrity of the University, and participate in civic and community development activities."',
        displayOrder: 3
      },
      {
        question: 'What are the regulations on wearing the school uniform?',
        answer: '"Wearing of PE uniforms is during PE classes only. Wearing of OJT / Internship / Medical Uniform may be permitted during regular days in coordination with the Chairman, Dean and the Campus Director. Male students should not wear earrings. Jewelry worn by female students should not be garish, excessive, or vulgar. Moderately long hair among male students must be neatly fixed and tied. There must be no ponytails, hair clips or headbands among male students. The use of tight-fitting halter-top, shorts, tattered pants, micro-miniskirts, transparent, and other indecent attire by the student is prohibited. Students not wearing the prescribed school uniforms will not be allowed to enter the school premises unless otherwise permitted / for a valid reason approved by the program chair. Pregnant students are exempted from wearing the school uniform but must observe the color of the prescribed uniform."',
        displayOrder: 4
      },
      {
        question: 'What are the rules for student identification cards?',
        answer: '"Identification Card (ID) shall be issued by the University / Campus Registrar to incoming freshmen only and shall be worn at all times during the school and activity days. ID Cards issued to students in the higher years shall be validated by the Registrar every semester. In case of loss, presentation of an affidavit of loss and payment of the corresponding amount for re-issuance of ID card shall be required."',
        displayOrder: 5
      },
      {
        question: 'How should students behave within the University?',
        answer: '"Students shall always maintain courtesy, discipline and respect for authority, peers, faculty, and staff. They shall refrain from disorderly behavior, destruction of property, gambling, drunkenness, and other acts unbecoming of a student."',
        displayOrder: 6
      },
      {
        question: 'Are students accountable for acts committed off-campus?',
        answer: '"Yes. Students shall be held responsible for any misconduct committed outside the University which affects the good name or reputation of the University or its members."',
        displayOrder: 7
      },
      {
        question: 'What acts are considered major offenses?',
        answer: '• Cheating in examinations;\n• Forgery or falsification of documents;\n• Gross acts of disrespect toward faculty / officials;\n• Physical injury or assault within the campus;\n• Possession of deadly weapons or illegal drugs;\n• Gambling and drunkenness within campus premises;\n• Vandalism or destruction of University property;\n• Indecent or immoral acts contrary to public decency;\n• Unauthorized use of University name or logo;\n• Membership in banned organizations such as fraternities / sororities engaged in hazing.',
        displayOrder: 8
      },
      {
        question: 'What are examples of minor offenses?',
        answer: '"Tardiness, improper attire, littering, loud noise in classrooms, and smoking within prohibited areas are considered minor offenses."',
        displayOrder: 9
      },
      {
        question: 'What sanctions may be imposed for violations of University rules?',
        answer: '"The following sanctions may be imposed depending on the gravity of the offense: Reprimand, Suspension, Dismissal, or Expulsion."',
        displayOrder: 10
      },
      {
        question: 'What is the effect of a suspension order?',
        answer: '"Where the suspension is for one semester or more, the student shall move out of the University jurisdiction within 72 hours after the suspension order took effect."',
        displayOrder: 11
      },
      {
        question: 'What happens after reprimand or suspension?',
        answer: '"In all cases of reprimand and / or suspension, a written promise of future exemplary conduct by the student and countersigned by his / her parent / guardian is required as a condition for readmission."',
        displayOrder: 12
      },
      {
        question: 'What is the rule on expulsion?',
        answer: '"When the penalty of expulsion is meted, the student cannot re-enroll in any course in the University."',
        displayOrder: 13
      },
      {
        question: 'Give examples of specific offenses and corresponding penalties.',
        answer: '• Playing online games during class hours – First Offense: Suspension for one (1) semester; Second Offense: Expulsion.\n• Unauthorized organizing / joining of any fraternity, sorority or unrecognized organization – First Offense: Suspension for one month; Second Offense: Suspension for one semester; Third Offense: Expulsion.',
        displayOrder: 14
      },
      {
        question: 'Who may initiate disciplinary proceedings?',
        answer: '"A disciplinary proceeding shall be instituted motu proprio by the appropriate authority or upon the filing of a written charge specifying the acts or omissions constituting the misconduct and subscribed to by the complainant or upon submission of an official report of any violation of existing rules and regulations."',
        displayOrder: 15
      },
      {
        question: 'What are the steps followed in a student disciplinary case?',
        answer: '1. Filing of complaint or official report;\n2. Preliminary evaluation by the Campus Student Discipline Committee;\n3. Service of written charges to the respondent;\n4. Submission of written answer within three (3) days;\n5. Hearing with notice to all parties at least two (2) days before;\n6. Preparation of findings and recommendations;\n7. Decision by the appropriate disciplinary authority; and\n8. Appeal if applicable.',
        displayOrder: 16
      },
      {
        question: 'Who investigates student disciplinary cases?',
        answer: '"The Campus Student Discipline Committee, composed of the Campus Director / Dean, Program Chairman, Campus Prefect of Discipline, a Faculty Representative, an SBO Representative, and a Campus PTA Representative, shall have exclusive authority to investigate student disciplinary cases officially filed before the proper authority in the Campus."',
        displayOrder: 17
      },
      {
        question: 'What is the jurisdiction of the University Student Discipline Committee?',
        answer: '"The University Student Discipline Committee shall review final judgments, decisions, resolutions, and orders from the Campus Student Discipline Committee only in instances where expulsion is the penalty and shall submit its findings and recommendations to the University President."',
        displayOrder: 18
      },
      {
        question: 'What rights are afforded to the student during investigation?',
        answer: '"The student respondent shall enjoy the right to be informed in writing of the nature and cause of the accusation, to answer the charges in writing, to be heard by himself / herself and counsel, to present evidence in his / her behalf, and to appeal adverse decisions in accordance with University rules."',
        displayOrder: 19
      },
      {
        question: 'What is the effect of filing an appeal?',
        answer: '"The filing of an appeal within the prescribed period shall stay the execution of the decision appealed from until final action is taken by the higher authority."',
        displayOrder: 20
      }
    ]
  },
  {
    category: {
      name: 'Administrative Rules & Special Provisions',
      icon: '📋',
      description: 'Transfer credentials, clearance, field trips, publications, alumni, and records',
      displayOrder: 7
    },
    questions: [
      {
        question: 'What is a Transfer Credential and when is it issued?',
        answer: '"A transfer credential is issued only once to a student who wishes to transfer to another school or to a graduate student who wishes to proceed to an advanced education or to take another degree in other institution."',
        displayOrder: 1
      },
      {
        question: 'What are the requirements before a Transfer Credential is released?',
        answer: '"Before a Transfer Credential is issued, the student is required to submit an accomplished Clearance Form and have to pay the required fees."',
        displayOrder: 2
      },
      {
        question: 'Who signs and seals the Transfer Credential?',
        answer: '"The Transfer Credential, including the copy of the grades, shall be forwarded to the Office of the University Registrar for signature and imprint of University Seal after validating the records. The University Registrar shall release the Transfer Credential together with the copy of grades."',
        displayOrder: 3
      },
      {
        question: 'What is the policy on University clearance?',
        answer: '"Every student shall secure clearance from all offices concerned before he / she is allowed to take the final examination and before credentials are released. The clearance shall indicate that the student has settled all academic, financial and property accountabilities with the University."',
        displayOrder: 4
      },
      {
        question: 'What is the purpose of educational tours and field trips?',
        answer: '"Educational tours / field trips are intended to enhance the learning experiences of students through firsthand exposure to actual work environments related to their course or subject."',
        displayOrder: 5
      },
      {
        question: 'What approvals are required for a field trip or off-campus activity?',
        answer: '"Field trips / off-campus activities shall require an Activity / Project Design with details of destination, date, time, participants, faculty in-charge, and means of transportation. The proposal shall be endorsed by the Program Chair and Dean / Director, recommended by the Office of Student Affairs and Services ( OSAS ), and approved by the Office of the Vice President for Academic Affairs and the University President."',
        displayOrder: 6
      },
      {
        question: 'What documents must students submit before a tour?',
        answer: '"Students shall submit parental consent forms, medical clearance, and waivers of liability prior to participation in educational tours / field trips."',
        displayOrder: 7
      },
      {
        question: 'What happens to students who cannot join the field trip?',
        answer: '"Students who cannot join the field trip for valid reasons shall be given alternative activities / assignments to cover the missed learning experience."',
        displayOrder: 8
      },
      {
        question: 'Does SKSU recognize a student publication?',
        answer: '"Yes. There shall be an official student publication in each campus as a medium for free expression and responsible journalism subject to the rules of the University."',
        displayOrder: 9
      },
      {
        question: 'Who composes the editorial board of the student publication?',
        answer: '"The Editorial Board shall be composed of student editors and staff chosen through a qualifying examination / screening to be administered by the Publication Adviser and the Committee on Student Publications."',
        displayOrder: 10
      },
      {
        question: 'How is the publication funded?',
        answer: '"The student publication shall be financed through the student publication fee and other lawful sources of income as approved by the University Administration."',
        displayOrder: 11
      },
      {
        question: 'What principles govern student publications?',
        answer: '"The publication shall observe freedom of the press and responsible journalism and shall not publish libelous or obscene materials contrary to law and morality."',
        displayOrder: 12
      },
      {
        question: 'What is the purpose of the Alumni Association?',
        answer: '"The University recognizes the Alumni Association as an integral part of its community to maintain linkages with graduates and to promote the University\'s development programs. It serves to foster camaraderie, mutual assistance, and institutional loyalty among graduates."',
        displayOrder: 13
      },
      {
        question: 'What office handles alumni relations?',
        answer: '"The Alumni Affairs and Placement Office under the Office of Student Affairs and Services is responsible for maintaining records of graduates, coordinating alumni activities, and providing career placement assistance."',
        displayOrder: 14
      },
      {
        question: 'Who keeps official student records?',
        answer: '"The University Registrar shall maintain permanent and confidential records of students\' academic work and shall release such records only in accordance with existing laws and University policies."',
        displayOrder: 15
      },
      {
        question: 'What is the retention period for student records?',
        answer: '"Permanent records such as transcripts and certifications shall be kept for an indefinite period by the Registrar while supporting documents may be archived or disposed of in accordance with University records management rules."',
        displayOrder: 16
      },
      {
        question: 'Who approves amendments to the Student Manual?',
        answer: '"Any amendment or revision to this Manual shall be subject to the approval of the University President upon recommendation of the University Administrative Council and the Board of Regents."',
        displayOrder: 17
      },
      {
        question: 'When does the Manual take effect?',
        answer: '"This Manual shall take effect immediately upon its approval by the Board of Regents and shall supersede all previous policies and issuances inconsistent herewith."',
        displayOrder: 18
      }
    ]
  }
];

console.log('\n📝 SKSU Student Manual Data Importer');
console.log('============================================================\n');

// Clear existing data
console.log('🗑️  Clearing existing data...');
db.prepare('DELETE FROM questions').run();
db.prepare('DELETE FROM categories').run();
console.log('✅ Cleared old data\n');

console.log('📦 Importing SKSU Student Manual data...\n');

let totalQuestions = 0;

sksuData.forEach((item) => {
  // Insert category
  const categoryResult = db.prepare(`
    INSERT INTO categories (name, icon, description, display_order)
    VALUES (?, ?, ?, ?)
  `).run(
    item.category.name,
    item.category.icon,
    item.category.description,
    item.category.displayOrder
  );

  const categoryId = categoryResult.lastInsertRowid;
  console.log(`✅ Added category: ${item.category.icon} ${item.category.name} (ID: ${categoryId})`);

  // Insert questions for this category
  item.questions.forEach((q) => {
    db.prepare(`
      INSERT INTO questions (category_id, question, answer, display_order)
      VALUES (?, ?, ?, ?)
    `).run(categoryId, q.question, q.answer, q.displayOrder);
    
    console.log(`   ↳ Added question: ${q.question.substring(0, 60)}...`);
    totalQuestions++;
  });

  console.log('');
});

console.log('============================================================');
console.log('✅ SKSU Student Manual data import complete!\n');
console.log('📊 Summary:');
console.log(`   Categories: ${sksuData.length}`);
console.log(`   Total Questions: ${totalQuestions}\n`);
console.log('🚀 Start server: node server.js');
console.log('🌐 Visit: http://localhost:3000\n');
