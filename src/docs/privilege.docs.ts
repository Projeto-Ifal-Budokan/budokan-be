/**
 * @openapi
 * /privileges:
 *   get:
 *     tags:
 *       - Privileges
 *     summary: Lista privilégios
 *     description: Lista todos os privilégios com filtros opcionais e paginação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idPrivilege
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do privilégio específico
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filtrar por descrição (busca parcial)
 *       - in: query
 *         name: idUser
 *         schema:
 *           type: integer
 *         description: Filtrar privilégios de um usuário específico
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
 *         description: Lista de privilégios retornada com sucesso
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
 *                     $ref: '#/components/schemas/Privilege'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Privilégio não encontrado (quando idPrivilege é fornecido)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Privilégio não encontrado"
 *   post:
 *     tags:
 *       - Privileges
 *     summary: Cria um novo privilégio
 *     description: Cria um novo privilégio no sistema
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePrivilegeInput'
 *     responses:
 *       201:
 *         description: Privilégio criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Privilégio criado com sucesso"
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
 *                       example: "Nome é obrigatório"
 *                     - type: string
 *                       example: "Descrição é obrigatória"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       409:
 *         description: Privilégio com mesmo nome já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Já existe um privilégio com este nome"
 * /privileges/{id}:
 *   put:
 *     tags:
 *       - Privileges
 *     summary: Atualiza um privilégio
 *     description: Atualiza os dados de um privilégio existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do privilégio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePrivilegeInput'
 *     responses:
 *       200:
 *         description: Privilégio atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Privilégio atualizado com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nome é obrigatório"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Privilégio não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Privilégio não encontrado"
 *       409:
 *         description: Privilégio com mesmo nome já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Já existe um privilégio com este nome"
 *   delete:
 *     tags:
 *       - Privileges
 *     summary: Remove um privilégio
 *     description: Remove um privilégio do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do privilégio
 *     responses:
 *       200:
 *         description: Privilégio removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Privilégio excluído com sucesso"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Privilégio não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Privilégio não encontrado"
 * /privileges/user/{id}:
 *   get:
 *     tags:
 *       - Privileges
 *     summary: Lista privilégios de um usuário
 *     description: Lista todos os privilégios de um usuário específico através de seus papéis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filtrar por descrição (busca parcial)
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
 *         description: Lista de privilégios do usuário retornada com sucesso
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
 *                     $ref: '#/components/schemas/Privilege'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - usuário não é o dono e não tem privilégios suficientes
 */
