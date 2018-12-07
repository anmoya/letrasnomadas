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


/* ############################# */   /*
*   MANTENEDOR FAQ
*/

    async function pintaFAQ() {
        zone.innerHTML = '';

        zone.innerHTML = await generaFAQ();

    }

    async function generaFAQ() {
        let data = await axios.get('/utilities/faq')
            .then(response => {
                // Copiamos response (Array) y lo ordenamos por order property.
                let sorted = response.data;
                sorted.sort(function (a, b) {
                    if (a["order"] === b["order"]) // si son iguales, ordenamos alfabéticamente
                        return a["title"] - b["title"];
                    else
                        return a["order"] - b["order"];
                });
                return sorted;
            }).catch(err => err);
        
            
        
            
        let faqs = data.map(item => {
            return `<div class="container">
                        <div class="faq" id="faq${item._id}">
                            <input    id="order-${item._id}" class="form-control" type="text" value="${item.order}" />
                            <input    id="title-${item._id}" class="form-control" type="text" value="${item.title}" placeholder="Título" />
                            <textarea id="text-${item._id}" rows="5" class="form-control">${item.text}</textarea>
                            <button class="btn btn-warning" onclick="updateFAQ('${item._id}')">Actualizar</button>
                            <button class="btn btn-danger" onclick="deleteFAQ('${item._id}')">Borrar</button>
                        </div>
                    </div>`;
        }).join(''); // join('') evita una coma que genera el map

        faqs += `
            <div class="container" id="FAQ-create">
                <div class="faq" id="vacio">
                    <input class="form-control" type="text" value="" id="vacio-order" />
                    <input class="form-control" type="text" value="" id="vacio-titulo" placeholder="Título" />
                    <textarea rows="5" class="form-control" id="vacio-texto"></textarea>
                    <button id="crea-faq" class="btn btn-info" onclick="creaFaq()">Agregar</button>
                </div>
            </div>
        `;


        return faqs;
    }

    async function creaFaq() {
        const order = document.getElementById("vacio-order");
        const titulo = document.getElementById("vacio-titulo");
        const texto = document.getElementById("vacio-texto");

        function convertirASubtipo(str) {
            let str2 = str.replace(/ /g, "-");
            str2 = str.replace(/\?/g, "");
            str2 = str.replace(/¿/g, "");
            return str2;
        }

        const validacion = validaCampos(order, titulo, texto);
        const isValido = validacion.length === 0 ? true : false;
        let data;

        if (isValido) {
            let sendUti = {
                type: "FAQ",
                title: titulo.value,
                text: texto.value,
                Subtype: convertirASubtipo(titulo.value),
                order: order.value
            }

            data = await axios({
                method: 'POST',
                url: '/utilities',
                data: {
                    utilidad: sendUti
                }
            })
            .then(response => response.data)
            .catch(err => err);
        } else {
            let str = '';
            alert("No valido");
            validacion.forEach(item => {
                str += item.campo + ' ' + item.motivo + '\n';
            });

        }

        alert(data.message);
        pintaFAQ();
    }


    function validaCampos(...args) {

        const [order, titulo, texto] = [...args];
        const arr = [...args];

        let elementosValidados =
            arr.filter(item => item.value === "")
                .map(obj => {
                    let auxObj = {};
                    let extraeId = obj.id.substr(6);
                    auxObj["campo"] = extraeId;
                    auxObj["motivo"] = "vacio";
                    return auxObj;
                });

        if (isNaN(order.value))
            elementosValidados.push({ "campo": "orden", "motivo": "No es un número." });

        if (titulo.value.length < 5)
            elementosValidados.push({ "campo": "titulo", "motivo": "No cumple largo: 5." });
        if (texto.value.length < 25)
            elementosValidados.push({ "campo": "texto", "motivo": "No cumple largo: 25." });
        if (order < 0)
            elementosValidados.push({ "campo": "orden", "motivo": "No cumple largo minimo: 1." });


        return elementosValidados;
    }

    async function updateFAQ(dato) {
        const titulo = document.getElementById("title-" + dato);
        const order = document.getElementById("order-" + dato);
        const texto = document.getElementById("text-" + dato);

        const faq = {
            title: titulo.value,
            text: texto.value,
            order: order.value
        }

        const data = await axios({
            method: 'put',
            url: '/utilities',
            data: {
                id: dato,
                utilidad: faq
            }
        })
            .then(response => response.data)
            .catch(err => err);

        alert(data.message);


    }

    async function deleteFAQ(dato) {
        const faqDIV = document.getElementById('faq' + dato);

        const data = await axios({
            method: 'delete',
            url: '/utilities',
            data: {
                id: dato
            }
        })
            .then(response => response.data)
            .catch(err => err);

        if (data.status === "OK")
            faqDIV.style.display = "none";
        if (data.code === "Error")
            console.log(data.obj);

        alert(data.message);
    }

