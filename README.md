# 💖 Diário Digital do Amor: Uma Linha do Tempo de Memórias

Este projeto é um diário digital e álbum de fotos dedicado a registrar e celebrar a nossa história. O objetivo é criar um espaço visual e funcional para eternizar momentos especiais, utilizando uma arquitetura moderna baseada em Flask (Python) e JavaScript.

## ✨ Funcionalidades

O site possui três seções principais:

### 1. Página Inicial (`/`)
Uma tela de boas-vindas com uma mensagem pessoal e uma foto, servindo como a porta de entrada para o nosso diário.

### 2. Linha do Tempo (`/timeline`)
A seção principal onde cada momento especial é registrado como um post.
* **Visualização Cronológica:** Os posts são exibidos em ordem de data, criando uma linha do tempo clara da nossa história.
* **Contador de Namoro:** Calcula automaticamente o tempo decorrido desde a data de início do relacionamento.
* **Conteúdo Detalhado:** Cada post contém título, texto narrativo e, opcionalmente, um link para mídia (imagem/vídeo).

### 3. Álbum de Fotos (`/albuns`)
Uma galeria para exibir fotos favoritas de momentos especiais.
* Exibição de fotos em formato de grade.
* Cada foto inclui título e descrição.

---

## 💻 Tecnologias Utilizadas

Este projeto é construído sobre uma arquitetura de *full-stack* leve, usando Python para o backend e tecnologias web padrão para o frontend.

| Categoria | Tecnologia | Uso no Projeto |
| :--- | :--- | :--- |
| **Backend** | **Python** | Linguagem de programação principal. |
| **Framework** | **Flask** | Micro-framework para roteamento, renderização de HTML e criação das APIs. |
| **Banco de Dados** | **SQLite3 + Flask-SQLAlchemy** | Utilizado para armazenar de forma persistente todas as memórias (`vlog_posts`) e fotos (`album_photos`). |
| **Servidor Prod.** | **Gunicorn** | Servidor WSGI utilizado pelo Render para rodar o Flask em produção. |
| **Frontend** | **HTML5, CSS3, JavaScript** | Estrutura das páginas, estilização e toda a lógica dinâmica (requisições API e renderização dos dados). |

---

