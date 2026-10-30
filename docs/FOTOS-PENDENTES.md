# Mapeamento Interno de Fotos — Delfos Solar

> **Aviso:** Este documento é de controle interno da equipe e do proprietário do site. Ele **não é exibido publicamente** aos visitantes. Serve como roteiro para upload e substituição futura das fotos no painel administrativo (`/admin`) ou no acervo de mídia do PocketBase.

---

## 1. Visão Geral

Todos os placeholders públicos com etiquetas do tipo _"Foto real — aguardando"_, _"pendente"_ ou _"Mapa Oficial"_ foram removidos da interface pública do site, em conformidade com a decisão da diretoria.

Quando não há foto real cadastrada ou sincronizada, o site exibe automaticamente um **visual elegante da marca Delfos** (`#081B30` com padrão geométrico de engenharia e gradientes azul `#00E5FF`, verde `#10B981` e âmbar `#F59E0B`), mantendo rigorosamente a proporção de layout, responsividade e dados técnicos sem qualquer mensagem de pendência.

Abaixo está o inventário de cada ponto do site que aguarda foto fotográfica futura ou que já possui foto homologada.

---

## 2. Catálogo de Cases de Portfólio (`src/data/cases.ts` e PocketBase coleção `cases`)

| ID do Case                    | Título / Cliente                   | Setor                  | Potência / Capacidade     | Estado Atual da Foto                                            | Ação Recomendada para o Dono                                                   |
| ----------------------------- | ---------------------------------- | ---------------------- | ------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `case-cassul-erechim`         | Cassul Distribuidora               | Comércio e Serviços    | 155,0 kWp                 | ✅ **Foto real sincronizada** (`DJI_0120.jpg`)                  | Nenhuma ação necessária.                                                       |
| `case-clanel-erechim`         | Clanel Indústria e Comércio        | Indústria              | 123,5 kWp                 | ✅ **Foto real sincronizada** (`DJI_0075.jpg` / `clanel_...`)   | Nenhuma ação necessária.                                                       |
| `case-garcia-passo-fundo`     | Panificadora Garcia                | Comércio e Serviços    | 112,5 kWp                 | ✅ **Foto real sincronizada** (`DJI_0047.jpg`)                  | Nenhuma ação necessária.                                                       |
| `case-silo-erebango`          | Silo de Grãos Erebango             | Agronegócio            | 76,16 kWp                 | ✅ **Foto real sincronizada** (`DJI_0023.jpg`)                  | Nenhuma ação necessária.                                                       |
| `case-posto-severiano`        | Posto Caminho do Mercosul          | Comércio e Serviços    | 54,9 kWp                  | ✅ **Foto real sincronizada** (`DJI_0068.jpg`)                  | Nenhuma ação necessária.                                                       |
| `case-solo-erechim`           | Usina de Solo Erechim              | Investidores e Usinas  | 40,8 kWp                  | ✅ **Foto real sincronizada** (`WhatsApp-Image-2019-12-11...`)  | Nenhuma ação necessária.                                                       |
| `case-residencia-erechim`     | Residência Urbana                  | Residências            | 6,48 kWp                  | ✅ **Foto real sincronizada** (`DJI_0029...`)                   | Nenhuma ação necessária.                                                       |
| `case-ordenha-cotegipe`       | Pecuária de Leite                  | Agronegócio            | 18,5 kWp                  | ✅ **Foto real sincronizada** (`1-3.jpg`)                       | Nenhuma ação necessária.                                                       |
| `case-system-carport`         | System Desenvolvimento de Software | Indústria / Carport    | 25,0 kWp Carport          | ✅ **Foto real sincronizada** (`DJI_0001.jpg`)                  | Nenhuma ação necessária.                                                       |
| `case-ervateira-bazia`        | Ervateira Bazia                    | Agronegócio            | 93,5 kWp                  | ✅ **Foto real sincronizada** (`WhatsApp-Image-2022-08-12...`)  | Nenhuma ação necessária.                                                       |
| `case-dal-pra-moveis`         | Dal Pra Móveis                     | Indústria              | 74,43 kWp                 | 🟡 Foto ilustrativa de alta resolução                           | Substituir por foto de drone do telhado da Dal Pra via `/admin`.               |
| `case-aviario-erebango`       | Aviário Climatizado Erebango       | Agronegócio            | 42,16 kWp                 | 🟡 Foto ilustrativa de alta resolução                           | Inserir foto do aviário em Erebango quando disponível.                         |
| `case-garagem-transporte`     | Spazzini Tur                       | Frotas e Logística     | 32,16 kWp                 | 🟡 Foto ilustrativa de alta resolução                           | Inserir foto da garagem Spazzini em Erechim.                                   |
| `case-metalurgica-erechim`    | Metalúrgica Alto Uruguai           | Indústria              | 27,5 kWp                  | 🟡 Foto ilustrativa de alta resolução                           | Inserir foto aérea da cobertura metálica.                                      |
| `case-loja-calcados`          | Calçados Central                   | Comércio e Serviços    | 22,0 kWp                  | 🟡 Foto ilustrativa de alta resolução                           | Inserir foto do showroom comercial.                                            |
| `case-mercado-passo-fundo`    | Mercado Regional Planalto          | Comércio e Serviços    | 48,0 kWp                  | 🟡 Foto ilustrativa de alta resolução                           | Inserir foto da cobertura do supermercado.                                     |
| `case-condominio-notabile`    | Condomínio Residencial Notabile    | Condomínios            | 32,0 kWp                  | ✅ **Foto real sincronizada** (`Captura-de-tela-2025-12-18...`) | Opcional: substituir por foto fotográfica aérea sem corte.                     |
| `case-condominio-lyon`        | Condomínio Edifício Lyon           | Condomínios            | 16,5 kWp                  | ✅ **Foto real sincronizada** (`DJI_0001.jpg`)                  | Nenhuma ação necessária.                                                       |
| `case-agro-indra`             | Indra Agropecuária                 | Agronegócio            | 62,0 kWp                  | ✅ **Foto real sincronizada** (`Imagem-3-1.jpg`)                | Nenhuma ação necessária.                                                       |
| `case-bess-industria-recorte` | Indústria Metalmecânica            | Indústria              | 450 kWp + 250 kWh         | 🔷 **Sem foto (Visual Delfos BESS)**                            | Fotografar o gabinete BESS LiFePO4 instalado na fábrica.                       |
| `case-condominio-dlm`         | Condomínio Parque das Araucárias   | Condomínios            | 6 Wallboxes + DLM         | 🔷 **Sem foto (Visual Delfos DLM)**                             | Fotografar as vagas com estações Wallbox e eletrocalhas.                       |
| `case-agro-avicultura`        | Granja Avícola do Vale             | Agronegócio            | 75 kWp + 80 kWh           | 🔷 **Sem foto (Visual Delfos Agro)**                            | Fotografar a usina de solo integrada ao abrigo de baterias.                    |
| `case-residencia-alto-padrao` | Residência Jardim América          | Residências            | 12,5 kWp                  | 🔷 **Sem foto (Visual Delfos Residencial)**                     | Fotografar telhado cerâmico de alto padrão com microinversores.                |
| `case-usina-solo-investidor`  | Agroinvest Usinas S/A              | Investidores e Usinas  | 300 kWp Solo              | 🔷 **Sem foto (Visual Delfos Usina)**                           | Fotografar as fileiras da usina de solo com cerca e SPDA.                      |
| `case-om-recuperacao-usina`   | Centro Logístico Gaúcho            | O&M Especializado      | 120 kWp O&M               | 🔷 **Sem foto (Visual Delfos O&M)**                             | Inserir foto de sobrevoo de drone com câmera térmica.                          |
| `case-frota-eletroposto`      | Transportadora Rápido Sul          | Frotas e Eletropostos  | 2x DC 60 kW + 4x AC 22 kW | 🔷 **Sem foto (Visual Delfos Frotas)**                          | Fotografar o hub de recarga rápida coberto com os furgões/caminhões.           |
| `case-hospital-continuidade`  | Complexo Hospitalar Regional       | Energia Crítica / BESS | 120 kWh BESS              | 🔷 **Sem foto (Visual Delfos Hospitalar)**                      | Fotografar a sala técnica climatizada com os gabinetes.                        |
| `case-usina-solo-pendente`    | Complexo Agroindustrial 1,2 MWp    | Investidores e Usinas  | 1,2 MWp Solo              | 🔷 **Sem foto (Visual Delfos 1,2 MWp)**                         | Fotografar o parque de solo de 1,2 MWp após encerramento do ciclo de 12 meses. |

