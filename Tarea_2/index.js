const http = require('http');
const { URL } = require('url');
const ExcelJS = require('exceljs');

async function handleReporte(res) {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Servidor de Reportes';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Ventas', {
      views: [{ state: 'frozen', ySplit: 1 }]
    });

    sheet.columns = [
      { header: 'Producto', key: 'producto', width: 36 },
      { header: 'Cantidad', key: 'cantidad', width: 12 },
      { header: 'Precio',   key: 'precio',   width: 14 },
    ];
    sheet.getRow(1).font = { bold: true };
    sheet.getColumn('precio').numFmt = '#,##0.00'; // numérico

    const videojuegos = [
      { producto: 'The Legend of Zelda: Tears of the Kingdom', cantidad: 8,  precio: 299.90 },
      { producto: 'Super Mario Odyssey',                       cantidad: 10, precio: 249.90 },
      { producto: 'God of War Ragnarök',                       cantidad: 7,  precio: 319.90 },
      { producto: 'Red Dead Redemption 2',                     cantidad: 6,  precio: 199.90 },
      { producto: 'Grand Theft Auto V',                        cantidad: 12, precio: 139.90 },
      { producto: 'Minecraft',                                 cantidad: 20, precio: 99.90  },
      { producto: 'Elden Ring',                                cantidad: 9,  precio: 279.90 },
      { producto: 'Call of Duty: Modern Warfare II',           cantidad: 5,  precio: 299.90 },
      { producto: 'EA Sports FC 24',                           cantidad: 14, precio: 229.90 },
      { producto: 'Cyberpunk 2077',                            cantidad: 8,  precio: 179.90 },
      { producto: 'Horizon Forbidden West',                    cantidad: 6,  precio: 289.90 },
      { producto: 'The Last of Us Part II',                    cantidad: 5,  precio: 199.90 },
      { producto: 'Halo Infinite',                             cantidad: 7,  precio: 159.90 },
      { producto: 'Animal Crossing: New Horizons',             cantidad: 11, precio: 199.90 },
      { producto: 'Overwatch 2',                               cantidad: 9,  precio: 149.90 },
      { producto: 'Apex Legends',                              cantidad: 13, precio: 129.90 },
      { producto: 'Super Smash Bros. Ultimate',                cantidad: 10, precio: 239.90 },
      { producto: 'Marvel’s Spider-Man 2',                     cantidad: 6,  precio: 319.90 },
      { producto: 'Starfield',                                 cantidad: 5,  precio: 299.90 },
      { producto: 'Resident Evil 4 (Remake)',                  cantidad: 8,  precio: 259.90 },
    ];
    videojuegos.forEach(r => sheet.addRow(r));

    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="reporte.xlsx"',
      'Cache-Control': 'no-store',
    });

    await workbook.xlsx.write(res); // stream hacia la respuesta
    res.end();                      // cerrar respuesta
  } catch (err) {
    console.error('Error generando el Excel:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    res.end('Error al generar el Excel');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, 'http://localhost');
    if (req.method === 'GET' && (pathname === '/reporte' || pathname === '/reporte/')) {
      await handleReporte(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Visita /reporte para descargar el Excel');
    }
  } catch (err) {
    console.error('Error en el servidor:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    res.end('Error interno del servidor');
  }
});

server.listen(3000, () =>
  console.log('Servidor listo en http://localhost:3000  -> /reporte')
);
