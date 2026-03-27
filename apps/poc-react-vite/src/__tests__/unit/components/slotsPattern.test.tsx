import { describe, expect, it } from "vitest";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { FormContainer } from "@/components/shared/FormContainer";

describe("Slots Pattern smoke", () => {
  it("expõe componentes compostos por dot-notation", () => {
    expect(Card.Header).toBeDefined();
    expect(Card.Image).toBeDefined();
    expect(Modal.Header).toBeDefined();
    expect(FormContainer.Body).toBeDefined();
  });
});
