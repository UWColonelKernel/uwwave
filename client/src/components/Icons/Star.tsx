import React from 'react'

interface StarProps {
  height: number
  width: number
}

export const Star: React.FC<StarProps> = ({ height, width }) => (
  <svg
    width={`${width}px`}
    height={`${height}px`}
    viewBox="0 0 34 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 0L20.8167 11.4455H33.168L23.1756 18.5192L26.9923 29.9647L17 22.891L7.00765 29.9647L10.8244 18.5192L0.832039 11.4455H13.1833L17 0Z"
      fill="#185CFF"
    />
  </svg>
)
