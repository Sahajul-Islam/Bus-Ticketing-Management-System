export class AppConstants {
  static apiUrl: string = "http://localhost:5001/api";
   //static apiUrl:string="http://localhost:26862/api";
   static rootUrl:string=  "http://localhost:5001";
   //static rootUrl:string=  "http://localhost:26862";
  static appName = "BTMS";
  static accessKey = 'C3194CB4-3C5E-45F0-A011-449DFB65A0EC';
  static navItems = [
    {
      label: 'Home',
      icon: 'home',
      link: '/home'
    },
    {

      label: 'Bus',
      icon: 'directions_bus',
      link: '/buses'

    },
    {

      label: 'Route',
      icon: 'alt_route',
      link: '/bus-routes'

    },
    {
      label: 'Schedules',
      icon: 'schedule',
      link: '/schedules'
    },
    {
      label:'Booking',
      icon:'book_online',
      link:'/bookings'
    },
    {
      label:'Tickets',
      icon:'confirmation_number',
      link:'/tickets'
    }
  ]
}
