const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function expandirDias(trecho) {
  const limpo = trecho.trim().replace(/,$/, "");
  if (!limpo) return [];

  const partes = limpo.split(/\s+a\s+|\s*-\s*/);
  if (partes.length === 2) {
    const i0 = DIAS.indexOf(partes[0].trim().slice(0, 3));
    const i1 = DIAS.indexOf(partes[1].trim().slice(0, 3));
    if (i0 === -1 || i1 === -1) return [];
    const dias = [];
    let i = i0;
    while (true) {
      dias.push(i);
      if (i === i1) break;
      i = (i + 1) % 7;
    }
    return dias;
  }

  const i = DIAS.indexOf(limpo.slice(0, 3));
  return i === -1 ? [] : [i];
}

function extrairHoras(segmento) {
  const achados = [...segmento.matchAll(/(\d{1,2})[h:](\d{2})?/g)];
  if (achados.length < 2) return null;
  const abre = parseInt(achados[0][1], 10) + parseInt(achados[0][2] || "0", 10) / 60;
  const fecha = parseInt(achados[1][1], 10) + parseInt(achados[1][2] || "0", 10) / 60;
  return { abre, fecha };
}

// Le um texto livre de horario de funcionamento (ex: "Seg a Sab, 7h as 20h")
// e tenta dizer se a loja esta aberta agora. Retorna null quando o formato
// nao e reconhecido, pra nunca mostrar um status errado.
export function statusLoja(horario, agora = new Date()) {
  if (!horario) return null;

  const texto = normalizar(horario);
  const segmentos = texto
    .split(/[·;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (segmentos.length === 0) return null;

  const diaAtual = agora.getDay();
  const horaAtual = agora.getHours() + agora.getMinutes() / 60;
  let algumSegmentoValido = false;

  for (const segmento of segmentos) {
    const primeiroDigito = segmento.search(/\d/);
    if (primeiroDigito === -1) continue;

    const dias = expandirDias(segmento.slice(0, primeiroDigito));
    const horas = extrairHoras(segmento);
    if (dias.length === 0 || !horas) continue;

    algumSegmentoValido = true;
    if (!dias.includes(diaAtual)) continue;

    const fechaH = Math.floor(horas.fecha);
    const fechaM = Math.round((horas.fecha % 1) * 60);
    const abreH = Math.floor(horas.abre);
    const abreM = Math.round((horas.abre % 1) * 60);

    if (horaAtual >= horas.abre && horaAtual < horas.fecha) {
      return {
        aberta: true,
        texto: "Fecha as " + fechaH + "h" + (fechaM ? String(fechaM).padStart(2, "0") : ""),
      };
    }
    return {
      aberta: false,
      texto: "Abre as " + abreH + "h" + (abreM ? String(abreM).padStart(2, "0") : ""),
    };
  }

  if (!algumSegmentoValido) return null;
  return { aberta: false, texto: "Fechado hoje" };
}
