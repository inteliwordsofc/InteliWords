USE inteliwordsDB;
GO

CREATE TABLE Usuario(
idUsuario INT PRIMARY KEY IDENTITY(1,1),
email VARCHAR(255) UNIQUE NOT NULL,
nome VARCHAR(255) NOT NULL,
userId VARCHAR(255) UNIQUE NOT NULL,
foto VARCHAR(255),
ativado BIT 
);
GO

CREATE TABLE Categoria(
idCategoria INT PRIMARY KEY IDENTITY(1,1),
idUsuario INT FOREIGN KEY REFERENCES Usuario(idUsuario),
tituloCategoria NVARCHAR(255) NOT NULL 
);
GO

CREATE TABLE PalavrasUsuario(
idPalavrasUsuario INT PRIMARY KEY IDENTITY(1,1),
idCategoria INT FOREIGN KEY REFERENCES Categoria(idCategoria),
tituloPalavra NVARCHAR(80) NOT NULL,
definicao NVARCHAR(255),
descricao NVARCHAR(255),
aprendido BIT DEFAULT 0,
dataCriacao DATETIME
);
GO