export const metadata = {
  title: 'DGFlow — Plataforma de gestão (CRM) para agências e profissionais de marketing',
  description: 'CRM completo para agências e freelancers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
