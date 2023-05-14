const express = require('express');
const app = express();

//6 colores staticos
const colores = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];

app.get('/matrix', (req, res) => {

    //se crea el array de 6x6 en donde cada elemento del array tiene el valor de "null"
  const matrix = Array.from({ length: 6 }, () => {
    return Array.from({ length: 6 }, () => null);
  });

  for (let i = 0; i < 6; i++) {
    let colorIndex = Math.floor(Math.random() * colores.length); //se signa un indice a un color de manera leatoria
    console.log(colorIndex);
    let row, col; //variablespara definir las columnas y las filas
    do { //dentro de este do while hacemos que por lo menos se ejecute una vez y dentro de el se les asigna a las variables row y col un numero entre 0 y 5
      row = Math.floor(Math.random() * 6);
      col = Math.floor(Math.random() * 6);
    } while (matrix[row][col] !== null);

    matrix[row][col] = colores[colorIndex];
    console.log(matrix[row][col]);
  }

  res.json(matrix);
  console.log(matrix);
});

app.get('/', (req, res) => {
    let i =0;
    let j=0;
    
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Matrix</title>
        <style>
          td {
            width: 50px;
            height: 50px;
            border: 1px solid black;
          }
        </style>
      </head>
      <body>
        <table>
        ${Array.from({ length: 6 }, (_, i) => `
        <tr>
          ${Array.from({ length: 6 }, (_, j) => `
            <td id="${i}-${j}" class="cell"></td>
          `).join('')}
        </tr>
      `).join('')}
      
        </table>
        <script>
          function updateTable(matrix) {
            matrix.forEach((row, i) => {
              row.forEach((color, j) => {
                let cell = document.querySelector(\`.cell[id="\${i}-\${j}"]\`);
                cell.style.backgroundColor = color;
              });
            });
          }

          function updateMatrix() {
            fetch('/matrix')
              .then(response => response.json())
              .then(matrix => {
                updateTable(matrix);
              });
          }

          updateMatrix(); // Llamamos a la función al cargar la página
          setInterval(updateMatrix, 2000);
        </script>
      </body>
    </html>
  `);
});

app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), () =>{
    console.log("Server on port", app.get('port'));
})
