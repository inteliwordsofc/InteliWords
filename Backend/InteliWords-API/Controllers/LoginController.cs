using InteliWords_API.Domains;
using InteliWords_API.Interfaces;
using InteliWords_API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace InteliWords_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        /// <summary>
        /// Objeto que irá receber todos os métodos definidos na interface
        /// </summary>
        private IUsuarioRepository _usuarioRepository { get; set; }
        private ICategoriaRepository _categoriaRepository { get; set; }

        /// <summary>
        /// Instancia o objeto para que haja referência às implementações feitas no repositório
        /// </summary>
        public LoginController()
        {
            _usuarioRepository = new UsuarioRepository();
            _categoriaRepository = new CategoriaRepository();
        }

        /// <summary>
        /// Realiza o Login do Usuário
        /// </summary>
        /// <param name="login">Objeto com os dados necessários para o Login</param>
        /// <returns>Retorna um Status Code 201 Ok</returns>
        [HttpPost]
        public IActionResult Login(Usuario login)
        {
            try
            {
                Usuario usuarioExiste = _usuarioRepository.Login(login.Email, login.UserId);

                if (usuarioExiste != null)
                {
                    if (usuarioExiste.Ativado == false)
                    {
                        return BadRequest("Usuário está Desativado");
                    }
                    else
                    {
                        if (usuarioExiste.Foto != login.Foto)
                        {
                            _usuarioRepository.Atualizar(login);
                        }
                        return Ok(usuarioExiste);
                    }
                }
                else
                {
                    _usuarioRepository.Cadastrar(login);
                    Usuario usuarioNovo = _usuarioRepository.Login(login.Email, login.UserId);
                    
                    return Ok(usuarioNovo);

                }
            }
            catch (Exception ex)
            {

                return BadRequest(ex);
            }

        }
    }
}
