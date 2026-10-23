# Comércio Local Vassouras

App que mostra as ofertas do dia dos mercados, açougues e lojas de Vassouras pros moradores.

## 1. Banco de dados

No painel do Supabase, abra o **SQL Editor** e rode o arquivo `comercio-local-schema.sql` (o que foi enviado separadamente). Isso cria as tabelas `lojas`, `ofertas`, `categorias`, `assinaturas` e a view pública `ofertas_publicas`.

## 2. Subir o código

No repositório `project.comercio` no GitHub, suba todos os arquivos desse projeto mantendo a mesma estrutura de pastas (incluindo a pasta `app/loja/[id]/`).

## 3. Publicar na Vercel

1. Acesse vercel.com/new e importe o repositório `project.comercio`.
2. Em **Settings → Environment Variables**, adicione as duas variáveis do arquivo `.env.local.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Clique em **Deploy**.

## 4. Testar com uma loja e uma oferta de verdade

Ainda não existe painel para cadastrar (isso é o próximo passo). Por enquanto, insira direto no Supabase, na aba **Table Editor**:

1. Na tabela `lojas`: crie uma linha com `nome`, `categoria_id` (copie o `id` de uma linha da tabela `categorias`) e `status` = `ativa`.
2. Na tabela `ofertas`: crie uma linha com `loja_id` (o `id` da loja criada acima), `produto`, `preco`, `validade_ate` (uma data futura) e `status` = `aprovada`.
3. Abra o site publicado pela Vercel — a oferta deve aparecer na tela inicial.

## O que falta (próximas etapas)

- Painel da loja, pra cadastrar e editar ofertas sem precisar abrir o Supabase diretamente.
- Leitura automática de fotos de encarte enviadas por WhatsApp, usando IA pra extrair produto/preço/validade.
- Filtro por categoria e busca funcionando na tela inicial.
