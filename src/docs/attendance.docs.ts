/**
 * @openapi
 * /attendances:
 *   get:
 *     summary: Lista registros de frequência
 *     tags:
 *       - Attendances
 *     parameters:
 *       - in: query
 *         name: idSession
 *         schema:
 *           type: integer
 *         description: ID da sessão
 *       - in: query
 *         name: idDiscipline
 *         schema:
 *           type: integer
 *         description: ID da disciplina
 *       - in: query
 *         name: idMatriculation
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Data da sessão
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [present, absent]
 *         description: Status da frequência
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página para paginação
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *         description: Tamanho da página
 *     responses:
 *       200:
 *         description: Lista de frequências
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page_size:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 count:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attendance'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Não autenticado
 *       403:
 *         description: Você não tem permissão para acessar este recurso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você não tem permissão para acessar este recurso
 *
 *   post:
 *     summary: Lança frequência para uma sessão
 *     tags:
 *       - Attendances
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceInput'
 *     responses:
 *       201:
 *         description: Frequência lançada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Frequência lançada com sucesso
 *                 count:
 *                   type: integer
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dados inválidos
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Não autenticado
 *       403:
 *         description: Você não tem permissão para acessar este recurso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você não tem permissão para acessar este recurso
 *       404:
 *         description: Aula não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aula não encontrada
 *       409:
 *         description: Frequência já lançada para esta aula
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Frequência já lançada para esta aula
 *                 error:
 *                   type: string
 *                   example: conflict
 *
 * /attendances/session/{id}:
 *   put:
 *     summary: Atualiza registros de frequência de uma sessão
 *     tags:
 *       - Attendances
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da sessão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAttendanceInput'
 *     responses:
 *       200:
 *         description: Frequência atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Frequência atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dados inválidos
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Não autenticado
 *       403:
 *         description: Você não tem permissão para acessar este recurso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você não tem permissão para acessar este recurso
 *       404:
 *         description: Aula não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aula não encontrada
 *
 * /attendances/{id}:
 *   delete:
 *     summary: Remove um registro de frequência
 *     tags:
 *       - Attendances
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do registro de frequência
 *     responses:
 *       200:
 *         description: Frequência removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Frequência removida com sucesso
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Não autenticado
 *       403:
 *         description: Você não tem permissão para acessar este recurso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Você não tem permissão para acessar este recurso
 *       404:
 *         description: Frequência não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Frequência não encontrada
 */
