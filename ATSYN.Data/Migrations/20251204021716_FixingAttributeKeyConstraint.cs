using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ATSYN.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixingAttributeKeyConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductAttributeValues_ProductId_AttributeId",
                table: "ProductAttributeValues");

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributeValues_ProductId_AttributeId_Value",
                table: "ProductAttributeValues",
                columns: new[] { "ProductId", "AttributeId", "Value" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductAttributeValues_ProductId_AttributeId_Value",
                table: "ProductAttributeValues");

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttributeValues_ProductId_AttributeId",
                table: "ProductAttributeValues",
                columns: new[] { "ProductId", "AttributeId" },
                unique: true);
        }
    }
}
