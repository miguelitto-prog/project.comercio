import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { statusLoja } from "../../../lib/horario";

function formataPreco(valor) {
  return Number(valor).toFixed(2).replace(".", ",");
}

function formataData(data) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
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
        <div style={{ padding: 20 }}>
          <Link href="/" className="voltar">
            ← Voltar
          </Link>
          <p>Loja não encontrada.</p>
        </div>
      </main>
    );
  }

  const whatsappHref = loja.whatsapp
        ? "https://wa.me/" + loja.whatsapp.replace(/\D/g, "")
        : null;

  const status = statusLoja(loja.horario);

  return (
    <main className="page">
      <div className="loja-foto">
        <span>[Foto da loja]</span>
        <Link href="/" aria-label="Voltar para ofertas" className="voltar-btn">
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1E2A1F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
        </Link>
      </div>

      <div className="loja-conteudo">
        <div>
          <div className="loja-titulo-linha">
            <h1>{loja.nome}</h1>
            {loja.categorias?.nome && (
              <span className="categoria-tag">{loja.categorias.nome}</span>
            )}
          </div>
          {status && (
            <div className="status-linha">
              <span
                aria-hidden="true"
                className={
                  status.aberta
                    ? "status-dot status-dot-aberta"
                    : "status-dot status-dot-fechada"
                }
              ></span>
              <span
                className={
                  status.aberta
                    ? "status-texto-aberta"
                    : "status-texto-fechada"
                }
              >
                {status.aberta ? "Aberto agora" : status.texto}
              </span>
              {status.aberta && (
                <span className="status-extra">· {status.texto}</span>
              )}
            </div>
          )}
        </div>

        {(loja.endereco || loja.horario) && (
          <div className="info-card">
            {loja.endereco && (
              <div className="info-linha">
                <svg
                  aria-hidden="true"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5B6058"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{loja.endereco}</span>
              </div>
            )}
            {loja.horario && (
              <div className="info-linha">
                <svg
                  aria-hidden="true"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5B6058"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 3"></path>
                </svg>
                <span>{loja.horario}</span>
              </div>
            )}
          </div>
        )}

        <div className="ofertas-secao">
          <h2>Ofertas ativas</h2>
          {(!ofertas || ofertas.length === 0) && (
            <p className="empty">Nenhuma oferta ativa agora.</p>
          )}
          {ofertas?.map((oferta) => (
            <div key={oferta.id} className="oferta-mini">
              <div className="oferta-mini-info">
                <p>{oferta.produto}</p>
                <span>Válido até {formataData(oferta.validade_ate)}</span>
              </div>
              <div className="oferta-mini-precos">
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
      </div>

      {whatsappHref && (
        <div className="whatsapp-bar">
          <a className="whatsapp-btn" href={whatsappHref}>
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      )}
    </main>
  );
}
