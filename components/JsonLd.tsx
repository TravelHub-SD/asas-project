/** يطبع كتلة JSON-LD واحدة أو أكثر داخل الصفحة. */
export default function JsonLd({ data }: { data: Record<string, unknown>[] }) {
  return (
    <>
      {data.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
