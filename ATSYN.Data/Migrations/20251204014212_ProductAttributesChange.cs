using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ATSYN.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProductAttributesChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "ProductAttributeValues",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StockAmount",
                table: "ProductAttributeValues",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVisibleToCustomers",
                table: "ProductAttributes",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "ProductAttributeValues");

            migrationBuilder.DropColumn(
                name: "StockAmount",
                table: "ProductAttributeValues");

            migrationBuilder.DropColumn(
                name: "IsVisibleToCustomers",
                table: "ProductAttributes");
        }
    }
}
