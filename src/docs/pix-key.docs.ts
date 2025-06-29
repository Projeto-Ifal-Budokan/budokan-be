/**
 * @openapi
 * /pix-keys:
 *   get:
 *     tags:
 *       - Pix Keys
 *     summary: Lista chaves PIX
 *     description: Lista todas as chaves PIX com filtros opcionais e paginação
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idInstructor
 *         schema:
 *           type: integer
 *         description: Filtrar por ID do instrutor
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
 *         description: Lista de chaves PIX retornada com sucesso
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
 *                     $ref: '#/components/schemas/PixKey'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *   post:
 *     tags:
 *       - Pix Keys
 *     summary: Cria uma nova chave PIX
 *     description: Cria uma nova chave PIX para um instrutor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePixKeyInput'
 *     responses:
 *       201:
 *         description: Chave PIX criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chave pix criada com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID do estudante é obrigatório"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Instrutor não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Instrutor não identificado"
 *       409:
 *         description: Chave PIX já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chave pix já registrada"
 * /pix-keys/{id}:
 *   get:
 *     tags:
 *       - Pix Keys
 *     summary: Busca uma chave PIX por ID
 *     description: Retorna os detalhes de uma chave PIX específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da chave PIX
 *     responses:
 *       200:
 *         description: Chave PIX encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PixKey'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Chave PIX não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chave pix não encontrada"
 *   put:
 *     tags:
 *       - Pix Keys
 *     summary: Atualiza uma chave PIX
 *     description: Atualiza os dados de uma chave PIX existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da chave PIX
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePixKeyInput'
 *     responses:
 *       200:
 *         description: Chave PIX atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chave pix atualizada com sucesso"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "ID do estudante é obrigatório"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Chave PIX ou instrutor não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   oneOf:
 *                     - type: string
 *                       example: "Chave pix não encontrada"
 *                     - type: string
 *                       example: "Instrutor não identificado"
 *   delete:
 *     tags:
 *       - Pix Keys
 *     summary: Remove uma chave PIX
 *     description: Remove uma chave PIX do sistema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da chave PIX
 *     responses:
 *       200:
 *         description: Chave PIX removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chave pix excluída com sucesso"
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado - privilégio insuficiente
 *       404:
 *         description: Chave PIX não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chave pix não encontrada"
 */
