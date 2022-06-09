using InteliWords_API.Domains;
using System.Collections.Generic;

namespace InteliWords_API.Interfaces
{
    public interface IPalavrasUsuarioRepository
    {
        List<PalavrasUsuario> ListarTodos(string id);

        PalavrasUsuario BuscarPorId(int id);

        PalavrasUsuario BuscarPalavraPorId(int id);

        List<PalavrasUsuario> BuscarCategoriasDeletar(int id);

        List<PalavrasUsuario> BuscarPalavrasAprendidas(string userId);

        void Cadastrar(PalavrasUsuario palavraUsuario);

        void Atualizar(int id, PalavrasUsuario palavrasUsuarioAtualizada);

        void AtualizarStatus(int idPalavraUsuario, bool status);

        void Deletar(int idPalavra);

    }
}
