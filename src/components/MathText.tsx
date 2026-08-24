"use client";

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type MathTextProps = {
  text: string;
  className?: string;
  display?: boolean;
};

function renderKatex(src: string, displayMode: boolean): string {
  try {
    return katex.renderToString(src, {
      throwOnError: false,
      displayMode,
      strict: "ignore",
      trust: false,
    });
  } catch {
    return escapeHtml(src);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeMathSource(raw: string): string {
  return raw
    .replace(/=>/g, " \\rightarrow ")
    .replace(/→/g, " \\rightarrow ")
    .replace(/⋅/g, "\\cdot ")
    .replace(/·/g, "\\cdot ")
    .replace(/×/g, "\\times ")
    .replace(/÷/g, "\\div ");
}

function containsLatexCommands(src: string): boolean {
  return /\\[a-zA-Z]+/.test(src);
}

function hasCyrillic(src: string): boolean {
  return /[А-Яа-яЁё]/.test(src);
}

function renderMixedWithBareLatex(input: string): string {
  const latexIslandRe =
    /\\[a-zA-Z]+(?:\s*\*[0-9]+)?(?:\s*\{[^{}]*\}){0,3}|\\[{}[\]_|]/g;

  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(latexIslandRe.source, "g");

  while ((match = re.exec(input)) !== null) {
    let end = match.index + match[0].length;
    let start = match.index;

    while (end < input.length) {
      const rest = input.slice(end);
      const cont = rest.match(
        /^(?:\s*(?:\\[a-zA-Z]+(?:\s*\{[^{}]*\}){0,3}|[0-9A-Za-z+\-*/=^_().,]|\{[^{}]*\}))+/,
      );
      if (!cont) break;
      if (hasCyrillic(cont[0])) break;
      end += cont[0].length;
    }

    if (start > lastIndex) {
      parts.push(`<span>${escapeHtml(input.slice(lastIndex, start))}</span>`);
    }

    const island = input.slice(start, end).trim();
    if (island) {
      parts.push(renderKatex(normalizeMathSource(island), false));
    }
    lastIndex = end;
  }

  if (lastIndex < input.length) {
    parts.push(`<span>${escapeHtml(input.slice(lastIndex))}</span>`);
  }

  return parts.length ? parts.join("") : `<span>${escapeHtml(input)}</span>`;
}

function renderDelimitedOrPlain(input: string): string {
  const tokenRe =
    /(\$\$[\s\S]+?\$\$|\$[^$]+\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g;

  const parts: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let foundDelimiter = false;

  while ((match = tokenRe.exec(input)) !== null) {
    foundDelimiter = true;
    if (match.index > lastIndex) {
      const plain = input.slice(lastIndex, match.index);
      parts.push(
        containsLatexCommands(plain)
          ? renderMixedWithBareLatex(plain)
          : `<span>${escapeHtml(plain)}</span>`,
      );
    }

    const token = match[0];
    if (token.startsWith("$$") && token.endsWith("$$")) {
      parts.push(renderKatex(normalizeMathSource(token.slice(2, -2).trim()), true));
    } else if (token.startsWith("\\[") && token.endsWith("\\]")) {
      parts.push(renderKatex(normalizeMathSource(token.slice(2, -2).trim()), true));
    } else if (token.startsWith("\\(") && token.endsWith("\\)")) {
      parts.push(renderKatex(normalizeMathSource(token.slice(2, -2).trim()), false));
    } else if (token.startsWith("$") && token.endsWith("$")) {
      parts.push(renderKatex(normalizeMathSource(token.slice(1, -1).trim()), false));
    }

    lastIndex = match.index + token.length;
  }

  if (foundDelimiter) {
    if (lastIndex < input.length) {
      const plain = input.slice(lastIndex);
      parts.push(
        containsLatexCommands(plain)
          ? renderMixedWithBareLatex(plain)
          : `<span>${escapeHtml(plain)}</span>`,
      );
    }
    return parts.join("");
  }

  if (containsLatexCommands(input)) {
    if (hasCyrillic(input)) {
      return renderMixedWithBareLatex(input);
    }
    return renderKatex(normalizeMathSource(input.trim()), false);
  }

  return `<span>${escapeHtml(input)}</span>`;
}

export function MathText({ text, className, display = false }: MathTextProps) {
  const html = useMemo(() => {
    if (!text) return "";
    const trimmed = text.trim();
    if (!trimmed) return "";

    if (display && containsLatexCommands(trimmed) && !hasCyrillic(trimmed)) {
      return renderKatex(normalizeMathSource(trimmed), true);
    }

    return renderDelimitedOrPlain(text);
  }, [text, display]);

  return (
    <span
      className={`katex-host whitespace-pre-wrap [&_.katex]:text-inherit ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
