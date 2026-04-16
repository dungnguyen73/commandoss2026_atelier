import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, ArrowRight, CameraOff, Loader2 } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/button";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const navigate = useNavigate();
  const [manualId, setManualId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const SCANNER_ID = "qr-reader";

  useEffect(() => {
    // Initialize scanner
    const html5QrCode = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        setIsScanning(true);
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Success handler
            stopScanner();
            
            // Extract ID from URL if it's a link, otherwise use as is
            let id = decodedText;
            if (decodedText.includes("/item/")) {
                id = decodedText.split("/item/").pop() || decodedText;
            }
            navigate(`/item/${encodeURIComponent(id)}`);
          },
          () => {
            // Failure handler (silent for continuous scanning)
          }
        );
      } catch (err: any) {
        console.error("Failed to start scanner:", err);
        setError("Camera access denied or not available. Please ensure permissions are granted.");
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [navigate]);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
  };

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = manualId.trim();
    if (trimmed) navigate(`/item/${encodeURIComponent(trimmed)}`);
  }

  return (
    <PageContainer narrow>
      {/* ── Page header ── */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-2xl font-bold text-[var(--color-foreground)]">
          Scan QR Code
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Point your camera at a ChainPassport QR code to view its provenance
          record.
        </p>
      </div>

      {/* ── Scanner area ── */}
      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-[var(--color-surface-low)] shadow-inner">
        <div id={SCANNER_ID} className="aspect-square w-full" />
        
        {/* Overlay when not scanning/error */}
        {!isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[var(--color-surface-low)]">
            {error ? (
              <>
                <CameraOff className="mb-4 h-12 w-12 text-red-400" />
                <p className="text-sm font-medium text-[var(--color-foreground)]">{error}</p>
                <Button variant="secondary" onClick={() => window.location.reload()} className="mt-4">
                  Retry Permissions
                </Button>
              </>
            ) : (
              <>
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-[var(--color-primary)]" />
                <p className="text-sm font-medium text-[var(--color-muted-foreground)]">Starting camera...</p>
              </>
            )}
          </div>
        )}

        {/* Framing UI overlay (visible only when scanning) */}
        {isScanning && (
           <div className="pointer-events-none absolute inset-0 z-10">
              <span className="absolute left-5 top-5 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-[var(--color-primary)]" />
              <span className="absolute right-5 top-5 h-8 w-8 rounded-tr-xl border-r-2 border-t-2 border-[var(--color-primary)]" />
              <span className="absolute bottom-5 left-5 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-[var(--color-primary)]" />
              <span className="absolute bottom-5 right-5 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-[var(--color-primary)]" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="h-[250px] w-[250px] rounded-2xl border border-[var(--color-primary)]/30 ring-[2000px] ring-black/40" />
              </div>
           </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="my-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
          or enter ID manually
        </span>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      {/* ── Manual entry ── */}
      <form
        id="scan-manual-form"
        onSubmit={handleManualSubmit}
        className="flex gap-2"
        aria-label="Manual batch ID entry"
      >
        <div className="relative flex-1">
          <Hash
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]"
            aria-hidden
          />
          <input
            id="manual-batch-id"
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="Batch ID or object address"
            aria-label="Batch ID"
            className="w-full rounded-xl bg-[var(--color-surface-low)] py-2.5 pl-9 pr-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] outline-none focus:bg-[var(--color-surface-lowest)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
          />
        </div>
        <Button
          id="scan-manual-submit"
          type="submit"
          variant="primary"
          disabled={!manualId.trim()}
          aria-label="Look up batch"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </PageContainer>
  );
}
