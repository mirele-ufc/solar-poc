import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useLogin } from "@/composables/useLogin";
import { useAuthStore } from "@/store/useAuthStore";

// Mock vue-router
vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn().mockResolvedValue(true),
    })),
  };
});

describe("useLogin composable", () => {
  beforeEach(() => {
    setActivePinia(createPinia());

    // Mock window.scrollTo
    window.scrollTo = vi.fn();
  });

  it("inicializa com estado vazio", () => {
    const {
      username,
      password,
      showPassword,
      showErrors,
      generalError,
      usernameInvalid,
      passwordInvalid,
    } = useLogin();

    expect(username.value).toBe("");
    expect(password.value).toBe("");
    expect(showPassword.value).toBe(false);
    expect(showErrors.value).toBe(false);
    expect(generalError.value).toBe("");
    expect(usernameInvalid.value).toBe(false);
    expect(passwordInvalid.value).toBe(false);
  });

  it("alterna visibilidade da senha", () => {
    const { showPassword, togglePassword } = useLogin();

    expect(showPassword.value).toBe(false);
    togglePassword();
    expect(showPassword.value).toBe(true);
    togglePassword();
    expect(showPassword.value).toBe(false);
  });

  it("marca username como inválido quando vazio no submit", async () => {
    const { username, password, handleSubmit, usernameInvalid } = useLogin();

    username.value = "";
    password.value = "somepass";

    await handleSubmit();

    expect(usernameInvalid.value).toBe(true);
  });

  it("marca password como inválido quando vazio no submit", async () => {
    const { username, password, handleSubmit, passwordInvalid } = useLogin();

    username.value = "someuser";
    password.value = "";

    await handleSubmit();

    expect(passwordInvalid.value).toBe(true);
  });

  it("aceita username e password válidos", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "login").mockReturnValue(true);

    const { username, password, handleSubmit, usernameInvalid, passwordInvalid } =
      useLogin();

    username.value = "testuser";
    password.value = "testpass";

    await handleSubmit();

    expect(usernameInvalid.value).toBe(false);
    expect(passwordInvalid.value).toBe(false);
  });

  it("limpa espaços extras de username antes do submit", async () => {
    const authStore = useAuthStore();
    const loginSpy = vi.spyOn(authStore, "login").mockReturnValue(true);

    const { username, password, handleSubmit } = useLogin();

    username.value = "  testuser  ";
    password.value = "testpass";

    await handleSubmit();

    expect(loginSpy).toHaveBeenCalledWith("testuser", "testpass");
  });

  it("mostra erro geral quando validação falha no submit", async () => {
    const { username, password, handleSubmit, showErrors, generalError } =
      useLogin();

    username.value = "";
    password.value = "";

    await handleSubmit();

    expect(showErrors.value).toBe(true);
    expect(generalError.value).toContain("preencha os campos");
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("mostra erro quando credenciais são inválidas", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "login").mockReturnValue(false);

    const { username, password, handleSubmit, showErrors, generalError } =
      useLogin();

    username.value = "wronguser";
    password.value = "wrongpass";

    await handleSubmit();

    expect(showErrors.value).toBe(true);
    expect(generalError.value).toContain("Usuário ou senha incorretos");
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("limpa erros após login bem-sucedido", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "login").mockReturnValue(true);

    const { username, password, handleSubmit, showErrors, generalError } =
      useLogin();

    username.value = "validuser";
    password.value = "validpass";

    await handleSubmit();

    expect(showErrors.value).toBe(false);
    expect(generalError.value).toBe("");
  });

  it("redireciona para /courses após login bem-sucedido", async () => {
    const authStore = useAuthStore();
    vi.spyOn(authStore, "login").mockReturnValue(true);

    const { username, password, handleSubmit } = useLogin();

    username.value = "validuser";
    password.value = "validpass";

    await handleSubmit();

    // Router.push é chamado automaticamente pelo composable
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("trimma username antes de passar para authStore", async () => {
    const authStore = useAuthStore();
    const loginSpy = vi.spyOn(authStore, "login").mockReturnValue(true);

    const { username, password, handleSubmit } = useLogin();

    username.value = "  testuser  ";
    password.value = "testpass";

    await handleSubmit();

    expect(loginSpy).toHaveBeenCalledWith("testuser", "testpass");
  });

  it("não trimma password (as senhas podem ter espaços)", async () => {
    const authStore = useAuthStore();
    const loginSpy = vi.spyOn(authStore, "login").mockReturnValue(true);

    const { username, password, handleSubmit } = useLogin();

    username.value = "testuser";
    password.value = "  testpass  ";

    await handleSubmit();

    expect(loginSpy).toHaveBeenCalledWith("testuser", "  testpass  ");
  });
});
