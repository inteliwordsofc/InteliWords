using System;
using System.Collections.Generic;

#nullable disable

namespace InteliWords_API.Domains
{
    public partial class Usuario
    {
        public Usuario()
        {
            Categoria = new HashSet<Categoria>();
        }

        public int IdUsuario { get; set; }
        public string Email { get; set; }
        public string Nome { get; set; }
        public string UserId { get; set; }
        public string Foto { get; set; }
        public bool? Ativado { get; set; }

        public virtual ICollection<Categoria> Categoria { get; set; }
    }
}