---

## 3. Páginas Institucionais e Seções Específicas

### 3.1. Página "Sobre a Delfos" (`/sobre` — `src/pages/Sobre.tsx`)

1. **Quadro Sede Técnica e Operacional em Erechim/RS**
   - **Localização:** Seção _"História e Estrutura"_ (ao lado de Filosofia Operacional).
   - **Estado Atual:** Visual da marca Delfos em `#081B30` com ícone institucional e endereço (`Rua Espírito Santo, 275 • Fátima, Erechim/RS`).
   - **Necessidade:** Foto real da fachada da sede da Delfos em Erechim ou do laboratório interno de monitoramento.
2. **Quadro Mapa de Cobertura Regional (RS, SC, PR)**
   - **Localização:** Seção _"Presença Regional — Atuação em todo o Sul do Brasil"_.
   - **Estado Atual:** Visual elegante da marca com malha de usinas e destaque dos polos de atendimento.
   - **Necessidade:** Mapa oficial diagramado ou foto aérea panorâmica dos polos de atendimento nos três estados.

### 3.2. Página Inicial e Seções de Soluções da Home

1. **Destaque da Home (`src/components/CaseDestaque.tsx`)**
   - **Case:** _Indra Sistemas e Engenharia (Erechim/RS — 125 kWp)_.
   - **Estado Atual:** Visual de engenharia da marca Delfos (`#081B30`, 125 kWp, Operação RGE).
   - **Necessidade:** Foto real da usina comercial da Indra em Erechim, ou vincular a foto do case Indra já existente no banco.
