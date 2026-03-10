# Documento de Configuração de CI/CD e Estratégia de Branches - Repositório jardelguimaraes-site

## 1. Visão Geral

Este documento detalha a arquitetura de Integração Contínua (CI) e Entrega Contínua (CD) implementada no repositório `jardelguimaraes/jardelguimaraes-site`. O objetivo é garantir um processo de desenvolvimento seguro, controlado e automatizado, separando os ambientes de teste e produção e utilizando automações via GitHub Actions para validação e publicação.

## 2. Estratégia de Branches (Ramos)

Adotamos uma estratégia de Git Flow simplificada com duas branches principais e protegidas, cada uma com um propósito distinto:

-   **`main`**: Esta é a branch de **produção**. O código nesta branch reflete o conteúdo que está **ao vivo** para os usuários no site principal.
-   **`teste-ui`**: Esta é a branch de **homologação/staging**. Ela serve como um ambiente de pré-produção. Todas as novas funcionalidades, correções e alterações devem ser integradas aqui *antes* de irem para a `main`.

Branches de funcionalidades (`feature/*`), correções (`fix/*`), etc., devem ser criadas a partir da `teste-ui` e propostas para integração de volta nela através de Pull Requests.

## 3. Regras de Proteção de Branch

As regras de proteção foram configuradas na interface do GitHub para garantir a integridade das branches principais.

**Localização:** `Repositório > Settings > Branches`

-   **Regra para `main`:**
    -   **Exigir Pull Request (PR) antes de mesclar:** É impossível enviar commits diretamente (`git push`) para a `main`. Todas as alterações devem passar por um processo de revisão formalizado por uma PR.
    -   **Exigir aprovação de status checks:** A PR só pode ser mesclada se todos os processos de automação (como a build e o deploy do workflow) forem concluídos com sucesso. Isso impede que código quebrado chegue à produção.

-   **Regra para `teste-ui`:**
    -   **Exigir Pull Request (PR) antes de mesclar:** Garante que todo o código enviado para o ambiente de teste seja revisado. Isso incentiva a criação de branches de curta duração para cada tarefa, que é uma boa prática.

## 4. Automação com GitHub Actions (CI/CD)

Dois workflows de automação foram configurados para gerenciar o ciclo de vida do deploy.

**Localização:** Diretório `.github/workflows/` no repositório.

### 4.1. Workflow 1: Preview de Pull Requests

-   **Arquivo:** `.github/workflows/firebase-hosting-pull-request.yml`
-   **Gatilho (Trigger):** Executado sempre que um **Pull Request** é aberto ou atualizado com novos commits, tendo como alvo a branch `main` ou `teste-ui`.
-   **Objetivo:** Criar um ambiente de **preview (pré-visualização) temporário e exclusivo** para cada PR.
-   **Passos Principais:**
    1.  **Checkout:** Clona o código da branch da PR.
    2.  **Build:** Executa os comandos `npm ci` (para instalar as dependências de forma limpa) e `npm run build` (para compilar o site).
    3.  **Deploy no Firebase Hosting:**
        -   Utiliza a action `FirebaseExtended/action-hosting-deploy@v0`.
        -   Faz o deploy em um "canal" de preview dinâmico no Firebase (`channelId: preview-${{ github.event.number }}`).
        -   Após o deploy, a action automaticamente posta um comentário na PR com a **URL exclusiva** daquele preview, permitindo a revisão visual das alterações em um ambiente real.

### 4.2. Workflow 2: Deploy em Produção

-   **Arquivo:** `.github/workflows/firebase-hosting-main.yml`
-   **Gatilho (Trigger):** Executado sempre que um **push** (neste caso, um merge de PR) ocorre na branch `main`.
-   **Objetivo:** Publicar a versão final e aprovada do site no ambiente de **produção**.
-   **Passos Principais:**
    1.  **Checkout:** Clona o código da branch `main`.
    2.  **Build:** Executa `npm ci` e `npm run build`.
    3.  **Deploy no Firebase Hosting:**
        -   Utiliza a mesma action de deploy do Firebase.
        -   Faz o deploy para o canal `live`, que corresponde ao site principal (produção).

## 5. Fluxo de Trabalho do Desenvolvedor (Passo a Passo)

1.  **Sincronizar:** Garanta que sua cópia local das branches `main` e `teste-ui` esteja atualizada (`git pull origin main`, `git pull origin teste-ui`).
2.  **Criar uma Nova Branch:** Crie uma branch de trabalho a partir da `teste-ui`. Ex: `git checkout -b feature/adiciona-nova-secao`.
3.  **Desenvolver:** Realize as alterações e commits necessários na nova branch.
4.  **Enviar a Branch:** Envie sua branch de trabalho para o repositório remoto: `git push origin feature/adiciona-nova-secao`.
5.  **Abrir Pull Request (PR) para Teste:** No GitHub, abra uma Pull Request da sua branch (`feature/adiciona-nova-secao`) para a branch `teste-ui`.
6.  **Revisão e Preview:**
    -   O GitHub Actions será acionado automaticamente.
    -   Aguarde o comentário com a **URL de preview**.
    -   Clique na URL e valide se as alterações estão corretas no ambiente de preview.
7.  **Aprovar e Mesclar na Teste:** Se tudo estiver correto, mescle a PR na branch `teste-ui`.
8.  **Abrir Pull Request (PR) para Produção:** No GitHub, abra uma **nova** Pull Request, desta vez da `teste-ui` para a `main`.
9.  **Deploy Final:**
    -   A PR mostrará um resumo de todas as alterações que estão indo para produção.
    -   Após a aprovação e o merge desta segunda PR na `main`, o workflow de produção será acionado.
    -   Dentro de instantes, o site principal estará atualizado com as novas alterações.
