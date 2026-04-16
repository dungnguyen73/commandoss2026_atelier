import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { useCurrentAccount, useDAppKit, CurrentAccountSigner } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { createOriginItem } from "../contracts/chain_passport/chain_passport";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface FieldProps {
  id: string;
  name: string;
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
    name: "name",
    label: "Product Name",
    placeholder: "e.g. Jasmine Rice",
    required: true,
  },
  {
    id: "category",
    name: "category",
    label: "Category",
    as: "select",
    required: true,
    options: ["Grains", "Vegetables", "Fruits", "Dairy", "Meat", "Other"],
  },
  {
    id: "quantity",
    name: "quantity",
    label: "Quantity",
    placeholder: "e.g. 500 kg",
    required: true,
  },
  {
    id: "origin-farm",
    name: "farm",
    label: "Origin Farm",
    placeholder: "e.g. Chiang Mai Organic Farm",
    required: true,
  },
  {
    id: "province",
    name: "province",
    label: "Province / Region",
    placeholder: "e.g. Chiang Mai, Thailand",
    required: true,
  },
  {
    id: "certification",
    name: "certification",
    label: "Certification Note",
    as: "textarea",
    placeholder: "Optional — e.g. GAP certified, organic, pesticide-free",
    hint: "Include any relevant safety or quality certifications.",
  },
];

const inputBase =
  "w-full rounded-xl bg-[var(--color-surface-low)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none transition-all duration-150 focus:bg-[var(--color-surface-lowest)] focus:ring-2 focus:ring-[var(--color-primary)]/30";

function FormField({ id, name, label, placeholder, type = "text", required, hint, as = "input", options }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-foreground)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-primary)]">*</span>}
      </label>

      {as === "select" && (
        <select id={id} name={name} className={inputBase} required={required}>
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
          name={name}
          placeholder={placeholder}
          rows={3}
          className={`${inputBase} resize-none`}
        />
      )}

      {as === "input" && (
        <input
          id={id}
          name={name}
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
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();
  const signer = useMemo(() => new CurrentAccountSigner(dAppKit as any), [dAppKit]);
  const navigate = useNavigate();
  
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      quantity: formData.get("quantity") as string,
      farm: formData.get("farm") as string,
      province: formData.get("province") as string,
      certification: (formData.get("certification") as string) || "N/A",
    };

    setIsMinting(true);
    setError(null);

    try {
      const tx = new Transaction();
      createOriginItem({
        arguments: [
          data.name,
          data.category,
          data.quantity,
          data.farm,
          data.province,
          data.certification,
        ]
      })(tx);

      const result = await signer.signAndExecuteTransaction({ transaction: tx });
      console.log("Minting successful:", result);
      setIsSuccess(true);
      setIsMinting(false);
      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Minting failed:", err);
      setError(err.message || "Transaction failed. Please try again.");
      setIsMinting(false);
    }
  };

  if (isSuccess) {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 rounded-full bg-[var(--color-primary)]/10 p-4 text-[var(--color-primary)]">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-foreground)]">
            Batch Registered!
          </h1>
          <p className="mt-4 max-w-sm text-[var(--color-muted-foreground)]">
            Your product batch has been successfully minted on the SUI blockchain. 
            Redirecting to your dashboard...
          </p>
        </div>
      </PageContainer>
    );
  }

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
        onSubmit={handleSubmit}
        className="rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)] sm:p-8"
        noValidate
      >
        <fieldset className="space-y-5" disabled={isMinting || !account}>
          <legend className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
            Batch Information
          </legend>

          {FIELDS.map((field) => (
            <FormField key={field.id} {...field} />
          ))}
        </fieldset>

        {error && (
          <div className="mt-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* ── Action area ── */}
        <div className="mt-8 flex flex-col gap-4">
          {!account && (
            <div className="flex flex-col gap-4 rounded-xl bg-[var(--color-surface-low)] p-4 border border-[var(--color-border)]">
              <div className="flex items-start gap-3">
                <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted-foreground)]" />
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Connect your SUI wallet to mint this batch on-chain and generate a
                  QR code.
                </p>
              </div>
            </div>
          )}
          
          <Button
            id="create-batch-submit"
            type="submit"
            variant="primary"
            disabled={isMinting || !account}
            className="w-full py-6 text-lg font-semibold"
          >
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Minting Batch...
              </>
            ) : account ? (
              "Mint Product Batch"
            ) : (
              "Connect Wallet to Continue"
            )}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
