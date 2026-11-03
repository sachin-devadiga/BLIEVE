export default function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
      {label && (
        <p className="text-orange font-medium text-sm mb-2 tracking-wider uppercase">
          {label}
        </p>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy dark:text-white mb-3">
        {title}
      </h2>
      {description && (
        <p
          className={`text-text-grey dark:text-gray-400 leading-relaxed ${align === "center" ? "max-w-2xl mx-auto" : "max-w-lg"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
