using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DespesasApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserAndDespesaSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Despesas_Users_UserId",
                table: "Despesas");

            migrationBuilder.DropIndex(
                name: "IX_Despesas_UserId",
                table: "Despesas");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Despesas");

            migrationBuilder.AlterColumn<float>(
                name: "Valor",
                table: "Despesas",
                type: "REAL",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "User",
                table: "Despesas",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "User",
                table: "Despesas");

            migrationBuilder.AlterColumn<decimal>(
                name: "Valor",
                table: "Despesas",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "REAL");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Despesas",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Despesas_UserId",
                table: "Despesas",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Despesas_Users_UserId",
                table: "Despesas",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
