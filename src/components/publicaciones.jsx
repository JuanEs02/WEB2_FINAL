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
          <Link to="/reservas" style={{ animationDelay: "0.7s" }}><strong>Reservas</strong></Link>
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
              <input type="text" className="form-control mb-2" placeholder="Ingrese un titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese el contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese una fecha de creación" value={fechacrea} onChange={(e) => setFechaCrea(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese un autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
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
    </div>
  )
}

export default Publicaciones