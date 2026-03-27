import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

describe("Card — Slots Pattern", () => {
  it("renderiza conteúdo via composição de children", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título do Card</CardTitle>
        </CardHeader>
        <CardContent>Conteúdo</CardContent>
        <CardFooter>Rodapé</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Título do Card")).toBeDefined();
    expect(screen.getByText("Conteúdo")).toBeDefined();
    expect(screen.getByText("Rodapé")).toBeDefined();
  });

  it("renderiza CardDescription com data-slot correto", () => {
    const { container } = render(
      <Card>
        <CardContent>
          <CardDescription>Descrição do card</CardDescription>
        </CardContent>
      </Card>,
    );

    expect(screen.getByText("Descrição do card")).toBeDefined();
    expect(
      container.querySelector('[data-slot="card-description"]'),
    ).not.toBeNull();
  });

  it("aplica data-slot correto em cada sub-componente", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Título</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(container.querySelector('[data-slot="card"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="card-header"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="card-title"]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot="card-content"]'),
    ).not.toBeNull();
    expect(container.querySelector('[data-slot="card-footer"]')).not.toBeNull();
  });

  it("Card expõe sub-componentes via dot-notation", () => {
    expect(Card.Header).toBeDefined();
    expect(Card.Content).toBeDefined();
    expect(Card.Body).toBeDefined();
    expect(Card.Footer).toBeDefined();
    expect(Card.Title).toBeDefined();
    expect(Card.Description).toBeDefined();
    expect(Card.Action).toBeDefined();
    expect(Card.Image).toBeDefined();
  });

  it("Card.Image renderiza com data-slot e atributos corretos", () => {
    const { container } = render(
      <Card>
        <Card.Image src="test.jpg" alt="Imagem teste" />
      </Card>,
    );

    expect(container.querySelector('[data-slot="card-image"]')).not.toBeNull();
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("test.jpg");
    expect(img?.getAttribute("alt")).toBe("Imagem teste");
  });

  it("Card.Header e Card.Footer via dot-notation renderizam corretamente", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Via dot-notation</Card.Title>
        </Card.Header>
        <Card.Body>Corpo via dot-notation</Card.Body>
        <Card.Footer>Rodapé via dot-notation</Card.Footer>
      </Card>,
    );

    expect(screen.getByText("Via dot-notation")).toBeDefined();
    expect(screen.getByText("Corpo via dot-notation")).toBeDefined();
    expect(screen.getByText("Rodapé via dot-notation")).toBeDefined();
  });

  it("não quebra quando renderizado sem children", () => {
    expect(() => render(<Card />)).not.toThrow();
  });
});
