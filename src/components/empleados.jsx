import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, addDoc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';

const Empleados = () => {
  const toggleMenu = () => {
    document.body.classList.toggle("open");
  };

  const [id, setId] = useState(0);
  const [listaEmpleados, setListaEmpleados] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [fechacontra, setFechaContra] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, 'empleados'), (query) => {
          setListaEmpleados(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatos();
  }, []);

  const cargosPorDepartamento = {
    'Recursos Humanos': [
      'Gerente de Recursos Humanos',
      'Especialista en reclutamiento y selección',
      'Analista de compensación y beneficios',
    ],
    Finanzas: [
      'Director Financiero',
      'Contador Senior',
      'Analista de Finanzas',
    ],
    Ventas: [
      'Director de Ventas',
      'Representante de Ventas',
      'Coordinador de Ventas',
    ],
  };

  const handleDepartamentoChange = (e) => {
    setDepartamento(e.target.value);
    setCargo('');
  };

  const validarCampos = () => {
    setError(null);

    if (nombre.trim() === '') {
      setError('Ingrese un nombre');
      return false;
    }

    if (departamento.trim() === '') {
      setError('Seleccione un departamento');
      return false;
    }

    if (cargo.trim() === '') {
      setError('Seleccione un cargo segun su departamento');
      return false;
    }

    if (fechacontra.trim() === '') {
      setError('Agregue una fecha de contratación');
      return false;
    }

    if (correo.trim() === '') {
      setError('Agregue un correo');
      return false;
    }

    if (telefono.trim() === '') {
      setError('Agregue un telefono');
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

    if (fechacontra.trim() === '') {
      setError('Agregue la fecha de contratacción');
      return false;
    }

    return true;
  };

  const editar = (item) => {
    setNombre(item.nombre);
    setCargo(item.cargo);
    setDepartamento(item.departamento);
    setFechaContra(item.fechacontra);
    setTelefono(item.telefono);
    setCorreo(item.correo);
    setId(item.id);
    setModoEdicion(true);
  };

  const editarEmpleados = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    try {
      const docRef = doc(db, 'empleados', id);
      await updateDoc(docRef, {
        nombre: nombre,
        cargo: cargo,
        departamento: departamento,
        fechacontra: fechacontra,
        correo: correo,
        telefono: telefono,
      });

      const nuevoArray = listaEmpleados.map((item) =>
        item.id === id
          ? {
            id: id,
            nombre: nombre,
            cargo: cargo,
            departamento: departamento,
            fechacontra: fechacontra,
            correo: correo,
            telefono: telefono,
          }
          : item
      );

      setListaEmpleados(nuevoArray);
      setModoEdicion(false);
      setNombre('');
      setCargo('');
      setDepartamento('');
      setFechaContra('');
      setTelefono('');
      setCorreo('');
      setId('');
    } catch (error) {
      console.log(error);
    }
  };

  const cancelar = () => {
    setModoEdicion(false);
    setNombre('');
    setCargo('');
    setDepartamento('');
    setFechaContra('');
    setTelefono('');
    setCorreo('');
  };

  const guardarEmpleados = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      return;
    }

    try {
      const data = await addDoc(collection(db, 'empleados'), {
        nombre: nombre,
        cargo: cargo,
        departamento: departamento,
        fechacontra: fechacontra,
        correo: correo,
        telefono: telefono,
      });
      setListaEmpleados([
        ...listaEmpleados,
        {
          id: data.id,
          nombre: nombre,
          cargo: cargo,
          departamento: departamento,
          fechacontra: fechacontra,
          correo: correo,
          telefono: telefono,
        },
      ]);
      setNombre('');
      setCargo('');
      setDepartamento('');
      setFechaContra('');
      setTelefono('');
      setCorreo('');
    } catch (error) {
      console.log(error);
    }
  };

  const eliminar = async (id) => {
    try {
      await deleteDoc(doc(db, 'empleados', id));
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
          <Link to="/" style={{ animationDelay: '0.2s' }}>
            <strong>Regresar</strong>
          </Link>
          <br />
          <h2>Otros CRUDs</h2>
          <Link to="/productos" style={{ animationDelay: '0.3s' }}>
            <strong>Productos</strong>
          </Link>
          <Link to="/clientes" style={{ animationDelay: '0.4s' }}>
            <strong>Clientes</strong>
          </Link>
          <Link to="/tareas" style={{ animationDelay: '0.5s' }}>
            <strong>Tareas</strong>
          </Link>
          <Link to="/Publicaciones" style={{ animationDelay: '0.7s' }}>
            <strong>Publicaciones</strong>
          </Link>
        </nav>
      </div>

      <div className="container mt-5">
        <h1 className="text-center text-light">Empleados</h1>
        <hr />
        <div className="row">
          <div className="col-8">
            <h4 className="text-center text-light">Lista de Empleados</h4>
            <ul className="list-group">
              {listaEmpleados.map((item) => (
                <li className="list-group-item" key={item.id}>
                  <span className="lead">
                    Nombre: {item.nombre}
                    <br />
                    Cargo: {item.cargo}
                    <br />
                    Departamento: {item.departamento}
                    <br />
                    Fecha de contratación: {item.fechacontra}
                    <br />
                    Correo: {item.correo}
                    <br />
                    Telefono: {item.telefono}
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
              {modoEdicion ? 'Editar Empleado' : 'Añadir Empleado'}
            </h4>
            <form onSubmit={modoEdicion ? editarEmpleados : guardarEmpleados}>
              <div class="input-group mb-3">
                <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> badge </span>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ingrese un nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> engineering </span>
                <select
                  className="form-control mb-2"
                  value={departamento}
                  onChange={handleDepartamentoChange}
                >
                  <option value="" disabled>Seleccionar departamento</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Ventas">Ventas</option>
                </select>
              </div>
              {departamento && (
                <div class="input-group mb-3">
                  <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> workspace_premium </span>
                  <select
                    className="form-control mb-2"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                  >
                    <option value="" disabled>Seleccionar cargo</option>
                    {cargosPorDepartamento[departamento].map((cargo) => (
                      <option key={cargo}>{cargo}</option>
                    ))}
                  </select>
                </div>
              )}
              <div class="input-group mb-3">
                <span class="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> calendar_month </span>
                <input
                  type="date"
                  className="form-control mb-2"
                  placeholder="Ingrese la fecha de contratación"
                  value={fechacontra}
                  onChange={(e) => setFechaContra(e.target.value)}
                />
              </div>
              <div class="input-group mb-3">
                <span className="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> mail </span>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ingrese un correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div class="input-group mb-3">
                <span className="input-group-text mb-2 material-symbols-outlined" id="basic-addon1"> phone </span>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Ingrese un telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="d-grid gap-2">
                {modoEdicion ? (
                  <>
                    <button className="btn btn-dark col-12" on="submit">
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
              </div>
              <div className="modal-body">
                <p>{error}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
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

export default Empleados;