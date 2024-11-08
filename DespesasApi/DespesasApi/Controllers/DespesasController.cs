using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DespesasApi.Data;
using DespesasApi.Models;

[Route("api/[controller]")]
[ApiController]
public class DespesasController : ControllerBase
{
    private readonly DespesasContext _context;

    public DespesasController(DespesasContext context)
    {
        _context = context;
    }

    // GET: api/despesas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Despesa>>> GetDespesas([FromQuery] string user)
    {
        var despesas = await _context.Despesas
            .Where(d => d.User == user)
            .ToListAsync();
        return despesas;
    }

    // GET: api/despesas/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Despesa>> GetDespesa(int id)
    {
        var despesa = await _context.Despesas.FindAsync(id);
        if (despesa == null)
        {
            return NotFound();
        }
        return despesa;
    }

    // POST: api/despesas
    [HttpPost]
    public async Task<ActionResult<Despesa>> PostDespesa(Despesa despesa)
    {
        _context.Despesas.Add(despesa);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetDespesa), new { id = despesa.Id }, despesa);
    }

    // PUT: api/despesas/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> PutDespesa(int id, Despesa updatedDespesa)
    {
        if (id != updatedDespesa.Id)
        {
            return BadRequest("Despesa ID mismatch.");
        }

        var existingDespesa = await _context.Despesas.FindAsync(id);
        if (existingDespesa == null)
        {
            return NotFound("Despesa not found.");
        }

        existingDespesa.Data = updatedDespesa.Data;
        existingDespesa.Categoria = updatedDespesa.Categoria;
        existingDespesa.Valor = updatedDespesa.Valor;
        existingDespesa.ModoPagamento = updatedDespesa.ModoPagamento;
        existingDespesa.Descricao = updatedDespesa.Descricao;

        _context.Entry(existingDespesa).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }

    // DELETE: api/despesas/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDespesa(int id)
    {
        var despesa = await _context.Despesas.FindAsync(id);
        if (despesa == null)
        {
            return NotFound("Despesa not found.");
        }
        
        _context.Despesas.Remove(despesa);
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}
