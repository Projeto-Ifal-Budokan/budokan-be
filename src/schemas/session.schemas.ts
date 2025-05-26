import { z } from "zod";

export const createSessionSchema = z.object({
    idInstructor: z.number().int().positive("ID do instrutor é obrigatório"),
    idDiscipline: z.number().int().positive("ID da disciplina é obrigatório"),
    date: z.string().refine((date) => {
        const parsedDate = new Date(date);
        return (parsedDate.getDate());
    }, "Data inválida"),
    startingTime: z.string().refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (
            (hours >= 0 && hours <= 23) &&
            (minutes >= 0 && minutes <= 59)
        );
    }, "Hora de início inválida"),
    endingTime: z.string().refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (
            (hours >= 0 && hours <= 23) &&
            (minutes >= 0 && minutes <= 59)
        );
    }, "Hora de término inválida"),
}).refine((data) => {
    // Converte os horários para minutos totais para comparação
    const [startHours, startMinutes] = data.startingTime.split(':').map(Number);
    const [endHours, endMinutes] = data.endingTime.split(':').map(Number);
    
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    
    return endTotal > startTotal;
}, {
    message: "O horário de término deve ser após o horário de início",
    path: ["endingTime"] // Isso associa o erro ao campo endingTime
});

export const updateSessionSchema = z.object({
    idInstructor: z.number().int().positive().optional(),
    idDiscipline: z.number().int().positive().optional(),
    date: z.string().refine((date) => {
        const parsedDate = new Date(date);
        return (parsedDate.getDate());
    }, "Data inválida").optional(),
    startingTime: z.string().refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (
            (hours >= 0 && hours <= 23) &&
            (minutes >= 0 && minutes <= 59)
        );
    }, "Hora de início inválida").optional(),
    endingTime: z.string().refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (
            (hours >= 0 && hours <= 23) &&
            (minutes >= 0 && minutes <= 59)
        );
    }, "Hora de término inválida").optional(),
}).refine((data) => {
    // Converte os horários para minutos totais para comparação
    const [startHours, startMinutes] = data.startingTime ? data.startingTime.split(':').map(Number) : [0, 0];
    const [endHours, endMinutes] = data.endingTime ? data.endingTime.split(':').map(Number) : [0, 0];
    
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    
    return endTotal > startTotal;
}, {
    message: "O horário de término deve ser após o horário de início",
    path: ["endingTime"] // Isso associa o erro ao campo endingTime
});

export const listSessionSchema = z.object({
    initialDate: z.string().refine((date) => {
        const parsedDate = new Date(date);
        return (parsedDate.getDate());
    }, "Data inicial inválida").optional(),
    finalDate: z.string().refine((date) => {
        const parsedDate = new Date(date);
        return (parsedDate.getDate());
    }, "Data final inválida").optional(),
    idInstructor: z.number().int().positive().optional(),
    idDiscipline: z.number().int().positive().optional(),
    idMatriculation: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
});

export type CreateSessionInput = z.infer<
    typeof createSessionSchema
>;
export type UpdateSessionInput = z.infer<
    typeof updateSessionSchema
>;
export type ListSessionInput = z.infer<
    typeof listSessionSchema
>;