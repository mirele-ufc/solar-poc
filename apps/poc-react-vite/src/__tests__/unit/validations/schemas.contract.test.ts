import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginRequestSchema,
  registerSchema,
} from "@/validations/authSchema";
import {
  courseCreateRequestSchema,
  courseUpdateRequestSchema,
  courseModulesFormSchema,
} from "@/validations/courseSchema";
import { enrollmentSchema } from "@/validations/enrollmentSchema";
import { questionSchema, quizSubmitSchema } from "@/validations/examSchema";
import {
  imageFileSchema,
  optionalUploadFileSchema,
  pdfFileSchema,
  profileImageDimensionSchema,
  uploadFileSchema,
  videoFileSchema,
} from "@/validations/fileSchema";
import { composeMessageSchema } from "@/validations/messageSchema";

const createFile = (sizeInBytes: number, type: string, name = "file.bin") =>
  new File([new Uint8Array(sizeInBytes)], name, { type });

describe("schemas contract alignment", () => {
  it("should fail on invalid login email", () => {
    const result = loginRequestSchema.safeParse({
      email: "x",
      senha: "123456",
    });

    expect(result.success).toBe(false);
  });

  it("should pass register with valid CPF", () => {
    const result = registerSchema.safeParse({
      nome: "João Silva",
      cpf: "12345678901",
      email: "valid@ufc.br",
      password: "123456",
      confirmPassword: "123456",
      perfil: "professor",
    });

    expect(result.success).toBe(true);
  });

  it("should pass for 200x200 image metadata", () => {
    const result = profileImageDimensionSchema.safeParse({
      width: 200,
      height: 200,
    });

    expect(result.success).toBe(true);
  });

  it("should fail for 100x100 image metadata", () => {
    const result = profileImageDimensionSchema.safeParse({
      width: 100,
      height: 100,
    });

    expect(result.success).toBe(false);
  });

  it("should fail login request when password has less than 6 chars", () => {
    const result = loginRequestSchema.safeParse({
      email: "valid@ufc.br",
      senha: "12345",
    });

    expect(result.success).toBe(false);
  });

  it("should fail register when CPF is invalid", () => {
    const result = registerSchema.safeParse({
      cpf: "123",
      email: "valid@ufc.br",
      password: "123456",
      confirmPassword: "123456",
      gender: "masculino",
    });

    expect(result.success).toBe(false);
  });

  it("should fail register when passwords do not match", () => {
    const result = registerSchema.safeParse({
      cpf: "12345678901",
      email: "valid@ufc.br",
      password: "123456",
      confirmPassword: "654321",
      gender: "masculino",
    });

    expect(result.success).toBe(false);
  });

  it("should fail forgot password when email is invalid", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "invalid-email",
    });

    expect(result.success).toBe(false);
  });

  it("should fail course create when title is empty", () => {
    const result = courseCreateRequestSchema.safeParse({
      titulo: "",
      descricao: "descricao",
      categoria: "categoria",
      cargaHoraria: "10h",
    });

    expect(result.success).toBe(false);
  });

  it("should fail course update when payload is empty", () => {
    const result = courseUpdateRequestSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("should allow modules schema when one module has no image", () => {
    const result = courseModulesFormSchema.safeParse({
      modules: [{}],
    });

    expect(result.success).toBe(true);
  });

  it("should fail enrollment when firstName is missing", () => {
    const result = enrollmentSchema.safeParse({
      firstName: "",
      lastName: "Silva",
      city: "Fortaleza",
      gender: "masculino",
    });

    expect(result.success).toBe(false);
  });

  it("should fail question schema when there are less than two filled options", () => {
    const result = questionSchema.safeParse({
      questionText: "Pergunta",
      options: [
        { id: "1", text: "Alternativa" },
        { id: "2", text: "   " },
      ],
      correctOptionId: "1",
      points: 1,
    });

    expect(result.success).toBe(false);
  });

  it("should fail question schema when correct option does not match a filled option", () => {
    const result = questionSchema.safeParse({
      questionText: "Pergunta",
      options: [
        { id: "1", text: "A" },
        { id: "2", text: "B" },
      ],
      correctOptionId: "3",
      points: 1,
    });

    expect(result.success).toBe(false);
  });

  it("should fail quiz submit when answers are empty", () => {
    const result = quizSubmitSchema.safeParse({
      studentId: "student-id",
      courseId: "course-id",
      answers: [],
    });

    expect(result.success).toBe(false);
  });

  it("should fail image file schema when MIME type is invalid", () => {
    const result = imageFileSchema.safeParse(
      createFile(1024, "application/pdf", "avatar.pdf"),
    );

    expect(result.success).toBe(false);
  });

  it("should fail image file schema when file exceeds 5MB", () => {
    const result = imageFileSchema.safeParse(
      createFile(5 * 1024 * 1024 + 1, "image/png", "avatar.png"),
    );

    expect(result.success).toBe(false);
  });

  it("should fail video schema when MIME type is invalid", () => {
    const result = videoFileSchema.safeParse(
      createFile(1024, "text/plain", "video.txt"),
    );

    expect(result.success).toBe(false);
  });

  it("should fail pdf schema when MIME type is invalid", () => {
    const result = pdfFileSchema.safeParse(
      createFile(1024, "image/png", "doc.png"),
    );

    expect(result.success).toBe(false);
  });

  it("should fail upload schema for unsupported MIME type", () => {
    const result = uploadFileSchema.safeParse(
      createFile(1024, "video/mp4", "video.mp4"),
    );

    expect(result.success).toBe(false);
  });

  it("should allow optional upload schema to accept null", () => {
    const result = optionalUploadFileSchema.safeParse(null);

    expect(result.success).toBe(true);
  });

  it("should fail compose message schema when subject is too long", () => {
    const result = composeMessageSchema.safeParse({
      recipient: "usuario",
      subject: "a".repeat(201),
      message: "Mensagem válida",
    });

    expect(result.success).toBe(false);
  });
});
