# ArchGuard LLM

# Revisão de Código Automatizada com LLMs

Este projeto tem como finalidade explorar o uso de modelos de linguagem para automatizar a revisão de código, com foco na identificação de inconsistências e na padronização arquitetural. O objetivo é complementar as ferramentas tradicionais (como linters) com uma análise mais profunda e contextualizada, possibilitando uma melhoria contínua na qualidade da codebase.

---

## 1. Membros do Grupo

- **Guilherme Mota** – Sistemas de Informação (SI)
- **Pedro Medina** – Sistemas de Informação (SI)
- **Ana Luísa Mendes** – Sistemas de Informação (SI)

---

## 2. Objetivo do Trabalho

O objetivo deste trabalho é desenvolver uma abordagem que utilize modelos de linguagem (LLMs) para:
- **Detectar inconsistências**: Identificar divergências em padrões arquiteturais e de implementação que não são facilmente captadas por ferramentas tradicionais.
- **Apoiar o processo de code review**: Automatizar a verificação de conformidade da base de código com os padrões definidos, fornecendo feedback imediato durante a criação e atualização de Pull Requests.
- **Melhorar a qualidade do software**: Contribuir para uma maior consistência e manutenção dos padrões de desenvolvimento, reduzindo falhas e facilitando a evolução do projeto.

---

## 3. Metodologia

### 3.1 Modelo de Linguagem

- **Modelo Proposto**: Utilização de um modelo de linguagem de última geração (por exemplo, GPT-4, Claude 3.7 ou outro) como base para a análise.
- **Customização**: Avaliar a necessidade de fine-tuning ou ajustes para adaptar o modelo ao contexto específico da codebase utilizada, levando em consideração a linguagem de programação e os padrões arquiteturais definidos no projeto.

### 3.2 Datasets

- **Coleta de Dados**: Seleção de dezenas de instâncias relevantes extraídas do histórico de código do repositório (por exemplo, pull requests que ilustram implementações consistentes e divergentes).
- **Critérios de Seleção**:
  - Projetos com documentação clara dos padrões de arquitetura.
  - Código que contenha exemplos reais de aplicação e desvio dos padrões.
  - Diversidade em termos de contexto e linguagem para garantir uma avaliação abrangente.
- **Processamento dos Dados**: Pré-processamento dos dados coletados para estruturar e anotar as instâncias, possibilitando uma análise comparativa entre exemplos aderentes e não aderentes aos padrões.

### 3.3 Exemplos Preliminares de Prompts

- **Abordagem Zero-shot**:
  - Prompt: "Analise o seguinte trecho de código e verifique se ele segue os padrões arquiteturais definidos para este projeto."
- **Abordagem One-shot**:
  - Prompt: "Exemplo de referência: No trecho abaixo, é aplicada uma abordagem consistente com os padrões do projeto. Compare com o seguinte código e indique possíveis inconsistências."

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

## 4. Acesso a Modelos de Linguagem (LLMs)

### 4.1 Modelos Open Source Recomendados

Para garantir a viabilidade e reprodutibilidade do projeto, optaremos por utilizar modelos de linguagem de código aberto que não requerem acesso a APIs comerciais. As opções consideradas são:

- **LLaMA 2 (Meta)**: Disponível em versões de 7B a 70B parâmetros, o LLaMA 2 é adequado para tarefas de análise de código e pode ser executado localmente com recursos computacionais apropriados.

- **BLOOM (BigScience)**: Modelo multilíngue com 176B parâmetros, treinado em 46 idiomas naturais e 13 linguagens de programação, ideal para análise de código em diversos contextos.

- **GPT4All**: Um ecossistema de modelos compactos de código aberto, projetado para ser executado localmente, facilitando experimentações sem dependência de APIs externas.

### 4.2 Infraestrutura Necessária

A execução local desses modelos requer infraestrutura computacional adequada:

- **Memória RAM**: Mínimo de 16 GB, recomendado 32 GB ou mais.

- **GPU**: Placa gráfica com suporte a CUDA, com pelo menos 12 GB de VRAM para modelos maiores.

Caso o grupo não disponha dessa infraestrutura, será considerada a utilização de plataformas de computação em nuvem que ofereçam recursos gratuitos ou de baixo custo para pesquisa acadêmica.

### 4.3 Alternativas Comerciais

Se necessário, poderemos recorrer a APIs comerciais com planos gratuitos ou acadêmicos, como:

- **OpenAI (ChatGPT/GPT-4)**: Oferece planos gratuitos com limitações de uso, adequados para testes iniciais.

- **Google Cloud (PaLM 2)**: Disponibiliza créditos para pesquisadores e estudantes, permitindo acesso a modelos avançados.

A escolha entre modelos open source e comerciais será baseada na disponibilidade de recursos e nas necessidades específicas do projeto.

---

## 5. Considerações Finais

Este projeto busca integrar inteligência artificial ao processo de revisão de código, promovendo uma abordagem inovadora para manter a consistência e qualidade da base de código. A metodologia proposta será revista e refinada à medida que os experimentos avançarem, com o intuito de aperfeiçoar tanto a precisão das análises quanto a aplicabilidade prática da ferramenta no ambiente de desenvolvimento.
