# Bloco F2 — Slots Pattern Implementation

**Status:** INICIANDO (2 testes falhando)  
**Objetivo:** Implementar composable slot-based architecture em Card, FormContainer, Modal  
**Foco:** React primeira, depois Vue (paridade)

---

## Testes Esperando Implementação

```
❌ hybridConsolidation.test.tsx:
  - Phase 2: Espera LoginPage com FormContainer slots
    - data-slot="form-container"
    - data-slot="form-container-body"

  - Phase 4: Espera ExamPage com Modal slots
    - data-slot="modal"

❌ modalD3Adoption.test.tsx:
  - ExamPage abre modal usando slot
    - data-slot="modal"
    - data-slot="modal-header" (etc)
```

---

## Implementação Necessária

### 1. FormContainer (React)

**Arquivo:** `src/components/ui/FormContainer.tsx`

```typescript
interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
}

interface FormContainerComposition {
  Body: React.FC<{ children: React.ReactNode }>;
  Header: React.FC<{ children: React.ReactNode }>;
}

export const FormContainer: React.FC<FormContainerProps> & FormContainerComposition =
  ({ children, title }) => (
    <div data-slot="form-container" className="form-wrapper">
      {children}
    </div>
  );

FormContainer.Header = ({ children }) => (
  <div data-slot="form-container-header">{children}</div>
);

FormContainer.Body = ({ children }) => (
  <div data-slot="form-container-body">{children}</div>
);
```

### 2. Modal (React)

**Arquivo:** `src/components/ui/Modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ModalComposition {
  Header: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
}

export const Modal: React.FC<ModalProps> & ModalComposition =
  ({ isOpen, onClose, children }) =>
    isOpen ? (
      <div data-slot="modal" className="modal-overlay">
        {children}
      </div>
    ) : null;

Modal.Header = ({ children }) => (
  <div data-slot="modal-header">{children}</div>
);

Modal.Body = ({ children }) => (
  <div data-slot="modal-body">{children}</div>
);

Modal.Footer = ({ children }) => (
  <div data-slot="modal-footer">{children}</div>
);
```

### 3. Card (React)

**Arquivo:** `src/components/ui/Card.tsx`

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardComposition {
  Header: React.FC<{ children: React.ReactNode }>;
  Title: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
}

export const Card: React.FC<CardProps> & CardComposition =
  ({ children, className }) => (
    <div data-slot="card" className={`card ${className || ""}`}>
      {children}
    </div>
  );

Card.Header = ({ children }) => (
  <div data-slot="card-header">{children}</div>
);

Card.Title = ({ children }) => (
  <h2 data-slot="card-title">{children}</h2>
);

Card.Body = ({ children }) => (
  <div data-slot="card-body">{children}</div>
);

Card.Footer = ({ children }) => (
  <div data-slot="card-footer">{children}</div>
);
```

---

## Integrações Páginas (React)

### LoginPage.tsx — Usar FormContainer slots

```typescript
<FormContainer>
  <FormContainer.Header>
    <h1>Login</h1>
  </FormContainer.Header>
  <FormContainer.Body>
    {/* Form fields aqui */}
  </FormContainer.Body>
</FormContainer>
```

### ExamPage.tsx — Usar Modal slots

```typescript
<Modal isOpen={showConfirmation} onClose={closeModal}>
  <Modal.Header>
    <h2>Confirmar Submissão</h2>
  </Modal.Header>
  <Modal.Body>
    <p>Deseja realmente enviar o quiz?</p>
  </Modal.Body>
  <Modal.Footer>
    <button onClick={submitQuiz}>Enviar</button>
  </Modal.Footer>
</Modal>
```

---

## Próximos Passos (Ordem de Execução)

1. ✅ F1 TypeScript audit — COMPLETO
2. 🔄 F2 Slots Pattern — **INICIANDO**
   - [ ] Criar FormContainer (React + Vue)
   - [ ] Criar Modal (React + Vue)
   - [ ] Criar Card (React + Vue)
   - [ ] Integrar LoginPage com FormContainer
   - [ ] Integrar ExamPage com Modal
   - [ ] Rodar testes (`npm run test -- --run`)
   - [ ] Validar `npm run type-check` + `npm run build`
3. ⏳ F3 Naming semantic audit — Aguardando F2

---

## Métricas Esperadas pós F2

- ✅ Tests passing: 260/260 (React), 162/162 (Vue)
- ✅ Type-check: Zero errors (ambas)
- ✅ Build: Success (ambas)
- ✅ Coverage: ≥70% (threshold met)
