ELOQUENTE CATERING SYSTEM (ECS): A CATERING
MANAGEMENT SYSTEM WITH DYNAMIC RULE-BASED
AUTOMATION, DECISION SUPPORT, AND PREDICTIVE
ANALYTICS FOR REVENUE AND DEMAND FORECASTING

by

AQUINO, John Maverick M.
BUSCANO, Rafael Angelo P.
DONATO, John Darev A.
DURAN, Tyron Jude G.

Submitted in Partial Fulfillment of the Requirements for the Degree of

Bachelor of Science in Information Technology
with specialization in Business Analytics

at

FEU Institute of Technology

January 2026

Project Adviser
Ms. Geliza Marie I. Alcober

ELOQUENTE CATERING SYSTEM (ECS): A CATERING MANAGEMENT SYSTEM WITH DYNAMIC RULE-BASED AUTOMATION, DECISION SUPPORT, AND PREDICTIVE ANALYTICS FOR REVENUE AND DEMAND FORECASTING

© 2026 Aquino, Buscano, Donato, and Duran.

All Rights Reserved

The author/s grant FEU Institute of Technology permission to reproduce and distribute
the contents of this document in whole or in part.

ii

APPROVAL AND ACCEPTANCE SHEET

The  capstone  project  entitled  “Eloquente  Catering  System  (ECS):  A  Catering
Management System with Dynamic Rule-Based Automation, Decision Support, and
Predictive Analytics  for Revenue and Demand Forecasting”  prepared and submitted
by:

Aquino, John Maverick M.
Buscano, Rafael Angelo P.
Donato, John Darev A.
Duran, Tyron Jude G.

In partial fulfillment of the course requirement for the Degree of Bachelor of Science in
Information Technology with specialization in Business Analytics has been examined and
is hereby recommended for approval.

___________________________
          Ms. Maribel Campo                                                    Marites Fontanilla, PhD
     Panelist 1                                                                        Panelist 2

_____________________________

                                               ________________________

               Joseph G. Gonzales, DIT

            Head Panelist

Accepted as partial fulfillment of the requirements for the Degree of Bachelor of Science
in Information Technology with specialization in Business Analytics

___________________________                                    __________________________
   Ms. Geliza Marie I. Alcober                                                Janice A. Abellana, PhD
             Project Adviser                                                                 Course Adviser

                                               ________________________
Roman M. De Angel, DIT
Department Head

             March 4, 2026

iii

ACKNOWLEDGMENT

The  successful  completion  of  this  capstone  project, “Eloquente  Catering  System

(ECS): A Catering Management System with Dynamic Rule-Based Automation, Decision

Support, and Predictive Analytics for Revenue and Demand Forecasting,” would not have

been  possible  without  the  contributions  of  many.  The  researchers  extend  their  utmost

gratitude to the following:

The  Almighty  God,  for  providing  the  team  with  the  wisdom,  strength,  and

perseverance needed to navigate this journey.

Mr.  Joseph  Gonzales,  DIT,  our  course  adviser,  for  her  exceptional  guidance  and

constructive feedback that pushed our team to deliver nothing short of excellence.

Ms.  Geliza  Marie  Alcober,  our  mentor,  for  generously  sharing  her  technical

expertise and dedicating her time to help refine the system’s architecture and logic.

Mr. Jeric Sebastian and Ms. Jo-Ann Sebastian of Eloquente Catering Services, for

welcoming us, answering our questions, and trusting us with the critical data that served as

the foundation of this project.

Our  Parents,  for  their  endless  patience,  financial  backing,  and  moral  support  that

kept us motivated through the hardest days of development.

Our Respondents, for taking the time to participate in our surveys and providing the

data necessary to validate our system.

Finally,  to  the Members  of  Team  4FRONT,  for  the  shared  late  nights,  the

collaborative teamwork, and the shared dedication to turning this concept into a reality.

iv

TABLE OF CONTENTS

ELOQUENTE CATERING SYSTEM (ECS): A CATERING MANAGEMENT

SYSTEM WITH DYNAMIC RULE-BASED AUTOMATION, DECISION SUPPORT,

AND PREDICTIVE ANALYTICS FOR REVENUE AND DEMAND FORECASTING i

APPROVAL AND ACCEPTANCE SHEET .................................................................... iii

ACKNOWLEDGMENT.................................................................................................... iv

TABLE OF CONTENTS .................................................................................................... v

LIST OF TABLES ............................................................................................................. xi

LIST OF FIGURES ........................................................................................................ xvii

LIST OF ABBREVIATIONS ............................................................................................. 1

ABSTRACT ........................................................................................................................ 3

Chapter 1 ............................................................................................................................. 4

INTRODUCTION .............................................................................................................. 4

1.1.

Purpose and Description ..................................................................................... 8

1.2.

Project Context.................................................................................................. 12

1.3.  General Objectives ............................................................................................ 13

1.4.

Scope and Delimitations ................................................................................... 14

1.5.

Significance of the Study .................................................................................. 19

1.6.  Conceptual Framework ..................................................................................... 21

1.7.  Definition of Terms........................................................................................... 24

v

Chapter 2 ........................................................................................................................... 28

REVIEW OF RELATED LITERATURE ........................................................................ 28

2.1.

Foreign Literature ............................................................................................. 28

2.1.1.  Mass Customization in the Service Industry ............................................ 28

2.1.2.

The Role of Decision Support Systems (DSS) in SMEs .......................... 29

2.1.3.  Technology Acceptance Model (TAM) & Lazy-User Theory ..................... 30

2.2.

Local Literature ................................................................................................. 31

2.2.1.

Digital Transformation and Evolving Consumer Preferences in the

Philippine MSME Sector ........................................................................................... 31

2.2.2.

Operational Inefficiencies and Financial Risks of Manual Management in

the Catering Industry ................................................................................................. 33

2.3.

Foreign Studies ................................................................................................. 34

2.3.1.  Web-Based Reservation Systems and Operational Efficiency ................. 34

2.3.2.

Statistical Sales Analytics and Revenue Prediction .................................. 35

2.3.3.

User Centric Service Customization and Technology Adaptation ........... 37

2.4.

Local Studies ..................................................................................................... 38

2.4.1.  Web-Based Reservation and Event Management Systems ...................... 38

2.4.2.

E-Commerce and Online Ordering Platforms for Food Businesses ......... 40

2.4.3.

Decision Support Systems (DSS) and Inventory Management ................ 41

2.5.  Related Systems ................................................................................................ 43

vi

2.5.1.

Caterease ................................................................................................... 43

2.5.2.

Total Party Planner ................................................................................... 44

2.5.3.  M Catering & Fine Foods ......................................................................... 46

2.5.4.

EventPro .................................................................................................... 47

2.6.

Synthesis ........................................................................................................... 48

2.6.1 Related Literature Synthesis ............................................................................. 48

2.6.2 Related Studies Synthesis ................................................................................. 50

2.6.3 Related Systems Synthesis ............................................................................... 51

2.7.

Feature Matrix ................................................................................................... 52

Chapter 3 ........................................................................................................................... 53

METHODOLOGY ........................................................................................................... 53

3.1.  Requirement Analysis ....................................................................................... 53

3.1.1.

Operational Feasibility .............................................................................. 54

3.1.2.

Technical Feasibility ................................................................................. 70

3.1.3.

Economic Feasibility ................................................................................ 74

3.1.3.1. Tangible Cost ................................................................................................ 75

3.1.3.3 Tangible Benefits ........................................................................................... 77

3.1.3.2. Intangible Cost .............................................................................................. 78

3.1.3.4 Intangible Benefits ......................................................................................... 80

3.1.4.

Schedule Feasibility .................................................................................. 82

vii

3.2.

Project Design ................................................................................................... 84

3.2.1.

Context Diagram ....................................................................................... 85

3.2.2.

Data Flow Diagram ................................................................................... 87

3.2.3.

Flowchart .................................................................................................. 89

3.2.4.

Unified Modeling Language ..................................................................... 97

3.2.4.1 Use Case Diagram ......................................................................................... 97

3.2.4.2 Use Case Document ..................................................................................... 100

3.2.4.3 Activity Diagram ......................................................................................... 107

3.2.4.4 Entity Relationship Diagram ....................................................................... 113

3.2.5.

System Algorithms and Analytics Models ............................................. 116

3.2.5.1 Descriptive Analytics Models ..................................................................... 117

3.2.5.2 Predictive Analytics Algorithms ................................................................. 118

3.2.5.3 Dynamic Rule-Based Algorithms ................................................................ 120

3.3.

System Design ................................................................................................ 124

3.4.

System Architecture ........................................................................................ 155

3.4.1.

Business Process Model and Notation (BPMN) ..................................... 157

3.5.  Data Gathering (Sources of Data) ................................................................... 159

3.6.

Project Development (Development Model) .................................................. 161

3.7.

Software Testing (Test Levels) ....................................................................... 163

3.7.1. Alpha Testing ................................................................................................ 163

viii

3.7.2. Beta Testing ................................................................................................... 164

3.8.

Software Evaluation Model ............................................................................ 165

3.9.

Sampling Technique ....................................................................................... 168

3.10.  Statistical Treatment ....................................................................................... 168

3.11.  Respondents of the Study................................................................................ 170

Chapter 4 ......................................................................................................................... 175

RESULTS AND DISCUSSION ..................................................................................... 175

4.1.

Presentation of Results .................................................................................... 175

4.1.1.

Test Case Rules ....................................................................................... 175

4.1.2.

System Evaluation .................................................................................. 204

4.2.

Summary of Findings ...................................................................................... 242

Chapter 5 ......................................................................................................................... 245

CONCLUSION ............................................................................................................... 245

Chapter 6 ......................................................................................................................... 248

RECOMMENDATIONS ................................................................................................ 248

BIBLIOGRAPHY ........................................................................................................... 252

APPENDICES ................................................................................................................ 259

APPENDIX A: Group / Client Profile ........................................................................ 259

THESIS READER CERTIFICATION ....................................................................... 260

APPENDIX B: Project Adviser Approval Letter ........................................................ 261

ix

APPENDIX C: Project Adviser Commitment Form .................................................. 263

APPENDIX D: Project Adviser Role and Responsibility ........................................... 264

APPENDIX E: Progress Reports ................................................................................ 265

APPENDIX F: Title Defense Grade Sheet ................................................................. 273

APPENDIX G: Mock Defense Grade Sheet ............................................................... 275

APPENDIX H: Endorsement Form ............................................................................ 281

APPENDIX I: Survey Questionnaire .......................................................................... 282

x

LIST OF TABLES

Table 1. ECS Feature Matrix ............................................................................................ 52

Table 2. Hardware Specifications for Customer and Server Side .................................... 72

Table 3. Software Specification for Server Side ............................................................... 73

Table 4. Software Specifications for Customer Side ........................................................ 73

Table 5. Estimated Price for Tangible Cost ...................................................................... 75

Table 6. Use Case Specification for Book Event & Customize Menu ........................... 101

Table 7. Use Case Specification for Smart Budget Maximizer ...................................... 102

Table 8. Use Case Specification for Validating Logistics & Constraints ....................... 103

Table 9. Use Case Specification for Tracking 10/70/20 Payment Tranches .................. 104

Table 10. Use Case Specification for Generating Predictive Analytics ......................... 105

Table 11. Use Case Specification for Managing Pricing Ledger & Rules ..................... 106

Table 12. 5-Point Likert Scale Interpretation Range ...................................................... 167

Table 13. Personnel Group of Respondents .................................................................... 172

Table 14. Customer Group of Respondents .................................................................... 173

Table 15. IT Expert Group of Respondents .................................................................... 174

Table 16. Role Access Validation Matrix ....................................................................... 175

Table 17. Test Case Results of PV_Website_And_Navigation ...................................... 175

Table 18. Test Case Results of PV_Contact_Inquiry ..................................................... 176

Table 19. Test Case Results of PV_Menu_Packages_Event_Types .............................. 176

Table 20. Test Case Results of PV_Food_Tasting_Request .......................................... 177

Table 21. Test Case Results of Customer_Registration.................................................. 177

Table 22. Test Case Results of Customer_Login............................................................ 178

xi

Table 23. Test Case Results of Customer_Dashboard .................................................... 179

Table 24. Test Case Results of Customer_Browsing_And_Package_Customization .... 180

Table 25. Test Case Results of Customer_Booking_Process ......................................... 181

Table 26. Test Case Results of Customer_Payments...................................................... 182

Table 27. Test Case Results of Customer_Chat_And_Notifications .............................. 183

Table 28. Test Case Results of Customer_Profile_Management ................................... 183

Table 29. Test Case Results of Customer_Food_Tasting_Management ........................ 184

Table 30. Test Case Results of

Customer_Booking_Updates_Cancellation_And_Clarification ..................................... 185

Table 31. Test Case Results of

Customer_Announcements_Feedback_And_Customer_Experience ............................. 185

Table 32. Test Case Results of Marketing_Dashboard_And_Booking_Queue .............. 186

Table 33. Test Case Results of Marketing_Booking_Review_And_Approval .............. 186

Table 34. Test Case Results of Marketing_Food_Tasting_Management ....................... 187

Table 35. Test Case Results of Marketing_Package_And_Menu_Management ............ 188

Table 36. Test Case Results of Marketing_Customer_Chat ........................................... 189

Table 37. Test Case Results of Marketing_CMS_Announcement ................................. 190

Table 38. Test Case Results of Marketing_Contact_Inquiry_Management ................... 190

Table 39. Test Case Results of Marketing_Assisted_Booking_And_Walk-In_Customer

......................................................................................................................................... 191

Table 40. Test Case Results of

Marketing_Date_Availability_And_Calendar_Management ......................................... 191

xii

Table 41. Test Case Results of Marketing_Operations_Preparation_Board_And_Handoff

......................................................................................................................................... 192

Table 42. Test Case Results of Marketing_Feedback_And_Testimonial_Review ........ 192

Table 43. Test Case Results of Marketing_Preview_Pages_And_Documents .............. 193

Table 44. Test Case Results of Marketing_Staff_Event_History ................................... 193

Table 45. Test Case Results of Accounting_Dashboard_And_Payment_Monitoring.... 194

Table 46. Test Case Results of

Accounting_Payment_Verification_And_Tranche_Tracking ........................................ 194

Table 47. Test Case Results of Accounting_Receipts_And_Refunds ............................ 195

Table 48. Test Case Results of Accounting_Financial_Reports ..................................... 196

Table 49. Test Case Results of Accounting_Documents_And_Access_Control ........... 197

Table 50. Test Case Results of Admin_Dashboard ........................................................ 197

Table 51.  Test Case Results of Admin User_Management_And_RBAC ..................... 198

Table 52. Test Case Results of Admin_Analytics_Dashboard ....................................... 199

Table 53.  Test Case Results of Admin_Pricing_Configuration ..................................... 200

Table 54.  Test Case Results of Admin_Event_Types_and_System_Settings ............... 201

Table 55.  Test Case Results of Admin_Audit_And_Logs............................................. 202

Table 56.  Test Case Results of Admin_Customer_Account_Management................... 202

Table 57.  Test Case Results of Admin_Booking_Oversight_And_Discounts .............. 203

Table 58.  Test Case Results of Admin_Report_Builder_And_Exports ........................ 203

Table 59. Test Case Results of Admin_System_Delivery_Diagnostics ......................... 204

Table 60. Test Case Results of Admin_Announcement_CMS_Admin_Control ........... 204

Table 61. Profile of the Respondents .............................................................................. 205

xiii

Table 62. ISO/IEC 25010 Functional Suitability Evaluation Results from Customer

Group of Respondents..................................................................................................... 205

Table 63. ISO/IEC 25010 Performance Efficiency Evaluation Results from Customer

Group of Respondents..................................................................................................... 207

Table 64. ISO/IEC 25010 Compatibility Evaluation Results from Customer Group of

Respondents .................................................................................................................... 208

Table 65. ISO/IEC 25010 Interaction Capability Evaluation Results from Customer

Group of Respondents..................................................................................................... 209

Table 66. ISO/IEC 25010 Reliability Evaluation Results from Customer Group of

Respondents .................................................................................................................... 211

Table 67. ISO/IEC 25010 Security Evaluation Results from Customer Group of

Respondents .................................................................................................................... 212

Table 68. ISO/IEC 25010 Maintainability Evaluation Results from Customer Group of

Respondents .................................................................................................................... 213

Table 69. ISO/IEC 25010 Flexibility Evaluation Results from Customer Group of

Respondents .................................................................................................................... 214

Table 70. ISO/IEC 25010 Safety Evaluation Results from Customer Group of

Respondents .................................................................................................................... 216

Table 71. ISO/IEC 25010 Functional Suitability Evaluation Results from Personnel

Group of Respondents..................................................................................................... 217

Table 72. ISO/IEC 25010 Performance Efficiency Evaluation Results from Personnel

Group of Respondents..................................................................................................... 219

xiv

Table 73. ISO/IEC 25010 Compatibility Evaluation Results from Personnel Group of

Respondents .................................................................................................................... 220

Table 74. ISO/IEC 25010 Interaction Capability Evaluation Results from Personnel

Group of Respondents..................................................................................................... 221

Table 75. ISO/IEC 25010 Reliability Evaluation Results from Personnel Group of

Respondents .................................................................................................................... 223

Table 76. ISO/IEC 25010 Security Evaluation Results from Personnel Group of

Respondents .................................................................................................................... 224

Table 77. ISO/IEC 25010 Maintainability Evaluation Results from Personnel Group of

Respondents .................................................................................................................... 225

Table 78. ISO/IEC 25010 Flexibility Evaluation Results from Personnel Group of

Respondents .................................................................................................................... 227

Table 79. ISO/IEC 25010 Safety Evaluation Results from Personnel Group of

Respondents .................................................................................................................... 228

Table 80. ISO/IEC 25010 Functional Suitability Evaluation Results from IT Expert

Group of Respondents..................................................................................................... 229

Table 81. ISO/IEC 25010 Performance Efficiency Evaluation Results from IT Expert

Group of Respondents..................................................................................................... 231

Table 82. ISO/IEC 25010 Compatibility Evaluation Results from IT Expert Group of

Respondents .................................................................................................................... 232

Table 83. ISO/IEC 25010 Interaction Capability Evaluation Results from IT Expert

Group of Respondents..................................................................................................... 233

xv

able 84. ISO/IEC 25010 Reliability Evaluation Results from IT Expert Group of

Respondents .................................................................................................................... 235

Table 85. ISO/IEC 25010 Security Evaluation Results from IT Expert Group of

Respondents .................................................................................................................... 236

Table 86. ISO/IEC 25010 Maintainability Evaluation Results from IT Expert Group of

Respondents .................................................................................................................... 237

Table 87. ISO/IEC 25010 Flexibility Evaluation Results from IT Expert Group of

Respondents .................................................................................................................... 238

Table 88. ISO/IEC 25010 Safety Evaluation Results from IT Expert Group of

Respondents .................................................................................................................... 240

Table 89. Summary of Respondent's Assessment of the Proposed System .................... 241

xvi

LIST OF FIGURES

Figure 1. Eloquente Catering Services Organizational Chart ........................................... 10

Figure 2. Fishbone Diagram of Operational Challenges .................................................. 11

Figure 3. Conceptual Framework ..................................................................................... 21

Figure 4. Caterease System ............................................................................................... 43

Figure 5. Total Party Planner ............................................................................................ 44

Figure 6. M Catering & Fine Foods .................................................................................. 46

Figure 7. EventPro ............................................................................................................ 47

Figure 8. Functional Decomposition Diagram of ECS ..................................................... 56

Figure 9. Functional Decomposition Diagram of the Customer ....................................... 58

Figure 10. Functional Decomposition Diagram of the Customer’s Booking Page .......... 60

Figure 11. Functional Decomposition Diagram of the Customer's Dashboard Page ....... 62

Figure 12.  Functional Decomposition Diagram of the Marketing Executive .................. 63

Figure 13.  Functional Decomposition Diagram of the Accounting Staff ........................ 65

Figure 14. Functional Decomposition Diagram of the Admin ......................................... 67

Figure 15. Functional Decomposition Diagram of the Admin’s Monitor Sales Analytics

........................................................................................................................................... 69

Figure 16. Functional Decomposition Diagram of the Admin’s Manage System

Configuration ..................................................................... Error! Bookmark not defined.

Figure 17. Functional Decomposition Diagram of the Admin’s Manage Bookings . Error!

Bookmark not defined.

Figure 18. Functional Decomposition Diagram of the Admin’s Reports .................. Error!

Bookmark not defined.

xvii

Figure 19. Functional Decomposition Diagram of the Admin’s Reports .................. Error!

Bookmark not defined.

Figure 20. Gantt Chart of System Development ................ Error! Bookmark not defined.

Figure 21. Context Diagram of ECS .................................. Error! Bookmark not defined.

Figure 22. Data Flow Diagram of ECS ............................................................................. 87

Figure 23. Customer Booking Workflow ......................................................................... 90

Figure 24. Marketing Executive Workflow ...................................................................... 92

Figure 25. Accounting Staff Workflow ............................................................................ 94

Figure 26. Admin Workflow............................................................................................. 96

Figure 27. Use Case Diagram of Eloquente Catering System .......................................... 98

Figure 28. Activity Diagram for the Customer ............................................................... 108

Figure 29. Activity Diagram for the Marketing Executive ............................................. 109

Figure 30. Activity Diagram for the Accounting Staff ................................................... 111

Figure 31. Activity Diagram for the Admin ................................................................... 112

Figure 32. Entity Relationship Diagram for ECS ........................................................... 114

Figure 33. Eloquente Catering System Log In Page ....................................................... 125

Figure 34. Eloquente Catering System Sign Up Page .................................................... 126

Figure 35. Eloquente Catering System Home Page ........................................................ 127

Figure 36. Eloquente Catering System Booking (Schedule) .......................................... 128

Figure 37. Eloquente Catering System Booking (Event Type) ...................................... 129

Figure 38. Eloquente Catering System Booking (Select Package) ................................. 130

Figure 39. Eloquente Catering System Booking (Budget Specification) ....................... 131

Figure 40. Eloquente Catering System Booking (Build Selection) ................................ 132

xviii

Figure 41. Eloquente Catering System Booking (Dish Selection) ................................. 133

Figure 42. Eloquente Catering System Booking (Event Details) ................................... 134

Figure 43. Eloquente Catering System Booking (Food Tasting) .................................... 135

Figure 44. Eloquente Catering System Customer Dashboard (My Events) ................... 136

Figure 45. Eloquente Catering System Customer Dashboard (Make a Payment Page) . 137

Figure 46. Eloquente Catering System Customer Dashboard (Tastings) ....................... 138

Figure 47. Eloquente Catering System Customer Dashboard (Payments) ..................... 139

Figure 48. Eloquente Catering System Menu Page ........................................................ 140

Figure 49. Eloquente Catering System Marketing Dashboard (Calendar) ..................... 141

Figure 50. Eloquente Catering System Marketing Dashboard (Inquiries) ..................... 142

Figure 52. Eloquente Catering System Accounting Dashboard (Payment Verification) 144

Figure 53. Eloquente Catering System Accounting Dashboard (Transaction Ledger) .. 145

Figure 54. Eloquente Catering System Accounting Dashboard (Refund Management) 146

Figure 55. Eloquente Catering System Admin Dashboard (Overview) ......................... 147

Figure 56. Eloquente Catering System Admin Dashboard (Analytics) .......................... 148

Figure 57. Eloquente Catering System Admin Dashboard (Configuration) ................... 149

Figure 58. Eloquente Catering System Admin Dashboard (Reports) ............................. 150

Figure 59. Eloquente Catering System Admin Dashboard (User Management) ............ 151

Figure 60. Eloquqnte Catering System Admin Dashboard (Bookings) .......................... 152

Figure 61. Physical Three-Tier Customer/Server Architecture Diagram ....................... 156

Figure 62. ECS Business Process Modeling Notation .................................................... 158

Figure 63. Scrum Process Diagram ................................................................................ 161

xix

xx

LIST OF ABBREVIATIONS

4IR – Fourth Industrial Revolution

API – Application Programming Interface

BIR – Bureau of Internal Revenue

BPMN – Business Process Modeling Notation

BSP – Bangko Sentral ng Pilipinas

CMS – Content Management System

CSV – Comma-Separated Values

DFD – Data Flow Diagram

DSS – Decision Support System

DTI – Department of Trade and Industry

ECS – Eloquente Catering System

ERD – Entity Relationship Diagram

ERP – Enterprise Resource Planning

FDD – Functional Decomposition Diagram

GUI – Graphical User Interface

IDE – Integrated Development Environment

IPO – Input-Process-Output

ISO – International Organization for Standardization

JSON – JavaScript Object Notation

JWT – JSON Web Token

KPI – Key Performance Indicator

LAN – Local Area Network

MAE – Mean Absolute Error

MSMEs – Micro, Small, and Medium Enterprises

O2O – Online-to-Offline

RBAC – Role-Based Access Control

RDBMS – Relational Database Management System

SaaS – Software-as-a-Service

SLR – Simple Linear Regression

SMA – Simple Moving Average

SME – Small and Medium Enterprises

SQL – Structured Query Language

TAM – Technology Acceptance Model

TPS – Transaction Processing System

UAT – User Acceptance Testing

UI – User Interface

UML – Unified Modeling Language

VPC – Virtual Private Cloud

2

ABSTRACT

Eloquente Catering Services is an established catering business that continues to rely on
manual  processes  for  inquiries,  booking  schedules,  package  computations,  payment
tracking, and business monitoring. These manual procedures may lead to booking conflicts,
delayed  customer  updates,  inconsistent  records,  payment  verification  difficulties,  and
limited  access  to  data-driven  business  insights.  To  address  these  concerns,  this  study
designed  and  developed  the  Eloquente  Catering  System  (ECS),  a  web-based  catering
management  and  decision  support  system  with  dynamic  rule-based  automation,  secure
transaction support, and predictive analytics for revenue and service demand forecasting.
The  system  includes  a  customer  booking  portal,  automated  conflict  checking,  package
customization, a rule-based budget recommender, live chat, booking status tracking, Role-
Based Access Control, secure payment support for the 10/70/20 payment structure, digital
receipt  generation,  and  an  analytics  dashboard.  The  dashboard  applies  Frequency
Distribution  for  descriptive  sales  analysis,  Simple  Linear  Regression  for  revenue
forecasting, and Simple Moving Average for service demand prediction. The system was
developed  using  the  Agile  Scrum  methodology  and  evaluated  through  alpha  and  beta
testing  based  on  the  ISO/IEC  25010  software  quality  model.  The  evaluation  involved
customers,  personnel,  and  IT  experts  who  assessed  the  system  in  terms  of  Functional
Suitability,  Performance  Efficiency,  Compatibility,  Interaction  Capability,  Reliability,
Security, Maintainability, Flexibility, and Safety. The results showed that all nine quality
characteristics received an overall interpretation of Strongly Agree. This indicates that the
ECS  is  functionally  suitable,  efficient,  secure,  reliable,  maintainable,  flexible,  safe,  and
useful  for  improving  catering  operations.  Overall,  the  study  demonstrates  that  ECS  can
support  Eloquente  Catering  Services  in  streamlining  booking  workflows,  strengthening
payment  and  record  management,  improving  customer  communication,  and  providing
data-driven insights for strategic business growth.

Keywords: catering management system, decision support system, predictive analytics,
ISO/IEC 25010, rule-based automation, revenue forecasting

3

Chapter 1

INTRODUCTION

The fourth industrial revolution (4IR) has significantly altered the way businesses

operate across industries (Alhammadi, 2025). This has led businesses to become less labor-

intensive  and  more  automated,  making  their  day-to-day  operations  more  efficient.  The

emergence of digital platforms in the hospitality business to process transactions and the

adoption  of  big  data  analytics  for  real-time  decision-making  have  driven  changes  in

response  to  the  increased  demands  of  the  market  and  the  evolving  expectations  of

customers in  the digital transformation.  This  transformation  is  directly connected to  the

study since the suggested system is implemented in Industry 4.0 principles via automation

and data-driven decision-making in a service-based Small and Medium-sized Enterprises

(SME).

Catering services are not like the operations of ordinary restaurants, which operate

in a complex, time-based environment that requires outstanding coordination of schedules,

customer relations, and employees. The issues of manual scheduling and rostering in the

hospitality industry have been cited in the academic literature as key operations challenges

due to demand variability, multi-skilled workforces, and the lack of advanced scheduling

methods. The exposure to the use of the traditional manual scheduling system and the lack

of  digital  assistance  may  result  in  inefficient  deployment  of  the  workforce  and  worse

service  delivery  because  research  indicates  that  digital  technologies  can  increase  the

operational efficiency and satisfaction of the guests (Anwar, Deliana, and Suyamto, 2024).

The digital transformation research in the hospitality industry also shows that automated

4

systems decrease the workload and errors of the staff, which proves that manual procedures

are not enough to adjust to the changing service demand and may lead to increased wait

times and decreased customer satisfaction (Anwar et al., 2024). These results justify the

necessity  of  the  research,  since  the  proposed  system  will  solve  similar  scheduling  and

operational issues that Eloquente Catering Services must face.

The current consumer generation is more demanding, seeking convenience, speed,

and  accessibility  via  digital  platforms  rather  than  phone  calls  and  face-to-face

communication.  Online  booking  and  mobile-responsive  web  services  have  facilitated

instant  customer  satisfaction  and  engagement  through  instant  scheduling,  confirmation,

and individualized service (Shrestha, 2023). Failing to provide online self-service tools in

the hospitality and catering industry can lead to canceled bookings and revenue losses, as

customers  will  turn  to  competitors  that  offer  instant  digital  solutions  (Shrestha,  2023;

Udupihilla, 2025). This has a direct advantage to the study as it justifies the creation of an

online booking platform that offers real-time availability and instant confirmation.

Nevertheless,  although  these  demands  keep  changing,  many  catering  companies

still use traditional manual processes. Logbook scheduling, paper transactions, calculator

pricing, and unsecured messaging applications pose significant risks, including data loss,

errors, and miscommunication. Cumpio et al. (2021) note that the traditional booking and

scheduling methods of Philippine catering services result in poor data organization, which

is why a more technologically focused system is required. The current research is based on

these  findings  and  suggests  a  more  sophisticated  system  that  combines  automation,

payment processing, and sales analytics.

5

In  the  case  of  service-oriented  businesses,  using  Transaction  Processing  System

(TPS) offers a good solution to these problems. Repetitive processes such as reservations,

payments, and data verification can be automated to enhance operational efficiency and

minimize  human  error  (Hvozdyk,  2025).  Also,  TPS  enables  real-time  transaction

processing, data integrity, and real-time updates. This ability enhances responsiveness to

customer  behavior  and  allows  for  quick  decision-making  in  a  dynamic  service  setting

(Olavsrud, 2024). This supports  the study by justifying the use of a TPS to  process  the

high-volume  bookings  and  payment  transactions  of  Eloquente  Catering  Services  with

accuracy.

In  addition  to  processing  transactions,  Decision  Support  Systems  (DSS)  process

information  about  operational  activities  and  identify  trends  to  help  organizations  make

informed decisions (Olavsrud, 2024). Sales analytics dashboards allow business owners to

track sales trends, peak hours, and successful packages to maximize resources. These tools

help organizations determine customer preferences and booking trends, enabling them to

offer  services  flexibly  and  set  pricing  policies  that  support  effective  decision-making

(Schwarz, 2025). Catering management systems enable better operational performance and

responsiveness  by  operating  on  data-driven  insights  rather  than  assumptions  (Schwarz,

2025). This article is associated with the research as it supports the inclusion of a  Sales

Analytics Dashboard to make data-driven management decisions.

Since  manual  verification  exposes  businesses  to  fraud,  processing  delays,  and

human  error,  the  introduction  of  secure,  automated  payment  systems  has  become  an

essential  element  of  digital  transformation  in  the  service  industries.  Encryption,

authentication, and real-time monitoring are part of the secure digital payment technologies

6

that mitigate financial risks and maximize customer trust and transaction accuracy (Armor,

2025).  The  automated,  self-service  payment  systems  also  simplify  operations,  reduce

errors, and enhance customer satisfaction by enabling faster, more convenient transactions

without compromising financial security (Das & Singh, 2025). This aids the research by

justifying  the  incorporation  of  safe  online  payment  functionalities  into  the  suggested

system.

In this technological environment, Eloquente Catering Services is one of the best

candidates for digital transformation. The company was incorporated in 2003, but it has

been  operating  in  the  Philippine  catering  industry  since  1999  and  is  led  by  Mr.  Jeric

Sebastian  (CEO)  and  Ms.  Jo-Ann  Sebastian  (COO).  Although  Eloquente  has  enjoyed

success  spanning  two  decades  in  Metro  Manila,  where  it  has  a  strong  reputation,  it  is

currently facing increasing challenges due to a surge in inquiry volume. The company's

existing manual workflow relies heavily on Facebook Messenger for inquiries, physical

logbooks  for  scheduling,  simple  calculators  for  pricing,  and  screenshot-based  payment

verification.  This  disintegrated  process  has  led  to  more  inefficiency.  These  manualized

approaches have become a major threat to operations as customer demand soars, leading

to simultaneous bookings and payment verification uncertainty that cannot be scaled by

the company.

This paper will fill the critical gap between Eloquente's traditional, labor-intensive

service model and the modern efficiency required by current business practices. This study

aims  to  change  Eloquente's  operational  paradigm  by  creating  a  Catering  Management

System with online payment and conflict management features, as well as sales analytics.

The  suggested  solution  will  not  just  address  the  immediate  pain  points  of  scheduling

7

conflicts and payment verification but will also provide owners with analytical information

to improve their business plan. The study is a practical implementation of both TPS and

DSS in the digitization of SME businesses in the Philippines, providing a framework that

could help replicate the study by other businesses that offer services as their main activity

in the country.

1.1. Purpose and Description

The main goal of the Eloquente Catering System is to centralize and automate the

processes  of  Eloquente  Catering  Services  and  transform  the  company  into  a  digital

platform  based  on  data  instead  of  paper  coordination.  Eloquente  Catering  Services  was

founded in 1999 and officially registered in 2003 under the tagline Where great food speaks

volumes,  since  that  time  it  has  a  track  record  of  two  decades  of  excellence  under  the

direction of Mr. Jeric Sebastian (CEO) and Ms. Jo-Ann Sebastian (COO). Although the

company has expertise in its operations, its present use of manual logbooks, physical spread

sheets, and unconfirmed messaging threads to track the payments is a major threat to the

risks of scheduling overlaps as well as human error. This system is used to mitigate these

inefficiencies  to  give  a  centralized  environment  where  different  types  of  users  can

interrelate with the business data on a smooth basis. The current operational process begins

with  the  marketing  executives,  who  serve  as  the  initial  point  of  contact  for  customer

inquiries, gathering essential event details such as the event type, date, venue, registration

time, serving schedule, and guest count to book the event. Once an inquiry is finalized, the

head cook receives these details to develop a comprehensive list of required ingredients.

This list is then handed off to the Logistics Head, who is responsible for the procurement

8

of all ingredients and their delivery to the commissary. The head waiters then take over to

execute all on-site operations from start to finish, ensuring that the event conforms to the

customer’s specifications. Finally, the accounting department manages the financial aspect

by  receiving  and  accounting  for  all  payments  according  to  the  company’s  structured

payment terms.

The  system  is  to  be  utilized  by  internal  and  external  users  in  the  form  of  a

hierarchical access structure. The external users which will be the  customers (registered

customers) will be given an option of having a secure portal which gives them real-time

availability checks, packages customization, and integrated digital payment channels. For

the internal users there will be the marketing executives, accounting staff, and the admin.

The marketing executives are those who will be able to view the necessary information

including the nature of the event, the location, and the number of guests. The Accounting

staff will handle the financial markers, be able to see details and information in regarding

of the 10% reservation fee, 70% down payment, and the remaining 20% final payment.

The admins (CEO and COO) which has the complete control, configuration, and view of

the system and sales, will oversee the platform's core functionalities and make strategic

decisions using the system's predictive analytics.

This system will also be designed to provide the ability to further personalize the

customer  experience,  the  system  recommends  various  catering  related  services  from

Eloquente which will have fees tailored to specific logistical requirements. and automated

calculation of the add-on-fee of the PHP 5,000 per hour overtime and the 3 percent service

fee on high-rise venue. The system allows Eloquente Catering Services to stop relying on

intuition to run its operations and instead embark on a sustainable and data-driven growth

9

by imposing strict business policies, including a 3,500 pax and 10 events daily cap, and an

automated conflict checker.

Figure 1. Eloquente Catering Services Organizational Chart

Figure 1 shows the Organizational Chart of Eloquente Catering Services. The chief

executive and strategy (Mr. Jeric Sebastian, CEO/Owner) and the chief operating officer

(Ms. Jo-Ann Sebastian, COO/Owner) offer executive leadership and strategy. Under the

COO  are  five  operational  units:  marketing  executives,  whose  duties  include  customer

relations  and  promotional  activities;  the  logistics  head;  the  head  of  accounting,  who

oversees  financial  transactions;  the  head  cook;  and  the  head  waiters,  who  oversee  the

service staff. Moreover, the head cook is responsible for a team of assistant cooks to ensure

consistent  quality  across  events  taking  place  simultaneously.  This  chain  of  command

indicates that the company can handle multifaceted, complex operations. Nevertheless, it

also  highlights  the  high  administrative  costs  of  coordination  teams  when  using  manual

systems.  The  suggested  online  system  will  simplify  communication  among  these

10

departments  and  enable  each  position  to  access  department-specific  operational

information without adding unnecessary complexity for staff.

Figure 2. Fishbone Diagram of Operational Challenges

Figure  2  shows  the  fishbone  diagram  which  illustrates  the  primary  factors

contributing  to  inefficient  booking  management  in  Eloquente  Catering  Services  by

categorizing root causes into People, Process, Technology, and Management.

Manual  data  entry  increases  the  likelihood  of  errors  in  booking  details,  while

miscommunication  between  staff  and  customers  often  results  in  inaccurate  event

information.  These  people-related  challenges  are  further  exacerbated  by  excessive  staff

workload, which contributes to delays and reduced accuracy in reservation handling. From

a process standpoint, reliance on a manual booking workflow leads to inefficient schedule

management and delayed booking updates. Moreover, the absence of a structured pricing

process  results  in  quotation  inconsistencies  and  prolongs  the  time  required  to  finalize

bookings. In terms of technology, the lack of an integrated system necessitates dependence

11

on  basic  tools,  thereby  limiting  real-time  data  processing  and  analytical  capabilities.

Consequently, booking information remains fragmented and is not readily accessible for

timely and informed decision-making. At the management level, limited decision-support

mechanisms  and  insufficient  performance  visibility  hinder  effective  resource  planning.

Additionally,  constraints  in  customer  management  restrict  the  ability  to  track  customer

histories  and  analyze  booking  patterns,  negatively  impacting  strategic  planning  and

continuous service improvement.

1.2. Project Context

The catering industry is a fast-paced, time-sensitive business where accuracy is key.

Unlike in ordinary restaurants, catering involves complex logistics, variable numbers, and

strict  timeframes  for  events  throughout  the  day.  In  an  organization  such  as  Eloquente

Catering Services, where inquiries are high, manual systems, such as physical logbooks

and messaging platforms, can create bottlenecks. In this case, the slightest  clerical error

can  result  in  catastrophic  operational  failure,  including  duplicate  date  registrations  or

miscalculated expenses for a large event.

The manual character of the existing as-is system has several fatal weaknesses that

make  it  difficult  to  operate  efficiently  and  make  decisions.  The  lack  of  real-time  in  the

booking  calendar  poses  a  great  threat  of  schedule,  since  the  owners  can  not  verify  the

availability  in  real-time,  and  are  more  likely  to  make  a  duplicate  booking.  Moreover,

manual payment and balance tracking is also time consuming and prone to internal fraud,

record  mistakes  and  physical  receipt  loss  which  can  put  the  business  vulnerable  to  any

financial  attacks.  Further,  it  is  dependent  on  logbooks,  and  this  leads  to  a  strategic  gap

12

whereby  important  transactional  information  is  unavailable  to  be  analyzed  so  that  the

owners can know high performing packages or peak season to grow the business. To meet

these problems, this study suggests the creation of a transaction system, which will improve

the accuracy of scheduling, financial records security, and allow making decisions based

on the data.

The  identified  systemic  problems  in  the  fishbone  analysis  such  as  human  error,

procedural  bottlenecks,  and  technological  gaps  require  a  shift  towards  an  intuitively

oriented  management  system  to  a  data-driven  operational  system.  This  study  directly

focuses on the root causes of inefficient booking management by adopting a web-based

TPS  that  is  combined  with  the  DSS  features.  The  suggested  system  will  substitute  the

manual data input and unverified messaging with an automated conflict checker and online

payment  integration,  which  will  help  to  avoid  the  risk  of  double-booking  and  financial

vulnerability. Moreover, the shift to fragmented logbooks to a centralized sales analytics

dashboard will bridge the current strategic gap to enable the management to gain the real-

time  visibility  and  predictive  insights  to  optimize  resource  planning  and  guarantee  the

business scalability.

1.3. General Objectives

The general objective of this study is to design and develop a decision support and

catering management system for Eloquente Catering Services, integrating descriptive and

predictive  analytics  to  streamline  booking  operations  and  provide  data-driven  strategic

insights for business growth.

Specific Objectives

13

a.  To  identify  the  operational  bottlenecks  in  the  current  manual  processes  of

Eloquente  Catering  Services  and  establish  the  technical  requirements  for  an

automated transaction and analytics platform.

b.  To  create  a  web-based  portal  featuring  automated  conflict  checking,  package

customization,  and  a  rule-based  budget  recommender  to  enhance  the  customer

reservation experience.

c.  To integrate a live chat  module and status tracking system that facilitates direct,

seamless communication between customers and marketing staff for specific event

requests and logistical updates.

d.  To  integrate  Role-Based  Access  Control  (RBAC)  to  ensure  data  integrity  and

secure  payment  gateway  to  automate  the  10/70/20  payment  structure  and

generation of digital receipts.

e.  To develop an analytics dashboard, which uses Frequency Distribution to perform

descriptive sales analysis, Simple Linear Regression and Simple Moving Average

to predict revenue and service demand respectively.

f.  To evaluate the system in alpha and beta testing according to the characteristics of

the international ISO/IEC 25010 standard to guarantee the technical quality and

deployment of the software.

1.4. Scope and Delimitations

The proposed project, entitled Decision Support and Catering Management System

with  Dynamic  Rule-Based  Algorithms,  RBAC,  and  Predictive  Analytics  for  Eloquente

Catering  Services,  hereafter  referred  to  as  the  Eloquente  Catering  System  (ECS),  is

14

designed to automate the customer booking process, streamline operational logistics, and

provide data-driven forecasting for the business owners. To ensure strict data security and

operational  efficiency,  the  ECS  architecture  is  built  upon  a  Role-Based  Access  Control

(RBAC)  framework.  Implementing  RBAC  is  technically  required  to  maintain  data

integrity,  prevent  unauthorized  data  manipulation,  such  as  restricting  customers  from

altering pricing logic, and align the software with standard enterprise security protocols.

ECS features are logically divided into four distinct user modules.

The first  module is  the Customer Booking  Portal,  which serves  as the front-facing

transaction processing system. To reduce cognitive load and cart abandonment, it utilizes

a  Progressive  Data  Collection  strategy  that  accommodates  a  comprehensive  range  of

formal  milestones  and  casual  gatherings,  such  as  weddings,  corporate  seminars,  and

memorial  services.  Expanding  the  event  scope  prevents  cart  abandonment  from  users

whose specific niche events were previously unlisted, thereby capturing a wider market

share for Eloquente. Furthermore, the portal features a Customer Decision Support System

(DSS) driven by a Smart Budget Maximizer. ECS utilizes a dynamic rule-based algorithm

to  instantly  calculate  per-head  allowances  and  auto-generate  a  complete,  ready-to-book

menu, with specific dishes already selected, that mathematically maximizes the customer's

funds. This actively increases booking conversion rates by resolving budget uncertainty.

Alternatively, customers are provided with Build-From-Scratch Customization, granting

them  the  flexibility  to  construct  entirely  custom  menus  with  real-time  per-head  cost

calculations. Finally, a Centralized Customer Dashboard includes a Food Tasting Tracker,

eliminating fragmented SMS updates and providing a professional, self-service experience.

15

The Marketing and Logistics Module acts as the operational gatekeeper utilized by

staff to review incoming bookings securely.  It enforces a Rule-Based Conflict Checker,

implementing  capacity  constraints  and  a  seven-day  lead  time  rule  to  prevent  systemic

overbooking and guarantee sufficient preparation time. Additionally, the module includes

Logistical Validation and Site Constraint Alerts that flag physical venue limitations, such

as a lack of freight elevators, prompting the assignment of manual haulers. This proactive

system  prevents  critical  logistical  failures  and  hidden,  day-of-event  labor  costs.  The

module also performs Automated Operational Mathematics to compute bespoke staffing

ratios based on headcount, enforcing a baseline of three waitstaff for the first fifty guests

and mathematically scaling by one for every additional twenty-five. Lastly, it centralizes

Customer  Communications  and  manages  website  announcements  via  a  built-in  Content

Management System (CMS), ensuring all negotiations are officially recorded within the

system rather than on personal devices.

The  Accounting  Module  is  strictly  restricted  to  the  financial  auditing  staff  to

accurately track enterprise cash flow. It features an Automated Payment Gateway with API

callbacks to handle digital processing for initial booking security, instantly securing event

dates and removing the bottleneck of manual proof-of-payment checks. It executes Tranche

Payment Tracking  by monitoring the standard 10/70/20 payment lifecycle of Eloquente

Catering,  covering  the  10%  reservation,  70%  downpayment,  and  20%  final  balance.

Hardcoding  this  specific  payment  structure  ensures  ECS  directly  mirrors  actual  B2B

financial  policies.  Furthermore,  the  module  handles  Digital  Receipt  and  Refund

Management,  auto-generating  downloadable  documentation  for  cleared  tranches  and

16

logging  refund  requests  to  streamline  corporate  bookkeeping  and  maintain  auditing

compliance.

The  Admin  Analytics  and  Enterprise  Oversight  Module  is  strictly  reserved  for  the

highest level of management to dictate the business's strategic direction. Distinct from the

customer-facing DSS, this backend engine utilizes Predictive and Descriptive Analytics,

employing Simple Linear Regression to forecast future revenue trends, Moving Averages

to project future pax demand, and cross-tabulation heatmaps to track peak seasons. It also

features  a  Dynamic  Pricing  Engine  and  Transparency  Ledger  that  provides  a  granular,

itemized breakdown of algorithmically calculated surcharges, explicitly differentiating the

base price from additional high-rise or transport fees. This empowers management to make

informed decisions when offering Custom Discounts via the Pricing Configuration panel.

Finally,  it  governs  System  Security  and  functions  as  the  global  superuser.  Beyond

managing  user  accounts,  the  admin  possesses  overarching  authority  to  audit  financial

ledgers,  process  manual  payments,  and  review  event  logistics,  ensuring  total  enterprise

oversight in the event of personnel absence.

While ECS is  comprehensive in  catering  management, strict boundaries  have been

established to maintain project focus and architectural stability. A primary delimitation is

the  Exclusion  of  ERP-Level  Ingredient  Tracking.  Although  ECS  calculates  logistical

staffing  requirements,  it explicitly  does  not  compute  raw  material  or  ingredient  volume

tracking, such as calculating kilograms of raw rice or meat per pax for kitchen purchasing.

Integrating highly granular supply chain and inventory tracking pushes the architecture into

an  Enterprise  Resource  Planning  (ERP)  domain.  This  exceeds  the  strictly  defined

boundaries of a Catering Management System and risks severe scope creep.

17

Similarly, the system operates with an Exclusion of Complete Financial Ledger and

Taxation functionalities. The Accounting module acts solely as an Accounts Receivable

tracker,  monitoring  revenue  tranches  and  API  payments.  It  explicitly  does  not  compute

staff payroll, deductible  operational  expenses, or Bureau of  Internal  Revenue  (BIR) tax

integrations.  This  strictly  confines  the  system  to  a  strategic  forecasting  framework  and

prevents it from bleeding into the domain of corporate accounting software.

ECS  also  enforces  strict  Payment  Gateway  Limitations.  Only  the  initial  10%

reservation fee is processed automatically via the integrated third-party payment API. The

subsequent 70% and 20% balances are tracked manually by the accounting module. Auto-

debiting large corporate sums, which often reach hundreds of thousands of pesos, without

secondary  human  verification  poses  an  unacceptable  financial  and  security  risk  to  the

customer. Manual tracking for major tranches securely aligns with standard B2B financial

practices.

Regarding  logistics,  there  is  an  Exclusion  of  Real-Time  GPS  Logistics  Tracking.

While the system computes hauler requirements and physical site constraints, it does not

integrate with  GPS APIs for live delivery vehicle tracking.  Catering  logistics consist  of

scheduled point-to-point deliveries rather than on-demand transport, making real-time map

tracking unnecessary and outside the operational scope of this project.

Furthermore, there is a Limitation to Responsive Web Architecture. ECS is built as a

Progressive  Web  Application  accessible  via  modern  desktop  and  mobile  browsers.  It  is

explicitly  not  a  natively  compiled  mobile  application,  meaning  it  does  not  generate

18

standalone  installation  files  for  application  stores.  This  justifies  the  web-centric

architecture and prevents unnecessary cross-platform compilation overhead.

Finally,  ECS  lacks  Offline  Functionality.  It  is  strictly  a  web-based  application

requiring an active internet connection and does not possess an offline desktop mode. A

continuous,  live  internet  connection  is  strictly  required  to  execute  real-time  algorithmic

calculations, synchronize RBAC statuses globally across different departments, and verify

live API payments, actions which a localized offline system cannot perform securely.

1.5. Significance of the Study

The  creation  and  implementation  of  ECS  have  great  practical,  operational,  and

academic  importance.  This  study  will  be  of  great  value  to  the  following  stakeholders

because  it  will  close  the  divide  between  the  conventional  catering  operations  and  the

contemporary and data-driven operations of the enterprise:

•  To  Eloquente  Catering  Services  (Owners  and  Management):  Predictive  and

Descriptive  Analytics  implementation  transforms  the  business  to  no  longer  be

reactive in its operational model but rather proactive and strategic. Through Simple

Linear Regression to predict revenue and Moving Averages to predict future pax

demand, the management can make very informed long-term decisions concerning

procurement  of  the  supply  chain  and  seasonal  hiring.  Additionally,  the  Pricing

Transparency  Ledger  will  guarantee  the  executives  a  granular  view  of  all  the

algorithmically  derived  surcharges  that  will  safeguard  the  profit  margins  of  the

company when providing custom customer discounts. RBAC is also strictly applied

and ensures that sensitive corporate data is not tampered with by internal users.

19

•  To the Customers: The system democratizes the premium catering services using

the Smart Budget Maximizer. Allowing customers to enter a desired financial

constraint and immediately get an algorithmically optimized menu suggestion

removes the ambiguity of the budget and greatly enhances the booking

experience. Also, the Build-From-Scratch Customization will allow unmatched

flexibility, so that customers would no longer be limited by fixed prebuilt

packages. The key centralized dashboard also offers a self-service, professional

environment where the customers can easily monitor their food tasting and event

status.

•  To the Marketing Executive: The system serves as a smart operational

gatekeeper that significantly decreases the cognitive load of the logistics staff.

Automated Operational Mathematics Automated Operational Mathematics do

away with human error in manpower planning by automatically computing

customized staffing ratios depending on the number of customers. Also, Site

Constraint Alerts and the Rule-Based Conflict Checker actively avoid logistical

failures. The system ensures that the staff is not overbooked, understaffed or

unprepared to be deployed by automatically flagging restrictive venues and

setting capacity limits.

•  To the Accounting Staff: The standard 10/70/20 tranche payment lifecycle is

automated at Eloquente, which considerably decreases the administrative

bottlenecks. Initial reservation API verification offers real-time booking security,

which fully eliminates the manual verification of proof-of-payment to obtain a

calendar date. The automated generation of digital receipts and centralized

20

financial ledger simplify the corporate bookkeeping, which makes financial

auditing quicker, more precise and completely aligned with the standard B2B

financial practices.

•  To Future Researchers and IT Professionals: The paper is a solid academic

roadmap to the application of Business Analytics in the Micro, Small and Medium

Enterprises (MSME) industry. It literally shows how predictive statistical models

like Linear Regression and dynamic rule-based algorithms can be effectively

combined into a single web architecture to address complex logistical and

financial constraints. The architecture of this system can serve as a reference point

in the development of intelligent and automated decision support systems in other

service industries that are highly variable by future researchers.

1.6. Conceptual Framework

Figure 3. Conceptual Framework

21

Figure  3  shows  the  conceptual  framework  of  this  study  which  relies  on  the  Input-

Process-Output  (IPO)  model  to  illustrate  the  development  lifecycle  and  operational

architecture of the ECS. This model demonstrates how foundational knowledge, technical

tools, and raw data inputs are processed through Agile development methodologies and

dynamic  algorithmic  computations  to  produce  a  fully  functional,  predictive  enterprise

system.

The Input phase determines all the initial resources, theoretical backgrounds, and raw

data  streams  that  are  required  to  create  and  run  the  system.  It  consists  of  three  major

sections: Knowledge Requirements, Technical Requirements, and Data Inputs. Knowledge

Requirements  include  the  underlying  business  logic  needed  to  design  the  system.  This

involves the proprietary pricing systems and working regulations of Eloquente, the security

measures  of  RBAC,  and  mathematical  equations  of  the  statistical  models,  specifically

Simple Linear Regression and Moving Averages, applied in the analytics engine. Technical

Requirements  specify  that  the  software  stack  to  be  used  in  the  development  process

includes modern web frameworks, such as Laravel to handle the business logic and react

to provide responsive user interfaces, a powerful Database Management System to store

relational  data,  and  third-party  Payment  APIs  to  facilitate  secure  digital  transactions.

Lastly, Data Inputs are the operational data constantly being fed into the system by users

during execution. This involves event specifications provided by customers, target budgets,

custom  menu  choices,  and  the  past  sales  information  necessary  to  train  the  predictive

algorithms.

The Process phase describes the software engineering process followed in building

the  application  as  well  as  the  computation  logic  run  dynamically  during  execution.

22

Regarding development, the system is built using the Scrum framework, an Agile approach

that encourages iterative coding through organized Sprint Planning. During this process,

the software is strictly tested against ISO 25010 software quality criteria to guarantee high

functional  suitability,  usability,  and  security  before  implementation.  Operationally,  the

system runs complex backend algorithms to convert raw data into actionable intelligence.

This involves implementing RBAC Authentication to secure modules, the Smart Budget

Maximizer  to  provide  algorithmic  menu  recommendations,  and  Rule-Based  Conflict

Checkers  to  avoid  logistical  overbooking.  Moreover,  the  system  calculates  dynamic

surcharges mathematically and confirms the 10 percent reservation payments through API.

Simultaneously, the Predictive Analytics engine uses historical data to generate predictive

revenue and guest demand forecasts.

The Output phase represents the end products, structural software elements, and long-

term business effects of the processed inputs. The main deliverable is the complete ECS,

which  is  architecturally  partitioned  into  four  secure  and  discrete  user  modules:  the

Customer Booking Portal, the Marketing and Logistics Module, the Accounting Module,

and  the  Admin  Analytics  and  Enterprise  Oversight  Module.  From  these  modules,  the

system  automatically  creates  physical  operational  resources,  such  as  digital  contracts,

electronic  receipts,  custom  staffing  ratios,  and  kitchen  preparation  lists.  For  executive

management,  the  system  generates  visual  analytics  plots,  including  predictive  revenue

forecasts and heatmaps of cross-tabulation, as well as a transparent and itemized pricing

ledger. The final business deliverable of the system implementation is to realize a radical

level  of  operational  efficiency  through  the  removal  of  manual  calculations,  enabling

executive management to make proactive and data-driven decisions.

23

The  feedback  loop  is  a  vital  part  of  this  conceptual  framework.  The  completed

products of the system, namely the newly secured bookings and finalized revenue numbers,

automatically  recycle  into  the  system  as  new  Historical  Booking  and  Sales  Data.  This

constant feed of new information continuously trains and refines the Predictive Analytics

engine so that future revenue forecasts and pax demand projections become more accurate

as the system grows.

1.7. Definition of Terms

In this section, only terms, words, or phrases that have special or unique meanings in the

study are defined.

Operational Terms

1.   Add-On Services – Optional supplementary features (such as sound systems,

lighting, or venue styling) that customers can select to complement their chosen

catering package, with costs automatically added to the total booking.

2.  Bottlenecks - Points in a process where the flow of data or service is restricted

3.  Catastrophic Operational Failure - A state of total systemic collapse where the

primary business processes become non-functional.

4.  Clerical Error - An error made by a person in a manual record-keeping task.

5.  Interrelate – To have a mutual relationship or connection

6.  Mitigate - To make something less severe

7.  Monotony - Wearisome routine or lack of variety; usually refers to the repetitive

manual tasks

8.  Multifaceted - Having many sides or different aspects

24

9.  Omission - The act of leaving something out or failing to include a necessary

piece of data

10. Package Customization – A dynamic option that allows customers to modify a

base package by adding or removing amenities, with corresponding adjustments

to the total cost.

11. Real-Time Visibility – The ability of the system to  provide instant  access to

current  booking  statuses,  schedule  availability,  and  payment  progress  for

efficient coordination.

12. Sales Analytics – The summarization and visualization of transaction data (e.g.,

revenue  trends  and  package  popularity)  to  support  monitoring  and  decision-

making.

13. Sub-function – A lower-level task or process that exists within a larger, more

complex system function.

14. Tamper-evident - A system design that makes it obvious if someone has tried

to change or delete data, ensuring that the records remain honest.

15. Transactional  Data  -  Information  that  tracks  the  time,  place,  prices,  and

payment  methods  of  specific  business  events  (e.g.,  a  customer  making  a

deposit).

16. User  Registration  –  The  process  by  which  customers  create  an  account  by

providing  personal  information  and  login  credentials  to  access  booking  and

customization features.

25

Technical Terms

1.  Agile Development Lifecycle – An iterative process with phases like planning,

development,  testing,  and  feedback  to  deliver  flexible  software  (Relevant

Software, 2025).

2.  Automated Reporting – A system feature that generates downloadable reports

and summaries without manual data compilation, integrating data sources for

scheduled or real-time insights. (Solvexia, 2024)

3.  Booking  Conflict  Checker  –  A  back-end  algorithm  that  compares  new

reservation requests against existing bookings in real time to prevent scheduling

overlaps. (Shelf.nu, 2024)

4.  Content Management System (CMS) – A software application or set of related

programs that are used to create and manage digital content, allowing users to

create, edit, and publish content through a graphical user interface rather than

writing code (Optimizely, 2024).

5.  Decision Support System (DSS) – A computer-based system that analyzes data

and provides visualization to support informed, data-driven business decisions

(TechTarget, 2024).

6.  Fourth Industrial Revolution (4IR) – An era of advanced automation and data-

driven transformation in industries, including hospitality via digital platforms

(Alhammadi, 2025).

7.  ISO 25010 – A standard model for software quality, assessing attributes like

functionality, reliability, and security (ISO, 2023).

26

8.  Payment Integration – A secure application feature that connects the system to

external payment gateways to process electronic payments seamlessly within

business software. (Convergine, 2025)

9.  Payment  Verification  –  An  algorithmic  process  that  validates  submitted

payment  proofs  by  matching  transaction  details  against  booking  costs,

involving checks by processors and issuing banks. (TechnologyAdvice, 2024)

10. Role-Based Access Control (RBAC) – A method of regulating access to system

resources based on the roles of individual users within an organization (IBM,

2024).

11. Sales Analytics – The summarization and visualization of transaction data (e.g.,

revenue  trends  and  package  popularity)  to  support  monitoring  and  decision-

making. (Zendesk, 2021)

12. Sales Analytics Dashboard – A visual interface displaying aggregated business

intelligence  through  charts  and  performance  metrics  like  revenue  trends  and

package popularity. (Sales Funnel Professor, 2025)

13. Scrum Framework – An Agile structure using sprints, roles, and daily meetings

for collaborative, adaptive project management (Simplilearn, n.d.).

14. Secure  Transaction  Processing  System  (TPS)  –  An  information  system  that

processes  high-volume  business  transactions  reliably,  ensuring  data  integrity

and real-time updates (Techslang, 2024).

15. Web-Based  Application  –  A  responsive  platform  accessible  via  mobile  and

desktop browsers, providing instant accessibility without the need for a native

app installation. (VoIP Business, 2025)

27

Chapter 2

REVIEW OF RELATED LITERATURE

The purpose of this chapter is to provide a comprehensive analysis of existing literature,

studies, and systems that form the foundational knowledge for the development of the

ECS for Eloquente Catering Services. Based on the project’s title, this chapter examines

the  core  themes  of  mass  customization  in  service  industries,  the  functional  role  of

Transaction Processing Systems (TPS) and Decision Support Systems (DSS) in small-

to-medium enterprises (SMEs), and the integration of predictive sales analytics within

the  catering  sector.  By  exploring  these  areas,  the  researchers  aim  to  establish  the

theoretical  and  practical  frameworks  necessary  to  transition  from  manual,  intuition-

based workflows to a data-driven operational paradigm.

2.1. Foreign Literature

2.1.1.  Mass Customization in the Service Industry

A study conducted within the context of food services and published in

the International Journal of Hospitality Management, by Hwang, Kim, and Lee

(2021) argues that mass customization in food services has a positive effect on

the  perceived  value  and  satisfaction  of  customers:  they  can  customize  their

orders  based  on  their  preferences  instead  of  selecting  them  out  of  a

predetermined menu; their experimental study has shown that food services that

provided high-levels of customization had a higher functional value perception,

satisfaction  and  repurchase  intention  than  the  fixed  ones,  displaying  why

customers are more likely to be satisfied with personalized options.

28

The  recent  studies  also  contribute  to  the  positive  influence  of

customization  on  customer  outcomes  in  the  service  industry.  According  to  a

research published in Journal of Hospitality and tourism research on fast-casual

restaurant,  mass  customization  was  found  to  have  a  significant  effect  on

consumer behavior based on perceived value; this value was found to affect the

evaluation of service experience and revisit intentions, meaning that customers

have a better response when they believe that customized services add value and

not cost (Tang et al., 2025). In a similar fashion, a cross-cultural research in the

restaurant  business  published  in  the  International  Entrepreneurship  and

Management  Journal  established  that  the  dimensions  of  perceived  value

including emotional and functional value are found to have a major impact on

customer  satisfaction,  retention,  and  loyalty,  and  hence  the  need  to  design

services to conform to customer preferences in various cultural factors (Croitoru

et  al.,  2024).  These  results  support  the  fact  that  personalization  and

customization strategies are essential to the escalation of customer satisfaction

and long-term behavioral intentions in services.

2.1.2.  The Role of Decision Support Systems (DSS) in SMEs

A  study  by  Ragazou  and  Passas  (2023)  of  business  intelligence

(including  decision  support  systems)  in  small  and  medium-sized  enterprises

showed that SMEs that incorporate data analytics and decision support systems

are better equipped to process internal and external business information, which

in  turn  leads  to  the  quality  of  managerial  decision-making  and  competitive

advantage  due  to  better  access  to  structured  information  to  make  data-based

29

decisions that improve performance outcomes; this supports the notion that the

use  of  DSS  enables  SMEs  to  overcome  intuition-based  decision-making  and

engage in data-driven decision-making to enhance performance outcomes.

The results of a study conducted by Kamariotou, Kitsios, Charatsari and

Lioutas  (2022)  on  the  concept  of  digital  strategy  decision  support  systems  in

small  and  medium-sized  enterprises  demonstrated  that  DSS  tools  play  a

significant role in aiding SMEs to handle complex business processes and supply

chain choices by offering structured and real-time information, which enhances

the  efficiency  of  operations  and  strategic  planning  outcomes  in  small  and

medium-sized businesses. Their results found that SMEs with digital strategies

based on DSS are better placed to deal with market uncertainties and to promote

organizational growth through data-driven decision-making.

2.1.3.  Technology Acceptance Model (TAM) & Lazy-User Theory

Findings  of  a  study  conducted  by  Sutantio,  Komariyah,  Sularso,  and

Afandi (2024), which used the Technology Acceptance Model (TAM) to online

booking applications showed that two essential TAM constructs, perceived ease

of use and perceived usefulness, positively impacted the intention of consumers

to  make  bookings  using  online  booking  systems  significantly,  and  the  study

expressly  demonstrated  that  the  two  constructs  directly  influenced  consumer

buying intention when it came to online booking systems.

A recent study by Huang (2023) on travel booking mobile applications

has  revealed  that  the  perceived  usefulness  and  perceived  ease  of  use  have  a

30

significant impact on customer engagement and satisfaction with travel booking

websites,  which  means  that  TAM  constructs  are  instrumental  in  shaping  the

willingness  of  the  customer  to  use  online  booking  systems  and  confirm  that

system usability and perceived benefits have a direct effect on customer interest

in using online booking systems.

2.2. Local Literature

2.2.1.  Digital Transformation and Evolving Consumer Preferences in the

Philippine MSME Sector

The  Micro,  Small,  and  Medium  Enterprise  (MSME)  landscape  in  the

Philippines is experiencing a transition by the government to innovation-focused

models to guarantee long-term resilience. Gasingan (2025) states that the MSME

Development Plan 2023-2028 is a strategic plan developed by the Department

of  Trade  and  Industry  (DTI)  to  strengthen  small  businesses  by  promoting  the

shift of small business operations to digital-first operations. This strategic action

is  justified  by  the  findings  of  Quimba,  Reyes,  Baje,  and  Bayudan-Dacuycuy

(2022), who state that whereas the pandemic was the triggering factor in the basic

digital adoption, there is still a considerable digital gap that needs to be bridged

with  more  advanced  system  integration.  With  the  ongoing  expansion  of  the

digital  economy,  companies  such  as  Eloquente  Catering  Services  should

consider the use of integrated platforms to  get  out  of the simple social  media

questions and into specialized data-driven models.

31

The result of this technological impetus is a basic transformation of the

Filipino  consumer  behavior  to  Online-to-Offline  (O2O)  dining  experiences.

According  to  Grab  (2023),  9  out  of  10  Filipino  consumers  currently  choose

brands that have an integrated online presence, so digital discovery and review

platforms  are  currently  the  second  most  popular way  of  identifying  new  food

service  providers.  The  contemporary  customers  require  24/7  availability  and

convenience-first interfaces that enable them to shop packages and tailor their

events  in  a  hassle-free  manner  without  the  hassle  of  dialing  the  landline  or

negotiating face-to-face. Mia (2024) states that although MSMEs have become

more open to digital technologies, they continue to experience limitations in their

technical  capacity  to  handle  complex  digital  transformation  processes,  and

specialized software solutions that are easy to use and operate are required.

Moreover,  the  omnipresence  of  financial  technology  has  changed  the

standard  of  local  merchant  transactions.  According  to  Mesina-Romero  et  al.

(2024) in the report to Bangko Sentral ng Pilipinas (BSP), digital retail payments

currently  constitute  57.4%  of  the  total  monthly  transaction  volume,  which  is

mainly due to the mass adoption of e-wallets such as GCash and Maya. In the

case of catering businesses, this change is a structural change in which customers

demand secure and frictionless checkout experiences and unalterable records of

digital  transactions.  The  combination  of  these  payment  gateways  into  a

centralized system will not only fulfill consumer demand to have convenience

but also minimize the operational cost of checking manual screenshots, which is

a substantial weakness in the existing catering processes.

32

2.2.2.  Operational Inefficiencies and Financial Risks of Manual

Management in the Catering Industry

The catering industry in the Philippines has unique logistical challenges

that do not match the normal restaurant operation, and this is mainly because of

the dynamics of organizing off-site events and fluctuating guest numbers. Del

Rosario, Dela Cruz, and Rivera (2022) determine systemic bottlenecks in local

catering  coordination,  namely,  the  risks  of  the  "PM  is  Key"  culture,  i.e.,  the

excessive use of unorganized threads  in  Facebook Messenger to  inquire. This

manual  coordination  usually  leads  to  logistical  breakdowns,  manpower  crises

and increased chances of booking the same event date twice. These inefficiencies

have led to overworking and burnout of the staff, which eventually leads to poor

service delivery and customer satisfaction in a high-stress setting.

In addition to logistics scheduling, the use of traditional manual record-

keeping poses a strategic gap that does not allow the business to grow in the long

term. According to Loft Philippines (2025), it is impossible to trap transactional

data in physical logbooks and fragmented spreadsheets and determine the high-

performing packages or predict the most lucrative months. This reliance on the

management by intuition causes financial leakage and makes the business unable

to make data-driven decisions on inventory and marketing strategies. The shift

to a centralized Decision Support System (DSS) is the key to SMEs acquiring

the necessary real-time visibility to streamline resource planning and guarantee

scalability in the competitive market.

33

Finally,  the  absence  of  automated  and  safe  financial  tracking  subjects

local catering companies to high risks. Sigala (2024) discusses the digitalization

of the Philippine hospitality sector and notes that big chains have updated, but

smaller  companies  remain  behind,  which  makes  them  the  victims  of  fraud

because  of  insufficient  digital  checks.  Moreover,  RSIS  International  (2025)

confirms that the systematic record-keeping is directly and positively correlated

with  the  overall  performance  and  sustainability  of  small  enterprises.  Using  a

centralized  sales  analytics  dashboard,  companies  can  substitute  the  disjointed

notebooks with the visual trends and automated reports, which will be effective

in  closing  the  gap  between  the  traditional  service  excellence  and  the

contemporary financial security.

2.3.Foreign Studies

2.3.1.  Web-Based Reservation Systems and Operational Efficiency

The  adoption  of  web-based  platforms  is  a  critical  step  for  catering

MSMEs  seeking  to  move  away  from  fragmented  communication  channels.

According  to  a  study  by  Sahara  et  al.  (2025)  that  is  conducted  in  West  Java,

Indonesia,  researchers  developed  a  specialized  reservation  system  using  the

Agile Scrum methodology to replace manual recording processes. The project's

"Method" involved a structured sprint cycle consisting of needs analysis, system

design  using  Unified  Modeling  Language  (UML),  and  Black  Box  testing  to

verify features like menu ordering and payment confirmation. The researchers

34

also conducted User Acceptance Testing (UAT) with real-world catering staff,

which resulted in a high usability score of 82.75%.

These  findings  are  directly  relevant  to  our  study  because  they

demonstrate  that  a  user-centered  design  can  significantly  reduce  the  "manual

logging burden" identified in Eloquente’s current operations. By implementing

a  similar  web-based  interface,  our  system  can  centralize  inquiries  that  are

currently  lost  in  Facebook  Messenger  threads,  ensuring  that  every  booking  is

captured accurately in a secure database.

A  study  by  Shiji  Group  (2024)  highlights  the  financial  and  temporal

benefits of this transition. This research evaluated the impact of moving from

call-center-based  booking  to  cloud-native  platforms,  reporting  that  properties

saved  between  1  to  2  hours  of  labor  daily  through  automated  reconciliation.

During peak event periods, the integrated system achieved processing speeds that

were 30% to 40% faster than legacy methods, with a near-zero downtime rate.

For  Eloquente  Catering  Services,  these  metrics  provide  a  quantifiable

justification  for  the  investment,  suggesting  that  our  proposed  system  will  not

only  prevent  scheduling  conflicts  but  also  allow  staff  to  focus  on  high-value

guest interactions rather than administrative corrections (Shiji Group, 2024).

2.3.2.  Statistical Sales Analytics and Revenue Prediction

Implementing a Decision Support System (DSS) through an interactive

sales analytics dashboard provides the visibility necessary for scaling a catering

business.  A  study  by  Chakole  &  Pandey  (2025)  examined  the  impact  of

35

interactive dashboards on business performance using a focused mixed-methods

approach. The methodology involved a quantitative survey of 200+ professionals

to evaluate usability, efficiency, and value, finding that 85% of users reported

significantly  faster  decision-making  due  to  real-time  visual  representations  of

data. Additionally, the study noted a 20% increase in operational efficiency as

dashboards  allowed  managers  to  identify  underperforming  areas  instantly

(Verma et al., 2025). This is directly relevant to our proposed "Sales Analytics

Dashboard,"  as  it  validates  that  providing  Eloquente's  owners  with  real-time

charts  of  revenue  trends  and  package  popularity  can  drive  growth  through

evidence-based planning.

To bridge the strategic gap created by fragmented transactional history,

our system utilizes predictive modeling based on traditional statistics. Research

published  in  the  United  States  detailed  an  "Experiment"  utilizing  a  Multiple

Linear  Regression  (MLR)  model  to  forecast  daily  revenue  for  food  service

establishments  based  on  parameters  such  as  customer  volume,  average  order

value, and marketing spend (Chakma, S., 2025). The performance of the model

was validated with an R2 score of 0.89 and a Mean Absolute Error (MAE) of

244.13, indicating that linear statistical models provide high predictive accuracy

for  operational  planning  (Chakma,  S.,  2025).  This  predictive  capability  is

essential for our system’s "Booking Insights" module, as it enables Eloquente to

anticipate  surges  in  demand  for  specific  event  types  such  as  weddings  during

peak  seasons  and  adjust  their  resource  procurement  and  staffing  levels

accordingly using historical data trends.

36

2.3.3.  User Centric Service Customization and Technology Adaptation

The ability to customize service offerings is a primary driver of customer

loyalty and satisfaction in the catering sector, making a package customization

tool a vital competitive asset for Eloquente. A case study by Kocot et al. (2025)

investigated the requirements of gastronomy companies in the modern economy,

focusing on intelligent online booking systems that allow for individual menu

adjustments. The methodology found that personalized guest experiences driven

by  data-driven  ordering  result  in  a  15%  increase  in  overall  satisfaction,

highlighting that automation must be paired with human-centric customization

to  build  a  sustainable  advantage.  This  is  highly  relevant  to  our  "Package

Customization"  tool,  as  it  validates  the  idea  that  providing  customers  with  a

transparent  way  to  add  amenities  or  replace  menu  items  builds  a  competitive

edge by replacing the manual "calculator pricing" currently used by Eloquente

with a real-time, automated pricing logic.

This  is  reinforced  by  research  in  Ho  Chi  Minh  City,  Vietnam,  which

applied the Technology Acceptance Model (TAM) and regression analysis via

SPSS version 26 to evaluate the booking behaviors of 332 domestic tourists. The

analysis identified that pricing strategies (β = 0.250) and perceived usefulness

are the most significant predictors of whether users will adopt a digital booking

platform  (Tasmara,  D.  A.,  et.al.,  2024).  These  studies  directly  support  our

objective to implement a user-friendly customer portal that prioritizes ease of use

and clear financial markers, ensuring that Eloquente's customers feel empowered

37

to  complete  their  reservations  and  customize  their  packages  digitally  without

needing constant manual confirmation from staff.

2.4.Local Studies

2.4.1.  Web-Based Reservation and Event Management Systems

A shift in the manual reservation procedures to the digital platform has

been a key area of recent research in the Philippine service sector, with a general

trend  of  enhancing  operational  efficiency.  Lapuz  et  al.  (2021)  created  a  web-

based reservation system of Bazaar City, a business complex in Metro Manila,

to  substitute  manual  logbooks  with  a  central  database.  Their  research  showed

that the automation of schedule management greatly decreased the redundancy

of  data  and  booking  conflicts,  which  enabled  the  administrators  to  track  the

facility  reservations  and  rental  collections  in  real-time.  This  observation  is

supported  by  Vega  and  Generoso  (2025)  who  designed  eReserve  to  an

educational institution. Their study established that digital reservation systems

do  not  only  make  the  booking  process  easier  but  also  give  administrators  the

right  utilization  record,  which  is  critical  in  the  management  of  massive

reservations.  Nevertheless,  the  two  studies  were  mainly  concerned  with

reservation  of  physical  spaces  and  facilities  instead  of  considering  the

complicated logistics of catering services, including menu planning and dynamic

pricing.

Cumpio et al. (2021) presented a web-based catering management system

in Leyte, which is a particular context of the food service industry. Their research

38

emphasized  the  geographical  constraints  of  the  conventional  booking  systems

and demonstrated that a web-based system can increase the market coverage of

a local business beyond its local area, enabling its customers to reserve services

even when they are not in the local area. Capuno et al. (2021) also incorporated

SMS  technology  in  their  iReserve  system  to  make  it  more  responsive  to  the

system. They discovered that automated messages on the status of reservations

greatly  enhanced  customer  satisfaction  as  it  minimized  waiting  time  and

customers were notified instantly about the approval of their booking. Likewise,

Coloma et  al.  (2025) also  focused on the significance of real-time tracking in

their work, which was called Eventify and used QR codes to attend events. This

demonstrates  the  increased  need  to  integrate  real-time  data  in  local  event

management systems to facilitate smooth operations.

Although  these  studies  were  effective  in  setting  the  foundation  of  the

transaction  processing  systems  in  the  Philippines,  they  were  more  inclined

towards the logistical  part of blocking dates  and  venues.  Most of  the systems

reviewed were in the form of a static booking tool and did not have any advanced

package  customization  options  where  a  customer  could  dynamically  mix  and

match menu items and have real-time price adjustments. This weakness creates

a definite gap that the proposed system in Eloquente Catering Services will help

address  by  transforming  the  reservation  system  beyond  date  blocking  to  an

interactive and detailed planning process that involves intricate customization of

the process to customers.

39

2.4.2.  E-Commerce and Online Ordering Platforms for Food Businesses

The global pandemic introduced the so-called New Normal that increased

the digitalization of the Philippine food industry, encouraging businesses to use

online platforms. In detailed research on the strategies of small-scale online food

business, Phillipneris (2021) found that Filipino entrepreneurs resorted to online

platforms to keep the business running. Her study found that social media was a

good  entry  point,  but  specialized  web  applications  were  better  in  terms  of

operational control and scalability. This observation justifies the choice of the

proponents to create a dedicated web application to Eloquente Catering Services

instead  of  using  third-party  messaging  applications  only,  which  may  not  be

effective in handling complex orders.

Expanding on this requirement of a structured ordering, Catubag et  al.

(2024)  created  a  web-based  ordering  system  of  a  beverage  business.  Their

research  proposed  an  all-inclusive  carting  system  and  simulation  of  payment

gateways  such  as  GCash  and  PayMaya,  which  proved  that  secure  online

payments  can  greatly  reduce  the  threat  of  fraudulent  purchasers  to  the  local

SMEs. Li (2024) also examined the aspect of user engagement in his research on

a  web-based  food  ordering  system  and  found  that  an  intuitive  and  minimalist

user interface is the key to the highest sales conversion rates in the local market

which is fast-paced. Alona, Joemar, Johnrel, Leo, and Rechie (2024) emphasize

the significance of product presentation in their research on an e-retailing system

of food innovation centers. They discovered that elaborate product images and

open pricing had a direct effect on the buying behavior of Filipino consumers.

40

Going  a  step  further,  Cabututan  (2025)  proposed  a  data-driven  point-of-sale

system that combined sales forecasting to assist micro-enterprises in predicting

demand and reducing waste, demonstrating the possibilities of analytics in small

food businesses.

These  research  show  that  Filipino  developers  have  perfected  the  retail

aspect  of  food  e-commerce,  including  single  meal  or  product  ordering.

Nonetheless,  there  is  still  a  big  gap  in  the  application  of  these  e-commerce

principles to event catering. The retail systems have a basic add-to-cart logic that

cannot be used to support the complexity of catering events where the number

of  guests  is  variable,  buffets  are  involved,  and  package  inclusions  are  multi-

layered. The suggested research will transform the cart concept into a dedicated

event  package  assembler,  enabling  the  customers  of  Eloquente  to  enjoy  the

convenience  of  e-commerce  and  handle  the  intricacies  of  a  large-scale  event,

which is not inherent to the traditional food ordering systems.

2.4.3.  Decision Support Systems (DSS) and Inventory Management

The incorporation of smart decision-making applications is the future of

local system development, not merely the processing of transactions. This was

first introduced by Bulagao et al. (2022) in the catering industry through their

integrated  catering  booking  system.  Their  study  is  well  aligned  with  the

objectives of the proponents since they showed that a Decision Support System

(DSS)  would  assist  managers  in  making  informed  decisions  regarding  the

allocation of resources. Nevertheless, they had a system that concentrated more

on  the  operational  component  of  the  decision  support  as  opposed  to  strategic

41

sales analysis. Bauzon and Pidor (2023) created a sales performance monitoring

web-based  DSS  in  the  domain  of  sales  intelligence.  Their  system  based  on

decision tree algorithms  analyzed customer preferences to predict sales trends

and demonstrated that visual analytics is a potent tool that SME owners can use

to determine the time of high demand and optimize their products.

Cepeda and Saludes (2025) developed an inventory system with decision

support  capabilities,  and  Gumilao  (2024)  developed  an  automated  inventory

management system in a government office on the operational side. Both articles

supported the fact that asset tracking automation guarantees accountability and

data integrity, which is  essential in  the management of the diverse equipment

required in catering. In a similar manner, Concepcion et al. (2023) created a sales

and inventory management system in a clinic, which emphasizes the importance

of  automated  stock  alerts  in  avoiding  shortages  in  supplies.  All  these  studies

confirm the significance of the management of the back end in the support of the

front-end operations of a business to make sure that the resources are available

when required.

Although Bulagao et al. (2022) and Bauzon and Pidor (2023) presented

DSS  to  the  local  hospitality  industry,  their  applications  were  frequently

independent, and they concentrated on either the booking or the sales analysis.

The  Eloquente  Catering  Services  proposed  system  aims  at  integrating  these

functions. The system of the proponents is sales intelligence and customer-side

decision support, unlike the inventory-intensive systems of Gumilao (2024) and

Concepcion  et  al.  (2023).  It  is  innovative  by  offering  a  recommendation

42

algorithm  to  the  customer  based  on  the  budget  to  help  them  choose  what  to

purchase and a sales analytics dashboard to the owner to help them choose what

to sell, which is an end-to-end and data-driven ecosystem that is currently lacking

in the local literature reviewed.

2.5. Related Systems

This  project  entails  a  thorough  analysis  of  current  systems  in  the  same  field,

providing valuable insights into established methodologies, technological frameworks,

and potential solutions.

2.5.1.  Caterease

Figure 4. Caterease System

Figure 4 shows Caterease which is a dedicated event management system

that can be used as a professional standard of the proposed system because of its

43

orientation towards automating the complex coordination needed in the catering

business. Similar to the system that is currently being developed in Eloquente

Catering  Services,  Caterease  will  integrate  the  disjointed  manual  procedures

with  a  centralized  digital  platform  that  will  handle  the  entire  event  lifecycle,

starting with the initial inquiry and ending with the final execution. The platform

uses  an  effective  Booking  Wizard  to  implement  scheduling  logic  and  avoid

double-booking, which is similar to the Conflict Checker feature of the proposed

system. Moreover, it also includes dynamic menu management applications that

give  real-time  price  changes  when  customizing  packages,  which  is  directly

connected to the aim of the project to provide interactive and transparent budget-

based selections. CaterEase confirms the implementation of a Decision Support

System  (DSS)  to  convert  raw  transactional  data  into  the  strategic  business

intelligence  required  to  grow  the  business  based  on  the  data  by  offering  an

analytics dashboard to visualize sales trends and peak seasons.

2.5.2.  Total Party Planner

Figure 5. Total Party Planner

44

 Figure 5 shows the interface of Total Party Planner, it is a full-fledged catering

and  event  management  application  that  was  started  in  1991  by  John  Cohen.  The

platform  was  initially  created  to  solve  the  operational  inefficiencies  in  his  own

catering  business  but  has since been expanded to  a cloud-based platform  used by

catering  professionals  throughout  the  United  States.  It  is  mainly  aimed  at

consolidating the disjointed elements of event management into a single interface,

which  will  remove  the  manual  errors  of  data  entry,  simplify  the  process  of

communication between the sales and the kitchen departments, and give the business

owners real-time access to their financial performance.

To meet these goals, the system combines several essential functions, such as

automatic  proposal  creation,  powerful  menu  costing,  employee  scheduling,  and

kitchen  production  reporting.  It  enables  users  to  make  professional  contracts,

compute food costs by ingredient prices, and create accurate prep sheets that kitchen

employees can use. This is directly connected to the suggested system of Eloquente

Catering Services since both platforms have the same goal of automating the process

of customer request  to  kitchen implementation.  Nevertheless,  Total  Party Planner

provides a broad range of enterprise-level capabilities that would be appropriate in

large-scale  operations,  whereas  the  study  by  the  proponents  is  based  on  a  more

simplified, regionally specific method. Particularly, the suggested system focuses on

Budget-Based  Package  Recommendations  and  Simplified  Online  Payment

Integration (through local gateways such as GCash/Maya), which are features that

are uniquely tailored to the requirements and tendencies of the Philippine market,

45

which  might  not  be  covered  in  full  by  a  US-centric  system  such  as  Total  Party

Planner.

2.5.3.  M Catering & Fine Foods

Figure 6. M Catering & Fine Foods

Figure 6 shows M Catering & Fine Foods system, this operates a full-fledged

web-based platform (mcatering.ph) which acts as a main source of customers who

want  to  rely  on  professional  catering  service  in  the  Philippines.  This  system  will

facilitate the organization of the event planning process because it offers a digital-

based menu selection, thematic styling, and budget planning system. The essence of

this system is the package customization module where a user is allowed to explore

a wide library of international and local dishes to formulate custom menus according

to their event desires. To make finances more transparent, the site has an immediate

price and budgeting view, with a clear definition of the value added in various levels

of  packages  so  that  customers  can  see  their  costs  in  real  time  as  they  change  the

number of guests and upgrades of the services they order. This way enables both

residential  and  corporate  customers  to  organize  their  needs  regarding  events  and

remain within their financial limits. It also implements an organized inquiry chain of

46

work and an online ordering platform that enables the management to trace leads

and  keep  track  of  sales  effectively.  This  system  is  very  applicable  to  the  ECS  in

Eloquente Catering Services as it has similar functional modules that are meant to

accommodate various service categories such as weddings, corporate events, parties,

and buffets. Such features as the ability to create your own menu, themed styling

options, the inclusion of tiers in packages, inquiry on a budget and lead management

are the key elements that are also included or elaborated in the Eloquente system to

offer more insights about booking and business analytics regarding these types of

events specifically.

2.5.4.  EventPro

Figure 7. EventPro

Figure 7 shows the system of EventPro, it is an integrated event management and

catering program that offers an opportunity to automate the process of event planning

and bookings as well as operational management within catering and event-based

companies.  The  system  allows

the  following  features  customer  booking

47

management, event scheduling, menu and package planning, staff coordination and

financial  tracking  to  minimize  the  manual  workload  and  enhance  operational

efficiency.  EventPro  gathers  event-related  data,  enabling  event  administrators  to

track event information, produce reports, and access customer information, in a well-

organized  electronic  system.  Like  the  suggested  ECS  to  Eloquente  Catering

Services, EventPro shows how automation and centralized data management could

enhance  accuracy,  lessen  the  scheduling  problems,  and  deliver  the  services.

Nevertheless, EventPro is typically oriented to the large-scale event management,

and

it  does  not  focus  on

the

localization  of  packages,  budget-related

recommendations  and decision support analytics specific to  a small  and medium-

enterprise (SME) in the Philippine catering sector. Thus, the proposed system will

expand such features by adding real-time price extensions, sales analytic dashboards,

and decision support functionality that is explicitly tailored to Eloquente Catering

Services.

2.6. Synthesis

2.6.1 Related Literature Synthesis

The extensive analysis of foreign and local literature points to the critical

change  in  the  service  sector  towards  digitalization,  personalization,  and  data-

driven management. The literature on foreign literature, especially the works by

Hwang, Kim, and Lee (2021) and Song et al. (2021) strongly prove that mass

customization is not a fad but a requirement to increase customer satisfaction.

These findings prove that when customers are allowed to customize their orders,

48

their functional value and repurchase intention increase, which is a principle that

directly  justifies  the  Package  Customization  Module  of  the  proposed  system.

Moreover, the tendency to  focus on the global focus on the Decision Support

Systems (DSS) and Sales Analytics, as presented by Bencito et al. (2021) and

Yali  et  al.  (2021)  supports  the  need  to  abandon  the  decisions  made  through

intuition.  This  is  in  line  with  the  purpose  of  the  system  to  give  Eloquente

Catering Services a dashboard that will convert raw booking data into actionable

insights.  Also,  the  models  of  Technology  Acceptance  Model  (TAM)  and  E-

Service Quality (Pillai et al., 2021; Rita et al., 2019) make it clear that ease of

use,  responsiveness,  and  perceived  security  cannot  be  compromised  when

adopting  the  system  and  inform  the  design  of  the  user  interface  and  security

measures of the proposed solution.

The  literature  in  the  Philippine  setting  is  a  picture  of  a  desperate

modernization. The local rationale of substituting Eloquente manual  logbooks

with a cloud-based platform with online payments is provided by reports about

the digital transformation of MSMEs and the rapid adoption of E-Wallets such

as GCash (Salura et al., 2022). The literature has collectively found a gap to be

that  the  international  standards  require  high  levels  of  personalization  and

analytics, and local practices are usually manual and disjointed. The proposed

system  is  useful  in  filling  this  gap  by  applying  these  advanced  concepts  to  a

locally modified and web-based solution.

49

2.6.2 Related Studies Synthesis

Comparative  analysis  of  foreign  and  local  studies  shows  the  different

degrees of technological maturity. The use of advanced algorithms in resource

allocation  and  dynamic  pricing  in  large-scale  settings  is  presented  in  foreign

studies,  including  those  by  Alhammadi  (2021)  and  Ullah  et  al.  (2021).  These

papers give the technical specifications of the Real-Time Pricing Algorithm and

Conflict Checker of the system, which proves that automation is the secret of

reducing  the  human  factor  and  maximizing  the  utilization  of  resources  in  the

process of complex operations.

At  the  local  level,  scholars  such  as  Lapuz  et  al.  (2021),  Cumpio  et  al.

(2021),  and  Capuno  et  al.  (2021)  have  managed  to  establish  the  basis  of  the

Transaction Processing Systems (TPS) in the Philippines. Their work confirms

that web-based reservation and SMS notifications are a feasible solution to local

businesses. There is however a major disparity in the thoroughness of these local

solutions.  Most  of  the  studied  local  research  is  concerned  with  the  logistical

component  of  blocking  dates  and  does  not  include  strategic  decision  support.

Local systems that are currently in place do not generally provide customer-side

Budget-Based Recommendations or admin-side Profit Analysis. The given study

addresses  this  particular  gap  by  integrating  the  efficiency  of  local  booking

systems with the intelligent analytics and customization options that are usually

reserved  to  foreign  enterprise  software,  which  is  why  the  given  proposal  is  a

comprehensive and prospective solution to the Eloquente Catering Services.

50

2.6.3 Related Systems Synthesis

The current market presents significant constraints for small to medium-

sized  enterprises  (SMEs)  in  the  Philippine  catering  industry,  often  forcing

businesses  to  rely  on  fragmented  manual  workarounds.  Enterprise-grade

solutions like Total Party Planner are highly robust but excessively complex and

financially  unviable

for  single-branch  operations.  Conversely,  generic

scheduling  or  delivery  applications  like  Google  Calendar  and  Foodpanda

completely lack the proprietary business logic required for formal catering, such

as dynamic headcount pricing, multi-phase logistics, and lead-time validations.

The proposed Eloquente Catering  System  (ECS) serves as  the optimal

technological middle ground to bridge this operational gap. It delivers enterprise-

level capabilities, including automated kitchen prep lists, dynamic staffing ratios,

and  digital  contracts,  through  a  simplified,  consumer-friendly  interface  that

reduces user cognitive load. By tailoring the workflow exclusively to Eloquente's

specific  operations,  the  ECS  eliminates  international  software  bloat  while

seamlessly integrating crucial localized requirements, such as the strict 10/70/20

financial tranche system and rule-based logistical conflict checkers.

Ultimately, the ECS distinguishes itself by embedding advanced decision

support  and  analytics  into  an  SME-friendly  platform.  While  generic  apps

passively record data, the ECS actively processes it: utilizing the Smart Budget

Maximizer  to  provide  real-time  customer  decision  support  and  maximize

booking conversions, alongside Simple Linear Regression and Moving Averages

to  accurately  forecast  revenue  and  guest  demand  for  the  administration.  This

51

strategic

integration  equips  executive  management  with  a

robust,

computationally powerful system strictly aligned with their operational needs,

transforming reactive management into proactive enterprise planning.

2.7.

 Feature Matrix

Table 1. ECS Feature Matrix

Feature / Functionality

Proposed
ECS

CaterEase

Total
Party
Planner

M
Catering
& Fine
Foods

EventPro

Interactive Online
Booking Portal

Package Mix and- Match
Customization

Real-Time Price
Calculation Logic

Automated
Conflict/Double Booking
Check

Predictive Analytics
Dashboard

Automated Payment
Gateway (API)

Smart Budget
Recommender &
Maximizer

Automated Kitchen &
Logistics Reports

Built-in Customer
Messaging

Real-Time Status
Tracking

Home-page
Announcements (CMS)

Custom On-the-Fly
Discounts

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✔

✘

✘

✔

✘

✘

✘

✔

✔

✔

✔

✔

✔

✘

✘

✔

✔

✔

✘

✔

✔

✘

✘

✘

✘

✘

✘

✘

✘

✘

✘

✘

✔

✔

✔

✔

✔

✘

✘

✔

✘

✘

✘

✔

52

Integrated Food Tasting
Management

Post-Event Feedback
System

✔

✔

✘

✘

✘

✘

✘

✘

✘

✘

Chapter 3

METHODOLOGY

The chapter offers the overall approach and systematic steps applied in the design,

development and testing of Decision Support and Catering Management System with

Dynamic Rule-Based Algorithms, Role-Based Access Control, and Predictive Analytics

for Eloquente Catering Services. It also describes the logical sequence of the research,

which will start with a strict requirement analysis to identify the operational, technical,

economic,  and  schedule  viability  of  the  project.  Moreover,  this  chapter  describes  the

project design with the help of standard modeling tools, the chosen system architecture

and  the  Agile  Scrum  iterative  framework  that  will  be  used  throughout  the  software

development.  Lastly,  it  talks  about  the  data  collection  process,  the  alpha  and  beta

software testing process, and the actual system evaluation based on the ISO/IEC 25010

software  quality  model,  as  well  as  the  sampling  methods  and  statistical  treatment  to

confirm the effectiveness of the study.

3.1. Requirement Analysis

Requirement analysis considers the possibility of the proposed Decision Support

and  Catering  Management  System  with  Dynamic  Rule-Based  Algorithms,  Role-

Based Access Control, and Predictive Analytics for Eloquente Catering Services to

work in terms of operational, technical, economical, and schedule. This will make

the system viable, sustainable, and business oriented to Eloquente Catering Services.

53

3.1.1.

Operational Feasibility

Operational feasibility will decide whether the suggested system will be able to

operate successfully in the current business setting and operations of the Eloquente

Catering Services. Today, the company is working in a very manual and fragmented

system that depends on Facebook Messenger to receive customer requests, physical

logbooks to schedule, use of handheld calculators to establish prices and taking of

payment  through  screenshots.  The  practices  bring  in  vital  weaknesses  such  as

double-bookings,

payment

discrepancy,

departments-departments

miscommunication, and total lack of data-specific business planning.

The  proposed  system  will  directly  address  these  inefficiencies  by

consolidating all operations into one, web-based platform with four different user

groups having role appropriate access through RBAC framework.

54

55

                  Figure 8. Functional Decomposition Diagram of ECS

Functional  Decomposition  Diagram  (FDD)  of  ECS  of  Eloquente

Catering  Services  is  shown  in  Figure  8.  The  diagram  illustrates  how  the  full

system  is  broken  down  into  smaller  manageable  processes  by  the  systematic

separation of the system into structure functional units based on the user roles.

The  system  has  been  organized  into  four  primary  modules  which  are

Customer, Marketing Executive, Accounting Staff and Admin. A module refers

to the specific group of users and defines the functions that they can perform in

the system.

The  Customer  Module  covers  all  client-facing  operations  including

account  registration  and

login  (1.1),  dashboard  access  (1.2),  booking

management  (1.3),  event  details  (1.4),  menu  selection  (1.5),  payments  and

checkout  (1.6),  food  tasting  (1.7),  messaging  (1.8),  announcements  (1.9),

feedback  (1.10),  event  history  (1.11),  profile  and  settings  (1.12),  and  logout

(1.13).

The Marketing Executive Module handles operational coordination and

customer  engagement  through  login  (2.1),  to-do  management  (2.2),  booking

queue  (2.3),  assisted  booking  (2.4),  customer  search  (2.5),  food  tasting  queue

(2.6),  messaging  (2.7),  calendar  (2.8),  guest  inquiries  and  leads  (2.9),  public

content (2.10), availability (2.11), preparation board (2.12), feedback follow-ups

(2.13), event history (2.14), settings (2.15), and logout (2.16).

56

The Accounting Staff Module manages all financial processes including

login  (3.1),

to-dos  (3.2),  payments  (3.3),  payment  verification  (3.4),

reconciliation (3.5), refunds (3.6), ledger and receipts (3.7), event history (3.8),

settings (3.9), and logout (3.10).

The Admin Module is the superuser layer with the highest level of system

access, encompassing login (4.1), command center (4.2), account management

(4.3),  customer  management  (4.4),  staff  management  (4.5),  analytics  (4.6),

forecasting  (4.7),  reports  (4.8),  system  and  audit  logs  (4.9),  business  settings

(4.10),  payment  rules  (4.11),  catalog  management  (4.12),  bookings  oversight

(4.13),  payment  oversight  (4.14),  refunds  oversight  (4.15),  and  dedicated

workspaces  for  each  role  including  customer  (4.16),  marketing  (4.17),  and

accounting (4.18), enabling direct intervention across all departments, and logout

(4.19).

57

Figure 9. Functional Decomposition Diagram of the Customer

Figure 9 provides an expanded view of the Customer Module (1.0), detailing all

thirteen  sub-functions  available  to  registered  customers  of  the  system.  The  module

begins with Register / Log-In (1.1), through which new users create a secure account by

submitting  their  personal  contact  details  and  credentials,  while  existing  customers

authenticate to regain platform access. The Dashboard (1.2) is the private management

portal  where  customers  get  a  real-time  overview  of  their  active  bookings,  payment

status,  and  remaining  steps  toward  event  completion.  The  Booking  Management

function  (1.3)  allows  customers  to  initiate  and  track  the  full  multi-step  reservation

process, from event type selection through package and menu configuration. The Event

Details function (1.4) enables customers to submit and update supplementary planning

information  such  as  venue  address,  timeline,  motif,  and  special  notes  tied  to  their

confirmed booking. The Menu Selection function (1.5) allows customers to browse and

58

finalize their curated dish selections across categories, with any changes automatically

reflected  in  the  booking  cost.  The  Payments  /  Checkout  function  (1.6)  manages  the

structured financial obligations of the customer, displaying the breakdown of payment

tranches along with due dates, payment statuses, and receipts. The Food Tasting function

(1.7) allows customers to  schedule a pre-event  tasting  session to  confirm  flavors and

finalize menu preferences before the event day. The Messages function (1.8) connects

customers directly to the marketing team for real-time communication regarding event

logistics and inquiries. The Announcements function (1.9) displays system-wide updates

and promotional content published by the admin. The Feedback function (1.10) provides

a  structured  mechanism  for  customers  to  submit  post-event  satisfaction  scores  and

qualitative comments. The Event History function (1.11) maintains a read-only record

of all past and cancelled bookings for reference. The Profile / Settings function (1.12)

allows customers to  manage their personal  account  information  and preferences. The

Log-Out function (1.13) securely closes the customer session.

59

Figure 10. Functional Decomposition Diagram of the Customer’s Booking

Page

Figure 10 provides a stepwise breakdown of the Booking Page, which is a wizard

process consisting of seven steps that collect all the information required to formalize a

catering reservation. The first step, Vision (1), requires the customer to select their event

type from available categories and assign a name to the event, which dynamically shapes

the offerings in the succeeding steps. The second step, Date & Time (2), prompts the

customer  to  choose  a  preferred  event  date  and  time  slot,  which  is  instantly  validated

60

against  operational  constraints  and  real-time  availability.  The  third  step,  Guests  (3),

gathers the anticipated number of attendees, with the system checking the entry against

the daily guest capacity limit. The fourth step, Packages (4), presents the customer with

available  catering  packages  tailored  to  the  previously  selected  event  type  and  guest

count.  The  fifth  step,  Menu  (5),  allows  the  customer  to  browse  and  finalize  dish

selections  across  categories  such  as  Starters,  Main  Courses,  Sides,  Desserts,  and

Refreshments, with a live running total reflecting any changes. The sixth step, Details

(6),  collects  the  venue  address  and  other  event-specific  information,  with  the  system

automatically  computing  applicable  surcharges  such  as  out-of-town  transport  fees  or

high-rise venue charges. The seventh and final step, Food Tasting (7), is optional and

allows  the  customer  to  schedule  a  pre-event  tasting  session  to  confirm  flavors  and

finalize menu preferences before the event day.

61

Figure 11. Functional Decomposition Diagram of the Customer's

Dashboard Page

Figure 11 illustrates the internal structure of the Customer Dashboard, which serves

as  the  private  post-booking  management  hub  for  all  registered  customers.  The  Event

Details function (1) presents a summary of the active booking including the event date,

time, venue, package details, current booking status, and a live event tracker showing

the progression of service from preparation through completion. The Menu function (2)

provides  customers  access  to  their  curated  dish  selections  by  category,  where

adjustments are automatically reflected in the booking cost. The Payments function (3)

displays the full contract amount broken down into structured payment tranches along

62

with their due dates, statuses, and receipts. The History function (4) maintains a read-

only record of all past and cancelled bookings, with an option to rebook using updated

availability and pricing. The Update Date / Pax function (5) allows customers to modify

their  event  date  or  guest  count  post-booking,  subject  to  availability  and  operational

constraints. The Cancel Booking function (6) is a conditional action available only when

the booking has not yet reached a stage where preparations have been locked in.

Figure 12.  Functional Decomposition Diagram of the Marketing Executive

Figure  12  provides  the  entire  functional  breakdown  of  the  Marketing  Executive

Module (2.0), detailing all sixteen sub-functions available to the logistics and customer

63

engagement  team.  The  module  begins  with  a  secure  Log-In  (2.1)  that  grants  the

executive  access  to  the  staff  portal  with  role-appropriate  privileges.  The  To-Do's

function  (2.2)  serves  as  the  priority  work  hub,  displaying  urgent  tasks,  pending

bookings,  customer  messages,  and  guest  inquiry  follow-ups  requiring  immediate

attention. The Booking Queue (2.3) is the central intake interface where the executive

reviews, claims, and processes incoming reservations by evaluating event details, guest

count, venue, and logistical viability before approval or rejection. The Assisted Booking

function (2.4) allows the executive to create bookings directly on behalf of customers.

The  Customer  Search  function  (2.5)  enables  lookup  of  customer  records  and  contact

information  across  the  system.  The  Food  Tasting  Queue  (2.6)  manages  all  tasting

requests, allowing the executive to review, claim, schedule, and update the status of each

session. The Messages function (2.7) opens a centralized inbox for claiming, answering,

transferring, and resolving customer conversations. The Calendar (2.8) provides a live

color-coded  master  view  of  all  confirmed  events,  pending  reservations,  and  blocked

operational  dates.  The  Guest  Inquiries  /  Leads  function  (2.9)  consolidates  all  contact

form submissions for triage, assignment, and follow-up. The Public Content function

(2.10) serves as the catalog management interface for announcements, packages, event

types, and menu items. The Availability function (2.11) allows the executive to control

daily booking capacity by setting date closures and adjusting event slot and guest limits.

The  Preparation  Board  (2.12)  gives  access  to  operational  preparation  records  for

upcoming  events.  The  Feedback  Follow-Ups  function  (2.13)  manages  post-event

customer  feedback  and  outstanding  concerns.  The  Event  History  function  (2.14)

provides  a  read-only  record  of  all  completed  events  for  staff  reference.  The  Settings

64

function (2.15) allows configuration of workspace preferences and notification behavior.

The Log-Out function (2.16) securely closes the marketing executive session.

Figure 13.  Functional Decomposition Diagram of the Accounting Staff

Figure 13 is the Functional Decomposition Diagram of the Accounting Staff. The

Accounting  Staff  module  (3.0)  is  designed  to  secure  revenue  flow  and  simplify  the

auditing process across all catering transactions. After completing a secure Log-In (3.1),

staff  can  access  a  To-Do's  dashboard  (3.2)  that  surfaces  pending  financial  tasks  and

obligations requiring attention. The Payments module (3.3) allows staff to manage and

monitor incoming payments across all reservation levels, including down payments and

final settlements. Payment Verification (3.4) enables staff to cross-reference uploaded

65

proofs of payment against bank records, with the ability to verify or reject transactions

and  trigger  automatic  issuance  of  digital  receipts.  The  Reconciliation  module  (3.5)

provides a searchable and filterable record of all financial activities, allowing staff to

match  transactions  and  resolve  discrepancies  within  a  specified  date  range.  Refunds

(3.6) handles the processing and tracking of returned payments for cancelled or adjusted

bookings. The Ledger and Receipts module (3.7) maintains a comprehensive log of all

financial entries and issued documents for audit and reporting purposes. Event History

(3.8)  gives  accounting  staff  visibility  into  past  catering  events  alongside  their

corresponding  financial  records.  Settings  (3.9)  allows  configuration  of  accounting

preferences and system-level options relevant to the financial workflow. A secure Log-

Out (3.10) closes the session to protect sensitive financial data.

66

Figure 14. Functional Decomposition Diagram of the Admin

Figure  14  illustrates  the  Functional  Decomposition  Diagram  of  the

Admin  module  (4.0),  which  serves  as  the  supreme  executive  layer  of  the

platform,  providing  full  oversight  and  control  across  all  operational  areas.

System  access  begins  with  Log-In  (4.1),  which  manages

the  secure

authentication gateway to protect corporate data. Once authenticated, the admin

enters the Command Center (4.2), a central operational hub that aggregates high-

level  metrics  and  displays  time-sensitive  task  queues  to  highlight  urgent

exceptions  and  performance  indicators.  User  control  is  divided  into  Account

Management (4.3), which governs credentials and access privileges across the

application; Customer Management (4.4), which maintains the client directory

and tracks historical booking engagements; and Staff Management (4.5), which

handles workforce profiles, permissions, and active or deactivated states.

Strategic  decisions  are  driven  by  the  platform's  analytical  capabilities.

Analytics (4.6) provides real-time data visualization of revenue trends, collection

health, and demand metrics, while Forecasting (4.7) uses simple linear regression

models to project future revenue and demand horizons. For documentation and

compliance, Reports (4.8) utilizes a drag-and-drop canvas layout to compile data

blocks  into  downloadable  spreadsheets  or  PDFs,  while  System  &  Audit  Logs

(4.9)  maintains  an  immutable,  tamper-evident  record  of  all  user  actions,

timestamps,  and  modified  fields.  Core  governance  is  controlled  through

67

Business  Settings  (4.10)  for  interface  preferences,  Payment  Rules  (4.11)  for

milestone and billing parameters, and Catalog Management (4.12) to configure

standard event packages and pricing matrices.

Operational  management  is  handled  through  focused  monitoring

workflows. Bookings Oversight (4.13) coordinates the verification of pending

reservations,  Payment  Oversight  (4.14)  tracks  accounts  receivable  and

unverified collections, and Refunds Oversight (4.15) reviews financial reversals

to control capital outflow. Additionally, the admin has direct, supervisory access

to  three  cross-departmental  environments:  the  Customer  Workspace  (4.16)  to

view  the  client-facing  portal,  the  Marketing  Workspace  (4.17)  to  audit

68

promotions  and  campaigns,  and  the  Accounting  Workspace  (4.18)  to  oversee

financial journals, trial balances, and cash flows. Finally, Log-Out (4.19)

Figure 15. Functional Decomposition Diagram of the Admin’s Sales Analytics

In  Figure  15,  the  detailed  breakdown  of  the  Sales  Analytics  function  is  given,

illustrating  a  structured  three-tier  architecture  designed  for  executive  business

intelligence  and  decision  support.  The  first  component,  Overview  (1),  serves  as  the

operational landing page that provides real-time visibility through high-level KPI cards

tracking  Total  Revenue  (collected  versus  pending),  Booking  Status  Overview,

Collection  Health,  and  Guest  Demand,  alongside  automated  action  signals  that  flag

immediate  collection  risks  and  booking  bottlenecks.  The  second  component,  Core

Analytics  (2),  acts  as  the  system's  predictive  forecasting  engine,  enabling  deep-dive

69

interactions  with  Revenue  Forecast  charts  powered  by  Simple  Linear  Regression  to

project  multi-month  cumulative

trends  and  generate  data-driven  operational

recommendations. Finally, Supporting Charts (3) functions as a descriptive dashboard

repository,  delivering  granular  visual  breakdowns  of  historical  data  including

chronological revenue trends, payment breakdowns, booking completion funnels, and

top package rankings to optimize long-term marketing and inventory strategies.

3.1.2.  Technical Feasibility

Technical  feasibility  is  used  to  determine  the  availability,  appropriateness  and

capability  of  the  development  team  in  terms  of  technologies,  tools,  and  expertise

necessary to develop and maintain the proposed system. The system is deployed as a

web-based application based on an open-source and highly supported technology stack,

which makes the system an inexpensive and scalable option to a Philippine-based SME.

The main backend programming language is PHP 8.2 on the server side because of

its  stability,  wide  community,  as  well  as  its  appropriateness  in  addressing  the  core

business logic of the system, such as the Booking Conflict Checker Algorithm, Real-

Time  Dynamic  Pricing  Engine,  RBAC  Authentication  Controller  and  the  Sales  Data

Aggregator.  SupaBase  is  the  relational  database  management  system,  which  offers  a

structured and normalized data to store all the operational records of the company that

includes customer profiles, booking history, payment logs, and analytics data.

Apache  2.4,  SupaBase  8.0,  and  PHP  8.2  are  all  included  in  a  single  installation

under  the  local  development  and  testing  environment  XAMPP  version  8.2.12.  This

70

enables the development department to test a simulated live server environment using

local machines prior to going to production. The integrated development environment

(IDE)  is  Visual  Studio  Code  version  1.96  as  it  is  lightweight,  has  a  large  extension

library, and supports HTML, CSS, JavaScript, and PHP, all of which are used during the

project. Laravel 11 makes web development easier because its syntax is clean, readable,

and consistent.

To  process  online  payments,  the  system  will  be  connected  to  an  Automated

Payment Gateway API, which accepts credit and debit cards, e-wallets, and direct bank

transfers. An automated payment gateway was chosen over manual payment verification

methods  due  to  its  support  for  multiple  Philippine  digital  payment  channels,  BSP

(Bangko  Sentral  ng  Pilipinas)-protected  security  of  transactions,  and  the  ease  of  use

because of its RESTful API, which can be directly embedded into the PHP server. This

provides  the  customers  with  the  opportunity  to  pay  reservation  fees  and  installment

tranches  in  accordance  with  the 10% payment schedule, 70% payment schedule, and

20% payment schedule directly in the system and not redirected to other platforms to

eliminate  the  problem  of  transaction  abandonment  and  promote  a  smooth  checkout

process.

Git  2.47  is  used  as  version  control  with  GitHub  to  facilitate  collaborative  code

development, branching, code review, and sprint tracking of the source code in support

of the Scrum methodology of the project.

The  server  and  development  machine  hardware  specifications  have  been

established at Intel Core i5 (8th Generation) or above. This specification is explained by

71

the computing resources required to execute a local development stack at the same time,

that  is,  the  XAMPP  Apache  and  SupaBase  services,  the  PHP  interpreter  with  the

business logic, i.e., the Conflict Checker and Real-Time Pricing Engine, and the Visual

Studio Code IDE with its extensions active. I5-class processors will support at least four

physical  cores  and  have  enough  clock  speed  (at  least  2.4  GHz)  to  support  such

concurrent  processes without  impacting performance  while developing and testing  it.

The  minimum  processing  unit  that  can  be  used  in  the  customer  side  is  an  i3-class

processor as they just need to have a web browser to communicate with the displayed

system interface.

The development machine requires a minimum of 5 GB of free storage space to

ensure optimal system performance and prevent issues with database write operations,

regardless of its total 500 GB capacity. This critical 5 GB allocation covers the XAMPP

8.2.12 installation (~1.2 GB), project source code and assets (~500 MB), development

dependencies  and  logs  (~500  MB),  and  the  SupaBase  database  (~200  MB),  while

preserving a generous ~2.6 GB buffer for temporary files and future data expansion.

Table 2. Hardware Specifications for Customer and Server Side

Component

Server / Development Machine

Customer Side

Processor

Intel Core i5-8th Gen or higher (quad-core,
≥2.4 GHz)

Intel Core i3-8th
Gen or higher
(dual-core, ≥2.0
GHz)

Memory
(RAM)

8 GB minimum; 16 GB recommended

4 GB minimum

72

Storage

500 GB HDD / SSD (minimum 5 GB free for
project files, XAMPP stack, and database)

At least 100 GB
available

Network

Stable broadband (min. 5 Mbps)

Operating
System

Windows 10/11 (64-bit) or Ubuntu 20.04
LTS+

Table 3. Software Specification for Server Side

Software

Description

Stable internet
(min. 2 Mbps)

Any OS with a
modern web
browser

PHP 8.2

SupaBase

XAMPP
8.2.12

Primary server-side scripting language for all application logic,
including the Conflict Checker Algorithm, Dynamic Pricing
Engine, RBAC Authentication Controller, and the Sales Data
Aggregator.

Relational database management system for structured storage of
all operational data including customer profiles, booking history,
payment records, and sales analytics information.

Local development environment (version 8.2.12) bundling Apache
2.4, SupaBase, and PHP 8.2. Used for local server simulation,
testing, and debugging during the development phase.

Visual Studio
Code 1.96

Lightweight source code editor (version 1.96) with built-in support
for HTML, CSS, JavaScript, and PHP development. Used as the
primary IDE throughout the project.

Git 2.47 /
GitHub

Version control system (Git 2.47) paired with GitHub for
collaborative development, source code management, branch
tracking, and code review throughout the project sprints.

Laravel 11

Laravel 11 offers a clean structure, powerful built-in tools, and
modern performance features that make development faster, more
secure, and easier to maintain.

Table 4. Software Specifications for Customer Side

Software

Description

73

Web Browser

Any modern browser such as Google Chrome, Mozilla Firefox,
or Microsoft Edge 120 enables to access the system interface on
desktop or mobile devices.

Operating
System

Windows, macOS, Android, or iOS can run a current-generation
web browser.

Internet
Connection

A stable internet connection with a minimum speed of 2 Mbps to
ensure real-time system responsiveness during booking, payment
submission, and dashboard access.

The  open-source  technology  PHP,  SupaBase,  XAMPP,  and  GitHub  make  the

system financially viable to the Eloquente Catering Services, which does not incur the

cost of repeated licensing fees. Third-party Payment API fits the payment infrastructure

demands  of  the  Philippine  market  and  the  hardware  thresholds  selected  guarantee

consistent performance in  all the development,  testing, and production environments.

On this consideration, the system is considered technically possible.

3.1.3.  Economic Feasibility

Economic feasibility  of the  ECS  assesses the estimated cost  and the  expected

benefits of the project system to outline the idea of whether the development and

implementation of the proposed system can be considered a rational and reasonable

investment of Eloquente Catering Services. This analysis separates the tangible costs

that are direct and measurable costs with the intangible costs that are indirect factors

that may impact on the organization in the transition period. Equally, tangible and

intangible  benefits  are  also  looked  at  to  have  a  complete  picture  of  the  overall

financial and organizational value of the system.

74

3.1.3.1. Tangible Cost

Tangible expenses are the direct costs that are quantifiable in the development

as well as the deployment of the proposed system. In this project, the physical costs

will include the web hosting and internet connection during the development period.

Hosting is also available in the Premium Shared Hosting Plan of Hostinger  at

₱2002.50  per  year.  The  reason  why  the  Premium  plan  has  been  chosen  is  that  it

covers 1 free domain name in the first year, 20GB SSD storage, 2 mailboxes per site,

1  year  of  free  email  marketing,  and  automatic  weekly  backups  all  of  which

adequately cover the current scope of deployment of the system as a single branch

SME web-based application. Under this plan the addition of the free domain also

leaves out a separate domain registration fee which makes it the most economical

hosting service to use by the project.

The internet connection cost is based on the PLDT Home Fiber Plan 1349 that

offers unlimited internet connection at 50 Mbps of ₱1,349.00 every month. Over the

12-month development and deployment period, this will total ₱16,188.00. The 50

Mbps connection speed is sufficient considering the needs of the development team,

which would be to operate a local XAMPP server environment, conduct real-time

collaborative  development  using  GitHub,  test  the  integration  of  the  Automated

Payment Gateway API, and deploy and service the system.

Table 5. Estimated Price for Tangible Cost

Item / Specification

Estimated Cost

Domain Registration (free with Hostinger Premium Plan)

₱0.00

75

Web Hosting – Hostinger Premium Shared Plan (1 year)

₱2002.50

Internet Connection – PLDT Home Fiber Plan 1349 (12
months × ₱1,349/month)

TOTAL

₱16,188.00

₱17,256.00

Integrating in Table 5, the combined approximation of the tangible cost of the

development and implementation of the Decision Support and Catering Management

System  with  Dynamic  Rule-Based  Algorithms,  Role-Based  Access  Control,  and

Predictive Analytics for Eloquente Catering Services is ₱17,256.00. This includes

all the necessary infrastructure expenditure to take the system out of development to

be in active, publicly accessible web application. Use of open-source technologies,

i.e. PHP, SupaBase, XAMPP, and GitHub make sure that no software licensing fees

are  paid  which  makes  the  overall  cost  of  development  low  in  comparison  to  the

benefits  that  the  system  promises  to  Eloquente  Catering  Services  in  terms  of

operations.

The  internet  connection  fee  of  ₱2,000.00  represents  the  connectivity  of  the

development  team  during  the  six  months  development  period.  The  balance

₱2,000.00 is used in miscellaneous  expenses such as documentation print, testing

material and other incidental development expenses. The requirements described in

Table 4 are only the minimum requirements that are required to Decision Support

and  Catering  Management  System  with  Dynamic  Rule-Based  Algorithms,  Role-

Based Access Control, and Predictive Analytics for Eloquente Catering Services, the

76

actual expenditure could be different depending on the hosting company chosen and

the business needs of Eloquente Catering Services.

3.1.3.3 Tangible Benefits

Reduced Operational Expenses

Automation of once manual processes including booking management, payment

verification  and  generation  of  reports  is  done  by  the  system  and  thus  makes  the

system  to  eliminate  costs  related  to  physical  documentation,  printed  receipts  and

manual financial records. This saves them on frequent spending on printing materials

and administrative labor in the short run.

Increased Revenue Through Efficient Booking Management

The Dynamic Pricing Engine calculates the cost of packages in real-time whereas

the Booking Conflict Checker Algorithm assures the prevention of double-bookings.

The combination of these features enables Eloquente Catering Services to take more

bookings with ways more accurate, which is directly translated into higher booking

confirmation rates and revenue generation.

Improved Financial Accuracy and Reporting

Accounting Staff module automatizes payment verification, digital receipts and

updates the sales analytics, so that all financial records have been properly updated

and can be traced and are not subject to manual computation errors. This minimizes

the risk of revenue leakage on unrecorded payment or miscalculated balance.

Cost Savings from Paperless Operations

77

The  substitution  of  printed  contracts,  hard  copy  prep  lists,  and  paper-based

receipts  with  digitally  generated  ones  will  save  on  the  recurrent  costs  spent  in

printing and documenting materials and this will translate to a saving of costs which

can be measured over the lifetime of the operation of the system.

Enhanced Resource Allocation Through Sales Insights

The Sales Analytics Dashboard that the admin can see offers actionable insights

into the most popular booking seasons, the most popular packages and their revenue

history. This will help the management to be able to distribute staff, ingredients and

equipment  more  efficiently,  and  minimize  wastage  and  maximize  profitability  at

times of high demand.

3.1.3.2. Intangible Cost

The  intangible  costs  are  those  costs  that  cannot  be  traced  directly  in  terms  of

money  system  yet  can  significantly  influence  the  organization,  the  staff  and  the

customers in the process of the new system implementation. The key intangible costs

of the deployment of the proposed system are the following.

Learning Curve

Employees and consumers used to the current group of manual operations, such

as the use of  Facebook  Messenger to  ask questions and use physical  logbooks to

schedule appointments  might  take time to adjust to  the new digital solution.  This

transition span might have short-term impact on the speed of operations and quality

of output until all users get conversant with the systems features and navigation.

78

System Downtime Risk

The unplanned server failures, hosting disruptions, or technical breakdowns can

cause a temporary disruption to the booking processes and access to the site by the

customers.  Although  the  Premium  plan  offered  by  Hostinger  is  accompanied  by

99.9% uptime guarantee, any downtimes recorded during peak booking times may

have  an  impact  on  customer  experience  and  the  trustworthiness  of  time-sensitive

transactions.

Resistance to Change

A  few  individuals  in  the  internal  staff,  especially  those  that  are  not  very

digitalized or have always been used to manual operations, might not be very willing

to move to the new system in the beginning. The resistance in this organization might

influence  the  rate  of  complete  adoption  and  it  might  need  further  management

assistance and time throughout the onboarding process.

Privacy Responsibility of Data

The system contains confidential personal and financial data, such as contacts of

its customers, event specifications, and records of payments. This presents a natural

obligation  to  adhere  to  rigid  data  protection  measures,  adhere  to  relevant  data

protection  regulations,  and  make  sure  that  all  data  stored  is  not  subject  to

unauthorized  access  or  retrieval.  Although  these  are  non-monetary,  these

responsibilities indicate a huge organizational commitment.

79

These unseen expenses need to be well considered and handled by organizing

user  onboarding,  staff  training,  and  system  security  settings  to  provide  a  smooth

effective and safe transition of Eloquente Catering Services and its customers.

3.1.3.4 Intangible Benefits

Improved Customer Experience and Satisfaction

Customer Portal offers registered customers a transparent, easy-to-use, and self-

service booking experience that is available twenty-four hours a day and does not

require a business day to be available. Possibility to check date availability, to create

packages,  to  see  real-time  prices,  to  make  payments  online  adds  the  general

satisfaction of customers and creates the long-term loyalty to the Eloquente Catering

Services.

Enhanced Interdepartmental Communication and Coordination

Booking details, prep lists, and payment information being centralized on one

platform also enhance information sharing and coordination among the Marketing

Executive,  Accounting  Staff,  and  Admin.  This  will  do  away  with

miscommunication,  entering  the  same  database  more  than  once,  and  the  time

wastage that comes with cross referencing fractured records manually.

Improved Decision-Making Through Data-Driven Insights

The  Customer  Decision  Support  System  (DSS)  also  increases  the  quality  of

booking decisions used by the customers of Eloquente Catering Service to convert

complex  pricing  and  menu  information  into  actionable  and  comprehensible

recommendations.  The  Customer  Booking  Portal  offers  the  dynamic  rule-based

80

Budget  Maximizer  algorithm,  real-time  per-head  cost  computation  and  auto-

generated  ready-to-book  menus  to  customers.  These  smart  attributes  put  the

customer out of a budgetary indecision state, which will enable them to quickly view

optimized menu combinations within the financial limit, contrast elegized packages,

or  create  a  completely  personalized  selection,  which  was  hitherto  absent  in  the

manual approach to booking.

Increased Accountability and Transparency

RBAC system and system audit logs will mean that any action of the user in the

platform  will  be  traceable  and  attributable.  This  fosters  responsibility  in  all  the

positions  of  the  staff  and  allows  the  management  to  easily  detect  and  rectify  any

anomalies in booking, payment, or system setups.

Strengthened Brand Reputation and Professional Image

The  implementation  of  a  fully  integrated  digital  catering  management  system

positions  Eloquente  Catering  Services  as  a  modern,  technology-forward  business

within the local catering industry. The capability to provide customers with online

contracts, automatic receipts, and professional online booking portal will make the

company  very  credible  and  competitive  when  compared  to  its  competitors  who

continue using manual procedures.

Given the fact that the total tangible cost is low ₱17,256.00, and that software

licensing  costs  have  not  been  incurred  due  to  the  utilization  of  open-source

technologies,  and  that  operational  and  strategic  gains  have  been  identified  as

81

substantial  above,  it  is  decided  that  ECS  is  economically  viable  to  Eloquente

Catering Services.

3.1.4.  Schedule Feasibility

The schedule feasibility evaluates the comprehensive timeline of activities required

from the formal initiation of the project through its final deployment. This assessment

serves as the primary metric by which the research team can gauge the logistical viability

of  delivering  the  Catering  Management  and  Sales  Analytics  System  for  Eloquente

Catering  Services  within  the  mandated  deadlines.  To  ensure  strict  adherence  to  this

timeline, the researchers adopted an Agile software development methodology utilizing

the  Scrum  framework.  This  approach  prioritizes  iterative  coding  cycles,  continuous

stakeholder communication, and flexible milestone planning, allowing the development

team  to  seamlessly  adapt  to  evolving  operational  requirements  and  integrate  client

feedback through incremental software releases.

The comprehensive project roadmap spans the entire 2026 calendar year, extending

from January 2026 to December 2026. This timeline is visually structured utilizing a

detailed Gantt chart, which provides a transparent overview of all specific tasks, their

projected durations, and exact start and end dates. This visual management tool ensures

that  both  the  development  team  and  the  evaluating  panel  can  accurately  track

developmental  progress  at  any  given  juncture.  Furthermore,  the  overall  timeline  is

strategically divided into two major development phases. Phase 1 focuses on rigorous

preliminary research, system design  architecture,  and the completion of all necessary

documentation  milestones.  Subsequently,  Phase  2  encompasses  the  core  technical

82

system development, rigorous software testing, and final deployment procedures. This

phased  approach  guarantees  that  the  ultimate  delivery  of  the  system  is  executed  in  a

highly systematic, well-documented, and strictly punctual manner.

Figure 16. Gantt Chart of System Development

As illustrated in  Figure  16, the Gantt chart outlines a 12-month project  timeline

from January to December 2026. Phase 1 (January to April) focuses on pre-writing and

initial documentation. It begins with brainstorming, customer interviews, and iterative

83

title  proposals,  culminating  in  the  Final  Title  Defense  by  late  February.  Throughout

March and April, the team drafts, consults, and revises Chapters 1 through 3, concluding

Phase 1 with prototype development and the Chapter 1–3 Defense.

Phase 2 spans May to December, dominated by a comprehensive 20-week System

Development  period  (May  to  September)  to  build  the  core  modules,  including  the

booking engine, conflict checker, payment integration, and analytics dashboard. This is

followed by rigorous Alpha, Beta, and Customer Testing phases throughout September

and October. Finally, November targets Web Host Deployment and the Final Defense,

while December officially concludes the project timeline with post-defense revisions,

system turnover, and maintenance.

3.2.Project Design

The Project Design section is the ultimate structural and functional blueprint of the

Eloquente  Catering  System  (ECS),  converting  such  complicated  business  needs  as

Dynamic  Rule-Based  Algorithms,  strict  Role-Based  Access  Control  (RBAC),  and

Predictive Analytics into formal software engineering models. In order to thoroughly

prove the technical integrity, the following section uses certain visual representations:

the System Architecture Block Diagram and Data Flow Diagrams (DFD) map secure

data and API routing; the Use Case, Activity Diagrams, and Business Process Modeling

Notation  (BPMN)  defines  cross-functional  workflows  of  bookings,

logistical

gatekeeping,  and  financial  auditing;  and  the  Entity-Relationship  Diagram  (ERD)

establishes the normalized database schema driving the Predictive Analytics. Combined,

84

these models demonstrate how the traditional catering business can be transformed into

a very safe, automated, and data-driven business environment.

3.2.1.  Context Diagram

Figure 17. Context Diagram of ECS

Figure 17 shows the Level 0 Context Diagram of the Eloquente Catering System

(ECS).  The  diagram  presents  the  overall  interaction  between  the  system  and  its  four

main users: Customer, Marketing Executive, Accounting Staff, and Admin. It shows the

major  functions  or  modules  that  each  user  can  access  and  how  these  functions  are

connected to ECS. Since this is a context diagram, the focus is on the external users and

their main interactions with the system, not the detailed internal processes.

The Customer interacts with the system mainly through customer-facing modules.

These include the Customer Dashboard, Booking Management, Food Tasting Request,

Booking Status Tracking, Payment Processing, Feedback Response, and Chat. Through

these  modules,  the  customer  can  create  and  manage  bookings,  request  food  tasting,

85

monitor  the  progress  of  their  booking,  process  payments,  give  feedback,  and

communicate with the business.

The  Marketing  Executive  uses  the  system  to  manage  customer-related  and

booking-related  operations.  This

includes  Menu,  Package,  and  Event  Type

Management, Calendar Availability Management, Booking Review and Coordination,

Customer

Inquiry  Management,  Announcement  Management,  Food  Tasting

Management,  Feedback  Management,  Assisted  Booking,  and  Chat.  These  modules

allow the Marketing Executive to handle booking reviews, respond to inquiries, manage

announcements,  assist  customers  with  bookings,  and  coordinate  important  customer

service tasks.

The  Accounting  Staff  focuses  on  the  financial  side  of  the  system.  The  modules

connected  to  Accounting  Staff  include  Payment  Verification,  Ledger  Management,

Refund  Management,  and  Reconciliation  Management.  These  functions  allow  the

accounting  role  to  verify  customer  payments,  maintain  payment  records,  manage

refunds,  and  check  whether  payment  information  is  properly  recorded  and  balanced

within the system.

The  Admin  has  the  widest  access  because  this  role  supervises  and  manages  the

overall system. The Admin can manage staff and customer accounts, customer inquiries,

announcements,  food  tasting,  payments,  reports  and  analytics,  refunds,  assisted

bookings, audit logs, feedback, customer dashboard monitoring, calendar availability,

booking supervision, and menu, package, and event type management. This shows that

the  Admin  has  access  to  the  main  modules  of  the  other  users,  along  with  additional

administrative functions needed to monitor, control, and maintain the system.

86

3.2.2.  Data Flow Diagram

Figure 18. Data Flow Diagram of ECS

Figure  18  shows  the  Level  1  Data  Flow  Diagram,  which  visualizes  the  highly

granular, technical routes of data transformation within the ECS. By compartmentalizing

operations into four primary processing nodes and four central data stores, the diagram

illustrates  exactly  how  exhaustive  external  inputs  are  authenticated,  algorithmically

transformed, and safely stored to produce both operational and analytical outputs.

Process 1.0 (Manage Customer Bookings) acts as the primary data intake engine.

It  captures  raw  Account  Registration  Data,  Event  Specs  (Date/Pax/Venue),  Target

Budgets, and Custom Menu Add-ons directly from the Customer. The process actively

queries  the  D2  Package  &  Menu  Catalog  to  execute  the  Customer  Decision  Support

System  (DSS)  via  the  Smart  Budget  Maximizer  algorithm,  dynamically  generating  a

87

maximized menu and an estimated surcharge breakdown. It also handles Customer Chat

Messages. Upon customer confirmation, the system writes the finalized transaction into

the D1 Booking & Event Database and outputs the Official Digital Contract and Booking

Status to the user.

Process 2.0 (Coordinate Logistics & Marketing) governs operational intelligence.

The  process  autonomously  fetches  pending  payloads  and  event  specs  from  D1.  It

executes dynamic rule-based algorithms to compute and output Bespoke Staffing Ratios,

Prep  Lists,  and  Venue  Constraint  Alerts  to  the  Marketing  Executive.  Acting  as  the

gatekeeper, the executive returns Logistical Overrides, Manual Calendar Date Blocks,

and Homepage Announcements. The process utilizes these inputs to update the calendar

blocks in D1 and write public CMS announcements directly into the D4 System Audit

and User Logs.

Process  3.0  (Process  Financial  Ledgers)  controls  the  deterministic  10/70/20

financial lifecycle. Customers submit their 10% Digital Checkout Payloads and upload

their 70% / 20% Bank Proofs into this process. For online reservations, the process sends

Digital  Payment  Requests  to  the  External  Payment  Gateway  API  and  receives

Automated  Webhook  Callbacks  for  instant  verification.  Conversely,  unverified

corporate  bank  proofs  are  routed  to  the  Accounting  Staff.  Upon  receiving  Manual

Tranche Approvals and Refund Authorizations from the staff, the process permanently

logs  the verified payments  into the D3  Financial  &  Payment Logs and automatically

issues Official Digital E-Receipts back to the customer.

88

Process  4.0  (Administer  Predictive  Analytics  &  Oversight)  functions  as  the

enterprise's  strategic  brain.  This  process  receives  high-level  configurations  from  the

admin,  specifically  Custom  Discount  Overrides,  Package/Pricing  Configurations,  and

RBAC Security Configurations, writing these updates directly to D2. Concurrently, the

process performs deep extractions; it pulls Historical Booking Data from D1, Cleared

Revenues  from  D3,  and  Security  Audits/Feedback  from  D4.  The  backend  executes

advanced  statistical  models,  transforming  this  raw  data  into  Descriptive Peak  Season

Heatmaps,  Predictive  Revenue  Forecasts,  Moving  Average  Pax  Projections,  and  a

transparent  Pricing  Ledger,  which  are  subsequently  output  to  the  Admin  via  an

Executive Analytics Report.

3.2.3.  Flowchart

The subsequent System Process Flowcharts clearly stipulate the sequential micro-

logic and algorithmic decision trees that control the fundamental modules of the ECS.

They  represent  the  entire,  autonomous  lifecycles  of  operation  of  all  RBAC  users  by

mapping out exhaustive decision pathways.

89

Figure 19. Customer Booking Workflow

90

Figure  19  illustrates the customer booking  workflow, which follows a seamless

"guest checkout" style process. The workflow begins with the customer selecting their

desired event type. They then choose an event date, start time, and duration. The system

immediately checks this  against a 10-event daily limit, prompting a reselection if the

date is fully booked. Once validated, the user inputs their guest count, which the system

verifies against a daily capacity limit of 3,500 total guests across all events, requiring

adjustments if exceeded. Following capacity validation, the customer selects an event

package and sets their budget constraints. They then customize their menu and input any

dietary notes. Next, the user provides core event and client venue details, after which the

system automatically calculates all applicable surcharges to display the total price.

The  workflow  then  moves  to  an  optional  food  tasting  decision.  If  the  customer

requests a tasting, they input their preferred tasting details and date. The system checks

that the requested date allows at least a 3-day lead time and has fewer than six existing

tasting groups booked; if invalid, they are prompted to pick a new date. Upon passing

this check, they input tasting-specific dietary notes and confirm the tasting session. If

the client is dissatisfied and does not approve the tasting, the entire booking is canceled.

If they approve the tasting, or if they bypassed the tasting step entirely, they proceed

to the authentication phase. The system checks if the user is logged in; if they are not,

they  are  prompted  to  register  or  log  into  their  account.  Once  authenticated,  the  user

formally submits the booking and gains access to their dashboard. To officially secure

the date, they pay an online reservation fee through the gateway. This payment initiates

direct coordination with a marketing executive to finalize event details. The customer's

remaining  balance  must  be  settled  prior  to  the  event's  execution.  After  the  event

91

concludes, the system evaluates if any additional fees were incurred, processing an extra

payment  if  necessary.  Finally,  the  customer  submits  post-event  feedback,  officially

completing the workflow.

Figure 20. Marketing Executive Workflow

92

Figure 20  illustrates the Marketing Executive workflow, positioning them as the

primary logistical gatekeeper, content manager, and customer liaison of the enterprise.

The  process  begins  when  the  executive  logs  into  the  secure  system  and  views  their

dashboard  home.  From  this  centralized  hub,  they  can  choose  between  five  distinct

operational  pathways.  They  can  select Manual  Booking to  seamlessly  create

reservations  for  walk-in  or  over-the-phone  clients,  manage Team  Transfers to

strategically  reassign  workload  to  colleagues,  or  use Event  Tracking to  monitor  and

update the live status of ongoing events in real time. Additionally, they are responsible

for Content  Management,  which  empowers  them  to  edit  and  manage  public-facing

information; this includes posting homepage announcements, updating seasonal menu

items, and adjusting the pricing and inclusions of catering packages to reflect current

business offerings.

However, the core responsibility of the marketing executive is to Process Bookings.

When selecting this primary pathway, the executive accesses a global queue of incoming

customer bookings and selects a specific reservation to process. They must thoroughly

review  the  booking  details  against  a  comprehensive  set  of  preparation  tasks  and

constraints. The flow then reaches a critical decision node: "Is Everything Correct?" If

there  are  scheduling  conflicts,  missing  dietary  information,  or  unviable  logistical

requests,  the  executive  initiates  an  adjustment  loop  to  ask  the  client  for  the  missing

details or renegotiate terms. Once all issues are actively resolved and the logistics are

deemed viable, the executive officially approves the booking. Finally, they finalize the

booking within the system, marking it as complete or ready for live execution, which

successfully concludes the workflow and formally reserves the calendar block.

93

Figure 21. Accounting Staff Workflow

Figure  21  shows  the  Accounting  Staff  Workflow.  Because  the  integrated

Automated Payment Gateway API is specifically designed to autonomously execute the

verification of electronic funds for initial deposits, the daily workflow of the accounting

staff is highly optimized. Instead of manually cross-referencing low-value transaction

94

screenshots,  their  role  is  strategically  shifted  toward  high-level  revenue  auditing  and

enterprise  cash  flow  management.  The  workflow  initiates  when  an  accounting  staff

member logs into the accounting system and accesses the global ledger and payment

queues.  Within  this  module,  their  primary  responsibility  is  to  meticulously  audit  the

client payment progression, tracking each booking through the standardized 10%, 70%,

and 20% payment tranches.

As  the  staff  navigates  the  ledger,  a  critical  decision  node  evaluates  the  required

action  based  on  the  specific  status  of  the  transaction.  If  the  transaction  requires

Adjustments, such as managing overdue tranches or formal booking cancellations, the

accounting  staff  processes  the  necessary  refund  or  sends  a  payment  reminder.

Alternatively,  when  dealing  with  Manual  Payments,  particularly  the  manual  bank

uploads for the 70% or 20% tranches, the staff assumes manual control to rigorously

cross-reference and verify the bank proofs against the company's actual bank records.

Meanwhile,  API  Payments  processed  through  gateways  like  PayMongo  bypass  this

manual check entirely because the system auto-verifies the electronic funds.

Once  a  payment  tranche  is  confirmed  through  the  API  or  manual  pathway,  it

advances to the next stage. The staff confirms the official "Paid" status within the ledger,

which  immediately  triggers  the  system  to  provide  a  digital  electronic  receipt  to  the

customer. Finally, all three pathways, including the adjustments route, converge at the

bottom of the flowchart to modify the master revenue reports. This dynamically updates

the  enterprise  cash  flow  and  secures  the  financial  data  for  future  analytics,  officially

concluding the accounting workflow.

95

Figure 22. Admin Workflow

Figure 22 shows the Admin Workflow. The administrative workflow bypasses the

linear processing of daily transactions and instead utilizes a multi-branching enterprise

architecture designed exclusively for top-level oversight. The sequence begins when the

administrator  logs  into  the  secure  system  and  accesses  the  overarching  enterprise

dashboard. From this centralized hub, a critical decision node allows the admin to select

96

their  administrative  action,  splitting  the  workflow  into  three  distinct,  high-level

pathways.

The "Security Path" focuses on system integrity and access control, empowering

the  admin  to  meticulously  manage  employee  and  customer  accounts  while  auditing

system  activity  logs  for  compliance.  The  "Configuration  Path"  is  dedicated  to  core

system parameters, allowing top-level management to configure the menu catalog and

packages,  as  well  as  define  global  pricing  rules  and  financial  overrides.  Finally,  the

"Insights Path" drives data-backed decision-making through enterprise analytics. Within

this branch, the administrator reviews holistic revenue and operations data and executes

advanced predictive forecast modules to gauge business trajectory.

Regardless  of  the  selected  pathway,  all  three  operational  branches  seamlessly

converge at the end of the session. The system aggregates the generated data to export

comprehensive  executive  reports.  These  analytics  directly  inform  and  shape  future

business strategies, effectively concluding the overarching administrative workflow.

3.2.4.  Unified Modeling Language

The Unified Modeling Language (UML) offers a standardized method of graphical

representation  of  a  system  design.  To  further  explain  the  structural  and  behavioral

features of the ECS, the researchers used the Use Case Diagram and the Class Diagram.

3.2.4.1 Use Case Diagram

The Use Case Diagram below shows the functional interplay between the ECS

and the external actors assigned to it. It is a top-level visual map that determines the

boundaries  of  the  system  and  outlines  the  exact  capabilities  available  to  the

97

Customer,  Marketing  Executive,  Accounting  Staff,  and  Admin.  The  diagram  is

governed  by  a  strict  RBAC  architecture,  which  clearly  defines  the  authorized

operational  workflow  of  each  role,  including  front-end  event  booking,  logistical

validations, financial tracking, and the production of predictive business analytics.

Figure 23. Use Case Diagram of Eloquente Catering System

Figure 23 features the Use Case Diagram which diagrammatically represents

the fundamental functional requirements of the Eloquente Catering System (ECS)

alongside  the  unique  human  actors  who  interface  directly  with  the  software.  The

98

central rectangular boundary serves as the defined system environment, explicitly

establishing  the divide between the internal  automated processes  and the external

users  who

trigger

them.  To  ensure

that  all

interactions  are  securely

compartmentalized, the system utilizes a rigid Role-Based Access Control (RBAC)

architecture.  The  diagram  identifies  four  primary  actors:  the  Customer,  the

Marketing Executive, the Admin,  and the Accounting Staff. Each actor is strictly

limited  to  performing  specific  functional  use  cases  that  align  perfectly  with  their

operational  authorization  and  departmental  scope,  effectively  preventing  any

unauthorized data access across the platform.

The  Customer  actor  is  the  primary  initiator  of  interactions  within  the  front-

facing  booking  engine.  Their  central  operation  is  the  "Book  Event  &  Customize

Menu" use case, which manages the consumption of core event specifications and

enables the ad hoc building of custom catering packages. This main functionality is

directly  linked  to  the  "Use  Smart  Budget  Maximizer"  use  case  through  a

formal <<extend>> relationship.  This  structural  notation  signifies  that  customers

possess the option to trigger a dynamic algorithm that mathematically optimizes their

menu selections to meet a specific financial constraint. Furthermore, the customer is

empowered to "Track Bookings & Manage Payments" and formally "Submit Post-

Event Feedback" to finalize their lifecycle.

Parallel to the customer experience, the Marketing Executive actor is projected

into the operational workflows. They initiate use cases associated with qualitative

gatekeeping,  specifically  acting  to  "Process  &  Approve  Bookings"  by  validating

logistical  computations.  Additionally,  they  are  responsible  to  "Track  Live  Event

99

Status" and "Manage Public Content & Menus," sharing this content responsibility

with the Admin actor.

The Admin actor operates independently of daily transactions, activating top-

level  enterprise  use  cases  focused  strictly  on  strategic  oversight.  The  admin

communicates  directly  with  the  system  to  "Execute  Enterprise  Analytics,"

leveraging  historical  data  to  accurately  forecast  revenue  trends.  Furthermore,  the

Admin uses "Manage Pricing Rules & Overrides" to maintain financial controls and

executes "Manage Users & RBAC Security" to configure the global security settings

of the entire platform.

Lastly,  the  Accounting  Staff  actor  is  confined  exclusively  to  the  financial

management  processes  to  maintain  absolute  fiscal  security.  Their  primary

applications involve the  ability to  "Verify Bank Proofs &  Payments," where they

audit automated API transactions and manually verify corporate bank transfers. They

also actively "Process Refunds & Cancellations" to adjust the global ledger. Upon

successful verification of all cash flows, they securely "Generate Master Revenue

Reports,"  a  critical  use  case  which  is  also  monitored  by  the  Admin  to  secure  the

enterprise financial data.

3.2.4.2 Use Case Document

The Use Case Document below presents a detailed step-by-step description of

the main functional processes of the ECS. Converting the visual interactions of the

above diagram into organized tabular representations, this section clearly outlines

100

the  preconditions,  key  interactive  flows,  and  postconditions  of  each  of  the  key

processes. These stories are the blueprint of the software backend logic and are used

to  describe  how  user  inputs  can  be  used  to  drive  dynamic  rule-based  algorithms,

support  secure  financial  tracking,  and  produce  predictive  analytics  across  the

isolated RBAC modules.

Table 6. Use Case Specification for Book Event & Customize Menu

 Book Event & Customize Menu

Use Case
Name
Primary
Actor
Description  The customer utilizes the progressive portal to input event

Customer

specifications, construct a customized menu from scratch, and
secure a reservation date.

Pre-
conditions
Main Flow  1. The customer selects the event type, estimated headcount, and

The customer has accessed the progressive booking portal
interface

time.
2. The customer browses the digital catalog and adds individual
menu items to build a custom package.
3. The system continuously calculates the base cost by
multiplying the selected item prices by the headcount.
4. The customer inputs final logistical details, including specific
venue conditions.
5. The system calculates the base cost and applies necessary
logistical surcharges.
6. The customer confirms the details and processes the initial
10% reservation fee via the payment gateway.

Post-
conditions

The booking is recorded in the system database under a pending
status awaiting marketing approval.

Table 6 describes the main customer-facing interaction of the booking engine.

It describes the workflow basis in which a customer enters their preliminary event

specifications, including headcount and venue information, and then builds a highly

customized  menu  to  order.  The  system  constantly  computes  the  base  cost  and

101

imposes required logistical surcharges in real-time and ends with the safe execution

of the initial reservation fee through an external payment gateway.

Table 7. Use Case Specification for Smart Budget Maximizer

Use Smart Budget Maximizer

Use Case
Name
Primary
Actor
Description  An optional extension of the booking process where the system

Customer

algorithmically constructs a customized menu to fit the
customer's inputted target budget.

Pre-
conditions
Main Flow  1. The customer inputs a specific target budget and triggers the

The customer is at the budget intake step of the event booking
process.

maximizer algorithm.
2. The system divides the target budget by the pax to calculate
the exact per-head allowance.
3. The system evaluates the menu catalog and automatically
selects main courses, bases, and refreshments that
mathematically fit the allowance without exceeding it.
4. The system presents the algorithmically generated menu
recommendation alongside a detailed cost breakdown.
5. The customer accepts or tweaks the recommended menu and
proceeds to checkout.

Post-
conditions

The customer bypasses manual menu selection with a budget-
compliant cart.

Table  7  details  the  Smart  Budget  Maximizer,  an  advanced  algorithmic

extension to the standard booking procedure designed to act as a Customer Decision

Support  System  (DSS).  By  optionally  inputting  a  target  financial  ceiling,  the

customer actively triggers the system's dynamic rule-based algorithm. The backend

mathematically divides this total  budget  by the specified headcount  to  compute a

strict per-head allowance. Utilizing this constraint, the system evaluates the entire

menu catalog to filter and automatically select a combination of dishes that perfectly

102

fit the allowance without exceeding it. Ultimately, this automated menu generation

directly  resolves  customer  budget  uncertainty,  preventing  cart  abandonment  and

significantly accelerating the final checkout process.

Table 8. Use Case Specification for Validating Logistics & Constraints

Validate Logistics & Constraints

Use Case
Name
Primary
Actor
Description  The staff reviews a pending booking to verify event

Marketing Executive

requirements, venue constraints, and daily capacity limits before
finalization.

Pre-
conditions
Main Flow  1. The Marketing Executive logs into the Marketing and

A customer has successfully placed a booking, setting its status
to pending.

Logistics Module.
2. The system flags any potential scheduling conflicts utilizing
the capacity constraint algorithm.
3. The system calculates and displays the bespoke staffing ratio
required for the specific headcount.
4. The system highlights logistical alerts, such as venue
accessibility issues (e.g., high-rise constraints) submitted by the
customer.
5. The executive reviews the computations, assigns the necessary
hauling staff, and approves the booking.
The booking status is updated to approved and an official digital
contract is generated.

Post-
conditions

Table  8  details  the  critical  operational  gatekeeping  duties  assigned  to  the

Marketing  Executive.  Before  any  pending  booking  is  formally  converted  into  an

official binding contract, the backend system automatically intervenes to assess the

overall  logistical  feasibility  of  the  event.  It  calculates  highly  customized  staffing

ratios  based  on  the  guest  count  and  simultaneously  compares  the  requested  date

against  the  inflexible  daily  capacity  limits  of  the  enterprise.  Furthermore,  the

narrative emphasizes the highly proactive nature of the system logic in identifying

and  warning  the  marketing  staff  about  essential  physical  venue  restrictions.  For

103

instance, if a customer specifies a high-rise location without proper freight elevator

access, the system actively flags the immediate requirement for additional manual

haulers. By catching these severe logistical constraints early in the approval pipeline,

the  Marketing  Executive  can  safely  renegotiate  terms  with  the  customer  and

successfully prevent critical operational breakdowns on the actual day of the event.

Table 9. Use Case Specification for Verifying Bank Proofs & Payments

Verify Bank Proofs & Payments

Use Case
Name
Primary
Actor
Description  The accounting personnel monitor, cross-reference, and verify

Accounting Staff

incoming payments across the multi-tranche payment lifecycle to
maintain the integrity of the global ledger.

Pre-
conditions
Main Flow  1. The Accounting Staff logs into the Accounting Module and

A booking has been successfully created and securely logged into
the global ledger and payment queues.

accesses the global ledger.
2. The system displays a queue of all active client payment
progressions and their respective 10%, 70%, and 20% tranche
breakdowns.
3. For API Gateway Payments (e.g., PayMongo), the system
automatically verifies the electronic funds and flags the tranche
as paid.
4. For Manual Payments, the staff manually cross-references and
verifies the uploaded bank proofs against the company's actual
bank records.
5. The staff formally confirms the official "Paid" status within
the ledger, which immediately triggers the system to generate a
digital electronic receipt.
The financial ledger is accurately updated, and a digital receipt is
provided to the customer, officially balancing the enterprise
accounts receivable.

Post-
conditions

Table 9 specifies the structured financial verification protocols enforced by the

Accounting  Module.  It  explicitly  outlines  the  procedural  workflow  by  which

accounting  personnel  monitor,  cross-reference,  and  audit  a  client's  multi-tranche

104

payment  progression.  While  certain  transactions,  such  as  the  initial  API  gateway

payments, are  autonomously verified  by the system, the architecture  purposefully

maintains  a  highly  secure,  centralized  global  ledger  for  all  subsequent  financial

activities. Within this controlled environment, the accounting staff must manually

cross-reference and verify uploaded bank proofs for manual payments, such as the

seventy percent downpayment and the twenty percent final balance. Ultimately, this

hybrid  verification  architecture  ensures  that  all  payment  statuses  are  formally

confirmed before triggering the issuance of digital electronic receipts, guaranteeing

absolute accuracy across the enterprise cash flow.

Table 10. Use Case Specification for Generating Predictive Analytics

Generate Predictive Analytics

Use Case
Name
Primary
Actor
Description  The administrator utilizes the enterprise dashboard to review

Admin

holistic operational data and execute statistical models to project
future business trajectories.

Pre-
conditions

The administrator is securely authenticated into the enterprise
system, and the central database contains sufficient historical
operational and financial data.

Main Flow  1. The administrator accesses the enterprise analytics dashboard

within the secure Admin Module.
2. The system dynamically aggregates historical transaction logs,
active pipelines, and cleared financial tranches.
3. The administrator reviews specific operational categories, such
as Menu Performance, active Operations, and Revenue pipelines.
4. The system executes advanced predictive forecasting modules
(including Simple Linear Regression and Moving Averages) to
project future revenue and expected guest demand.
5. The administrator evaluates the generated visual trendlines and
comprehensive reports to formulate strategic procurement and
staffing decisions.
Comprehensive visual analytics charts and actionable executive
reports are successfully rendered and exported from the
dashboard.

105

Post-
conditions

Table  10  records  the  top-level  strategic  functions  incorporated  within  the

overarching  enterprise  dashboard.  It  outlines  the  exact  trigger  sequence  that  the

administrator  initiates  to  assess  the  historical  and  ongoing  performance  of  the

enterprise. On demand, the system aggregates cleared financial information, active

pipeline  data,  and  menu  performance  metrics.  It  then  implements  sophisticated

statistical models, specifically Simple Linear Regression and Moving Averages, to

generate robust future forecasts. The resulting visual trendlines and comprehensive

cross-tabulation reports empower executive management to make proactive, data-

driven  decisions  regarding  future  procurement,  seasonal  demand,  and  long-term

business strategy.

Table 11. Use Case Specification for Managing Pricing Rules & Overrides

Manage Pricing Rules & Overrides

Use Case
Name
Primary
Actor
Description  The administrator reviews global pricing rules, manages

Admin

logistical surcharges, and applies custom financial overrides to
specific bookings.

Pre-
conditions
Main Flow  1. The administrator accesses the global pricing and override

The administrator is securely authenticated into the enterprise
system.

module.
2. The system dynamically displays an itemized breakdown of
active bookings, strictly separating base package costs from
calculated logistical surcharges (e.g., out-of-town or high-rise
fees).
3. The administrator reviews these exact logistical fees to ensure
baseline operational margins remain fully protected.
4. The administrator applies a custom, discretionary financial
override or discount to a specific customer's base package price,
ensuring fixed logistical surcharges are preserved.
5. The system automatically recalculates the final booking total
and dynamically syncs the updated price to the customer's
financial ledger.

106

Post-
conditions

The customer's financial ledger is successfully updated with the
administrative override, and the new total is synchronized across
the system.

Table 11 explains the administrative controls  governing the dynamic pricing

engine  of  the  system.  It  describes  how  the  administrator  accesses  a  completely

transparent  financial  ledger  that  strictly  separates  base  package  costs  from

algorithmically  determined  logistical  surcharges,  such  as  transport  or  high-rise

delivery  fees.  This  granular  financial  visibility  guarantees  that  when  the

administrator applies discretionary manual overrides or custom discounts to secure

high-value  corporate  deals,

the  underlying  operational  margins

remain

mathematically insulated and fully protected.

3.2.4.3 Activity Diagram

The  dynamic  control  flows  of  each  user  role  are  shown  in  the  following

diagrams. They record the entire chain of activities, algorithmic decision making,

capacity  checks,  and  mathematical  operations  that  strictly  control  the  respective

operational lifecycles of the system.

107

Figure 24. Activity Diagram for the Customer

108

Figure  24  shows  the  detailed  hand-off  between  user  inputs  and  algorithmic

system  validations  is  shown  in  figure  24.  Once  the  customer  is  authenticated

securely,  he  enters  the  date  and  time  of  the  event,  which  immediately  activates

programmatic constraints of 7 days' lead time and 7 events per day. The system then

uses  a  progressive  data  strategy  to  validate  the  guest  count  against  a  hard-coded

3,500  pax  limit.  The  customer  inputs  their  budget,  and  can  optionally  enable  the

algorithmic Budget Maximizer for cost-efficient packages. Lastly, the customer logs

in  to  their  dashboard  to  finish  their  API-based  reservation  payment,  which  is

automatically verified in the database and securely processed before a digital receipt

is sent and the session is ended.

Figure 25. Activity Diagram for the Marketing Executive

109

Figure 25 presents the activity diagram for the Marketing Executive. It maps

out  a  streamlined,  sequential  workflow

tailored  entirely

to

their  daily

responsibilities. Because the automated system already handles the heavy lifting of

filtering out basic quantitative issues like date conflicts or maximum guest capacities

during  the  customer's  initial  booking,  the  executive  is  free  to  act  primarily  as  a

qualitative  gatekeeper.  The  entire  process  begins  with  a  secure  login.  After

validating the credentials, the backend system automatically pulls up any pending

bookings and calculates the necessary logistics. The executive then steps in to review

these system-checked bookings and conduct a final, human-level verification. At this

stage,  they  reach  a  key  decision  point  to  assess  whether  the  operational  logistics

actually make sense. If something is unworkable, they contact the client to initiate a

renegotiation, which loops the process back to the initial review step. However, if

the logistics are completely viable, the executive officially approves the operational

documents. This authorization immediately prompts the system to generate a formal

digital  contract.  Simultaneously,  it  creates  an  operational  prep  list  and  sends  out

notifications  to  the  relevant  staff.  Once  this  automated  hand-off  is  done,  the

executive finishes up by manually managing the final  calendar blocks. They then

securely sign out, completing their tasks for the session.

110

Figure 26. Activity Diagram for the Accounting Staff

Figure  26  shows  the  accounting  staff  activity  diagram  which  describes  the

financial  verification  process  implemented  by  the  Accounting  Staff,  which  is

designed  in  such  a  way  as  to  ensure  financial  security  throughout  the  10/70/20

tranche lifecycle. The system uses a manual air gap in the left lane to remove the

possibility of fraudulent evidence of payment of significant corporate transfers. The

accountant logs in to the ledger and replies to outstanding queues. Although the API

system logic will automatically verify initial 10% reservations, the accountant will

111

be required to cross-verify uploaded evidence on the 70% and 20% tranches with

actual corporate bank accounts. When the transaction is invalid, the transaction is

rejected; when it is valid, the accountant explicitly modifies the payment status. This

is an important step to restore the system logic to the right lane, which automatically

updates the master financial ledger and issues the official digital receipt, making it

impossible to tamper with revenue tracking.

Figure 27. Activity Diagram for the Admin

112

Figure 27 shows the activity diagram for the Admin, which represents the high-

level  overview  of  the  workflow  for  managing  the  system  and  overseeing  its

activities. It starts with a regular secure login procedure. The backend validates the

credentials  successfully and grants  access,  it immediately displays the centralized

Executive Dashboard for the admin to view. The admin is then presented with a main

decision node from this dashboard to choose the action they want to take depending

on the current operational requirements. They select the Security path and administer

users and role-based access control. By selecting the Config path, they can actively

manage global pricing rules and manually override financial rules. If you choose the

Insights path, then enterprise analytics is executed, which causes the backend system

to execute linear regression and moving average forecasting models. The workflows

all  converge  at  the  end  of  the  day,  whatever  administrative  route  is  followed.  A

detailed  master  executive  report  of  the  changes  or  analytical  findings  is

automatically exported by the system logic. Lastly, the admin securely logs out to

end their management session.

3.2.4.4 Entity Relationship Diagram

The ERD below is a fully normalized relational environment. It consists of

five logical layers, namely: (1) The Security & RBAC Layer, (2) The Transaction

Hub, (3) The Menu Customization Engine, (4) The Financial Ledger and (5) The

Operational  Support  tables.  This  design  has the  effect  of making sure that  all the

functional claims in the manuscript have a strong data field, whether it is the audit

trails  that  are  necessary  to  secure  the  system  or  the  surcharges  that  the  dynamic

pricing algorithms must compute.

113

Figure 28. Entity Relationship Diagram for ECS

Figure 28 shows the database schema, which has been carefully designed to meet

the multi-role operational needs of the ECS. At the administrative level, the users

table is the rock-solid base of the RBAC framework. A normalized role ENUM field

is used to control user authorization, eliminating the need for a separate legacy table,

and allowing authentication to be used as a structural filter for all database queries.

Moreover,  the  audit_logs  entity  is  rigidly  linked  directly  to  the  users  table.  This

114

means that any sensitive administrative activity such as price overrides and profile

changes are automatically recorded with an IP signature, providing enterprise-class

security.

The bookings hub controls the central payload logic. The architecture uses the

calendar_availability_overrides  entity  to  successfully  physicalize  bookings  and

prevent  overlapping  schedules  in  the  kitchen,  as  it  has  a  maximum  capacity.  In

addition, the database also has an intelligent menu mapping strategy, which allows

for very advanced customization. Although the packages table is present to facilitate

fast and curated event bookings, the system makes use of a universal booking_items

junction table to connect customer bookings with specific culinary offerings. This

relational design provides the programmatic flexibility to dynamically determine and

include an optimal set of individual menu_items to any booking to achieve a balance

between cost and flavor, which is what the Smart Budget Maximizer algorithm does.

The payments entity guarantees the complete financial security of the system.

This table is a normalisation of the lifecycle of payments to the 10/70/20 model, with

the  specific  parameter  being  payment_type.  This  granularity  guarantees  that  the

external  API  webhook  can  automatically  clear  the  initial  reservation  on  its  own

without  requiring  manual  corporate  bank  verifications.  The  exact  historical  data

required  to  feed  into  the  Simple  Linear  Regression  algorithms  for  the  Admin

Analytics is completely dependent on tracking the due dates and exact statuses of

115

these cleared tranches. Finally, there are a number of operational support tables in

the  schema  that  are  used  to  carefully  manage  customer  relations.  The  direct

communication with the customer is structurally centralized with a dual-table design

of conversations and messages, and the general public updates are managed by the

announcements  table.  The  food_tastings  table  enables  customers  to  schedule  and

track  their  initial  service  appointments  without  any  hassle.  After  the  event,  the

system safely stores post-event data in the feedback_responses table, including the

final  rating scores  and customer feedback, which will help  the management  team

make future quality assurance plans.

3.2.5.  System Algorithms and Analytics Models

This section details the core mathematical and logical frameworks that govern the

Eloquente  Catering  System  (ECS).  To  successfully  transition  the  enterprise  from

manual, intuition-based operations to a highly automated and data-driven environment,

the  architecture  integrates  two  distinct  categories  of  computational  models.  The  first

consists  of  Predictive  Analytics  Algorithms,  which  leverage  historical  datasets  to

strategically  forecast  future  business  performance.  The  second  comprises  Dynamic

Rule-Based  Algorithms,  which  function  as  deterministic  operational  gatekeepers,

strictly enforcing the company’s logistical constraints and financial policies in real time.

116

3.2.5.1 Descriptive Analytics Models

While  predictive  models  forecast  future  trends,  the  descriptive  analytics

engine  is  designed  to  summarize  historical  data  into  highly  visual,  digestible

formats for executive oversight.

A.  Cross-Tabulation Heatmaps for Peak Season Tracking

To  identify  historical  booking  patterns  and  peak  operational  seasons,  the

system  utilizes  a  cross-tabulation  algorithm.  It  aggregates  the  frequency  of

confirmed events and maps them across a two-dimensional matrix, where the X-

axis  represents  the  chronological  months  (𝑀)  and  the  Y-axis  represents  the

specific Event Types (𝐸).

The descriptive model is governed by the following frequency function:

𝑛

𝑓(𝐸, 𝑀) = ∑ 𝐼(𝑒𝑖 = 𝐸 ∧ 𝑚𝑖 = 𝑀

𝑖=1

Where:

o  𝑓(𝐸, 𝑀) = The total count of confirmed bookings for a specific Event Type

(E) during a specific Month (M).

o  𝐼  =  An  indicator  function  that  returns  1  if  the  condition  is  true,  and  0

otherwise.

o  𝑒𝑖 = The event type of the i-th historical booking record.

o  𝑚𝑖 = The month of the i-th historical booking record.

117

o  𝑛 = The total number of historical booking records in the database.

The system loops through the database and systematically groups the records

using  the  indicator  function.  The  resulting  matrix  conditionally  formats  the

background color of each cell based on its calculated numerical value, creating

a  visual  heatmap.  This  allows  the  Admin  to  instantly  identify  which  specific

months yield the highest demand for specific events (e.g., weddings peaking in

December), enabling highly targeted marketing campaigns.

3.2.5.2 Predictive Analytics Algorithms

The  Predictive  Analytics  algorithms  function  as  the  strategic  forecasting

engine  of  the  administrative  backend.  Distinct  from  the  customer-facing

Decision Support feature, these statistical models are strictly executed within the

enterprise  dashboard,  utilizing  historical  operational  data  to  project  future

business performance. By shifting from descriptive to predictive data analysis,

the system empowers the enterprise to make proactive, long-term procurement

and staffing decisions.

A.  Simple Linear Regression for Revenue Forecasting

Simple Linear Regression is utilized to map the historical trajectory of the

company’s  confirmed  revenue  over  time,  allowing  the  system  to  forecast

expected financial inflows for upcoming quarters. This allows management to

confidently project financial growth and allocate future corporate budgets.

118

The predictive model is governed by the following equation:

𝑌 = 𝑎 + 𝑏𝑋

Where:

•  𝑌 = The forecasted dependent variable (Expected Revenue).

•  𝑋 = The independent variable (Time period, measured in months).

•  𝑎 = The Y-intercept (The baseline revenue when X = 0).

•  𝑏  =  The  slope  of  the  regression  line  (The  average  monthly  rate  of

revenue growth or decline).

B.  Moving Averages for Pax Demand Projection

To  ensure  the  logistics  and  culinary  teams  are  adequately  prepared  for

seasonal  fluctuations,  the  system  utilizes  a  Moving  Averages  algorithm  to

forecast short-term guest (pax) demand. By smoothing out historical data points,

it prevents random, one-off booking spikes from skewing the operational supply

chain.

The predictive model is governed by the following equation:

𝑀 𝐴𝑛 =

𝑛
∑ 𝐷𝑖
𝑖=1
𝑛

Where:

•  𝑀 𝐴𝑛 = The forecasted pax demand for the upcoming month.

•  𝐷𝑖 = The actual total pax recorded in historical period i.

•  𝑛 = The defined number of periods in the moving window.

119

3.2.5.3 Dynamic Rule-Based Algorithms

Unlike predictive machine learning models that estimate future probabilities,

Dynamic Rule-Based Algorithms are deterministic. They utilize absolute logical

operators and strict mathematical thresholds to enforce the business policies of

Eloquente  Catering  Services.  These  algorithms  act  as  digital  gatekeepers,

automating the daily operational and financial calculations across the system.

A.  Capacity and Lead Time Constraint Algorithm

This  logistical  algorithm  prevents  systemic  overbooking  and  ensures  the

culinary team has sufficient preparation time. The system evaluates three strict

parameters before allowing a booking transaction to proceed to the database. It

utilizes  logical  AND  ( ∧ )  operators,  meaning  a  single  failure  results  in  an

automatic rejection.

𝐵𝑜𝑜𝑘𝑖𝑛𝑔_𝑉𝑎𝑙𝑖𝑑 = (𝐸𝑑 < 7) ∧ (𝑃𝑛𝑒𝑤 ≤ 3500) ∧ (𝑇𝑙𝑒𝑎𝑑 ≥ 7)

Where:

•  𝐸𝑑 = Total number of approved events currently scheduled on the requested

date 𝑑.

•  𝑃𝑛𝑒𝑤 = Number of guests requested for the new incoming booking.

•  𝑇𝑙𝑒𝑎𝑑 = The lead time, measured in days, between the current date and the

event date.

120

The booking is only permitted IF the date currently has fewer than 7 events,

AND the requested headcount does not exceed the 1,000 maximum pax per event

limit, AND the event is booked at least 7 days in advance.

B.  Smart Budget Maximizer Algorithm

Embedded  within  the  Customer  Portal,  this  Customer  Decision  Support

feature dynamically evaluates the menu catalog and auto-generates a complete

package based on a customer’s specific financial ceiling. It acts as a constraint

satisfaction  algorithm,  ensuring  customers  are  instantly  recommended  a

maximized, ready-to-book menu that they can mathematically afford.

𝑛

(𝐺 × 𝐶𝑝𝑘𝑔) + ∑ 𝐴𝑖

≤ 𝐵

𝑖=1

Where:

•  𝐺 = The customer’s inputted guest count.

•  𝐶𝑝𝑘𝑔 =  The  calculated  base  cost  per  head  of  the  algorithmically  selected

dishes.

•  𝐴𝑖 = The cost of any additional customizations, rentals, or add-ons.

•  𝐵 = The customer’s inputted Target Budget.

The system continuously loops through the database to calculate total costs.

Rather  than  merely  filtering  out  expensive  items,  the  algorithm  automatically

121

constructs  and  presents  a  complete  package,  with  specific  dishes  already

selected,  that  mathematically  maximizes  the  utilization  of  the  customer’s

inputted budget B without exceeding the threshold.

C.  Bespoke Staffing Ratio Algorithm

To  eliminate  human  error  in  manpower  planning,  the  Marketing  and

Logistics  module  utilizes  a  ceiling  function  algorithm  to  compute  the  exact

number of waitstaff required for any given event headcount.

𝑊𝑟𝑒𝑞 = 3 + max (0, ⌈

𝑃𝑡𝑜𝑡𝑎𝑙 − 50
25

⌉

Where:

•  𝑊𝑟𝑒𝑞 = Total waitstaff required for deployment.

•  𝑃𝑡𝑜𝑡𝑎𝑙 = Total expected guest headcount for the event.

•  max (0, 𝑥) = A function ensuring the additional staff count does not drop

below zero for events with 50 or fewer guests.

•

⌈𝑥⌉ = The ceiling function, which rounds any fractional value up to the next

whole integer.

Eloquente Catering  enforces  a baseline ratio of  3 waitstaff for the first  50

guests. For every additional 25 guests (or fraction thereof), the algorithm utilizes

the  ceiling  function  to  securely  add  1  extra  waitstaff.  This  precise  scaling

prevents understaffing while avoiding unnecessary labor costs.

122

D.  Surcharge and Dynamic Pricing Engine

To  guarantee  pricing  transparency  and  protect  operational  margins,  the

system automatically calculates physical site constraints and travel distances into

the final contract price before the initial payment is authorized.

𝐶𝑡𝑜𝑡𝑎𝑙 = 𝐶𝑏𝑎𝑠𝑒 + 𝐹𝑙𝑎𝑏𝑜𝑟 + 𝐹𝑡𝑟𝑎𝑛𝑠 − 𝐷

Where:

•  𝐶𝑡𝑜𝑡𝑎𝑙 = The final algorithmic contract price.

•  𝐶𝑏𝑎𝑠𝑒 = The base cost of the food and primary services.

•  𝐹𝑙𝑎𝑏𝑜𝑟  =  The  dynamic  labor  surcharge  calculated  for  complex  venue

logistics

•  𝐹𝑡𝑟𝑎𝑛𝑠 = The variable transport fee based on travel distance

•  𝐷 = Any applied automated discounts or manual financial overrides.

The system evaluates complex venue logistics to dynamically calculate the

necessary  labor  surcharge  (𝐹𝑙𝑎𝑏𝑜𝑟),  which  is  then  added  to  the  transport  fee

(𝐹𝑡𝑟𝑎𝑛𝑠).  The  final  total  dynamically  adjusts  to  subtract  any  authorized

discounts (𝐷) applied to the booking prior to checkout.

123

E.  10/70/20 Financial Tranche Auditor

To  secure  the  accounting  ledger,  the  system  utilizes  deterministic

mathematics  to  lock  the  booking  statuses  based  on  Eloquente’s  strict  multi-

tranche payment lifecycle.

𝑇𝑟𝑒𝑠 = 0.10 × 𝐶𝑡𝑜𝑡𝑎𝑙

𝑇𝑑𝑜𝑤𝑛 = 0.70 × 𝐶𝑡𝑜𝑡𝑎𝑙

𝑇𝑓𝑖𝑛𝑎𝑙 = 0.20 × 𝐶𝑡𝑜𝑡𝑎𝑙

The  system  automatically  calculates  the  exact  monetary  value  for  the  10

percent  Reservation  (𝑇𝑟𝑒𝑠),  the  70  percent  Downpayment  (𝑇𝑑𝑜𝑤𝑛),  and  the  20

percent Final Balance (𝑇𝑓𝑖𝑛𝑎𝑙). The accounting module will systematically deny

the issuance of a digital receipt until uploaded bank funds equal or exceed these

exact computational thresholds.

3.3.   System Design

The user interface designs of the Eloquente Catering System are as follows. These

interfaces have been carefully designed so that they provide a smooth, user-friendly and

very functional experience to the customers using the system.

124

Figure 29. Eloquente Catering System Log In Page

Figure 29 shows the User Interface Design of the Sign In page. It is the safe gateway

to all the users of the Eloquente Catering System. The interface is designed in a clean

and minimalist manner to reduce cognitive load and has standard input fields where the

username and password are typed. There is a distinct primary button that will perform

the authentication process as well as a secondary link that will give a direct route to new

customers to the registration page. This design will provide a simple access mechanism

to the customers and administrative personnel.

125

Figure 30. Eloquente Catering System Sign Up Page

Figure  30  shows  the  Registration  page  on  which  new  customers  are  allowed  to

create their system accounts. The design is designed in a way that it gathers the necessary

contact  and credential details including the username, email address, mobile number,

and password. The password confirmation field makes sure that the input is accurate and

minimizes the number of errors made by the user during the onboarding process. This

lean shape safely accumulates the required baseline information needed to create a valid

customer profile in the database prior to being able to access the booking engine.

126

Figure 31. Eloquente Catering System Home Page

Figure 31 is a representation of the Landing Page that serves as the online storefront

of the catering business. It is to be able to attract the attention of the potential customers

at a glance with the high-quality visual banners and the large call to action button that

will take the user directly to the booking process. The menu, contact details, and the

customized customer dashboard are easily accessible on the top navigation bar. Besides,

a gallery of the last served events is also strategically placed below to create credibility

and demonstrate the working capacity of the business to the potential customers.

127

Figure 32. Eloquente Catering System Booking (Vision)

Figure 32 represents the first stage of the smart booking engine, where customers

are  prompted  to  classify  their  specific  celebration  into  categories  such  as  Formal

Weddings,  Corporate  Seminars,  or  Private  Parties.  This  categorization  serves  as  a

critical data entry point for the system's Descriptive Analytics module. Each selection

populates  the  Frequency  Distribution  charts  within  the  administrative  dashboard,

providing management with the necessary business intelligence to track market demand

and examine shifting consumer trends over time.

Beyond analytical tracking, the selection of a specific event type serves a functional

role by triggering the system's dynamic filtering logic. By identifying the nature of the

celebration  at  this  early  stage,  the  backend  can  adapt  the  package  offers,  service

recommendations, and menu options presented in subsequent steps. This ensures that a

customer  booking  a  corporate  seminar  is  presented  with  professional,  efficiency-

oriented  meal  sets,  while  a  customer  planning  a  wedding  is  offered  bespoke,  multi-

course packages tailored to formal expectations. This automated adaptation streamlines

128

the user experience and ensures that the provided services remain highly relevant to the

specific needs of the event category.

Figure 33. Eloquente Catering System Booking (Date)

The Figure 33 illustrates the second phase of the smart booking engine, where the

customer  is  prompted to select their preferred  event  date and specific time slot. This

interface  acts  as  the  primary  logical  gateway  for  the  system's  capacity  algorithms,

ensuring that all subsequent booking steps are built upon a valid operational foundation.

Upon selecting a target date, the backend logic immediately evaluates the input against

strict operational requirements, including a mandatory minimum seven-day lead time to

ensure  adequate  preparation.  Simultaneously,  the  system  executes  real-time  queries

against  the  centralized  database  to  cross-reference  current  bookings  and  verify  the

available kitchen capacity for the chosen day. This proactive validation layer effectively

prevents scheduling conflicts and guarantees that the enterprise does not overextend its

logistical resources. Furthermore, the interface includes a persistent "Event Summary"

129

sidebar, which offers the user an instantaneous visual summary of their selections as

they navigate through the multi-step scheduling sequence.

Figure 34. Eloquente Catering System Booking (Guest Headcount)

Figure  34  indicates  where  the  customer  can  specify  the  approximate  number  of

people attending the event as well as any special dietary information. This new layout

features  an  intuitive  stepper  with  preset  quick  select  buttons  for  a  smoother  user

experience,  plus  a  dynamic  "Your  Event  Plan"  sidebar  that  displays  the  booking

information and approximate expenses as they are calculated. Because the availability

and cost of packages are directly proportional to the number of guests, this numerical

input  is  an  important  data  trigger  for  the  system's  Smart  Recommender  and  Budget

Maximizer algorithm. Furthermore, this action integrates the system's Conflict Checker,

which is readily apparent to users, and shows the available space for the selected date

for that particular day, based on the company's hard limit of 3,500 guests per day.

130

Figure 35. Eloquente Catering System Booking (Package Selection)

Figure 35 shows the package selection and menu building  phase of the booking

process, where the customer has three choices for creating a menu for their catering plan:

"Build Around a Budget," "Curated Packages," and "Blank Canvas. The "Build Around

a Budget" option turns on the system's budget maximizer algorithm that automatically

creates a menu that is balanced across all categories based on a user-defined financial

budget, while still enforcing a calculated minimum cost, based on the number of guests

entered  into  the  system.  Users  can  also  pick  from  pre-designed  packages  that  are

organised around events (economy, standard or premium), with flexible pricing based

on "pax" (or people), or opt for the "Blank Canvas" option to manually control all dishes.

Whichever  is  the  first  step,  the  system  is  extremely  flexible,  enabling  customers  to

choose, remove, or alter individual dishes in the following steps. As the user progresses

through  this  process,  the  main  plan  for  the  event  as  well  as  the  estimated  total  is

constantly  shown  on  the  dynamic  sidebar,  keeping  the  user  well-informed  on  their

choices and run costs.

131

Figure 36. Eloquente Catering System Booking (Menu Personalization)

Figure  36  shows  the  fifth  step  of  the  booking  progression  which  is  the  menu

personalization  interface.  This  screen  will  give  the  customer  a  catalogue  with  nice

categories, in which they can choose a specific dish from each category for their event,

and the items are grouped in logical tabs like starters, mains and dessert. One of the key

features of this module is the ability to track the packages' inclusions dynamically, as it

visually  shows  which  is  the  package's  base  for  each  category  and  automatically

calculates  any  additional  fee  per  guest  if  the  customer  chooses  to  go  over  the  base

package. These incremental costs get multiplied by the previously determined headcount

and the exact impact of each add-on on the finances immediately show up. The interface

also  includes  search,  filtering,  and  sorting  functions  to  facilitate  catalog  navigation,

further improving usability. At the same time, the persistent side menu updates in real-

time, with the selected dishes presented into groups by category, and a running total of

the  overall  cost  alongside  the  average  cost  per  guest,  offering  complete  financial

transparency through the customisation process.

132

Figure 37. Eloquente Catering System Booking (Contant & Venue Logistics)

Figure 37 illustrates the sixth phase of the booking process, and it is shown in the

logistics  configuration  interface.  This  aims  to  collate  key  client  contact  details  in  a

structured  fashion  alongside  accurate  venue  coordinates,  preparing  for  ready  to  go

operations.  The  "High-rise  venue"  toggle,  which  asks  the  user  to  specify  logistical

restrictions  like  basement  access,  high  floors  or  areas  where  lots  of  manual

transportation is needed, is a key functional component of this form. By choosing this

parameter, the system's pricing logic is triggered automatically, which results in making

the  quotation  more  accurate  with  respect  to  the  extra  carrying  and  setup  costs,  thus

ensuring full financial transparency. In addition, the interface shows the current statuses

of the location fees on the left panel and keeps the sidebar "Your Event Plan" up to date

with the details so the customer has a complete real-time picture of everything that has

been accumulated so far and the final estimated fee before submission.

133

Figure 38. Eloquente Catering System Booking (Food Tasting)

Figure 38 interface offers a quality assurance measure that is optional and allows

the customers to book a Food Tasting Session specifically to the dishes that were chosen

during the earlier menu customization stage. This will enable the customers to check the

quality and taste profile of their preferred menu prior to the actual date of the event, so

that  they  will  be  completely  satisfied  with  the  food  they  have  chosen.  The  system

Conflict Checker is coupled with the scheduler to make sure that the tasting dates do not

conflict  with  the  fully  booked  event  dates  or  the  already  made  tasting  appointments,

which will keep the logistical balance of the Eloquente kitchen staff.

134

Figure 39. Eloquente Catering System Customer Dashboard

Figure 39 illustrates the customer dashboard, which is the central hub where users

can  easily  track  and  control  their  bookings  after  checkout.  The  interface  has  a  well-

organized  sidebar  navigation  system  that  divides  the  account  management  into  four

sections: Event Details, Menu, Payments, and History. The "Event Details" tab is the

main view that contains the Live Event Tracker which polls the database in real-time to

display the event's operational status, sequentially and transparently, and secure forms

for event booking cancellation and modification. The "Menu" tab enables customers to

view their final food choices and dietary needs. The "Payments" tab guarantees financial

transparency and allows users to see what they have paid, what is left to be paid, and to

process further payments directly from the system. Lastly, the "History" tab provides a

detailed record of all events and reservation milestones that have occurred in the past.

The system brings all these tracking and management tools together in a single intuitive

view, which cuts down on administrative follow-ups and keeps customers up to date on

the lifecycle and financial status of their event.

135

Figure 40. Eloquente Catering System Payment Gateway Interface (PayMongo)

Figure  40  displays  the  secure,  third-party  payment  gateway  interface,  which  is

powered  by  the  PayMongo  API  and  enables  the  system's  live  financial  transactions.

After the internal checkout process, the application automatically redirects the user to

this  external  environment  to  make  their  chosen  financial  commitment,  e.g.  a  10%

reservation  down  payment.  The  interface  provides  a  clear  breakdown  of  billing,

associating  a  dynamically  generated  amount  due  to  a  unique  transaction  reference

number generated by the system,  which ensures accurate accounting and auditability.

The  system  also  ensures  the  safe  processing  of  financial  information  without  storing

sensitive data like credit card numbers or e-wallet credentials locally, thanks to the use

of  a  certified  payment  processor.  Moreover,  this  integration  provides  clients  with

flexible cashless payment options such as leading credit/debit cards and popular regional

e-wallets, ensuring a smooth and secure payment process for them to confirm their event

booking.

136

Figure 41. Eloquente Catering System Customer Profile Page

Figure 41 shows the customer profile management interface to centralize and keep

essential user information. In this module, clients can easily update their personal details,

main contact  numbers,  and default addresses, and the system  will automatically save

them  for  quicker  booking  and  checkout  processes  in  the  future.  One  of  the  most

important features within this screen is the “Account Checklist” on the right hand side.

This readiness indicator helps users navigate key account setup steps, including adding

a  profile  picture,  filling  in  personal  information,  setting  planning  preferences,  and

confirming their email address, to ensure their account is optimized for the automated

capabilities of the system. Moreover, there is a dedicated profile picture management

section  on  the  interface,  which  allows  users  to  customize  their  account  and  sync  the

selected avatar across the application's navigation elements.

137

Figure 42. Eloquente Catering System Marketing Dashboard (To-Do)

Figure 42 shows the Marketing dashboard, designed to be the “home base” for the

marketing and sales team on a daily basis. A dynamic "To-Dos" module is the core part

of the interface, which automatically sorts and prioritizes the daily workload according

to  the  urgency  level  defined  by  the  system.  It  sorts  out  administrative  tasks  that  are

pending  into  actionable  buckets  like  urgent  customer  detail  clarifications,  submitted

bookings pending ownership review, and guest queries that have not been resolved, and

reduces manual task sorting, thus minimizing processing bottlenecks. On top of the task

list, there is a real-time metrics banner that combines relevant operational metrics such

as number of upcoming events, total financial pipeline, and more, providing staff with

the context they need on the job. In addition, there's role-specific navigation on the side

bar  for  marketing  operations,  and  a  search  bar  and  notification  center  for  the  entire

organisation,  so  that  staff  can  easily  handle  customer  relations,  check  calendar

availability and optimise the entire booking pipeline.

138

Figure 43. Eloquente Catering System Marketing Booking Management and

Qeueue

Figure 43 illustrates the bookings management interface for marketers designed to

make  the  reservation  process  easier  and  tasks  more  manageable.  The  module  uses  a

structured  queue  architecture,  which  breaks  down  the  events  into  the  following

categories:  actionable  tabs  like  "Booking  Queue",  "Owned"  (My  Bookings),  and

blocked  tasks  (Waiting  on  Customer),  ensuring  clear  operational  accountability  and

avoiding task overlaps. Individual booking cards are detailed summarization units that

will capture and present key logistical and financial parameters in addition to the real-

time  operational  progress  tracker.  The  interface  provides  contextual  quick-action

controls for staff, enabling them to claim unassigned reservations, release ownership,

request additional information, and send automated follow-up reminder messages to the

client  instantly,  to  speed  up  customer  relations  and  pipeline  movement.  With  strong

search and filtering capabilities, the marketing team can easily track and move along the

entire reservation pipeline from one workspace.

139

Figure 44. Eloquente Catering System Marketing Food Tasting Queue

Figure 44 illustrates the food tastings management interface, which is a dedicated

module  in  the  marketing  workspace,  used  to  manage  a  crucial  step  in  the  pre-event

customer experience. The interface is designed with a clear and organized queue system

to collect and monitor all food tasting requests, providing critical client contact details,

preferred  tasting  times,  and  event  notes  to  be  read  easily.  The  module  also  includes

explicit  ownership  of  tasks  to  ensure  operational  accountability  and  to  facilitate

delegating tasks, with marketing staff able to claim tasks that have not been assigned to

them,  or  request  that  tasks  be  transferred  to  them.  In  addition,  the  interface  provides

dynamic status controls, allowing employees to mark the progress of each tasting as it

moves through the pipeline from pending to completed or cancelled, and powerful multi-

parameter filtering and sorting tools to help schedule and manage tasting pipelines.

140

Figure 45. Eloquente Catering System Marketing Messaging Interface

Figure  45  shows  the  centralized  messages  module  in  the  marketing  dashboard,

designed to streamline communication with clients and expedite problem-solving. The

interface also  uses  a triage system  to  automatically  sort incoming customer enquiries

into the "Unassigned" and "My Chats" queues, ensuring staff accountability and quick

response. One of the unique capabilities of this communication platform is the ability to

dynamically  display  structured  booking  information  in  the  conversation  thread.  The

integration allows marketing staff to access key event characteristics, like the type of

event, date, number of guests and current financial situation, in real time and in context,

without having to switch between modules. Moreover, the chat workspace features a set

of quick-action buttons at the top right, enabling staff to quickly open up the expanded

profile of a customer, transfer or escalate threads to other team members, and formally

close conversations, ensuring a context-driven, efficient customer support process.

141

Figure 46. Eloquente Catering System Marketing Event Calendar

Figure 46 shows the calendar tab that is part of the Marketing dashboard and that

shows a complete visual representation of the company's reservations. This centralised

interface  combines  all  bookings  into  a  dynamic  monthly  calendar  grid,  with  the

important  logistical  information  (event  type,  time  frame,  client  name,  guest  number)

directly visible on each calendar block for easy scanning. The module also comes with

a comprehensive set of filters, so that users can quickly filter the calendar by booking

status,  event  type  or  venue  location  to  enable  granular  operational  planning  and

monitoring. One of the standout capabilities of this interface is the ability to create and

export  structured  schedule  reports  for  offline  coordination  and  team  briefings,  the

"Download  PDF"  function.  The  system  also  integrates  with  the  persistent  real-time

metrics  banner  at  the  top,  allowing  the  marketing  team  to  easily  monitor  the  daily

operational  capacity,  look  for  any  possible  scheduling  conflicts,  and  plan  for  future

workloads.

142

Figure 47. Eloquente Catering System Marketing Public Content Management

Figure 47 shows the public content management section, the central administration

control  panel  for  the  application's  customer  facing  booking  catalog,  shown  in  the

Marketing  dashboard.  This  interface,  specifically  pointing  to  the  "Packages"

configuration tab, allows marketing to dynamically build, edit and manage the packages

that  are  dynamically  fed  into  the  client-side  booking  engine.  The  module  uses  a

structured data grid to help manage key package parameters such as dynamic per-head

pricing,  minimum  number  of  guests,  descriptive  marketing  copy  and  the  explicit

categorization of packages to particular event types (e.g., weddings, corporate seminars,

casual birthdays). This is important backend data mapping because it is the rule set that

defines the front-end algorithms and is the basis for determining which tiers to show

clients  based  on  the  event  criteria  they  had  entered.  Plus,  the  interface  includes  a

"Preview as customer" tool that helps you ensure the accuracy and logical flow of the

catalog before it goes live, by enabling staff to view it as a customer would.

143

Figure 48. Eloquente Catering System Marketing Calendar Availability Control

Figure  48,  The  availability  management  interface  is  part  of  the  Marketing

dashboard,  which  is  the  central  administration  interface  for  the  system's  scheduling

logic. This module allows for authorized users to have granular, manual control over the

company's day to day capacity, as a critical override to the default 3,500-guest automated

limit. Staff can use a structured date-selection tool to narrow down the date selection to

specific calendar days and then use the "Stop bookings for this date" parameter to cause

an immediate system-wide blackout. Moreover, the interface allows manual adjustments

of  the  remaining  guest  capacities  to  anticipate  and  plan  for  unexpected  logistical

challenges, such as staffing deficits or special VIP bookings. To ensure transparency in

administration  and  to  keep  an  audit  trail,  any  manual  capacity  changes  require  a

justification to be entered, and this is automatically recorded and shown in the dedicated

"Date Changes" panel on the right. Importantly, all configurations set in this module are

directly  and  instantly  replicated  to  the  front-end  Conflict  Checker,  meaning  that  the

customer facing booking engine will always operate within the real-time boundaries.

144

Figure 49. Eloquente Catering System Accounting Dashboard

Figure  49  introduces  the  accounting  dashboard,  designed  to  be  a  financial

operations  hub  for  the  catering  system.  This  interface  is  similar  to  the  workflow

optimization architecture in the Marketing module, and uses an automated task-triage

system  to  systematically  sort  through  pending  financial  actions  and  assign  them  to

priority buckets. The "To-Dos" module actively  identifies items that need to be done

such  as  overdue  balances  to  follow  up  on,  outstanding  payment  issues,  and  other

administrative  tasks  that  need  to  be  done  such  as  checking  customer  payments  and

processing  refunds.  This  queue  is  prioritized,  allowing  accounting  staff  to  quickly

resolve important accounting issues before reconciling regular ledgers. In addition to the

task list, there is a real-time metrics banner at the top of the workspace that dynamically

pulls  in  the  total  number  of  pending  reviews,  overdue  accounts,  and  active  booking

issues to give the finance team a macro-level view of the company's day-to-day financial

health.

145

Figure 50. Eloquente Catering System Accounting Payments Queue

Figure 50 shows the payments workspace in the accounting section, which is the

central  ledger  for  tracking,  verifying  and  monitoring  all  financial  transactions  with

clients. The interface features a dynamic tab architecture that sorts incoming payment

records into actionable queues like "Needs verification," "Overdue," and "Exceptions,"

to handle the massive volume of incoming payment records. This segmentation allows

finance  staff  to  focus  on  the  most  important  accounts  that  need  to  be  acted  on

administratively. The primary data grid is designed to show a comprehensive view of

each  transaction,  by  combining  logistical  information  (event  date,  number  of  guests,

etc.)  with  key  financial  data  (total  billed,  current  amount  paid,  etc.).  One  of  the  key

control aspects of this module is the explicit tracking of verification statuses (e.g., “0/2

verified”), which helps to ensure that financial auditing is done properly and that revenue

is recognized before an event is complete. In addition, the ability to have powerful search

capabilities,  date-based  sorting  options,  and  direct  "Open"  action  buttons  allow  the

146

accounting  team  to  easily  navigate  the  ledger  and  address  complicated  payment

processing problems from one, consolidated dashboard.

Figure 51. Eloquente Catering System Financial Reconciliation Workspace

Figure 51 illustrates the Financial Reconciliation interface within the Accounting

dashboard, engineered as a specialized diagnostic tool to proactively identify and resolve

transaction discrepancies. This module systematically audits the data alignment between

internal system records and the external payment gateway, displaying unique checkout

and payment reference numbers  for transparent  tracking.  The primary data grid flags

specific  transactional  anomalies  under  the  dedicated  "Issue"  column,  categorizing

exceptions  such  as  abandoned  transactions  ("Customer  started  checkout  but  did  not

pay") alongside data synchronization conflicts ("Online payment details do not match").

To expedite financial recovery and maintain strict ledger accuracy, the interface equips

accounting  personnel  with  context-aware  "Next  Action"  controls.  These  dynamic

buttons  allow  staff  to  seamlessly  execute  resolutions—such  as  instantly  dispatching

automated payment reminders for pending accounts or initiating a direct, manual review

147

of  the  ledger  to  rectify  complex  data  mismatches—thereby  ensuring  continuous

financial integrity across the system.

Figure 52. Eloquente Catering System Accounting Refund Review and Processing

Figure 52 illustrates the refunds management tab within the accounting dashboard,

engineered to systematically oversee and execute financial returns arising from booking

cancellations.  To  streamline  the  administrative  workflow  and  prevent  operational

bottlenecks,  the  interface  employs  a  categorized  queue  system,  separating  cases  into

specific  tabs  such  as  "Needs  review,"  "Provider  refund,"  and  "Manual  handling."  A

defining technical feature of this module is its automated penalty calculation logic; upon

a cancellation trigger, the system dynamically computes the eligible return by deducting

a  standard  10%  processing  fee  from  the  originally  paid  balance.  This  automated

calculation  is  explicitly  visualized  within  the  data  grid,  which  juxtaposes  the

strikethrough  original  payment  against  the  final  calculated  refund  amount,  thereby

enforcing strict financial transparency and auditability. Furthermore, the interface equips

authorized accounting personnel with direct "Process Refund" action controls, enabling

148

them to efficiently approve the computation and initiate the final transaction seamlessly

from a consolidated view.

Figure 53. Eloquente Catering System Accounting Financial Ledger

Figure  53  illustrates  the  Ledger  &  Receipts  module  within  the  Accounting

dashboard, functioning as the master financial archive for all processed and historical

transactions.  To  facilitate  comprehensive  auditing  and  precise  record  retrieval,  the

interface features a robust, multi-parameter filtering engine across the top panel. This

allows finance personnel to query the database using granular criteria, including client

name, package type, specific payment methods, verification statuses, and custom date

ranges.  Below  the  search  parameters,  financial  data  is  systematically  organized  into

client-specific  ledger  cards  that  display  essential  identifiers  such  as  the  booking

reference  and  chronological  event  date.  Each  entry  clearly  delineates  the  specific

payment tranche—such  as a standard  reservation fee or final  payment—alongside its

149

exact monetary value, due date, and verified status. A critical functional component of

this interface is the dedicated "Receipt" action control, which empowers the accounting

team to instantly retrieve and generate formal proof-of-transaction documents for client

distribution, operational transparency, and strict record-keeping compliance.

Figure 54. Eloquente Catering System Administrative Command Center

Figure 54 presents the Administrative command center, engineered to serve as the

primary  executive  dashboard  and  central  governance  hub  for  the  entire  application.

Unlike  department-specific  modules,

this

top-level

interface  equips  system

administrators  and  business  management  with  macro-level  oversight  across  all

operational and financial dimensions. The workspace is anchored by a comprehensive,

real-time Key Performance Indicator (KPI) matrix that dynamically aggregates critical

business  metrics—including  total  gross  revenue,  pending  collection  rates,  active

booking volumes, and system-wide guest capacities. To streamline executive workflow,

150

the interface features an automated triage queue designated for high-level operational

exceptions,  such  as  booking  oversights  that  require  explicit  managerial  review  and

decision-making.  A  sophisticated  functional  component  of  this  dashboard  is  the

integrated  "Decision  Support"  module,  which  leverages  system  data  to  identify  and

broadcast strong operational trends (e.g., forecasting the demand for "Standard Event

Packages") to guide data-driven strategic planning. Furthermore, the global navigation

header provides  administrators with  instant  role-switching capabilities, granting them

frictionless,  overriding  access

to

the  Customer,  Marketing,  and  Accounting

environments  to  ensure  complete  system  administration,  auditing,  and  security

compliance.

Figure 55. Eloquente Catering System Admin Accounts Management

Figure 55 illustrates the accounts management module within the Administrative

dashboard, functioning  as the centralized governance hub for system  access  and user

identity management. The interface employs a dual-tab architecture to distinctly separate

internal  "Staff"  directories  from  external  "Customers,"  ensuring  streamlined

151

administrative  navigation  and  oversight.  The  primary  data  grid  provides  granular

visibility into personnel credentials, explicitly mapping each user to specific operational

roles—such as Admin, Marketing, or Accounting—thereby enforcing strict Role-Based

Access Control (RBAC) across the application. A critical security feature of this module

is its proactive credential monitoring; the system actively flags user accounts that require

mandatory  authentication  updates  under  the  "Password  change  needed"  status,

mitigating  potential  vulnerability  risks.  Supported  by  a  real-time  metrics  banner  that

aggregates  active  personnel,  deactivated  staff,  and  system-wide  security  alerts,

alongside robust provisioning controls like the "Add staff account" utility and individual

action menus, this interface empowers administrators to efficiently provision, audit, and

revoke system access while maintaining rigorous security compliance.

Figure 56. Eloquqnte Catering System Admin Analytics (Overview)

Figure  56  presents  the  Analytics  Overview  module  within  the  Administrative

dashboard, engineered as the frontline interface of the system's Decision Support System

(DSS).  Rather  than  overwhelming  executives  with  raw  datasets,  this  specific  view

152

focuses  on  immediate  strategic  intelligence  through  its  automated  "Current  Read"

diagnostic  engine.  This  section  actively  scans  system-wide  metrics  to  surface  high-

priority  business  vulnerabilities,  such  as  overdue  collection  risks,  delayed  payment

completions,  or  operational  booking  blockers,  requiring  executive  attention.  To

streamline  managerial

intervention,

the  module  employs  a  structured

insight

architecture: it identifies a critical "Finding," provides the underlying data "Signal" that

triggered  the  alert,  and  proactively  recommends  a  targeted  "Next  Move."  By

synthesizing complex operational constraints into these digestible, context-aware action

steps,  the  Overview  interface  empowers  administrators  to  execute  swift,  data-driven

governance before engaging with deeper predictive modeling and descriptive reporting.

Figure 57. Eloquqnte Catering System Admin Analytics (Core Analytics)

Figure 57 details the Core Analytics module within the Administrative Decision

Support  System,  engineered  to  equip  business  management  with  robust  predictive

forecasting capabilities. This interface leverages two distinct quantitative methodologies

to  project  future  business  performance.  The  first  component  utilizes  a  Simple  Linear

153

Regression  (SLR)  model  to  forecast  financial  trajectories,  plotting  historical  verified

revenue  against  a  multi-month  projection  line  to  help  administrators  anticipate

overarching growth trends and future liquidity. Complementing this financial forecast is

an operational capacity model powered by a Simple Moving Average (SMA) algorithm.

This tool analyzes fluctuating historical guest attendance to predict upcoming baseline

"pax"  demand,  visualizing  the  data  through  an  intuitive  bar  chart  that  clearly

distinguishes  actual  historical  guest  counts  from  predicted  future  volumes.  Crucially,

both predictive models are integrated directly with the system's automated diagnostic

engine.  Below  each  chart,  the  interface  synthesizes  the  raw  statistical  outputs  and

translates them into actionable operational directives, such as advising administrators to

align raw ingredient inventories and supplier commitments with the newly forecasted

SMA guest baseline, thereby ensuring that executive strategic planning is consistently

grounded in concrete statistical evidence.

Figure 58. Eloquqnte Catering System Admin Analytics (Supporting Charts)

154

Figure  58  illustrates  the  Supporting  Charts  module  within  the  Administrative

Analytics  dashboard,  functioning  as  the  descriptive  reporting  tier  of  the  system's

Decision Support System. This interface utilizes a multi-panel architecture to categorize

historical  and  current  business  data  into  distinct,  highly  readable  visual  reports.  The

"Revenue trend" panel maps verified collections against a calculated average to establish

baseline  financial  performance  over  customizable  timeframes.  Adjacent  to  this,  the

"Payment breakdown" chart quantifies financial exposure by segmenting  transactions

into specific statuses like verified, pending, and refunded. Finally, the "Booking status

overview"  visualizes  operational  throughput  by  tracking  the  volume  of  reservations

across  their  various  lifecycle  stages.  Crucially,  this  descriptive  view  maintains  the

proactive  diagnostic  framework  established  in  the  core  analytics  tabs.  Each  chart  is

anchored  by  localized,  automated  insights  that  interpret  the  visual  data  to  surface

specific findings,  underlying signals,  and recommended next  moves. This integration

ensures  that  even  historical  and  descriptive  reporting  actively  guides  administrative

intervention and continuous operational optimization.

3.4.   System Architecture

155

Figure 59. Physical Three-Tier Customer/Server Architecture Diagram

Figure 59 shows the Physical Three-Tier Customer/Server Architecture Diagram of

the ECS. The Presentation Tier is established as a Thin Client architecture, aligning with

modern  web  application  standards.  This  layer  is  fully  compatible  with  standard  web

browsers on both Customer and Admin devices, eliminating the need for local software

installation.  Its  primary  responsibilities  are  capturing  inputs,  performing  basic  data

sanitization (such as restricting text in phone number fields), and rendering the Graphical

User Interface (GUI). The system intentionally maintains this layer as thin to prevent

malicious  users  from  exploiting  local  browser  code  to  manipulate  complex  pricing

calculations and capacity validations.

The Application Tier serves as the authoritative middleware and strictly isolates all

proprietary business rules. All external communication is routed through the Network

Layer  (Wide  Area  Network)  using  secure,  encrypted  HTTPS  connections  and  is

processed by the server as JSON (JavaScript Object Notation) payloads. At this level,

the  server  executes  the  Booking  Conflict  Checker  to  prevent  double-booking,  the

Dynamic  Pricing  Engine  to  perform  real-time  contract  computations,  and  the  RBAC

Security  Manager  to  authenticate  user  session  tokens.  Processing  both  the  Sales

156

Analytics and the Customer Decision Support System (DSS) on this dedicated processor

ensures  that  heavy  algorithmic  computations,  such  as  linear  regression  and  budget

maximization, are executed rapidly without overloading the local devices of the users.

The Data Tier functions as the base persistence layer, which is completely isolated

from  the  outside  world.  It  interacts  exclusively  with  the  Application  Tier  through

backend Structured Query Language (SQL) queries over a secure Local Area Network

(LAN) or Virtual Private Cloud (VPC). This Relational Database Management System

(RDBMS)  supports  the  normalized  schema  established  in  the  Entity-Relationship

Diagram. It securely stores both static master data, such as menu catalogs, and dynamic

transactional  data,  including  payment  proofs,  audit  logs,  and  operational  events,

maintaining absolute referential integrity.

3.4.1.  Business Process Model and Notation (BPMN)

The  next  BPMN  model  standardizes  the  end-to-end  operational  lifecycle  of  a

catering booking. With the help of horizontal swimlanes, the diagram clearly follows

the  responsibility  flow  when  it  is  transferred  between  human  actors  and  the  backend

ECS algorithms. It represents the whole business process starting with the first customer

request, through the algorithmic conflict checking and financial auditing stages, to the

final production of Decision Support System (DSS) analytics.

157

Figure 60. ECS Business Process Model and Notation

Figure 60 illustrates  The Business  Process  Modeling Notation (BPMN) diagram

which defines the ultimate, actual flow of the Eloquente Catering System. The diagram

breaks  down  the  tasks  into  three  horizontal  swimlanes  to  visualize  the  collaborative

hand-offs  necessary  to  process  a  catering  contract  successfully  through  initiation  to

analytical  closure.  The  business  process  starts  in  the  Lane  of  Customer  where  the

customer  provides  his  or  her  initial  event  requirements.  The  system  checks  the  daily

158

limits; in case the constraints are violated, it puts the customer into an adjusting loop.

The customer thereupon validates the information and makes their first 10% payment,

which the system automatically validates through an API webhook. After a successful

payment verification, the operational payload is sent down to the Marketing Lane. The

executive acts as a logistical gatekeeper, and it is the one that reviews the algorithmic

constraints  manually.  In  case  the  site  logistics  cannot  be  physically  achieved,  the

executive will start a cross-lane renegotiation loop with the customer. More importantly,

this takes  the  customer to the start  of the flow so that the system  mathematically re-

validates the renegotiated pax and date. When the system is finally approved, it becomes

operational again to officially lock the calendar dates and send the digital contract. When

the event date is near, the process is reversed to the Customer to post his/her 70 and 20

percent corporate bank transfers. These payloads are dropped into the accounting lane.

The accounting personnel manually audits the transfers to ensure that there is financial

security.  False  proofs  will  cause  a  rejection  cycle,  and  the  customer  will  have  to  re-

upload new proofs to undergo secondary auditing. Authenticated  evidence causes the

system to match the master ledger and provide an official digital e-receipt. Lastly, the

customer goes to the catered event and provides feedback.

3.5.   Data Gathering (Sources of Data)

Data  gathering  will  be  essential  for  the  improvement  of  Eloquente  Catering

Services as it facilitates a shift from an "intuition-oriented" management style to a "data-

driven" operational paradigm. The current manual system, which relies on fragmented

logbooks  and  unorganized  messaging  threads,  creates  a  "strategic  gap"  where

transactional history is lost. By systematically gathering data, the research can identify

159

and address the root causes of inefficiency such as human error, procedural bottlenecks,

and  technological  gaps  that  were  highlighted  in  the  study's  fishbone  analysis.  This

transition  is  necessary  to  ensure  the  company  can  scale  its  operations  and  maintain

accuracy during peak event seasons

The  study  utilizes  a  quantitative  approach  through  purposive  sampling.  This

methodology is important because it allows us to target specific "key informants" who

possess direct engagement with the catering workflow. This targeted approach ensures

that the resulting system is not just a generic tool but is instead tailored to the complex,

time-based environment and professional requirements of Eloquente's staff and owners.

Furthermore,  this  methodology  supports  the  iterative  agile  scrum  framework  by

providing the necessary user requirements and feedback to refine the system during each

development sprint.

The researchers conducted other data gathering methods such as researching the

internet  on  related  literature  that  can  be  relevant  to  our  study.  Additionally,  we  also

conducted a formal institutional interview with Eloquente’s primary stakeholders. These

direct engagements allowed the team to map the catering lifecycle and define strict rule-

based  algorithms,  such  as  the  10-event  and  3,500-pax  daily  operational  limits.  The

researchers also gathered data for the study through related literature in order to further

back up and validate whether features such as the use of decision support system would

be appropriate for Eloquente’s needs. Lastly, the researchers will be conducting a survey

for software evaluation to external and internal users to further help analyze which part

of the system would need improvement or optimization.

160

3.6.   Project Development (Development Model)

Figure 61. Scrum Process Diagram

Figure  61  shows  the  scrum  methodology  framework  of  the  ECS  of  Eloquente

Catering  Services.  Scrum  focuses  on  transparency,  flexibility  and  adaptability  all

through the software development life cycle. This iterative model is the main option that

the  researchers  will  use  to  make  the  system  successful  and  prosperous,  especially  in

handling  the  complicated  business  logic  like  the  staffing  ratio  formulae,  multi-stage

payment terms and the dynamic conflict checker.

Scrum methodology framework consists of the following elements:

Product  Backlog:  It  is  a  prioritized  list  of  all  the  system  functional  and  non-

functional requirements. In the case of the Eloquente system, this is comprised of high-

level features like the Customer Portal, Sales Analytics Dashboard, Built-In Payment

Gateways, and the Automated Kitchen Prep Lists.

161

Sprint Planning: Each cycle begins with the development team picking out certain

User Stories in the backlog that they are supposed to finish within a specific time. In the

first  30  percent  milestone,  the  planning  was  done  on  User  Registration  and

Authentication system with RBAC.

Sprint Backlog: This is the list of the tasks that are necessary to accomplish the

features that have been chosen in the planning phase. To continue the development, this

involves the design of the Login Interface, creation of the User Database Schema, and

development of Role-Specific Dashboard Shells of Admin, Operations, and Customer

users.

Sprint (1-2 Weeks): This is the real development stage during which the team is

involved  in  the  iterative  process  of  coding  and  internal  testing.  In  this  phase,  the

proponents come up with practical increments of the web-based application, including

the Budget-Based Filter and the Real-Time Price Calculation logic.

Daily Scrum: A short meeting held daily during which the proponents coordinate

the activities and deliberate on the technical progress. This plays a vital role in ensuring

the Agile Development Lifecycle of the project is upheld whereby any blockers in the

integration of payment APIs or analytics engines are fixed as soon as possible.

Product  Increment  /  Finished  Product:  The  end  of  the  sprint  is  a  functional

increment of the system that is created to be evaluated. In the case of the present stage

of  development,  this  increment  includes  the  Authenticated  Customer  Portal  and  the

Management Side dashboards with the initial sales indicators.

162

Sprint Retrospective: The team uses the review of the completed sprint to enhance

technical efficiency in the next sprint. This step will make sure that the system is always

compliant with the ISO 25010 software quality requirements of reliability and security.

3.7.    Software Testing (Test Levels)

Software testing  is  the procedure of evaluating  and verifying  that a software

application works as expected, is free from critical bugs, and satisfies the specified

quality criteria before the software is delivered to the end users. Software testing is

a  basic  element  of  the  system  development  life  cycle  as  it  confirms  that  all  the

modules  of  the  system  work  as  expected  under  expected  conditions  and  that  the

overall  system  is  trustworthy,  secure,  and  functional.  In  the  case  of  the  ECS  of

Eloquente Catering Services, the research team uses two levels of testing, namely

alpha testing and beta testing.

3.7.1. Alpha Testing

Alpha testing is the initial level of software testing that is carried out internally

by  the  development  team  before  the  system  is  deployed  for  use  by  external

individuals. This type of testing is done in a controlled setting where the researchers

themselves are the ones who act as the test subjects, testing the system as if they

were the actual users of the system. The main aim of alpha testing is to eliminate

functional problems and usability issues at the early stages of development.

For the  ECS, alpha testing will be conducted by the members of the  research

team for all the identified roles of the users. The testing will be done for each role

163

separately  to  ensure  that  the  Role-Based  Access  Control  system  is  functioning

properly to deny or allow access to the system based on the permissions of each user.

The team will run test scenarios for all the major modules of the system, such as user

registration and login, the booking  calendar with the Conflict  Checker algorithm,

package customization and real-time pricing system, online payment submission and

validation, sales analytics dashboard, and automated document creation.

The test scripts will be designed by the researchers based on the functional and

non-requirements gathered during the requirement gathering phase. Each test case

will record the test input, expected output, actual output, and pass or fail result. The

defects or inconsistencies found during alpha testing will be recorded, prioritized,

and addressed by the development team before the system moves to beta testing. The

internal  validation  phase  of  the  system  ensures  that  the  system  is  stable  and

functional enough to be shown to the end users.

3.7.2. Beta Testing

Beta testing is done by actual users of the system once it has been tested and

succeeded with the alpha testing process. Unlike alpha testing, which is conducted

internally  by  developers,  beta  testing  is  performed  by  the  actual  end-users  of  the

system  who  are  the  real  users  of  the  system  and  get  to  test  it  in  real  operating

conditions.  The  primary  goal  of  beta  testing  is  to  receive  actual  user  comments

regarding  the  functionality  of  the  system,  usability,  reliability,  and  general  user

experience and find out any bugs that might have been overlooked in internal testing.

164

In case of the ECS, the beta testing procedure will be conducted in three groups

of respondents. The internal employees of Eloquente Catering Services consisting of

the Owners (CEO and COO), Marketing Executives, and Accounting Staff making

the Personnel Group will test the system in their respective areas of operation. The

Customer  Group,  divided  into  the  categories  of  the  Beginner,  Intermediate,  and

Advanced customer groups based upon their experience with the system as relates

to their catering booking experience, will test the system in the eyes of the external

users who will engage with the Booking Portal. The IT Expert Respondents, which

will  include  software  developers  or  engineers  and  a  database  administrator,  will

evaluate the system in a purely technical perspective. Each of the respondents will

be  taken  around  the  system  and  given  the  opportunity  to  perform  tasks  that  are

pertinent  to  their  respective  position  i.e.  planning  an  event,  creating  a  catering

package, validating a payment, and accessing the sales analytics dashboard.

The  respondents  will  also  be  requested  to  complete  a  structured  evaluation

survey based on the ISO 25010 software quality model after the beta testing sessions.

The survey will examine the system on significant quality attributes which have been

identified  in  the  study:  functional  suitability,  reliability,  performance  efficiency,

usability,  and  security.  Feedback  and  evaluation  scores  obtained  during  the  beta

testing will be used in assessing the system in accordance with the required quality

standards. Any bugs or usability concerns that may arise in the process of beta testing

will be fixed by improving on the system before the actual deployment of the system

in the Eloquente Catering Services.

3.8.    Software Evaluation Model

165

The researchers have chosen to implement the ISO 25010 Software Quality Model

as  the  primary  framework  for  assessing  the  proposed  system.  This  model  examines

several  critical  quality  characteristics,  including  functional  suitability  to  ensure  the

system  performs  its  intended  catering  and  analytics  tasks,  reliability  to  maintain

consistent performance during peak booking periods, and security to protect sensitive

financial  and  personal  data.  It  also  evaluates  usability,  performance  efficiency,

compatibility, maintainability, and portability to provide a holistic view of the software's

technical  health.  By  utilizing  this  model,  the  researchers  will  be  able  to  identify  the

technical strengths and potential weaknesses of the system, specifically regarding how

well the "conflict checker" and "sales analytics" modules meet operational requirements.

The ISO 25010 model offers a standardized, professional benchmark that validates the

system's readiness for real-world deployment, ensuring it provides a stable and secure

digital platform for both Eloquente Catering Services and its customers.

5-Point Likert Scale

A  5-point  Likert  scale  was  utilized  to  evaluate  the  degree  of  agreement  or

disagreement of the respondents with the statements presented in the system evaluation

questionnaire.  This  scale  provides  five  response  options  that  allow  respondents  to

express  varying  levels  of  perception  toward  the  Eloquente  Catering  System,  ranging

from strong disagreement to strong agreement. Unlike a forced-choice scale, the 5-point

Likert  scale  includes  a  neutral  option,  allowing  respondents  who  are  uncertain,

undecided,  or  have  no  strong  positive  or  negative  perception  to  provide  a  balanced

166

response.  This  helps  capture  a  more  accurate  representation  of  user  evaluation  by

recognizing both definite and moderate responses.

Table 12. 5-Point Likert Scale Interpretation Range

Scale

Scale Range

Interpretation

5

4

3

2

1

4.21–5.00

Strongly Agree

3.41–4.20

Agree

2.61–3.40

Neutral

1.81–2.60

Disagree

1.00–1.80

Strongly
Disagree

As shown in Table 12, the study interprets the results using a structured mean range

for a 5-point Likert scale. The scale interval was computed by subtracting the lowest

scale  value  from  the  highest  scale  value  and  dividing  the  result  by  the  five  levels  of

interpretation: (5 − 1) ÷ 5 = 0.80. This produced equal interpretation intervals of 0.80,

ranging from 1.00–1.80 for Strongly Disagree to 4.21–5.00 for Strongly Agree. The use

of  a  5-point  Likert  scale  is  appropriate  for  this  study  because  it  is  a  widely  used

psychometric  scale  for  measuring  attitudes,  perceptions,  and  levels  of  agreement,

typically  ranging  from  “Strongly  Disagree”  to  “Strongly  Agree.”  It  also  provides  a

neutral midpoint, which allows respondents who are uncertain or undecided to provide

a  balanced  response  instead  of  being  forced  into  either  agreement  or  disagreement.

Recent literature supports the use of a neutral response category when developing new

Likert-type  scales,  as  it  can  improve  the  accuracy  and  appropriateness  of  respondent

choices when properly applied (Robinson, 2024; Kilburn, 2024).

167

3.9.    Sampling Technique

In this study, the researchers will use purposive sampling method to identify the

participants. This non-probability sampling technique will be based on the researcher

making a judgment on the selection of people who have the required knowledge and

experience to give the most relevant feedback on the ECS. Under this strategy, the actual

sample  size  will  be  determined  in  the  data  gathering  and  validation  process  when

adequate, in-depth feedback is received to fully test the usability and functionality of the

system. The respondents are categorized into three distinct groups: Eloquente Catering

Services personnel, IT experts and customers, each of which has been selected to provide

a complete evaluation of the system in various perspectives.

3.10.

  Statistical Treatment

The  researchers  will  utilize  weighted  mean  analysis  combined  with  the  5-point

Likert Scale interpretation. The following formula will be used to calculate the measures

Weighted Mean

The Weighted Mean will be used to calculate the average response for each system

assessment  item  in  the  questionnaire.  This  measure  provides  a  central  value  that

represents the general sentiment of the respondents regarding the system's performance.

𝐱̄ =

∑(𝒇 ∙ 𝒘)
𝑵

Where:

•  x̄  = Weighted Mean

168

•  ∑(𝒇 ∙ 𝒘) = The sum of the product of frequency (f) and weight (w)

•  𝑵= Total number of respondents

By applying these statistical treatments, the researchers will be able to transform

the raw survey data into actionable insights, ensuring the final ECS is both technically

sound and user centric.

To  transform  raw  operational  data  into  actionable  business  insights,  the  system

employs specific statistical models. These algorithms form the computational backend

of  the  Admin  Analytics  Dashboard,  enabling  both  descriptive  summarization  and

predictive forecasting.

Frequency Distribution

Frequency distribution is a major descriptive statistic which is applied to summarize

and  organize  the  raw  data  obtained  by  the  respondents.  The  frequency  (number  of

occurrences) of each individual response with the 5-point Likert scale is followed in the

different ISO 25010 quality characteristics through this method.

Through  frequency  distribution,  the  research  gave  a  fine-grained  analysis  of  the

respondent sentiment such that the percentage of respondent selection of Strongly Agree

(5), Strongly Disagree (1), Agree (4), Neutral(3), and Disagree (2) per functional and

technical requirement was given. To get the percentages of each category to supplement

the frequency counts, the formula shown below is used:

𝑃 =   (

𝑓

𝑛

)   × 100

169

Where:

•  P is the percentage equivalent.

•  𝒇 is the frequency or number of respondents who selected a specific scale

level.

•  𝒏 is the total number of respondents.

The raw frequency counts along with the percentages of the results, the study will

guarantee  the  granular  and  transparent  representation  of  the  survey  results.  This

approach can be crucial in determining spheres of the high level of performance or the

required improvement since it presents the actual distribution of the participant feedback

other than the generalized weighted mean.

3.11.

  Respondents of the Study

The participants of this research will be the individuals who will participate in the

beta testing  and reviewing  of the software of ECS. Their responses and answers will

form the primary element in establishing the fulfillment of the required criteria of quality

of the system considering its functional suitability, usability, reliability, performance,

and security as stipulated by the ISO 25010 software quality model. The respondents

will fall into three groups, that is, the Personnel Group of Respondents, the IT Expert

Respondents and the Customer Group of Respondents

The first is the Personnel Group, which  comprises internal stakeholders who are

directly involved in the core operations of the business. This involves the Admin, who

will review the system-wide controls and predictive analytics dashboards; the Marketing

170

Staff, who will review the logistical processes and dynamic package adjustments; and

the Accounting Staff, who will review the financial processes, payment verification, and

real-time  contract  creation.  The  second  one  is  the  IT  Expert  Group,  which  includes

specialized  technical  experts  who  are  selected  to  provide  a  critical  assessment  of  the

structural  soundness  of  the  software.  This  team  is  strictly  made  up  of  Software

Engineers, whose responsibility will be to audit the backend architecture and webhook

integrations, and Data Analysts, whose responsibility will be to test the mathematical

accuracy  and  logic  of  the  predictive  analytics  of  the  system.  The  third  group  is  the

Customer Group, which is a group of external end-users who will be chosen to test the

functional suitability and usability of the customer-side Booking Portal. To make the

system serve a wide range of users, this group is further subdivided in terms of digital

literacy:  beginner  with  little or no prior experience in  online reservations to  evaluate

how easy the system  is  to learn initially;  intermediate users  with  some experience in

digital booking to evaluate how clear the menu selection process with the help of the

DSS is; and advanced users with a high level of e-commerce experience to evaluate the

flexibility  of  the  system  in  terms  of  handling  complex  or  highly  customized  event

bookings.

Its  internal  staff,  which  comprises  Personnel  Group  of  Respondents  will  be  the

Owners, Marketing Executive, and Accounting Staff of Eloquente Catering Services,

who will review the system in relation to their respective operational functions. These

respondents  would  be  the  most  suitable  to  evaluate  on  whether  the  system  has

sufficiently addressed the real business workflow and internal processes that the system

171

is  intended to  support. Customer Group of Respondents  will be  external  users of the

system and will be grouped into three levels based on their experience with the system

in terms of booking catering i.e. Beginner, Intermediate and Advanced. The reviews will

reveal  the  accessibility  of  the  Booking  Portal,  its  user-friendliness,  and  the  ability  to

address the needs of both clients with high and low familiarity with catering services.

On  the  other  hand,  the  IT  Expert  Respondents  will  be  professionals  of  technical

backgrounds  in  the  field  of  information  technology  and  will  evaluate  the  system  on

technical  basis  such  as  its  architecture,  code  quality,  database  integrity,  security

capabilities, and technical adherence to the best practices in software engineering.

Table 13. Personnel Group of Respondents

Respondent Category

Role in the System

Owners (CEO / COO)

Admin

Marketing Executives

 Logistics Management

Accounting Staff

 Payment Verification

As  shown  in  Table  13,  The  Personnel  Group  of  Respondents  consists  of

participants spread across three operational  positions of Eloquente Catering  Services.

The  Owners  (CEO  and  COO)  represent  the  exhaustive  sample  of  the  executive

population, as there are only two individuals in these positions, yet they carry the greatest

information  power  given  their  overall  strategic  supervision  of  the  business.  The

Marketing  Executives  were  included  to  provide  uniform  and  stable  validation  of  the

Logistics  Management  functions  of  the  system,  ensuring  that  the  operational

coordination workflows are thoroughly evaluated by those who perform them daily. The

172

Accounting Staff were also included, reflecting the critical importance of the Payment

Verification module, where financial accuracy and process reliability must be validated

with sufficient depth. Together, this group of respondents covers all internal personnel

roles  of  Eloquente  Catering  Services,  guaranteeing  comprehensive  operational

validation across all staff-facing modules of the system.

Table 14. Customer Group of Respondents

Respondent Category

Classification

Beginner

Little to no prior catering booking experience

Intermediate

Some experience with catering or event bookings

Advanced

Extensive experience with multiple catering bookings

Table 14 shows The Customer Group of Respondents includes participants who

were divided into three levels in respect of their experience with bookings of catering

services.  The  Beginner  respondents  are  those  customers  who  have  minimal  to  no

previous experience in the field of scheduling catering services and are thus the most

sensitive evaluators in terms of ease of use and clarity of the onboarding process of the

system. The Intermediate respondents have a slight acquaintance with catering or event

bookings, which enables them to compare the workflow of the system with their current

expectations.  The  Advanced  respondents  have  vast  experience  with  various  catering

engagements, thus being able to critically assess the depth of the features, customization

options, and the general operational effectiveness of the system. This allocation makes

the system reliable within the entire range of customer experience levels, ensuring that

173

the Booking Portal is not only accessible to first-time users but is also robust enough to

meet the demands of experienced customers.

Table 15. IT Expert Group of Respondents

Respondent Category

Area of Expertise

Software Engineer

System Architecture & Code Quality

Data Analyst

Database Design & Data Integrity

As reflected in Table 15, the IT Expert Respondents consist of individuals with

professional or academic backgrounds in information technology who will evaluate the

system from a purely technical standpoint. Software developers or engineers will assess

the system's overall architecture, code quality, and adherence to software engineering

best  practices,  including  the  implementation  of  the  RBAC  mechanism,  the  Booking

Conflict Checker Algorithm, and the Real-Time Dynamic Pricing Engine. A database

administrator will evaluate the design and integrity of the system's relational database

schema, including the normalization of tables, referential integrity constraints, and the

efficiency  of  SQL  queries  that  power  the  analytics  and  booking  modules.  The

evaluations provided by these IT Expert Respondents will serve as a critical technical

benchmark to validate the system's readiness for real-world deployment and to identify

areas for further improvement prior to the final defense and system turnover.

174

Chapter 4

RESULTS AND DISCUSSION

The  chapter offers the overall approach and systematic steps applied in the design,

development and testing of Decision Support and Catering

4.1.      Presentation of Results

4.1.1.  Test Case Rules

Table 16. Role Access Validation Matrix

Allowed Main Areas

Must Be Denied / Protected

Role
Public Visitor

Customer / Client

Marketing
Executive

Accounting Staff

Admin

Home, About, Amenities, Contact, Menu, Book,
Food Tasting, public APIs
Booking wizard, own dashboard, own
payments/receipts, own chat, own profile, own
feedback/tastings
Booking intake/review, assisted booking, calendar
availability, food tasting queue, operations board,
chat, announcements, catalog settings where
allowed
Payment queue, ledger, reconciliation, payment
terms, reminders, refunds, finance
documents/history
All admin controls plus cross-role oversight,
analytics, reports, users, settings, bookings,
refunds, audits

Staff dashboards, customer dashboard,
payments, admin APIs
Other customers records, staff/admin
dashboards, direct payment verification

Accounting-only verification, Admin-only
users/payment rules unless Admin

Related Case
IDs

PV-*

CUST-* and
SYS-RBAC-*

MKT-*

Marketing review actions, Admin-only
users/settings unless Admin

ACC-*

Protected internal code/secrets; customer
password/OTP raw values

ADM-* and
SYS-*

Table 17. Test Case Results of PV_Website_And_Navigation

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Public Visitor
Module Test Activities

TC ID
PV-WEB-001

Test Activity /
Step Description
Open public Home
page

Precondition /
Test Data
Unauthenticated
browser session.

PV-WEB-002

Open About page

Unauthenticated
browser session.

PV-WEB-003

Open Amenities
page

Unauthenticated
browser session.

PV-WEB-004

Open Contact page  Unauthenticated
browser session.

PV-WEB-005

Open public Menu
page

Unauthenticated
browser session.

Expected Result
Home page loads
without login and
displays main calls
to action, hero
content, and
navigation.
About page loads
and content is
readable without
layout breakage.
Amenities page
loads and directs
users toward
booking or inquiry
actions.
Contact information
and inquiry form
are visible and
usable.
Menu gallery loads
active menu
categories/items
only and no

Actual Result

To be tested.

Status
Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Remarks
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

175

TC ID

Test Activity /
Step Description

Precondition /
Test Data

PV-WEB-006

Open public
Booking page

Unauthenticated
browser session.

PV-WEB-007

PV-WEB-008

PV-WEB-009

Open Food Tasting
page

Unauthenticated
browser session.

Use main
navigation on
desktop viewport

Browser width
1366px or similar.

Use main
navigation on
mobile viewport

Browser/device
width 375px or
similar.

Expected Result
protected staff data
is exposed.

Booking wizard
page opens; final
submission still
requires proper
account/authenticat
ion where
applicable.
Food tasting
request page loads
and required fields
are clear.
Navigation links
route to the correct
pages without
broken links.
Mobile menu
opens/closes
properly and
content remains
readable.

Actual Result

Status

Remarks

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 18. Test Case Results of PV_Contact_Inquiry

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Public Visitor
Module Test Activities

TC ID

Test Activity /
Step Description

Precondition /
Test Data

Expected Result

Actual Result

Status

Remarks

PV-CONT-001

Submit complete
contact inquiry

Valid name, email,
phone, concern
type, and message.

Inquiry is saved
and appears in
Marketing contact
inquiry queue.

To be tested.

Pending

PV-CONT-002

Submit contact
inquiry with invalid
email

Use invalid email
format.

PV-CONT-003

Submit contact
inquiry with missing
required fields

Leave required
fields blank.

Validation prevents
submission and
displays a clear
email message.

Required field
errors appear and
no inquiry is
created.

To be tested.

Pending

To be tested.

Pending

PV-CONT-004

Submit contact
inquiry with
honeypot/bot field
populated

Populate hidden
honeypot field
through testing
tools.

Submission is
blocked or ignored
safely as spam/bot
traffic.

To be tested.

Pending

PV-CONT-005

Submit contact
inquiry repeatedly
beyond rate limit

Same browser/IP;
rapid repeated
submissions.

Throttling prevents
abuse and returns
a safe message.

To be tested.

Pending

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 19. Test Case Results of PV_Menu_Packages_Event_Types

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Public Visitor
Module Test Activities

TC ID
PV-API-001

Test Activity /
Step Description
Load /api/menu

Precondition /
Test Data
Unauthenticated
request.

Expected Result
API returns active
menu records
without

Actual Result

To be tested.

Status
Pending

Remarks
Added from current
ECS repository
review.

176

TC ID

Test Activity /
Step Description

Precondition /
Test Data

PV-API-002

PV-API-003

PV-API-004

Load
/api/menu/categori
es

Load
/api/menu/bestselle
rs

Unauthenticated
request.

Unauthenticated
request.

Open menu item
detail endpoint

Valid active menu
item ID.

PV-API-005

Load event types
and packages

PV-API-006

Verify public API
cache behavior

Unauthenticated
request to public
event/package
endpoints.
Repeat same
public API request.

Actual Result

Status

Remarks

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Expected Result
hidden/archived
items.
API returns
available
categories used by
menu filters.
API returns
bestseller items
and handles no-
data state safely.
API returns correct
item detail;
invalid/nonexistent
ID returns safe
error.
Only active public
event types and
packages are
returned.
Response remains
consistent and
does not expose
stale hidden
records after cache
refresh window.

Table 20. Test Case Results of PV_Food_Tasting_Request

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Public Visitor
Module Test Activities

TC ID
PV-TASTE-001

PV-TASTE-002

PV-TASTE-003

PV-TASTE-004

Test Activity /
Step Description
Submit valid guest
food tasting
request

Precondition /
Test Data
Unauthenticated
visitor with
complete tasting
details.

Submit guest
tasting with missing
contact details

Blank required
name/email/phone/
date fields.

Submit duplicate-
looking guest
tasting request

Cancel or archive
guest tasting from
staff queue

Same
email/contact/date
as previous
request.

Existing guest
tasting request.

Actual Result

To be tested.

Status
Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Expected Result
Food tasting
request is accepted
and becomes
visible in staff
tasting queue.
Validation blocks
submission and
points to missing
fields.
System accepts
with duplicate
indicators or
handles safely
without crashing.
Staff action
removes it from
active queue
without destructive
loss of history.

Remarks
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 21. Test Case Results of Customer_Registration

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID
CUST-REG-001

Test Activity /
Step Description
Open Register
page

CUST-REG-002

Click Sign Up with
empty fields

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.

Expected Result

Actual Result

Registration form is
displayed

Registration form
appears

Status
Passed

Required field
validation
messages appear

Validation message
appear

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

177

TC ID
CUST-REG-003

Test Activity /
Step Description
Enter invalid email
format

CUST-REG-004

CUST-REG-005

Enter password
below minimum
length

Enter mismatched
password
confirmation

CUST-REG-006

Register using
existing email

CUST-REG-007

Leave Terms and
Conditions
unchecked

CUST-REG-008

Submit valid
registration details

CUST-REG-009

Enter invalid OTP

CUST-REG-010

Click Resend OTP

CUST-REG-011

Enter correct OTP

CUST-REG-012

CUST-REG-013

Register with weak
password under
current password
policy
Register when OTP
email delivery fails

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use password with
insufficient
length/complexity
or personal info.
Mail provider
unavailable or set
to fail in test
environment.

CUST-REG-014

CUST-REG-015

Resend OTP
before cooldown
expires

Verify legacy/plain
OTP can only be
used once

New account
waiting for
verification; request
resend
immediately.
Account with
available OTP;
submit correct OTP
twice.

Expected Result

Actual Result

Email format
validation message
appears

Email validation
appears

Password
validation message
appears

Confirmation
mismatch message
appears

Password
validation of 6
minimum
characters
appearrs
Mismatch
password
validation appears

Duplicate email
error appears

E-mail reuse
prevention error
appears

System prevents
registration

OTP verification
page is shown

Invalid OTP
message appears

Unable to proceed
without checking
Terms and
Condition

OTP Verification
code displays and
is received through
email

Unable to proceed
and invalid OTP
message appears

New OTP is sent
successfully

OTP re-sent
message appears

Account is verified
and redirected to
login/dashboard

Registration is
rejected with
password policy
guidance.
Account remains
created for
verification retry;
OTP secret is not
displayed or
logged.
System blocks
resend and
displays
retry/cooldown
time.
First submission
verifies account;
second submission
is rejected or
ignored.

Account verified
message and
proceed to
dashboard

Registration is
rejected with
password policy
guidance.
Account remains
created for
verification retry;
OTP secret is not
displayed or
logged.
System blocks
resend and
displays
retry/cooldown
time.
First submission
verifies account;
second submission
is rejected or
ignored.

Table 22. Test Case Results of Customer_Login

Status
Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID

CUST-LOG-
001

Test Activity /
Step Description
Open Login page

Precondition /
Test Data

Use current
deployed ECS

Expected Result

Login form is
displayed

Actual Result
Form is displayed

Status
Passed

Remarks

Existing QA draft; retain
and retest on current build.

178

TC ID

Test Activity /
Step Description

CUST-LOG-
002

Submit empty login
form

CUST-LOG-
003

Enter incorrect
credentials

CUST-LOG-
004

Login with
unverified account

CUST-LOG-
005

Login with valid
credentials

CUST-LOG-
006

Click Forgot
Password

CUST-LOG-
007

Submit registered
email for reset

CUST-LOG-
008

Open Forgot
Password page

CUST-LOG-
009

Submit forgot
password for active
account

Precondition /
Test Data
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Unauthenticated
user clicks Forgot
Password.

Registered active
customer email.

CUST-LOG-
010

Use password
reset link once

Valid reset link
from email/log.

CUST-LOG-
011

Login after
repeated failed
attempts

Same account/IP;
exceed allowed
failed logins.

Expected Result

Actual Result

Status

Remarks

Required field
messages appear

Unable to proceed
with a message
that requires input

Passed

Existing QA draft; retain
and retest on current build.

Invalid credentials
message appears

Invalid credential
message appearrs

Passed

Existing QA draft; retain
and retest on current build.

Verification prompt
appears

Redirected to
account verification

Passed

Existing QA draft; retain
and retest on current build.

Customer
dashboard loads

Proceed to
customer
dashboard

Passed

Existing QA draft; retain
and retest on current build.

Password reset
page opens

Password reset
page opens

Passed

Existing QA draft; retain
and retest on current build.

Reset email is sent

Reset email is sent

Passed

Existing QA draft; retain
and retest on current build.

Password reset
request page
opens and accepts
registered email.
Single-use reset
email/link is
generated without
revealing account
existence
unnecessarily.
Password changes
successfully and
reused token is
rejected.
Login route is rate-
limited and displays
safe throttling
message.

Password reset
request page
opens and accepts
registered email.
Single-use reset
email/link is
generated without
revealing account
existence
unnecessarily.
Password changes
successfully and
reused token is
rejected.
Login route is rate-
limited and displays
safe throttling
message.

Passed

Passed

Passed

Passed

Added from current ECS
repository review.

Added from current ECS
repository review.

Added from current ECS
repository review.

Added from current ECS
repository review.

Table 23. Test Case Results of Customer_Dashboard

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID

CUST-
DASH-001

Test Activity /
Step Description
Open dashboard

CUST-
DASH-002

View booking
status timeline

CUST-
DASH-003

Click booking
details

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.

Expected Result

Actual Result

Active bookings
and summary
cards are displayed

Bookings and
summary are
displayed

Status
Passed

Remarks

Existing QA draft; retain
and retest on current build.

Correct status is
shown

Status is shown

Passed

Existing QA draft; retain
and retest on current build.

Detailed booking
page opens

Booking details is
shown

Passed

Existing QA draft; retain
and retest on current build.

179

TC ID

CUST-
DASH-004

Test Activity /
Step Description
View notifications

CUST-
DASH-005

Open dashboard
with no active
bookings

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Customer account
with no bookings.

CUST-
DASH-006

Switch between
multiple bookings

Customer has at
least two bookings.

CUST-
DASH-007

Refresh dashboard
after selecting
booking/tab

CUST-
DASH-008

View journey
tracker endpoint

Customer changes
selected
booking/tab then
reloads.
Customer has
active booking.

CUST-
DASH-009

Hide completed
booking from
history

Customer has
completed
historical booking.

CUST-
DASH-010

Attempt to hide
active booking from
history

Customer has
active
submitted/approve
d booking.

Expected Result

Actual Result

Latest notifications
are listed

Latest notifications
are listed

Status
Passed

Remarks

Existing QA draft; retain
and retest on current build.

Dashboard
displays friendly
empty state and
booking call to
action.
Selected booking
changes details,
payments, tasting,
history, and
messages
correctly.
Last selected event
and tab are
preserved when
supported.
Lightweight journey
tracker returns
current next action,
status, and
payment/tasting
cues.
Booking is hidden
from customer
history without
deleting booking or
payments.
System blocks
hiding active
booking and keeps
it visible.

Dashboard
displays friendly
empty state and
booking call to
action.
Selected booking
changes details,
payments, tasting,
history, and
messages
correctly.
Refresh dashboard
after selecting
booking/tab

Lightweight journey
tracker returns
current next action,
status, and
payment/tasting
cues.
To be tested.

Passed

Added from current ECS
repository review.

Passed

Added from current ECS
repository review.

Passed

Passed

Added from current ECS
repository review.

Added from current ECS
repository review.

Failed

Added from current ECS
repository review.

To be tested.

Pending

Added from current ECS
repository review.

Table 24. Test Case Results of Customer_Browsing_And_Package_Customization

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID

CUST-
MENU-001

Test Activity /
Step Description
Open Menu page

CUST-
MENU-002

Search for a dish

CUST-
MENU-003

Filter by category

CUST-
MENU-004

View dish details

CUST-
MENU-005

Use
budgeting/price
filter

CUST-
MENU-006

Use menu
pagination

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Menu category with
many dishes.

Expected Result

Actual Result

Menu items are
displayed

Menu is shown

Status
Passed

Remarks

Existing QA draft; retain
and retest on current build.

Matching dishes
are shown

Matching dishes
are shown

Passed

Existing QA draft; retain
and retest on current build.

Only selected
category items are
shown

Food under
selected category
is shown

Passed

Existing QA draft; retain
and retest on current build.

Description and
pricing are
displayed

Description and
pricing are
displayed

Passed

Existing QA draft; retain
and retest on current build.

Food with the
selected price filter
is shown

Food with the
selected price filter
appears

Passed

Existing QA draft; retain
and retest on current build.

To be tested.

Passed

Added from current ECS
repository review.

Pagination or load-
more controls
display additional
dishes without
resetting
selections.

180

TC ID

CUST-
MENU-007

Test Activity /
Step Description
Sort dishes by
price/name/popular
ity

Precondition /
Test Data
Menu page/build
menu step.

Expected Result

Actual Result

To be tested.

Sort order updates
and selected
dishes remain
selected.

Status
Passed

Remarks

Added from current ECS
repository review.

Table 25. Test Case Results of Customer_Booking_Process

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID

Test Activity /
Step Description

CUST-BOOK-001  Open Book Now

page

CUST-BOOK-002

Select unavailable
date

CUST-BOOK-003

Select valid date

CUST-BOOK-004

Enter guest count
below 50

CUST-BOOK-005

Schedule food
tasting

CUST-BOOK-006

Skip food tasting

CUST-BOOK-007

Review booking
summary

CUST-BOOK-008

Start booking while
logged out and
submit final step

CUST-BOOK-009

Check seven-day
lead time rule

CUST-BOOK-010

Check daily event
and pax capacity

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Unauthenticated
browser begins
booking.

Choose date less
than configured
minimum lead
days.
Choose date
already at capacity
or pax limit.

CUST-BOOK-011

CUST-BOOK-012

CUST-BOOK-013

Select locked
calendar override
date

Marketing/Admin
locks a date in
Date Availability.

Enter guest count
at minimum
boundary

Use exact
minimum allowed
guest count.

Enter guest count
above remaining
capacity

Date has limited
remaining pax;
enter over limit.

Expected Result
Booking starts

Actual Result

Booking starts

Status
Passed

The date selection
in the calendar is
blocked

The date selection
in the calendar is
blocked

User proceeds to
next step

Proceeds to next
step

Minimum guest
validation appears

Invalid Guest
Count appears

Passed

Passed

Passed

Schedule is saved

Schedule is booked
and saved

Passed

Booking continues

Proceeds to
dashboard

All booking details
are correct

All calculation and
details inputted are
correct

System prevents
final submission or
asks user to sign
in/register before
saving booking.
Date is blocked or
validation prevents
booking
submission.
System shows
unavailable/fully
booked message
and blocks
submission.
Customer cannot
book locked date
even if no booking
exists.
Guest count is
accepted and
pricing recalculates
correctly.
Validation blocks
submission and
shows remaining
capacity guidance.

System prevents
final submission or
asks user to sign
in/register before
saving booking.
Date is blocked or
validation prevents
booking
submission.
System shows
unavailable/fully
booked message
and blocks
submission.
Customer cannot
book locked date
even if no booking
exists.
Guest count is
accepted and
pricing recalculates
correctly.
Validation blocks
submission and
shows remaining
capacity guidance

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

181

TC ID
CUST-BOOK-014

CUST-BOOK-015

Test Activity /
Step Description
Enter venue
outside service
area

Precondition /
Test Data
Venue outside
Metro Manila/out-
of-town rules.

Select high-rise
venue/access
difficulty

Venue access
marked as high-
rise or difficult.

CUST-BOOK-016

Submit final review
modal

Complete valid
booking
details/menu/tastin
g preference.

CUST-BOOK-017

Send abandoned
booking reminder

Customer starts
booking but does
not submit.

Expected Result

Actual Result

Transport/out-of-
town fee or service
rule is displayed in
estimate.
High-rise/service
surcharge is
calculated and
explained.
Final review shows
all details and
successful submit
creates booking,
payment schedule,
and staff review
tasks.
Abandoned
reminder is sent
only within allowed
throttling rules.

Transport/out-of-
town fee or service
rule is displayed in
estimate.
High-rise/service
surcharge is
calculated and
explained.
Final review shows
all details and
successful submit
creates booking,
payment schedule,
and staff review
tasks.
Abandoned
reminder is sent
only within allowed
throttling rules.

Status
Passed

Passed

Passed

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Passed

Added from current
ECS repository
review.

Table 26. Test Case Results of Customer_Payments

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID
CUST-PAY-001

Test Activity /
Step Description
Click Pay
Reservation Fee

CUST-PAY-002

Complete payment
successfully

CUST-PAY-003

Cancel booking

CUST-PAY-004

Download receipt

CUST-PAY-005

Initialize PayMongo
checkout for next
payment step only

CUST-PAY-006

Attempt to pay
future payment
step early

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Approved booking
with due
reservation/downpa
yment/final
payment.
Booking has
unpaid earlier step.

CUST-PAY-007

CUST-PAY-008

CUST-PAY-009

Return from
checkout success
before webhook
marks paid

PayMongo success
redirect without
webhook
confirmation.

Return from
checkout cancelled
page
Receive valid
PayMongo
webhook

Cancel PayMongo
checkout.

Correct signature,
amount, currency,
and reference.

CUST-PAY-010

Receive duplicate
webhook event

Same PayMongo
event sent twice.

Expected Result

Actual Result

Payment gateway
opens

Payment gateway
opens

Status
Passed

Payment status
becomes Paid

Payment status
becomes Paid

Booking is
cancelled and
payment is
refunded except
reservation fee
PDF receipt
downloads

Booking is
cancelled and
payment is
refunded except
reservation fee
Not recorded.

Secure checkout
opens only for next
eligible unpaid
step.

Secure checkout
opens only for next
eligible unpaid
step.

System blocks
future-step
checkout and
explains next
payable item.
Payment remains
pending/unverified
until valid webhook
or accounting
verification arrives.
Payment remains
pending and
customer can retry.
Payment is marked
paid/verified and
booking payment
progress updates.
To be tested.

System blocks
future-step
checkout and
explains next
payable item.
Payment remains
pending/unverified
until valid webhook
or accounting
verification arrives.
Payment remains
pending and
customer can retry.
Payment is marked
paid/verified and
booking payment
progress updates.
Processing is
idempotent;
payment is not
duplicated.

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

182

TC ID
CUST-PAY-011

CUST-PAY-012

Test Activity /
Step Description
Download own
payment receipt

Precondition /
Test Data

Customer has
paid/verified
payment.

Attempt to
download another
customer receipt

Authenticated
customer changes
payment ID in URL.

Branded PDF
receipt downloads
for own payment
only.
Access is denied.

Expected Result

Actual Result

To be tested.

Status
Passed

To be tested.

Passed

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 27. Test Case Results of Customer_Chat_And_Notifications

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID
CUST-CHAT-001

Test Activity /
Step Description
Open chat

CUST-CHAT-002

Send message

CUST-CHAT-003

Receive reply

CUST-CHAT-004

Send empty
message

CUST-CHAT-005

Open existing
conversation
history

CUST-CHAT-006

Verify unread
notification count

CUST-CHAT-007  Mark one

notification as read

CUST-CHAT-008  Mark all

notifications as
read
Delete read
notifications

CUST-CHAT-009

CUST-CHAT-010

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Customer has prior
chat messages.

Customer has
unread notification
records.
Customer has
unread notification.

Customer has
multiple unread
notifications.
Customer has read
notifications.

Verify realtime chat
over
Reverb/staging
HTTPS

Reverb/WebSocket
enabled in staging
environment.

Expected Result

Conversation list is
displayed

Actual Result
Chat box is opened

Status
Passed

Message appears
instantly

Message is sent
and appears

Passed

Message appears
in real time

Replies appears

Passed

Validation prevents
submission

Unable to send
message with an
empty input

Message history
loads newest page
and can page older
messages without
duplicates.
Notification bell
count matches
unread records.
Notification read
state updates and
unread count
decreases.
All unread
notifications
become read.
Read notifications
are removed from
list without deleting
unread ones.
New replies appear
without manual full
page refresh or
show clear refresh
fallback.

Message history
loads newest page
and can page older
messages without
duplicates.
Notification bell
count matches
unread records.
Does not mark one
notification as read

All unread
notifications
become read.
Read notifications
are removed from

New replies appear
without manual full
page refresh or
show clear refresh
fallback.

Passed

Passed

Passed

Failed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 28. Test Case Results of Customer_Profile_Management

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID
CUST-PROF-001

Test Activity /
Step Description
Open profile page

Precondition /
Test Data

Use current
deployed ECS
build and original

Expected Result

Actual Result

Profile information
is displayed

Profile information
is displayed

Status
Passed

Remarks

Existing QA draft;
retain and retest on
current build.

183

TC ID

Test Activity /
Step Description

CUST-PROF-002

Update personal
information

CUST-PROF-003

Change password

CUST-PROF-004

Logout

CUST-PROF-005

Upload valid profile
avatar

Precondition /
Test Data
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Authenticated user
selects valid image
file.

CUST-PROF-006

Upload invalid
profile avatar

Non-image or
oversized file.

CUST-PROF-007

Update email
address

Customer changes
email to unused
valid address.

CUST-PROF-008

Change password
without current
password

Attempt password
change missing
current password.

CUST-PROF-009

Request password
verification code

Authenticated user
requests code.

CUST-PROF-010

CUST-PROF-011

Use expired
password
verification code
View profile activity
history

Wait until code
expiration or use
expired test code.
Authenticated user
opens activity
section.

CUST-PROF-012

Delete own
account with
confirmation

Customer account
eligible for
deletion/deactivatio
n.

Expected Result

Actual Result

Status

Remarks

Changes are saved  Changes are saved

Passed

New password
works for login

New password set
is working and able
for login

Session ends and
login page appears

Session ends and
is brought to guest
view homepage

Avatar is accepted,
stored, and
displayed on
profile/header
where supported.
Upload is rejected
with clear validation
message.
Email updates and
verification state is
reset when
required.
System rejects
change and asks
for current
password/verificati
on code.
Code is sent to
email/log and is
time-limited.
Password change
is rejected.

Recent
account/profile
actions are listed
without sensitive
values.
Account is
deactivated/deleted
according to
business rule and
user can no longer
log in.

Avatar is accepted,
stored, and
displayed on
profile/header
where supported.
Upload was
accepted

Email updates and
verification state is
reset when
required.
System rejects
change and asks
for current
password/verificati
on code.
Code is sent to
email/log and is
time-limited.
Password change
is rejected.

Recent
account/profile
actions are listed
without sensitive
values.
Account is
deactivated/deleted
according to
business rule and
user can no longer
log in.

Passed

Passed

Passed

Failed

Passed

Passed

Passed

Passed

Passed

Passed

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 29. Test Case Results of Customer_Food_Tasting_Management

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID
CUST-TASTE-001

Test Activity /
Step Description
View customer
tasting records

CUST-TASTE-002  Update tasting

request

CUST-TASTE-003  Cancel tasting

request

Precondition /
Test Data

Customer has
tasting request
linked to
account/booking.

Own tasting record
in editable status.

Own tasting record
in cancellable
status.

Expected Result

Actual Result

Food tasting list
displays status,
preferred date,
notes, and booking
context.
No Update option

Cancel Tasting is
not working

Food tasting list
displays status,
preferred date,
notes, and booking
context.
Updated
schedule/contact/n
otes are saved and
visible to staff.
Tasting is marked
cancelled non-
destructively and
removed from
active queue where
applicable.

Status
Passed

Failed

Failed

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

184

Table 30. Test Case Results of Customer_Booking_Updates_Cancellation_And_Clarification

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID
CUST-UPD-001

CUST-UPD-002

Test Activity /
Step Description
Update eligible
event details after
submission
Update menu after
submission

Precondition /
Test Data
Own booking in
editable status.

Own booking
before menu lock
deadline.

CUST-UPD-003

Attempt to edit
locked/cancelled
booking

CUST-UPD-004

CUST-UPD-005

Respond to
Marketing
clarification request
Cancel booking
with valid reason

Own booking is
cancelled,
completed, or
locked near event
date.
Booking status
Needs Customer
Details.
Booking eligible for
cancellation.

CUST-UPD-006

CUST-UPD-007

Cancel booking
without valid
reason
Verify refund
preview after
cancellation

Blank or too-short
cancellation
reason.
Cancelled booking
with paid
payment(s).

Expected Result

Actual Result

Allowed fields
save; locked fields
remain protected.
Menu changes
save and unpaid
balance
recalculates
correctly.
System blocks
update and
displays safe
explanation.

Allowed fields
save; locked fields
remain protected.
Menu changes
save and unpaid
balance
recalculates
correctly.
System blocks
update and
displays safe
explanation.

Customer response
is saved

Customer response
is saved

Cancellation
reason is stored
and refund
preview/eligibility is
displayed.
Validation blocks
cancellation.

Cancellation
reason is stored
and refund
preview/eligibility is
displayed.
Validation blocks
cancellation.

Refundable and
non-refundable
amounts are shown
according to
business rules.

Refundable and
non-refundable
amounts are shown
according to
business rules.

Status
Passed

Passed

Passed

Passed

Passed

Passed

Passed

Remarks

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Table 31. Test Case Results of Customer_Announcements_Feedback_And_Customer_Experience

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Customer Module
Test Activities

TC ID
CUST-CX-001

CUST-CX-002

CUST-CX-003

CUST-CX-004

CUST-CX-005

Test Activity /
Step Description
View targeted
customer
announcements

Mark customer
announcement as
read

Precondition /
Test Data

Published
announcement
targeted to
customer/audience.
Unread customer
announcement.

Ensure
draft/archived
announcements
are hidden
View feedback
request after
completed event

Submit positive
feedback

Announcement
saved as draft or
archived.

Completed booking
with generated
feedback request.

Valid
rating/comment for
feedback request.

CUST-CX-006

Submit low rating
feedback

Low rating with
comment.

CUST-CX-007

Reuse feedback
token

Submit response
twice with same
token.

Expected Result

Actual Result

Announcement
appears in Home.

Announcement
appears in Home.

Status
Passed

Read state is
stored and
announcement
read badge
updates.
Customer does not
see
unpublished/archiv
ed content.
Customer sees
feedback request
with valid
token/action.
Feedback
response is saved
and staff may
review for
testimonial use.
Response is saved
and requires follow-
up in staff review
queue.
Duplicate response
is prevented or
handled safely.

Not yet available

Failed

Not yet available

Failed

Not yet available

Failed

Not yet available

Failed

Not yet available

Failed

Not yet available

Failed

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

185

Table 32. Test Case Results of Marketing_Dashboard_And_Booking_Queue

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

TC ID
MKT-QUEUE-001

Test Activity /
Step Description
Login as Marketing
Executive

MKT-QUEUE-002

View pending
bookings in
inquiries

MKT-QUEUE-005

Logout

MKT-QUEUE-006

Use Marketing
summary cards

MKT-QUEUE-007

MKT-QUEUE-008

Search bookings
by
customer/name/ref
erence

Filter bookings by
status

MKT-QUEUE-009

MKT-QUEUE-010

Filter bookings by
date range

Paginate booking
queue

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Marketing user
logged in.

Booking queue has
multiple records.

Booking queue has
submitted/approve
d/cancelled
records.
Booking queue has
multiple event
dates.
Booking queue has
more records than
page limit.

MKT-QUEUE-011

View unassigned
bookings

Submitted booking
without owner.

Expected Result

Actual Result

Marketing view
page appears

Marketing view
page appears

Booking queue is
displayed

Pending bookings
is displayed

Session ends and
login page appears

Session ends and
login page appears

Dashboard
summary loads
active inquiries,
upcoming events,
and attention-
needed counts.
Matching records
are shown and
non-matching
records are
excluded.
Filter returns only
selected status
records.

Dashboard
summary loads
active inquiries,
upcoming events,
and attention-
needed counts.
Matching records
are shown and
non-matching
records are
excluded.
Filter returns only
selected status
records.

Results reflect
selected date
range.
Pagination
metadata and next
page records load
correctly.
Unassigned
booking appears
and can be claimed
by Marketing.

Results reflect
selected date
range.
Pagination
metadata and next
page records load
correctly.
Unassigned
booking appears
and can be claimed
by Marketing.

Status
Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 33. Test Case Results of Marketing_Booking_Review_And_Approval

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

TC ID

Test Activity /
Step Description

MKT-REVIEW-001  Open booking

details

MKT-REVIEW-003

Approve booking

MKT-REVIEW-004  Reject booking

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.

Expected Result

Actual Result

Complete customer
information is
shown

Complete customer
information is
shown

Status changes to
Approved

Status changes to
Approved

Status changes to
Rejected

Status changes to
Cancelled

Status
Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

186

TC ID

Test Activity /
Step Description

Precondition /
Test Data

MKT-REVIEW-005  Reply to messages  Use current

MKT-REVIEW-006  Claim an

MKT-REVIEW-007

unassigned
booking

Attempt mutation
without claiming
booking

MKT-REVIEW-008  Mark review

checklist tasks

deployed ECS
build and original
QA data where
applicable.
Marketing user
opens submitted
unassigned
booking.

Marketing user
tries to update
unassigned/other-
owned booking.
Booking has review
checklist tasks.

MKT-REVIEW-009  Request customer

clarification

Booking missing
details.

MKT-REVIEW-010

Approve booking
after checklist

Booking review
complete.

MKT-REVIEW-011  Decline/cancel

booking with
reason

Booking not
serviceable or
unavailable.

MKT-REVIEW-012  Update approved

booking live status

Approved booking.

MKT-REVIEW-013

Attempt live status
update before
approval

Submitted/unappro
ved booking.

Expected Result

Actual Result

Customer is
notified

Customer is
notified

Booking owner
becomes current
user and status
changes to Under
Review.
System blocks
action and asks
user to claim or
transfer ownership.
Each task can be
marked
done/pending and
state persists after
refresh.
Clarification
message is sent,
customer sees
request, and review
status updates.
Booking becomes
approved/confirme
d, default
preparation tasks
are created once,
and customer
notification/email is
queued.
Booking receives
correct non-
approved status
and customer
notification is
generated.
Live status updates
to preparation/on-
the-way/completed
and customer
receives update.
System blocks live
status update until
booking is
approved.

Booking owner
becomes current
user and status
changes to Under
Review.
System blocks
action and asks
user to claim or
transfer ownership.
Each task can be
marked
done/pending and
state persists after
refresh.
Clarification
message is sent,
customer sees
request, and review
status updates.
Booking becomes
approved/confirme
d, default
preparation tasks
are created once,
and customer
notification/email is
queued.
Booking receives
correct non-
approved status
and customer
notification is
generated.
Live status updates
to preparation/on-
the-way/completed
and customer
receives update.
System blocks live
status update until
booking is
approved..

Status
Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 34. Test Case Results of Marketing_Food_Tasting_Management

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

TC ID
MKT-TASTE-001

Test Activity /
Step Description
View food tasting
requests

MKT-TASTE-002

Schedule tasting

MKT-TASTE-003

Update tasting
status

MKT-TASTE-004

Claim food tasting
request

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Unassigned tasting
request in staff
queue.

Expected Result
Requests are listed  Requests are listed

Actual Result

Status
Passed

Schedule is saved

Schedule is saved

Passed

Customer sees
updated status

Customer sees
updated status

Current Marketing
user becomes
owner/assignee.

Current Marketing
user becomes
owner/assignee.

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

187

TC ID
MKT-TASTE-005

MKT-TASTE-006

Test Activity /
Step Description
Release food
tasting ownership

Precondition /
Test Data
Marketing user
owns tasting
request.

Request tasting
transfer to another
staff

Tasting assigned to
current staff; target
staff active.

MKT-TASTE-007

MKT-TASTE-008

Accept tasting
transfer

Cancel tasting
transfer

MKT-TASTE-009

Update tasting
outcome/status

Transfer request
assigned to current
staff.
Transfer request
assigned to current
staff.

Tasting request
completed/cancelle
d/rescheduled.

Expected Result

Actual Result

Ownership is
released and
request becomes
available to queue.
Transfer request is
recorded and target
staff can
accept/decline.
Ownership moves
to accepting staff.

Ownership is
released and
request becomes
available to queue.
Transfer request is
recorded and target
staff can
accept/decline.
Ownership moves
to accepting staff.

Original owner
remains assigned
and transfer status
updates.
Customer/staff
views show
updated tasting
status and notes.

Original owner
remains assigned
and transfer status
updates.
Customer/staff
views show
updated tasting
status and notes.

Status
Passed

Passed

Passed

Passed

Passed

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 35. Test Case Results of Marketing_Package_And_Menu_Management

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

TC ID
MKT-CAT-001

Test Activity /
Step Description
Open Packages
under Public
Content page

MKT-CAT-002

Create package

MKT-CAT-003

Edit package

MKT-CAT-004

Delete package

MKT-CAT-005

Create menu item

MKT-CAT-006

Upload dish image

MKT-CAT-007

Enter invalid price

MKT-CAT-008

MKT-CAT-009

Create event type
from Marketing
settings

Archive/delete
event type

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Marketing/Admin
access to settings;
valid event type
data.
Event type exists
and has or does
not have history.

MKT-CAT-010

Create package
linked to event type

Active event type
and package fields.

Expected Result

Actual Result

Package list is
displayed

Package list is
displayed

New package is
saved

New package is
saved

Changes are
reflected

Changes are
reflected

Package is
removed or
archived

Package is
removed or
archived

Status
Passed

Passed

Passed

Passed

Item is saved

Item is saved

Passed

Image uploads
successfully

Image uploads
successfully

Numeric validation
appears

Numeric validation
appears

Event type is saved
and appears in
active public event
type list.
Public choices hide
archived type while
historical bookings
preserve old label.
Package is saved,
linked, and
displayed in

Event type is saved
and appears in
active public event
type list.
Public choices hide
archived type while
historical bookings
preserve old label.
Package is saved,
linked, and
displayed in

Passed

Passed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

188

TC ID

Test Activity /
Step Description

Precondition /
Test Data

Expected Result

Actual Result

Status

Remarks

MKT-CAT-011

Update package
configuration
metadata

Existing package.

MKT-CAT-012

Archive package
with historical
bookings

Package used by
existing booking.

MKT-CAT-013

Archive menu item

Existing active
menu item.

MKT-CAT-014

Update dish pricing
override

Existing menu item;
valid positive price.

customer package
selection.
Changes reflect in
customer-facing
package cards
after refresh/cache
update.
Package is hidden
from new
selections but
historical booking
record remains
intact.
Item is hidden from
public catalog but
remains in
admin/staff record.
New price affects
menu/booking
calculations and is
reflected after
refresh.

customer package
selection.
Changes reflect in
customer-facing
package cards
after refresh/cache
update.
Package is hidden
from new
selections but
historical booking
record remains
intact.
Item is hidden from
public catalog but
remains in
admin/staff record.
New price affects
menu/booking
calculations and is
reflected after
refresh.

Passed

Passed

Passed

Passed

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 36. Test Case Results of Marketing_Customer_Chat

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

TC ID
MKT-CHAT-001

Test Activity /
Step Description
Open customer
conversation

MKT-CHAT-002

Send message

MKT-CHAT-003

Attach file/image

MKT-CHAT-004

View unassigned
conversations

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Staff chat inbox
has unassigned
customer
conversations.

MKT-CHAT-005

Claim customer
conversation

Unassigned
conversation.

MKT-CHAT-006

Resolve
conversation

Owned active
conversation.

MKT-CHAT-007

Reopen resolved
conversation

Resolved
conversation.

MKT-CHAT-008

Transfer
conversation owner

Owned
conversation;
target active staff.

MKT-CHAT-009

Add collaborator to
conversation

Owned
conversation;
active staff
collaborator.

Expected Result

Actual Result

Message history is
displayed

Message history is
displayed

Customer receives
it instantly

Customer receives
it instantly

Attachment
uploads
successfully

Not Applicable in
Marketing.

Unassigned
conversations list
loads with
customer/account
and booking
context.
Conversation
owner becomes
current staff and
moves to my chats.
Conversation
status changes to
resolved and no
longer appears as
active.
Conversation is
reopened and
customer/staff can
continue
messages.
Owner changes to
target staff and
audit/participant
state updates.
Collaborator can
view/reply but
cannot
transfer/resolve
unless permitted.

Unassigned
conversations list
loads with
customer/account
and booking
context.
Conversation
owner becomes
current staff and
moves to my chats.
Conversation
status changes to
resolved and no
longer appears as
active.
Not Applicable in
Marketing

Owner changes to
target staff and
audit/participant
state updates.
Collaborator can
view/reply but
cannot
transfer/resolve
unless permitted.

Status
Passed

Passed

Failed

Passed

Passed

Passed

Failed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

189

TC ID
MKT-CHAT-010

MKT-CHAT-011

Test Activity /
Step Description
Remove
collaborator from
conversation
Add internal note

Precondition /
Test Data

Existing
collaborator.

Staff conversation.

Expected Result

Actual Result

Collaborator is soft-
removed and loses
reply access.
Internal note is
saved for staff
visibility and not
shown to customer.

Collaborator is soft-
removed and loses
reply access.
Internal note is
saved for staff
visibility and not
shown to customer.

Status
Passed

Passed

Remarks

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Table 37. Test Case Results of Marketing_CMS_Announcement

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

TC ID
MKT-CMS-001

MKT-CMS-002

Precondition /
Test Data

Test Activity /
Step Description
Create
announcement

Use current
deployed ECS
build and original
QA data where
applicable.
Edit announcement  Use current

MKT-CMS-003

Delete
announcement

MKT-CMS-004

MKT-CMS-005

MKT-CMS-006

MKT-CMS-007

Save
announcement as
draft

Publish
announcement to
public audience

Publish
announcement to
selected customer
audience
Schedule
announcement for
future publish

deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Valid
announcement
content with draft
visibility.
Draft
announcement
targeted public.

Announcement
targeted to
selected
users/roles.
Announcement has
publish_at in future.

MKT-CMS-008

Archive
announcement

Published
announcement.

MKT-CMS-009

Send
announcement test
email

Mail/queue
configured or log
mailer active.

Expected Result

Actual Result

Announcement is
published

Not recorded.

Status
Not Recorded

Changes are
reflected

Not recorded.

Not Recorded

Announcement is
removed

Not recorded.

Not Recorded

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Draft is saved but
not visible
publicly/customers.

Announcement
appears on public
announcement
endpoint/pages.
Only intended
customers/audienc
es see the
announcement.
Announcement
remains hidden
until scheduled
publishing process
runs.
Announcement is
hidden from
customer/public
views but remains
staff-visible.
Test email is
queued/logged and
reports delivery
result safely.

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 38. Test Case Results of Marketing_Contact_Inquiry_Management

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

TC ID
MKT-LEAD-001

Test Activity /
Step Description
List contact
inquiries

Precondition /
Test Data
Public visitor has
submitted inquiries.

Expected Result

Actual Result

To be tested.

Marketing queue
shows inquiry
name, contact,
concern type,
status, and date.

Status
Pending

Remarks

Added from current
ECS repository
review.

190

TC ID
MKT-LEAD-002

MKT-LEAD-003

Test Activity /
Step Description
Filter contact
inquiries by
status/concern
Search contact
inquiry by
email/name

Precondition /
Test Data

Queue has
new/resolved/spam
/archived inquiries.
Multiple inquiries.

MKT-LEAD-004

Mark inquiry as
resolved

Open inquiry.

MKT-LEAD-005

Mark inquiry as
spam/archived

Open inquiry.

Only matching
inquiries are
shown.
Matching lead
appears and
unrelated leads are
excluded.
Inquiry status
updates and
resolved date/user
is stored.
Inquiry is removed
from active queue
but remains in
history when filters
include it.

Expected Result

Actual Result

To be tested.

Status
Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Table 39. Test Case Results of Marketing_Assisted_Booking_And_Walk-In_Customer

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

Expected Result

Actual Result

To be tested.

Status
Pending

TC ID
MKT-ASSIST-001

MKT-ASSIST-002

MKT-ASSIST-003

Test Activity /
Step Description
Create assisted
booking for existing
customer

Precondition /
Test Data
Marketing user
selects existing
customer from
search.

Search customers
for assisted
booking

Create walk-in
customer with
email

Customer database
contains several
similar
names/emails.
New customer
details with valid
email.

MKT-ASSIST-004

Create walk-in
booking without
email

Customer has no
email and staff
confirms warning.

MKT-ASSIST-005

Attempt duplicate
walk-in email

MKT-ASSIST-006

Admin filter
assisted-source
bookings

Email already
belongs to active
customer.

Admin booking list
contains assisted
and self-service
bookings.

Booking is created
under selected
customer and
source is marked
assisted.
Search is ranked,
limited, and shows
whether more
matches exist.
Temporary
invite/account is
created and
booking is
attached.
Booking is created
with warning and
placeholder/contact
handling is safe.
System requires
linking existing
customer instead of
creating duplicate.
Assisted booking
source filter returns
correct records.

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Remarks

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 40. Test Case Results of Marketing_Date_Availability_And_Calendar_Management

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

Expected Result

Actual Result

To be tested.

Status
Pending

Remarks

Added from current
ECS repository
review.

TC ID
MKT-CAL-001

Test Activity /
Step Description
View calendar
availability

Precondition /
Test Data
Marketing/Admin
logged in.

MKT-CAL-002

Lock date with no
bookings

Select future date
and set zero
slots/locked.

Calendar shows
confirmed
bookings, pending
bookings, locked
dates, and capacity
hints.
Date becomes
unavailable to
customers and
appears in disabled
dates endpoint.

To be tested.

Pending

Added from current
ECS repository
review.

191

TC ID
MKT-CAL-003

MKT-CAL-004

MKT-CAL-005

Test Activity /
Step Description
Reduce remaining
capacity for booked
day

Precondition /
Test Data
Date has existing
booking below full
capacity.

Reject negative
slot/pax override

Unlock/delete
availability override

Attempt to save
negative remaining
capacity.
Existing
locked/overridden
date.

MKT-CAL-006

Export calendar
PDF

Authorized staff;
valid date range.

Remaining
slots/pax are
reduced without
altering existing
bookings.
Validation rejects
negative values.

Date returns to
rule-based
availability after
override is
removed.
PDF calendar
export is
generated; overly
large ranges are
blocked.

Expected Result

Actual Result

To be tested.

Status
Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Table 41. Test Case Results of Marketing_Operations_Preparation_Board_And_Handoff

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

Expected Result

Actual Result

To be tested.

Status
Pending

TC ID
MKT-OPS-001

Test Activity /
Step Description
Open preparation
board summary

Precondition /
Test Data
Approved/upcomin
g bookings exist.

MKT-OPS-002

Open paginated
preparation board

Many approved
bookings exist.

MKT-OPS-003

Open preparation
detail drawer

Approved booking
with preparation
tasks.

MKT-OPS-004

MKT-OPS-005

Complete
marketing-owned
preparation task
Reopen completed
preparation task

Marketing task
assigned to
Marketing role.
Completed task.

MKT-OPS-006

Attempt to update
non-Marketing task

MKT-OPS-007

Verify preparation
tasks created once

Marketing tries to
update
Accounting/Admin-
only task.
Approve same
booking or repeat
approval path.

Board summary
loads without
fetching every
detail at once.
Board supports
server pagination
and filters.
Kitchen/logistics
tasks, menu,
headcount, venue
notes, and next
actions display.
Task is marked
completed with
timestamp/user.
Task returns to
open state and
audit/history
remains.
Action is denied
according to
role/task
ownership.
Default preparation
tasks are not
duplicated.

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 42. Test Case Results of Marketing_Feedback_And_Testimonial_Review

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

TC ID
MKT-FDBK-001

Test Activity /
Step Description
View feedback
responses

Precondition /
Test Data

Customers
submitted
feedback.

MKT-FDBK-002

Mark low-rating
feedback for follow-
up

Feedback rating
below threshold.

Marketing feedback
queue lists rating,
comment, booking,
follow-up status,
and testimonial
state.
Follow-up-required
status is visible and
can be updated by
staff.

Expected Result

Actual Result

To be tested.

Status
Pending

Remarks

Added from current
ECS repository
review.

To be tested.

Pending

Added from current
ECS repository
review.

192

TC ID
MKT-FDBK-003

Test Activity /
Step Description
Approve feedback
as testimonial

Precondition /
Test Data
Positive feedback
response.

MKT-FDBK-004

Reject feedback as
testimonial

Feedback
unsuitable for
public display.

Approved
testimonial is
available for
customer-facing
use if feature is
enabled.
Response remains
internal and not
published.

Expected Result

Actual Result

To be tested.

Status
Pending

Remarks

Added from current
ECS repository
review.

To be tested.

Pending

Added from current
ECS repository
review.

Table 43. Test Case Results of Marketing_Preview_Pages_And_Documents

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

Expected Result

Actual Result

To be tested.

Status
Pending

TC ID
MKT-PREV-001

Test Activity /
Step Description
Open preview
menu page

Precondition /
Test Data
Marketing/Admin
logged in.

MKT-PREV-002

Open preview
package panel

Marketing/Admin
logged in.

MKT-PREV-003

Open preview
booking wizard

Marketing/Admin
logged in.

MKT-PREV-004

Preview customer
booking

Existing booking
ID.

MKT-PREV-005

Download
preparation PDF

Approved booking
with event/menu
data.

TC ID
MKT-HIST-001

Test Activity /
Step Description
View completed
event history

Precondition /
Test Data

Completed
bookings exist.

MKT-HIST-002

Filter event history
by feedback status

MKT-HIST-003

Add note to
completed event

Completed events
with/without
feedback.

Staff opens
completed event
history detail.

MKT-HIST-004

Attempt to add note
to active event
history endpoint

Booking is not
completed.

Preview renders
customer menu
without requiring
customer account.
Package preview
shows current
public package
cards.
Booking wizard
preview loads
active event types
and no real
booking is
submitted
accidentally.
Marketing/Admin
can view customer-
facing booking
snapshot for
support.
Branded
preparation PDF
downloads with
correct event and
menu details.

Staff event history
shows completed
records only by
default.
Filter returns
records matching
selected feedback
state.
Note is saved with
author/time and
visible to
authorized staff.
System blocks
history note for
non-completed
event where
required.

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Table 44. Test Case Results of Marketing_Staff_Event_History

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Marketing
Executive Module Test Activities

Expected Result

Actual Result

To be tested.

Status
Pending

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

193

Table 45. Test Case Results of Accounting_Dashboard_And_Payment_Monitoring

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Accounting Staff
Module Test Activities

TC ID
ACC-DASH-001

Test Activity /
Step Description
Login as
Accounting Staff

ACC-DASH-002

View payment
summaries

ACC-DASH-003

Filter by payment
status

ACC-DASH-004

View accounting
summary cards

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Accounting user
logged in.

ACC-DASH-005

ACC-DASH-006

ACC-DASH-007

Search finance
booking/payment
tables

Multiple
bookings/payments
exist.

Paginate
accounting finance
tables

More records than
page limit.

Verify active queue
hides completed
bookings by default

Completed and
active bookings
exist.

Expected Result

Actual Result

Accounting view
loads

Accounting view
loads

KPIs and totals are
displayed

KPIs and totals are
displayed

Matching status
appears and
Results update
correctly

Matching status
appears and
Results update
correctly

Dashboard shows
total collected,
pending, overdue,
refund, and
exception KPIs.
Search returns
matching
customer/reference
/payment records.
Pagination
metadata and next
page data load
correctly.
To be tested.

Dashboard shows
total collected,
pending, overdue,
refund, and
exception KPIs.
Search returns
matching
customer/reference
/payment records.
Pagination
metadata and next
page data load
correctly.
Active accounting
queue hides
completed events
unless history/filter
is selected.

Status
Passed

Passed

Passed

Passed

Passed

Passed

Pending

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 46. Test Case Results of Accounting_Payment_Verification_And_Tranche_Tracking

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Accounting Staff
Module Test Activities

TC ID

Test Activity /
Step Description

ACC-VERIFY-001  Open payment

record

ACC-VERIFY-002

Verify reservation
payment

ACC-VERIFY-003  Mark payment as

Failed

ACC-VERIFY-004

Record 70% down
payment

ACC-VERIFY-005

Record final 20%
payment

ACC-VERIFY-006

Enter negative
amount

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original

Expected Result

Actual Result

Payment details
are shown

Payment details
are shown

Status changes to
Verified

Status changes to
Verified

Payment is tagged
failed

Payment is tagged
failed

Status
Passed

Passed

Passed

Balance updates

Not recorded.

Passed

Booking becomes
Fully Paid

Not recorded.

Passed

Validation message
appears

Not recorded.

Not Recorded

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

194

TC ID

Test Activity /
Step Description

ACC-VERIFY-007

Reject payment
with reason

ACC-VERIFY-008

Verify payment
after Marketing
review

ACC-VERIFY-09

ACC-VERIFY-010

ACC-VERIFY-011

ACC-VERIFY-012

Prevent customer
from direct
payment
verification

Prevent verification
of another
customer payment
by client
Void obsolete
pending payment
terms after
schedule
recalculation
Block voiding
locked/refunded
terms

ACC-VERIFY-013

Edit unpaid
payment terms

Precondition /
Test Data
QA data where
applicable.
Pending payment
record under
review.

Booking approved
or staff-reviewed;
pending payment
exists.

Customer attempts
legacy manual
payment endpoint
or accounting
route.
Client manipulates
booking/payment
ID.

Booking
total/schedule
changes with
untouched pending
terms.
Payment term is
paid, touched,
locked, or
connected to
refund case.
Accounting/Admin
user; unpaid terms
exist.

ACC-VERIFY-014

Attempt payment
terms total not
equal 100%

Payment terms
sum to less/more
than 100%.

Expected Result

Actual Result

Status

Remarks

Payment is marked
rejected/failed with
reason; customer is
notified if
configured.
Accounting can
verify eligible
payment and
progress updates
without changing
operational status
incorrectly.
Access is denied
and payment
remains pending.

System rejects
action due to
ownership/role
checks.
Obsolete terms are
voided, not deleted;
active queues
ignore them.

System refuses
void/delete and
preserves financial
record.

New terms save
only when
percentages total
100 and amounts
are valid.
Validation blocks
saving and shows
percentage error.

Payment is marked
rejected/failed with
reason; customer is
notified if
configured.
To be tested.

Passed

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

New terms save
only when
percentages total
100 and amounts
are valid.
To be tested.

Passed

Pending

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 47. Test Case Results of Accounting_Receipts_And_Refunds

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Accounting Staff
Module Test Activities

TC ID

Test Activity /
Step Description

ACC-REFUND-001  Generate receipt

ACC-REFUND-002  Download receipt

ACC-REFUND-003

Log refund request

ACC-REFUND-004  Approve refund

ACC-REFUND-005  View refund queue
for cancelled paid
booking

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Cancelled booking
with paid eligible
payment.

Expected Result

Actual Result

Receipt PDF is
created

Receipt PDF is
created

PDF downloads
successfully

PDF downloads
successfully

Refund record is
created

Refund record is
created

Refund status
changes

Refund status
changes

Refund queue
shows
booking/payment
context and
refundable amount.

Refund queue
shows
booking/payment
context and
refundable amount.

Status
Passed

Passed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

195

Expected Result

Actual Result

To be tested.

Status
Pending

TC ID

Test Activity /
Step Description
ACC-REFUND-006  Process PayMongo

refund success

Precondition /
Test Data

Payment has
provider payment
ID; refund eligible.

ACC-REFUND-007  Handle PayMongo

refund failure

Provider returns
failure.

ACC-REFUND-008  Retry failed

provider refund

ACC-REFUND-009  Process manual

refund action

ACC-REFUND-010  Apply non-
refundable
reservation fee rule

Failed refund case
with provider
payment ID.

Refund case
requires manual
handling.

Cancelled booking
with reservation fee
only or within non-
refundable
condition.

Refund case and
payment status
update to
refunded/complete
d.
Payment remains
paid; refund case is
marked failed with
safe error for staff.
Retry updates
existing case
instead of creating
duplicate.
Manual action
requires notes and
closes/updates
refund case.
Reservation fee is
forfeited/non-
refundable and no
provider refund is
attempted where
rule applies.

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 48. Test Case Results of Accounting_Financial_Reports

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12 2026    |    Module/User: Accounting Staff
Module Test Activities

TC ID

ACC-REPORT-001  View collections

ACC-REPORT-002  Export report

Test Activity /
Step Description

Precondition /
Test Data

report

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Filter by date range  Use current

ACC-REPORT-003

ACC-REPORT-004  View ledger by

date range

ACC-REPORT-005  View reconciliation

tab

ACC-REPORT-006

Filter ledger by
payment method

ACC-REPORT-007  Send payment

reminder

ACC-REPORT-008  Attempt reminder

for paid/voided
payment

deployed ECS
build and original
QA data where
applicable.
Payments exist
across multiple
dates.

Payments include
provider/manual
statuses.

Payments via
PayMongo/card/G
Cash/Maya/manual
exist.
Unpaid
due/overdue
payment exists.

Payment is paid or
voided.

Expected Result

Actual Result

Correct totals are
shown

Not recorded.

Status
Not Recorded

File downloads
successfully

Not recorded.

Not Recorded

Report updates
accurately

Report updates
accurately

Passed

Ledger totals and
records update
accurately to
selected range.
Reconciliation
shows
mismatches/except
ions and normal
paid records.
Only selected
method records
show.

Reminder is
queued/sent only
for valid unpaid
payment record.
System blocks
reminder and
displays safe
message.

Ledger totals and
records update
accurately to
selected range.
Reconciliation
shows
mismatches/except
ions and normal
paid records.
Only selected
method records
show.

Reminder is
queued/sent only
for valid unpaid
payment record.
System blocks
reminder and
displays safe
message.

Passed

Passed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

196

Table 49. Test Case Results of Accounting_Documents_And_Access_Control

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Accounting Staff
Module Test Activities

TC ID
ACC-DOCS-001

Test Activity /
Step Description
Download receipt
for authorized
payment

Precondition /
Test Data
Accounting/Admin
user and valid
payment.

ACC-DOCS-002

Access preparation
PDF from
accounting role

Accounting user
opens preparation
document route.

ACC-DOCS-003

ACC-DOCS-004

Attempt to access
Marketing-only
booking review API
Add finance history
note to completed
event

Accounting user
calls Marketing
API.
Completed event
with finance issue.

Actual Result

Receipt PDF
downloads and
includes correct
payment/booking/c
ustomer details.
To be tested.

To be tested.

To be tested.

Expected Result
Receipt PDF
downloads and
includes correct
payment/booking/c
ustomer details.
Access is allowed
only if policy
permits; otherwise
denied with proper
status.
Access denied by
role middleware.

Accounting note
saves in staff event
history with
author/time.

Status
Passed

Pending

Pending

Pending

Remarks
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Table 50. Test Case Results of Admin_Dashboard

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Admin Module Test
Activities

TC ID
ADM-DASH-001

Test Activity /
Step Description
Login as Admin

ADM-DASH-002

View KPI cards

ADM-DASH-003

View analytics
charts

ADM-DASH-004

ADM-DASH-005

ADM-DASH-006

Open Admin
dashboard
summary endpoint

Verify Admin can
access Marketing
and Accounting
workspaces
Verify dashboard
skeleton/loading
states

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Admin logged in.

Admin logged in.

Throttle network or
reload dashboard.

Expected Result

Actual Result

Admin dashboard
loads

Admin dashboard
loads

Metrics are
displayed correctly

Metrics are
displayed correctly

Charts render
successfully

Charts render
successfully

Overview KPIs load
without server error
and reflect current
database records.
Admin can open
cross-role
dashboards/routes
permitted to Admin.
To be tested.

Overview KPIs load
without server error
and reflect current
database records.
Admin can open
cross-role
dashboards/routes
permitted to Admin.
Loading states are
polished and no
raw loading
text/errors persist.

Status
Passed

Passed

Passed

Passed

Passed

Pending

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

197

Table 51.  Test Case Results of Admin User_Management_And_RBAC

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Admin Module Test
Activities

TC ID

Test Activity /
Step Description

ADM-USERS-001  Open Users page

ADM-USERS-002

Create user
account

ADM-USERS-003

Assign role

ADM-USERS-004

Edit user
information

ADM-USERS-005

Deactivate user

ADM-USERS-006

ADM-USERS-007

Attempt
unauthorized page
access using lower
role

Create Marketing
staff account

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Admin user; valid
staff fields and role
Marketing.

ADM-USERS-008

Create Accounting
staff account

Admin user; valid
staff fields and role
Accounting.

ADM-USERS-009

Create Admin
account

Admin user; valid
new Admin fields.

ADM-USERS-010

Reset temporary
password

Existing active staff
account.

ADM-USERS-011

Reveal temporary
password before
expiry/use

Active temporary
password exists.

ADM-USERS-012

Reveal expired
temporary
password

Temporary
password already
expired.

ADM-USERS-013

Force staff
password change

Active staff
account.

ADM-USERS-014

Deactivate staff
with active
ownership

Staff owns
bookings/conversat
ions/tasks.

Expected Result

Actual Result

User list is
displayed

User list is
displayed

Status
Passed

New user is saved

New user is saved

Passed

Permissions
update accordingly

Permissions
update accordingly

Passed

Changes are saved  Changes are saved

Passed

User can no longer
log in

User can no longer
log in

Passed

Access denied
page appears

Not recorded.

Not Recorded

Staff account is
created with
temporary
password and
required password-
change state.
Accounting account
is created and can
access Accounting
dashboard after
required password
change.
Admin account is
created; protected
deactivation rules
still apply.
Temporary
password is
generated,
emailed/logged,
expires within
allowed period, and
user must change
it.
Admin can reveal
temporary
password until it
expires or is used;
it is not shown in
employee list.
System clears
secret and reports
that it is no longer
available.
User is redirected
to required
password change
before accessing
dashboard.
Account is
deactivated and
active operational

Staff account is
created with
temporary
password and
required password-
change state.
Accounting account
is created and can
access Accounting
dashboard after
required password
change.
Admin account is
created; protected
deactivation rules
still apply.
Temporary
password is
generated,
emailed/logged,
expires within
allowed period, and
user must change
it.
Admin can reveal
temporary
password until it
expires or is used;
it is not shown in
employee list.
System clears
secret and reports
that it is no longer
available.
User is redirected
to required
password change
before accessing
dashboard.
It works but wrong
Feedback, it

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Passed

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

198

TC ID

Test Activity /
Step Description

Precondition /
Test Data

Expected Result

Actual Result

Status

Remarks

ADM-USERS-015

Reactivate staff
account

Deactivated staff
account.

ownership is
released without
erasing history.
Account becomes
active and can log
in if password
requirements are
satisfied.

ADM-USERS-016

Verify lower role
cannot access
Admin APIs

Client/Marketing/Ac
counting users
attempt Admin
endpoint.

Access is denied
and request
reference/error is
safe.

returns “No email
was sent”

Did not work. The
name changes to
“deactivated
account” which
prevents the user
from logging in.
To be tested.

Fail

Added from current
ECS repository
review.

Pending

Added from current
ECS repository
review.

Table 52. Test Case Results of Admin_Analytics_Dashboard

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Admin Module Test
Activities

TC ID

ADM-ANALYTICS-
001

Test Activity /
Step Description
View monthly
revenue chart

ADM-ANALYTICS-
002

View package
popularity chart

ADM-ANALYTICS-
003

View event type
distribution

ADM-ANALYTICS-
004

View moving
average forecast

ADM-ANALYTICS-
005

View linear
regression forecast

ADM-ANALYTICS-
006

Change date filters

ADM-ANALYTICS-
007

View analytics
summary endpoint

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Admin dashboard;
real
booking/payment
data exists.

ADM-ANALYTICS-
008

View revenue
analytics block

Paid/verified
payments exist.

ADM-ANALYTICS-
009

View pipeline
analytics block

Bookings in
multiple statuses.

ADM-ANALYTICS-
010

View menu
performance block

Bookings with
selected menu
items/packages.

ADM-ANALYTICS-
011

View customer
experience
analytics

Feedback/contact/c
hat records exist.

Expected Result

Actual Result

Chart displays
correct data

Chart displays
correct data

Rankings are
correct

Rankings are
correct

Status
Passed

Passed

Counts match
database

Not recorded.

Not Recorded

Forecast is
generated

Forecast is
generated

Revenue prediction
is generated

Revenue prediction
is generated

Charts refresh
correctly

Charts refresh
correctly

Passed

Passed

Passed

Summary uses real
data and labels no-
data/insufficient
history states
clearly.
Revenue
charts/totals match
ledger data for
selected filters.
Pipeline counts
reflect booking
statuses and
conversion funnel
where applicable.
Top
dishes/packages
and revenue
contribution are
calculated
correctly.
Customer
experience metrics
display without

To be tested.

Pending

Revenue
charts/totals match
ledger data for
selected filters.
To be tested.

Top
dishes/packages
and revenue
contribution are
calculated
correctly.
To be tested.

Passed

Pending

Passed

Pending

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

199

TC ID

Test Activity /
Step Description

Precondition /
Test Data

Expected Result

Actual Result

Status

Remarks

ADM-ANALYTICS-
012

View operations
analytics

Preparation tasks
and event statuses
exist.

ADM-ANALYTICS-
013

View forecast
insufficient history
state

Database has
insufficient
historical data.

ADM-ANALYTICS-
014

View SLR/SMA
forecast metadata

Enough historical
data available.

ADM-ANALYTICS-
015

Change analytics
filters

Admin selects
date/event/package
filters.

exposing private
message bodies.
Operations metrics
reflect task
completion and
event workflow
status.
Forecast section
explains insufficient
data rather than
showing
fake/synthetic
values.
Forecast includes
method metadata
and model
evaluation metrics
where available.
All analytics blocks
refresh consistently
and totals remain
internally
consistent.

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 53.  Test Case Results of Admin_Pricing_Configuration

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Admin Module
Test Activities

TC ID
ADM-PRICE-001

Test Activity /
Step Description
Open Pricing
Settings

ADM-PRICE-002

Update overtime
fee

ADM-PRICE-003

Update high-rise
service fee

ADM-PRICE-004

Enter invalid
numeric value

ADM-PRICE-005

Create dish pricing
override

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Existing menu item
and valid price.

ADM-PRICE-006

Remove or update
pricing override

Existing override.

ADM-PRICE-007

Update global
business settings

Admin opens
settings.

ADM-PRICE-008

Update payment
rules

Admin edits lead
days, capacity, and
payment
percentages.

Expected Result

Actual Result

Configuration form
is displayed

Not recorded.

Status
Not Recorded

New value is saved  Not recorded.

Not Recorded

New value is saved  Not recorded.

Not Recorded

Validation message
appears

Not recorded.

Not Recorded

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Override saves and
customer-facing
pricing recalculates
after refresh/cache
invalidation.
New pricing is
reflected in
admin/menu/bookin
g estimates while
historical bookings
remain preserved.
Company/profile/bu
siness values save
and display on
relevant
website/dashboard
surfaces.
Rules save only
when valid and
affect new
booking/payment
schedules.

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

200

TC ID
ADM-PRICE-009

ADM-PRICE-010

Test Activity /
Step Description
Reject invalid
payment rule
percentages

Precondition /
Test Data

Payment
percentages do not
total 100%.

Verify Marketing
cannot edit
payment rules

Marketing user
attempts Admin
payment rules
endpoint.

Validation blocks
save and existing
rules remain
unchanged.
Access denied.

Expected Result

Actual Result

To be tested.

Status
Pending

To be tested.

Pending

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 54.  Test Case Results of Admin_Event_Types_and_System_Settings

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 10, 2026    |    Module/User: Admin Module Test
Activities

TC ID

ADM-SETTINGS-
001

Test Activity /
Step Description
Add event type

ADM-SETTINGS-
002

Edit event type

ADM-SETTINGS-
003

Delete event type

ADM-SETTINGS-
004

Update company
information

ADM-SETTINGS-
005

Archive event type

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Active event type
exists.

ADM-SETTINGS-
006

Reactivate or
recreate event type
safely

Archived/deleted
event type or new
slug.

ADM-SETTINGS-
007

Create menu item
from Admin catalog

ADM-SETTINGS-
008

Edit menu item
availability

Valid menu fields
including
category/price/imag
e.
Existing menu item.  Availability

ADM-SETTINGS-
009

Delete/archive
menu item with
history

Menu item used in
booking.

ADM-SETTINGS-
010

Create package
from Admin catalog

Valid package with
event type
association.

Expected Result
Event type is saved  Event type is saved

Actual Result

Status
Passed

Remarks

Existing QA draft; retain
and retest on current build.

Changes are
reflected

Changes are
reflected

Passed

Existing QA draft; retain
and retest on current build.

Event type is
removed or
archived

Event type is
removed or
archived

Passed

Existing QA draft; retain
and retest on current build.

Changes appear
on website

Changes worked
but didn’t show up

Passed

Existing QA draft; retain
and retest on current build.

Event type is
hidden from public
choices without
rewriting booking
history.
System prevents
duplicate slug
conflicts and active
list updates
correctly.
Item is saved and
appears in public
menu if active.

changes affect
public catalog while
admin record
persists.
System preserves
historical booking
data and hides item
from new
selections.
Package appears
in customer
booking for
matching event
type.

Event type is
hidden from public
choices without
rewriting booking
history.
To be tested.

Item is saved and
appears in public
menu if active.

Availability
changes affect
public catalog while
admin record
persists.
System preserves
historical booking
data and hides item
from new
selections.
Package appears
in customer
booking for
matching event
type.

Passed

Added from current ECS
repository review.

Fail

Added from current ECS
repository review.

Passed

Passed

Added from current ECS
repository review.

Added from current ECS
repository review.

Passed

Added from current ECS
repository review.

Passed

Added from current ECS
repository review.

201

Table 55.  Test Case Results of Admin_Audit_And_Logs

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Admin Module Test
Activities

TC ID
ADM-AUDIT-001

Test Activity /
Step Description
View activity logs

ADM-AUDIT-002

Search logs

ADM-AUDIT-003

Filter audit logs by
actor/target/action

ADM-AUDIT-004

ADM-AUDIT-005

ADM-AUDIT-006

Verify sensitive
fields are redacted
in audit

Verify operational
actions create audit
entries

Normalize legacy
audit metadata in
UI

Precondition /
Test Data

Use current
deployed ECS
build and original
QA data where
applicable.
Use current
deployed ECS
build and original
QA data where
applicable.
Audit log contains
multiple
staff/customer
actions.

Action changes
password/OTP/me
ssage/secret
values.

Staff performs
booking/status/pay
ment/account
action.
Legacy audit rows
exist.

Expected Result

Actual Result

Recent system
actions are listed

Recent system
actions are listed

Matching records
are displayed

Matching records
are displayed

Status
Passed

Passed

Passed

Pending

Matching audit
records display
with user, target,
action,
method/route, and
timestamp.
To be tested.

To be tested.

Pending

To be tested.

Pending

Remarks

Existing QA draft;
retain and retest on
current build.

Existing QA draft;
retain and retest on
current build.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 56.  Test Case Results of Admin_Customer_Account_Management

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Admin Module Test
Activities

Expected Result

Actual Result

TC ID

ADM-
CUSTOMERS-001

Test Activity /
Step Description
Open customer
management list

ADM-
CUSTOMERS-002

Update customer
profile information

ADM-
CUSTOMERS-003

Deactivate
customer with
bookings

Precondition /
Test Data
Admin logged in;
customer accounts
exist.

Admin edits
allowed customer
fields.
Customer has
active/historical
bookings.

ADM-
CUSTOMERS-004

Reactivate
customer account

Deactivated
customer.

ADM-
CUSTOMERS-005

Verify deactivated
customers hidden
from default lists

Customer
deactivated.

ADM-
CUSTOMERS-006

Verify deactivating
customer archives
active chats

Customer has
active
conversations.

Customer list loads
active customers
by default and
supports
search/pagination.
Permitted fields
save and audit
entry is recorded.
Customer is
deactivated safely;
bookings/history
remain preserved.
Customer becomes
active and can
access account
according to
password/verificati
on state.
To be tested.

Status
Passed

Passed

Passed

Passed

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Pending

Added from current
ECS repository
review.

To be tested.

Pending

Added from current
ECS repository
review.

202

Matching audit
records display
with user, target,
action,
method/route, and
timestamp.
Audit log does not
store raw
passwords, OTPs,
message bodies, or
secrets.
Audit record is
created with safe
target context.

Admin audit
endpoint
normalizes older
metadata into
readable UI shape.

Customer list loads
active customers
by default and
supports
search/pagination.
Permitted fields
save and audit
entry is recorded.
Customer is
deactivated safely;
bookings/history
remain preserved.
Customer becomes
active and can
access account
according to
password/verificati
on state.
Default
customer/marketin
g search excludes
deactivated
accounts unless
include option/filter
is used.
Chats are
archived/closed
and placeholder
data does not
appear in active
queues.

Table 57.  Test Case Results of Admin_Booking_Oversight_And_Discounts

Tested By: Tyron Jude G. Duran   |    Date Tested / Updated: June 12, 2026    |    Module/User: Admin Module Test
Activities

TC ID

ADM-BOOKINGS-
001

Test Activity /
Step Description
View all bookings
as Admin

Precondition /
Test Data
Bookings across all
statuses exist.

ADM-BOOKINGS-
002

Filter Admin
booking list by
status/date/source

ADM-BOOKINGS-
003

Update booking
status as Admin

Bookings have
varied
statuses/dates/sour
ces.
Existing booking
eligible for status
update.

ADM-BOOKINGS-
004

Apply custom
discount

Eligible booking;
valid discount
amount/percent.

ADM-BOOKINGS-
005

Reject
excessive/negative
discount

Discount exceeds
allowed amount or
is negative.

Expected Result

Actual Result

Admin list shows
booking, customer,
schedule, venue,
menu, payments,
status, and owner
context.
Filters return
matching records
and pagination
remains correct.
Status change
saves,
customer/staff
views update, and
audit/notification is
created where
applicable.
Discount affects
invoice/payment
schedule/ledger
calculations
correctly.
Validation blocks
save and totals
remain unchanged.

Admin list shows
booking, customer,
schedule, venue,
menu, payments,
status, and owner
context.
Filters return
matching records
and pagination
remains correct.
It doesn’t work
when u open
marketing module
from admin
account

Discount affects
invoice/payment
schedule/ledger
calculations
correctly.
To be tested.

Status
Passed

Passed

Fail

Passed

Pending

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 58.  Test Case Results of Admin_Report_Builder_And_Exports

Tested By: Tyron Jude G. Duran    |    Date Tested / Updated: June 12, 2026    |    Module/User: Admin Module Test
Activities

TC ID

ADM-REPORTS-
001

Test Activity /
Step Description
Open report
widgets library

Precondition /
Test Data
Admin logged in.

ADM-REPORTS-
002

Preview custom
report

Select blocks and
filters.

ADM-REPORTS-
003

Save report
template

ADM-REPORTS-
004

Update report
template

ADM-REPORTS-
005

Archive report
template

Template name,
description,
selected blocks,
filters.
Existing template.

Existing template.

ADM-REPORTS-
006

Delete report
template where
allowed

Template eligible
for deletion.

ADM-REPORTS-
007

Run saved report

Saved template
with filters.

ADM-REPORTS-
008

Export report
PDF/CSV

Completed report
run.

Expected Result

Actual Result

To be tested.

Status
Pending

Report
blocks/widgets load
and are readable.
Preview shows
selected blocks
and excludes
unselected blocks.
Template saves
and appears in
report template list.

Changes save and
reload correctly.

Template is hidden
from active list but
retained as
archived record.
Template is
removed or
rejected according
to preservation
rules.
Report run record
is created and
status/result is
available.
Export downloads
readable
PDF/spreadsheet
without
unnecessary
technical fields.

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Remarks

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.
Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

203

TC ID

ADM-REPORTS-
009

Test Activity /
Step Description
Reject heavy report
abuse

Precondition /
Test Data
Rapid repeated
report
previews/runs.

Expected Result

Actual Result

Report-heavy
throttling applies.

To be tested.

Status
Pending

Remarks

Added from current
ECS repository
review.

Table 59. Test Case Results of Admin_System_Delivery_Diagnostics

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Admin Module
Test Activities

Expected Result

Actual Result

To be tested.

Status
Pending

Remarks

Added from current
ECS repository
review.

TC ID
ADM-DIAG-001

Test Activity /
Step Description
Open system
delivery diagnostics

Precondition /
Test Data
Admin logged in.

ADM-DIAG-002

Send diagnostic
email

Mail/log mailer
configured.

ADM-DIAG-003

Verify missing mail
configuration
warning

Mail not configured
in environment.

ADM-DIAG-004

Verify PayMongo
webhook endpoint
guidance

Admin diagnostics
page.

Diagnostics show
mail, queue,
PayMongo
webhook, storage,
and environment
guidance without
exposing secrets.
Diagnostic email
queues/sends or
reports safe
configuration issue.
System reports
missing mail config
and suggests
manual/log fallback
safely.
System displays
correct deployment
guidance without
user-specific ngrok
paths.

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Table 60. Test Case Results of Admin_Announcement_CMS_Admin_Control

Tested By: Rafael Angelo P. Buscano    |    Date Tested / Updated: June 10, 2026    |    Module/User: Admin Module
Test Activities

Expected Result

Actual Result

To be tested.

Status
Pending

TC ID
ADM-CMS-001

Test Activity /
Step Description
List
announcements
with pagination

Precondition /
Test Data

Many
announcements
exist.

ADM-CMS-002

ADM-CMS-003

ADM-CMS-004

Select
announcement
audience users

Preview
announcement
page

Delete
announcement
where allowed

Customer/staff
accounts exist.

Draft/published
announcement
exists.

Announcement
eligible for deletion.

Admin list
paginates and
filters without
loading all records
unnecessarily.
Audience picker
loads eligible users
and respects
role/status filters.
Preview page
renders
announcement
without publishing
it.
Record is removed
or safely blocked
according to
state/history.

To be tested.

Pending

To be tested.

Pending

To be tested.

Pending

Remarks

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

Added from current
ECS repository
review.

4.1.2.  System Evaluation

For the Beta testing, the ISO/IEC 25010 software quality model was used as

the basis for the guide questionnaire, which was tested by the chosen respondents

204

while  navigating  the  website.  The  evaluation  focused  on  the  nine  (9)  quality

characteristics  of  ISO/IEC  25010,  namely  Functional  Suitability,  Performance

Efficiency,  Compatibility,

Interaction  Capability,  Reliability,  Security,

Maintainability, Flexibility, and Safety. Each category contains ten (10) questions

that correspond to its specific quality characteristic. The Likert scale was used to

determine  the  level  of  quality  based  on  the  performed  tasks  while  navigating  the

website, with 5 being the highest and 1 being the lowest. The weighted mean of each

result was taken and matched to the scale score to determine its equivalent verbal

interpretation, as shown in table 12.

Table 61. Profile of the Respondents

Group

Customer

Personnel

IT Expert

Total

f

10

5

5

20

%

50%

25%

25%

100&

Table 62. ISO/IEC 25010 Functional Suitability Evaluation Results from
Customer Group of Respondents

Functional
Suitability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS provides
the functions needed
to manage catering
services from
booking submission
to event preparation.

2. The ECS
produces correct
booking details,
menu selections,
payment records,

0

0

0

1

9

10

4.9

0

0

0

1

9

10

4.9

Strongly
Agree

Strongly
Agree

205

reports, and system
summaries.

3. The ECS
correctly applies
established business
rules when
processing
bookings, payments,
refunds, and other
system actions.

4. The ECS enables
users to complete
their assigned
catering
management tasks
without relying on
unnecessary manual
processes.

5. The ECS provides
functions that are
appropriate for the
intended
responsibilities of
customers, staff
members, and
administrators.

0

0

1

2

7

10

4.6

0

0

0

1

9

10

4.9

0

0

0

2

8

10

4.8

Strongly
Agree

Strongly
Agree

Strongly
Agree

TOTAL

4.82

Strongly
Agree

Table 61 presents the ISO/IEC 25010 functional suitability evaluation results of

the ten (10) customer respondents who evaluated the ECS based on its functional

suitability. The mean of the criterion with the total of five (5) questions is 4.82, which

tells that based on the respondents, the overall functional suitability of the ECS is

strongly agree.

This means that the customer respondents strongly agreed that the ECS provides

the needed functions for managing catering services, from booking submission to

event preparation. It also shows that the system produces correct booking  details,

menu selections, payment records, reports, and system summaries. Overall, the result

indicates that the ECS is suitable for the intended responsibilities of customers, staff

206

members,  and  administrators  because  it  helps  them  complete  their  catering

management tasks properly and efficiently.

Table 63. ISO/IEC 25010 Performance Efficiency Evaluation Results from
Customer Group of Respondents

Performance
Efficiency

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS loads
pages, dashboards,
forms, and records
within a reasonable
amount of time.

2. The ECS
promptly completes
submitted updates,
calculations,
searches, filters, and
report-generation
requests.

3. The ECS remains
responsive when
multiple records,
transactions, or
system activities are
processed.

4. The ECS operates
without causing
excessive device,
browser, or network
slowdown during
normal use.

5. The ECS
maintains acceptable
performance as the
number of users,
bookings, menu
items, payments,
and reports
increases.

0

0

0

3

7

10

4.7

0

0

0

2

8

10

4.8

0

0

0

3

7

10

4.7

0

0

0

1

9

10

4.9

0

0

0

3

7

10

4.7

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

TOTAL

4.7

Strongly
Agree

Table 62 presents the ISO/IEC 25010 performance efficiency evaluation results

of  the  ten  (10)  customer  respondents  who  evaluated  the  ECS  based  on  its

performance efficiency. The mean of the criterion with the total of five (5) questions

207

is 4.7, which tells that based on the respondents, the overall performance efficiency

of the ECS is strongly agree.

This means that the customer respondents strongly agreed that the ECS performs

efficiently  in  terms  of  loading  pages,  dashboards,  forms,  and  records  within  a

reasonable  time.  It  also  shows  that  the  system  promptly  completes  updates,

calculations,  searches,  filters,  and  report-generation  requests.  Overall,  the  result

indicates  that  the  ECS  remains  responsive  and  maintains  acceptable  performance

even when several records, bookings, payments, reports, and other system activities

are being processed.

Table 64. ISO/IEC 25010 Compatibility Evaluation Results from Customer
Group of Respondents

Compatibility

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS works
properly on its
supported web
browsers and
devices.

2. The ECS can be
used alongside other
common work
applications without
disrupting their
normal operation.

3.

The ECS correctly
exchanges
information with
connected services
such as online
payment, email, and
real-time
notification services.

4. The ECS
produces receipts,
reports, and
exported records
that can be opened
using common
applications.

0

1

0

0

9

10

4.7

0

0

1

1

8

10

4.7

0

0

0

1

9

10

4.9

0

0

0

2

8

10

4.8

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

208

5. The ECS
maintains consistent
information when
records move
between customer,
staff, administrator,
and connected-
service workflows.

0

0

1

2

7

10

4.6

Strongly
Agree

TOTAL

4.7

Strongly
Agree

Table 63 presents the ISO/IEC 25010 compatibility evaluation results of the ten

(10) customer respondents who evaluated the ECS based on its compatibility. The

mean of the criterion with the total of five (5) questions is 4.7, which tells that based

on the respondents, the overall compatibility of the ECS is strongly agree.

This means that the customer respondents strongly agreed that the ECS works

properly on its supported web browsers and devices. It also shows that the system

can  be  used  alongside  other  common  work  applications  without  disrupting  their

normal  operation.  Overall,  the  result  indicates  that  the  ECS  is  compatible  with

connected  services  such  as  online  payment,  email,  and  real-time  notification

services,  while  also  maintaining  consistent  information  across  customer,  staff,

administrator, and connected-service workflows.

Table 65. ISO/IEC 25010 Interaction Capability Evaluation Results from
Customer Group of Respondents

Interaction
Capability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS makes
the purpose of its
pages, controls, and
available actions
easy to recognize.

0

0

0

2

8

10

4.8

Strongly
Agree

209

2. The ECS allows
new users to learn
how to complete
their intended tasks
within a reasonable
amount of time.

3. The ECS provides
clear navigation,
controls, and
workflows for
completing system
tasks.

4. The ECS helps
users prevent,
identify, and correct
errors before
submitting
information.

5. The ECS presents
instructions,
messages, and
interface content
that are
understandable to
users with different
levels of technical
experience.

0

0

1

2

7

10

4.6

0

0

0

1

9

10

4.9

0

0

1

0

9

10

4.8

0

0

0

2

8

10

4.8

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

TOTAL

4.8

Strongly
Agree

Table 64 presents the ISO/IEC 25010 interaction capability evaluation results of

the ten (10) customer respondents who evaluated the ECS based on its interaction

capability. The mean of the criterion with the total of five (5) questions is 4.8, which

tells that based on the respondents, the overall interaction capability of the ECS is

strongly agree.

This means that the customer respondents strongly agreed that the ECS is easy

to understand and interact with. It shows that the system makes its pages, controls,

and available actions easy to recognize, while also allowing new users to learn how

to  complete  their  tasks  within  a  reasonable  amount  of  time.  Overall,  the  result

indicates that the ECS provides clear navigation, understandable instructions, and

210

helpful  messages  that  guide  users  in  completing  system  tasks  and  preventing,

identifying, and correcting errors before submitting information.

Table 66. ISO/IEC 25010 Reliability Evaluation Results from Customer
Group of Respondents

Reliability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS
performs its
intended functions
without unexpected
errors during normal
use.

2. The ECS keeps
required functions
and records
available when users
need them.

3. The ECS
preserves submitted
information and user
progress during
temporary
interruptions
whenever possible.

4. The ECS restores
required records and
system functions
after recoverable
failures or
interruptions.

5. The ECS prevents
duplicate, missing,
incomplete, or
inconsistent records
during important
transactions.

0

0

0

1

9

10

4.9

0

0

0

1

9

10

4.9

0

0

0

1

9

10

4.9

0

0

0

1

9

10

4.9

1

0

0

0

9

10

4.6

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

TOTAL

4.8

Strongly
Agree

Table 65 presents the ISO/IEC 25010 reliability evaluation results of the ten (10)

customer respondents who evaluated the ECS based on its reliability. The mean of

the criterion with the total of five (5) questions is 4.8, which tells that based on the

respondents, the overall reliability of the ECS is strongly agree.

211

This means that the customer respondents strongly agreed that the ECS performs

its intended functions without unexpected errors during normal use. It also shows

that the system keeps required functions and records available when users need them,

preserves submitted information and user progress during temporary interruptions,

and  restores  records  and  system  functions  after  recoverable  failures.  Overall,  the

result  indicates  that  the  ECS  is  reliable  in  supporting  important  transactions  and

helps prevent duplicate, missing, incomplete, or inconsistent records.

Table 67. ISO/IEC 25010 Security Evaluation Results from Customer Group
of Respondents

Security

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS protects
personal, booking,
payment, account,
and operational
information from
unauthorized
disclosure.

2. The ECS restricts
features and records
9according to each
user's authorized
role.

3. The ECS verifies
user identities
before providing
access to protected
accounts and
functions.

4. The ECS prevents
or detects
unauthorized
changes to sensitive
information and
system records.

5. The ECS records
important actions
with sufficient
details to identify
who performed
them and what was
changed.

0

0

0

1

9

10

4.9

0

0

0

0

10

10

5.0

0

0

0

2

8

10

4.8

0

0

1

0

9

10

4.8

0

0

0

1

9

10

4.9

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

212

TOTAL

4.9

Strongly
Agree

Table 66 presents the ISO/IEC 25010 security evaluation results of the ten (10)

customer respondents who evaluated the ECS based on its security. The mean of the

criterion  with  the  total  of  five  (5)  questions  is  4.9,  which  tells  that  based  on  the

respondents, the overall security of the ECS is strongly agree.

This means that the customer respondents strongly agreed that the ECS protects

personal,  booking,  payment,  account,  and  operational

information

from

unauthorized disclosure. It also shows that the system properly restricts features and

records according to each user’s authorized role and verifies user identities before

granting access to protected accounts and functions. Overall, the result indicates that

the ECS provides strong security by preventing or detecting unauthorized changes

to sensitive information and keeping  records of important actions to identify who

performed them and what was changed.

Table 68. ISO/IEC 25010 Maintainability Evaluation Results from Customer
Group of Respondents

Maintainability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS allows
changes to one
system area without
unnecessarily
disrupting unrelated
system functions.

2. The ECS applies
shared components,
rules, and
information
consistently across
related system areas.

3. The ECS provides
clear logs, records,
and messages that
help authorized

0

0

0

2

8

10

4.8

0

0

0

2

8

10

4.8

0

0

0

2

8

10

4.8

Strongly
Agree

Strongly
Agree

Strongly
Agree

213

personnel identify
the cause of system
issues.

4. The ECS allows
authorized changes
and corrections to be
implemented
without
unnecessarily
affecting the entire
system.

5. The ECS allows
updated or corrected
functions to be
tested to confirm
that they continue to
work properly.

0

0

0

1

9

10

4.9

0

0

0

1

9

10

4.9

Strongly
Agree

Strongly
Agree

TOTAL

4.8

Strongly
Agree

Table 67 presents the ISO/IEC 25010 maintainability evaluation results of the

ten (10) customer respondents who evaluated the ECS based on its maintainability.

The mean of the criterion with the total of five (5) questions is 4.8, which tells that

based on the respondents, the overall maintainability of the ECS is strongly agree.

This means that the customer respondents strongly agreed that the ECS can be

maintained  and  updated  without  unnecessarily  disrupting  unrelated  system

functions.  It  also  shows  that  the  system  applies  shared  components,  rules,  and

information consistently across related system areas. Overall, the result indicates that

the ECS supports maintainability by providing clear logs, records, and messages that

help  authorized  personnel  identify  system  issues,  implement  corrections,  and  test

updated functions to ensure that they continue to work properly.

Table 69. ISO/IEC 25010 Flexibility Evaluation Results from Customer
Group of Respondents

Flexibility

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

214

1. The ECS adapts
to different event
types, guest counts,
menu selections,
venues, payment
schedules, and
booking conditions.

2. The ECS allows
authorized users to
adjust business rules
and system settings
when operational
requirements
change.

3. The ECS supports
increasing numbers
of users, bookings,
transactions,
records, and reports
as business demand
grows.

4. The ECS can be
accessed or
deployed in
supported
environments
without requiring
complicated
installation
procedures.

5. The ECS allows
individual
components or
connected services
to be updated or
replaced without
replacing the entire
system.

0

0

0

1

9

10

4.9

0

1

0

0

9

10

4.7

0

0

0

0

10

10

5.0

0

0

0

1

9

10

4.9

0

0

0

1

9

10

4.9

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

TOTAL

4.9

Strongly
Agree

Table 68 presents the ISO/IEC 25010 flexibility evaluation results of the ten (10)

customer respondents who evaluated the ECS based on its flexibility. The mean of

the criterion with the total of five (5) questions is 4.9, which tells that based on the

respondents, the overall flexibility of the ECS is strongly agree.

This means that the customer respondents strongly agreed that the ECS can adapt

to different event types, guest counts, menu selections, venues, payment schedules,

and booking conditions. It also shows that the system supports changes in business

215

rules, system settings, and operational requirements when needed. Overall, the result

indicates that the ECS is flexible because it can handle increasing numbers of users,

bookings,  transactions,  records,  and  reports,  while  also  allowing  supported

environments,  components,  and  connected  services  to  be  updated  or  replaced

without affecting the entire system.

Table 70. ISO/IEC 25010 Safety Evaluation Results from Customer Group of
Respondents

Safety

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS applies
operational
restrictions that
prevent users from
completing actions
that violate
established business
rules.

2. The ECS
identifies invalid or
risky conditions
before they cause
incorrect financial
or operational
records.

3. The ECS prevents
an action from
continuing when a
detected error or
failure could cause
significant
problems.

4. The ECS clearly
warns users before
actions that may
significantly affect
bookings, payments,
refunds,
cancellations, or
records.

5. The ECS works
with connected
services without
creating unsafe,
incomplete, or
inconsistent system
records.

0

0

1

1

8

10

4.7

0

1

0

1

8

10

4.6

0

0

0

2

8

10

4.8

0

0

1

0

8

10

4.8

0

0

1

1

8

10

4.7

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

216

TOTAL

4.7

Strongly
Agree

Table 69 presents the ISO/IEC 25010 safety evaluation results of the ten (10)

customer respondents who evaluated the ECS based on its safety. The mean of the

criterion  with  the  total  of  five  (5)  questions  is  4.7,  which  tells  that  based  on  the

respondents, the overall safety of the ECS is strongly agree.

This means that the customer respondents strongly agreed that the ECS applies

operational  restrictions  that  prevent  users  from  completing  actions  that  violate

established business rules. It also shows that the system can identify invalid or risky

conditions before they cause incorrect financial or operational records. Overall, the

result indicates that the ECS supports safety by preventing actions from continuing

when  errors  or  failures  may  cause  significant  problems,  warning  users  before

important changes are made, and working with connected services without creating

unsafe, incomplete, or inconsistent system records.

Table 71. ISO/IEC 25010 Functional Suitability Evaluation Results from
Personnel Group of Respondents

Functional
Suitability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS provides
the functions needed
to manage catering
services from
booking submission
to event preparation.

2. The ECS
produces correct
booking details,
menu selections,
payment records,
reports, and system
summaries.

3. The ECS
correctly applies
established business

0

0

0

0

5

5

5

Strongly
Agree

0

0

0

0

5

0

0

0

0

5

5

5

5

5

Strongly
Agree

Strongly
Agree

217

rules when
processing
bookings, payments,
refunds, and other
system actions.

4. The ECS enables
users to complete
their assigned
catering
management tasks
without relying on
unnecessary manual
processes.

5. The ECS provides
functions that are
appropriate for the
intended
responsibilities of
customers, staff
members, and
administrators.

0

0

1

0

4

5

4.6

0

0

0

0

5

5

5

Strongly
Agree

Strongly
Agree

TOTAL

4.92

Strongly
Agree

Table 70 presents the ISO/IEC 25010 functional suitability evaluation results of

the five (5) personnel respondents who evaluated the ECS based on its functional

suitability. The mean of the criterion with the total of five (5) questions is 4.92, which

tells that based on the respondents, the overall functional suitability of the ECS is

strongly agree.

This means that the personnel respondents strongly agreed that the ECS provides

the needed functions for managing catering services, from booking submission to

event preparation. It also shows that the system produces correct booking  details,

menu  selections,  payment  records,  reports,  and  system  summaries,  while  also

applying  established  business  rules  for  bookings,  payments,  refunds,  and  other

system actions. Overall, the result indicates that the ECS strongly supports functional

suitability because it helps customers, staff members, and administrators complete

218

their  assigned  catering  management  tasks  using  appropriate  and  reliable  system

functions.

Table 72. ISO/IEC 25010 Performance Efficiency Evaluation Results from
Personnel Group of Respondents

Performance
Efficiency

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS loads
pages, dashboards,
forms, and records
within a reasonable
amount of time.

2. The ECS
promptly completes
submitted updates,
calculations,
searches, filters, and
report-generation
requests.

3. The ECS remains
responsive when
multiple records,
transactions, or
system activities are
processed.

4. The ECS operates
without causing
excessive device,
browser, or network
slowdown during
normal use.

5. The ECS
maintains acceptable
performance as the
number of users,
bookings, menu
items, payments,
and reports
increases.

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

1

4

5

4.8

0

0

0

0

5

5

5

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

TOTAL

4.96

Strongly
Agree

Table 71 presents the ISO/IEC 25010 performance efficiency evaluation results

of  the  five  (5)  personnel  respondents  who  evaluated  the  ECS  based  on  its

performance efficiency. The mean of the criterion with the total of five (5) questions

219

is 4.96, which tells that based on the respondents, the overall performance efficiency

of the ECS is strongly agree.

This means that the personnel respondents strongly agreed that the ECS performs

efficiently  in  loading  pages,  dashboards,  forms,  and  records  within  a  reasonable

amount  of  time.  It  also  shows  that  the  system  promptly  completes  updates,

calculations,  searches,  filters,  and  report-generation  requests.  Overall,  the  result

indicates that the ECS strongly supports performance efficiency because it remains

responsive during multiple records, transactions,  and system  activities, while also

maintaining acceptable performance as the number of users, bookings, menu items,

payments, and reports increases.

Table 73. ISO/IEC 25010 Compatibility Evaluation Results from Personnel
Group of Respondents

Compatibility

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS works
properly on its
supported web
browsers and
devices.

2. The ECS can be
used alongside other
common work
applications without
disrupting their
normal operation.

3.

The ECS correctly
exchanges
information with
connected services
such as online
payment, email, and
real-time
notification services.

4. The ECS
produces receipts,
reports, and
exported records
that can be opened

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

220

using common
applications.

5. The ECS
maintains consistent
information when
records move
between customer,
staff, administrator,
and connected-
service workflows.

0

0

0

0

5

5

5

Strongly
Agree

TOTAL

5

Strongly
Agree

Table 72 presents the ISO/IEC 25010 compatibility evaluation results of the five

(5) personnel respondents who evaluated the ECS based on its compatibility. The

mean of the criterion with the total of five (5) questions is 5.0, which tells that based

on the respondents, the overall compatibility of the ECS is strongly agree.

This means that the personnel respondents strongly agreed that the ECS works

properly on its supported web browsers and devices. It also shows that the system

can be used alongside other common work applications without disrupting normal

operations and can correctly exchange information with connected services such as

online  payment,  email,  and  real-time  notification  services.  Overall,  the  result

indicates that the ECS strongly supports compatibility because it produces receipts,

reports, and exported records that can be opened using common applications, while

maintaining  consistent  information  across  customer,  staff,  administrator,  and

connected-service workflows.

Table 74. ISO/IEC 25010 Interaction Capability Evaluation Results from
Personnel Group of Respondents

Interaction
Capability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS makes
the purpose of its
pages, controls, and

0

0

0

0

5

5

5

Strongly
Agree

221

available actions
easy to recognize.

2. The ECS allows
new users to learn
how to complete
their intended tasks
within a reasonable
amount of time.

3. The ECS provides
clear navigation,
controls, and
workflows for
completing system
tasks.

4. The ECS helps
users prevent,
identify, and correct
errors before
submitting
information.

5. The ECS presents
instructions,
messages, and
interface content
that are
understandable to
users with different
levels of technical
experience.

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

TOTAL

5

Strongly
Agree

Table 73 presents the ISO/IEC 25010 interaction capability evaluation results of

the five (5) personnel respondents who evaluated the ECS based on its interaction

capability. The mean of the criterion with the total of five (5) questions is 5.0, which

tells that based on the respondents, the overall interaction capability of the ECS is

strongly agree.

This means that the personnel respondents strongly agreed that the ECS is easy

to understand and interact with. It shows that the system makes its pages, controls,

and available actions easy to recognize, while also allowing users to learn how to

complete their intended tasks within a reasonable amount of time. Overall, the result

indicates that the ECS strongly supports interaction capability because it provides

222

clear navigation, controls, workflows, instructions, messages, and interface content

that help users complete system tasks and prevent, identify, and correct errors before

submitting information.

Table 75. ISO/IEC 25010 Reliability Evaluation Results from Personnel
Group of Respondents

Reliability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS
performs its
intended functions
without unexpected
errors during normal
use.

2. The ECS keeps
required functions
and records
available when users
need them.

3. The ECS
preserves submitted
information and user
progress during
temporary
interruptions
whenever possible.

4. The ECS restores
required records and
system functions
after recoverable
failures or
interruptions.

5. The ECS prevents
duplicate, missing,
incomplete, or
inconsistent records
during important
transactions.

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

TOTAL

5

Strongly
Agree

Table 74 presents the ISO/IEC 25010 reliability evaluation results of the five (5)

personnel respondents who evaluated the ECS based on its reliability. The mean of

the criterion with the total of five (5) questions is 5.0, which tells that based on the

respondents, the overall reliability of the ECS is strongly agree.

223

This means that the personnel respondents strongly agreed that the ECS performs

its intended functions without unexpected errors during normal use. It also shows

that the system keeps required functions and records available when users need them,

preserves submitted information and user progress during temporary interruptions,

and  restores  required  records  and  system  functions  after  recoverable  failures  or

interruptions. Overall, the result indicates that the ECS strongly supports reliability

because  it  helps  prevent  duplicate,  missing,  incomplete,  or  inconsistent  records

during important transactions.

Table 76. ISO/IEC 25010 Security Evaluation Results from Personnel Group
of Respondents

Security

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS protects
personal, booking,
payment, account,
and operational
information from
unauthorized
disclosure.

2. The ECS restricts
features and records
according to each
user's authorized
role.

3. The ECS verifies
user identities
before providing
access to protected
accounts and
functions.

4. The ECS prevents
or detects
unauthorized
changes to sensitive
information and
system records.

55. The ECS records
important actions
with sufficient
details to identify
who performed
them and what was
changed.

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

224

TOTAL

5

Strongly
Agree

Table 75 presents the ISO/IEC 25010 security evaluation results of the five (5)

personnel respondents who evaluated the ECS based on its security. The mean of the

criterion  with  the  total  of  five  (5)  questions  is  5.0,  which  tells  that  based  on  the

respondents, the overall security of the ECS is strongly agree.

This means that the personnel respondents strongly agreed that the ECS protects

personal,  booking,  payment,  account,  and  operational

information

from

unauthorized disclosure. It also shows that the system restricts features and records

according to each user’s authorized role and verifies user identities before providing

access to protected accounts and functions. Overall, the result indicates that the ECS

strongly  supports  security  because  it  prevents  or  detects  unauthorized  changes  to

sensitive information and records important actions with enough details to identify

who performed them and what was changed.

Table 77. ISO/IEC 25010 Maintainability Evaluation Results from Personnel
Group of Respondents

Maintainability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS allows
changes to one
system area without
unnecessarily
disrupting unrelated
system functions.

2. The ECS applies
shared components,
rules, and
information
consistently across
related system areas.

3. The ECS provides
clear logs, records,
and messages that
help authorized

0

0

0

0

5

5

5

0

0

0

0

5

0

0

0

0

5

5

5

5

5

Strongly
Agree

Strongly
Agree

Strongly
Agree

225

personnel identify
the cause of system
issues.

4. The ECS allows
authorized changes
and corrections to be
implemented
without
unnecessarily
affecting the entire
system.

5. The ECS allows
updated or corrected
functions to be
tested to confirm
that they continue to
work properly.

0

0

0

0

5

5

5

0

0

0

0

5

5

5

Strongly
Agree

Strongly
Agree

TOTAL

5

Strongly
Agree

Table 76 presents the ISO/IEC 25010 maintainability evaluation results of the

five (5) personnel respondents who evaluated the ECS based on its maintainability.

The mean of the criterion with the total of five (5) questions is 5.0, which tells that

based on the respondents, the overall maintainability of the ECS is strongly agree.

This means that the personnel respondents strongly agreed that the ECS can be

maintained,  updated,  and  corrected  without  unnecessarily  disrupting  unrelated

system functions.  It  also shows that the system applies shared components, rules,

and information consistently across related system areas. Overall, the result indicates

that  the  ECS  strongly  supports  maintainability  because  it  provides  clear  logs,

records,  and  messages  that  help  authorized  personnel  identify  system  issues,

implement corrections, and test updated or corrected functions to confirm that they

continue to work properly.

226

Table 78. ISO/IEC 25010 Flexibility Evaluation Results from Personnel
Group of Respondents

Flexibility

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS adapts
to different event
types, guest counts,
menu selections,
venues, payment
schedules, and
booking conditions.

2. The ECS allows
authorized users to
adjust business rules
and system settings
when operational
requirements
change.

3. The ECS supports
increasing numbers
of users, bookings,
transactions,
records, and reports
as business demand
grows.

4. The ECS can be
accessed or
deployed in
supported
environments
without requiring
complicated
installation
procedures.

5. The ECS allows
individual
components or
connected services
to be updated or
replaced without
replacing the entire
system.

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

0

5

5

5

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

TOTAL

5

Strongly
Agree

Table 77 presents the ISO/IEC 25010 flexibility evaluation results of the five (5)

personnel respondents who evaluated the ECS based on its flexibility. The mean of

the criterion with the total of five (5) questions is 5.0, which tells that based on the

respondents, the overall flexibility of the ECS is strongly agree.

227

This means that the personnel respondents strongly agreed that the ECS is highly

flexible in adapting to different event types, guest counts, menu selections, venues,

payment  schedules,  and  booking  conditions.  It  also  shows  that  the  system  allows

authorized  users  to  adjust  business  rules  and  system  settings  when  operational

requirements  change.  Overall,  the  result  indicates  that  the  ECS  strongly  supports

flexibility because it can handle increasing numbers of users, bookings, transactions,

records, and reports, while also  allowing components  or connected services to  be

updated or replaced without replacing the entire system.

Table 79. ISO/IEC 25010 Safety Evaluation Results from Personnel Group of
Respondents

Safety

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS applies
operational
restrictions that
prevent users from
completing actions
that violate
established business
rules.

2. The ECS
identifies invalid or
risky conditions
before they cause
incorrect financial
or operational
records.

3. The ECS prevents
an action from
continuing when a
detected error or
failure could cause
significant
problems.

4. The ECS clearly
warns users before
actions that may
significantly affect
bookings, payments,
refunds,
cancellations, or
records.

0

0

0

0

5

5

5

0

0

0

0

5

5

5

0

0

0

1

4

5

4.8

0

0

0

1

4

5

4.8

Strongly
Agree

Strongly
Agree

Strongly
Agree

Strongly
Agree

228

5. The ECS works
with connected
services without
creating unsafe,
incomplete, or
inconsistent system
records.

0

0

0

0

5

5

5

Strongly
Agree

TOTAL

4.92

Strongly
Agree

Table  78  presents  the  ISO/IEC  25010  safety  evaluation  results  of  the  five  (5)

personnel respondents who evaluated the ECS based on its safety. The mean of the

criterion with  the total  of five (5) questions is  4.92, which tells  that based on the

respondents, the overall safety of the ECS is strongly agree.

This means that the personnel respondents strongly agreed that the ECS provides

safety features that prevent users from completing actions that violate established

business rules. It also shows that the system can identify invalid or risky conditions

before  they  cause  incorrect  financial  or  operational  records.  Overall,  the  result

indicates  that  the  ECS  strongly  supports  safe  system  operations  by  preventing

actions  from  continuing  when  errors  or  failures  may  cause  significant  problems,

warning  users  before  important  actions,  and  working  with  connected  services

without creating unsafe, incomplete, or inconsistent system records.

Table 80. ISO/IEC 25010 Functional Suitability Evaluation Results from IT
Expert Group of Respondents

Functional
Suitability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS provides
the functions needed
to manage catering
services from
booking submission
to event preparation.

2. The ECS
produces correct
booking details,

0

0

0

0

0

3

2

2

1

2

5

5

4.4

Strongly
Agree

4.0

Agree

229

menu selections,
payment records,
reports, and system
summaries.

3. The ECS
correctly applies
established business
rules when
processing
bookings, payments,
refunds, and other
system actions.

4. The ECS enables
users to complete
their assigned
catering
management tasks
without relying on
unnecessary manual
processes.

5. The ECS provides
functions that are
appropriate for the
intended
responsibilities of
customers, staff
members, and
administrators.

0

0

0

4

1

5

4.2

Agree

0

0

1

1

3

5

4.0

Agree

0

0

0

4

1

5

4.2

Agree

TOTAL

4.16

Strongly
Agree

Table 79 presents the ISO/IEC 25010 functional suitability evaluation results of

the five (5) IT expert respondents who evaluated the ECS based on its functional

suitability. The mean of the criterion with the total of five (5) questions is 4.16, which

tells that based on the respondents, the overall functional suitability of the ECS is

strongly agree.

This means that the IT expert respondents strongly agreed that the ECS provides

the necessary functions for managing catering services, from booking submission to

event preparation. It also shows that the system can produce booking details, menu

selections,  payment  records,  reports,  and  system  summaries,  while  applying

established business rules for bookings, payments, refunds, and other system actions.

Overall, the result indicates that the ECS is  functionally  suitable because  it helps

230

customers,  staff  members,  and  administrators  complete  their  assigned  catering

management tasks with the appropriate system features.

Table 81. ISO/IEC 25010 Performance Efficiency Evaluation Results from IT
Expert Group of Respondents

Performance
Efficiency

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS loads
pages, dashboards,
forms, and records
within a reasonable
amount of time.

2. The ECS
promptly completes
submitted updates,
calculations,
searches, filters, and
report-generation
requests.

3. The ECS remains
responsive when
multiple records,
transactions, or
system activities are
processed.

4. The ECS operates
without causing
excessive device,
browser, or network
slowdown during
normal use.

5. The ECS
maintains acceptable
performance as the
number of users,
bookings, menu
items, payments,
and reports
increases.

0

0

1

3

1

5

4.0

Agree

0

1

0

2

2

5

4.0

Agree

0

0

0

3

2

5

4.4

Strongly
Agree

0

0

0

4

1

5

4.2

Agree

0

0

1

1

3

5

4.4

Strongly
Agree

TOTAL

4.2

Agree

Table 80 presents the ISO/IEC 25010 performance efficiency evaluation results

of  the  five  (5)  IT  expert  respondents  who  evaluated  the  ECS  based  on  its

performance efficiency. The mean of the criterion with the total of five (5) questions

231

is 4.2, which tells that based on the respondents, the overall performance efficiency

of the ECS is agree.

This  means  that  the  IT  expert  respondents  agreed  that  the  ECS  performs

efficiently  in  loading  pages,  dashboards,  forms,  and  records  within  a  reasonable

amount  of  time.  It  also  shows  that  the  system  can  promptly  complete  updates,

calculations,  searches,  filters,  and  report-generation  requests.  Overall,  the  result

indicates  that  the  ECS  has  acceptable  performance  efficiency  because  it  remains

responsive during multiple records, transactions,  and system  activities, while also

maintaining  proper  performance  as  the  number  of  users,  bookings,  menu  items,

payments, and reports increases.

Table 82. ISO/IEC 25010 Compatibility Evaluation Results from IT Expert
Group of Respondents

Compatibility

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS works
properly on its
supported web
browsers and
devices.

2. The ECS can be
used alongside other
common work
applications without
disrupting their
normal operation.

3.

The ECS correctly
exchanges
information with
connected services
such as online
payment, email, and
real-time
notification services.

4. The ECS
produces receipts,
reports, and
exported records
that can be opened

0

0

0

2

3

5

4.6

Strongly
Agree

0

0

3

0

2

5

3.8

Agree

0

0

1

3

1

5

4

Agree

0

0

1

4

0

5

3.8

Agree

232

using common
applications.

5. The ECS
maintains consistent
information when
records move
between customer,
staff, administrator,
and connected-
service workflows.

0

0

1

4

0

5

3.8

Agree

TOTAL

4.0

Agree

Table 81 presents the ISO/IEC 25010 compatibility evaluation results of the five

(5) IT expert respondents who evaluated the ECS based on its compatibility. The

mean of the criterion with the total of five (5) questions is 4.0, which tells that based

on the respondents, the overall compatibility of the ECS is agree.

This means that the IT expert respondents agreed that the ECS works properly

on its supported web browsers and devices. It also shows that the system can be used

with other common work applications and can exchange information with connected

services such as online payment, email, and real-time notification services. Overall,

the result indicates that the ECS has acceptable compatibility because it can produce

receipts,  reports,  and  exported  records  that  can  be  opened  using  common

applications, while also maintaining consistent information across customer, staff,

administrator, and connected-service workflows.

Table 83. ISO/IEC 25010 Interaction Capability Evaluation Results from IT
Expert Group of Respondents

Interaction
Capability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS makes
the purpose of its
pages, controls, and
available actions
easy to recognize.

0

1

0

1

3

5

4.2

Agree

233

2. The ECS allows
new users to learn
how to complete
their intended tasks
within a reasonable
amount of time.

3. The ECS provides
clear navigation,
controls, and
workflows for
completing system
tasks.

4. The ECS helps
users prevent,
identify, and correct
errors before
submitting
information.

5. The ECS presents
instructions,
messages, and
interface content
that are
understandable to
users with different
levels of technical
experience.

0

1

0

1

3

5

4.0

Agree

0

1

0

2

2

5

4.0

Agree

0

0

0

3

2

5

4.4

Strongly
Agree

0

0

1

2

2

5

4.2

Agree

TOTAL

4.2

Agree

Table 82 presents the ISO/IEC 25010 interaction capability evaluation results of

the five (5) IT expert respondents who evaluated the ECS based on its interaction

capability. The mean of the criterion with the total of five (5) questions is 4.2, which

tells that based on the respondents, the overall interaction capability of the ECS is

agree.

This means that the IT expert respondents agreed that the ECS has acceptable

interaction capability in terms of making its pages, controls, and available actions

easy to recognize. It also shows that the system allows new users to learn how to

complete their intended tasks within a reasonable amount of time and provides clear

navigation, controls, and workflows for completing system tasks. Overall, the result

indicates that the ECS is understandable and usable because it helps users prevent,

234

identify,  and  correct  errors  before  submitting  information,  while  also  presenting

instructions, messages, and interface content that can be understood by users with

different levels of technical experience.

able 84. ISO/IEC 25010 Reliability Evaluation Results from IT Expert Group
of Respondents

Reliability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS
performs its
intended functions
without unexpected
errors during normal
use.

2. The ECS keeps
required functions
and records
available when users
need them.

3. The ECS
preserves submitted
information and user
progress during
temporary
interruptions
whenever possible.

4. The ECS restores
required records and
system functions
after recoverable
failures or
interruptions.

5. The ECS prevents
duplicate, missing,
incomplete, or
inconsistent records
during important
transactions.

0

0

0

2

3

5

4.6

Strongly
Agree

0

0

0

4

1

5

4.2

Agree

0

0

1

1

3

5

4.4

Strongly
Agree

0

1

0

2

2

5

4.0

Agree

0

1

0

2

2

5

4.0

Agree

TOTAL

4.2

Agree

Table 83 presents the ISO/IEC 25010 reliability evaluation results of the five (5)

IT expert respondents who evaluated the ECS based on its reliability. The mean of

the criterion with the total of five (5) questions is 4.2, which tells that based on the

respondents, the overall reliability of the ECS is agree.

235

This  means  that  the  IT  expert  respondents  agreed  that  the  ECS  is  reliable  in

performing its intended functions without unexpected errors during normal use. It

also shows that the system keeps required functions and records available when users

need  them,  preserves  submitted  information  and  user  progress  during  temporary

interruptions, and restores records and system functions after recoverable failures.

Overall, the result indicates that the ECS has acceptable reliability because it helps

maintain proper system operations and prevents duplicate, missing, incomplete, or

inconsistent records during important transactions.

Table 85. ISO/IEC 25010 Security Evaluation Results from IT Expert Group
of Respondents

Security

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS protects
personal, booking,
payment, account,
and operational
information from
unauthorized
disclosure.

2. The ECS restricts
features and records
according to each
user's authorized
role.

3. The ECS verifies
user identities
before providing
access to protected
accounts and
functions.

4. The ECS prevents
or detects
unauthorized
changes to sensitive
information and
system records.

5. The ECS records
important actions
with sufficient
details to identify
who performed
them and what was
changed.

0

0

1

1

3

5

4.4

Strongly
Agree

0

0

1

2

2

5

4.2

Agree

0

1

0

3

1

5

3.8

Agree

0

1

0

2

2

5

4.0

Agree

0

1

0

2

2

5

3.8

Agree

236

TOTAL

4.04

Agree

Table 84 presents the ISO/IEC 25010 security evaluation results of the five (5)

IT expert respondents who evaluated the ECS based on its security. The mean of the

criterion with  the total  of five (5) questions is  4.04, which tells  that based on the

respondents, the overall security of the ECS is agree.

This  means  that  the  IT  expert  respondents  agreed  that  the  ECS  provides

acceptable  security  in  protecting  personal,  booking,  payment,  account,  and

operational information from unauthorized disclosure. It also shows that the system

restricts features and records based on each user’s authorized role and verifies user

identities before allowing access to protected accounts and functions. Overall, the

result  indicates  that  the  ECS  has  sufficient  security  features  because  it  can  help

prevent or detect unauthorized changes to sensitive information and record important

actions to identify who performed them and what was changed.

Table 86. ISO/IEC 25010 Maintainability Evaluation Results from IT Expert
Group of Respondents

Maintainability

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS allows
changes to one
system area without
unnecessarily
disrupting unrelated
system functions.

2. The ECS applies
shared components,
rules, and
information
consistently across
related system areas.

3. The ECS provides
clear logs, records,
and messages that
help authorized
personnel identify

0

0

1

0

4

5

4.6

Strongly
Agree

0

0

1

4

0

5

3.8

Agree

0

1

0

2

2

5

4.0

Agree

237

the cause of system
issues.

4. The ECS allows
authorized changes
and corrections to be
implemented
without
unnecessarily
affecting the entire
system.

5. The ECS allows
updated or corrected
functions to be
tested to confirm
that they continue to
work properly.

0

1

0

2

2

5

4.0

Agree

0

1

0

2

2

5

4.0

Agree

TOTAL

4.08

Agree

Table 85 presents the ISO/IEC 25010 maintainability evaluation results of the

five (5) IT expert respondents who evaluated the ECS based on its maintainability.

The mean of the criterion with the total of five (5) questions is 4.08, which tells that

based on the respondents, the overall maintainability of the ECS is agree.

This means that the IT expert respondents agreed that the ECS can be maintained

and  modified  without  unnecessarily  affecting  unrelated  system  functions.  It  also

shows  that  the  system  applies  shared  components,  rules,  and  information  across

related  system  areas.  Overall,  the  result  indicates  that  the  ECS  has  acceptable

maintainability  because  it  provides  logs,  records,  and  messages  that  can  help

authorized personnel identify system issues, implement corrections, and test updated

or corrected functions to ensure that they continue to work properly.

Table 87. ISO/IEC 25010 Flexibility Evaluation Results from IT Expert
Group of Respondents

Flexibility

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS adapts
to different event
types, guest counts,

0

0

1

2

2

5

4.2

Agree

238

menu selections,
venues, payment
schedules, and
booking conditions.

2. The ECS allows
authorized users to
adjust business rules
and system settings
when operational
requirements
change.

3. The ECS supports
increasing numbers
of users, bookings,
transactions,
records, and reports
as business demand
grows.

4. The ECS can be
accessed or
deployed in
supported
environments
without requiring
complicated
installation
procedures.

5. The ECS allows
individual
components or
connected services
to be updated or
replaced without
replacing the entire
system.

0

1

0

2

2

5

4.0

Agree

0

0

1

1

3

5

4.4

Strongly
Agree

0

1

0

2

2

5

4.0

Agree

0

0

2

1

2

5

4.0

Agree

TOTAL

4.12

Agree

Table 86 presents the ISO/IEC 25010 flexibility evaluation results of the five (5)

IT expert respondents who evaluated the ECS based on its flexibility. The mean of

the criterion with the total of five (5) questions is 4.12, which tells that based on the

respondents, the overall flexibility of the ECS is agree.

This  means  that  the  IT  expert  respondents  agreed  that  the  ECS  can  adapt  to

different event types, guest counts, menu selections, venues, payment schedules, and

booking conditions. It also shows that the system allows authorized users to adjust

business rules and system settings when operational requirements change. Overall,

239

the  result  indicates  that  the  ECS  has  acceptable  flexibility  because  it  can  support

increasing numbers of users, bookings, transactions, records, and reports, while also

allowing supported environments, components, or connected services to be updated

or replaced without requiring changes to the entire system.

Table 88. ISO/IEC 25010 Safety Evaluation Results from IT Expert Group of
Respondents

Safety

Strongly
Disagree

Disagree  Neutral  Agree

Strongly
Agree

No. of
Respondents

Likert
Scale

Response

1. The ECS applies
operational
restrictions that
prevent users from
completing actions
that violate
established business
rules.

2. The ECS
identifies invalid or
risky conditions
before they cause
incorrect financial
or operational
records.

3. The ECS prevents
an action from
continuing when a
detected error or
failure could cause
significant
problems.

4. The ECS clearly
warns users before
actions that may
significantly affect
bookings, payments,
refunds,
cancellations, or
records.

5. The ECS works
with connected
services without
creating unsafe,
incomplete, or
inconsistent system
records.

0

1

0

1

3

5

4.2

Agree

0

1

0

2

2

5

4.0

Agree

0

0

1

1

3

5

4.4

0

0

0

2

3

5

4.6

Strongly
Agree

Strongly
Agree

0

0

1

3

1

5

4.0

Agree

TOTAL

4.24

Strongly
Agree

240

Table 87 presents the ISO/IEC 25010 safety evaluation results of the five (5) IT

expert  respondents  who  evaluated  the  ECS  based  on  its  safety.  The  mean  of  the

criterion with  the total  of five (5) questions is  4.24, which tells  that based on the

respondents, the overall safety of the ECS is strongly agree.

This means that the IT expert respondents strongly agreed that the ECS provides

safety  features  that  help  prevent  users  from  completing  actions  that  may  violate

established business rules. It also shows that the system can identify invalid or risky

conditions,  prevent  actions  from  continuing  when  errors  or  failures  may  cause

significant  problems,  and  warn  users  before  important  actions  that  may  affect

bookings, payments, refunds, cancellations, or records. Overall, the result indicates

that  the  ECS  supports  safe  system  operations  and  works  with  connected  services

without creating unsafe, incomplete, or inconsistent system records.

Table 89. Summary of Respondent's Assessment of the Proposed System

Customer

Personnel

IT Experts

Gen.
Average

Mean

I

Mean

I

Mean

I

Mean

I

4.82

SA

4.92

SA

4.16

SA

4.63

SA

Area

Functional
Suitability

Performance
Efficiency

4.7

SA

4.96

SA

4.2

Compatibility

4.7

SA

Interaction
Capability

Reliability

Security

4.8

SA

4.8

4.9

SA

SA

5

5

5

5

SA

4.0

SA

4.2

SA

4.2

SA

4.04

A

A

A

A

A

4.62

SA

4.56

SA

4.67

SA

4.67

SA

4.65

SA

241

Maintainability

4.8

Flexibility

Safety

4.9

4.7

SA

SA

SA

5

5

SA

4.08

SA

4.12

A

A

4.63

SA

4.67

SA

4.92

SA

4.24

SA

4.62

SA

Legend: I – Interpretation / SA – Strongly Agree (4.21 – 5.00); A – Agree (3.41 - 4.20); N – Neutral (2.61 – 3.40); D –
Disagree (1.81 – 2.60); SD – Strongly Disagree (1.00 – 1.80)

Table 89 presents the summary of the respondents’ assessment of the proposed

ECS  based  on  the  ISO/IEC  25010  quality  characteristics.  The  table  shows  the

evaluation  results  from  the  three  groups  of  respondents,  namely  the  customer,

personnel, and IT expert groups.

Based  on  the  results,  all  nine  (9)  quality  characteristics  received  a  general

average  interpreted  as  Strongly  Agree.  Functional  suitability  received  a  general

average of 4.63, performance efficiency received 4.62, compatibility received 4.56,

interaction capability received 4.67, reliability received 4.67, security received 4.65,

maintainability received 4.63, flexibility received 4.67, and safety received 4.62.

This  means  that  the  respondents  strongly  agreed  that  the  proposed  ECS  is

functionally  suitable,  efficient,  compatible,  easy  to  interact  with,  reliable,  secure,

maintainable, flexible, and safe to use. Overall, the results indicate that the proposed

system  was  positively  assessed  by  the  respondents  and  met  the  ISO/IEC  25010

quality standards based on their evaluation.

4.2.   Summary of Findings

The study evaluated the proposed ECS using the ISO/IEC 25010 software quality

model. The evaluation  focused on nine (9) quality  characteristics, namely Functional

242

Suitability, Performance Efficiency, Compatibility, Interaction Capability, Reliability,

Security, Maintainability,  Flexibility, and Safety.  The respondents  were composed of

twenty (20) participants: ten (10) customers, five (5) personnel, and five (5) IT experts.

Based on the evaluation results, the customer group rated all nine (9) ISO/IEC 25010

quality characteristics as Strongly Agree. The customer respondents gave the following

mean  scores:  Functional  Suitability  with  4.82,  Performance  Efficiency  with  4.70,

Compatibility with 4.70, Interaction Capability with 4.80, Reliability with 4.80, Security

with 4.90, Maintainability with 4.80, Flexibility with 4.90, and Safety with 4.70. These

results  show  that  the  customer  respondents  strongly  agreed  that  the  ECS  is  suitable,

efficient, compatible, usable, reliable, secure, maintainable, flexible, and safe to use.

For the personnel group, all nine (9) quality characteristics were also interpreted as

Strongly Agree. The personnel respondents gave the following mean scores: Functional

Suitability  with  4.92,  Performance  Efficiency  with  4.96,  Compatibility  with  5.00,

Interaction  Capability  with  5.00,  Reliability  with  5.00,  Security  with  5.00,

Maintainability with 5.00, Flexibility with 5.00, and Safety with 4.92. These findings

indicate that the personnel respondents strongly agreed that the ECS supports their tasks

and system operations effectively.

For  the  IT  expert  group,  Functional  Suitability  and  Safety  were  interpreted  as

Strongly  Agree,  while  Performance  Efficiency,  Compatibility,  Interaction  Capability,

Reliability, Security, Maintainability, and Flexibility were interpreted as Agree. The IT

experts gave the following mean scores: Functional Suitability with 4.16, Performance

Efficiency  with  4.20,  Compatibility  with  4.00,  Interaction  Capability  with  4.20,

243

Reliability  with  4.20,  Security  with  4.04,  Maintainability  with  4.08,  Flexibility  with

4.12, and Safety with 4.24. These results show that the IT experts generally agreed that

the  ECS  met  the  ISO/IEC  25010  quality  characteristics,  with  stronger  agreement  in

functional suitability and safety.

Overall,  all  nine  (9)  ISO/IEC  25010  quality  characteristics  received  a  general

average interpreted as Strongly Agree. The general averages were 4.63 for Functional

Suitability, 4.62 for Performance Efficiency, 4.56 for Compatibility, 4.67 for Interaction

Capability,  4.67  for  Reliability,  4.65  for  Security,  4.63  for  Maintainability,  4.67  for

Flexibility, and 4.62 for Safety. This means that the respondents strongly agreed that the

proposed  ECS  is  functionally  suitable,  efficient,  compatible,  easy  to  interact  with,

reliable, secure, maintainable, flexible, and safe to use.

244

Chapter 5

CONCLUSION

Based on the findings of the study, the general objective of designing and developing

a  decision  support  and  catering  management  system  for  Eloquente  Catering  Services

was  achieved.  The  developed  ECS  was  able  to  support  the  management  of  catering

operations  by  providing  features  for  booking  transactions,  package  customization,

customer  communication,  payment  monitoring,  receipt  generation,  and  business

analytics. Through these features, the system helped streamline the manual processes of

the  business  and  provided  a  more  organized  way  of  handling  reservations,  customer

requests, records, and reports.

The first specific objective was to identify the operational bottlenecks in the current

manual  processes  of  Eloquente  Catering  Services  and  establish  the  technical

requirements for an automated transaction and analytics platform. This objective was

achieved by determining the common difficulties in the existing process, such as manual

booking  handling,  possible  schedule  conflicts,  delayed  updates,  scattered  transaction

records,  and  limited  access  to  summarized  business  data.  These  identified  concerns

became the basis for the system requirements and guided the development of the ECS

as  an  automated  platform  for  managing  transactions  and  generating  useful  business

insights.

The  second  specific  objective  was  to  create  a  web-based  portal  with  automated

conflict  checking,  package  customization,  and  a  rule-based  budget  recommender  to

improve the customer reservation experience. This objective was achieved through the

development  of  customer-facing  features  that  allow  users  to  submit  booking  details,

245

customize catering packages, and receive assistance based on their preferred budget. The

system helped make the reservation process more convenient because customers could

provide their event details and select services through the portal instead of relying only

on manual communication.

The third specific objective was to integrate a live chat module and status tracking

system for direct communication between customers and marketing staff. This objective

was achieved by including communication and tracking features that allow customers to

send specific event requests and receive updates regarding their bookings. Through the

live  chat  and  status  tracking  functions,  the  system  improved  coordination  between

customers  and  staff,  especially  for  clarifications,  logistical  concerns,  and  reservation

progress updates.

The fourth specific objective was to integrate Role-Based Access Control, a secure

payment gateway, the 10/70/20 payment structure, and digital receipt generation. This

objective  was  achieved  by  applying  user  role  restrictions  to  help  ensure  that  only

authorized  users  can  access  specific  records  and  system  functions.  The  system  also

supported  payment-related  processes  by  organizing  payment  stages  and  generating

digital receipts. These features helped improve data integrity, payment monitoring, and

transaction security within the system.

The fifth specific objective was to develop an analytics dashboard using Frequency

Distribution,  Simple  Linear  Regression,  and  Simple  Moving  Average.  This  objective

was  achieved  by  providing  an  analytics  dashboard  that  supports  descriptive  and

predictive analysis. Frequency Distribution was used to summarize sales-related data,

246

while  Simple  Linear  Regression  and  Simple  Moving  Average  were  used  to  support

forecasting  for  revenue  and  service  demand.  Through  these  analytics  features,  the

system  provided  data-driven  insights  that  can  help  Eloquente  Catering  Services

understand  business  performance  and  make  better  decisions  for  future  planning  and

growth.

The sixth specific objective was to evaluate the system through alpha and beta testing

using the ISO/IEC 25010 standard. This objective was achieved by assessing the system

based  on  the  nine  quality  characteristics  of  ISO/IEC  25010,  namely  Functional

Suitability, Performance Efficiency, Compatibility, Interaction Capability, Reliability,

Security, Maintainability, Flexibility, and Safety. The evaluation results showed that the

proposed ECS received positive ratings from the respondents. The general averages for

all  nine  characteristics  were  interpreted  as  Strongly  Agree,  which  means  that  the

respondents viewed the system as functionally suitable, efficient, compatible, easy to

interact with, reliable, secure, maintainable, flexible, and safe to use.

Overall, the study concludes that the proposed ECS successfully met its intended

objectives. The system was able to address the needs of Eloquente Catering Services by

improving  booking  operations,  supporting  customer  communication,  securing

transactions, organizing records, and providing useful analytics for business decision-

making. With the positive evaluation results from the customer, personnel, and IT expert

respondents,  the  ECS  can  be  considered  an  effective  and  acceptable  system  for

supporting  the  catering  management  operations  and  strategic  growth  of  Eloquente

Catering Services.

247

Chapter 6

RECOMMENDATIONS

Based on the findings, conclusion, and overall evaluation of the Eloquente Catering

System,

the  researchers  recommend

the  following

improvements  for  future

development. These recommendations were selected based on their possible impact on

Eloquente Catering Services, their connection to the objectives of the study, and their

feasibility as system enhancements. Although the current ECS already supports booking

management, package customization, customer communication, payment tracking, role-

based  access  control,  and  analytics,  the  following  improvements  may  help  make  the

system more complete, scalable, and useful for long-term business operations.

First,  the  researchers  recommend  adding  an  ingredient  tracking  and  inventory

management module. This may be done by creating ingredient records with categories,

units of measurement, current stock levels, and reorder points. Each menu item may then

be connected to its required ingredients so the system can estimate the needed supplies

based  on  the  selected  menu,  number  of  guests,  and  confirmed  booking  details.  This

feature  would  benefit  Eloquente  Catering  Services  by  reducing  ingredient  shortages,

over-purchasing,  food  waste,  and  last-minute  procurement  problems.  It  is  feasible

because the current system already stores booking, menu, and event information, but it

would require accurate encoding of ingredient lists, serving portions, and stock records.

The evaluation may be done through a one to two-month pilot test using sample menus

and actual booking scenarios to check the accuracy of ingredient estimates, usefulness

of stock alerts, and effect on preparation efficiency.

248

Second, the researchers recommend improving the analytics dashboard by including

more detailed menu, booking, ingredient, and demand-related data. This may be done

by  continuously  collecting  complete  information  from  confirmed  bookings,  such  as

event type, guest count, selected package, selected dishes, event date, payment amount,

and booking status. Once enough data is available, the dashboard may show frequently

selected  dishes,  high-demand  packages,  seasonal  trends,  and  possible  ingredient

demand.  This  would  benefit  the  organization  by  helping  management  make  better

decisions on purchasing, staffing, promotions, menu planning, and seasonal preparation.

It is feasible because the current system already has analytics functions and transaction

records, but its accuracy will improve as more historical data is collected. The evaluation

may  be  conducted  after  three  to  six  months  of  actual  system  use  by  reviewing  the

accuracy of reports, clarity of visualizations, and usefulness of the insights for business

decisions.

Third, the researchers recommend strengthening the system’s integration with third-

party services.  This  may be done by identifying the most important  external  services

used by the system, such as payment processing, notifications, real-time communication,

document  generation,  cloud  storage,  backups,  and  possible  accounting  software.  The

business may also consider backup providers or alternative service options in case one

provider  becomes  unavailable.  This  would  benefit  Eloquente  Catering  Services  by

improving  reliability,  reducing  service  interruptions,  and  giving  customers  more

convenient  payment  and  notification  options.  It  is  feasible  because  the  current  ECS

already uses third-party services, but implementation will depend on provider cost, API

requirements,  security  settings,  and  maintenance  needs.  The  evaluation  may  be  done

249

through  controlled  testing  of  successful  transactions,  failed  transactions,  delayed

responses,  downtime  simulations,  and  data  accuracy  before  using  the  integrations  in

actual operations.

Fourth, the researchers recommend continuously improving the Role-Based Access

Control feature as the system expands. This may be done by reviewing all current user

roles and updating permissions whenever new modules or integrations are added. For

example, kitchen staff may only access ingredient requirements and preparation reports,

accounting staff may only access payment and financial records, marketing staff may

access booking and customer communication records, and administrators may manage

system settings and complete reports. This would benefit the organization by protecting

customer  information,  payment  details,  business  records,  and  operational  data  from

unauthorized access or changes. It is feasible because the system already includes role-

based  access  features,  and  future  improvements  would  mainly  involve  updating

permission  rules.  The  evaluation  may  be  done  during  every  major  system  update  by

testing each user role, checking restricted pages, and reviewing system logs every three

to six months.

Fifth, the researchers recommend conducting larger and longer real-world system

testing.  This  may  be  done  by  preparing  a  testing  plan  that  includes  more  customers,

personnel, and IT experts, as well as actual business scenarios such as booking creation,

package  customization,  payment  monitoring,  receipt  generation,  chat  usage,  status

tracking, and report viewing. This would benefit Eloquente Catering Services by helping

identify performance issues, usability concerns, workflow difficulties, security gaps, or

reliability problems that may not appear during short-term testing. It is feasible because

250

it  does  not  require  a  major  change  to  the  system  structure,  but  it  requires  proper

scheduling,  user  participation,  and  careful  monitoring  to  avoid  disrupting  actual

operations.  The  evaluation  may  be  done  in  phases,  starting  with  controlled  testing,

followed  by  limited  real-world  use,  and  then  wider  testing  during  normal  or  peak

operations.

Overall,  these  recommendations  focus  on  the  most  reasonable  and  high-impact

improvements for the ECS. Ingredient tracking and improved analytics can strengthen

operational planning and decision-making. Third-party service integration and updated

access  control  can  improve  reliability  and  security.  Longer  real-world  testing  can

confirm  the  system’s  effectiveness  in  actual  business  conditions.  Through  these

improvements, the ECS may grow from a catering management and decision-support

system  into  a  more  complete  operational  support  platform  for  Eloquente  Catering

Services.

251

BIBLIOGRAPHY

[1]  Alhammadi,  A.  (2025).  The  integration  of  industry  4.0  technologies  in  the
hospitality sector. International Journal of Technology and Systems, 10(3), 20–31.
https://doi.org/10.47604/ijts.3478

[2]  Alona, O., Joemar, M., Johnrel, P., Leo, Z., & Rechie, B. (2024). Web-based E-
retailing  system  for  CTU  food  innovation  centers:  Design,  acceptability,  and
functionality. Ho Chi Minh City Open University Journal of Science- Economics
and
23–44.
Administration,
https://doi.org/10.46223/hcmcoujs.econ.en.14.2.2650.2024

Business

14(2),

[3]  Anwar, F. A., Deliana, D., & Suyamto, S. (2024). Digital transformation in the
hospitality  industry:  Improving  efficiency  and  guest  experience.  International
Journal  of  Management  Science  and  Information  Technology,  4(2),  428–437.
https://doi.org/10.35870/ijmsit.v4i2.3201

[4]  Armor, G. (2025, March 21). How secure digital Payments can boost revenue and
from

Technology.

Hospitality

Retrieved

Loyalty.

customer
https://hospitalitytech.com

[5]  Bauzon, E., &  Pidor, R. (2023). Development  of a web-based decision support
system  for  sales  performance  monitoring  and  trend  analysis.  ResearchGate.
Retrieved
from
https://www.researchgate.net/publication/388353449_Development_of_a_Web-
based_Decision_Support_System_for_Sales_Performance_Monitoring_and_Tre
nd_Analysis

[6]  Bulagao, D., Cadano, J. A. M., Estera, J., & Hussin, J. (2022). Integrated Catering
Booking System with the Decision Support System [Thesis, Jose Rizal Memorial
University].
State
https://www.scribd.com/document/594654043/INTEGRATED-CATERING-
BOOKING-SYSTEM-WITH-DSS-2022

[7]  Cabututan, J. D. &. A. O. &. N. C. P. &. R. a. &. D. M. S. &. G. (2025). Data-
Driven Point-of-Sale and Inventory System for Pastil Sa Tabi: Integrating sales
forecasting
ideas.repec.org.
analytics.
and
https://ideas.repec.org/a/bjf/journl/v10y2025i10p826-838.html

algorithms

predictive

[8]  Capuno,  M.,  Benigno,  J.,  Reyes,  R.,  &  Tojino,  K.  C.  M.  (2021).  iReserve:  An
Online Event Reservation for Lipa City Cultural with SMS Notification. JPAIR
146–165.
Research,
Multidisciplinary
https://doi.org/10.7719/jpair.v43i1.736

43(1),

252

[9]  Catubag, J. L., Fabian, J., Jr., Garcia, E. J., Avila, R., & Cabance, P. J. (2024).
Angels and Lemons’ E-Ordering: Development of a Web-Based Ordering System
for  Angels  and  Lemons.  International  Journal  of  Academic  Multidisciplinary
http://ijeais.org/wp-
6),
Research,
content/uploads/2024/6/IJAMR240606.pdf

8(Issue

77–83.

Vol.

[10]  Cepeda, J. a. U., & Saludes, A. J. C. (2025). Online ICT Equipment Inventory and
Borrowing System with Decision Support. European Journal of Innovative Studies
and Sustainability, 1(5), 62–70. https://doi.org/10.59324/ejiss.2025.1(5).07

[11]  Coloma, A. J., Ciriaco, A. K., Agpalo, H. J., Galope, J., Castro, S., & Figueroa, V.
(2025). Eventify: A Web-based Event Management and Attendance Monitoring
System with Data Analytics. https://www.ejournals.ph/article.php?id=30197

[12]  Concepcion, F. G., Corpuz, M. N., De Guzman, J. A., & Villaverde, J. B. (2023).
Web Based Sales and Inventory Management System with Barcode Scanner and
Appointment  Scheduling  for  Bethlehem  Animal  Clinic  [Capstone  Project,  STI
Ortigas-Cainta].
College
https://www.scribd.com/document/728110980/CAPSTONE-2-Web-Based-
Sales-and-Inventory-Management-System-With-Barcode-Scanner-and-
Appointment-Scheduling-for-Bethlehem-Animal-Clinic-1

[13]  Convergine.

(2025).

Integrated  Payments:  Definition,  Types,  Benefits.

https://www.convergine.com/blog/what-are-integrated-payments-complete-
guide/

[14]  Cumpio, N. R., Octa, R. L., & Tiozon, E. B. (2021). Web-Based-Online-Catering-
Services-and-Management-System-in-Leyte. (Capstone project). Eastern Visayas
State
from
https://www.scribd.com/document/533376616/Web-Based-Online-Catering-
Services-and-Management-System-in-Leyte

University.

Retrieved

[15]  Das,  M.,  &  Singh,  K.  (2025).  Digital  Payment:  Transforming  the  future  of
hospitality and hotel industry. Revista Review Index Journal of Multidisciplinary,
5(1), 185–192. https://doi.org/10.31305/rrijm2025.v05.n01.022

[16]  Del Rosario, D. C. G., Dela Cruz, J. A. M., & Rivera, R. R. M. (2022). Challenges
and coping mechanisms of catering services: A local perspective. eJournals PH,
14(3). https://ejournals.ph/article.php?id=19101

[17]  Gasingan,  D.  (2025,  September  1).  DTI  strengthens  MSMEs  as  agents  of
transformation.  Philippine  Information  Agency.  https://pia.gov.ph/news/dti-
strengthens-msmes-as-agents-of-transformation/

253

[18]  Grab. (2023). GrabFood & grocery trends report 2023: Filipinos increase adoption
of  O2O  dining  solutions.  https://prstation.ph/filipinos-increase-adoption-of-
online-to-offline-dining-solutions

[19]  Gumilao, J. (2024). AUTOMATED INVENTORY MANAGEMENT SYSTEM
FOR DEPARTMENT OF EDUCATION REGIONAL OFFICE IX [MA thesis,
JOSE
UNIVERSITY].
https://doi.org/10.13140/RG.2.2.20268.48006

MEMORIAL

STATE

RIZAL

[20]  Hvozdyk, I. (2025, September 9). What is a transaction Processing system [Types
from  https://kindgeek.com/blog/post/what-is-a-

and  Benefits].  Retrieved
transaction-processing-system-types-and-benefits

[21]  IBM.

(2024).  What

is

role-based

access

control

(RBAC)?

https://www.ibm.com/think/topics/rbac

[22]  ISO. (2023).  ISO/IEC  25010:2023  Systems and software Quality  Requirements
model.

Evaluation

Product

quality

(SQuaRE)  —
and
https://www.iso.org/standard/78176.html

[23]  Kilburn,  R.  (2024).  Should  Survey  Likert  Scales  Include  Neutral  Response
Corporation.
RAND
Categories?
https://www.rand.org/content/dam/rand/pubs/working_papers/WRA3100/WRA3
135-2/RAND_WRA3135-2.pdf

[24]  Lapuz, I. A., Riguera, R., Sesbreno, A. S., Torres, R. M., & Franco, G. R. (Eds.).
(2021).  Web-Based  Venue  and  Reservation  Management  System  with  Data
https://www.dlsu.edu.ph/wp-
Visualization.  De  La  Salle  University.
content/uploads/pdf/conferences/research-congress-proceedings/2022/EBM-
10.pdf

[25]  Li, J. (2024). Development of a Web-based Food Ordering System. Asia Pacific
Journal of Management and Sustainable Development, Vol. 12(No. 2), 155–159.
https://asiapjournals.org/wp-content/uploads/2024/11/15.-APJMSD-2024-67.pdf

[26]  Loft Philippines. (2025). Top bookkeeping mistakes small businesses make and
how  to  fix  them.  https://loft.ph/top-bookkeeping-mistakes-small-businesses-
make-and-how-to-fix-them/

[27]  Mesina-Romero,  B.  R.,  Masangkay,  M.  C.,  Franco,  M.,  Yambao,  M.  A.  V.,
Delgado, K., Bueno, P. N., ... & Yñigo, K. T. (2024). 2024 report on the status of
the  Philippines.  Bangko  Sentral  ng  Pilipinas.
digital  payments
https://www.bsp.gov.ph/PaymentAndSettlement/2024_Report_on_E-
payments_Measurement.pdf

in

254

[28]  Mia, A. (2024). Digital Technology Adoption Among Philippine Micro-, Small-,
and Medium-Sized Enterprises: Barriers, Enablers & Challenges during COVID-
19.
4(1).
Business,
https://journal.bmu.edu.in/journal-files/Digital_Technology.pdf

Society,

Journal

Ethics

and

of

[29]  Olavsrud, T. (2024, January 29). Decision support systems: Drive better decision-
making with data. Retrieved from https://www.cio.com/article/193521/decision-
support-systems-sifting-data-for-better-business-decisions.html

[30]  Phillipneris,  A.  M.  (2021).  STRATEGIES  AND  CHALLENGES  OF  SMALL-
SCALE ONLINE FOOD BUSINESSES IN THE PHILIPPINES: AN IN-DEPTH
STUDY OF SELECTED INITIATIVES WITHIN THE CONTEXT OF COVID-
19
UNIVERSITY].
https://scholar.stjohns.edu/cgi/viewcontent.cgi?article=1268&context=theses_dis
sertations

JOHN’S

CRISIS

thesis,

[MA

ST.

[31]  Quimba, F. M. A., Reyes, C. M., Baje, L. K., & Bayudan-Dacuycuy, C. (2022).
Men-  and  Women-owned/led  MSMEs  and  the  COVID-19  Policy  Responses.
Philippine
Studies.
for
https://www.pids.gov.ph/publication/discussion-papers/men-and-women-owned-
led-msmes-and-the-covid-19-policy-responses

Development

Institute

[32]  Relevant Software. (2025). Agile software development life cycle, phases, tools.
https://relevant.software/blog/agile-software-development-lifecycle-phases-
explained/

[33]  Robinson, J. (2024). Likert Scale. In  Encyclopedia of Quality of Life and Well-
https://www.researchgate.net/profile/Karen-
Being
Hamrick/publication/273447872_Time_Poverty_Thresholds_in_the_USA/links/
5509eb0f0cf26198a639d508/Time-Poverty-Thresholds-in-the-USA.pdf

Research.

Springer.

[34]  RSIS  International.  (2025).  Bookkeeping  practices  and  business  performance
Philippines.

among
https://rsisinternational.org/journals/ijriss/uploads/vol9-iss10-pg7438-7445-
202511_pdf.pdf

and  medium

enterprises

small

the

in

[35]  Sales

Funnel

Professor.

(2025).

Sales  Dashboard  Definition.

https://salesfunnelprofessor.com/encyclopedia-term/sales-dashboard-definition/

[36]  Schwarz,  L.  (2025,  December  2).  10  uses  for  data  analytics  in  the  hospitality
from

industry.
https://www.netsuite.com/portal/resource/articles/erp/data-analytics-hospitality-
industry.shtml

Retrieved

255

[37]  Shelf.nu.

(2024).  Booking  Conflict  Queries  &  Reservation  Logic.

https://docs.shelf.nu/booking-conflict-queries

[38]  Shrestha,  S.  (2024,  September  25).  The  Importance  of  Online  Booking:  How
from

convenience  Drives  Conversions
-  Method  Analytics.  Retrieved
https://www.methodanalytics.com/the-importance-of-online-booking-how-
convenience-drives-conversions/

[39]  Sigala,  M.  (2024).  Digital  transformation  in  the  Philippine  hospitality  industry:
decade.

Opportunities
https://www.scribd.com/document/910092771/Digital-Transformation-in-the-
Philippine-Hospitality-Industry

challenges

and

last

the

in

[40]  Simplilearn.  (n.d.).  What  is  Scrum  framework,  and  how  does  it  work?

https://www.simplilearn.com/tutorials/agile-scrum-tutorial/scrum-framework

[41]  Solvexia.

(2024).  What

are

Automated

Reporting

Systems?

https://www.solvexia.com/glossary/automated-reporting-systems

[42]  TechnologyAdvice.  (2024).  Payment  Authorization:  Overview,  Definition  &
Process. https://technologyadvice.com/blog/sales/payment-authorization/

[43]  Techslang.  (2024).  What

is  a  Transaction  Processing  System  (TPS)?

https://www.techslang.com/definition/what-is-a-transaction-processing-system/

[44]  TechTarget.

(2024).  What

is

a  decision

support

system

(DSS)?

https://www.techtarget.com/searchcio/definition/decision-support-system

[45]  Udupihilla, N. (2024, February 1). Meeting the evolving consumer demands in

hospitality. Hotel Online. Retrieved from https://www.hotel-online.com

[46]  Vega,  M.  M.,  &  Generoso,  M.  J.  I.  A.,  II.  (2025).  Ereserve:  an  online  facility
institution.

system  of  one  Philippine  higher

education

reservation
https://ejournals.ph/article.php?id=30627

[47]  VoIP  Business.

(2025).  What

Is  A  Web  Based  Application.

https://www.voipbusiness.com/blog-post/what-is-a-web-based-application/

[48]  Zendesk. (2021). What is sales analytics? https://www.zendesk.com/blog/guide-

sales-analytics

[49]  Hwang,  J.,  Kim,  S.,  &  Lee,  Y.  (2021).  Mass  customization  in  food  services.
102750.

of  Hospitality  Management,

93,

International
https://doi.org/10.1016/j.ijhm.2020.102750

Journal

256

[50]  Ragazou, K., & Passas, I. (2023). Business intelligence model empowering SMEs
to  make  better  decisions  and  enhance  their  competitive  advantage.  Discover
Analytics. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9901379/

[51]  Sutantio,  R.  A.,  Komariyah,  S.,  Sularso,  R.  A.,  &  Afandi,  M.  F.  (2024).
Understanding  consumer  behavior  with  the  use  of  the  Technology  Acceptance
Model  in  online  booking.  KnE  Social  Sciences,  2024(ICEMSIT),  129–139.
https://knepublishing.com/index.php/KnE-Social/article/view/15716

[52]  Chakma, S. (2025). Analyzing key factors influencing coffee house revenue: A
predictive  modeling  approach.  American  Journal  of  Industrial  and  Business
Management, 15(8), 209-235. https://doi.org/10.4236/ajibm.2025.158057

[53]  Damian Kocot, Maria Kocot, Rafal Żelazny. (2025). Adaptation of Gastronomy
companies to the requirements of Economy 5.0: A case study. European Research
Studies Journal. Available: https://doi.org/10.35808/ersj/4077

[54]  Intanio  Sahara,  R.,  Chairunnisa,  R.,  Iqbal,  M.,  &  Hardi  Roza,  A.  (2025).
Development  of  a  web-based  reservation  system  to  improve  the  efficiency  of
catering
Available:
https://www.researchgate.net/publication/394595981_Development_of_a_Web-
Based_Reservation_System_to_Improve_the_Efficiency_of_Catering_Services

bit-Tech,

802-815.

services.

8(1),

[55]  Shiji Group. (2024). Understanding the impact of legacy hospitality systems on
Insights.

operational
https://www.shijigroup.com/customers/understanding-the-impact-of-legacy-
hospitality-systems-on-operational-and-financial-results

financial

results.

Shiji

and

[56]  Tasmara,  D.  A.,  Islami,  G.  A.  J.,  &  Ferdian,  F.  (2024).  Exploring  online
reservation decision through e-commerce platform in the hotel industry. Journal
44-58.
of
https://www.researchgate.net/publication/378689833_EXPLORING_ONLINE_
RESERVATION_DECISION_THROUGH_E-
COMMERCE_PLATFORM_IN_THE_HOTEL_INDUSTRY

Hospitality,

Tourism

13(2),

and

[57]  Verma, P., Chakole, S., & Pandey, D. K. (2025). Interactive dashboards and their
impact on business analytics performance: Insights into usability, efficiency, and
value.  International  Journal  of  Creative  Research  Thoughts,  13(6),  c96-c102.
https://ijcrt.org/papers/IJCRT2506245.pdf

[58]  Tang et  al.  (2025). Mass customization and consumer behaviors:  Exploring the
roles of perceived value and perceived cost in fast-casual restaurants. Journal of

257

Hospitality
https://www.sciencedirect.com/science/article/abs/pii/S0278431925002014

Tourism

&

Research.

[59]  Croitoru, G., Capatina, A., Florea, N. V., Codignola, F., & Sokolic, D. (2024). A
cross-cultural  analysis  of  perceived  value  and  customer  loyalty  in  restaurants.
International
Journal.
https://www.sciencedirect.com/science/article/pii/S244488342400024X

Entrepreneurship

Management

and

[60]  Kamariotou, M., Kitsios, F., Charatsari, C., Lioutas, E. D., & Talias, M. A. (2022).
Digital strategy decision support systems in agrifood supply chain management in
SMEs. Sensors, 22(1), 274. https://doi.org/10.3390/s22010274

[61]  Sutantio,  R.  A.,  Komariyah,  S.,  Sularso,  R.  A.,  &  Afandi,  M.  F.  (2024).
Understanding  consumer  behavior  with  the  use  of  the  Technology  Acceptance
Model
Sciences.
https://doi.org/10.18502/kss.v9i10.15716

booking.

Social

online

KnE

in

[62]  Huang,  Y.  (2023).  Influence  of  the  technology  acceptance  model  on  customer
travel  booking  mobile  applications.  Human  Behavior,
https://so01.tci-

engagement
Development
thaijo.org/index.php/hbds/article/view/273288

Society.

and

in

[63]  Optimizely. (2024). What is a content management system (CMS)? Optimizely.
https://www.optimizely.com/optimization-glossary/content-management-system/

258

APPENDICES

APPENDIX A: Group / Client Profile

259

THESIS READER CERTIFICATION

260

APPENDIX B: Project Adviser Approval Letter

261

262

APPENDIX C: Project Adviser Commitment Form

263

APPENDIX D: Project Adviser Role and Responsibility

264

APPENDIX E: Progress Reports

265

266

267

268

269

270

271

272

APPENDIX F: Title Defense Grade Sheet

273

274

APPENDIX G: Mock Defense Grade Sheet

275

276

277

278

279

280

APPENDIX H: Endorsement Form

281

APPENDIX I: Survey Questionnaire

282

283

284

285

286

287

