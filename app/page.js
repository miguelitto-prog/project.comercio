import Link from "next/link";
import { supabase } from "../lib/supabase";

export const revalidate = 60;

function formataPreco(valor) {
  return Number(valor).toFixed(2).replace(".", ",");
}

function formataData(data) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

export default async function Home() {
  const { data: ofertas, error } = await supabase
    .from("ofertas_publicas")
    .select("*")
    .order("criado_em", { ascending: false });

  return (
    <main className="page">
      <header>
        <span className="eyebrow">Vassouras, RJ</span>
        <h1>Ofertas de hoje</h1>
      </header>

      <div className="list">
        {error && (
          <p className="error">Não foi possível carregar as ofertas agora.</p>
        )}
        {!error && ofertas?.length === 0 && (
          <p className="empty">Nenhuma oferta ativa no momento.</p>
        )}
        {ofertas?.map((oferta) => (
          <article key={oferta.id} className="card">
            <div className="card-top">
              <span className="loja-nome">{oferta.loja_nome}</span>
              {oferta.categoria && (
                <span className="categoria-tag">{oferta.categoria}</span>
              )}
            </div>
            <p className="produto">{oferta.produto}</p>
            <div className="precos">
              <span className="preco">R$ {formataPreco(oferta.preco)}</span>
              {oferta.preco_anterior && (
                <span className="preco-anterior">
                  R$ {formataPreco(oferta.preco_anterior)}
                </span>
              )}
            </div>
            <div className="card-bottom">
              <span className="validade">
                Válido até {formataData(oferta.validade_ate)}
              </span>
              <Link href={`/loja/${oferta.loja_id}`}>Ver loja →</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
