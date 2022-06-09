USE inteliwordsDB;
GO

INSERT INTO Usuario (email, nome, userId, foto, ativado)
VALUES ('roberto@gmail.com', 'Roberto', '19023456789', 'fotoTeste', 1);
GO

INSERT INTO Categoria(idUsuario, tituloCategoria)
VALUES (1,'Esportes');
GO

INSERT INTO PalavrasUsuario (idCategoria, tituloPalavra, definicao, descricao, aprendido, dataCriacao)
VALUES (1, 'Futebol', 'Jogo', 'Hoje tem jogo!', 1, '2022-03-25');
GO