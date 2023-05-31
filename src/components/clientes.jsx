import React, { useState, useEffect } from 'react';
import './assets/productos/productos.css';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, addDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';

const Clientes = () => {
  const toggleMenu = () => {
    document.body.classList.toggle('open');
  };

  const [id, setId] = useState(0);
  const [listaClientes, setListaClientes] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [detalle, setDetalle] = useState('');

  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, 'clientes'), (query) => {
          setListaClientes(
            query.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        });
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatos();
  }, []);

  const editar = (item) => {
    setNombre(item.nombre);
    setCorreo(item.correo);
    setTelefono(item.telefono);
    setDetalle(item.detalle);
    setId(item.id);
    setModoEdicion(true);
  };

  const editarClientes = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    try {
      const docRef = doc(db, 'clientes', id);
      await updateDoc(docRef, {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        detalle: detalle
      });

      const nuevoArray = listaClientes.map((item) =>
        item.id === id
          ? {
              id: id,
              nombre: nombre,
              correo: correo,
              telefono: telefono,
              detalle: detalle
            }
          : item
      );

      setListaClientes(nuevoArray);
      setModoEdicion(false);
      setNombre('');
      setCorreo('');
      setTelefono('');
      setDetalle('');
    } catch (error) {
      console.log(error);
    }
  };

  const cancelar = () => {
    setModoEdicion(false);
    setNombre('');
    setCorreo('');
    setTelefono('');
    setDetalle('');
  };

  const guardarClientes = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    try {
      const data = await addDoc(collection(db, 'clientes'), {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        detalle: detalle
      });
      setListaClientes([
        ...listaClientes,
        {
          id: data.id,
          nombre: nombre,
          correo: correo,
          telefono: telefono,
          detalle: detalle
        }
      ]);
      setNombre('');
      setCorreo('');
      setTelefono('');
      setDetalle('');
    } catch (error) {
      console.log(error);
    }
  };

  const eliminar = async (id) => {
    try {
      await deleteDoc(doc(db, 'clientes', id));
    } catch (error) {
      console.log(error);
    }
  };

  const validarCampos = () => {
    setError(null);

    if (nombre.trim() === '' || correo.trim() === '' || telefono.trim() === '') {
      setError('Los campos de nombre, correo y teléfono no pueden estar vacíos.');
      return false;
    }

    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(correo)) {
      setError('Ingrese un correo válido.');
      return false;
    }

    if (!/^[0-9]+$/.test(telefono) || telefono.length < 8) {
      setError('Ingrese un número de teléfono válido.');
      return false;
    }

    return true;
  };

  return (
    <div>
      <button className="burger" onClick={toggleMenu}></button>
      <div className="menu closed">
        <nav>
          <h2>Menu de CRUDs</h2>
          <Link to="/" style={{ animationDelay: '0.2s' }}>
            <strong>Regresar</strong>
          </Link>
          <br />
          <h2>Otros CRUDs</h2>
          <Link to="/productos" style={{ animationDelay: '0.3s' }}>
            <strong>Productos</strong>
          </Link>
          <Link to="/tareas" style={{ animationDelay: '0.4s' }}>
            <strong>Tareas</strong>
          </Link>
          <Link to="/publicaciones" style={{ animationDelay: '0.5s' }}>
            <strong>Publicaciones</strong>
          </Link>
          <Link to="/empleados" style={{ animationDelay: '0.7s' }}>
            <strong>Empleados</strong>
          </Link>
        </nav>
      </div>

      <div className="container mt-5">
        <h1 className="text-center text-light">Clientes</h1>
        <hr />
        <div className="row">
          <div className="col-8">
            <h4 className="text-center text-light">Lista de Clientes</h4>
            <ul className="list-group">
              {listaClientes.map((item) => (
                <li className="list-group-item" key={item.id}>
                  <span className="lead">
                    Nombre: {item.nombre}
                    <br />
                    Correo: {item.correo}
                    <br />
                    Teléfono: {item.telefono}
                    <br />
                    Detalle: {item.detalle || 'No disponible'}
                    <br />
                  </span>
                  <button
                    className="btn btn-danger btn-sm float-end mx-2"
                    onClick={() => eliminar(item.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-dark btn-sm float-end"
                    onClick={() => editar(item)}
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-4">
            <h4 className="text-center text-light">
              {modoEdicion ? 'Editar Cliente' : 'Añadir Cliente'}
            </h4>
            <form onSubmit={modoEdicion ? editarClientes : guardarClientes}>
              <div className="input-group mb-3">
                <span className="input-group-text mb-2 material-symbols-outlined" id="basic-addon1">
                  person
                </span>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ingrese un nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text mb-2 material-symbols-outlined" id="basic-addon1">
                  mail
                </span>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ingrese un correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text mb-2 material-symbols-outlined" id="basic-addon1">
                  phone
                </span>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ingrese un teléfono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text mb-2 material-symbols-outlined" id="basic-addon1">
                  note
                </span>
                <textarea
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ingrese un detalle (opcional)"
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                />
              </div>
              <div className="d-grid gap-2">
                {modoEdicion ? (
                  <>
                    <button className="btn btn-dark col-12" type="submit">
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-block"
                      onClick={() => cancelar()}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button className="btn btn-dark btn-block">Agregar</button>
                )}
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
          role="dialog"
        >
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
  );
};

export default Clientes;
