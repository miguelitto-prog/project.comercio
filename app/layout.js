import "./globals.css";

export const metadata = {
  title: "Comércio Local Vassouras",
  description: "Ofertas do dia dos mercados, açougues e lojas de Vassouras",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
