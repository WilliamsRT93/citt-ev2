import { useState } from "react";
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
import Reviews from "./Layouts/Reviews";
import { TableCompras } from "./CrudAdmin/TableCompras";
import { TableDespachos } from "./CrudAdmin/TableDespachos";

export const CrudAdmin = () => {
  const [seccion, setSeccion] = useState("usuarios");

  const renderContenido = () => {
    switch (seccion) {
      case "usuarios":
        return (
          <div>
            <h2 className="text-2xl font-bold text-teal-700 mb-6">Gestión de Usuarios</h2>
            <p className="text-gray-500 mb-6">
              Selecciona una sección del menú para gestionar órdenes de compra o despachos.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setSeccion("productos")}
                className="cursor-pointer p-6 bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-bold text-teal-600 mb-2">Órdenes de Compra 💰</h3>
                <p className="text-gray-500 text-sm">
                  Revisa las órdenes de compra y genera despachos para cada una.
                </p>
              </div>
              <div
                onClick={() => setSeccion("configuracion")}
                className="cursor-pointer p-6 bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-bold text-teal-600 mb-2">Órdenes de Despacho 🚚</h3>
                <p className="text-gray-500 text-sm">
                  Administra los despachos activos, edita intentos de entrega o ciérralos.
                </p>
              </div>
            </div>
            <Reviews />
          </div>
        );

      case "productos":
        return (
          <div>
            <h2 className="text-2xl font-bold text-teal-700 mb-6">Órdenes de Compra</h2>
            <p className="text-gray-500 mb-4">
              Listado de compras pendientes de despacho. Haz clic en <strong>Generar Despacho</strong> para asignar un camión.
            </p>
            <TableCompras />
          </div>
        );

      case "configuracion":
        return (
          <div>
            <h2 className="text-2xl font-bold text-teal-700 mb-6">Órdenes de Despacho</h2>
            <p className="text-gray-500 mb-4">
              Listado de despachos registrados. Haz clic en <strong>Cerrar despacho</strong> para actualizar el estado.
            </p>
            <TableDespachos />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen bg-red-600">
      <div className="col-span-1">
        <Navbar onSelect={setSeccion} seccionActiva={seccion} />
      </div>

      <div className="overflow-y-auto p-6 bg-white">
        {renderContenido()}
        <Footer />
      </div>
    </div>
  );
};
