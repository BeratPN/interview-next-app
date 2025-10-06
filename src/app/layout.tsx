import './globals.scss';

export const metadata = {
  title: 'Product Management',
  description: 'Mülakat test uygulaması',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
