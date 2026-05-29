function Navbar({ onSelect, seccionActiva }) {
  const items = [
    { id: "usuarios",       label: "Usuarios" },
    { id: "productos",      label: "Productos" },
    { id: "configuracion",  label: "Configuración" },
  ];

  return (
    <nav className="rounded-xl w-[250px] min-h-[880px] bg-teal-600 text-white sticky top-0 p-4 m-4">
      <h2 className="text-xl font-bold mb-8">Despacho Dashboard</h2>

      <ul className="space-y-3">
        {items.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => onSelect(id)}
              style={{ fontFamily: "'Orbitron', sans-serif" }}
              className={`block w-full text-left font-bold py-2 px-3 rounded transition-colors duration-200 ${
                seccionActiva === id
                  ? "bg-teal-800"
                  : "hover:bg-teal-700"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
