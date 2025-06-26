/**
 * @openapi
 * /matriculations:
 *   get:
 *     tags:
 *       - Matriculations
 *     summary: Lista matrículas
 *     description: Lista todas as matrículas com filtros opcionais e paginação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idStudent
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do estudante
 *       - in: query
 *         name: idDiscipline
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da disciplina
 *       - in: query
 *         name: idRank
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da graduação
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         description: Filtrar por status da matrícula
 *       - in: query
 *         name: isPaymentExempt
 *         schema:
 *           type: string
 *           enum: [Y, N]
 *         description: Filtrar por isenção de pagamento
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
 *         description: Lista de matrículas retornada com sucesso
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
 *                     $ref: '#/components/schemas/Matriculation'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *   post:
 *     tags:
 *       - Matriculations
 *     summary: Cria uma nova matrícula
 *     description: Cria uma nova matrícula para um estudante em uma disciplina
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMatriculationInput'
 *     responses:
 *       201:
 *         description: Matrícula criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Matrícula criada com sucesso"
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
 *                       example: "ID do estudante é obrigatório"
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
 *                       example: "Falha ao criar registro de estudante"
 *                     - type: string
 *                       example: "Disciplina não encontrada"
 *                     - type: string
 *                       example: "Graduação não encontrada ou não pertence à disciplina selecionada"
 *       409:
 *         description: Matrícula já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Este estudante já possui uma matrícula nesta disciplina"
 * /matriculations/{id}:
 *   get:
 *     tags:
 *       - Matriculations
 *     summary: Busca uma matrícula por ID
 *     description: Retorna os detalhes de uma matrícula específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     responses:
 *       200:
 *         description: Matrícula encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Matriculation'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Matrícula não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Matrícula não encontrada"
 *   put:
 *     tags:
 *       - Matriculations
 *     summary: Atualiza uma matrícula
 *     description: Atualiza os dados de uma matrícula existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMatriculationInput'
 *     responses:
 *       200:
 *         description: Matrícula atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Matrícula atualizada com sucesso"
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
 *         description: Matrícula ou graduação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: "Matrícula não encontrada"
 *                     - type: string
 *                       example: "Graduação não encontrada ou não pertence à disciplina da matrícula"
 *   delete:
 *     tags:
 *       - Matriculations
 *     summary: Remove uma matrícula
 *     description: Remove uma matrícula do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula
 *     responses:
 *       200:
 *         description: Matrícula removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Matrícula excluída com sucesso"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Matrícula não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Matrícula não encontrada"
 */
