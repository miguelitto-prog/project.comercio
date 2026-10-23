"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { statusLoja } from "../lib/horario";

const CORES_CATEGORIA = {
  Mercado: "#2F6B4F",
  Acougue: "#B3472E",
  Hortifruti: "#C98A2C",
  Padaria: "#8A6A3E",
  Farmacia: "#2E6B8A",
};
const COR_PADRAO = "#5B6058";

function formataPreco(valor) {
  return Number(valor).toFixed(2).replace(".", ",");
}

function formataData(data) {
  return new Date(data + "T00:00:00").toLocaleDateString("pt-BR");
}

export default function OfertasList({ ofertas, erro }) {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  const categorias = useMemo(() => {
    const unicas = new Set(
      (ofertas || []).map((o) => o.categoria).filter(Boolean)
    );
    return ["Todos", ...unicas];
  }, [ofertas]);

  const ofertasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (ofertas || []).filter((o) => {
      const bateCategoria =
        categoriaAtiva === "Todos" || o.categoria === categoriaAtiva;
      const bateBusca =
        !termo ||
        o.produto?.toLowerCase().includes(termo) ||
        o.loja_nome?.toLowerCase().includes(termo);
      return bateCategoria && bateBusca;
    });
  }, [ofertas, busca, categoriaAtiva]);

  return (
    <>
      <header className="topo">
        <span className="eyebrow">Vassouras, RJ</span>
        <h1>Ofertas de hoje</h1>
      </header>

      <div className="busca-wrap">
        <label htmlFor="busca" className="visually-hidden">
          Buscar produto ou loja
        </label>
        <div className="busca-box">
          <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5B6058"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            id="busca"
            type="search"
            placeholder="Buscar produto ou loja"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="filtros">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            aria-pressed={categoriaAtiva === categoria}
            className={
              categoriaAtiva === categoria ? "pill pill-ativo" : "pill"
            }
            onClick={() => setCategoriaAtiva(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="list">
        {erro && (
          <p className="error">Nao foi possivel carregar as ofertas agora.</p>
        )}
        {!erro && ofertasFiltradas.length === 0 && (
          <p className="empty">
            {ofertas && ofertas.length > 0
              ? "Nenhuma oferta encontrada para esse filtro."
              : "Nenhuma oferta ativa no momento."}
          </p>
        )}
        {ofertasFiltradas.map((oferta) => {
          const status = statusLoja(oferta.horario);
          const cor = CORES_CATEGORIA[oferta.categoria] || COR_PADRAO;
          return (
            <article key={oferta.id} className="card">
              <div className="card-top">
                <span className="loja-nome">
                  <span
                    aria-hidden="true"
                    className="ponto-categoria"
                    style={{ background: cor }}
                  ></span>
                  {oferta.loja_nome}
                </span>
                {status ? (
                  <span
                    className={
                      status.aberta ? "selo selo-aberta" : "selo selo-fechada"
                    }
                  >
                    {status.aberta ? "Aberto agora" : status.texto}
                  </span>
                ) : oferta.categoria ? (
                  <span className="categoria-tag">{oferta.categoria}</span>
                ) : null}
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
                  Valido ate {formataData(oferta.validade_ate)}
                </span>
                          <Link href={"/loja/" + oferta.loja_id}>Ver loja →</Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="bottom-nav-spacer"></div>
      <nav aria-label="Navegacao principal" className="bottom-nav">
        <div className="bottom-nav-inner">
          <a href="/" aria-current="page" className="nav-item nav-item-ativo">
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 11l9-7 9 7"></path>
              <path d="M5 10v9a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1v-9"></path>
            </svg>
            Inicio
          </a>
          <a href="#" className="nav-item">
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 8.6c0 5.1-8.8 10.2-8.8 10.2S3.2 13.7 3.2 8.6a4.8 4.8 0 0 1 8.8-2.6 4.8 4.8 0 0 1 8.8 2.6z"></path>
            </svg>
            Favoritos
          </a>
          <a href="#" className="nav-item">
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 20c1.6-3.6 5-5.5 8-5.5s6.4 1.9 8 5.5"></path>
            </svg>
            Perfil
          </a>
        </div>
      </nav>
    </>
  );
}
