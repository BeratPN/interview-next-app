import FloatingButton from "@/components/FloatingButton";
import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import ProductTable from "../components/ProductTable";
import FloatingButtonWrapper from "@/components/FloatingButtonWrapper";

const products = [
  {
    id: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD__Cor0CO71-SMas7e3V_2Egb9wpic2Wd43K8kymv2zGMJxwfgva5ht0-4KQKE0z3buRH9UWphsIesofw6f6MtCp_jAzi4Jfz57ANiEMYXwFTUnuEygOJ616h3Nn-yrUXRJuQwOK46SnVbdAwOY72_7uAHBT9uYw3GKMB-odQIGFXPLNWcwIgjhuExYMmemWI10GHg6CIEiwH_Gm39f26G0EIbWjIVx04KKKJuXqkuw-DFA2tw5MB9UYsgszTc7-hVP7eqGLJsDjw",
    name: "Elegant Leather Handbag",
    category: "Accessories",
    price: "$150.00",
  },
  {
    id: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkFFpi62wXBpwXovLhOba4MJP9eRgstm7Xmu3Z-zm2qsr_yaKmaFpa4mSQJcWpN2FkwpAEgq6hElnbltSMkthtF0W92PcKMV1zxxLJlfhSBqrz51uT-gwvUZxj1izbYgXiQ96kX3emUsfodzg-KWsobAg4ie3u32y_C22e3Bl6pjfvJoIfm9Cfz-Ae2MFrrb_m3Q2F1KF3htH4diu6OV9OCzxof11gJk3ii-3tj4jyVOQ-7X_mT69OB_m4ghTw4S2HJc9jL1R0U-M",
    name: "Classic Denim Jeans",
    category: "Clothing",
    price: "$80.00",
  },

];

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{ padding: "1rem 2rem" }}>
        <PageHeader />
        <ProductTable products={products} />
        <FloatingButtonWrapper />
      </main>
    </div>
  );
}
