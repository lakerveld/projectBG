export function LocationStory({ story }: { story: string }) {
  return (
    <div className="space-y-3 break-words text-base leading-relaxed">
      {story
        .trim()
        .split(/\r?\n\s*\r?\n/)
        .filter(Boolean)
        .map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
    </div>
  );
}
