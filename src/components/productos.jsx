import React, { useState, useEffect } from 'react'
import './assets/productos/productos.css'
import { Link } from 'react-router-dom';
import { db } from '../firebase'
import { collection, doc, addDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore'

const Productos = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  const [id, setId] = useState(0)
  const [listaProductos, setListaProductos] = useState([])
  const [modoEdicion, setModoEdicion] = useState(false)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState(0)
  const [cantidad_disponible, setCantidadDisponible] = useState(0)

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, 'productos'), (query) => {
          setListaProductos(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })
      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos();
  }, [])

  const editar = item => {
    setNombre(item.nombre)
    setDescripcion(item.descripcion)
    setPrecio(item.precio)
    setCantidadDisponible(item.cantidad_disponible)
    setId(item.id)
    setModoEdicion(true)
}


const editarProductos = async e => {
  e.preventDefault();

  try {
      const docRef = doc(db, 'productos', id);
      await updateDoc(docRef, {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        cantidad_disponible: cantidad_disponible
      })

      const nuevoArray = listaProductos.map(
          item => item.id === id ? {
              id: id,
              nombre: nombre,
              descripcion: descripcion,
              precio: precio,
              cantidad_disponible: cantidad_disponible
          } : item
      )

      setListaProductos(nuevoArray)
      setModoEdicion(false)
      setNombre('')
      setDescripcion('')
      setPrecio('')
      setCantidadDisponible('')
      setId('')
  } catch (error) {
      console.log(error)
  }
}

const cancelar = () => {
  setModoEdicion(false)
  setNombre('')
  setDescripcion('')
  setPrecio('')
  setCantidadDisponible('')
}

  const guardarProductos = async (e) => {
    e.preventDefault()

    try {
      const data = await addDoc(collection(db, 'productos'), {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        cantidad_disponible: cantidad_disponible
      })
      setListaProductos(
        [...listaProductos, {
          id: data.id,
          nombre: nombre,
          descripcion: descripcion,
          precio: precio,
          cantidad_disponible: cantidad_disponible
        }]
      )
      setNombre('')
      setDescripcion('')
      setPrecio('')
      setCantidadDisponible('')
    } catch (error) {
      console.log(error)
    }
  }

  const eliminar = async id => {
    try {
        await deleteDoc(doc(db, 'productos', id))
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
          <Link to="/clientes" style={{ animationDelay: "0.3s" }}><strong>Clientes</strong></Link>
          <Link to="/tareas" style={{ animationDelay: "0.4s" }}><strong>Tareas</strong></Link>
          <Link to="/publicaciones" style={{ animationDelay: "0.5s" }}><strong>Publicaciones</strong></Link>
          <Link to="/reservas" style={{ animationDelay: "0.7s" }}><strong>Reservas</strong></Link>
        </nav>
      </div>

      <div className='container mt-5'>
        <h1 className="text-center text-light">Productos</h1>
        <hr />
        <div className="row">
          <div className="col-8">
            <h4 className="text-center text-light">Lista de Productos</h4>
            <ul className="list-group">
              {
                listaProductos.map(item => (
                  <li className="list-group-item" key={item.id}>
                    <span className="lead">
                      Nombre: {item.nombre}<br>
                      </br>Descripcion: {item.descripcion}<br>
                      </br>Precio: {item.precio}<br>
                      </br>Cantidad disponible: {item.cantidad_disponible}<br>
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
            <h4 className="text-center text-light">{modoEdicion ? 'Editar Producto' : 'Añadir Producto'}</h4>
            <form onSubmit={modoEdicion ? editarProductos : guardarProductos}>
              <input type="text" className="form-control mb-2" placeholder="Ingrese un nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese una descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese el precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese la cantidad" value={cantidad_disponible} onChange={(e) => setCantidadDisponible(e.target.value)} />
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

export default Productos