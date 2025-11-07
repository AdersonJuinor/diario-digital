from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()

class PostVlog(db.Model):
    __tablename__ = 'vlog_posts' 
    
    id = db.Column(db.Integer, primary_key=True)
    data_do_momento = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    titulo = db.Column(db.String(100), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    link_midia = db.Column(db.String(200), nullable=True) 

    def to_json(self):
        return {
            'id': self.id,
            'data_do_momento': self.data_do_momento.isoformat(), 
            'titulo': self.titulo,
            'texto': self.texto,
            'link_midia': self.link_midia
        }

    def __repr__(self):
        return f'<PostVlog {self.titulo}>'
    
    # Nova Tabela para Fotos da Galeria
class AlbumPhoto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    album_id = db.Column(db.Integer, db.ForeignKey('album.id'), nullable=False)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    url_foto = db.Column(db.String(500), nullable=False)
    data_upload = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'album_id': self.album_id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'url_foto': self.url_foto,
            'data_upload': self.data_upload.isoformat()
        }

# (Opcional) Se você quiser categorizar em Álbuns
class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    # Relação: Um álbum tem várias fotos
    fotos = db.relationship('AlbumPhoto', backref='album', lazy=True) 

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'descricao': self.descricao,
            'qtd_fotos': len(self.fotos)
        }