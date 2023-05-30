import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { db } from '../firebase'
import { collection, doc, addDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore'

const Clientes = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  const [id, setId] = useState(0)
  const [listaClientes, setListaClientes] = useState([])
  const [modoEdicion, setModoEdicion] = useState(false)

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [detalle, setDetalle] = useState('')

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, 'clientes'), (query) => {
          setListaClientes(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })
      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos();
  }, [])

  const editar = item => {
    setNombre(item.nombre)
    setCorreo(item.correo)
    setTelefono(item.telefono)
    setDetalle(item.detalle)
    setId(item.id)
    setModoEdicion(true)
}

const editarClientes = async e => {
  e.preventDefault();

  try {
      const docRef = doc(db, 'clientes', id);
      await updateDoc(docRef, {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        detalle: detalle
      })

      const nuevoArray = listaClientes.map(
          item => item.id === id ? {
              id: id,
              nombre: nombre,
              correo: correo,
              telefono: telefono,
              detalle: detalle
          } : item
      )

      setListaClientes(nuevoArray)
      setModoEdicion(false)
      setNombre('')
      setCorreo('')
      setTelefono('')
      setDetalle('')
      setId('')
  } catch (error) {
      console.log(error)
  }
}

const cancelar = () => {
  setModoEdicion(false)
  setNombre('')
  setCorreo('')
  setTelefono('')
  setDetalle('')
}

const guardarClientes = async (e) => {
  e.preventDefault()

  try {
    const data = await addDoc(collection(db, 'clientes'), {
      nombre: nombre,
      correo: correo,
      telefono: telefono,
      detalle: detalle
    })
    setListaClientes(
      [...listaClientes, {
        id: data.id,
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        detalle: detalle
      }]
    )
    setNombre('')
    setCorreo('')
    setTelefono('')
    setDetalle('')
  } catch (error) {
    console.log(error)
  }
}

const eliminar = async id => {
  try {
      await deleteDoc(doc(db, 'clientes', id))
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
          <Link to="/" style={{animationDelay: "0.2s"}}><strong>Regresar</strong></Link>
          <br/>
          <h2>Otros CRUDs</h2>
          <Link to="/productos" style={{animationDelay: "0.3s"}}><strong>Productos</strong></Link>
          <Link to="/tareas" style={{animationDelay: "0.4s"}}><strong>Tareas</strong></Link>
          <Link to="/publicaciones" style={{animationDelay: "0.5s"}}><strong>Publicaciones</strong></Link>
          <Link to="/empleados" style={{animationDelay: "0.7s"}}><strong>Empleados</strong></Link>
        </nav>
      </div>

      <div className='container mt-5'>
        <h1 className="text-center text-light">Clientes</h1>
        <hr />
        <div className="row">
          <div className="col-8">
            <h4 className="text-center text-light">Lista de Clientes</h4>
            <ul className="list-group">
              {
                listaClientes.map(item => (
                  <li className="list-group-item" key={item.id}>
                    <span className="lead">
                      Nombre: {item.nombre}<br>
                      </br>Correo: {item.correo}<br>
                      </br>Telefono: {item.telefono}<br>
                      </br>Detalle: {item.detalle}<br>
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
            <form onSubmit={modoEdicion ? editarClientes : guardarClientes}>
              <input type="text" className="form-control mb-2" placeholder="Ingrese un nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese un correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese un telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese un detalle" value={detalle} onChange={(e) => setDetalle(e.target.value)} />
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

export default Clientes