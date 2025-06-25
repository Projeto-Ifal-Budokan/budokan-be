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
 */
