"use client"

import { useEffect } from "react"

export default function VioletLetter() {
  // フォントを動的に読み込む
  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <>
      {/* インラインスタイル */}
      <style jsx global>{`
        :root {
          --background: 44 70% 88%;
          --foreground: 30 60% 12%;
          --card: 44 70% 88%;
          --card-foreground: 30 60% 12%;
          --border: 30 60% 12%;
          --input: 30 60% 12%;
          --primary: 30 60% 12%;
          --primary-foreground: 44 70% 88%;
          --secondary: 40 55% 80%;
          --secondary-foreground: 30 60% 12%;
          --accent: 40 55% 80%;
          --accent-foreground: 30 60% 12%;
          --destructive: 0 85% 60%;
          --destructive-foreground: 44 70% 88%;
          --ring: 30 60% 12%;
          --radius: 0.5rem;
        }
        
        body {
          background-color: #f8e8c8;
          color: #2d1f0e;
          font-family: 'Noto Serif JP', serif;
          margin: 0;
          padding: 0;
        }
        
        .flex {
          display: flex;
        }
        
        .flex-col {
          flex-direction: column;
        }
        
        .items-center {
          align-items: center;
        }
        
        .justify-center {
          justify-content: center;
        }
        
        .min-h-screen {
          min-height: 100vh;
        }
        
        .p-4 {
          padding: 1rem;
        }
        
        .max-w-md {
          max-width: 28rem;
        }
        
        .w-full {
          width: 100%;
        }
        
        .text-5xl {
          font-size: 3rem;
        }
        
        .font-serif {
          font-family: 'Noto Serif JP', serif;
        }
        
        .text-\[\#2d1f0e\] {
          color: #2d1f0e;
        }
        
        .mb-6 {
          margin-bottom: 1.5rem;
        }
        
        .tracking-wide {
          letter-spacing: 0.05em;
        }
        
        .mr-2 {
          margin-right: 0.5rem;
        }
        
        .ml-2 {
          margin-left: 0.5rem;
        }
        
        .my-4 {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        
        .relative {
          position: relative;
        }
        
        .h-\[300px\] {
          height: 300px;
        }
        
        .object-contain {
          object-fit: contain;
        }
        
        .text-2xl {
          font-size: 1.5rem;
        }
        
        .font-medium {
          font-weight: 500;
        }
        
        .my-6 {
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .text-center {
          text-align: center;
        }
        
        .h-16 {
          height: 4rem;
        }
        
        .rounded-full {
          border-radius: 9999px;
        }
        
        .bg-transparent {
          background-color: transparent;
        }
        
        .border-2 {
          border-width: 2px;
        }
        
        .border-\[\#2d1f0e\] {
          border-color: #2d1f0e;
        }
        
        .hover\:bg-\[\#e9d9b9\]:hover {
          background-color: #e9d9b9;
        }
        
        .gap-4 {
          gap: 1rem;
        }
        
        .mt-4 {
          margin-top: 1rem;
        }
        
        .h-6 {
          height: 1.5rem;
        }
        
        .w-6 {
          width: 1.5rem;
        }
        
        .text-xl {
          font-size: 1.25rem;
        }
        
        .button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 28rem;
          height: 4rem;
          border-radius: 9999px;
          background-color: transparent;
          border: 2px solid #2d1f0e;
          color: #2d1f0e;
          gap: 1rem;
          margin-top: 1rem;
          cursor: pointer;
          font-family: 'Noto Serif JP', serif;
          font-size: 1.25rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .button:hover {
          background-color: #e9d9b9;
        }
        
        .placeholder-image {
          width: 100%;
          height: 300px;
          background-color: #e0d0b0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2d1f0e;
          font-size: 1rem;
          border-radius: 0.5rem;
        }
      `}</style>

      <div
        className="flex flex-col items-center justify-center min-h-screen p-4"
        style={{ backgroundColor: "#f8e8c8" }}
      >
        <div className="max-w-md w-full flex flex-col items-center">
          {/* Title */}
          <h1 className="text-5xl font-serif text-[#2d1f0e] mb-6 tracking-wide">
            <span className="mr-2">~</span>Violet Letter<span className="ml-2">~</span>
          </h1>

          {/* Character Image */}
          <div className="my-4 relative w-full h-[300px]">
            <div className="placeholder-image">アニメキャラクター画像のプレースホルダー</div>
          </div>

          {/* Japanese Text */}
          <p className="text-2xl text-[#2d1f0e] font-medium my-6 text-center">お話をどうぞ、手紙にいたします</p>

          {/* Voice Input Button */}
          <button className="button" onClick={() => alert("音声入力が開始されました")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-[#2d1f0e]"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
            <span>音声入力をはじめる</span>
          </button>
        </div>
      </div>
    </>
  )
}
