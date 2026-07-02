'use client'

import React, { useState } from 'react'

// NOTE on colors: the macOS traffic-light dots and the VS Code Dark+ syntax
// palette below are intentionally hardcoded hex values — they imitate other
// software's chrome and must not shift with the site theme. This is the one
// documented exception to the "zavala-* tokens only" rule (see CLAUDE.md).
export function TerminalWindow() {
  const [isMinimized, setIsMinimized] = useState(false)

  const code = `const Developer = {
  name: "Maximiliano Zavala",
  role: "Software Engineer",
  focus: [
    "Full-Stack Development",
    "AI & Machine Learning",
    "Cloud Infrastructure"
  ],
  passion: true,
  location: "Seattle, WA",
  contact: {
    email: "contact@zavalatechlabs.com"
  }
};`

  // Tokenize and highlight a line of code
  const highlightLine = (line: string) => {
    const tokens: React.JSX.Element[] = []
    let key = 0

    // Token patterns in order of precedence
    // VS Code Dark+ theme colors — intentionally hardcoded, not theme-responsive
    const patterns = [
      { regex: /"[^"]*"/g, className: 'text-[#ce9178]' }, // Strings
      {
        regex:
          /\b(const|let|var|function|return|if|else|for|while|class|new|this|import|export|from|default)\b/g,
        className: 'text-[#569cd6]',
      }, // Keywords
      { regex: /\b(true|false|null|undefined)\b/g, className: 'text-[#569cd6]' }, // Booleans/null
      {
        regex: /\b(name|role|focus|passion|location|contact|email|Developer)(?=\s*:)/g,
        className: 'text-[#9cdcfe]',
      }, // Property names
    ]

    const matches: Array<{ start: number; end: number; text: string; className: string }> = []

    // Find all matches
    patterns.forEach(({ regex, className }) => {
      const pattern = new RegExp(regex.source, regex.flags)
      let match
      while ((match = pattern.exec(line)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          className,
        })
      }
    })

    // Sort matches by position and remove overlaps (first match wins)
    matches.sort((a, b) => a.start - b.start)
    const validMatches: typeof matches = []
    let lastEnd = 0
    matches.forEach((match) => {
      if (match.start >= lastEnd) {
        validMatches.push(match)
        lastEnd = match.end
      }
    })

    // Build token list
    let lastIndex = 0
    validMatches.forEach((match) => {
      // Add plain text before match
      if (match.start > lastIndex) {
        tokens.push(
          <span key={key++} className="text-zavala-terminal-text">
            {line.substring(lastIndex, match.start)}
          </span>
        )
      }
      // Add highlighted match
      tokens.push(
        <span key={key++} className={match.className}>
          {match.text}
        </span>
      )
      lastIndex = match.end
    })

    // Add remaining plain text
    if (lastIndex < line.length) {
      tokens.push(
        <span key={key++} className="text-zavala-terminal-text">
          {line.substring(lastIndex)}
        </span>
      )
    }

    // If no tokens, return empty line with default color
    return tokens.length > 0 ? (
      tokens
    ) : (
      <span className="text-zavala-terminal-text">{line || '\u00A0'}</span>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Terminal Window */}
      <div className="bg-zavala-terminal-bg rounded-lg shadow-2xl overflow-hidden border border-zavala-terminal-border">
        {/* Window Header */}
        <div className="bg-zavala-terminal-header px-4 py-2 flex items-center justify-between">
          {/* Window Controls - Left. Only the yellow dot does anything
              (collapse/expand); the red and green dots are decoration, so
              they are not focusable and are hidden from assistive tech. */}
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              aria-expanded={!isMinimized}
              aria-controls="terminal-code-panel"
              aria-label={isMinimized ? 'Expand code panel' : 'Collapse code panel'}
              className="p-1.5 -m-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-terminal-header focus-visible:outline-none"
            >
              <span className="block w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffab00] transition-colors" />
            </button>
            <span aria-hidden="true" className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>

          {/* Spacer for center */}
          <div className="flex-1"></div>

          {/* File Tab - Right aligned */}
          <div className="bg-zavala-terminal-bg px-4 py-1 rounded-t-md flex items-center gap-2 -mb-2">
            <span aria-hidden="true" className="text-xs">
              📄
            </span>
            <span className="text-zavala-terminal-text text-xs font-mono">Developer Info.ts</span>
          </div>
        </div>

        {/* Code Content */}
        <div
          id="terminal-code-panel"
          className={`transition-all duration-200 ease-in-out overflow-hidden ${
            isMinimized ? 'max-h-0' : 'max-h-[600px]'
          }`}
        >
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed">
              <code>
                {code.split('\n').map((line, index) => (
                  <div key={index} className="table-row">
                    {/* Line number */}
                    <span className="table-cell text-right pr-4 text-zavala-terminal-line-number select-none w-8">
                      {index + 1}
                    </span>
                    {/* Code line with syntax highlighting */}
                    <span className="table-cell">{highlightLine(line)}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