/* ############################ */
    /* METODOS PARA MEDIOS ENTREGA  */
    

    async function pintaMediosEntrega() {
        zone.innerHTML = '';
        zone.innerHTML = await generaMediosEntrega();
    }

    async function generaMediosEntrega() {
        const titulo = document.getElementById('ME-titulo');
        const texto = document.getElementById('ME-texto');
        const bDelete = document.getElementById('ME-delete');
        const bActualizar = document.getElementById('ME-actualizar');

        const meCount = await axios.get('/utilities/me')
            .then(response => response.data)
            .catch(err => console.log(err));

        const id = meCount.length > 0 ? meCount[0]._id : 0;

        const putView = `
                <h1>Medios de Entrega</h1>
                <div class="container">
                    <input    class="form-control" id="ME-titulo" type="text" placeholder="Título" value="${meCount.length > 0 ? meCount[0].title : ""}"/>
                    <textarea class="form-control" id="ME-texto"  rows="5"    placeholder="Cuerpo página">${meCount.length > 0 ? meCount[0].text : ""}</textarea>
                    <button   class="btn btn-info" id="ME-actualizar" onclick="enviaMedioEntrega('${id}')">${meCount.length > 0 ? "Actualizar" : "Crear"}</button>
                    <button class="btn btn-danger" id="ME-delete" onclick="deleteMedioEntrega('${id}')" ${id === 0 ? "disabled" : ""}>Borrar</button>
                </div>`;

        return putView;
    }

    async function enviaMedioEntrega(id) {
        const titulo = document.getElementById('ME-titulo');
        const texto = document.getElementById('ME-texto');
        const bDelete = document.getElementById('ME-delete');
        const bActualizar = document.getElementById('ME-actualizar');
        const m = (id == 0) ? "post" : "put";
        

        if (titulo.value.length > 10 && titulo.value.length > 20) {
            const me = {
                title: titulo.value,
                text: texto.value,
                order: 0,
                type: 'ME',
                Subtype: ''
            }

            const retorno = await axios({
                method: m,
                url: '/utilities',
                data: {
                    id: id,
                    utilidad: me
            }})
            .then( response => response.data )
            .catch(err => console.log(err));

            alert(retorno.message);
            bDelete.removeAttribute('disabled','disabled');
            bActualizar.setAttribute('disabled', 'disabled');





        } else {
            alert("Título debe tener mas de 10 carácteres y cuerpo debe tener mas de 20");
        }




    }

    async function deleteMedioEntrega(id) {
        

        const retorno = await axios({
            method: 'delete',
            url: '/utilities',
            data: {
                id: id
            }
        })
        .then( response => response.data )
        .catch( err => console.log(err));

        alert(retorno.message);
        titulo.value = '';
        texto.value = '';
        bDelete.setAttribute('disabled','disabled');
        bActualizar.removeAttribute('disabled','disabled');
        

    }