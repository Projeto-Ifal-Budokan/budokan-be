/**
 * @openapi
 * /instructor-disciplines:
 *   get:
 *     tags:
 *       - Instructor Disciplines
 *     summary: Lista vínculos instrutor-disciplina
 *     description: Lista todos os vínculos entre instrutores e disciplinas com filtros opcionais e paginação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idInstructor
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do instrutor
 *       - in: query
 *         name: idDiscipline
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da disciplina
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         description: Filtrar por status do vínculo
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: page_size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Tamanho da página
 *     responses:
 *       200:
 *         description: Lista de vínculos instrutor-disciplina retornada com sucesso
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
 *                     $ref: '#/components/schemas/InstructorDiscipline'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *   post:
 *     tags:
 *       - Instructor Disciplines
 *     summary: Cria um novo vínculo instrutor-disciplina
 *     description: Cria um novo vínculo entre um instrutor e uma disciplina
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstructorDisciplineInput'
 *     responses:
 *       201:
 *         description: Vínculo instrutor-disciplina criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vínculo instrutor-disciplina criado com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: "ID do instrutor é obrigatório"
 *                     - type: string
 *                       example: "ID da disciplina é obrigatório"
 *                     - type: string
 *                       example: "ID da graduação é obrigatório"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Recurso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: "Usuário não encontrado como praticante"
 *                     - type: string
 *                       example: "Falha ao criar registro de instrutor"
 *                     - type: string
 *                       example: "Disciplina não encontrada"
 *                     - type: string
 *                       example: "Graduação não encontrada ou não pertence à disciplina selecionada"
 *       409:
 *         description: Vínculo já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Este instrutor já possui um vínculo com esta disciplina"
 * /instructor-disciplines/{id}:
 *   get:
 *     tags:
 *       - Instructor Disciplines
 *     summary: Busca um vínculo instrutor-disciplina por ID
 *     description: Retorna os detalhes de um vínculo específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do vínculo instrutor-disciplina
 *     responses:
 *       200:
 *         description: Vínculo instrutor-disciplina encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstructorDiscipline'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Vínculo instrutor-disciplina não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vínculo de instrutor-disciplina não encontrado"
 *   put:
 *     tags:
 *       - Instructor Disciplines
 *     summary: Atualiza um vínculo instrutor-disciplina
 *     description: Atualiza os dados de um vínculo existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do vínculo instrutor-disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInstructorDisciplineInput'
 *     responses:
 *       200:
 *         description: Vínculo instrutor-disciplina atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vínculo instrutor-disciplina atualizado com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID da graduação é obrigatório"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Vínculo ou graduação não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: "Vínculo instrutor-disciplina não encontrado"
 *                     - type: string
 *                       example: "Graduação não encontrada ou não pertence à disciplina do vínculo"
 *   delete:
 *     tags:
 *       - Instructor Disciplines
 *     summary: Remove um vínculo instrutor-disciplina
 *     description: Remove um vínculo entre instrutor e disciplina do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do vínculo instrutor-disciplina
 *     responses:
 *       200:
 *         description: Vínculo instrutor-disciplina removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vínculo instrutor-disciplina excluído com sucesso"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Vínculo instrutor-disciplina não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vínculo instrutor-disciplina não encontrado"
 */
