namespace DespesasApi.Models
{
    public class Despesa
    {
        public int Id { get; set; }
        public required string Data { get; set; }
        public required string Categoria { get; set; }
        public float Valor { get; set; }
        public required string ModoPagamento { get; set; }
        public required string Descricao { get; set; }
        public required string User { get; set; }
    }
} 
