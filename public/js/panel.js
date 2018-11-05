// document.addEventListener('DOMContentLoaded', async () => {
//     let url = window.location.href;
//     let obj = getAllUrlParams(url);
//     if (obj.modo = 'r'){
//         await generaResena();
//     }
// })

var zone = document.getElementById('admin-functionpainted-zone');
async function pintaOfertas() {
    zone.innerHTML = '';
    let data = await fetch('/admin/ofertas', {
        method: 'GET'
    })
        .then((response) => response.json()
        )
        .then((libros) => libros);

    let libros = await generaOfertas(data);
    zone.innerHTML = ``;
    zone.innerHTML += libros;
    zone.innerHtml += `</table>`;
}

async function pintaDestacado() {
    zone.innerHTML = '';
    zone.innerHTML += `<h1>Libro destacado:</h1>`;

    let data = await axios.get('/admin/destacado', {
        method: 'GET'
    })
        .then(response => response.data)
        .catch(error => console.log(error));

    zone.innerHTML += `<table class='table'>
            <tr>
                    <td>${data[0]._id}</td>
                    <td>${data[0].titulo}</td>
                    <td><button onclick='quitar(this)' class='btn btn-warning' data-isoferta='${data[0].oferta}'>Quitar Oferta</button></td>
            </tr>`;
    zone.innerHtml += `</table>`;


    console.log(data);
}

function pintaLibros() {
    zone.innerHTML = '';
    zone.innerHTML = `<h1>Libros</h1>`;
}

function pintaResena() {
    zone.innerHTML = '';
    zone.innerHTML = `<h1>Gestión Reseña</h1>
                        <div class='container'>
                            <input id='resena-id-libro' type='text' class='form-control'>
                            <button id='resena-busca-id' onclick='generaResena()'>Buscar</button>
                        </div>
                        <div id='resena-libro-encontrado'>
                        </div>
                     `;
}

function pintaGeneric() {
    zone.innerHTML = '';
    zone.innerHTML = `<h1>Generic</h1>`;
}

//#######################################
//   Toma la data y la convierte en
//   filas de tabla, si oferta is true
//#######################################
async function generaOfertas(data) {
    let html = '<table class="table">';
    data.forEach((item) => {
        if (item.oferta) {
            html += `<tr>
                    <td>${item._id}</td>
                    <td>${item.titulo}</td>
                    <td>
                        <button onclick='quitar(this)' class='btn btn-warning' data-isoferta='${item.oferta}'>Quitar Oferta</button>
                    </td>
                </tr>`;
        }
    });

    html += '</table>';
    return html;
}

async function generaDestacado(data) {
    let html = '<table class="table">';
    data.forEach((item) => {
        html += `<tr>
                    <td>${item._id}</td>
                    <td>${item.titulo}</td>
                    <td><button onclick='quitar(this)' class='btn btn-warning' data-isoferta='${item.oferta}'>Quitar Oferta</button></td>
                </tr>`;

    });

    html += '</table>';
    return html;
}

function quitar(elemento) {
    let tr = elemento.parentNode.parentNode;
    let id = tr.childNodes[1].innerHTML;
    console.log(tr);
    console.log(id);

    axios.put('/admin/ofertas/quitar', {
        id: id
    })
        .then(function (response) {
            if (response.data)
                tr.style.display = 'none';
            else
                throw Error('No recibimos respuesta');
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        });

}

async function generaResena() {
    let id = '5b8f10d140d62b0a1fbca144';
    let libro = await axios.post('/index/libroporid', {
        identificador: id
    })
        .then(response => response.data)
        .catch(err => console.log(err));

    let zona2 = document.getElementById('resena-libro-encontrado');
    zona2.innerHTML = pintaLibro(libro);
};

function pintaLibro(obj) {
    let resenias = obj.resenias;
    let cuenta = resenias.length;

    return `<div class='container'>
                <h3>${obj.titulo}</h3>
                <input id='resena-id-libro-hidden' type='hidden' value=${obj._id} />
                <p>Tiene ${cuenta} reseñas. Puedes añadir ${cuenta === 0 ? 'una' : 'otras'} abajo.</p>
                <br><br>
                <div class='container'>
                    <dl class='row'>
                        <dt class='col-1'>Título</dt>
                        <dd class='col-3'><input id='resena-titulo' class='form-control' ></dd>
                        <dt class='col-1'>Nombre Autor</dt>
                        <dd class='col-3'><input id='resena-autor-nombre' class='form-control' ></dd>
                        <dt class='col-1'>Apellido Autor</dt>
                        <dd class='col-3'><input id='resena-autor-apellido' class='form-control' ></dd>
                        <dt class='col-1'>Link</dt>
                        <dd class='col-11'><input id='resena-link' class='form-control' ></dd>
                        
                        <button onclick='agregarResenia()'>Agregar</button>
                    </dl>
                </div>
            </div>`;
}

async function agregarResenia() {
    let titulo = document.getElementById('resena-titulo');
    let nombre = document.getElementById('resena-autor-nombre');
    let apellido = document.getElementById('resena-autor-apellido');
    let link = document.getElementById('resena-link');
    let idLibro = document.getElementById('resena-id-libro-hidden');

    let objResenia = new Object({
        nombreAutor: nombre.value,
        apellidoAutor: apellido.value,
        titulo: titulo.value,
        link: link.value
    });


    let retorno = await axios.post('/index/agregarResenia', {
        obj: objResenia,
        libro: idLibro.value
    })
        .then(response => console.log(response))
        .catch(err => console.log(err));
}

function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}