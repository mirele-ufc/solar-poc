import { useEffect, useRef, useState, useId } from "react";
import { getFriendlyErrorMessage } from "../utils/httpErrorMessages";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/authService";

// ── helpers ──────────────────────────────────────────────────────────────────
function maskCPF(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}.${d.slice(3, 6)}.***-**`;
  return raw;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

// ── icon paths ────────────────────────────────────────────────────────────────
const cameraPath =
  "M20 5H17L15 3H9L7 5H4C2.897 5 2 5.897 2 7V19C2 20.103 2.897 21 4 21H20C21.103 21 22 20.103 22 19V7C22 5.897 21.103 5 20 5ZM20 19H4V7H8.414L10.414 5H13.586L15.586 7H20V19ZM12 9C9.791 9 8 10.791 8 13C8 15.209 9.791 17 12 17C14.209 17 16 15.209 16 13C16 10.791 14.209 9 12 9ZM12 15C10.897 15 10 14.103 10 13C10 11.897 10.897 11 12 11C13.103 11 14 11.897 14 13C14 14.103 13.103 15 12 15Z";
const eyePath =
  "M2 12C2.945 7.436 7.063 4 12 4C16.937 4 21.055 7.436 22 12C21.055 16.564 16.937 20 12 20C7.063 20 2.945 16.564 2 12ZM12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17ZM12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15Z";
const eyeOffPath =
  "M3.707 2.293a1 1 0 0 0-1.414 1.414l18 18a1 1 0 0 0 1.414-1.414l-1.473-1.473A10.014 10.014 0 0 0 22 12c-.955-4.564-5.073-8-10-8a9.958 9.958 0 0 0-5.458 1.626L3.707 2.293ZM7.68 7.68l1.454 1.454A4.003 4.003 0 0 1 16 12c0 .342-.037.676-.107.998l1.559 1.559A9.953 9.953 0 0 0 20 12c-.946-3.822-4.401-7-8-7a8.38 8.38 0 0 0-4.32 1.32Z M12 5C7.063 5 2.945 8.436 2 13c.464 2.216 1.67 4.162 3.35 5.552l1.423-1.423A7.977 7.977 0 0 1 4 13c.946-3.822 4.401-7 8-7 .748 0 1.47.107 2.152.306L15.707 4.75A9.95 9.95 0 0 0 12 5Z M12 17a4 4 0 0 1-3.866-2.958l-1.44-1.44A6 6 0 0 0 12 19c.342 0 .676-.037.998-.107l-1.441-1.441A4.013 4.013 0 0 1 12 17Z";
const checkPath = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z";
const arrowBackPath =
  "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z";

// ── reusable field components ─────────────────────────────────────────────────
function ReadonlyField({ label, value }: { label: string; value: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-[4px]">
      <span
        id={id}
        className="font-['Figtree:Medium',sans-serif] font-medium text-[#595959] text-[14px] leading-[20px] uppercase tracking-wider"
      >
        {label}
      </span>
      <div
        aria-labelledby={id}
        className="bg-[#f5f5f5] border border-[#d0d0d0] h-[56px] flex items-center px-[20px]"
      >
        <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#333] text-[16px]">
          {value}
        </span>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-[4px]">
      <label
        htmlFor={id}
        className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[16px] leading-[24px]"
      >
        {label}
      </label>
      <div
        className={`bg-white h-[56px] border rounded-[12px] flex items-center gap-[10px] px-[20px] relative transition-colors ${
          error ? "border-[#c0392b]" : "border-[#5f5f5f]"
        }`}
      >
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className="flex-1 font-['Figtree:Regular',sans-serif] font-normal text-[16px] text-[#1a1a1a] placeholder-[#595959] bg-transparent outline-none focus-visible:outline-none min-w-0"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-pressed={show}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          className="shrink-0 size-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#021b59] rounded-sm"
        >
          <svg
            className="size-[24px]"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              d={show ? eyeOffPath : eyePath}
              fill="#595959"
              fillRule="evenodd"
            />
          </svg>
        </button>
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none focus-within:outline focus-within:outline-[3px] focus-within:outline-[#021b59] focus-within:outline-offset-[-1px]"
        />
      </div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[#c0392b] text-[13px] font-['Figtree:Regular',sans-serif]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser, setCurrentUser, token, isLoggedIn } =
    useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // password form state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [pwSuccess, setPwSuccess] = useState(false);

  const user = currentUser;

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!token || !isLoggedIn) return;
      if (currentUser) return;

      setIsProfileLoading(true);
      setProfileError(null);

      try {
        const profile = await authService.getProfile();
        if (!active) return;
        setCurrentUser(profile);
      } catch (error) {
        if (!active) return;
        // Tenta extrair status code do erro
        const status = (error as any)?.status ?? 0;
        setProfileError(getFriendlyErrorMessage(status, "perfil"));
      } finally {
        if (!active) return;
        setIsProfileLoading(false);
      }
    };

    void loadProfile();

    return () => {
      active = false;
    };
  }, [token, isLoggedIn, currentUser, setCurrentUser]);

  if (isProfileLoading) {
    return (
      <div className="bg-white flex items-center justify-center min-h-[calc(100vh-70px)] px-[20px]">
        <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#021b59] text-[16px]">
          Carregando perfil...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white flex items-center justify-center min-h-[calc(100vh-70px)] px-[20px]">
        <div className="flex flex-col items-center gap-[12px] text-center max-w-[440px]">
          <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#c0392b] text-[16px]">
            {profileError ?? "Perfil indisponível no momento."}
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-[#ffeac4] h-[44px] px-[24px] rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[15px]"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const validatePhotoFile = async (file: File): Promise<string | null> => {
    const supportedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!supportedTypes.includes(file.type)) {
      return "Formato inválido. Use JPG, PNG ou GIF.";
    }

    const objectUrl = URL.createObjectURL(file);

    try {
      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          const image = new Image();
          image.onload = () => {
            resolve({ width: image.width, height: image.height });
          };
          image.onerror = () => reject(new Error("Imagem inválida"));
          image.src = objectUrl;
        },
      );

      if (dimensions.width < 200 || dimensions.height < 200) {
        return "Imagem muito pequena. Use no mínimo 200x200 px.";
      }

      return null;
    } catch {
      return "Não foi possível processar a imagem selecionada.";
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  // photo upload handler
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    setPhotoSuccess(null);

    const validationError = await validatePhotoFile(file);
    if (validationError) {
      setPhotoError(validationError);
      e.target.value = "";
      return;
    }

    setIsPhotoUploading(true);

    try {
      await authService.uploadProfilePhoto(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          updateCurrentUser({ fotoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);

      setPhotoSuccess("Foto atualizada com sucesso!");
    } catch (error) {
      const status = (error as any)?.status ?? 0;
      setPhotoError(getFriendlyErrorMessage(status, "perfil"));
    } finally {
      setIsPhotoUploading(false);
      e.target.value = "";
    }
  };

  const removePhoto = async () => {
    setPhotoError(null);
    setPhotoSuccess(null);

    try {
      updateCurrentUser({ fotoUrl: undefined });
      setPhotoSuccess("Foto removida localmente.");
    } catch {
      setPhotoError("Não foi possível remover a foto.");
    }
  };

  // password change handler
  const handlePasswordSave = async () => {
    setPasswordError(null);
    setPwSuccess(false);

    const errors: Record<string, string> = {};
    if (!currentPw) errors.current = "Informe a senha atual.";
    if (!newPw) errors.new = "Informe a nova senha.";
    else if (newPw.length < 6)
      errors.new = "A nova senha deve ter ao menos 6 caracteres.";
    if (!confirmPw) errors.confirm = "Confirme a nova senha.";
    else if (newPw && confirmPw !== newPw)
      errors.confirm = "As senhas não coincidem.";

    setPwErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsChangingPassword(true);

    try {
      await authService.changePassword({
        senhaAtual: currentPw,
        novaSenha: newPw,
      });

      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setPwErrors({});
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (error) {
      const status = (error as any)?.status ?? 0;
      setPasswordError(getFriendlyErrorMessage(status, "perfil"));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const profileRoleLabel =
    currentUser.role === "professor"
      ? "Professor"
      : currentUser.role === "admin"
        ? "Administrador"
        : "Estudante";

  return (
    <div className="bg-white flex flex-col min-h-[calc(100vh-70px)]">
      {/* ── Blue header band ────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-[#021b59] to-[#042e99] w-full">
        <div className="max-w-[900px] mx-auto flex flex-col items-center gap-[16px] pt-[32px] pb-[48px] px-[20px]">
          {/* Back button */}
          <div className="w-full flex flex-col gap-[6px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Voltar"
              className="flex items-center gap-[8px] text-[#ffeac4] hover:text-white transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm w-fit"
            >
              <svg
                className="size-[20px]"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d={arrowBackPath} fill="currentColor" />
              </svg>
              <span className="font-['Figtree:Medium',sans-serif] font-medium text-[16px]">
                Voltar
              </span>
            </button>
            {/* Breadcrumb */}
            <nav aria-label="Navegação estrutural" className="pl-[28px]">
              <ol className="flex items-center gap-[4px] list-none m-0 p-0">
                <li className="flex items-center gap-[4px]">
                  <button
                    type="button"
                    onClick={() => navigate("/courses")}
                    className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/70 text-[13px] hover:text-[#ffeac4] focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] rounded-sm"
                  >
                    Cursos
                  </button>
                </li>
                <li className="flex items-center gap-[4px]">
                  <span
                    className="text-[#ffeac4]/40 text-[13px]"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                  <span className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/50 text-[13px]">
                    Perfil
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-[12px]">
            <div className="relative group">
              <div className="size-[110px] rounded-full overflow-hidden bg-[#042e99] border-4 border-[#ffeac4] flex items-center justify-center">
                {currentUser.fotoUrl && currentUser.fotoUrl.length > 0 ? (
                  <img
                    src={currentUser.fotoUrl}
                    alt="Foto de perfil"
                    className="size-full object-cover"
                  />
                ) : (
                  <span
                    aria-label={`Iniciais de ${currentUser.nome}`}
                    className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[36px] select-none"
                  >
                    {initials(currentUser.nome)}
                  </span>
                )}
              </div>

              {/* Camera overlay button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Alterar foto de perfil"
                className="absolute bottom-0 right-0 size-[34px] rounded-full bg-[#ffeac4] border-2 border-[#021b59] flex items-center justify-center shadow-md hover:bg-white transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#ffeac4] focus-visible:outline-offset-[2px]"
                disabled={isPhotoUploading}
              >
                <svg
                  className="size-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d={cameraPath} fill="#021B59" />
                </svg>
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              aria-hidden="true"
              tabIndex={-1}
              className="hidden"
              onChange={(event) => {
                void handlePhotoChange(event);
              }}
            />

            <div className="text-center">
              <p className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[22px]">
                {currentUser.nome}
              </p>
              <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#ffeac4]/80 text-[14px] mt-[2px]">
                {profileRoleLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── White content area ──────────────────────────────────────────────── */}
      <div className="max-w-[900px] mx-auto w-full px-[20px] md:px-[40px] py-[32px] flex flex-col gap-[40px]">
        {/* ── Section: Dados pessoais ── */}
        <section aria-labelledby="dados-pessoais-heading">
          <div className="flex items-center gap-[12px] mb-[20px] pb-[12px] border-b-2 border-[#021b59]">
            <h2
              id="dados-pessoais-heading"
              className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px]"
            >
              Dados pessoais
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <ReadonlyField label="CPF" value={maskCPF(user.cpf)} />
            <ReadonlyField label="E-mail" value={user.email} />
          </div>
          <p className="mt-[10px] font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[13px] leading-[20px]">
            CPF e e-mail são dados de identificação e não podem ser alterados
            diretamente. Em caso de divergências, entre em contato com o
            suporte.
          </p>
        </section>

        {/* ── Section: Foto de perfil ── */}
        <section aria-labelledby="foto-heading">
          <div className="flex items-center gap-[12px] mb-[20px] pb-[12px] border-b-2 border-[#021b59]">
            <h2
              id="foto-heading"
              className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px]"
            >
              Foto de perfil
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[20px]">
            {/* Preview */}
            <div className="size-[80px] rounded-full overflow-hidden bg-[#042e99] border-2 border-[#021b59] shrink-0 flex items-center justify-center">
              {currentUser.fotoUrl ? (
                <img
                  src={currentUser.fotoUrl}
                  alt="Prévia da foto de perfil"
                  className="size-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="font-['Figtree:Bold',sans-serif] font-bold text-[#ffeac4] text-[28px] select-none"
                >
                  {initials(currentUser.nome)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-[10px] flex-1">
              <p className="font-['Figtree:Regular',sans-serif] font-normal text-[#595959] text-[14px] leading-[22px]">
                Use uma imagem quadrada (JPG, PNG ou GIF) com ao menos 200×200
                px para melhor qualidade.
              </p>
              <div className="flex gap-[12px] flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#ffeac4] h-[44px] px-[24px] rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[15px] disabled:opacity-60"
                  disabled={isPhotoUploading}
                >
                  {isPhotoUploading
                    ? "Enviando..."
                    : currentUser.fotoUrl
                      ? "Trocar foto"
                      : "Adicionar foto"}
                </button>
                {currentUser.fotoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      void removePhoto();
                    }}
                    className="h-[44px] px-[24px] rounded-[26px] border-2 border-[#c0392b] cursor-pointer hover:bg-[#fdecea] transition-colors focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-[#c0392b] font-['Figtree:Medium',sans-serif] font-medium text-[#c0392b] text-[15px]"
                  >
                    Remover foto
                  </button>
                )}
              </div>
              {photoError && (
                <p
                  role="alert"
                  className="text-[#c0392b] text-[13px] font-['Figtree:Regular',sans-serif]"
                >
                  {photoError}
                </p>
              )}
              {photoSuccess && (
                <p
                  role="status"
                  className="text-[#155724] text-[13px] font-['Figtree:Regular',sans-serif]"
                >
                  {photoSuccess}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── Section: Alterar senha ── */}
        <section aria-labelledby="senha-heading">
          <div className="flex items-center gap-[12px] mb-[20px] pb-[12px] border-b-2 border-[#021b59]">
            <h2
              id="senha-heading"
              className="font-['Figtree:Bold',sans-serif] font-bold text-[#021b59] text-[20px]"
            >
              Alterar senha
            </h2>
          </div>

          <form
            className="flex flex-col gap-[16px]"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void handlePasswordSave();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <PasswordField
                id="current-pw"
                label="Senha atual"
                value={currentPw}
                onChange={setCurrentPw}
                error={pwErrors.current}
              />
              <div /> {/* spacer on desktop */}
              <PasswordField
                id="new-pw"
                label="Nova senha"
                value={newPw}
                onChange={setNewPw}
                error={pwErrors.new}
              />
              <PasswordField
                id="confirm-pw"
                label="Confirmar nova senha"
                value={confirmPw}
                onChange={setConfirmPw}
                error={pwErrors.confirm}
              />
            </div>

            {/* Success feedback */}
            {pwSuccess && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-[10px] bg-[#d4edda] border border-[#c3e6cb] px-[16px] py-[12px] rounded-sm"
              >
                <svg
                  className="size-[20px] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d={checkPath} fill="#155724" />
                </svg>
                <p className="font-['Figtree:Medium',sans-serif] font-medium text-[#155724] text-[15px]">
                  Senha alterada com sucesso!
                </p>
              </div>
            )}

            {passwordError && (
              <p
                role="alert"
                className="text-[#c0392b] text-[13px] font-['Figtree:Regular',sans-serif]"
              >
                {passwordError}
              </p>
            )}

            <div className="flex justify-start mt-[4px]">
              <button
                type="submit"
                className="bg-[#ffeac4] h-[50px] px-[40px] rounded-[26px] cursor-pointer hover:bg-[#ffd9a0] transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#021b59] focus-visible:outline-offset-[2px] disabled:opacity-60"
                disabled={isChangingPassword}
              >
                <span className="font-['Figtree:Medium',sans-serif] font-medium text-[#333] text-[18px]">
                  {isChangingPassword ? "Salvando..." : "Salvar senha"}
                </span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
