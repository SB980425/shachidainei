type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <span className={compact ? "brand-lockup brand-lockup-compact" : "brand-lockup"}>
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path className="brand-symbol-field" d="M8 8h32v32H8z" />
          <path className="brand-symbol-line" d="M15 31h18M15 17h9m0 0 9 14m-9-14v14" />
          <circle className="brand-symbol-node brand-symbol-node-blue" cx="15" cy="31" r="3.2" />
          <circle className="brand-symbol-node brand-symbol-node-green" cx="24" cy="17" r="3.2" />
          <circle className="brand-symbol-node brand-symbol-node-coral" cx="33" cy="31" r="3.2" />
        </svg>
      </span>
      <span className="brand-text">
        <strong>AgentSiteOps</strong>
        {!compact ? <small>Offer. Page. Outreach. Validate.</small> : null}
      </span>
    </span>
  );
}
