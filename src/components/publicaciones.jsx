import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { db } from '../firebase'
import { collection, doc, addDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore'

const Publicaciones = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  const [id, setId] = useState(0)
  const [listaPublicaciones, setListaPublicaciones] = useState([])
  const [modoEdicion, setModoEdicion] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [fechacrea, setFechaCrea] = useState('')
  const [autor, setAutor] = useState('')

  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, 'publicaciones'), (query) => {
          setListaPublicaciones(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })
      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos();
  }, [])

  const validarCampos = () => {
    setError(null);

    if (titulo.trim() === '' || contenido.trim() === '') {
      setError('Los campos de título y/o contenido no pueden estar vacíos.');
      return false;
    }

    if (fechacrea.trim() === '' || !/^\d{4}-\d{2}-\d{2}$/.test(fechacrea)) {
      setError('La fecha no debe estar vacia y debe tener el formato YYYY-MM-DD.');
      return false;
    }

    if (autor.trim() === '') {
      setError('El campo de auto no puede ser vacio')
      return false;
    }
    return true;
  };

  const editar = item => {
    setTitulo(item.titulo)
    setContenido(item.contenido)
    setFechaCrea(item.fechacrea)
    setAutor(item.autor)
    setId(item.id)
    setModoEdicion(true)
  }

  const editarPublicaciones = async e => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    try {
      const docRef = doc(db, 'publicaciones', id);
      await updateDoc(docRef, {
        titulo: titulo,
        contenido: contenido,
        fechacrea: fechacrea,
        autor: autor
      })

      const nuevoArray = listaPublicaciones.map(
        item => item.id === id ? {
          id: id,
          titulo: titulo,
          contenido: contenido,
          fechacrea: fechacrea,
          autor: autor
        } : item
      )

      setListaPublicaciones(nuevoArray)
      setModoEdicion(false)
      setTitulo('')
      setContenido('')
      setFechaCrea('')
      setAutor('')
      setId('')
    } catch (error) {
      console.log(error)
    }
  }

  const cancelar = () => {
    setModoEdicion(false)
    setTitulo('')
    setContenido('')
    setFechaCrea('')
    setAutor('')
  }

  const guardarPublicaciones = async (e) => {
    e.preventDefault()

    if (!validarCampos()) {
      return;
    }

    try {
      const data = await addDoc(collection(db, 'publicaciones'), {
        titulo: titulo,
        contenido: contenido,
        fechacrea: fechacrea,
        autor: autor
      })
      setListaPublicaciones(
        [...listaPublicaciones, {
          id: data.id,
          titulo: titulo,
          contenido: contenido,
          fechacrea: fechacrea,
          autor: autor
        }]
      )
      setTitulo('')
      setContenido('')
      setFechaCrea('')
      setAutor('')
    } catch (error) {
      console.log(error)
    }
  }

  const eliminar = async id => {
    try {
      await deleteDoc(doc(db, 'publicaciones', id))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <button className="burger" onClick={toggleMenu}></button>
      <div className="menu closed">
        <nav>
          <h2>Menu de CRUDs</h2>
          <Link to="/" style={{ animationDelay: "0.2s" }}><strong>Regresar</strong></Link>
          <br />
          <h2>Otros CRUDs</h2>
          <Link to="/productos" style={{ animationDelay: "0.3s" }}><strong>Productos</strong></Link>
          <Link to="/clientes" style={{ animationDelay: "0.4s" }}><strong>Clientes</strong></Link>
          <Link to="/tareas" style={{ animationDelay: "0.5s" }}><strong>Tareas</strong></Link>
          <Link to="/empleados" style={{ animationDelay: "0.7s" }}><strong>Empleados</strong></Link>
        </nav>
      </div>

      <div className='container mt-5'>
        <h1 className="text-center text-light">Publicaciones</h1>
        <hr />
        <div className="row">
          <div className="col-8">
            <h4 className="text-center text-light">Lista de Publicaciones</h4>
            <ul className="list-group">
              {
                listaPublicaciones.map(item => (
                  <li className="list-group-item" key={item.id}>
                    <span className="lead">
                      Titulo: {item.titulo}<br>
                      </br>Contenido: {item.contenido}<br>
                      </br>Fecha de Creación: {item.fechacrea}<br>
                      </br>Autor: {item.autor}<br>
                      </br>
                    </span>
                    <button className='btn btn-danger btn-sm fload-end mx-2' onClick={() => eliminar(item.id)}>Eliminar</button>
                    <button className="btn btn-dark btn-sm fload-end" onClick={() => editar(item)}>Editar</button>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="col-4">
            <h4 className="text-center text-light">{modoEdicion ? 'Editar Publicación' : 'Añadir Publicación'}</h4>
            <form onSubmit={modoEdicion ? editarPublicaciones : guardarPublicaciones}>
              <div class="input-group mb-3">
                <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> title </span>
                <input type="text" className="form-control mb-2" placeholder="Ingrese un titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> article </span>
                <textarea type="text" className="form-control mb-2" placeholder="Ingrese el contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> calendar_month </span>
                <input type="text" className="form-control mb-2" placeholder="Ingrese fecha creación (YYYY-MM-DD)" value={fechacrea} onChange={(e) => setFechaCrea(e.target.value)} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> person </span>
                <input type="text" className="form-control mb-2" placeholder="Ingrese un autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
              </div>
              <div className="d-grid gap-2">
                {
                  modoEdicion ? (
                    <>
                      <button className="btn btn-dark col-12" on='submit'>Editar</button>
                      <button className='btn btn-danger btn-block' onClick={() => cancelar()}>Cancelar</button>
                    </>
                  ) :
                    <button className='btn btn-dark btn-block'>Agregar</button>
                }
              </div>
            </form>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="modal fade show"
          style={{ display: 'block' }}
          tabIndex="-1"
          role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content bg-dark">
              <div className="modal-header">
                <h5 className="modal-title">Error al ingresar datos</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setError(null)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{error}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                  onClick={() => setError(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Publicaciones