import Link from "next/link";
import { supabase } from "../../../lib/supabase";

function formataPreco(valor) {
  return Number(valor).toFixed(2).replace(".", ",");
}

export default async function LojaPage({ params }) {
  const { id } = params;

  const { data: loja } = await supabase
    .from("lojas")
    .select("*, categorias(nome)")
    .eq("id", id)
    .single();

  const { data: ofertas } = await supabase
    .from("ofertas_publicas")
    .select("*")
    .eq("loja_id", id);

  if (!loja) {
    return (
      <main className="page">
        <p>Loja não encontrada.</p>
        <Link href="/">Voltar</Link>
      </main>
    );
  }

  const whatsappHref = loja.whatsapp
    ? `https://wa.me/${loja.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <main className="page">
      <Link href="/" className="voltar">
        ← Voltar
      </Link>
      <h1>{loja.nome}</h1>
      {loja.categorias?.nome && (
        <span className="categoria-tag">{loja.categorias.nome}</span>
      )}
      {loja.endereco && <p>{loja.endereco}</p>}
      {loja.horario && <p>{loja.horario}</p>}

      <h2>Ofertas ativas</h2>
      <div className="list">
        {(!ofertas || ofertas.length === 0) && (
          <p className="empty">Nenhuma oferta ativa agora.</p>
        )}
        {ofertas?.map((oferta) => (
          <div key={oferta.id} className="card">
            <p className="produto">{oferta.produto}</p>
            <div className="precos">
              <span className="preco">R$ {formataPreco(oferta.preco)}</span>
              {oferta.preco_anterior && (
                <span className="preco-anterior">
                  R$ {formataPreco(oferta.preco_anterior)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {whatsappHref && (
        <a className="whatsapp-btn" href={whatsappHref}>
          Falar no WhatsApp
        </a>
      )}
    </main>
  );
}
