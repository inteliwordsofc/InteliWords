using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using InteliWords_API.Domains;

#nullable disable

namespace InteliWords_API.Context
{
    public partial class InteliWordsContext : DbContext
    {
        public InteliWordsContext()
        {
        }

        public InteliWordsContext(DbContextOptions<InteliWordsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Categoria> Categoria { get; set; }
        public virtual DbSet<PalavrasUsuario> PalavrasUsuarios { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=inteliwords2.database.windows.net; Initial Catalog=inteliwordsDB; user Id=UserAdmin; pwd=oP09%8yw#t;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.IdCategoria)
                    .HasName("PK__Categori__8A3D240C8A5AC356");

                entity.Property(e => e.IdCategoria).HasColumnName("idCategoria");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.TituloCategoria)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(true)
                    .HasColumnName("tituloCategoria");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.Categoria)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("FK__Categoria__idUsu__656C112C");
            });

            modelBuilder.Entity<PalavrasUsuario>(entity =>
            {
                entity.HasKey(e => e.IdPalavrasUsuario)
                    .HasName("PK__Palavras__319692E79A972F67");

                entity.ToTable("PalavrasUsuario");

                entity.Property(e => e.IdPalavrasUsuario).HasColumnName("idPalavrasUsuario");

                entity.Property(e => e.Aprendido)
                    .HasColumnName("aprendido")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.DataVerificacao)
                    .HasColumnType("datetime")
                    .HasColumnName("dataVerificacao");

                entity.Property(e => e.Definicao)
                    .HasMaxLength(255)
                    .IsUnicode(true)
                    .HasColumnName("definicao");

                entity.Property(e => e.Descricao)
                    .HasMaxLength(255)
                    .IsUnicode(true)
                    .HasColumnName("descricao");

                entity.Property(e => e.IdCategoria).HasColumnName("idCategoria");

                entity.Property(e => e.TituloPalavra)
                    .IsRequired()
                    .HasMaxLength(80)
                    .IsUnicode(true)
                    .HasColumnName("tituloPalavra");

                entity.HasOne(d => d.IdCategoriaNavigation)
                    .WithMany(p => p.PalavrasUsuarios)
                    .HasForeignKey(d => d.IdCategoria)
                    .HasConstraintName("FK__PalavrasU__idCat__66603565");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUsuario)
                    .HasName("PK__Usuario__645723A6FC9CDF1D");

                entity.ToTable("Usuario");

                entity.HasIndex(e => e.Email, "UQ__Usuario__AB6E6164525745D8")
                    .IsUnique();

                entity.HasIndex(e => e.UserId, "UQ__Usuario__CB9A1CFE57158BF4")
                    .IsUnique();

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.Ativado).HasColumnName("ativado");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.Foto)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("foto");

                entity.Property(e => e.Nome)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("nome");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("userId");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
