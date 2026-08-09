# $Agent (`cagent`) — Contextual & Personal Commerce Agent

> **Hackathon:** Agents for Commerce (Deco 2026)  
> **Trilha Principal:** Search & Discovery / SEO, GEO & Agentic Commerce  
> **Objetivo:** Transformar a busca genérica em uma **personalização real baseada em contexto estendido do cliente e das lojas**, fazendo a loja **vender mais** e **rodar por menos**.

---

## ⚡ Estratégia do Hackathon: Turnkey Bootstrap & Navegação Mockada

Para a apresentação do Hackathon e demonstração de pitch em tempo recorde, o projeto foi concebido como um **Boilerplate / Bootstrap de Plataforma Agêntica Turnkey**:

* **Navegação Hiper-Realista Sem Backend Pesado:** A aplicação entrega uma experiência interativa completa (Web + App Mobile Expo) alimentada por motores de contexto e regras locais (`MOCK_STORE_CONTEXT`, `runLocalRuleEngine`), sem necessidade de provisionamento prévio de infraestrutura complexa.
* **Demonstração Fim a Fim com Perfil Real:** A navegação é pré-povoada com o contexto real do usuário **Pedro França** (tamanho M, calçado 41, torcedor do Fluminense FC, praticante de futebol e corrida de rua).
* **Pronto para Conectar (Fork & Connect Ready):** Qualquer e-commerce ou lojista da rede Deco pode forkar este repositório e conectar suas APIs reais de catálogo, inventário e banco de dados simplesmente substituindo os adaptadores em `packages/shared/src/mocks.ts` e `api/agent.ts`.

---

## 💡 O Problema
No e-commerce tradicional de alto volume, a personalização é passiva e fragmentada:
* O consumidor é forçado a preencher preferências e ajustar filtros manuais (tamanho, cor, faixa de preço, ocasião) em **cada nova loja** que visita.
* As lojas não compartilham contexto nem entendem a intenção real do comprador, gerando recomendações genéricas, abandono de busca e perda de conversão.

---

## 🚀 A Solução: $Agent (`cagent`)
O **`$Agent`** atua como uma ponte de inteligência contextual entre o usuário e as storefronts. Ele centraliza as preferências, histórico e perfil do cliente, aplicando "filtros inteligentes" em tempo real para qualquer loja integrada à rede Deco.

![Arquitetura $Agent — Hackathon Deco](cagent.png)

---

## 🎯 Pilares e Pontos Fortes

### 1. 🔍 Search & Discovery (Busca & Recomendação)
* **Busca Contextual:** Entendimento semântico da intenção de busca via LLM.
* **Autocomplete Inteligente:** Sugestões em tempo real baseadas no perfil do cliente.
* **Ordenação de Vitrine (PLP):** Reordenação dinâmica de produtos conforme gostos, tamanho e orçamento.
* **Recomendações Pessoais:** Sugestões hiper-personalizadas na primeira dobra da tela.

### 2. ⚔️ Batalha de Atributos & Comparador de Produtos
* **Espadas Cruzadas (`Swords`):** Comparação lado a lado de produtos com análise de especificações, recomendação agêntica por IA e raio-X de compatibilidade.

### 3. 🛒 Carrinho & Checkout em 1-Clique com Cashback
* **Fluxo de Conversão Acelerado:** Gestão de quantidades, cupom promocional ativo (`DECO10`), cálculo imediato de cashback e finalização instantânea.

### 4. 🔗 Compartilhamento Agêntico via WhatsApp & QR Code
* **Links Contextuais & QR Code Expo:** Compartilhamento de recomendações personalizadas com amigos via WhatsApp ou escaneamento direto para o aplicativo celular.

---

## 🏗️ Arquitetura Híbrida / Monorepo (Web + Mobile App)

O repositório adota uma **arquitetura híbrida modular (Monorepo)** que compartilha a inteligência do agente, os tipos do TypeScript e a lógica de contexto entre as plataformas Web e Mobile:

```
cagent/
├── apps/
│   ├── web/        # Storefront Web (React + Vite + TailwindCSS)
│   └── mobile/     # App Mobile (React Native + Expo)
├── api/            # Serverless Functions (Vercel + Google Gemini API)
├── packages/
│   └── shared/     # Tipos (UserProfiles, StoreContext), schemas e Engine do Agente
├── docs/           # Guias e especificações internas (oculto no git local)
└── cagent.png      # Diagrama de Arquitetura
```

---

## 🏬 Módulo Plug & Play / White-Label (MVP Reutilizável)
O repositório foi desenvolvido como uma **solução open-source templatizada** para que qualquer loja possa copiar e reutilizar:
* **Fork & Go:** Estrutura modular pronta para ser copiada ou forkada por qualquer comerciante.
* **Multi-Plataforma (Web & Expo Mobile):** Suporte tanto a storefront Web quanto ao aplicativo Mobile via **Expo**.
* **Estilização Ágil (TailwindCSS):** Interface desenvolvida com **Vite + TailwindCSS** (Web) e compatível com **Expo** (Mobile).
* **Conectividade de Dados & Vercel Deploy:** Deploy em 1 clique na Vercel com Serverless Functions (`/api`), conectando qualquer banco de dados, inventário ou API de catálogo via variáveis de ambiente (`.env`) e adaptadores.

---

## 📈 Impacto de Negócio (ROI)

* 🟢 **Vender Mais:** Aumento da taxa de conversão (Search-to-Cart) através da entrega imediata do produto certo.
* 🟢 **Rodar por Menos:** Eficiência operacional via automação no enriquecimento de catálogo e atendimento por agente.
* 🟢 **Redução de Abandono:** Eliminação de buscas sem resultado ou navegação irrelevante.
* 🟢 **LTV & Retenção:** Experiência de compra fluida que fideliza o consumidor na plataforma.

---

## 🛠️ Arquitetura e Tecnologias

* **Web Storefront:** React (TypeScript) + **Vite** + **TailwindCSS**
* **Mobile App:** React Native com **Expo**
* **Shared Core:** Tipos compartilhados, Schemas de `UserProfile` e Orquestrador do Agente (BYOK Adapter Strategy)
* **Agente / Back-end:** Node.js (TypeScript) + **BYOK Architecture** (Google Gemini API como padrão do MVP + suporte a OpenAI / Anthropic) via Vercel Serverless Functions (`/api`)
* **Hosting & Deploy:** **Vercel** (Web + APIs Serverless) + **Expo Application Services / GCP**

---

## ⚙️ Como Rodar o Projeto Localmente

### Pré-requisitos
* Node.js >= 18.x
* npm ou yarn
* Expo CLI (`npx expo`) para o app mobile

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/pedroffeitosa/cagent.git
   cd cagent
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Configuração de Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Adicione a sua chave da Gemini API:
   ```env
   GEMINI_API_KEY=seu_api_key_aqui
   ```

4. **Executar as Aplicações:**
   - **Web (Vite):** `npm run dev:web`
   - **Mobile (Expo):** `npm run dev:mobile`

---

## 📄 Licença

Este projeto é disponibilizado sob a licença **MIT** — permitindo livre uso, cópia, modificação, fork, redistribuição e integração comercial por qualquer loja ou desenvolvedor. Veja o arquivo [LICENSE](file:///home/jp/gh/cagent/LICENSE) para o texto completo.

---

*Desenvolvido para o Hackathon Agents for Commerce — Deco (2026).*
