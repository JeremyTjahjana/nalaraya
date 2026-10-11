"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  epidermisTools,
  categories,
  Category,
  BiologyToolId,
  biologyIntroQuestions,
  gradeBiologyIntro,
  readBiologyCompletion,
  saveBiologyCompletion,
} from "@/lib/biologyIntro";
import DeferredToolPreview from "./DeferredToolPreview";

export default function BiologyLabIntroduction() {
  const [selected, setSelected] = useState<BiologyToolId>("microscope");
  const [category, setCategory] = useState<Category>("Semua");
  const [viewed, setViewed] = useState<Set<BiologyToolId>>(
    () => new Set<BiologyToolId>(["microscope"]),
  );
  const [answers, setAnswers] = useState<number[]>(
    Array(biologyIntroQuestions.length).fill(-1),
  );
  const [result, setResult] =
    useState<ReturnType<typeof gradeBiologyIntro>>(null);
  const [completed, setCompleted] = useState(false);
  const [storageNotice, setStorageNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const continueButton = useRef<HTMLButtonElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      setCompleted(readBiologyCompletion(window.localStorage));
    } catch {
      /* Storage can be disabled by browser privacy settings. */
    }
  }, []);
  useEffect(() => {
    if (result) resultHeading.current?.focus();
  }, [result]);

  const item = epidermisTools.find((tool) => tool.id === selected)!;
  const filteredEquipment =
    category === "Semua"
      ? epidermisTools
      : epidermisTools.filter((tool) => tool.category === category);

  function submit(event: FormEvent) {
    event.preventDefault();
    const grade = gradeBiologyIntro(answers);
    if (!grade) return;
    setResult(grade);
    if (grade.passed) {
      setCompleted(true);
      try {
        if (!saveBiologyCompletion(window.localStorage))
          setStorageNotice(
            "Hasilmu tetap lulus, tetapi browser tidak dapat menyimpannya.",
          );
      } catch {
        setStorageNotice(
          "Hasilmu tetap lulus, tetapi browser tidak dapat menyimpannya.",
        );
      }
    }
    dialog.current?.scrollTo({ top: 0 });
  }

  function retry() {
    setAnswers(Array(biologyIntroQuestions.length).fill(-1));
    setResult(null);
    setStorageNotice("");
    requestAnimationFrame(() => {
      dialog.current?.scrollTo({ top: 0 });
      dialog.current?.querySelector<HTMLInputElement>("input")?.focus();
    });
  }

  return (
    <>
      <section
        className="equipment-section"
        aria-labelledby="equipment-heading"
      >
        <div className="equipment-section-header">
          <h2 id="equipment-heading">Alat dan bahan praktikum</h2>
          <span className="equipment-counter-badge">
            Dipelajari: <strong>{viewed.size}</strong>/{epidermisTools.length}{" "}
            alat
          </span>
        </div>
        <p>
          Kenali alat dan bahan yang digunakan pada praktikum epidermis bawang
          merah. Pilih alat untuk melihat bentuknya dari berbagai sisi dan
          pelajari cara menggunakannya.
        </p>

        <div
          className="equipment-category-tabs"
          role="tablist"
          aria-label="Filter kategori alat"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-tab-btn${category === cat ? " active" : ""}`}
              aria-pressed={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}{" "}
              {cat === "Semua"
                ? `(${epidermisTools.length})`
                : `(${epidermisTools.filter((t) => t.category === cat).length})`}
            </button>
          ))}
        </div>

        <div className="equipment-explorer">
          <nav className="equipment-picker" aria-label="Pilih peralatan">
            {filteredEquipment.map((tool) => (
              <button
                key={tool.id}
                className="equipment-pick-btn"
                aria-pressed={selected === tool.id}
                onClick={() => {
                  setSelected(tool.id);
                  setViewed((prev) => new Set([...prev, tool.id]));
                }}
              >
                <span className="tool-btn-name">{tool.name}</span>
                {viewed.has(tool.id) && (
                  <span
                    className="viewed-badge"
                    aria-label="Sudah dipelajari"
                    title="Sudah dipelajari"
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
          </nav>
          <article className="equipment-detail" aria-label={item.name}>
            <DeferredToolPreview id={selected} />
            <div className="equipment-copy" aria-live="polite">
              <div className="equipment-copy-header">
                <span className="equipment-category-pill">{item.category}</span>
              </div>
              <h3>{item.name}</h3>
              <dl>
                <dt>Spesifikasi</dt>
                <dd>{item.spec}</dd>
                <dt>Fungsi</dt>
                <dd>{item.info}</dd>
                <dt>Perhatikan keselamatan</dt>
                <dd>{item.safety}</dd>
              </dl>
            </div>
          </article>
        </div>
      </section>
      <div className="course-next">
        {completed && (
          <p className="completion-badge">✓ Kelas pengenalan telah lulus.</p>
        )}
        <div className="course-next-actions">
          <button
            ref={continueButton}
            className="primary"
            onClick={() => dialog.current?.showModal()}
          >
            {completed ? "Uji Ulang Pemahaman" : "Uji Pemahaman"}
          </button>
          {completed && (
            <Link
              className="button primary next-lab-btn"
              href="/biologi/epidermis-bawang"
            >
              Mulai Praktikum Epidermis Bawang →
            </Link>
          )}
        </div>
      </div>
      <dialog
        className="course-quiz-dialog"
        ref={dialog}
        aria-labelledby="quiz-heading"
        onClose={() => continueButton.current?.focus()}
      >
        <div className="quiz-dialog-header">
          <h2 id="quiz-heading">Uji pemahaman</h2>
          <button
            autoFocus
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Tutup ujian"
          >
            Tutup
          </button>
        </div>
        {result ? (
          <section className="course-quiz-result">
            <h3 ref={resultHeading} tabIndex={-1}>
              {result.passed ? "Lulus" : "Belum lulus"} — {result.score}/5 benar
            </h3>
            <p>
              {result.passed
                ? "Kamu sudah mengenali alat dan bahan praktikum biologi dengan baik."
                : "Pelajari pembahasan berikut, lalu coba kembali. Minimal empat jawaban benar untuk lulus."}
            </p>
            {result.incorrect.map((index) => {
              const question = biologyIntroQuestions[index];
              return (
                <article key={question.q}>
                  <h4>
                    {index + 1}. {question.q}
                  </h4>
                  <p>Jawabanmu: {question.options[answers[index]]}</p>
                  <p>
                    <strong>
                      Jawaban benar: {question.options[question.answer]}
                    </strong>
                  </p>
                  <p>{question.explanation}</p>
                </article>
              );
            })}
            {storageNotice && <p role="status">{storageNotice}</p>}
            <div className="quiz-actions">
              <button onClick={retry}>Coba lagi</button>
              <button onClick={() => dialog.current?.close()}>
                Kembali ke materi
              </button>
              {result.passed && (
                <Link
                  className="button primary next-lab-btn"
                  href="/biologi/epidermis-bawang"
                >
                  Mulai Praktikum Epidermis Bawang →
                </Link>
              )}
              {result.passed && (
                <Link className="button secondary" href="/biologi">
                  Kembali ke kelas biologi
                </Link>
              )}
            </div>
          </section>
        ) : (
          <form className="course-quiz-form" onSubmit={submit}>
            <p>
              Jawab seluruh lima soal. Minimal empat jawaban benar untuk lulus.
            </p>
            {biologyIntroQuestions.map((question, index) => (
              <fieldset key={question.q}>
                <legend>
                  {index + 1}. {question.q}
                </legend>
                {question.options.map((option, optionIndex) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name={"question-" + index}
                      required
                      checked={answers[index] === optionIndex}
                      onChange={() =>
                        setAnswers((current) =>
                          current.map((value, i) =>
                            i === index ? optionIndex : value,
                          ),
                        )
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </fieldset>
            ))}
            <div className="quiz-actions">
              <button className="primary" type="submit">
                Periksa jawaban
              </button>
              <button type="button" onClick={() => dialog.current?.close()}>
                Kembali ke materi
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
