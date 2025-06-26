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
 */
