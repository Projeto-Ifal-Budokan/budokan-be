export const cloudflareConfig = {
	// URL base do seu domínio configurado no Cloudflare
	domain: process.env.CLOUDFLARE_DOMAIN || "budokanryu.com.br",

	// Protocolo (https para produção, http para desenvolvimento)
	protocol: process.env.NODE_ENV === "production" ? "https" : "http",

	// Configurações de cache
	cache: {
		// Tempo de cache no edge (servidores Cloudflare)
		edgeTTL: 24 * 60 * 60, // 24 horas em segundos

		// Tempo de cache no navegador
		browserTTL: 4 * 60 * 60, // 4 horas em segundos

		// Headers de cache para imagens
		headers: {
			"Cache-Control": "public, max-age=14400, s-maxage=86400", // 4h browser, 24h edge
			"CDN-Cache-Control": "public, max-age=86400", // 24h no Cloudflare
		},
	},

	// Configurações de otimização de imagem
	imageOptimization: {
		// Parâmetros de qualidade para WebP
		webpQuality: 80,

		// Tamanho máximo para imagens de perfil
		maxWidth: 400,
		maxHeight: 400,

		// Formatos suportados
		supportedFormats: ["jpg", "jpeg", "png", "webp"],
	},

	// Configurações de segurança
	security: {
		// Headers de segurança recomendados
		headers: {
			"X-Content-Type-Options": "nosniff",
			"X-Frame-Options": "DENY",
			"X-XSS-Protection": "1; mode=block",
		},
	},
};

// Função para gerar URL completa com Cloudflare
export const getCloudflareUrl = (path: string): string => {
	const { protocol, domain } = cloudflareConfig;
	return `${protocol}://${domain}${path}`;
};

// Função para gerar URL de imagem de perfil com Cloudflare
export const getProfileImageCloudflareUrl = (filename: string): string => {
	return getCloudflareUrl(`/uploads/profile-images/${filename}`);
};

// Headers recomendados para imagens servidas via Cloudflare
export const getImageHeaders = () => {
	return {
		...cloudflareConfig.cache.headers,
		...cloudflareConfig.security.headers,
		"Content-Type": "image/webp",
		"Accept-Ranges": "bytes",
	};
};
