"use client";

import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const checked = theme === "dark";

  return (
    <label className="relative inline-block cursor-pointer w-16 h-9 shrink-0">
      <input
        type="checkbox"
        className="opacity-0 w-0 h-0 absolute"
        checked={checked}
        onChange={toggleTheme}
      />
      <svg
        viewBox="0 0 69.667 44"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <g transform="translate(3.5 3.5)">
          <g filter="url(#container)" transform="matrix(1, 0, 0, 1, -3.5, -3.5)">
            <rect
              fill={checked ? "#2b4360" : "#83cbd8"}
              transform="translate(3.5 3.5)"
              rx="17.5"
              height={35}
              width="60.667"
              style={{ transition: "fill 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
          </g>
          <g
            transform={checked ? "translate(30.333 2.333)" : "translate(2.333 2.333)"}
            style={{ transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }}
          >
            <g opacity={checked ? 0 : 1} style={{ transition: "opacity 0.25s" }}>
              <g filter="url(#sun-outer)" transform="matrix(1, 0, 0, 1, -5.83, -5.83)">
                <circle fill="#f8e664" transform="translate(5.83 5.83)" r="15.167" cy="15.167" cx="15.167" />
              </g>
              <circle fill="#fcf4b9" transform="translate(8.167 8.167)" r={7} cy={7} cx={7} />
            </g>
            <g opacity={checked ? 1 : 0} style={{ transition: "opacity 0.25s" }}>
              <g filter="url(#moon)" transform="matrix(1, 0, 0, 1, -31.5, -5.83)">
                <circle fill="#cce6ee" transform="translate(31.5 5.83)" r="15.167" cy="15.167" cx="15.167" />
              </g>
              <g fill="#a6cad0" transform="translate(-24.415 -1.009)">
                <circle transform="translate(43.009 4.496)" r={2} cy={2} cx={2} />
                <circle transform="translate(39.366 17.952)" r={2} cy={2} cx={2} />
                <circle transform="translate(33.016 8.044)" r={1} cy={1} cx={1} />
                <circle transform="translate(51.081 18.888)" r={1} cy={1} cx={1} />
                <circle transform="translate(33.016 22.503)" r={1} cy={1} cx={1} />
                <circle transform="translate(50.081 10.53)" r="1.5" cy="1.5" cx="1.5" />
              </g>
            </g>
          </g>
          <g
            opacity={checked ? 0 : 1}
            style={{ transition: "opacity 0.25s" }}
            transform="matrix(1, 0, 0, 1, -3.5, -3.5)"
          >
            <path
              fill="#fff"
              transform="translate(-3466.47 -160.94)"
              d="M3512.81,173.815a4.463,4.463,0,0,1,2.243.62.95.95,0,0,1,.72-1.281,4.852,4.852,0,0,1,2.623.519c.034.02-.5-1.968.281-2.716a2.117,2.117,0,0,1,2.829-.274,1.821,1.821,0,0,1,.854,1.858c.063.037,2.594-.049,3.285,1.273s-.865,2.544-.807,2.626a12.192,12.192,0,0,1,2.278.892c.553.448,1.106,1.992-1.62,2.927a7.742,7.742,0,0,1-3.762-.3c-1.28-.49-1.181-2.65-1.137-2.624s-1.417,2.2-2.623,2.2a4.172,4.172,0,0,1-2.394-1.206,3.8,3.8,0,0,1-.8-2.533A4.719,4.719,0,0,1,3512.81,173.815Z"
            />
          </g>
          <g
            fill="#def8ff"
            transform="translate(3.585 1.325)"
            opacity={checked ? 1 : 0}
            style={{ transition: "opacity 0.25s" }}
          >
            <path transform="matrix(-1, 0.017, -0.017, -1, 24.231, 3.055)" d="M.774,0,.566.559,0,.539.458.933.25,1.492l.485-.361.458.394L1.024.953,1.509.592.943.572Z" />
            <path transform="matrix(-0.777, 0.629, -0.629, -0.777, 23.185, 12.358)" d="M1.341.529.836.472.736,0,.505.46,0,.4.4.729l-.231.46L.605.932l.4.326L.9.786Z" />
            <path transform="translate(12.677 0.388) rotate(104)" d="M1.161,1.6,1.059,1,1.574.722.962.607.86,0,.613.572,0,.457.446.881.2,1.454l.516-.274Z" />
            <path transform="translate(2.218 14.616) rotate(169)" d="M1.261,0,.774.571.114.3.487.967,0,1.538.728,1.32l.372.662.047-.749.728-.218L1.215.749Z" />
          </g>
        </g>
      </svg>
    </label>
  );
};

export default ThemeToggle;