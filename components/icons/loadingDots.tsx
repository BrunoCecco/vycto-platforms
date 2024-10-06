interface LoadingDotsProps {
  color?: string;
}

const LoadingDots = ({ color = "#000" }: LoadingDotsProps) => {
  return (
    <span className="inline-flex items-center">
      <span className="spacer mr-2" />
      <span
        className="animate-blink mx-1 inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span
        className="animate-blink mx-1 inline-block h-1.5 w-1.5 rounded-full delay-200"
        style={{ backgroundColor: color }}
      />
      <span
        className="animate-blink delay-400 mx-1 inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
};

// Add the keyframes for the blink animation in your Tailwind CSS configuration
// ...
export default LoadingDots;
