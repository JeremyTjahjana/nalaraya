"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LabKey, LabMode } from "@/lib/progress";

export default function ProgressRecorder({
  lab,
  mode,
  score,
}: {
  lab: LabKey;
  mode: LabMode;
  score: number | null;
}) {
  const sent = useRef(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const supabase = createClient();
    if (!supabase) {
      setError(true);
      return;
    }
    void supabase
      .rpc("record_lab_progress", {
        p_lab_key: lab,
        p_mode: mode,
        p_score: score,
      })
      .then(({ error }) => setError(Boolean(error)));
  }, [lab, mode, score, attempt]);
  return error ? (
    <p className="progress-save-error" role="alert">
      Hasil belum tersimpan.{" "}
      <button
        type="button"
        onClick={() => {
          sent.current = false;
          setError(false);
          setAttempt((value) => value + 1);
        }}
      >
        Coba simpan lagi
      </button>
    </p>
  ) : null;
}
