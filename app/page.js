import { supabase } from "../lib/supabase";
import OfertasList from "../components/OfertasList";

export const revalidate = 60;

export default async function Home() {
  const { data: ofertas, error } = await supabase
    .from("ofertas_publicas")
    .select("*")
    .order("criado_em", { ascending: false });

  return (
    <main className="page">
      <OfertasList ofertas={ofertas || []} erro={!!error} />
    </main>
  );
}
