import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "../../../components/ui/modal";

describe("Modal — Slots Pattern", () => {
  it("renderiza conteúdo do modal quando isOpen=true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <Modal.Header>Confirmação</Modal.Header>
        <Modal.Body>Você tem certeza?</Modal.Body>
        <Modal.Footer>
          <button type="button">Confirmar</button>
        </Modal.Footer>
      </Modal>,
    );

    expect(screen.getByText("Confirmação")).toBeDefined();
    expect(screen.getByText("Você tem certeza?")).toBeDefined();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDefined();
  });

  it("não renderiza conteúdo quando isOpen=false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <Modal.Header>Oculto</Modal.Header>
        <Modal.Body>Conteúdo oculto</Modal.Body>
      </Modal>,
    );

    expect(screen.queryByText("Oculto")).toBeNull();
    expect(screen.queryByText("Conteúdo oculto")).toBeNull();
  });

  it("chama onClose ao clicar no overlay", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <Modal.Header>Fechar Modal</Modal.Header>
        <Modal.Body>Conteúdo</Modal.Body>
      </Modal>,
    );

    const overlay = document.querySelector('[data-slot="modal-overlay"]');
    if (!overlay) throw new Error("Overlay não encontrado");
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("aplica data-slot correto nos elementos do modal", () => {
    // Radix DialogPortal renderiza fora do container — usar document.querySelector
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <Modal.Header>Título</Modal.Header>
        <Modal.Body>Corpo</Modal.Body>
        <Modal.Footer>
          <button type="button">Ação</button>
        </Modal.Footer>
      </Modal>,
    );

    expect(document.querySelector('[data-slot="modal"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-header"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-body"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal-footer"]')).not.toBeNull();
  });

  it("Modal expõe sub-componentes via dot-notation", () => {
    expect(Modal.Header).toBeDefined();
    expect(Modal.Body).toBeDefined();
    expect(Modal.Footer).toBeDefined();
  });

  it("não quebra quando renderizado sem children", () => {
    expect(() =>
      render(<Modal isOpen={true} onClose={() => {}} />),
    ).not.toThrow();
  });
});
