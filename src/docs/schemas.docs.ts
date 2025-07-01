/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         surname:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         profileImageUrl:
 *           type: string
 *           format: uri
 *           description: URL da imagem de perfil do usuário
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         surname:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         profileImageUrl:
 *           type: string
 *           format: uri
 *           description: URL da imagem de perfil do usuário
 *       required: []
 *     ToggleUserStatusInput:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *       required:
 *         - status
 *     RegisterInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         surname:
 *           type: string
 *         phone:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         isPractitioner:
 *           type: boolean
 *         healthObservations:
 *           type: string
 *         emergencyContacts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EmergencyContactInput'
 *     EmergencyContactInput:
 *       type: object
 *       properties:
 *         phone:
 *           type: string
 *         relationship:
 *           type: string
 *     LoginInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     ForgotPasswordInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *     ResetPasswordInput:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         password:
 *           type: string
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         surname:
 *           type: string
 *         status:
 *           type: string
 *         phone:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         profileImageUrl:
 *           type: string
 *           format: uri
 *           description: URL da imagem de perfil do usuário
 *     AssignUserRoleInput:
 *       type: object
 *       properties:
 *         idUser:
 *           type: integer
 *         idRole:
 *           type: integer
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     Session:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idInstructorDiscipline:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         startingTime:
 *           type: string
 *           example: '08:00'
 *         endingTime:
 *           type: string
 *           example: '09:00'
 *         isLastSessionOfDay:
 *           type: boolean
 *     CreateSessionInput:
 *       type: object
 *       properties:
 *         idInstructor:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         startingTime:
 *           type: string
 *           example: '08:00'
 *         endingTime:
 *           type: string
 *           example: '09:00'
 *         isLastSessionOfDay:
 *           type: boolean
 *     UpdateSessionInput:
 *       type: object
 *       properties:
 *         idInstructor:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         startingTime:
 *           type: string
 *           example: '08:00'
 *         endingTime:
 *           type: string
 *           example: '09:00'
 *         isLastSessionOfDay:
 *           type: boolean
 *     ListSessionInput:
 *       type: object
 *       properties:
 *         initialDate:
 *           type: string
 *           format: date
 *         finalDate:
 *           type: string
 *           format: date
 *         idInstructor:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *     ViewMatriculationSessionsInput:
 *       type: object
 *       properties:
 *         idDiscipline:
 *           type: integer
 *         initialDate:
 *           type: string
 *           format: date
 *         finalDate:
 *           type: string
 *           format: date
 *     Attendance:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idMatriculation:
 *           type: integer
 *         idSession:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [present, absent]
 *         studentName:
 *           type: string
 *           description: Nome completo do estudante
 *         studentProfileImageUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL da imagem de perfil do estudante
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         session:
 *           $ref: '#/components/schemas/Session'
 *     CreateAttendanceInput:
 *       type: object
 *       properties:
 *         idSession:
 *           type: integer
 *     AttendanceUpdateItem:
 *       type: object
 *       properties:
 *         idMatriculation:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [present, absent]
 *     UpdateAttendanceInput:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/AttendanceUpdateItem'
 *     DailyAbsence:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idMatriculation:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         justification:
 *           type: string
 *           enum: [medical, personal, professional, weather, transport, family, academic, technical, emergency, other]
 *         justificationDescription:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateDailyAbsenceInput:
 *       type: object
 *       properties:
 *         idMatriculation:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         justification:
 *           type: string
 *           enum: [medical, personal, professional, weather, transport, family, academic, technical, emergency, other]
 *         justificationDescription:
 *           type: string
 *     UpdateDailyAbsenceInput:
 *       type: object
 *       properties:
 *         justification:
 *           type: string
 *           enum: [medical, personal, professional, weather, transport, family, academic, technical, emergency, other]
 *         justificationDescription:
 *           type: string
 *     ProcessAbsencesForDateInput:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *     ProcessAbsencesForDateRangeInput:
 *       type: object
 *       properties:
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *     Privilege:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CreatePrivilegeInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *         description:
 *           type: string
 *           maxLength: 255
 *     UpdatePrivilegeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 100
 *         description:
 *           type: string
 *           maxLength: 255
 *     AssignRolePrivilegeInput:
 *       type: object
 *       properties:
 *         idRole:
 *           type: integer
 *         idPrivilege:
 *           type: integer
 *     Discipline:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateDisciplineInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     UpdateDisciplineInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *     ListDisciplineInput:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *     PixKey:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idInstructor:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [email, cpf, phone, randomKey]
 *         key:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreatePixKeyInput:
 *       type: object
 *       properties:
 *         idInstructor:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [email, cpf, phone, randomKey]
 *         key:
 *           type: string
 *         description:
 *           type: string
 *     UpdatePixKeyInput:
 *       type: object
 *       properties:
 *         idInstructor:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [email, cpf, phone, randomKey]
 *         key:
 *           type: string
 *         description:
 *           type: string
 *     ListPixKeyInput:
 *       type: object
 *       properties:
 *         idInstructor:
 *           type: integer
 *     Rank:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         disciplineName:
 *           type: string
 *     CreateRankInput:
 *       type: object
 *       required:
 *         - idDiscipline
 *         - name
 *         - description
 *       properties:
 *         idDiscipline:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     UpdateRankInput:
 *       type: object
 *       properties:
 *         idDiscipline:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *     Matriculation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idStudent:
 *           type: integer
 *         studentName:
 *           type: string
 *         studentSurname:
 *           type: string
 *         studentProfileImageUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL da imagem de perfil do estudante
 *         idDiscipline:
 *           type: integer
 *         disciplineName:
 *           type: string
 *         idRank:
 *           type: integer
 *           nullable: true
 *         rankName:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         isPaymentExempt:
 *           type: string
 *           enum: [Y, N]
 *         activatedBy:
 *           type: integer
 *           nullable: true
 *         inactivatedBy:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CreateMatriculationInput:
 *       type: object
 *       required:
 *         - idStudent
 *         - idDiscipline
 *         - idRank
 *       properties:
 *         idStudent:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         idRank:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         isPaymentExempt:
 *           type: string
 *           enum: [Y, N]
 *         activatedBy:
 *           type: integer
 *     UpdateMatriculationInput:
 *       type: object
 *       properties:
 *         idRank:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         isPaymentExempt:
 *           type: string
 *           enum: [Y, N]
 *         activatedBy:
 *           type: integer
 *         inactivatedBy:
 *           type: integer
 *     ListMatriculationInput:
 *       type: object
 *       properties:
 *         idStudent:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         idRank:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         isPaymentExempt:
 *           type: string
 *           enum: [Y, N]
 *     PractitionerContact:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idPractitioner:
 *           type: integer
 *         phone:
 *           type: string
 *         relationship:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CreatePractitionerContactInput:
 *       type: object
 *       required:
 *         - phone
 *         - relationship
 *       properties:
 *         phone:
 *           type: string
 *         relationship:
 *           type: string
 *           maxLength: 100
 *     UpdatePractitionerContactInput:
 *       type: object
 *       properties:
 *         phone:
 *           type: string
 *         relationship:
 *           type: string
 *           maxLength: 100
 *     TrainingSchedule:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         disciplineName:
 *           type: string
 *         weekday:
 *           type: string
 *           enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *         startTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *           example: "18:00"
 *         endTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *           example: "19:30"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CreateTrainingScheduleInput:
 *       type: object
 *       required:
 *         - idDiscipline
 *         - weekday
 *         - startTime
 *         - endTime
 *       properties:
 *         idDiscipline:
 *           type: integer
 *         weekday:
 *           type: string
 *           enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *         startTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *           example: "18:00"
 *         endTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *           example: "19:30"
 *     UpdateTrainingScheduleInput:
 *       type: object
 *       properties:
 *         idDiscipline:
 *           type: integer
 *         weekday:
 *           type: string
 *           enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *         startTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *           example: "18:00"
 *         endTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *           example: "19:30"
 *     InstructorDiscipline:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idInstructor:
 *           type: integer
 *         instructorName:
 *           type: string
 *         instructorProfileImageUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL da imagem de perfil do instrutor
 *         idDiscipline:
 *           type: integer
 *         disciplineName:
 *           type: string
 *         idRank:
 *           type: integer
 *           nullable: true
 *         rankName:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         activatedBy:
 *           type: integer
 *           nullable: true
 *         inactivatedBy:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CreateInstructorDisciplineInput:
 *       type: object
 *       required:
 *         - idInstructor
 *         - idDiscipline
 *         - idRank
 *       properties:
 *         idInstructor:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         idRank:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         activatedBy:
 *           type: integer
 *     UpdateInstructorDisciplineInput:
 *       type: object
 *       properties:
 *         idRank:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         activatedBy:
 *           type: integer
 *         inactivatedBy:
 *           type: integer
 *     ListInstructorDisciplineInput:
 *       type: object
 *       properties:
 *         idInstructor:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 */
