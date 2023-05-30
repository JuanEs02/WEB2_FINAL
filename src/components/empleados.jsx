import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { db } from '../firebase'
import { collection, doc, addDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore'

const Empleados = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  const [id, setId] = useState(0)
  const [listaEmpleados, setListaEmpleados] = useState([])
  const [modoEdicion, setModoEdicion] = useState(false)

  const [nombre, setNombre] = useState('')
  const [cargo, setCargo] = useState('')
  const [departamento, setDepartamento] = useState('')
  const [fechacontra, setFechaContra] = useState('')
  const [telefono, setTelefono] = useState('')
  const [correo, setCorreo] = useState('')

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, 'empleados'), (query) => {
          setListaEmpleados(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })
      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos();
  }, [])

  const editar = item => {
    setNombre(item.nombre)
    setCargo(item.cargo)
    setDepartamento(item.departamento)
    setFechaContra(item.fechacontra)
    setTelefono(item.telefono)
    setCorreo(item.correo)
    setId(item.id)
    setModoEdicion(true)
  }

  const editarEmpleados = async e => {
    e.preventDefault();

    try {
      const docRef = doc(db, 'empleados', id);
      await updateDoc(docRef, {
        nombre: nombre,
        cargo: cargo,
        departamento: departamento,
        fechacontra: fechacontra,
        correo: correo,
        telefono: telefono
      })

      const nuevoArray = listaEmpleados.map(
        item => item.id === id ? {
          id: id,
          nombre: nombre,
          cargo: cargo,
          departamento: departamento,
          fechacontra: fechacontra,
          correo: correo,
          telefono: telefono
        } : item
      )

      setListaEmpleados(nuevoArray)
      setModoEdicion(false)
      setNombre('')
      setCargo('')
      setDepartamento('')
      setFechaContra('')
      setTelefono('')
      setCorreo('')
      setId('')
    } catch (error) {
      console.log(error)
    }
  }

  const cancelar = () => {
    setModoEdicion(false)
    setNombre('')
    setCargo('')
    setDepartamento('')
    setFechaContra('')
    setTelefono('')
    setCorreo('')
  }

  const guardarEmpleados = async (e) => {
    e.preventDefault()

    try {
      const data = await addDoc(collection(db, 'empleados'), {
        nombre: nombre,
        cargo: cargo,
        departamento: departamento,
        fechacontra: fechacontra,
        correo: correo,
        telefono: telefono
      })
      setListaEmpleados(
        [...listaEmpleados, {
          id: data.id,
          nombre: nombre,
          cargo: cargo,
          departamento: departamento,
          fechacontra: fechacontra,
          correo: correo,
          telefono: telefono
        }]
      )
      setNombre('')
      setCargo('')
      setDepartamento('')
      setFechaContra('')
      setTelefono('')
      setCorreo('')
    } catch (error) {
      console.log(error)
    }
  }

  const eliminar = async id => {
    try {
      await deleteDoc(doc(db, 'empleados', id))
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
          <Link to="/clientes" style={{animationDelay: "0.4s"}}><strong>Clientes</strong></Link>
          <Link to="/tareas" style={{animationDelay: "0.5s"}}><strong>Tareas</strong></Link>
          <Link to="/Publicaciones" style={{animationDelay: "0.7s"}}><strong>Publicaciones</strong></Link>
        </nav>
      </div>

      <div className='container mt-5'>
        <h1 className="text-center text-light">Empleados</h1>
        <hr />
        <div className="row">
          <div className="col-8">
            <h4 className="text-center text-light">Lista de Empleados</h4>
            <ul className="list-group">
              {
                listaEmpleados.map(item => (
                  <li className="list-group-item" key={item.id}>
                    <span className="lead">
                      Nombre: {item.nombre}<br>
                      </br>Cargo: {item.cargo}<br>
                      </br>Departamento: {item.departamento}<br>
                      </br>Fecha de contratación: {item.fechacontra}<br>
                      </br>Correo: {item.correo}<br>
                      </br>Telefono: {item.telefono}<br>
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
            <h4 className="text-center text-light">{modoEdicion ? 'Editar Empleado' : 'Añadir Empleado'}</h4>
            <form onSubmit={modoEdicion ? editarEmpleados : guardarEmpleados}>
              <input type="text" className="form-control mb-2" placeholder="Ingrese un nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese el cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese un departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese la fecha de contratacción" value={fechacontra} onChange={(e) => setFechaContra(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese un correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              <input type="text" className="form-control mb-2" placeholder="Ingrese un telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
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

export default Empleados