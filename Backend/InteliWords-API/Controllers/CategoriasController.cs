using InteliWords_API.Context;
using InteliWords_API.Domains;
using InteliWords_API.Interfaces;
using InteliWords_API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InteliWords_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly InteliWordsContext _context;

        public CategoriasController(InteliWordsContext context)
        {
            _context = context;
            _categoriaRepository = new CategoriaRepository();
        }

        /// <summary>
        /// Objeto que irá receber todos os métodos definidos na interface
        /// </summary>
        private ICategoriaRepository _categoriaRepository { get; set; }

        //ListarTodos
        /// <summary>
        /// Lista todas as categorias
        /// </summary>
        /// <returns>Retorna uma lista de categorias</returns>
        /// 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> ListarTodos()
        {
            return await _context.Categoria.ToListAsync();
        }

        //ListarTodos
        /// <summary>
        /// Lista todas as categorias de um usuario
        /// </summary>
        /// <returns>Retorna uma lista de categorias de um usuário</returns>
        /// 
        [HttpGet("{userId}")]
        public IActionResult ListarMinhasCategorias(string userId)
        {
            List<Categoria> MinhasCategorias = _categoriaRepository.ListarMinhas(userId);

            return Ok(MinhasCategorias);

        }


        //Cadastrar
        /// <summary>
        /// Cadastra uma nova categoria
        /// </summary>
        /// <param name="categoria">Objeto categoria com as informaçoes</param>
        /// <returns>Retorna um Created</returns>
        /// 
        [HttpPost]
        public async Task<ActionResult<Categoria>> Cadastrar(Categoria categoria)
        {
            _context.Categoria.Add(categoria);
            await _context.SaveChangesAsync();

            return Created("Categoria", categoria);
        }

        /// <summary>
        /// Atualiza uma categoria existente
        /// </summary>
        /// <param name="id">id da categoria que será atualizada</param>
        /// <param name="categoria">objeto categoria com as novas informações</param>
        /// <returns></returns>
        [HttpPut]
        public async Task<IActionResult> Atualizar(int id, Categoria categoria)
        {

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }



        //Deletar
        /// <summary>
        /// Deleta uma categoria existente
        /// </summary>
        /// <param name="idCategoria">id da clinica que será deletada</param>
        /// <returns>StatusCode</returns>
        /// 
        [HttpDelete("{idCategoria}")]
        public async Task<IActionResult> Deletar(int idCategoria)
        {
            var categoria = await _context.Categoria.FindAsync(idCategoria);
            if (categoria == null)
            {
                return NotFound();
            }

             _categoriaRepository.Deletar(categoria);

            return NoContent();
        }


        private bool CategoriaExists(int idCategoria)
        {
            return _context.Categoria.Any(c => c.IdCategoria == idCategoria);
        }

    }



    
}
