using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddStorefrontCollectionPages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_IsActive_DisplayOrder",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_ProductImages_ProductId_DisplayOrder",
                table: "ProductImages");

            migrationBuilder.AlterColumn<string>(
                name: "HeroVisualAriaLabel",
                table: "StorefrontHomeContents",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "HeroText",
                table: "StorefrontHomeContents",
                type: "nvarchar(600)",
                maxLength: 600,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(700)",
                oldMaxLength: 700);

            migrationBuilder.AlterColumn<string>(
                name: "HeroEyebrow",
                table: "StorefrontHomeContents",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(120)",
                oldMaxLength: 120);

            migrationBuilder.AlterColumn<string>(
                name: "CategorySectionAriaLabel",
                table: "StorefrontHomeContents",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "BestSellersTitle",
                table: "StorefrontHomeContents",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(120)",
                oldMaxLength: 120);

            migrationBuilder.AlterColumn<string>(
                name: "BestSellersLinkLabel",
                table: "StorefrontHomeContents",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(120)",
                oldMaxLength: 120);

            migrationBuilder.AlterColumn<string>(
                name: "BestSellersEyebrow",
                table: "StorefrontHomeContents",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(120)",
                oldMaxLength: 120);

            migrationBuilder.AlterColumn<string>(
                name: "Size",
                table: "ProductVariants",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(30)",
                oldMaxLength: 30);

            migrationBuilder.AlterColumn<string>(
                name: "FitType",
                table: "Products",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(80)",
                oldMaxLength: 80);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Products",
                type: "nvarchar(1400)",
                maxLength: 1400,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1200)",
                oldMaxLength: 1200);

            migrationBuilder.AlterColumn<string>(
                name: "PublicId",
                table: "ProductImages",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "StorefrontCollectionPages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PageKey = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    PageName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Mode = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    FilterType = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    HeroEyebrow = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    HeroTitle = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: false),
                    HeroText = table.Column<string>(type: "nvarchar(700)", maxLength: 700, nullable: false),
                    HeroButtonLabel = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    SecondaryButtonLabel = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    SecondaryButtonRoute = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    CollectionEyebrow = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    CollectionTitle = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    ProductCardLinkLabel = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    EmptyTitle = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    EmptyText = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    NoteEyebrow = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    NoteTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NoteText = table.Column<string>(type: "nvarchar(900)", maxLength: 900, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorefrontCollectionPages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StorefrontCollectionBenefits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CollectionPageId = table.Column<int>(type: "int", nullable: false),
                    IconClass = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Text = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorefrontCollectionBenefits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StorefrontCollectionBenefits_StorefrontCollectionPages_CollectionPageId",
                        column: x => x.CollectionPageId,
                        principalTable: "StorefrontCollectionPages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StorefrontCollectionHeroImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CollectionPageId = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(700)", maxLength: 700, nullable: false),
                    ImageAlt = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorefrontCollectionHeroImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StorefrontCollectionHeroImages_StorefrontCollectionPages_CollectionPageId",
                        column: x => x.CollectionPageId,
                        principalTable: "StorefrontCollectionPages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StorefrontCollectionHeroPoints",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CollectionPageId = table.Column<int>(type: "int", nullable: false),
                    IconClass = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Label = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorefrontCollectionHeroPoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StorefrontCollectionHeroPoints_StorefrontCollectionPages_CollectionPageId",
                        column: x => x.CollectionPageId,
                        principalTable: "StorefrontCollectionPages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductImages_ProductId",
                table: "ProductImages",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_StorefrontCollectionBenefits_CollectionPageId",
                table: "StorefrontCollectionBenefits",
                column: "CollectionPageId");

            migrationBuilder.CreateIndex(
                name: "IX_StorefrontCollectionHeroImages_CollectionPageId",
                table: "StorefrontCollectionHeroImages",
                column: "CollectionPageId");

            migrationBuilder.CreateIndex(
                name: "IX_StorefrontCollectionHeroPoints_CollectionPageId",
                table: "StorefrontCollectionHeroPoints",
                column: "CollectionPageId");

            migrationBuilder.CreateIndex(
                name: "IX_StorefrontCollectionPages_PageKey",
                table: "StorefrontCollectionPages",
                column: "PageKey",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StorefrontCollectionBenefits");

            migrationBuilder.DropTable(
                name: "StorefrontCollectionHeroImages");

            migrationBuilder.DropTable(
                name: "StorefrontCollectionHeroPoints");

            migrationBuilder.DropTable(
                name: "StorefrontCollectionPages");

            migrationBuilder.DropIndex(
                name: "IX_ProductImages_ProductId",
                table: "ProductImages");

            migrationBuilder.AlterColumn<string>(
                name: "HeroVisualAriaLabel",
                table: "StorefrontHomeContents",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(160)",
                oldMaxLength: 160);

            migrationBuilder.AlterColumn<string>(
                name: "HeroText",
                table: "StorefrontHomeContents",
                type: "nvarchar(700)",
                maxLength: 700,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(600)",
                oldMaxLength: 600);

            migrationBuilder.AlterColumn<string>(
                name: "HeroEyebrow",
                table: "StorefrontHomeContents",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(160)",
                oldMaxLength: 160);

            migrationBuilder.AlterColumn<string>(
                name: "CategorySectionAriaLabel",
                table: "StorefrontHomeContents",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(160)",
                oldMaxLength: 160);

            migrationBuilder.AlterColumn<string>(
                name: "BestSellersTitle",
                table: "StorefrontHomeContents",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(160)",
                oldMaxLength: 160);

            migrationBuilder.AlterColumn<string>(
                name: "BestSellersLinkLabel",
                table: "StorefrontHomeContents",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(80)",
                oldMaxLength: 80);

            migrationBuilder.AlterColumn<string>(
                name: "BestSellersEyebrow",
                table: "StorefrontHomeContents",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(160)",
                oldMaxLength: 160);

            migrationBuilder.AlterColumn<string>(
                name: "Size",
                table: "ProductVariants",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(40)",
                oldMaxLength: 40);

            migrationBuilder.AlterColumn<string>(
                name: "FitType",
                table: "Products",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(120)",
                oldMaxLength: 120);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Products",
                type: "nvarchar(1200)",
                maxLength: 1200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(1400)",
                oldMaxLength: 1400);

            migrationBuilder.AlterColumn<string>(
                name: "PublicId",
                table: "ProductImages",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_IsActive_DisplayOrder",
                table: "Products",
                columns: new[] { "IsActive", "DisplayOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductImages_ProductId_DisplayOrder",
                table: "ProductImages",
                columns: new[] { "ProductId", "DisplayOrder" });
        }
    }
}