2. **Seção BESS na Home (`src/components/SecaoBess.tsx`)**
   - **Localização:** Bloco inferior de callout do BESS industrial.
   - **Estado Atual:** Visual de engenharia Delfos BESS LiFePO4 com selo ART CREA-RS.
   - **Necessidade:** Foto real de gabinete externo IP55 de baterias com inversores híbridos.
3. **Seção Carregadores na Home (`src/components/SecaoCarregadores.tsx`)**
   - **Localização:** Bloco inferior de callout DLM em garagens.
   - **Estado Atual:** Visual de engenharia Delfos DLM com norma NBR 17019.
   - **Necessidade:** Foto real de carregadores Wallbox instalados em condomínio ou garagem de frota.

### 3.3. Páginas de Segmentos (`/segmentos/*` — `src/components/segmentos/SegmentoPageLayout.tsx`)

- **Comportamento:** O topo exibe a foto do **primeiro case real com foto** daquele segmento. Quando um segmento não tem case cadastrado com foto no banco, exibe o cartão elegante _"Engenharia Consultiva Delfos em [Segmento]"_.
- **Ação:** Cadastrar ao menos 1 foto real para cada segmento no `/admin`:
  - Agronegócio (já tem fotos reais: Silo Erebango, Ervateira Bazia, Indra)
  - Comércio e Serviços (já tem fotos reais: Cassul, Panificadora Garcia, Posto Mercosul)
  - Indústria (já tem fotos reais: Clanel, Dal Pra, System)
  - Condomínios (já tem fotos reais: Notabile, Lyon)
  - Residências (já tem foto real: Residência Urbana)
  - Investidores (já tem foto real: Usina Solo Erechim)
  - Frotas e Eletropostos (pode receber fotos dedicadas de recarga rápida DC)

---

## 4. Como o Dono do Site Deve Inserir as Fotos

1. Acesse o painel administrativo em: `https://.../admin` (ou `/admin` no seu domínio).
2. Faça login com as credenciais administrativas.
3. Na aba **Cases de Portfólio**:
   - Para atualizar um case existente, clique em **Editar**.
   - No campo **Foto da Usina**, faça o upload do arquivo em alta resolução (preferencialmente formato horizontal 16:9, JPG/PNG/WebP, de 1600px a 1920px de largura).
   - Salve as alterações. O site atualizará automaticamente o cartão, o modal de detalhes e os destaques.
4. Para fotos sincronizadas automaticamente do acervo histórico: utilize o botão **"Sincronizar Fotos Delfos"** na aba Mídia do painel `/admin`.
