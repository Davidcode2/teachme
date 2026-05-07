import type { KcContext } from "../KcContext";

export function LocaleSelect(props: { kcContext: KcContext }) {
  const { kcContext } = props;
  const { realm, locale } = kcContext;

  if (!realm.internationalizationEnabled || !locale || locale.supported.length <= 1) {
    return null;
  }

  return (
    <select
      className="auth-select"
      aria-label="Sprache"
      defaultValue={locale.currentLanguageTag}
      onChange={event => {
        const target = locale.supported.find(({ languageTag }) => languageTag === event.currentTarget.value);
        if (target) {
          window.location.href = target.url;
        }
      }}
    >
      {locale.supported.map(({ languageTag, label }) => (
        <option key={languageTag} value={languageTag}>
          {label}
        </option>
      ))}
    </select>
  );
}
