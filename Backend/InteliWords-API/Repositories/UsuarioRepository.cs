using InteliWords_API.Context;
using InteliWords_API.Domains;
using InteliWords_API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace InteliWords_API.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        InteliWordsContext ctx = new InteliWordsContext();
        public void Atualizar(Usuario usuarioAtualizado)
        {
            Usuario usuarioBuscado = BuscarPorId(usuarioAtualizado.UserId);

            if (usuarioAtualizado.Foto != null)
            {
                usuarioBuscado.Foto = usuarioAtualizado.Foto;
            }


            ctx.Usuarios.Update(usuarioBuscado);

            ctx.SaveChanges();
        }

        public void AlterarNome(string novoNome, string id)
        {
            Usuario usuarioBuscado = BuscarPorId(id);

            if (usuarioBuscado != null)
            {
                usuarioBuscado.Nome = novoNome;
            }

            ctx.Usuarios.Update(usuarioBuscado);

            ctx.SaveChanges();
        }

        public Usuario BuscarPorIdDB(int id)
        {
            return ctx.Usuarios.Find(id);
        }

        public Usuario BuscarPorId(string idUsuario)
        {
            return ctx.Usuarios.FirstOrDefault(u => u.UserId == idUsuario);
        }

        public void Cadastrar(Usuario novoUsuario)
        {
            ctx.Usuarios.Add(novoUsuario);
            ctx.SaveChanges();

            Categoria CategoriaPadrao = new Categoria();
            Usuario UsuarioCadastrado = BuscarPorId(novoUsuario.UserId);

            CategoriaPadrao.IdUsuario = UsuarioCadastrado.IdUsuario;
            CategoriaPadrao.TituloCategoria = "Sem Categoria";

            ctx.Categoria.Add(CategoriaPadrao);

            ctx.SaveChanges();
        }

        public void Desativar(string idUsuario)
        {
            Usuario usuarioBuscado = BuscarPorId(idUsuario);

            usuarioBuscado.Ativado = false;

            ctx.Usuarios.Update(usuarioBuscado);

            ctx.SaveChanges();
        }

        public List<Usuario> Listar()
        {
            return ctx.Usuarios.ToList();
        }

        public Usuario Login(string email, string userId)
        {
            return ctx.Usuarios.FirstOrDefault(u => u.Email == email && u.UserId == userId);
        }
    }
}
