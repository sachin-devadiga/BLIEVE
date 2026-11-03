export default function WaveDivider({
  from = "bg-navy",
  to = "bg-white",
  flip = false,
}: {
  from?: string;
  to?: string;
  flip?: boolean;
}) {
  return (
    <div className={`relative ${from} ${flip ? "rotate-180" : ""}`}>
      <svg
        className="w-full h-12 md:h-20 block"
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V80H0V32Z"
          className={to}
        />
      </svg>
    </div>
  );
}
