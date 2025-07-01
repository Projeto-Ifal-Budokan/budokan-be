/**
 * @openapi
 * /training-schedules:
 *   get:
 *     tags:
 *       - Training Schedules
 *     summary: Lista horários de treino
 *     description: Lista todos os horários de treino com filtros opcionais e paginação
 *     parameters:
 *       - in: query
 *         name: idDiscipline
 *         schema:
 *           type: integer
 *         description: Filtrar por ID da disciplina
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
 *         description: Lista de horários de treino retornada com sucesso
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
 *                     $ref: '#/components/schemas/TrainingSchedule'
 *   post:
 *     tags:
 *       - Training Schedules
 *     summary: Cria um novo horário de treino
 *     description: Cria um novo horário de treino para uma disciplina
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTrainingScheduleInput'
 *     responses:
 *       201:
 *         description: Horário de treino criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Horário de treino criado com sucesso"
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
 *                       example: "ID da disciplina é obrigatório"
 *                     - type: string
 *                       example: "Dia da semana inválido"
 *                     - type: string
 *                       example: "Formato de hora inválido (HH:MM)"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Disciplina não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Disciplina não encontrada"
 *       409:
 *         description: Conflito de horários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: "O horário de início deve ser anterior ao horário de fim"
 *                     - type: string
 *                       example: "Há sobreposição com outro horário de treino para esta disciplina neste dia"
 * /training-schedules/{id}:
 *   get:
 *     tags:
 *       - Training Schedules
 *     summary: Busca um horário de treino por ID
 *     description: Retorna os detalhes de um horário de treino específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do horário de treino
 *     responses:
 *       200:
 *         description: Horário de treino encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainingSchedule'
 *       404:
 *         description: Horário de treino não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Horário de treino não encontrado"
 *   put:
 *     tags:
 *       - Training Schedules
 *     summary: Atualiza um horário de treino
 *     description: Atualiza os dados de um horário de treino existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do horário de treino
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTrainingScheduleInput'
 *     responses:
 *       200:
 *         description: Horário de treino atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Horário de treino atualizado com sucesso"
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
 *                       example: "Dia da semana inválido"
 *                     - type: string
 *                       example: "Formato de hora inválido (HH:MM)"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Horário de treino ou disciplina não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: "Horário de treino não encontrado"
 *                     - type: string
 *                       example: "Disciplina não encontrada"
 *       409:
 *         description: Conflito de horários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: "O horário de início deve ser anterior ao horário de fim"
 *                     - type: string
 *                       example: "Há sobreposição com outro horário de treino para esta disciplina neste dia"
 *   delete:
 *     tags:
 *       - Training Schedules
 *     summary: Remove um horário de treino
 *     description: Remove um horário de treino do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do horário de treino
 *     responses:
 *       200:
 *         description: Horário de treino removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Horário de treino excluído com sucesso"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Horário de treino não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Horário de treino não encontrado"
 */
