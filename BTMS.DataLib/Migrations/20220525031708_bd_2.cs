using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BTMS.DataLib.Migrations
{
    public partial class bd_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "BookingDate",
                table: "Bookings",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "date");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "BookingDate",
                table: "Bookings",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateTime));
        }
    }
}
