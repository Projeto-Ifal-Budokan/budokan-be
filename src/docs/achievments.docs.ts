/**
 * @openapi
 * /achievments:
 *   get:
 *     summary: Lista conquistas
 *     tags:
 *       - Achievments
 *     parameters:
 *       - in: query
 *         name: idPractitioner
 *         schema:
 *           type: integer
 *         description: ID do praticante
 *       - in: query
 *         name: idDiscipline
 *         schema:
 *           type: integer
 *         description: ID da disciplina
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
 *         description: Lista de conquistas
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
 *                     $ref: '#/components/schemas/Achievment'
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
 *     summary: Cria uma nova conquista
 *     tags:
 *       - Achievments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAchievmentInput'
 *     responses:
 *       201:
 *         description: Conquista criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conquista criada com sucesso
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
 *
 * /achievments/{id}:
 *   get:
 *     summary: Busca uma conquista pelo ID
 *     tags:
 *       - Achievments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conquista
 *     responses:
 *       200:
 *         description: Conquista encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Achievment'
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
 *         description: Conquista não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conquista não encontrada
 *
 *   put:
 *     summary: Atualiza uma conquista
 *     tags:
 *       - Achievments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conquista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAchievmentInput'
 *     responses:
 *       200:
 *         description: Conquista atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conquista atualizada com sucesso
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
 *         description: Conquista não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conquista não encontrada
 *
 *   delete:
 *     summary: Exclui uma conquista
 *     tags:
 *       - Achievments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da conquista
 *     responses:
 *       200:
 *         description: Conquista excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conquista excluída com sucesso
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
 *         description: Conquista não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conquista não encontrada
 *
 * components:
 *   schemas:
 *     Achievment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         idPractitioner:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         disciplineName:
 *           type: string
 *         practitionerFirstName:
 *           type: string
 *         practitionerSurname:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         achievementDate:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateAchievmentInput:
 *       type: object
 *       properties:
 *         idPractitioner:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         achievementDate:
 *           type: string
 *           format: date
 *       required:
 *         - idPractitioner
 *         - title
 *         - description
 *         - achievementDate
 *     UpdateAchievmentInput:
 *       type: object
 *       properties:
 *         idPractitioner:
 *           type: integer
 *         idDiscipline:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         achievementDate:
 *           type: string
 *           format: date
 */ 