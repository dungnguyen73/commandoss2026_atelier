import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { Wallet } from "lucide-react";

interface FieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  as?: "input" | "select" | "textarea";
  options?: string[];
}

const FIELDS: FieldProps[] = [
  {
    id: "product-name",
    label: "Product Name",
    placeholder: "e.g. Jasmine Rice",
    required: true,
  },
  {
    id: "category",
    label: "Category",
    as: "select",
    required: true,
    options: ["Grains", "Vegetables", "Fruits", "Dairy", "Meat", "Other"],
  },
  {
    id: "quantity",
    label: "Quantity",
    placeholder: "e.g. 500 kg",
    required: true,
  },
  {
    id: "origin-farm",
    label: "Origin Farm",
    placeholder: "e.g. Chiang Mai Organic Farm",
    required: true,
  },
  {
    id: "province",
    label: "Province / Region",
    placeholder: "e.g. Chiang Mai, Thailand",
    required: true,
  },
  {
    id: "certification",
    label: "Certification Note",
    as: "textarea",
    placeholder: "Optional — e.g. GAP certified, organic, pesticide-free",
    hint: "Include any relevant safety or quality certifications.",
  },
];

const inputBase =
  "w-full rounded-xl bg-[var(--color-surface-low)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none transition-all duration-150 focus:bg-[var(--color-surface-lowest)] focus:ring-2 focus:ring-[var(--color-primary)]/30";

function FormField({ id, label, placeholder, type = "text", required, hint, as = "input", options }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-foreground)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-primary)]">*</span>}
      </label>

      {as === "select" && (
        <select id={id} className={inputBase}>
          <option value="">Select {label}</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {as === "textarea" && (
        <textarea
          id={id}
          placeholder={placeholder}
          rows={3}
          className={`${inputBase} resize-none`}
        />
      )}

      {as === "input" && (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          required={required}
          className={inputBase}
        />
      )}

      {hint && (
        <p className="text-xs text-[var(--color-muted-foreground)]">{hint}</p>
      )}
    </div>
  );
}

export default function CreatePage() {
  return (
    <PageContainer narrow>
      {/* ── Page header ── */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[var(--color-foreground)]">
          Create a Batch
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Register a new product batch on the SUI blockchain. All fields marked
          with <span className="text-[var(--color-primary)]">*</span> are
          required.
        </p>
      </div>

      {/* ── Form card ── */}
      <form
        id="create-batch-form"
        onSubmit={(e) => e.preventDefault()}
        className="rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)] sm:p-8"
        noValidate
      >
        <fieldset className="space-y-5" disabled>
          <legend className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
            Batch Information
          </legend>

          {FIELDS.map((field) => (
            <FormField key={field.id} {...field} />
          ))}
        </fieldset>

        {/* ── Wallet required notice ── */}
        <div className="mt-8 flex flex-col gap-4 rounded-xl bg-[var(--color-surface-low)] p-4">
          <div className="flex items-start gap-3">
            <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Connect your SUI wallet to mint this batch on-chain and generate a
              QR code.
            </p>
          </div>
          <Button
            id="create-batch-submit"
            type="submit"
            variant="primary"
            disabled
            className="w-full"
          >
            Connect Wallet to Continue
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
