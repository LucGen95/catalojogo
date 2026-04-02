type SectionHeaderProps = {
  title: string;
  linkLabel?: string;
};

export function SectionHeader({ title, linkLabel }: SectionHeaderProps) {
  return (
    <div className="sec-hd">
      <span className="sec-title">{title}</span>
      {linkLabel ? (
        <a href="#catalogo" className="sec-link">
          {linkLabel}
        </a>
      ) : null}
    </div>
  );
}
