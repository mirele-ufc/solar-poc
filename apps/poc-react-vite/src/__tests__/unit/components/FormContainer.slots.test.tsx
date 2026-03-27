import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { FormContainer } from "../../../components/shared/FormContainer";

describe("FormContainer — Slots Pattern", () => {
  it("renderiza título via FormContainer.Header", () => {
    render(
      <FormContainer onSubmit={() => {}}>
        <FormContainer.Header title="Criar Curso" />
        <FormContainer.Body>
          <input placeholder="Título do curso" />
        </FormContainer.Body>
        <FormContainer.Footer>
          <button type="submit">Salvar</button>
        </FormContainer.Footer>
      </FormContainer>,
    );

    expect(screen.getByText("Criar Curso")).toBeDefined();
    expect(screen.getByPlaceholderText("Título do curso")).toBeDefined();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDefined();
  });

  it("chama onSubmit ao submeter o formulário", () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

    const { container } = render(
      <FormContainer onSubmit={onSubmit}>
        <FormContainer.Footer>
          <button type="submit">Enviar</button>
        </FormContainer.Footer>
      </FormContainer>,
    );

    fireEvent.submit(container.querySelector("form")!);

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("aplica data-slot correto nos slots do FormContainer", () => {
    const { container } = render(
      <FormContainer onSubmit={() => {}}>
        <FormContainer.Header title="Título" />
        <FormContainer.Body>
          <span>Conteúdo</span>
        </FormContainer.Body>
        <FormContainer.Footer>
          <button type="button">Ação</button>
        </FormContainer.Footer>
      </FormContainer>,
    );

    expect(
      container.querySelector('[data-slot="form-container"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="form-container-header"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="form-container-body"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="form-container-footer"]'),
    ).not.toBeNull();
  });

  it("FormContainer expõe sub-componentes via dot-notation", () => {
    expect(FormContainer.Header).toBeDefined();
    expect(FormContainer.Body).toBeDefined();
    expect(FormContainer.Footer).toBeDefined();
  });

  it("não quebra quando renderizado sem slots opcionais", () => {
    expect(() => render(<FormContainer onSubmit={() => {}} />)).not.toThrow();
  });
});
