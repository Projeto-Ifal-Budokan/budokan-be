import fs from "node:fs";
import path from "node:path";
import type { Request } from "express";
import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

// Declaração de tipos para o multer
declare global {
	namespace Express {
		namespace Multer {
			interface File {
				originalname: string;
				mimetype: string;
				size: number;
				path: string;
			}
		}
	}
}

// Configuração do diretório de uploads
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const PROFILE_IMAGES_DIR = path.join(UPLOAD_DIR, "profile-images");

// Criar diretórios se não existirem
const ensureDirectories = () => {
	if (!fs.existsSync(UPLOAD_DIR)) {
		fs.mkdirSync(UPLOAD_DIR, { recursive: true });
	}
	if (!fs.existsSync(PROFILE_IMAGES_DIR)) {
		fs.mkdirSync(PROFILE_IMAGES_DIR, { recursive: true });
	}
};

ensureDirectories();

// Configuração do multer para armazenamento
const storage = multer.diskStorage({
	destination: (
		_req: Request,
		_file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void,
	) => {
		cb(null, PROFILE_IMAGES_DIR);
	},
	filename: (
		_req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, filename: string) => void,
	) => {
		// Gerar nome único para o arquivo
		const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	},
});

// Filtro para validar tipos de arquivo
const fileFilter = (
	_req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	// Verificar se é uma imagem
	if (!file.mimetype.startsWith("image/")) {
		return cb(new Error("Apenas arquivos de imagem são permitidos"));
	}

	// Verificar extensões permitidas
	const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
	const fileExtension = path.extname(file.originalname).toLowerCase();

	if (!allowedExtensions.includes(fileExtension)) {
		return cb(
			new Error("Formato de imagem não suportado. Use: JPG, PNG ou WebP"),
		);
	}

	// Verificar tamanho do arquivo (máximo 5MB)
	if (file.size > 5 * 1024 * 1024) {
		return cb(new Error("Arquivo muito grande. Tamanho máximo: 5MB"));
	}

	cb(null, true);
};

// Configuração do multer
export const uploadProfileImage = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
		files: 1, // Apenas 1 arquivo por vez
	},
});

// Função para otimizar imagem de perfil
export const optimizeProfileImage = async (
	filePath: string,
): Promise<string> => {
	const optimizedPath = filePath.replace(/\.[^/.]+$/, "_optimized.webp");

	try {
		await sharp(filePath)
			.resize(400, 400, {
				fit: "cover",
				position: "center",
			})
			.webp({ quality: 80 })
			.toFile(optimizedPath);

		// Remover arquivo original
		fs.unlinkSync(filePath);

		return optimizedPath;
	} catch (error) {
		// Se falhar na otimização, retornar o arquivo original
		console.error("Erro ao otimizar imagem:", error);
		return filePath;
	}
};

// Função para deletar arquivo de imagem
export const deleteProfileImage = (filePath: string): void => {
	try {
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
	} catch (error) {
		console.error("Erro ao deletar arquivo:", error);
	}
};

// Função para gerar URL pública da imagem
export const getProfileImageUrl = (filename: string): string => {
	if (process.env.NODE_ENV === "production") {
		return `${process.env.PROD_URL}/uploads/profile-images/${filename}`;
	}
	const port = process.env.PORT || "8000";
	const baseUrl = `http://localhost:${port}`;
	return `${baseUrl}/uploads/profile-images/${filename}`;
};

// Função para extrair nome do arquivo da URL
export const getFilenameFromUrl = (url: string): string | null => {
	try {
		const urlParts = url.split("/");
		return urlParts[urlParts.length - 1] || null;
	} catch {
		return null;
	}
};
