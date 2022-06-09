using InteliWords_API.Domains;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InteliWords_API.Interfaces
{
    /// <summary>
    /// Interface resonsável pela CategoriaRepository
    /// </summary>
    interface ICategoriaRepository
    {

        /// <summary>
        /// Lista todos as categorias
        /// </summary>
        /// <returns>uma lista com todos as categorias</returns>
        List<Categoria> ListarTodos();

        /// <summary>
        /// Lista as categorias de um usuário
        /// </summary>
        /// <returns>uma lista com as categorias de um usuário</returns>
        List<Categoria> ListarMinhas(string userId);

        /// <summary>
        /// Cadastra uma nova categoria
        /// </summary>
        /// <param name="novaCategoria">objeto com as informações cadastradas</param>
        void Cadastrar(Categoria novaCategoria);


        /// <summary>
        /// Deleta uma Categoria existente e suas palavras relacionadas
        /// </summary>
        /// <param name="categoria">Id da categoria que será deletada</param>
        void Deletar(Categoria categoria);


        /// <summary>
        /// Atualiza uma Categoria
        /// </summary>
        /// <param name="categoriaAtualizada">objeto Categoria com as novas informações</param>
        ///  <param name="IdCategoria">id da categoria que será atualizada</param>
        ///
        void Atualizar(int IdCategoria, Categoria categoriaAtualizada);


        /// <summary>
        /// Busca uma categoria pelo seu id
        /// </summary>
        /// <param name="idCategoria">id da Categoria que será buscada</param>
        /// <returns></returns>
        Categoria BuscarPorID(int idCategoria);

    }
}
