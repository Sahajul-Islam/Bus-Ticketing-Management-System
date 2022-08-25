using Microsoft.EntityFrameworkCore.Migrations;

namespace BTMS.DataLib.Migrations
{
    public partial class bd_1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FareAmount",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "NumberOfSeats",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Bookings");

            migrationBuilder.AddColumn<string>(
                name: "BookingCode",
                table: "Bookings",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Customer",
                table: "Bookings",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Bookings",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Bookings",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SeatNumber",
                table: "Bookings",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TransactionId",
                table: "Bookings",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isConfirmed",
                table: "Bookings",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "isPaid",
                table: "Bookings",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookingCode",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Customer",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "SeatNumber",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "TransactionId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "isConfirmed",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "isPaid",
                table: "Bookings");

            migrationBuilder.AddColumn<decimal>(
                name: "FareAmount",
                table: "Bookings",
                type: "money",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfSeats",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                table: "Bookings",
                type: "money",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
