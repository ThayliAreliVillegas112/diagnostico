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
    do {//dentro de este do while hacemos que por lo menos se ejecute una vez y dentro de el se les asigna a las variables row y col un numero entre 0 y 5
      //siempre y cuando tengan valores nulos
      row = Math.floor(Math.random() * 6);
      col = Math.floor(Math.random() * 6);
    } while (matrix[row][col] !== null);
    //una vez que encontrada una posición vacia (sin color) se le asigna el color correspondiente
    matrix[row][col] = colores[colorIndex];
    console.log(matrix[row][col]);
  }

  //de devuelve la matriz en formato json
  res.json(matrix);
  console.log(matrix);
});

app.get('/', (req, res) => { //función mandada a llamar con get 
    let i =0;
    let j=0;
    //se define la plantilla con las comillas simples invertidas
    //le di un ancho y alto a cada casilla del arreglo y un borde
    // Array.from crea una fila con la etiqyeta tr y otra con td y cada espacio dentro de la celda tiene un id que lo identifica
    // join() es para convertir tanto las filas como las celdas en cadenas de texto y concatenarlas juntas para formar el contenido completo de la tabla
   res.send(` 
    <!DOCTYPE html>
    <html>
      <head>
        <title>DIAGNOSTICO</title>
        <style>
          td {
            width: 50px;
            height: 50px;
            border: 0.5px solid black;
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


// La función updateTable(matrix) se encarga de actualizar la tabla HTML con la matriz de colores
// recorriendola con los for each y se accede a cada td con .cell[id="${i}-${j}"]
// se les asigna el color con la propiedad style.backgroundColor
/*
La función updateMatrix() utiliza la API Fetch para obtener la matriz de colores actualizada a través de 
una solicitud GET a la ruta /matrix. Cuando se recibe una respuesta, la función llama a la función 
updateTable(matrix) para actualizar la tabla HTML con la matriz de colores actualizada.

Por último, se llama a updateMatrix() una vez cuando se carga la página para actualizar la tabla con la 
matriz de colores inicial y luego se configura un intervalo de tiempo de 2 segundos para llamar a 
updateMatrix() y actualizar la tabla HTML periódicamente.
*/