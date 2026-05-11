'use client'

import React, { useState } from 'react'

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

  const highlightLine = (line: string) => {
    const tokens: React.JSX.Element[] = []
    let key = 0

    const patterns = [
      { regex: /"[^"]*"/g, className: 'text-zavala-terminal-syntax-string' },
      {
        regex:
          /\b(const|let|var|function|return|if|else|for|while|class|new|this|import|export|from|default)\b/g,
        className: 'text-zavala-terminal-syntax-keyword',
      },
      {
        regex: /\b(true|false|null|undefined)\b/g,
        className: 'text-zavala-terminal-syntax-keyword',
      },
      {
        regex: /\b(name|role|focus|passion|location|contact|email|Developer)(?=\s*:)/g,
        className: 'text-zavala-terminal-syntax-variable',
      },
    ]

    const matches: Array<{ start: number; end: number; text: string; className: string }> = []

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

    matches.sort((a, b) => a.start - b.start)
    const validMatches: typeof matches = []
    let lastEnd = 0
    matches.forEach((match) => {
      if (match.start >= lastEnd) {
        validMatches.push(match)
        lastEnd = match.end
      }
    })

    let lastIndex = 0
    validMatches.forEach((match) => {
      if (match.start > lastIndex) {
        tokens.push(
          <span key={key++} className="text-zavala-terminal-text">
            {line.substring(lastIndex, match.start)}
          </span>
        )
      }
      tokens.push(
        <span key={key++} className={match.className}>
          {match.text}
        </span>
      )
      lastIndex = match.end
    })

    if (lastIndex < line.length) {
      tokens.push(
        <span key={key++} className="text-zavala-terminal-text">
          {line.substring(lastIndex)}
        </span>
      )
    }

    return tokens.length > 0 ? (
      tokens
    ) : (
      <span className="text-zavala-terminal-text">{line || ' '}</span>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-zavala-terminal-bg rounded-lg shadow-2xl overflow-hidden border border-zavala-terminal-border">
        <div className="bg-zavala-terminal-header px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2" aria-hidden="true">
            {/* Decorative macOS traffic-light controls. Only the yellow
                minimize button is functional. The close and maximize
                circles are visual chrome only — hidden from assistive
                tech to avoid misleading screen-reader users. */}
            <span className="w-3 h-3 rounded-full bg-zavala-terminal-control-close" />
            <button
              type="button"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-3 h-3 rounded-full bg-zavala-terminal-control-minimize hover:bg-zavala-terminal-control-minimize-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zavala-accent-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zavala-terminal-header"
              aria-label={isMinimized ? 'Expand code panel' : 'Collapse code panel'}
              aria-expanded={!isMinimized}
            />
            <span className="w-3 h-3 rounded-full bg-zavala-terminal-control-maximize" />
          </div>

          <div className="flex-1"></div>

          <div className="bg-zavala-terminal-bg px-4 py-1 rounded-t-md flex items-center gap-2 -mb-2">
            <span className="text-zavala-terminal-syntax-value text-xs" aria-hidden="true">
              📄
            </span>
            <span className="text-zavala-terminal-text text-xs font-mono">Developer Info.ts</span>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isMinimized ? 'max-h-0' : 'max-h-[600px]'
          }`}
        >
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed">
              <code>
                {code.split('\n').map((line, index) => (
                  <div key={index} className="table-row">
                    <span className="table-cell text-right pr-4 text-zavala-terminal-line-number select-none w-8">
                      {index + 1}
                    </span>
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
