using System;
using System.Collections.Generic;

#nullable disable

namespace InteliWords_API.Domains
{
    public partial class Categoria
    {
        public Categoria()
        {
            PalavrasUsuarios = new HashSet<PalavrasUsuario>();
        }

        public int IdCategoria { get; set; }
        public int? IdUsuario { get; set; }
        public string TituloCategoria { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
        public virtual ICollection<PalavrasUsuario> PalavrasUsuarios { get; set; }
    }
}
