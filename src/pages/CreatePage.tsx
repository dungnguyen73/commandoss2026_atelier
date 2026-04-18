import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { useCurrentAccount, useDAppKit, CurrentAccountSigner } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { ATELIER_PACKAGE_ID } from "../config/network";
import { computeCertificateHash } from "../lib/hash";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { addRecentId } from "../store/recentStore";
import { useArtisanProfile } from "../hooks/useArtisanProfile";


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
    placeholder: "e.g. Celadon Teapot No.12",
    required: true,
  },
  {
    id: "category",
    name: "category",
    label: "Category",
    as: "select",
    required: true,
    options: ["Ceramics", "Jewelry", "Textiles", "Leather", "Woodwork", "Glass", "Painting", "Other"],
  },
  {
    id: "artisan-name",
    name: "artisanName",
    label: "Artisan Name",
    placeholder: "e.g. Nguyen Thi Lan",
    required: true,
  },
  {
    id: "location",
    name: "location",
    label: "Location / Studio",
    placeholder: "e.g. Hanoi, Vietnam",
    required: true,
  },
  {
    id: "materials",
    name: "materials",
    label: "Materials",
    placeholder: "e.g. Stoneware clay, Celadon glaze",
    required: true,
  },
  {
    id: "note",
    name: "note",
    label: "Certificate Note / Story",
    as: "textarea",
    placeholder: "Describe the piece, technique, or provenance story…",
    hint: "This story is stored on-chain as part of the certificate.",
  },
  {
    id: "image-url",
    name: "imageUrl",
    label: "Product Image URL",
    placeholder: "https://images.unsplash.com/photo-...",
    hint: "Optional — provide a direct link to the product image for a premium display.",
  },
];

const inputBase =
  "w-full rounded-xl bg-[var(--color-surface-low)] px-4 py-2.5 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none transition-all duration-150 focus:bg-[var(--color-surface-lowest)] focus:ring-2 focus:ring-[var(--color-primary)]/30";

export default function CreatePage() {
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();
  const signer = useMemo(() => new CurrentAccountSigner(dAppKit as any), [dAppKit]);
  const { profile } = useArtisanProfile(account?.address);
  const navigate = useNavigate();

  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    artisanName: "",
    location: "",
    materials: "",
    note: "",
    imageUrl: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== "" &&
      formData.category.trim() !== "" &&
      formData.artisanName.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.materials.trim() !== ""
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !isFormValid) return;

    setIsMinting(true);
    setError(null);

    try {
      // 1. Off-chain cryptographic hashing
      const certHash = await computeCertificateHash(formData);

      // 2. On-chain validation and minting
      if (!profile) {
        throw new Error("Artisan profile not found. Please set it up in the dashboard first.");
      }

      const tx = new Transaction();
      
      // Pack Image URL into note if present: "IMG:url::NOTE:text"
      const packedNote = formData.imageUrl 
        ? `IMG:${formData.imageUrl.trim()}::NOTE:${(formData.note || "N/A").trim()}`
        : (formData.note || "N/A").trim();

      tx.moveCall({
        target: `${ATELIER_PACKAGE_ID}::atelier::create_certificate`,
        arguments: [
          tx.object(profile.id),
          tx.pure.string(formData.name),
          tx.pure.string(formData.category),
          tx.pure.string(formData.artisanName),
          tx.pure.string(formData.location),
          tx.pure.string(formData.materials),
          tx.pure.string(packedNote),
          tx.pure.string(certHash),
          tx.object("0x6"), // clock
        ],
      });

      const result: any = await signer.signAndExecuteTransaction({
        transaction: tx,
      });
      console.log("Certificate minted:", result);

      // Extract cert_id from effects/events
      // Note: In newer SDKs, you might need to fetch events separately or check effects.
      // We'll use a type-safe fallback for the ID extraction.
      const certId = result.objectChanges?.find(
        (oc: any) => oc.type === "created" && oc.objectType.includes("::ArtisanCertificate")
      )?.objectId;
      if (certId) {
        addRecentId(certId);
      }

      setIsSuccess(true);
      setIsMinting(false);
      setTimeout(() => navigate("/dashboard"), 2000);

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
            Certificate Created!
          </h1>
          <p className="mt-4 max-w-sm text-[var(--color-muted-foreground)]">
            Your artisan certificate has been successfully minted on the SUI blockchain.
            Redirecting to your dashboard…
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
          Create a Certificate
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Register a new artisan piece on the SUI blockchain. Fields marked with{" "}
          <span className="text-[var(--color-primary)]">*</span> are required.
        </p>
      </div>

      {/* ── Form card ── */}
      <form
        id="create-certificate-form"
        onSubmit={handleSubmit}
        className="rounded-2xl bg-[var(--color-card)] p-6 shadow-[var(--shadow-card)] sm:p-8"
        noValidate
      >
        <fieldset className="space-y-5" disabled={isMinting || !account}>
          <legend className="mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
            Certificate Information
          </legend>

          {FIELDS.map((field) => (
            <div key={field.id} className="flex flex-col gap-1.5">
              <label htmlFor={field.id} className="text-sm font-medium text-[var(--color-foreground)]">
                {field.label}
                {field.required && <span className="ml-1 text-[var(--color-primary)]">*</span>}
              </label>

              {field.as === "select" ? (
                <select
                  id={field.id}
                  name={field.name}
                  className={inputBase}
                  required={field.required}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.as === "textarea" ? (
                <textarea
                  id={field.id}
                  name={field.name}
                  placeholder={field.placeholder}
                  rows={3}
                  className={`${inputBase} resize-none`}
                  required={field.required}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                />
              ) : (
                <input
                  id={field.id}
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  required={field.required}
                  className={inputBase}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                />
              )}

              {field.hint && (
                <p className="text-xs text-[var(--color-muted-foreground)]">{field.hint}</p>
              )}
            </div>
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
                  Connect your SUI wallet to mint this certificate on-chain and
                  generate its QR code.
                </p>
              </div>
            </div>
          )}

          <Button
            id="create-certificate-submit"
            type="submit"
            variant="primary"
            disabled={isMinting || !account || !isFormValid}
            className="w-full py-6 text-lg font-semibold"
          >
            {isMinting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Minting Certificate…
              </>
            ) : account ? (
              "Mint Certificate"
            ) : (
              "Connect Wallet to Continue"
            )}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
