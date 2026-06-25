using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCheckoutDeliveryRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StoreCheckoutSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SettingsName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    DeliveryMethodName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    DeliveryMessage = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    DeliveryRuleText = table.Column<string>(type: "nvarchar(600)", maxLength: 600, nullable: false),
                    SmallOrderDeliveryFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MediumDeliveryThreshold = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MediumOrderDeliveryFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FreeDeliveryThreshold = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoreCheckoutSettings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StoreCheckoutSettings_IsActive",
                table: "StoreCheckoutSettings",
                column: "IsActive");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StoreCheckoutSettings");
        }
    }
}
