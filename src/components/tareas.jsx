import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, addDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';

const Tareas = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  const [id, setId] = useState(0);
  const [listaTareas, setListaTareas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [fechavenc, setFechaVenc] = useState('');

  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, 'tareas'), (query) => {
          setListaTareas(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatos();
  }, []);

  const validarCampos = () => {
    setError(null);

    if (titulo.trim() === '' || descripcion.trim() === '') {
      setError('Los campos de título y/o descripción no pueden estar vacíos.');
      return false;
    }

    if (fechavenc.trim() === '' || !/^\d{4}-\d{2}-\d{2}$/.test(fechavenc)) {
      setError('La fecha no debe estar vacia y debe tener el formato YYYY-MM-DD.');
      return false;
    }
    return true;
  };

  const editar = (item) => {
    setTitulo(item.titulo);
    setDescripcion(item.descripcion);
    setEstado(item.estado);
    setFechaVenc(item.fechavenc);
    setId(item.id);
    setModoEdicion(true);
  };

  const editarTareas = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    try {
      const docRef = doc(db, 'tareas', id);
      await updateDoc(docRef, {
        titulo: titulo,
        descripcion: descripcion,
        estado: estado,
        fechavenc: fechavenc,
      });

      const nuevoArray = listaTareas.map((item) =>
        item.id === id
          ? {
            id: id,
            titulo: titulo,
            descripcion: descripcion,
            estado: estado,
            fechavenc: fechavenc,
          }
          : item
      );

      setListaTareas(nuevoArray);
      setModoEdicion(false);
      setTitulo('');
      setDescripcion('');
      setEstado('Pendiente');
      setFechaVenc('');
      setId('');
    } catch (error) {
      console.log(error);
    }
  };

  const cancelar = () => {
    setModoEdicion(false);
    setTitulo('');
    setDescripcion('');
    setEstado('Pendiente');
    setFechaVenc('');
  };

  const guardarTareas = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    try {
      const data = await addDoc(collection(db, 'tareas'), {
        titulo: titulo,
        descripcion: descripcion,
        estado: estado,
        fechavenc: fechavenc,
      });
      setListaTareas([
        ...listaTareas,
        {
          id: data.id,
          titulo: titulo,
          descripcion: descripcion,
          estado: estado,
          fechavenc: fechavenc,
        },
      ]);
      setTitulo('');
      setDescripcion('');
      setEstado('Pendiente');
      setFechaVenc('');
    } catch (error) {
      console.log(error);
    }
  };

  const eliminar = async (id) => {
    try {
      await deleteDoc(doc(db, 'tareas', id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="burger" onClick={toggleMenu}></button>
      <div className="menu closed">
        <nav>
          <h2>Menu de CRUDs</h2>
          <Link to="/" style={{ animationDelay: "0.2s" }}>
            <strong>Regresar</strong>
          </Link>
          <br />
          <h2>Otros CRUDs</h2>
          <Link to="/productos" style={{ animationDelay: "0.3s" }}>
            <strong>Productos</strong>
          </Link>
          <Link to="/clientes" style={{ animationDelay: "0.4s" }}>
            <strong>Clientes</strong>
          </Link>
          <Link to="/publicaciones" style={{ animationDelay: "0.5s" }}>
            <strong>Publicaciones</strong>
          </Link>
          <Link to="/empleados" style={{ animationDelay: "0.7s" }}>
            <strong>Empleados</strong>
          </Link>
        </nav>
      </div>

      <div className="container mt-5">
        <h1 className="text-center text-light">Tareas</h1>
        <hr />
        <div className="row">
          <div className="col-8">
            <h4 className="text-center text-light">Lista de Tareas</h4>
            <ul className="list-group">
              {listaTareas.map((item) => (
                <li className="list-group-item" key={item.id}>
                  <span className="lead">
                    Titulo: {item.titulo}
                    <br />
                    Descripción: {item.descripcion}
                    <br />
                    Estado: {item.estado}
                    <br />
                    Fecha Vencimiento: {item.fechavenc}
                    <br />
                  </span>
                  <button
                    className="btn btn-danger btn-sm fload-end mx-2"
                    onClick={() => eliminar(item.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-dark btn-sm fload-end"
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
              {modoEdicion ? 'Editar Tarea' : 'Añadir Tarea'}
            </h4>
            <form onSubmit={modoEdicion ? editarTareas : guardarTareas}>
              <div class="input-group mb-3">
                <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> title </span>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ingrese un titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> article </span>
                <textarea
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ingrese un descipcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
              <div class="input-group mb-3">
              <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> view_cozy </span>
                <select
                  className="form-control mb-2"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Completada">Completada</option>
                  <option value="Retrasada">Retrasada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="En Revisión">En Revisión</option>
                </select>
              </div>
              <div class="input-group mb-3">
              <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> event_busy </span>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Ingrese fecha limite (YYYY-MM-DD)"
                value={fechavenc}
                onChange={(e) => setFechaVenc(e.target.value)}
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
                  <button className="btn btn-dark btn-block" type="submit">
                    Agregar
                  </button>
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
  );
};

export default Tareas;