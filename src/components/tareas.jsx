import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { db } from '../firebase'
import { collection, doc, addDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore'

const Tareas = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  const [id, setId] = useState(0)
  const [listaTareas, setListaTareas] = useState([])
  const [modoEdicion, setModoEdicion] = useState(false)

  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescricpion] = useState('')
  const [estado, setEstado] = useState('')
  const [fechavenc, setFechaVenc] = useState('')

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, 'tareas'), (query) => {
          setListaTareas(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })
      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos();
  }, [])

  const editar = item => {
    setTitulo(item.titulo)
    setDescricpion(item.descripcion)
    setEstado(item.estado)
    setFechaVenc(item.fechavenc)
    setId(item.id)
    setModoEdicion(true)
  }

  const editarTareas = async e => {
    e.preventDefault();

    try {
      const docRef = doc(db, 'tareas', id);
      await updateDoc(docRef, {
        titulo: titulo,
        descripcion: descripcion,
        estado: estado,
        fechavenc: fechavenc
      })

      const nuevoArray = listaTareas.map(
        item => item.id === id ? {
          id: id,
          titulo: titulo,
          descripcion: descripcion,
          estado: estado,
          fechavenc: fechavenc
        } : item
      )

      setListaTareas(nuevoArray)
      setModoEdicion(false)
      setTitulo('')
      setDescricpion('')
      setEstado('')
      setFechaVenc('')
      setId('')
    } catch (error) {
      console.log(error)
    }
  }

  const cancelar = () => {
    setModoEdicion(false)
    setTitulo('')
    setDescricpion('')
    setEstado('')
    setFechaVenc('')
  }

  const guardarTareas = async (e) => {
    e.preventDefault()

    try {
      const data = await addDoc(collection(db, 'tareas'), {
        titulo: titulo,
        descripcion: descripcion,
        estado: estado,
        fechavenc: fechavenc
      })
      setListaTareas(
        [...listaTareas, {
          id: data.id,
          titulo: titulo,
          descripcion: descripcion,
          estado: estado,
          fechavenc: fechavenc
        }]
      )
      setTitulo('')
      setDescricpion('')
      setEstado('')
      setFechaVenc('')
    } catch (error) {
      console.log(error)
    }
  }

  const eliminar = async id => {
    try {
      await deleteDoc(doc(db, 'tareas', id))
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
          <Link to="/publicaciones" style={{ animationDelay: "0.5s" }}><strong>Publicaciones</strong></Link>
          <Link to="/empleados" style={{ animationDelay: "0.7s" }}><strong>Empleados</strong></Link>
        </nav>
      </div>

      <div className='container mt-5'>
        <h1 className="text-center text-light">Tareas</h1>
        <hr />
        <div className="row">
          <div className="col-8">
            <h4 className="text-center text-light">Lista de Tareas</h4>
            <ul className="list-group">
              {
                listaTareas.map(item => (
                  <li className="list-group-item" key={item.id}>
                    <span className="lead">
                      Titulo: {item.titulo}<br>
                      </br>Descripción: {item.descripcion}<br>
                      </br>Estado: {item.estado}<br>
                      </br>Fecha Vencimiento: {item.fechavenc}<br>
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
            <h4 className="text-center text-light">{modoEdicion ? 'Editar Tarea' : 'Añadir Tarea'}</h4>
            <form onSubmit={modoEdicion ? editarTareas : guardarTareas}>
              <input type="text" className="form-control mb-2" placeholder="Ingrese un titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese un descipcion" value={descripcion} onChange={(e) => setDescricpion(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese el estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese una fecha de vencimiento" value={fechavenc} onChange={(e) => setFechaVenc(e.target.value)} />
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

export default Tareas   