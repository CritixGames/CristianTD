export function SilhouetteBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Left silhouette */}
      <svg
        className="silhouette-drift-1 absolute -left-20 top-[10%] h-[80%] w-64 opacity-[0.14]"
        viewBox="0 0 200 800"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M120 0 C140 80, 160 120, 150 180 C140 240, 100 260, 95 320 C90 380, 130 400, 140 440 C150 480, 130 520, 110 560 C90 600, 100 660, 110 720 C115 760, 120 780, 120 800"
          stroke="url(#grad1)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M130 0 C150 70, 170 130, 160 190 C150 250, 108 270, 103 330 C98 390, 140 410, 150 450 C160 490, 138 530, 118 570 C98 610, 108 670, 118 730 C123 770, 128 785, 128 800"
          stroke="url(#grad1)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="0" />
            <stop offset="20%" stopColor="#ff0000" stopOpacity="1" />
            <stop offset="80%" stopColor="#ff0000" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Right silhouette */}
      <svg
        className="silhouette-drift-2 absolute -right-20 top-[5%] h-[85%] w-64 opacity-[0.14]"
        viewBox="0 0 200 800"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M80 0 C60 90, 40 140, 50 200 C60 260, 100 280, 105 340 C110 400, 70 430, 60 470 C50 510, 70 550, 90 590 C110 630, 100 680, 90 740 C85 770, 80 790, 80 800"
          stroke="url(#grad2)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M70 0 C50 80, 30 130, 40 190 C50 250, 92 268, 97 330 C102 392, 62 420, 52 460 C42 500, 62 540, 82 580 C102 620, 92 670, 82 730 C77 765, 72 785, 72 800"
          stroke="url(#grad2)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="0" />
            <stop offset="30%" stopColor="#ff0000" stopOpacity="1" />
            <stop offset="70%" stopColor="#ff0000" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center back curve */}
      <svg
        className="silhouette-drift-3 absolute left-1/2 -translate-x-1/2 top-[15%] h-[70%] w-48 opacity-[0.125]"
        viewBox="0 0 160 700"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M80 0 C95 60, 110 100, 105 150 C100 200, 70 230, 65 280 C60 330, 90 360, 100 400 C110 440, 95 480, 80 520 C65 560, 70 610, 80 660 C85 680, 80 700, 80 700"
          stroke="url(#grad3)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff3333" stopOpacity="0" />
            <stop offset="25%" stopColor="#ff3333" stopOpacity="1" />
            <stop offset="75%" stopColor="#ff3333" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff3333" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
