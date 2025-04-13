# ArchGuard LLM

# Avaliação do uso de LLMs para revisão de código com foco na padronização arquitetural

Este projeto tem como finalidade explorar o uso de modelos de linguagem para automatizar a revisão de código, com foco na garantia de padronização arquitetural. O objetivo é complementar as ferramentas tradicionais (como linters) com uma análise mais profunda e contextualizada, possibilitando uma melhoria contínua na qualidade da codebase.

---

## 1. Membros do Grupo

- **Guilherme Mota** – Sistemas de Informação (SI)
- **Pedro Medina** – Sistemas de Informação (SI)
- **Ana Luísa Mendes** – Sistemas de Informação (SI)

---

## 2. Objetivo do Trabalho

Este trabalho tem como objetivo desenvolver uma abordagem baseada em modelos de linguagem (LLMs) para garantir a padronização arquitetural do código. A proposta se apoia em três pilares principais:
- **Detecção de inconsistências arquiteturais e de implementação**: Utilizar LLMs para identificar desvios em padrões previamente estabelecidos, que muitas vezes passam despercebidos por ferramentas tradicionais.
  - Exemplo: Se o padrão adotado para consultas ao banco de dados utiliza o prefixo "get" (ex: getUser, getProductList), a LLM pode sinalizar discrepâncias como uma função nomeada fetchData, sugerindo sua padronização.
- **Apoio ao processo de code review automatizado**: Integrar LLMs ao fluxo de revisão de código para verificar automaticamente a aderência aos padrões arquiteturais definidos, oferecendo feedback imediato durante a criação ou atualização de Pull Requests.
  - Exemplo: Se for prática comum validar no controller, como checar autenticação ou validar dados de entrada antes de qualquer operação de negócio, a LLM poderia identificar quando esse padrão não é seguido.
- **Melhorar a qualidade do software**: Auxiliar na identificação de oportunidades de refatoração e no reforço de boas práticas de design de software, como os princípios SOLID, favorecendo um código mais modular, coeso e sustentável.
  - Exemplo: A LLM pode apontar trechos onde há violação de princípios arquiteturais e sugerir reorganizações que tornem o código mais compreensível, reutilizável e resiliente a mudanças.

---

## 3. Metodologia

### 3.1 Modelo de Linguagem

- **Modelo Proposto**: GPT-4o da OpenAI.
  - Motivação: Esse modelo foi escolhido pela fácil integração via API e precisão no seguimento de instruções via prompt.
- **Customização**:
  - Contexto: Informações adicionais, como explicações sobre padrões de código específicos do projeto, poderão ser incluídas no prompt conforme necessário.
  - Temperatura: A temperatura será ajustada para um valor baixo, visando reduzir a aleatoriedade nas respostas e minimizar o risco de alucinações durante a análise de código.

### 3.2 Datasets

- **Coleta de Dados**: Seleção de dezenas de instâncias relevantes extraídas do histórico de código do repositório (por exemplo, pull requests que ilustram implementações consistentes e divergentes).
- **Critérios de Seleção**:
  - Projetos com documentação clara dos padrões de arquitetura.
  - Código que contenha exemplos reais de aplicação e desvio dos padrões.
  - Diversidade em termos de contexto e linguagem para garantir uma avaliação abrangente.
- **Processamento dos Dados**: Pré-processamento dos dados coletados para estruturar e anotar as instâncias, possibilitando uma análise comparativa entre exemplos aderentes e não aderentes aos padrões.

### 3.3 Exemplos Preliminares de Prompts

- **Abordagem "Zero-shot Prompting"**:
  - Prompt: "Analise o seguinte trecho de código e verifique se ele segue os padrões arquiteturais definidos para este projeto."
- **Abordagem "One-shot Prompting"**:
  - Prompt: "Exemplo de referência: No trecho abaixo, é aplicada uma abordagem consistente com os padrões do projeto. Compare com o seguinte código e indique possíveis inconsistências."
- **Abordagem "Prompt Chaining"**:
  - Prompt 1 (Extração de Padrões Arquiteturais): "Analise os trechos de código abaixo e identifique os padrões arquiteturais empregados, como organização de camadas, padrões de design, separação de responsabilidades e convenções de nomenclatura."
  - Prompt 2 (Análise de Consistência do Código): "Com base nos padrões arquiteturais extraídos, examine o seguinte trecho de código e identifique quaisquer inconsistências em relação às diretrizes estabelecidas. Aponte onde o código não segue os padrões e forneça sugestões de melhorias."

*Observação: Os prompts serão refinados à medida que os experimentos forem evoluindo.*

### 3.4 Avaliação Quantitativa

- **Métricas Utilizadas**:
  - **Precisão**: Percentual de correções ou validações corretas realizadas pelo modelo.
  - **Recall**: Capacidade do modelo em identificar todas as violações de padrão presentes.
  - **F1-Score**: Média harmônica entre precisão e recall.
  - **Similaridade de Documentos**: Comparação entre a análise do modelo e a documentação dos padrões.
- **Procedimento**: Utilizar um conjunto de dados de validação anotado manualmente para mensurar as métricas de desempenho do modelo, implementando scripts automatizados para garantir a reprodutibilidade dos resultados.

### 3.5 Avaliação Qualitativa

- **Análise dos Resultados**:
  - Seleção de casos exemplares de acertos e falhas na identificação dos padrões.
  - Discussão crítica sobre as causas dos erros e a potencial melhoria dos prompts ou da customização do modelo.
- **Feedback dos Especialistas**:
  - Coleta de opiniões de desenvolvedores e revisores de código para validar a utilidade e a precisão das sugestões automatizadas.
  - Realização de reuniões periódicas para ajustar a metodologia com base no feedback recebido.

---

## 4. Considerações Finais

Este projeto propõe a aplicação de modelos de linguagem no processo de revisão de código, com o objetivo de garantir a padronização arquitetural e fortalecer a qualidade da base de software. A metodologia proposta será revista e refinada à medida que os experimentos avançarem, com o intuito de aperfeiçoar tanto a precisão das análises quanto a aplicabilidade prática da ferramenta no ambiente de desenvolvimento.
