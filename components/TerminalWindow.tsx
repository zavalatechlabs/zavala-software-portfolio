'use client'

import { useState } from 'react'

export default function TerminalWindow() {
  const [isMinimized, setIsMinimized] = useState(false)

  const code = `// Portfolio.ts
interface Developer {
  name: string;
  role: string;
  focus: string[];
  passion: string;
  location: string;
  contact: {
    email: string;
    github: string;
    linkedin: string;
  };
}

const max: Developer = {
  name: "Max Zavala",
  role: "Software Engineer",
  focus: [
    "Full-Stack Development",
    "AI & Machine Learning",
    "Cloud Infrastructure"
  ],
  passion: "Building intelligent systems that solve real problems",
  location: "PST",
  contact: {
    email: "contact@zavalatechlabs.com",
    github: "https://github.com/zavalatechlabs",
    linkedin: "https://linkedin.com/in/maxzavala"
  }
};

export default max;`

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Terminal Window */}
      <div className="bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden border border-gray-800">
        {/* Window Header */}
        <div className="bg-[#323233] px-4 py-2 flex items-center justify-between">
          {/* Window Controls */}
          <div className="flex items-center gap-2">
            <button
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff4d44] transition-colors"
              aria-label="Close"
              title="Close"
            />
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffab00] transition-colors"
              aria-label={isMinimized ? "Maximize" : "Minimize"}
              title={isMinimized ? "Maximize" : "Minimize"}
            />
            <button
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1fb32f] transition-colors"
              aria-label="Maximize"
              title="Maximize"
            />
          </div>

          {/* File Tab */}
          <div className="flex items-center">
            <div className="bg-[#1e1e1e] px-4 py-1 rounded-t-md flex items-center gap-2 -mb-2">
              <span className="text-[#3b82f6] text-xs">📄</span>
              <span className="text-gray-300 text-xs font-mono">Portfolio.ts</span>
            </div>
          </div>

          {/* Empty space for symmetry */}
          <div className="w-[52px]"></div>
        </div>

        {/* Code Content */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isMinimized ? 'max-h-0' : 'max-h-[600px]'
          }`}
        >
          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed">
              <code className="text-gray-300">
                {code.split('\n').map((line, index) => {
                  // Syntax highlighting logic
                  const highlightedLine = line
                    // Comments
                    .replace(/(\/\/.*)/g, '<span class="text-[#6a9955]">$1</span>')
                    // Keywords
                    .replace(
                      /\b(interface|const|string|export|default)\b/g,
                      '<span class="text-[#569cd6]">$1</span>'
                    )
                    // Types
                    .replace(
                      /\b(Developer)\b/g,
                      '<span class="text-[#4ec9b0]">$1</span>'
                    )
                    // Strings
                    .replace(
                      /"([^"]*)"/g,
                      '<span class="text-[#ce9178]">"$1"</span>'
                    )
                    // Variable names
                    .replace(
                      /\b(name|role|focus|passion|location|contact|email|github|linkedin|max)(?=:)/g,
                      '<span class="text-[#9cdcfe]">$1</span>'
                    )

                  return (
                    <div key={index} className="table-row">
                      {/* Line number */}
                      <span className="table-cell text-right pr-4 text-gray-600 select-none w-8">
                        {index + 1}
                      </span>
                      {/* Code line */}
                      <span
                        className="table-cell"
                        dangerouslySetInnerHTML={{ __html: highlightedLine || '&nbsp;' }}
                      />
                    </div>
                  )
                })}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
