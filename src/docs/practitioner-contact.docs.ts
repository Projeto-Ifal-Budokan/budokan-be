/**
 * @openapi
 * /practitioner-contacts:
 *   get:
 *     tags:
 *       - Practitioner Contacts
 *     summary: Lista contatos de praticantes
 *     description: Lista todos os contatos de praticantes com filtros opcionais e paginação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idPractitioner
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do praticante
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
 *         description: Lista de contatos retornada com sucesso
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
 *                     $ref: '#/components/schemas/PractitionerContact'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 * /practitioner-contacts/{id}:
 *   get:
 *     tags:
 *       - Practitioner Contacts
 *     summary: Busca um contato por ID
 *     description: Retorna os detalhes de um contato específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do contato
 *     responses:
 *       200:
 *         description: Contato encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PractitionerContact'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID inválido"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Contato não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contato não encontrado"
 *   put:
 *     tags:
 *       - Practitioner Contacts
 *     summary: Atualiza um contato
 *     description: Atualiza os dados de um contato existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do contato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePractitionerContactInput'
 *     responses:
 *       200:
 *         description: Contato atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PractitionerContact'
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
 *                       example: "ID inválido"
 *                     - type: string
 *                       example: "Telefone é obrigatório"
 *                     - type: string
 *                       example: "Relacionamento é obrigatório"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Contato não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contato não encontrado"
 *   delete:
 *     tags:
 *       - Practitioner Contacts
 *     summary: Remove um contato
 *     description: Remove um contato do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do contato
 *     responses:
 *       200:
 *         description: Contato removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contato excluído com sucesso"
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID inválido"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Contato não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: "Contato não encontrado"
 *                     - type: string
 *                       example: "Contato não encontrado ou não pertence ao praticante"
 *       409:
 *         description: Não é possível excluir o contato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Não é possível excluir o contato. Praticantes devem ter pelo menos 3 contatos de emergência"
 * /practitioner-contacts/practitioner/{id}:
 *   post:
 *     tags:
 *       - Practitioner Contacts
 *     summary: Cria um novo contato para um praticante
 *     description: Cria um novo contato de emergência para um praticante específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do praticante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePractitionerContactInput'
 *     responses:
 *       201:
 *         description: Contato criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PractitionerContact'
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
 *                       example: "ID do praticante não encontrado"
 *                     - type: string
 *                       example: "Telefone é obrigatório"
 *                     - type: string
 *                       example: "Relacionamento é obrigatório"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Praticante não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Praticante não encontrado"
 */
