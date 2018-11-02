
// Fn: dibuja autores cuando son seleccionados
var paintAuthors = (e) => {
    if (e.value !== '0') {
        document.getElementById('authors-selected').innerHTML +=
            `<span id='${e.value}' style="margin-left: 5px; margin-right: 5px" class='authors-buble' onclick='deletePaintedAuthor(this)' 
        data-authorid='${e.value}'>${e.options[e.selectedIndex].text} x </span>`;
    }

}

// Fn: elimina el autor al hacer click sobre el
var deletePaintedAuthor = (e) => {
    e.parentNode.removeChild(e);
}

// Fn: agrupa todos los autores (spans). Mapea el id de mongoose
// Fn: devuelve todo como array
var getAuthors = () => {
    let authorsSpan = document.getElementsByTagName('span');

    let authorsArray = Array.from(authorsSpan).map((x) => {
        return x.dataset.authorid;
    });
    authorsArray.shift();
    return authorsArray;
}

// Obj: form
let createForm = document.getElementById('createBookForm');

// Fn: al submit de form usa createBook para mandar por ajax.
// Pasa los autores.
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let authorsArr = getAuthors();
    createBook(authorsArr);
});

var createBook = (auths) => {
    if (auths.length < 1)
        alert('Debes elegir al menos un autor.');
    else {
        var formData = {
            tituloLibro: document.getElementById('tituloLibro').value,
            subtituloLibro: document.getElementById('subtituloLibro').value,
            nuevo: 'on',
            anioPublicacion: document.getElementById('anioPublicacionLibro').value,
            pais: document.getElementById('paisLibro').value,
            ciudad: document.getElementById('ciudadLibro').value,
            editorial: document.getElementById('editorialLibro').value,
            img: document.getElementById('imgLibro').value,
            authors: auths,
            descripcion: document.getElementById('descripcionLibro').value,
            stock: document.getElementById('stockLibro').value,
            nuevo: document.getElementById('nuevoLibro').value,
            categoria: document.getElementById('categoriaLibro').value,
            temas: document.getElementById('temasLibro').value,
            keywords: document.getElementById('keywordsLibro').value,
            precio: document.getElementById('precioLibro').value,
            precioOferta: document.getElementById('precioOfertaLibro').value,
            destacado: document.getElementById('destacadoLibro').checked ? true : false,
            oferta: document.getElementById('ofertaLibro').checked ? true : false
        }

        
        var metodo = window.location.pathname == '/catalogo/create' ? 'POST' : 'PUT';
        console.log(`Haré un post a ${window.location.pathname} por ${metodo}`);

        axios.put(window.location.pathname, formData)
        .then( res  => {
            alert(  `El libro ha sido actualizado correctamente.\n
                    Libro: ${res.data.titulo}
                    `);
        })
        .catch( data  => console.log(data));
    }
};

