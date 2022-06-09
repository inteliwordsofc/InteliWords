using InteliWords_API.Domains;
using InteliWords_API.Interfaces;
using InteliWords_API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace InteliWords_API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class PalavrasUsuariosController : ControllerBase
    {
        private IPalavrasUsuarioRepository _PalavrasUsuarioRepository { get; set; }

        public PalavrasUsuariosController()
        {
            _PalavrasUsuarioRepository = new PalavrasUsuarioRepository();
        }

        /// <summary>
        /// Lista todas as Categorias e suas Palavras, de um usuário específico a partir do IdUsuario passado.
        /// </summary>
        /// <returns>Um status code Ok(200)</returns>
        [HttpGet("ListarTodas/{userId}")]
        public IActionResult ListarTodos(string userId)
        {
            try
            {
                // Retorna um status code Ok(200) e uma lista de todas as Palavras relacionadas ao Usuário do Id
                return Ok(_PalavrasUsuarioRepository.ListarTodos(userId));
            }
            catch (Exception erro)
            {
                // Retorna um status code BadRequest(400)
                return BadRequest(erro);
            }
        }

        /// <summary>
        /// Busca por palavras aprendidas e data de verificação diferente de nulo.
        /// </summary>
        /// <param name="userId">Id do Usuário para consulta de palavras relacionadas a ele.</param>
        /// <returns>Uma lista de Objetos para alimentação do gráfico.</returns>
        [HttpGet("{userId}")]
        public IActionResult ListarMinhas(string userId)
        {
            try
            {
                // Retorna um status code Ok(200) e uma lista de Palavras específicas de um Único Úsuário
                return Ok(_PalavrasUsuarioRepository.BuscarPalavrasAprendidas(userId));
            }
            catch (Exception erro)
            {
                // Retorna um status code BadRequest(400)
                return BadRequest(erro);
            }
        }

        /// <summary>
        /// Busca por uma palavra.
        /// </summary>
        /// <param name="id">Id do Usuário para consulta de palavras relacionadas a ele.</param>
        /// <returns>Uma lista de Objetos para alimentação do gráfico.</returns>
        [HttpGet("buscar/{id}")]
        public IActionResult BuscarPalavra(int id)
        {
            try
            {
                // Retorna um status code Ok(200) e uma palavra específica
                return Ok(_PalavrasUsuarioRepository.BuscarPalavraPorId(id));
            }
            catch (Exception erro)
            {
                // Retorna um status code BadRequest(400)
                return BadRequest(erro);
            }
        }

        /// <summary>
        /// Cadastra uma nova palavra no banco.
        /// </summary>
        /// <param name="palavraUsuario">Objeto com todas as propriedades necessárias de palavraUsuario</param>
        /// <returns>Um status code Ok(201)</returns>
        [HttpPost]
        public IActionResult Cadastrar(PalavrasUsuario palavraUsuario)
        {
            try
            {
                if (palavraUsuario.Aprendido == null)
                {
                    palavraUsuario.Aprendido = false;
                }

                // Cadastra um novo Usuario
                _PalavrasUsuarioRepository.Cadastrar(palavraUsuario);

                // Retorna um status code Created(201)
                return StatusCode(201);
            }
            catch (Exception erro)
            {
                // Retorna um status code BadRequest(400)
                return BadRequest(erro);
            }
        }

        /// <summary>
        /// Deleta uma palavraUsuario do sistema
        /// </summary>
        /// <param name="idPalavra">Id da respectiva palavraUsuario a ser deletada</param>
        /// <returns>Um status code Ok(204)</returns>
        [HttpDelete("{idPalavra}")]
        public IActionResult Deletar(int idPalavra)
        {
            try
            {

                // Retorna um status code NoContent(204)
                _PalavrasUsuarioRepository.Deletar(idPalavra);
                return Ok();
            }
            catch (Exception erro)
            {
                // Retorna um status code BadRequest(400)
                return BadRequest(erro);
            }
        }

        /// <summary>
        /// Atualiza a palavraUsuario desejada com parâmetros novos.
        /// </summary>
        /// <param name="idPalavrasUsuario">Id da palavraUsuario a ser atualizada</param>
        /// <param name="palavraUsuario">Objeto contendo as novas informações</param>
        /// <returns>Um status code Ok(204)</returns>
        [HttpPut("{idPalavrasUsuario}")]
        public IActionResult Atualizar(int idPalavrasUsuario, PalavrasUsuario palavraUsuario)
        {
            try
            {
                _PalavrasUsuarioRepository.Atualizar(idPalavrasUsuario, palavraUsuario);

                return StatusCode(204);
            }
            catch (Exception erro)
            {
                // Retorna um status code BadRequest(400)
                return BadRequest(erro);
            }
        }

        /// <summary>
        /// Altera o status da propriedade "Aprendido" da palavraUsuario
        /// </summary>
        /// <param name="idPalavraUsuario">Id da palavraUsuario a ser alterada o Status</param>
        /// <param name="status">Estado a qual será trocado</param>
        /// <returns>Um status code Ok(201)</returns>
        [HttpPatch("{idPalavraUsuario}/{status}")]
        public IActionResult AtualizarStatus(int idPalavraUsuario, bool status)
        {
            try
            {
                // Atualiza a situação de uma consulta
                _PalavrasUsuarioRepository.AtualizarStatus(idPalavraUsuario, status);

                // Retorna um status code NoContent(204)
                return Ok(201);
            }
            catch (Exception erro)
            {
                // Retorna um status code BadRequest(400)
                return BadRequest(erro);
            }
        }
    }
}
