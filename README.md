# 🚀 Welcome to your new awesome project!

To build project after modifying code in src/ folder, run `npm run build`

To keep refreshing when modifying code in development environment in src/ folder, run `npm run watch`

Run iframe.html to test iframe, which endpoint is served in 2 different projects. The first project served api in one amazon host,
the other project served fetching chartjs diagram in another amazon hosts. There are 2 amazon hosts in total.

Api is fetched using json-server library, refer to `https://github.com/typicode/json-server` for more details

Project is using lazy loading chart, which use IntersectionObserver to achieve this.