# Este script deve ser executado APENAS UMA VEZ localmente.

from app import app, db
from models import PostVlog, Album, AlbumPhoto
from datetime import datetime

# --- DADOS DE MEMÓRIAS FORNECIDOS ---
# (Extraídos dos seus arquivos .http)

POSTS_INICIAIS = [
    {
        "titulo": "O Primeiro Contato: Eu curti você!",
        "texto": "Esse foi o dia em que a gente se falou pela primeira vez. Você estava na aula de Física e eu, na de Sociologia. Você saiu para ir ao banheiro e, por sorte, eu estava fora da sala. Fui até o corredor perto do banheiro te esperar... Quando você passou, eu te parei e falei: “Eu curti você!” Pedi seu Instagram, você me passou e voltou para a sala. Naquele momento, eu tive certeza: era você. No fim da aula, te levei até a parada de ônibus. Você não parava de falar (kkk), e eu só conseguia pensar em como seu jeito era encantador. Antes de você subir no ônibus, me deu um abraço e um beijo na bochecha. E foi ali, naquele instante simples e mágico, que eu me apaixonei por você. ❤️",
        "data_do_momento": "2025-08-18T20:47:00",
        "link_midia": ""
    },
    {
        "titulo": "Nosso Primeiro Beijo",
        "texto": "Nosso primeiro beijo aconteceu no mesmo dia em que conheci sua mãe. A gente ainda não namorava e nem sabia ao certo se iria ficar. Estávamos na parada de ônibus, conversando sobre coisas bobas, rindo à toa, até o ônibus chegar. Sua mãe entrou primeiro e, de repente, você veio me abraçar. Sem pensar duas vezes, eu te puxei e te beijei. Eu estava nervoso, o coração disparado, mas aquele momento parecia o certo — o nosso momento. Você ficou toda envergonhada, sem reação, e saiu correndo para subir no ônibus (kkk). E assim foi o segundo momento especial no começo da nossa história — o beijo que marcou o início de tudo. ❤️",
        "data_do_momento": "2025-08-19T22:00:00",
        "link_midia": ""
    }
]

FOTOS_INICIAIS = [
    {
        "titulo": "Primeira Selfie Juntos",
        "descricao": "Nossa primeira selfie oficial!",
        "url_foto": "https://i.postimg.cc/gkP579SZ/primeirafoto.jpg",
    },
    {
        "titulo": "Foto Depois do Cinema",
        "descricao": "Depois de assistimos Invocação do Mal 4 juntos.",
        "url_foto": "https://i.postimg.cc/XvCFyPwP/fotodepoisdocinema.jpg",
    }
]

# Função principal de inicialização
def setup_database():
    with app.app_context():
        print("1. Criando todas as tabelas...")
        db.create_all()

        # Verifica se o álbum padrão existe ou o cria
        album_padrao = Album.query.get(1)
        if not album_padrao:
            album_padrao = Album(id=1, nome="Nossas Fotos Favoritas", descricao="As melhores lembranças em fotos!")
            db.session.add(album_padrao)
            print("  -> Álbum padrão criado com ID 1.")
        else:
            print("  -> Álbum padrão já existe.")

        # 2. Inserindo posts na linha do tempo
        if PostVlog.query.count() == 0:
            print("2. Inserindo posts iniciais...")
            for p_data in POSTS_INICIAIS:
                post = PostVlog(
                    titulo=p_data['titulo'],
                    texto=p_data['texto'],
                    data_do_momento=datetime.fromisoformat(p_data['data_do_momento']),
                    link_midia=p_data['link_midia']
                )
                db.session.add(post)
            print(f"  -> {len(POSTS_INICIAIS)} posts adicionados.")
        else:
            print(f"2. Posts de memória já existem ({PostVlog.query.count()}). Pulando inserção.")
        
        # 3. Inserindo fotos
        if AlbumPhoto.query.count() == 0:
            print("3. Inserindo fotos iniciais...")
            for f_data in FOTOS_INICIAIS:
                photo = AlbumPhoto(
                    titulo=f_data['titulo'],
                    descricao=f_data['descricao'],
                    url_foto=f_data['url_foto'],
                    album_id=1 # Todas as fotos vão para o álbum padrão
                )
                db.session.add(photo)
            print(f"  -> {len(FOTOS_INICIAIS)} fotos adicionadas.")
        else:
            print(f"3. Fotos de álbum já existem ({AlbumPhoto.query.count()}). Pulando inserção.")

        db.session.commit()
        print("✅ Inicialização do banco de dados concluída!")

if __name__ == '__main__':
    setup_database()