import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CreateCoursePage } from "@/pages/CreateCoursePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";

describe("FormContainer adoption in pages", () => {
  it("LoginPage renderiza formulário com data-slot de FormContainer", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(
      document.querySelector('[data-slot="form-container"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="form-container-body"]'),
    ).not.toBeNull();
  });

  it("RegisterPage renderiza formulário com data-slot de FormContainer", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(
      document.querySelector('[data-slot="form-container"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="form-container-body"]'),
    ).not.toBeNull();
  });

  it("CreateCoursePage renderiza formulário com data-slot de FormContainer", () => {
    render(
      <MemoryRouter>
        <CreateCoursePage />
      </MemoryRouter>,
    );

    expect(
      document.querySelector('[data-slot="form-container"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="form-container-body"]'),
    ).not.toBeNull();
  });
});
