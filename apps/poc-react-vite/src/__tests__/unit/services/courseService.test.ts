import { describe, it, expect, vi, beforeEach } from "vitest";
// Mock apiClient BEFORE importing courseService
vi.mock("@/services/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));
import * as courseService from "@/services/courseService";
import { apiClient } from "@/services/api";
import type {
  ICourse,
  ICreateCoursePayload,
  IUpdateCoursePayload,
} from "@ava-poc/types";

describe("courseService", () => {
  const mockedGet = vi.mocked(apiClient.get);
  const mockedPost = vi.mocked(apiClient.post);
  const mockedPut = vi.mocked(apiClient.put);
  const mockedDelete = vi.mocked(apiClient.delete);
  const mockedPatch = vi.mocked(apiClient.patch);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar cursos paginados", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        data: { content: [{ id: 1, titulo: "Curso Teste" }], totalElements: 1 },
        message: "",
        status: 200,
      },
    });
    const result = await courseService.fetchCourses({ page: 0, size: 10 });
    expect(mockedGet).toHaveBeenCalledWith("/cursos", {
      params: { page: 0, size: 10 },
    });
    expect(result.content[0].titulo).toBe("Curso Teste");
  });

  it("deve buscar curso por ID", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        data: { id: 1, titulo: "Curso Teste" },
        message: "",
        status: 200,
      },
    });
    const result = await courseService.fetchCourseById("1");
    expect(mockedGet).toHaveBeenCalledWith("/cursos/1");
    expect(result.titulo).toBe("Curso Teste");
  });

  it("deve criar curso", async () => {
    const payload: ICreateCoursePayload = {
      titulo: "Novo Curso",
      categoria: "TI",
      descricao: "desc",
      cargaHoraria: "20h",
    } as any;
    mockedPost.mockResolvedValueOnce({
      data: { data: { id: 2, titulo: "Novo Curso" }, message: "", status: 201 },
    });
    const result = await courseService.createCourse(payload);
    expect(mockedPost).toHaveBeenCalledWith("/cursos", payload);
    expect(result.titulo).toBe("Novo Curso");
  });

  it("deve atualizar curso", async () => {
    const payload: IUpdateCoursePayload = { titulo: "Atualizado" } as any;
    mockedPut.mockResolvedValueOnce({
      data: { data: { id: 1, titulo: "Atualizado" }, message: "", status: 200 },
    });
    const result = await courseService.updateCourse("1", payload);
    expect(mockedPut).toHaveBeenCalledWith("/cursos/1", payload);
    expect(result.titulo).toBe("Atualizado");
  });

  it("deve deletar curso", async () => {
    mockedDelete.mockResolvedValueOnce({
      data: { message: "Removido", status: 204 },
    });
    await courseService.deleteCourse("1");
    expect(mockedDelete).toHaveBeenCalledWith("/cursos/1");
  });

  it("deve alterar status do curso", async () => {
    mockedPatch.mockResolvedValueOnce({
      data: { data: { id: 1, status: "PUBLICADO" }, message: "", status: 200 },
    });
    const result = await courseService.updateCourseStatus("1", "PUBLICADO");
    expect(mockedPatch).toHaveBeenCalledWith("/cursos/1/status", {
      status: "PUBLICADO",
    });
    expect(result.status).toBe("PUBLICADO");
  });

  it("deve buscar cursos por texto", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { data: [{ id: 1, titulo: "Busca" }], message: "", status: 200 },
    });
    const result = await courseService.searchCourses("Busca");
    expect(mockedGet).toHaveBeenCalledWith("/cursos/buscar", {
      params: { q: "Busca" },
    });
    expect(result[0].titulo).toBe("Busca");
  });
});
