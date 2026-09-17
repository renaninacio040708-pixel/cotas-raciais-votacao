const ICONS: Record<string, string> = {
  Users:
    '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  GraduationCap:
    '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12.5V17c0 1.5 2.5 3 6 3s6-1.5 6-3v-4.5"/><path d="M22 10v6"/>',
  Lightbulb:
    '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1v.2h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z"/>',
  Warning:
    '<path d="m10.3 3.5-8 14A2 2 0 0 0 4 20.5h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  Activity:
    '<path d="M22 12h-4l-3 9-6-18-3 9H2"/>',
};

const XICON_RE = /<x-icon\s+name="([A-Za-z]+)"\s+style="([^"]*)"[^>]*>\s*<\/x-icon>/g;

export function renderIcons(html: string): string {
  return html.replace(XICON_RE, (_match, name: string, style: string) => {
    const paths = ICONS[name];
    if (!paths) return "";
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${style}">${paths}</svg>`;
  });
}
