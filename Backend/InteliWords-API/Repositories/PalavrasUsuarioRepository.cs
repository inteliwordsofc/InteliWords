using InteliWords_API.Context;
using InteliWords_API.Domains;
using InteliWords_API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace InteliWords_API.Repositories
{
    public class PalavrasUsuarioRepository : IPalavrasUsuarioRepository
    {
        InteliWordsContext ctx = new InteliWordsContext();

        public void Atualizar(int id, PalavrasUsuario palavrasUsuarioAtualizada)
        {
            PalavrasUsuario palavraUsuario = BuscarPorId(id);

            if (palavrasUsuarioAtualizada.IdCategoria != null && palavrasUsuarioAtualizada.TituloPalavra != null)
            {
                palavraUsuario.IdCategoria = palavrasUsuarioAtualizada.IdCategoria;
                palavraUsuario.TituloPalavra = palavrasUsuarioAtualizada.TituloPalavra;
                palavraUsuario.Definicao = palavrasUsuarioAtualizada.Definicao;
                palavraUsuario.Descricao = palavrasUsuarioAtualizada.Descricao;
            }

            ctx.PalavrasUsuarios.Update(palavraUsuario);

            ctx.SaveChanges();
        }

        public void AtualizarStatus(int idPalavraUsuario, bool status)
        {
            DateTime date = DateTime.Now;
            PalavrasUsuario palavraUsuario = BuscarPorId(idPalavraUsuario);

            if (palavraUsuario != null)
            {
                switch (status)
                {
                    case true:
                        palavraUsuario.Aprendido = true;
                        palavraUsuario.DataVerificacao = date;
                        break;

                    case false:
                        palavraUsuario.Aprendido = false;
                        break;
                }

                ctx.PalavrasUsuarios.Update(palavraUsuario);

                ctx.SaveChanges();
            }
        }


        public PalavrasUsuario BuscarPorId(int id)
        {
            return ctx.PalavrasUsuarios.Find(id);
        }

        public void Cadastrar(PalavrasUsuario palavraUsuario)
        {
            ctx.PalavrasUsuarios.Add(palavraUsuario);

            ctx.SaveChanges();
        }

        public void Deletar(int idPalavra)
        {
            try
            {

            PalavrasUsuario palavraBuscada = BuscarPorId(idPalavra);

            ctx.PalavrasUsuarios.Remove(palavraBuscada);

            ctx.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public PalavrasUsuarioRepository()
        {
        }

        public List<PalavrasUsuario> BuscarPalavrasAprendidas(string userId)
        {
            return ctx.PalavrasUsuarios
                .Select(c => new PalavrasUsuario()
                {
                    IdPalavrasUsuario = c.IdPalavrasUsuario,
                    Aprendido = c.Aprendido,
                    DataVerificacao = c.DataVerificacao,
                    IdCategoria = c.IdCategoria,
                    TituloPalavra = c.TituloPalavra,

                    IdCategoriaNavigation = new Categoria
                    {
                        IdCategoria = c.IdCategoriaNavigation.IdCategoria,

                        IdUsuarioNavigation = new Usuario
                        {
                            IdUsuario = c.IdCategoriaNavigation.IdUsuarioNavigation.IdUsuario,
                            UserId = c.IdCategoriaNavigation.IdUsuarioNavigation.UserId
                        }
                    }

                }).Where(c => c.Aprendido == true && c.IdCategoriaNavigation.IdUsuarioNavigation.UserId == userId && c.DataVerificacao != null)
                .ToList();
        }

        public List<PalavrasUsuario> ListarTodos(string id)
        {
            return ctx.PalavrasUsuarios

                .Include(c => c.IdCategoriaNavigation)

                .Select(c => new PalavrasUsuario
                {
                    IdPalavrasUsuario = c.IdPalavrasUsuario,
                    TituloPalavra = c.TituloPalavra,
                    Aprendido = c.Aprendido,
                    IdCategoriaNavigation = new Categoria
                    {
                        IdCategoria = c.IdCategoriaNavigation.IdCategoria,
                        TituloCategoria = c.IdCategoriaNavigation.TituloCategoria,

                        IdUsuarioNavigation = new Usuario
                        {
                            IdUsuario = c.IdCategoriaNavigation.IdUsuarioNavigation.IdUsuario,
                            UserId = c.IdCategoriaNavigation.IdUsuarioNavigation.UserId
                        }
                    }
                })
                .Where(c => c.IdCategoriaNavigation.IdUsuarioNavigation.UserId == id)
                .ToList();
        }

        public List<PalavrasUsuario> BuscarCategoriasDeletar(int idCategoria)
        {
            List<PalavrasUsuario> verify = ctx.PalavrasUsuarios

                     .Include(c => c.IdCategoriaNavigation)

                     .Select(c => new PalavrasUsuario
                     {
                         IdPalavrasUsuario = c.IdPalavrasUsuario,
                         TituloPalavra = c.TituloPalavra,

                         IdCategoriaNavigation = new Categoria
                         {
                             IdCategoria = c.IdCategoriaNavigation.IdCategoria
                         }
                     })
                     .Where(c => c.IdCategoriaNavigation.IdCategoria == idCategoria)
                     .ToList();

            return verify;
        }

        public PalavrasUsuario BuscarPalavraPorId(int id)
        {
            return ctx.PalavrasUsuarios.Include(p => p.IdCategoriaNavigation).FirstOrDefault(p => p.IdPalavrasUsuario == id);
        }
    }
}
