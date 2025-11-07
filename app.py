from flask import Flask, render_template, jsonify, request, url_for
from flask_cors import CORS
from models import db, PostVlog  # Importa a estrutura de dados que criamos
from models import Album, AlbumPhoto  # Importa as classes do modelo de dados
from datetime import datetime

# 1. Configurações Iniciais do Flask
app = Flask(__name__)


# Rota para a página inicial
@app.route('/')
def index():
    # Isso assume que index.html está na pasta 'templates'
    return render_template('index.html')

# Rota para a linha do tempo
@app.route('/timeline')
def timeline():
    # Isso assume que timeline.html está na pasta 'templates'
    return render_template('timeline.html')

@app.route('/albuns')
def albuns():
    return render_template('albuns.html')


# Configuração do Banco de Dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nosso_amor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o banco de dados dentro da aplicação Flask
db.init_app(app)

# 2. Configuração do CORS (Obrigatório para o Front-end)
# Permite que o JavaScript (Front-end) acesse esta API (Backend)
CORS(app) 



# --- 3. ENDPOINTS DA API (Rotas que o JS vai usar) ---

# Rota GET: Buscar todos os posts do vlog para o JS montar a linha do tempo
@app.route('/api/vlog-posts', methods=['GET'])
def get_vlog_posts():
    """Retorna todos os posts do vlog em ordem cronológica inversa."""
    
    # Consulta o banco de dados, ordena pelo mais recente
    posts = PostVlog.query.order_by(PostVlog.data_do_momento.desc()).all()
    
    # Converte a lista de objetos Python em JSON para o JavaScript
    return jsonify([post.to_json() for post in posts])


# Rota POST: Adicionar um novo post (você usará esta rota para salvar novas memórias)
@app.route('/api/vlog-posts', methods=['POST'])
def create_vlog_post():
    """Cria um novo post no banco de dados."""
    data = request.get_json()
    
    # Tenta usar a data enviada no JSON; se não houver, usa a data/hora atual
    data_momento = data.get('data_do_momento')
    if data_momento:
        try:
            data_momento = datetime.fromisoformat(data_momento)
        except ValueError:
            return jsonify({"message": "Formato de data inválido. Use ISO 8601 (Ex: 2024-03-15T20:00:00)"}), 400

    try:
        new_post = PostVlog(
            titulo=data['titulo'],
            texto=data['texto'],
            data_do_momento=data_momento or datetime.utcnow(),
            link_midia=data.get('link_midia')
        )
        
        db.session.add(new_post)
        db.session.commit()
        
        # Retorna o novo post criado e o código 201 (Created)
        return jsonify(new_post.to_json()), 201 

    except Exception as e:
        # Se faltar um campo obrigatório (título ou texto), o Flask avisa
        return jsonify({"message": "Erro ao salvar a memória. Verifique se Título e Texto foram enviados.", "error": str(e)}), 400
    
# Rota DELETE: Remover um post específico por ID
@app.route('/api/vlog-posts/<int:post_id>', methods=['DELETE'])
def delete_vlog_post(post_id):
    post = PostVlog.query.get_or_404(post_id)

    db.session.delete(post)
    db.session.commit()

    return jsonify({"message": f"Memória com ID {post_id} deletada com sucesso!"}), 200

@app.route('/api/album-photos', methods=['GET'])
def get_album_photos():
    # Simples: Lista todas as fotos
    photos = AlbumPhoto.query.all()
    return jsonify([photo.to_dict() for photo in photos])

@app.route('/api/album-photos', methods=['POST'])
def create_album_photo():
    data = request.get_json()
    if 'url_foto' not in data:
        return jsonify({'message': 'URL da foto é obrigatória'}), 400
    
    # Simples: Adiciona a foto ao álbum 1 por padrão
    new_photo = AlbumPhoto(
        titulo=data.get('titulo', 'Sem Título'),
        descricao=data.get('descricao', ''),
        url_foto=data['url_foto'],
        album_id=data.get('album_id', 1) 
    )
    db.session.add(new_photo)
    db.session.commit()
    return jsonify(new_photo.to_dict()), 201

# Adicione esta rota para criar o primeiro álbum automaticamente no seeding se estiver usando
@app.route('/api/albums', methods=['POST'])
def create_album():
    data = request.get_json()
    new_album = Album(nome=data['nome'], descricao=data.get('descricao', ''))
    db.session.add(new_album)
    db.session.commit()
    return jsonify(new_album.to_dict()), 201

# Rota DELETE: Remover uma foto específica por ID
@app.route('/api/album-photos/<int:photo_id>', methods=['DELETE'])
def delete_album_photo(photo_id):
    """Exclui uma foto do álbum pelo ID."""
    try:
        # 1. Tenta buscar a foto, retorna 404 se não existir
        photo = AlbumPhoto.query.get_or_404(photo_id)
        
        # 2. Deleta a foto e salva as mudanças
        db.session.delete(photo)
        db.session.commit()
        
        # 3. Retorna sucesso (204 No Content é padrão para DELETE bem-sucedido)
        return jsonify({'message': f'Foto com ID {photo_id} deletada com sucesso!'}), 204
    
    except Exception as e:
        # Em caso de erro, desfaz a transação e retorna erro
        db.session.rollback()
        return jsonify({'message': f'Erro ao deletar foto: {str(e)}'}), 500


# ==========================================================
# Execução da Aplicação
# ==========================================================

if __name__ == '__main__':
    # O Vercel usa o Gunicorn. Esta parte é só para você rodar o Flask no seu PC.
    app.run(debug=True)
